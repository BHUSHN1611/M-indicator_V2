import React from "react";
import { View, Animated } from "react-native";
import { usePulse } from "./usePulse";

export interface StopDotProps {
  endpoint?: boolean;
  major?: boolean;
  isCurrent: boolean;
  isPast: boolean;
  skipped?: boolean;
}

export function StopDot({ endpoint, major, isCurrent, isPast, skipped }: StopDotProps) {
  const pulseOpacity = usePulse(isCurrent);

  if (isCurrent)
    return (
      <Animated.View
        style={{ opacity: pulseOpacity }}
        className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-yellow-200 z-10"
      />
    );
  if (endpoint && isPast)
    return <View className="w-3.5 h-3.5 rounded-full bg-red-900 border-2 border-red-500 z-10" />;
  if (endpoint)
    return <View className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-red-400 z-10" />;
  if (major && isPast)
    return <View className="w-3 h-3 rounded-full bg-red-900 border-2 border-red-600 z-10" />;
  if (major)
    return <View className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-400 z-10" />;
  if (skipped)
    return (
      <View
        className={`w-1.5 h-1.5 rounded-full bg-neutral-950 border ${
          isPast ? "border-neutral-800" : "border-neutral-600"
        } z-10`}
      />
    );
  return <View className="w-2.5 h-2.5 rounded-full bg-neutral-700 border-2 border-neutral-600 z-10" />;
}
