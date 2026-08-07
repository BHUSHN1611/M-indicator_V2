import React from "react";
import { Text, View } from "react-native";

interface TowerTrackingCardProps {
  trainNumber: string;
  currentLocation: string;
  nextStation: string;
  eta: string;
  source: string;
}

export default function TowerTrackingCard({
  trainNumber,
  currentLocation,
  nextStation,
  eta,
  source,
}: TowerTrackingCardProps) {
  return (
    <View className="mx-4 mt-4 rounded-2xl border border-[#1e3a5f] bg-[#0a1628] p-4">
      <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-[#d6a75c]">
        Tower-based tracking
      </Text>
      <Text className="mt-2 text-lg font-bold text-white">
        Train {trainNumber}
      </Text>
      <Text className="mt-2 text-sm text-[#cbd5e1]">
        Current location: {currentLocation}
      </Text>
      <Text className="mt-1 text-sm text-[#cbd5e1]">
        Next station: {nextStation}
      </Text>
      <Text className="mt-1 text-sm text-[#cbd5e1]">ETA: {eta}</Text>
      <Text className="mt-3 text-xs text-[#8a97b5]">Source: {source}</Text>
    </View>
  );
}
