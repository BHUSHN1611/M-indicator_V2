import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export interface ProgressBarProps {
  progress: number;
  firstName: string;
  lastName: string;
}

export function ProgressBar({ progress, firstName, lastName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <View
      className="relative bg-neutral-950 px-5 pt-5 pb-3 border-t border-white/5"
      accessible
      accessibilityLabel={`Journey ${Math.round(clamped)} percent complete, from ${firstName} to ${lastName}`}
    >
      <View className="h-1 bg-neutral-800 rounded-full overflow-hidden">
        <LinearGradient
          colors={["#ef4444", "#fbbf24"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 4, borderRadius: 999, width: `${clamped}%` }}
        />
      </View>

      <View
        className="absolute top-0 -mt-1"
        style={{ left: `${clamped}%`, transform: [{ translateX: -10 }] }}
      >
        <Text style={{ fontSize: 16 }}>🚆</Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="font-mono text-[10px] text-neutral-600">{firstName}</Text>
        <Text className="font-mono text-[10px] font-bold text-neutral-400">{Math.round(clamped)}%</Text>
        <Text className="font-mono text-[10px] text-neutral-600">{lastName}</Text>
      </View>
    </View>
  );
}
