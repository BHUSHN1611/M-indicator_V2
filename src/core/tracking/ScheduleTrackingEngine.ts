import { Train } from '../models/train';
import { Route } from '../models/route';
import { TrackingResult } from '../models/tracking';
import { ITrackingEngine } from './ITrackingEngine';
import {
  dateToMinutes,
  interpolateStopTimes,
  formatEta,
} from './timeUtils';

const MINUTES_PER_DAY = 1440;

/**
 * ScheduleTrackingEngine
 * Pure mathematical tracking engine estimating train position from scheduled timetable.
 * Completely decoupled from React and UI rendering.
 */
export class ScheduleTrackingEngine implements ITrackingEngine {
  calculate(
    train: Train,
    _route?: Route | null,
    referenceTime: Date = new Date()
  ): TrackingResult {
    if (!train.stops || train.stops.length === 0) {
      return {
        status: 'before',
        isLive: false,
        progress: 0,
        currentStationId: null,
        currentIdx: -1,
        nextStationId: null,
        nextIdx: -1,
        nextStationEtaMins: null,
        etaLabel: '',
        mode: 'schedule',
      };
    }

    const rawTimes = train.stops.map((s) => s.time);
    const stopMinutes = interpolateStopTimes(rawTimes);

    const first = stopMinutes[0];
    const last = stopMinutes[stopMinutes.length - 1];

    // Reference time in minutes
    let nowMins = dateToMinutes(referenceTime);

    // Handle midnight rollover matching:
    // If the train route crosses midnight (last >= 1440) and current time is in the early morning
    // of the next calendar day (nowMins < last - 1440 + 60), adjust nowMins to match trip timeline.
    if (last >= MINUTES_PER_DAY && nowMins < (last - MINUTES_PER_DAY + 120)) {
      nowMins += MINUTES_PER_DAY;
    }

    // 1. Train has not departed yet
    if (nowMins < first) {
      const waitMins = Math.max(0, first - nowMins);
      return {
        status: 'before',
        isLive: false,
        progress: 0,
        currentStationId: null,
        currentIdx: -1,
        nextStationId: train.stops[0].stationId,
        nextIdx: 0,
        nextStationEtaMins: Math.ceil(waitMins),
        etaLabel: formatEta(waitMins),
        mode: 'schedule',
      };
    }

    // 2. Train has arrived at terminus
    if (nowMins >= last) {
      const lastIndex = train.stops.length - 1;
      return {
        status: 'done',
        isLive: false,
        progress: 100,
        currentStationId: train.stops[lastIndex].stationId,
        currentIdx: lastIndex,
        nextStationId: null,
        nextIdx: -1,
        nextStationEtaMins: null,
        etaLabel: 'Arrived',
        mode: 'schedule',
      };
    }

    // 3. Train is actively running between stops
    for (let i = 0; i < stopMinutes.length - 1; i++) {
      const segStart = stopMinutes[i];
      const segEnd = stopMinutes[i + 1];

      if (nowMins >= segStart && nowMins < segEnd) {
        const totalDuration = last - first;
        const overallProgress =
          totalDuration > 0 ? ((nowMins - first) / totalDuration) * 100 : 0;
        const etaMins = segEnd - nowMins;

        return {
          status: 'running',
          isLive: true,
          progress: Math.min(100, Math.max(0, overallProgress)),
          currentStationId: train.stops[i].stationId,
          currentIdx: i,
          nextStationId: train.stops[i + 1].stationId,
          nextIdx: i + 1,
          nextStationEtaMins: Math.max(0, Math.ceil(etaMins)),
          etaLabel: formatEta(etaMins),
          mode: 'schedule',
        };
      }
    }

    // Fallback if somehow past loop without matching
    const lastIndex = train.stops.length - 1;
    return {
      status: 'done',
      isLive: false,
      progress: 100,
      currentStationId: train.stops[lastIndex].stationId,
      currentIdx: lastIndex,
      nextStationId: null,
      nextIdx: -1,
      nextStationEtaMins: null,
      etaLabel: 'Arrived',
      mode: 'schedule',
    };
  }
}
