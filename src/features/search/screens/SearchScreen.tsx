import React, { useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { styles } from "@/theme";
import { RECENT_SEARCHES_MOCK } from "@/constants";
import { stationRepository } from "@/services/data";
import { AllstopsData } from "@assets/data/stations/stationStopsLegacy";
import { SearchHeader } from "../components/SearchHeader";
import { JourneyCard } from "../components/JourneyCard";
import { RecentSearches } from "../components/RecentSearches";
import { RecentSearchItem } from "../types";

export function SearchScreen() {
  const [activeTab, setActiveTab] = useState("search");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");

  const navigateToTrainList = (source: string, destination: string) => {
    const formattedSource = source.toLocaleUpperCase().trim();
    const formattedDestination = destination.toLocaleUpperCase().trim();

    const from = stationRepository.findByName(formattedSource);
    const to = stationRepository.findByName(formattedDestination);

    if (from && to) {
      router.push({
        pathname: "/AllTrainListScreen",
        params: { from: from.name, to: to.name },
      });
      return;
    }

    const allStops = AllstopsData;
    for (let index = 0; index < allStops.length; index++) {
      if (allStops[index]["Station"] === formattedSource && allStops[index]["Can_go"].includes(formattedDestination)) {
        router.push({
          pathname: "/AllTrainListScreen",
          params: { from: formattedSource, to: formattedDestination },
        });
        return;
      }
    }
    router.push("/AllTrainListScreen");
  };

  const handleTabPress = (tabId: string) => {
    if (tabId === "schedule") {
      router.push("/AllTrainListScreen");
      return;
    }
    if (tabId === "live") {
      router.push("/gps-test");
      return;
    }
    setActiveTab(tabId);
  };

  const handleSwapStations = () => {
    const tmp = fromStation;
    setFromStation(toStation);
    setToStation(tmp);
  };

  const handleSelectRecentSearch = (item: RecentSearchItem) => {
    setFromStation(item.from);
    setToStation(item.to);
    navigateToTrainList(item.from, item.to);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <SearchHeader activeTab={activeTab} onTabPress={handleTabPress} />

        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <JourneyCard
            fromStation={fromStation}
            toStation={toStation}
            onChangeFromStation={setFromStation}
            onChangeToStation={setToStation}
            onSwapStations={handleSwapStations}
            onSearch={() => navigateToTrainList(fromStation, toStation)}
          />

          <RecentSearches
            searches={RECENT_SEARCHES_MOCK}
            onSelectSearch={handleSelectRecentSearch}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default SearchScreen;
