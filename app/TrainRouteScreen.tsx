import { View, Text } from 'react-native'
import React from 'react'
import TrainSchedule from '@/components/TrainSchedule'
import { useLocalSearchParams } from 'expo-router'
import InfoCardHeader from "@/components/InfoCardHeader"
import { SafeAreaView } from "react-native-safe-area-context";
import { getTrainByNumber, getLiveStatus } from "@/utils/trains"; // adjust path

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

  // Single source of truth for "is this train currently running" — shared
  // with TrainSchedule's own internal ticking state via @/utils/trains, so
  // the header badge can never drift out of sync with the timeline below it.
  const isLive = getLiveStatus(train.stops).status === "running";

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* <Text className='text-white'>M_indicator Version-2</Text> */}
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

export default TrainRouteScreen