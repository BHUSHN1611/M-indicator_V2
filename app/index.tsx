// import { StyleSheet,Text, View} from "react-native";
// import { Link } from "expo-router";

// const styles = StyleSheet.create({
//   button:{
//     padding:10,
//     borderWidth: 2,          // Line thickness
//     borderColor: '#0020d4',  // Line color
//     borderStyle: 'solid',    // 'solid', 'dashed', or 'dotted'
//     borderRadius: 8,         // Rounded corners
//     backgroundColor: 'blue',
//     color:"white",
//     fontSize:15
//   }
// });

// export default function Index() {
//   return (
//     <View className="flex-1 justify-center items-center">
//       <Text className="text-blue-600 text-2xl font-bold">Rail Tracker</Text>
//       <Link style={styles.button}
//       href ="/TrainShedulepage">
//         <Text>
//           Virar-to-dahanu Trains
//         </Text>
//       </Link>

//     </View>
//   );
// }

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens ──────────────────────────────────────────────────────────
// Palette pulled from the signal lamps & brass fittings of a station platform,
// not a generic "dark mode" default.
const colors = {
  navyDeep: "#0B1730", // background base
  navyPanel: "#132443", // card / panel surface
  navyPanelAlt: "#1B2E52", // secondary surface (inputs)
  crimson: "#B4293A", // signal red — primary accent
  crimsonDeep: "#7E1C2A", // shadow end of red gradient
  brass: "#D6A75C", // brass rail-fitting gold — secondary accent
  ivory: "#F3EFE6", // primary text on dark
  slate: "#8A97B5", // muted secondary text
  hairline: "rgba(214,167,92,0.18)", // brass hairline divider
};

const RECENT_SEARCHES = [
  { id: "1", from: "Virar", to: "Dahanu", date: "05 Jul 2026" },
  { id: "2", from: "Virar", to: "Boisar", date: "04 Jul 2026" },
  { id: "3", from: "Virar", to: "Palghar", date: "03 Jul 2026" },
];

const TABS = [
  { id: "search", label: "Search\nTrain", icon: "train", lib: "MCI" },
  {
    id: "schedule",
    label: "Train\nSchedule",
    icon: "calendar-outline",
    lib: "ION",
  },
  { id: "live", label: "Live\nStation", icon: "timer-outline", lib: "ION" },
  { id: "map", label: "Map", icon: "map-outline", lib: "ION" },
];

function TabIcon({
  lib,
  name,
  size,
  color,
}: {
  lib: string;
  name: any;
  size: number;
  color: string;
}) {
  return lib === "MCI" ? (
    <MaterialCommunityIcons name={name} size={size} color={color} />
  ) : (
    <Ionicons name={name} size={size} color={color} />
  );
}

