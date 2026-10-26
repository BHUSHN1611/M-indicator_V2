import React, { useState, useMemo } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import TrainCard from "../components/TrainCard";
import TrainFilter from "../components/TrainFilter";
import { FilterCategory, TrainListItemData } from "../types";
import { trainRepository, stationRepository } from "@/services/data";
import { colors } from "@/theme";
import { strings } from "@/i18n";
import { APP_CONFIG } from "@/constants";

export interface TrainListScreenProps {
  initialFilter?: FilterCategory;
}

export const TrainListScreen: React.FC<TrainListScreenProps> = ({ initialFilter }) => {
  const params = useLocalSearchParams<{ from?: string; to?: string; filter?: string }>();

  const paramFilter = (params.filter?.toUpperCase() as FilterCategory) || undefined;
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>(
    initialFilter ?? paramFilter ?? "ALL"
  );

  const fromStation = useMemo(
    () => (params.from ? stationRepository.findByName(params.from) : undefined),
    [params.from]
  );
  const toStation = useMemo(
    () => (params.to ? stationRepository.findByName(params.to) : undefined),
    [params.to]
  );

  // Retrieve base trains: either directional between stations or all trains
  const baseTrains = useMemo(() => {
    if (fromStation && toStation) {
      return trainRepository.findTrainsBetween(fromStation.id, toStation.id);
    }
    return trainRepository.getAll();
  }, [fromStation, toStation]);

  // Apply service filter (FAST / SLOW / ALL)
  const filteredTrains = useMemo(() => {
    if (selectedFilter === "FAST") {
      return baseTrains.filter((t) => t.trainType === "FAST");
    }
    if (selectedFilter === "SLOW") {
      return baseTrains.filter((t) => t.trainType === "SLOW");
    }
    return baseTrains;
  }, [baseTrains, selectedFilter]);

  // Format into list item data
  const listData: TrainListItemData[] = useMemo(() => {
    return filteredTrains.map((t) => {
      let departureTime = t.departureTime;
      let departurePeriod = t.departurePeriod ?? "AM";
      let destinationName = t.stops[t.stops.length - 1]?.stationId
        ? (stationRepository.getById(t.stops[t.stops.length - 1].stationId)?.name ?? "DAHANU ROAD")
        : "DAHANU ROAD";
      let platform: string | number = APP_CONFIG.defaultPlatform;

      // If specific source station is requested, show departure time from that station
      if (fromStation) {
        const fromStop = t.stops.find((s) => s.stationId === fromStation.id);
        if (fromStop && fromStop.time) {
          departureTime = fromStop.time;
          if (fromStop.platform) platform = fromStop.platform;
        }
      }

      if (toStation) {
        destinationName = toStation.name.toUpperCase();
      }

      return {
        departure_time: departureTime,
        departure_period: departurePeriod,
        destination: destinationName.toUpperCase(),
        train_type: t.trainType,
        train_no: t.trainNumber,
        route: t.routeLabel,
        platform,
      };
    });
  }, [filteredTrains, fromStation, toStation]);

  const renderItem = ({ item }: { item: TrainListItemData }) => (
    <View className="mb-2 px-3">
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/TrainRouteScreen",
            params: {
              train_no: item.train_no,
              route: item.route,
              type: item.train_type,
              time: item.departure_time,
            },
          });
        }}
      >
        <TrainCard
          departure_time={item.departure_time}
          departure_period={item.departure_period}
          destination={item.destination}
          train_type={item.train_type}
          train_no={item.train_no}
          route={item.route}
          platform={item.platform}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundDark }} edges={["top"]}>
      {fromStation && toStation && (
        <View className="px-4 py-2 border-b border-neutral-800">
          <Text className="text-white font-mono font-bold text-sm">
            {fromStation.name} → {toStation.name}
          </Text>
          <Text className="text-neutral-500 text-xs">
            {listData.length} {strings.common.trainsFound}
          </Text>
        </View>
      )}

      <TrainFilter
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.train_no}-${index}`}
        initialNumToRender={13}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <Text className="text-neutral-400 text-sm">{strings.common.emptyFilterResults}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TrainListScreen;
