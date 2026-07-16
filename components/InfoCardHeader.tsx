import React from 'react';
import { View, Text } from 'react-native';

interface ScheduleHeaderProps {
  route: string;
  trainNumber: string;
  type: string;
  time: string;
  isLive: boolean;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({route,trainNumber,type,time,isLive,}) => {
  return (
    <View className="relative bg-neutral-900 px-5 pt-5 pb-3 border-b border-white/5 overflow-hidden mt-5">
      {/* top accent bar with a soft glow, reads as a signal strip rather than a flat divider */}
      <View
        className="absolute top-0 left-0 right-0 h-[3px] bg-red-600"
        style={{ shadowColor: "#dc2626", shadowOpacity: 0.6, shadowRadius: 6, shadowOffset: { width: 0, height: 1 } }}
      />

      {/* top row */}
      <View className="flex-row items-center gap-3 mb-2.5">
        <View
          className="w-10 h-10 rounded-2xl bg-red-600 items-center justify-center"
          style={{ shadowColor: "#dc2626", shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <Text className="text-xl">🚃</Text>
        </View>
        <View className="flex-shrink">
          <Text className="font-mono font-bold text-white text-lg tracking-wide leading-tight" numberOfLines={1}>
            {route}
          </Text>
          <Text className="font-mono text-neutral-500 text-[10px] tracking-[1.5px] uppercase mt-0.5">
            Train schedule
          </Text>
        </View>
        <Text className="ml-auto font-mono font-bold text-red-500 text-base tracking-wider flex-shrink-0">
          #{trainNumber}
        </Text>
      </View>

      {/* badges row */}
      <View className="flex-row items-center gap-2 flex-wrap">
        <Text className="bg-red-900/30 border border-red-500/25 text-red-500 text-[10px] font-semibold tracking-[1.5px] uppercase px-2 py-0.5 rounded font-mono">
          {type} · {time}
        </Text>

        {isLive && (
          <View className="flex-row items-center gap-1.5 bg-green-900/20 border border-green-500/25 px-2 py-0.5 rounded">
            <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <Text className="text-green-400 text-[10px] font-semibold tracking-[1px] uppercase font-mono">
              LIVE
            </Text>
          </View>
        )}

      </View>
    </View>
  );
};

export default ScheduleHeader;