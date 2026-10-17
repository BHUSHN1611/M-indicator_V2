import React from 'react';
import { View, Text } from 'react-native';

interface TrainRouteCardProps {
  trainNumber?: string;
  route?: string;
}

const TrainRouteCard: React.FC<TrainRouteCardProps> = ({ trainNumber, route }) => {
  return (
    <View className="p-4 bg-neutral-900 rounded-lg">
      <Text className="text-xl font-bold text-amber-50">
        {trainNumber ? `Train #${trainNumber}` : 'Train Info'}
      </Text>
      {route && <Text className="text-sm text-neutral-400 mt-1">{route}</Text>}
    </View>
  );
};

export default TrainRouteCard;