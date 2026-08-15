import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Router } from "expo-router";
import {
  Animated,
  Pressable,
  ScrollView,
  StatusBar,

  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { styles } from "@/theme_styles";
import {AllstopsData} from "@/constants/Stationdata[Virar-Dahanu]"

// ─── Design tokens ──────────────────────────────────────────────────────────
// Palette pulled from the signal lamps & brass fittings of a station platform,
// not a generic "dark mode" default.

function getTrainList(source:string,destination:string){
  const AllStops = AllstopsData

  for (let index = 0; index < AllStops.length; index++) {
    if(AllStops[index]['Station']===source && AllStops[index]["Can_go"].includes(destination)){
      router.push("/AllTrainListScreen")
    } 
  }
  console.log("Error",source,destination)
}
const RECENT_SEARCHES = [
  { id: "1", from: "Virar", to: "Dahanu", date: "05 Jul 2026" },
  { id: "2", from: "Virar", to: "Boisar", date: "04 Jul 2026" },
  { id: "3", from: "Virar", to: "Palghar", date: "03 Jul 2026" },
];

const TABS = [
  { id: "search", label: "Search\nTrain", icon: "train", lib: "MCI" },
  { id: "schedule",label: "Train\nSchedule", icon: "calendar-outline",lib: "ION",},
  { id: "live", label: "Live\nStation", icon: "timer-outline", lib: "ION" },
  { id: "map", label: "Map", icon: "map-outline", lib: "ION" },
];

function TabIcon({lib,name,size,color,}: {lib: string;name: any;size: number;color: string;}) {
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
      // setActiveTab("search");
      router.push("/AllTrainListScreen");
      return;
    }
    if(tabId === "live"){
      router.push("/gps-test");
      return;
    }
    setActiveTab(tabId);
  };

  // const handleSwap = () => {
  //   const nextDirection = swapDirection === 0 ? 1 : 0;
  //   setSwapDirection(nextDirection);

  //   Animated.timing(swapRotation, {
  //     toValue: nextDirection,
  //     duration: 320,
  //     useNativeDriver: true,
  //   }).start();
  //   const tmp = fromStation;
  //   setFromStation(toStation);
  //   setToStation(tmp);
  // };

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
            {/* For sometime we stops the swap functionality*/}
            {/* <View style={styles.swapSeam}>
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
            </View> */}

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
              onPress={()=>getTrainList(fromStation.toLocaleUpperCase().trim(),toStation.toLocaleUpperCase().trim())}
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

