import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, type ScrollViewInstance } from "react-native";
import type { Stop } from "../../utils/trains";
import { toMins, realNowMins, interpolateStopMins, getTrainState } from "../../utils/trains";
import type { TrackingResult } from "@/types";
import { Header } from "./Header";
import { StopRow } from "./StopRow";
import { TrainMarker } from "./TrainMarker";
import { ProgressBar } from "./ProgressBar";

export interface TrainScheduleProps {
  route: string;
  trainNumber: string;
  type: string;
  time: string;
  stops: Stop[];
  demoMode?: boolean;
  tracking?: TrackingResult | null;
}

function etaLabel(nowMins: number, stopMins: number[], idx: number): string {
  const diff = stopMins[idx] - nowMins;
  if (diff <= 0) return "now";
  if (diff < 60) return `${Math.ceil(diff)}m`;
  return `${Math.floor(diff / 60)}h ${Math.ceil(diff % 60)}m`;
}

export function TrainSchedule({
  route,
  trainNumber,
  type,
  stops,
  time,
  demoMode = false,
  tracking,
}: TrainScheduleProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const demoRef = useRef<number | null>(null);
  const hasStops = !!stops && stops.length > 0;

  const getInitialMins = () => {
    if (demoMode && hasStops) {
      const firstMins = toMins(stops[0].time);
      return typeof firstMins === "number" ? firstMins - 2 : 0;
    }
    return realNowMins();
  };

  const [nowMins, setNowMins] = useState<number>(getInitialMins);

  useEffect(() => {
    if (!hasStops || tracking !== undefined) return;
    if (demoRef.current === null && demoMode) {
      const firstMins = toMins(stops[0].time);
      demoRef.current = typeof firstMins === "number" ? firstMins - 2 : 0;
    }
    const interval = setInterval(() => {
      if (demoMode) {
        const last = toMins(stops[stops.length - 1].time);
        const first = toMins(stops[0].time);
        if (typeof last !== "number" || typeof first !== "number") return;

        demoRef.current = (demoRef.current ?? first) + 3;
        if (demoRef.current > last + 5) demoRef.current = first - 2;
        setNowMins(demoRef.current);
      } else {
        setNowMins(realNowMins());
      }
    }, demoMode ? 2000 : 15000);
    return () => clearInterval(interval);
  }, [demoMode, stops, hasStops, tracking]);

  if (!hasStops) {
    return (
      <View className="ml-3 mt-1 w-full max-w-sm bg-neutral-900 rounded-2xl overflow-hidden p-5">
        <Text className="text-neutral-500 text-sm">No schedule data available.</Text>
      </View>
    );
  }

  const stopMins = interpolateStopMins(stops);
  const fallbackState = getTrainState(nowMins, stopMins);

  const currentIdx = tracking ? tracking.currentIdx : fallbackState.currentIdx;
  const nextIdx = tracking ? tracking.nextIdx : fallbackState.nextIdx;
  const isLive = tracking ? tracking.isLive : fallbackState.status === "running";
  const status = tracking ? tracking.status : fallbackState.status;
  const progress = tracking ? tracking.progress : fallbackState.progress;
  const currentEta = tracking
    ? tracking.etaLabel
    : (nextIdx < stops.length ? etaLabel(nowMins, stopMins, nextIdx) : "");

  return (
    <View className="w-full h-full max-w-lg bg-neutral-900 overflow-hidden">
      <Header route={route} trainNumber={trainNumber} type={type} time={time} isLive={isLive} />

      <ScrollView
        ref={scrollRef}
        className="max-h-[500px] py-2"
        showsVerticalScrollIndicator={false}
      >
        {stops.map((stop, i) => {
          const isPast = i < currentIdx || (status === "done" && i < stops.length - 1);
          const isCurrent = isLive && i === currentIdx;

          return (
            <React.Fragment key={`${stop.name}-${i}`}>
              <StopRow
                stop={stop}
                isFirst={i === 0}
                isLast={i === stops.length - 1}
                isCurrent={isCurrent}
                isPast={isPast}
                scrollRef={scrollRef}
              />
              {isLive && i === currentIdx && nextIdx >= 0 && nextIdx < stops.length && (
                <TrainMarker
                  nextName={stops[nextIdx].name}
                  eta={currentEta}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      {status !== "before" && (
        <ProgressBar
          progress={progress}
          firstName={stops[0].name}
          lastName={stops[stops.length - 1].name}
        />
      )}
    </View>
  );
}

export default TrainSchedule;
