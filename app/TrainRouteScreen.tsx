import { View, Text } from 'react-native';
import React from 'react';
import TrainSchedule from '@/components/TrainSchedule';
import { useLocalSearchParams } from 'expo-router';
import InfoCardHeader from '@/components/InfoCardHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTrainByNumber } from '@/utils/trains';
import { useTrainSchedule } from '@/src/hooks/useTrainSchedule';

const TrainRouteScreen = () => {
  const { train_no } = useLocalSearchParams<{ train_no: string }>();
  const trainNumber = train_no ?? '';

  const { tracking } = useTrainSchedule(trainNumber);
  const train = trainNumber ? getTrainByNumber(trainNumber) : undefined;

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

  // Reactive live status driven by useTrainSchedule
  const isLive = tracking?.isLive ?? false;

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <InfoCardHeader
        route={train.route}
        type={train.train_type}
        time={train.stops[0]?.time ?? ''}
        trainNumber={train.train_no}
        isLive={isLive}
      />
      <TrainSchedule
        route={train.route}
        trainNumber={train.train_no}
        type={train.train_type}
        time={train.stops[0]?.time ?? ''}
        stops={train.stops}
        tracking={tracking}
      />
    </SafeAreaView>
  );
};

export default TrainRouteScreen;