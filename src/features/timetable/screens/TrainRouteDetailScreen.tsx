import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrainSchedule from '../components/TrainSchedule';
import InfoCardHeader from '../components/InfoCardHeader';
import { getTrainByNumber } from '../utils/trains';
import { useTrainSchedule } from '../hooks/useTrainSchedule';
import { strings } from '@/i18n';

export const TrainRouteDetailScreen: React.FC = () => {
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
            {strings.common.errorTrainNotFound} {train_no}
          </Text>
          <Text className="text-neutral-600 font-mono text-xs text-center">
            {strings.common.errorCheckTrainNumber}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

export default TrainRouteDetailScreen;
