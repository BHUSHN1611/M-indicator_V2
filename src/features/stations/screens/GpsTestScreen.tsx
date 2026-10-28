import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GPSObservation,
  LocationPermissionStatus,
  checkLocationPermission,
  requestLocationPermission,
  getCurrentLocation,
  watchLocation,
  findNearestStation,
  findCurrentSegment,
  NearestStationResult,
  RouteSegment,
} from "@/services/location";
import { colors } from "@/theme";

export function GpsTestScreen() {
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>("undetermined");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [location, setLocation] = useState<GPSObservation | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Check initial permission status on mount
  useEffect(() => {
    let isMounted = true;
    async function initCheck() {
      try {
        const { status } = await checkLocationPermission();
        if (isMounted) {
          setPermissionStatus(status);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to check permission");
        }
      } finally {
        if (isMounted) {
          setIsCheckingPermission(false);
        }
      }
    }
    initCheck();

    return () => {
      isMounted = false;
      // Clean up active location subscription when component unmounts
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const handleRequestPermission = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const granted = await requestLocationPermission();
      setPermissionStatus(granted ? "granted" : "denied");
      if (!granted) {
        setErrorMessage("Location permission was denied. Please allow location access in your system settings.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to request permission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleFix = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const fix = await getCurrentLocation();
      setLocation(fix);
      setUpdateCount((c) => c + 1);
      setLastUpdateTime(new Date(fix.timestamp));
      setPermissionStatus("granted");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to obtain GPS fix");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStreaming = useCallback(async () => {
    if (isStreaming) {
      // Stop streaming
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setIsStreaming(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Prevent duplicate subscriptions
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      const unsubscribe = await watchLocation(
        (obs) => {
          setLocation(obs);
          setUpdateCount((c) => c + 1);
          setLastUpdateTime(new Date(obs.timestamp));
          setErrorMessage(null);
        },
        (err) => {
          setErrorMessage(err.message);
          setIsStreaming(false);
        }
      );

      unsubscribeRef.current = unsubscribe;
      setIsStreaming(true);
      setPermissionStatus("granted");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to start GPS subscription");
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  }, [isStreaming]);

  // Derived geographical calculations
  let nearestStation: NearestStationResult | null = null;
  let currentSegment: RouteSegment | null = null;

  if (location) {
    try {
      nearestStation = findNearestStation(location.latitude, location.longitude);
    } catch {
      nearestStation = null;
    }

    try {
      currentSegment = findCurrentSegment(location.latitude, location.longitude);
    } catch {
      currentSegment = null;
    }
  }

  // Format accuracy rating
  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy <= 15) return { label: "EXCELLENT", color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" };
    if (accuracy <= 40) return { label: "MODERATE", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" };
    return { label: "POOR", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ivory} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerEyebrow}>DEVICE HARDWARE</Text>
          <Text style={styles.headerTitle}>GPS DIAGNOSTICS</Text>
        </View>
        <View style={[styles.statusPill, isStreaming ? styles.statusPillLive : styles.statusPillIdle]}>
          <View style={[styles.statusDot, isStreaming ? styles.statusDotLive : styles.statusDotIdle]} />
          <Text style={[styles.statusText, isStreaming ? styles.statusTextLive : styles.statusTextIdle]}>
            {isStreaming ? "STREAMING" : "IDLE"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Permission Banner */}
        {permissionStatus !== "granted" && !isCheckingPermission && (
          <View style={styles.warningCard}>
            <Ionicons name="warning-outline" size={24} color="#f59e0b" />
            <View style={styles.warningTextWrap}>
              <Text style={styles.warningTitle}>Location Permission Required</Text>
              <Text style={styles.warningDescription}>
                Foreground location permission is {permissionStatus}. Please grant access to test device GPS tracking.
              </Text>
            </View>
            <Pressable
              onPress={handleRequestPermission}
              style={styles.grantButton}
              disabled={isLoading}
            >
              <Text style={styles.grantButtonText}>Grant</Text>
            </Pressable>
          </View>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlRow}>
          <Pressable
            onPress={handleSingleFix}
            disabled={isLoading || isStreaming}
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              (isLoading || isStreaming) && styles.disabledButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="locate-outline" size={18} color={colors.ivory} />
            <Text style={styles.secondaryButtonText}>Single Fix</Text>
          </Pressable>

          <Pressable
            onPress={handleToggleStreaming}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.actionButton,
              isStreaming ? styles.stopButton : styles.primaryButton,
              isLoading && styles.disabledButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isStreaming ? "stop-circle-outline" : "play-circle-outline"}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.primaryButtonText}>
                  {isStreaming ? "Stop GPS Stream" : "Start GPS Stream"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Live GPS Telemetry Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="crosshairs-gps" size={18} color={colors.brass} />
            <Text style={styles.cardTitle}>CURRENT GPS FIX</Text>
            {location && (
              <View
                style={[
                  styles.accuracyBadge,
                  { backgroundColor: getAccuracyBadge(location.accuracy).bg },
                ]}
              >
                <Text
                  style={[
                    styles.accuracyBadgeText,
                    { color: getAccuracyBadge(location.accuracy).color },
                  ]}
                >
                  ±{location.accuracy.toFixed(1)}m ({getAccuracyBadge(location.accuracy).label})
                </Text>
              </View>
            )}
          </View>

          {location ? (
            <View style={styles.dataGrid}>
              <View style={styles.dataRow}>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>LATITUDE</Text>
                  <Text style={styles.dataValueMono}>{location.latitude.toFixed(6)}°</Text>
                </View>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>LONGITUDE</Text>
                  <Text style={styles.dataValueMono}>{location.longitude.toFixed(6)}°</Text>
                </View>
              </View>

              <View style={styles.dataDivider} />

              <View style={styles.dataRow}>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>SPEED</Text>
                  <Text style={styles.dataValue}>
                    {location.speed !== null && location.speed > 0
                      ? `${(location.speed * 3.6).toFixed(1)} km/h`
                      : "0.0 km/h (Stationary)"}
                  </Text>
                </View>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>HEADING / BEARING</Text>
                  <Text style={styles.dataValue}>
                    {location.heading !== null && location.heading >= 0
                      ? `${location.heading.toFixed(0)}°`
                      : "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.dataDivider} />

              <View style={styles.dataRow}>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>LAST FIX TIME</Text>
                  <Text style={styles.dataValue}>
                    {lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : "N/A"}
                  </Text>
                </View>
                <View style={styles.dataCol}>
                  <Text style={styles.dataLabel}>UPDATES RECEIVED</Text>
                  <Text style={styles.dataValue}>{updateCount} fixes</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="satellite-variant" size={40} color="#475569" />
              <Text style={styles.emptyStateText}>No GPS fixes recorded yet</Text>
              <Text style={styles.emptyStateSubtext}>
                {'Tap "Single Fix" or "Start GPS Stream" above to query your device sensor.'}
              </Text>
            </View>
          )}
        </View>

        {/* Railway Corridor Proximity Card */}
        {location && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trail-sign-outline" size={18} color={colors.brass} />
              <Text style={styles.cardTitle}>VIRAR–DAHANU RAILWAY MATCHING</Text>
            </View>

            {/* Nearest Station */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Nearest Station</Text>
              {nearestStation ? (
                <View style={styles.stationResultRow}>
                  <View style={styles.stationBadge}>
                    <Text style={styles.stationBadgeCode}>{nearestStation.station.code}</Text>
                  </View>
                  <View style={styles.stationInfoWrap}>
                    <Text style={styles.stationName}>{nearestStation.station.name}</Text>
                    <Text style={styles.stationDistance}>
                      Distance:{" "}
                      {nearestStation.distanceMeters < 1000
                        ? `${Math.round(nearestStation.distanceMeters)} meters`
                        : `${(nearestStation.distanceMeters / 1000).toFixed(2)} km`}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.naText}>Calculating station proximity…</Text>
              )}
            </View>

            <View style={styles.dataDivider} />

            {/* Current Route Segment */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Corridor Segment & Track Offset</Text>
              {currentSegment ? (
                <View style={styles.segmentWrap}>
                  <View style={styles.segmentRow}>
                    <Text style={styles.segmentFromTo}>
                      {currentSegment.from.name} ({currentSegment.from.code}) → {currentSegment.to.name} ({currentSegment.to.code})
                    </Text>
                    <Text style={styles.segmentRatio}>
                      {(currentSegment.ratio * 100).toFixed(0)}% traversed
                    </Text>
                  </View>
                  <View style={styles.trackOffsetRow}>
                    <Text style={styles.trackOffsetLabel}>Offset from track line:</Text>
                    <Text
                      style={[
                        styles.trackOffsetValue,
                        {
                          color:
                            currentSegment.distanceFromRoute <= 100
                              ? "#22c55e"
                              : currentSegment.distanceFromRoute <= 300
                              ? "#eab308"
                              : "#ef4444",
                        },
                      ]}
                    >
                      {Math.round(currentSegment.distanceFromRoute)}m{" "}
                      {currentSegment.distanceFromRoute <= 100
                        ? "(On Track)"
                        : currentSegment.distanceFromRoute <= 300
                        ? "(Near Corridor)"
                        : "(Off Corridor)"}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.naText}>Could not determine corridor segment.</Text>
              )}
            </View>
          </View>
        )}

        {/* Verification Tips Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.brass} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Field Test Instructions</Text>
            <Text style={styles.infoDescription}>
              • Emulators report simulated GPS (often 0,0 or Mountain View).{"\n"}
              • On a physical Android device, ensure Location / GPS is toggled ON.{"\n"}
              • Subscriptions are strictly foreground-only and terminate immediately when stopped or when navigating away.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default GpsTestScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.navyDeep,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNavy,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.brass,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ivory,
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusPillIdle: {
    backgroundColor: "rgba(148, 163, 184, 0.15)",
  },
  statusPillLive: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotIdle: {
    backgroundColor: "#94a3b8",
  },
  statusDotLive: {
    backgroundColor: "#22c55e",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  statusTextIdle: {
    color: "#94a3b8",
  },
  statusTextLive: {
    color: "#22c55e",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  warningTextWrap: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f59e0b",
  },
  warningDescription: {
    fontSize: 11,
    color: "#d1d5db",
    marginTop: 2,
    lineHeight: 15,
  },
  grantButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  grantButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#fca5a5",
    lineHeight: 16,
  },
  controlRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.crimson,
  },
  stopButton: {
    backgroundColor: "#b91c1c",
  },
  secondaryButton: {
    backgroundColor: colors.navyPanel,
    borderWidth: 1,
    borderColor: colors.borderNavy,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ivory,
  },
  card: {
    backgroundColor: colors.navyPanel,
    borderWidth: 1,
    borderColor: colors.borderNavy,
    borderRadius: 14,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.ivory,
    letterSpacing: 1.1,
    flex: 1,
  },
  accuracyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  accuracyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  dataGrid: {
    gap: 10,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataCol: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ivory,
  },
  dataValueMono: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "monospace",
  },
  dataDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#cbd5e1",
  },
  emptyStateSubtext: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 16,
  },
  subSection: {
    gap: 6,
    marginVertical: 4,
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.brass,
    letterSpacing: 0.5,
  },
  stationResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  stationBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  stationBadgeCode: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.brass,
  },
  stationInfoWrap: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ivory,
  },
  stationDistance: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  segmentWrap: {
    gap: 4,
    marginTop: 2,
  },
  segmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  segmentFromTo: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ivory,
  },
  segmentRatio: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.brass,
  },
  trackOffsetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trackOffsetLabel: {
    fontSize: 11,
    color: "#94a3b8",
  },
  trackOffsetValue: {
    fontSize: 11,
    fontWeight: "700",
  },
  naText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.brass,
  },
  infoDescription: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
    lineHeight: 16,
  },
});
