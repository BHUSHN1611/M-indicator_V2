import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Train, Route, TrackingResult } from '@/types';
import { ScheduleTrackingEngine, timeStringToMinutes } from '@/services/tracking';
import { trainRepository, routeRepository } from '@/services/data';

interface UseTrainScheduleOptions {
  /** Refresh interval in milliseconds (default: 15000ms / 15s) */
  pollIntervalMs?: number;
  /** Demo mode to simulate train movement */
  demoMode?: boolean;
}

interface UseTrainScheduleResult {
  train: Train | undefined;
  route: Route | undefined;
  tracking: TrackingResult | null;
  /** Manually force an instant tracking recalculation */
  recalculate: () => void;
}

/**
 * Custom hook to subscribe to train schedule tracking.
 * Encapsulates the tracking engine and interval timer outside the UI layer.
 */
export function useTrainSchedule(
  trainNumber: string,
  options: UseTrainScheduleOptions = {}
): UseTrainScheduleResult {
  const { pollIntervalMs = 15000, demoMode = false } = options;

  const engine = useMemo(() => new ScheduleTrackingEngine(), []);
  const train = useMemo(() => trainRepository.getByNumber(trainNumber), [trainNumber]);
  const route = useMemo(() => (train ? routeRepository.getById(train.routeId) : undefined), [train]);

  const demoVirtualMins = useRef<number | null>(null);

  const lastSimulatedTrain = useRef<string>(trainNumber);

  // Periodic calculation
  const calculateCurrent = useCallback(() => {
    if (!train) return null;

    if (demoMode) {
      if (lastSimulatedTrain.current !== trainNumber) {
        lastSimulatedTrain.current = trainNumber;
        demoVirtualMins.current = null;
      }

      const firstMins = timeStringToMinutes(train.stops[0]?.time) ?? 0;
      const lastMins = timeStringToMinutes(train.stops[train.stops.length - 1]?.time) ?? 1440;

      if (demoVirtualMins.current === null) {
        demoVirtualMins.current = firstMins - 2;
      } else {
        demoVirtualMins.current += 3;
        if (demoVirtualMins.current > lastMins + 5) {
          demoVirtualMins.current = firstMins - 2;
        }
      }

      const virtualDate = new Date();
      virtualDate.setHours(Math.floor(demoVirtualMins.current / 60));
      virtualDate.setMinutes(Math.floor(demoVirtualMins.current % 60));
      virtualDate.setSeconds(0);
      return engine.calculate(train, route, virtualDate);
    }

    return engine.calculate(train, route, new Date());
  }, [train, route, engine, demoMode, trainNumber]);

  const getInitialTracking = useCallback(() => {
    if (!train) return null;
    if (demoMode) {
      const firstMins = timeStringToMinutes(train.stops[0]?.time) ?? 0;
      const initialMins = firstMins - 2;
      const virtualDate = new Date();
      virtualDate.setHours(Math.floor(initialMins / 60));
      virtualDate.setMinutes(Math.floor(initialMins % 60));
      virtualDate.setSeconds(0);
      return engine.calculate(train, route, virtualDate);
    }
    return engine.calculate(train, route, new Date());
  }, [train, route, engine, demoMode]);

  const [tracking, setTracking] = useState<TrackingResult | null>(getInitialTracking);
  const [prevTrainNumber, setPrevTrainNumber] = useState(trainNumber);

  if (trainNumber !== prevTrainNumber) {
    setPrevTrainNumber(trainNumber);
    setTracking(getInitialTracking());
  }

  // Recalculate helper
  const recalculate = useCallback(() => {
    setTracking(calculateCurrent());
  }, [calculateCurrent]);

  // Interval ticker
  useEffect(() => {
    if (!train) return;

    const intervalId = setInterval(() => {
      setTracking(calculateCurrent());
    }, demoMode ? 2000 : pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [train, calculateCurrent, demoMode, pollIntervalMs]);

  return {
    train,
    route,
    tracking,
    recalculate,
  };
}
