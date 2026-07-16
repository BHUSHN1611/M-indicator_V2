import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated, LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import type { Stop } from "@/utils/trains";
import { toMins, realNowMins, interpolateStopMins, getTrainState } from "@/utils/trains";

interface TrainScheduleProps {
  route: string;
  trainNumber: string;
  type: string;
  time: string;
  stops: Stop[];
  demoMode?: boolean;
}

interface TrainMarkerProps {
  nextName: string;
  eta: string;
}

interface StopDotProps {
  endpoint?: boolean;
  major?: boolean;
  isCurrent: boolean;
  isPast: boolean;
  skipped?: boolean;
}

interface StopRowProps {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isPast: boolean;
  scrollRef: React.RefObject<ScrollView | null>;
}

interface ProgressBarProps {
  progress: number;
  firstName: string;
  lastName: string;
}

interface HeaderProps {
  route: string;
  trainNumber: string;
  type: string;
  time: string;
  isLive: boolean;
}

// Helpers (schedule-display-only; time/status math lives in @/utils/trains) ──

function etaLabel(nowMins: number, stopMins: number[], idx: number): string {
  const diff = stopMins[idx] - nowMins;
  if (diff <= 0) return "now";
  if (diff < 60) return `${Math.ceil(diff)}m`;
  return `${Math.floor(diff / 60)}h ${Math.ceil(diff % 60)}m`;
}

function usePulse(active: boolean): Animated.Value {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity]);

  return opacity;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Header({ route, trainNumber, type, time, isLive }: HeaderProps) {
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

function TrainMarker({ nextName, eta }: TrainMarkerProps) {
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

function StopDot({ endpoint, major, isCurrent, isPast, skipped }: StopDotProps) {
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

function StopRow({ stop, isFirst, isLast, isCurrent, isPast, scrollRef }: StopRowProps) {
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
      {/* live-position accent: a thin bar instead of relying on tint alone */}
      <View className={`absolute left-0 top-0 bottom-0 w-[3px] ${isCurrent ? "bg-yellow-400" : "bg-transparent"}`} />

      {/* time */}
      <Text className={`font-mono font-bold text-[13px] w-11 self-center ${timeColor} ${skipped ? "italic" : ""}`}>
        {skipped ? "· ·" : time}
      </Text>

      {/* timeline column */}
      <View className="w-8 items-center">
        <View className={`flex-1 w-0.5 ${isFirst ? "bg-transparent" : lineTopClass}`} />
        <StopDot endpoint={endpoint} major={major} isCurrent={isCurrent} isPast={isPast} skipped={skipped} />
        <View className={`flex-1 w-0.5 ${isLast ? "bg-transparent" : lineBottomClass}`} />
      </View>

      {/* stop info */}
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

function ProgressBar({ progress, firstName, lastName }: ProgressBarProps) {
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

      {/* live marker riding the track — clamped so it never clips the edges */}
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

// ─── Main Component ─────────────────────────────────────────────────────────

export default function TrainRouteCard({
  route,
  trainNumber,
  type,
  stops,
  time,
  demoMode = false,
}: TrainScheduleProps) {
  const scrollRef = useRef<ScrollView>(null);
  const demoRef = useRef<number | null>(null);
  const hasStops = !!stops && stops.length > 0;

  if (demoMode && demoRef.current === null && hasStops) {
    const firstMins = toMins(stops[0].time);
    demoRef.current = typeof firstMins === "number" ? firstMins - 2 : 0;
  }

  const [nowMins, setNowMins] = useState<number>(() =>
    demoMode && hasStops ? (demoRef.current as number) : realNowMins()
  );

  useEffect(() => {
    if (!hasStops) return;
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
  }, [demoMode, stops, hasStops]);

  if (!hasStops) {
    return (
      <View className="ml-3 mt-1 w-full max-w-sm bg-neutral-900 rounded-2xl overflow-hidden p-5">
        <Text className="text-neutral-500 text-sm">No schedule data available.</Text>
      </View>
    );
  }

  const stopMins = interpolateStopMins(stops);
  const state = getTrainState(nowMins, stopMins);
  const isLive = state.status === "running";

  return (
    <View className="w-full h-full max-w-lg bg-neutral-900  overflow-hidden">
      <Header route={route} trainNumber={trainNumber} type={type} time={time} isLive={isLive} />

      <ScrollView
        ref={scrollRef}
        className="max-h-[500px] py-2"
        showsVerticalScrollIndicator={false}
      >
        {stops.map((stop, i) => {
          const isPast = i < state.currentIdx || (state.status === "done" && i < stops.length - 1);
          const isCurrent = isLive && i === state.currentIdx;

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
              {isLive && i === state.currentIdx && state.nextIdx < stops.length && (
                <TrainMarker
                  nextName={stops[state.nextIdx].name}
                  eta={etaLabel(nowMins, stopMins, state.nextIdx)}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      {state.status !== "before" && (
        <ProgressBar
          progress={state.progress}
          firstName={stops[0].name}
          lastName={stops[stops.length - 1].name}
        />
      )}
    </View>
  );
}