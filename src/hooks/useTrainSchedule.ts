import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Train } from '../core/models/train';
import { Route } from '../core/models/route';
import { TrackingResult } from '../core/models/tracking';
import { ScheduleTrackingEngine } from '../core/tracking/ScheduleTrackingEngine';
import { trainRepository } from '../core/data/trains';
import { routeRepository } from '../core/data/routes';
import { timeStringToMinutes } from '../core/tracking/timeUtils';

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

  // Initial calculation
  const calculateCurrent = useCallback(() => {
    if (!train) return null;

    if (demoMode) {
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
  }, [train, route, engine, demoMode]);

  const [tracking, setTracking] = useState<TrackingResult | null>(calculateCurrent);

  // Recalculate helper
  const recalculate = useCallback(() => {
    setTracking(calculateCurrent());
  }, [calculateCurrent]);

  // Interval ticker
  useEffect(() => {
    if (!train) return;

    // Run immediate calculation when train changes
    setTracking(calculateCurrent());

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