export default function RailTrackerHome() {
  const [activeTab, setActiveTab] = useState("search");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [swapDirection, setSwapDirection] = useState(0);
  const swapRotation = useRef(new Animated.Value(0)).current;

  // Function to get greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning, Commuter";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon, Commuter";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening, Commuter";
    } else {
      return "Welcome, Commuter";
    }
  };

  const handleTabPress = (tabId: string) => {
    if (tabId === "schedule") {
      setActiveTab("search");
      router.push("/TrainShedulepage");
      return;
    }

    setActiveTab(tabId);
  };

  const handleSwap = () => {
    const nextDirection = swapDirection === 0 ? 1 : 0;
    setSwapDirection(nextDirection);

    Animated.timing(swapRotation, {
      toValue: nextDirection,
      duration: 320,
      useNativeDriver: true,
    }).start();
    const tmp = fromStation;
    setFromStation(toStation);
    setToStation(tmp);
  };

  const spin = swapRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* ── Header ───────────────────────────────────────────── */}
        <LinearGradient
          colors={[colors.navyDeep, colors.navyPanel, colors.crimsonDeep]}
          locations={[0, 0.45, 1.4]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.eyebrow}>ON TRACK · ON TIME</Text>
              <Text style={styles.title}>RAIL TRACKER</Text>
              <Text style={styles.greeting}>{getGreeting()}</Text>
            </View>
            <View style={styles.bellWrap}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.ivory}
              />
              <View style={styles.bellDot} />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {TABS.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => handleTabPress(tab.id)}
                  style={({ pressed }) => [
                    styles.tabItem,
                    active && styles.tabItemActive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <View
                    style={[
                      styles.tabIconWrap,
                      active && styles.tabIconWrapActive,
                    ]}
                  >
                    <TabIcon
                      lib={tab.lib}
                      name={tab.icon}
                      size={20}
                      color={active ? colors.navyDeep : colors.ivory}
                    />
                  </View>
                  <Text
                    style={[styles.tabLabel, active && styles.tabLabelActive]}
                    numberOfLines={2}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── From / To journey card ──────────────────────────── */}
          <View style={styles.journeyCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FROM</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputIconDot}>
                  <Ionicons
                    name="radio-button-on"
                    size={14}
                    color={colors.brass}
                  />
                </View>
                <TextInput
                  value={fromStation}
                  onChangeText={setFromStation}
                  placeholder="Enter origin station…"
                  placeholderTextColor={colors.slate}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Swap control sits on the seam between the two fields */}
            <View style={styles.swapSeam}>
              <View style={styles.seamLine} />
              <Pressable onPress={handleSwap} style={styles.swapButton}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons
                    name="swap-vertical"
                    size={18}
                    color={colors.ivory}
                  />
                </Animated.View>
              </Pressable>
              <View style={styles.seamLine} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TO</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputIconDot}>
                  <Ionicons name="flag" size={14} color={colors.crimson} />
                </View>
                <TextInput
                  value={toStation}
                  onChangeText={setToStation}
                  placeholder="Enter destination station…"
                  placeholderTextColor={colors.slate}
                  style={styles.input}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.searchCta,
                pressed && { opacity: 0.9 },
              ]}
            >
              <LinearGradient
                colors={[colors.crimson, colors.crimsonDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchCtaGradient}
              >
                <Ionicons name="search" size={16} color={colors.ivory} />
                <Text style={styles.searchCtaText}>Find Trains</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* ── Quick recent searches ───────────────────────────── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>QUICK RECENT SEARCHES</Text>
            <View style={styles.sectionRule} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 20,
              paddingRight: 8,
              gap: 12,
            }}
          >
            {RECENT_SEARCHES.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.recentCard,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.recentIconWrap}>
                  <MaterialCommunityIcons
                    name="train"
                    size={18}
                    color={colors.brass}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentRoute} numberOfLines={1}>
                    {item.from} <Text style={{ color: colors.slate }}>→</Text>{" "}
                    {item.to}
                  </Text>
                  <Text style={styles.recentDate}>
                    Last searched {item.date}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navyDeep },
  body: { flex: 1, backgroundColor: colors.navyDeep },

  header: {
    paddingTop: 8,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  eyebrow: {
    color: colors.brass,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginBottom: 4,
  },
  title: {
    color: colors.ivory,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  greeting: {
    color: colors.slate,
    fontSize: 13,
    marginTop: 4,
  },
  bellWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.brass,
    borderWidth: 1,
    borderColor: colors.navyDeep,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  tabIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  tabIconWrapActive: {
    backgroundColor: colors.brass,
  },
  tabLabel: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  tabLabelActive: {
    color: colors.ivory,
  },

  journeyCard: {
    marginTop: 22,
    marginHorizontal: 20,
    backgroundColor: colors.navyPanel,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  fieldGroup: { marginBottom: 2 },
  fieldLabel: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.navyPanelAlt,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIconDot: {
    width: 22,
    alignItems: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.ivory,
    fontSize: 15,
  },

  swapSeam: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  seamLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.hairline,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.crimson,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: colors.crimson,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  searchCta: {
    marginTop: 18,
    borderRadius: 14,
    overflow: "hidden",
  },
  searchCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 8,
  },
  searchCtaText: {
    color: colors.ivory,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  sectionHeaderRow: {
    marginTop: 28,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: colors.ivory,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  sectionRule: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.brass,
  },

  recentCard: {
    width: 210,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.navyPanel,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.navyPanelAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  recentRoute: {
    color: colors.ivory,
    fontSize: 14,
    fontWeight: "700",
  },
  recentDate: {
    color: colors.slate,
    fontSize: 11,
    marginTop: 2,
  },
});
