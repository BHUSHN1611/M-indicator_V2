import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { getCurrentLocation, GPSObservation, findCurrentSegment } from "@/services/location";
import { strings } from "@/i18n";

export function GpsTestScreen() {
  const [location, setLocation] = useState<GPSObservation | null>(null);
  const [error, setError] = useState("");

  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const getLocation = async () => {
    try {
      setError("");
      const result = await getCurrentLocation();
      setLocation(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : strings.gps.unableToGetLocation
      );
    }
  };

  const segment = latitude !== undefined && longitude !== undefined
    ? findCurrentSegment(Number(latitude), Number(longitude))
    : null;

  if (segment) {
    console.log(segment);
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", backgroundColor: "white" }}>
      <Button title={strings.gps.getGpsLocation} onPress={getLocation} />

      {location && (
        <View style={{ marginTop: 20 }}>
          <Text>{strings.gps.latitude}: {location.latitude}</Text>
          <Text>{strings.gps.longitude}: {location.longitude}</Text>
          <Text>{strings.gps.accuracy}: {location.accuracy} m</Text>
          <Text>{strings.gps.speed}: {location.speed ?? strings.gps.notAvailable}</Text>
          <Text>{strings.gps.heading}: {location.heading ?? strings.gps.notAvailable}</Text>
        </View>
      )}

      {error !== "" && (
        <Text style={{ marginTop: 20, color: "red" }}>
          Error: {error}
        </Text>
      )}
    </View>
  );
}

export default GpsTestScreen;
