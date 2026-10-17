export type JourneyStatus = 'before' | 'running' | 'done';
export type TrackingMode = 'schedule' | 'gps' | 'hybrid';

export interface TrackingResult {
  /** Overall status of the journey: 'before', 'running', or 'done' */
  status: JourneyStatus;
  /** Convenience boolean: true when status === 'running' */
  isLive: boolean;
  /** Percentage of journey completed: 0.0 to 100.0 */
  progress: number;
  /** Station ID of current/last departed stop (null if before start) */
  currentStationId: string | null;
  /** Index in stops array for current/last departed stop (-1 if before start) */
  currentIdx: number;
  /** Station ID of the upcoming stop (null if journey done) */
  nextStationId: string | null;
  /** Index in stops array for upcoming stop (-1 if journey done) */
  nextIdx: number;
  /** Estimated minutes until next stop arrival (null if done/before) */
  nextStationEtaMins: number | null;
  /** Human-readable ETA label (e.g. "now", "4m", "1h 12m") */
  etaLabel: string;
  /** Mode of tracking used to produce this result */
  mode: TrackingMode;
}
