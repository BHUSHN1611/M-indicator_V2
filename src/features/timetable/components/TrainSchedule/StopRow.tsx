import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, LayoutChangeEvent } from "react-native";
import { Stop } from "../../utils/trains";
import { StopDot } from "./StopDot";

export interface StopRowProps {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isPast: boolean;
  scrollRef: React.RefObject<ScrollView | null>;
}

export function StopRow({ stop, isFirst, isLast, isCurrent, isPast, scrollRef }: StopRowProps) {
  const { time, name, platform, major, endpoint, highlighted } = stop;
  const skipped = time === null;
  const yPos = useRef(0);

  // Auto-scroll so the current stop is always in view
  useEffect(() => {
    if (isCurrent && scrollRef?.current) {
      scrollRef.current.scrollTo({ y: Math.max(yPos.current - 80, 0), animated: true });
    }
  }, [isCurrent, scrollRef]);

  const lineTopClass = isPast || isCurrent ? "bg-red-600/50" : "bg-neutral-800";
  const lineBottomClass = isPast ? "bg-red-600/50" : "bg-neutral-800";

  let nameColor = "text-white";
  if (isCurrent) nameColor = "text-yellow-400 font-bold";
  else if (isPast) nameColor = "text-neutral-600";
  else if (skipped) nameColor = "text-neutral-500";
  else if (endpoint) nameColor = "text-red-400";
  else if (major) nameColor = "text-green-400";

  let timeColor = major || endpoint ? "text-red-500" : "text-neutral-600";
  if (isCurrent) timeColor = "text-yellow-400";
  else if (isPast) timeColor = "text-neutral-700";
  else if (skipped) timeColor = "text-neutral-700";

  let rowBg = "";
  if (isCurrent) rowBg = "bg-yellow-400/[0.07]";
  else if (highlighted) rowBg = "bg-red-600/[0.06]";

  const handleLayout = (e: LayoutChangeEvent) => {
    yPos.current = e.nativeEvent.layout.y;
  };

  const a11yLabel = skipped
    ? `${name}, train does not stop here`
    : `${name}, ${isCurrent ? "current stop" : isPast ? "already passed" : "upcoming"}, scheduled ${time}${
        platform ? `, platform ${platform}` : ""
      }`;

  return (
    <View
      onLayout={handleLayout}
      className={`relative flex-row px-5 min-h-[54px] ${rowBg} ${isPast ? "opacity-50" : ""}`}
      accessible
      accessibilityLabel={a11yLabel}
    >
      <View className={`absolute left-0 top-0 bottom-0 w-[3px] ${isCurrent ? "bg-yellow-400" : "bg-transparent"}`} />

      <Text className={`font-mono font-bold text-[13px] w-11 self-center ${timeColor} ${skipped ? "italic" : ""}`}>
        {skipped ? "· ·" : time}
      </Text>

      <View className="w-8 items-center">
        <View className={`flex-1 w-0.5 ${isFirst ? "bg-transparent" : lineTopClass}`} />
        <StopDot endpoint={endpoint} major={major} isCurrent={isCurrent} isPast={isPast} skipped={skipped} />
        <View className={`flex-1 w-0.5 ${isLast ? "bg-transparent" : lineBottomClass}`} />
      </View>

      <View className="flex-1 justify-center pl-3 py-2.5">
        <View className="flex-row items-center gap-2">
          <Text className={`text-md font-semibold tracking-wide leading-tight ${nameColor}`}>
            {name}
          </Text>
          {skipped && (
            <Text className="font-mono text-[9px] text-neutral-600 tracking-[1px] uppercase">
              fast train · no stop
            </Text>
          )}
        </View>
        {!!platform && !skipped && (
          <View
            className={`self-start mt-1 px-1.5 py-[1px] rounded border ${
              isCurrent ? "border-yellow-700/40 bg-yellow-400/5" : "border-white/5 bg-white/[0.03]"
            }`}
          >
            <Text
              className={`font-mono text-[9px] tracking-wide ${
                isCurrent ? "text-yellow-600" : "text-neutral-500"
              }`}
            >
              {platform}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
