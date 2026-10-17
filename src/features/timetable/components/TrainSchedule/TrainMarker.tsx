import React from "react";
import { View, Text } from "react-native";

export interface TrainMarkerProps {
  nextName: string;
  eta: string;
}

export function TrainMarker({ nextName, eta }: TrainMarkerProps) {
  return (
    <View
      className="flex-row items-center px-5 h-9"
      accessible
      accessibilityLabel={`Next stop ${nextName} in ${eta}`}
    >
      <View className="w-11" />
      <View className="w-8 items-center self-stretch">
        <View className="flex-1 w-0.5 bg-red-600/50" />
        <Text className="text-2xl z-10" style={{ textShadowColor: "#3670ff", textShadowRadius: 8 }}>
          🚆
        </Text>
        <View className="flex-1 w-0.5 bg-neutral-800" />
      </View>
      <View className="ml-3 flex-row items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-1">
        <Text className="font-mono text-[10px] font-bold text-yellow-400 tracking-wide">
          NEXT: {nextName}
        </Text>
        <Text className="font-mono text-[10px] text-yellow-700">in {eta}</Text>
      </View>
    </View>
  );
}
