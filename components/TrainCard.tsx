import React from 'react';
import { View, Text } from 'react-native';

interface TrainCardProps {
  departure_time: string;
  departure_period: string;
  destination: string;
  train_type?: string; // optional since you conditionally render it
  train_no: string;
  route: string;
  platform: string | number;
}

const TrainCard: React.FC<TrainCardProps> = ({
  departure_time,
  departure_period,
  destination,
  train_type,
  train_no,
  route,
  platform,
}) => {
  return (
    <View className="flex-row items-center gap-3 bg-[#0a1628] border-2 border-[#1e3a5f] rounded-xl px-4 py-2.5 min-w-[350px]">
      {/* Main info */}
      <View className="flex-col gap-1.5 flex-1">
        {/* Primary row */}
        <View className="flex-row items-center gap-2 bg-[#8b1a1a] rounded-md px-4 py-1.5">
          <Text className="text-xl font-bold text-white tracking-wide">{departure_time}</Text>
          <Text className="text-sm font-semibold text-red-200 tracking-widest">{departure_period}</Text>
          <Text className="text-xl font-bold text-white tracking-widest flex-1">{destination}</Text>
          {train_type && (
            <Text className="bg-[#5a0e0e] text-red-300 text-xs font-bold px-2 py-0.5 rounded tracking-wider">
              {train_type}
            </Text>
          )}
        </View>

        {/* Secondary row */}
        <View className="flex-row items-center gap-3 bg-[#0f1e35] border border-[#1e3a5f] rounded-md px-4 py-1">
          <Text className="text-sm font-semibold text-blue-300">{train_no}</Text>
          <Text className="text-sm text-blue-200 tracking-wide">{route}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="w-px self-stretch bg-[#1e3a5f]" />

      {/* Platform */}
      <View className="flex-col items-center min-w-[44px]">
        <Text className="text-[11px] font-semibold text-blue-300 tracking-widest uppercase">PF</Text>
        <Text className="text-3xl font-bold text-white leading-none">{platform}</Text>
      </View>
    </View>
  );
};

export default TrainCard;


