import InfoCardHeader from "@/components/InfoCardHeader";
import TrainSchedule from "@/components/TrainSchedule";
import { getLiveStatus, getTrainByNumber } from "@/utils/trains";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TrainRouteScreen = () => {
  const { train_no } = useLocalSearchParams<{ train_no: string }>();
  const train = train_no ? getTrainByNumber(train_no) : undefined;

  if (!train) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-900">
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text className="text-3xl">🚫</Text>
          <Text className="text-neutral-300 font-mono font-bold text-sm tracking-wide">
            Train {train_no} not found
          </Text>
          <Text className="text-neutral-600 font-mono text-xs text-center">
            Check the train number and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLive = getLiveStatus(train.stops).status === "running";

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <InfoCardHeader
        route={train.route}
        type={train.train_type}
        time={train.stops[0]?.time ?? ""}
        trainNumber={train.train_no}
        isLive={isLive}
      />
      <TrainSchedule
        route={train.route}
        trainNumber={train.train_no}
        type={train.train_type}
        time={train.stops[0]?.time ?? ""}
        stops={train.stops}
      />
    </SafeAreaView>
  );
};

export default TrainRouteScreen;
