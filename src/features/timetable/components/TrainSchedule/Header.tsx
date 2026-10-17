import React from "react";
import { View, Text } from "react-native";

export interface HeaderProps {
  route: string;
  trainNumber: string;
  type: string;
  time: string;
  isLive: boolean;
}

export function Header({ route, trainNumber, type, time, isLive }: HeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between px-5 py-3 border-b border-white/5"
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${type} train ${trainNumber}, ${route}, departs ${time}${
        isLive ? ", currently running" : ""
      }`}
    >
      <View>
        <Text className="text-white font-bold text-base">{trainNumber}</Text>
        <Text className="text-neutral-500 text-xs mt-0.5">{route}</Text>
      </View>
      <View className="items-end">
        <View className="flex-row items-center gap-1.5">
          {isLive && <View className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
          <Text className={`text-xs font-mono ${isLive ? "text-yellow-400" : "text-neutral-500"}`}>
            {isLive ? "LIVE" : type}
          </Text>
        </View>
        <Text className="text-neutral-500 text-xs mt-0.5 font-mono">{time}</Text>
      </View>
    </View>
  );
}
