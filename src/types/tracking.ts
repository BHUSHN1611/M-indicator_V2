export type JourneyStatus = 'before' | 'running' | 'done';
export type TrackingMode = 'schedule' | 'gps' | 'crowdsourced' | 'hybrid';

/**
 * Schedule-based or combined tracking presentation state.
 */
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
  /** Confidence indicator */
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  /** Number of live reporting passengers (for crowdsourced mode) */
  contributorCount?: number;
}

/**
 * Anonymized user crowdsource tracking session.
 * Created ONLY with explicit user consent when boarding a specific train.
 */
export interface TrackingSession {
  /** Unique session identifier */
  sessionId: string;
  /** Anonymized client device identifier (never raw PII) */
  anonymousClientId: string;
  /** Train number the passenger declared they are on (e.g. "93001") */
  trainNumber: string;
  /** Route ID (e.g. "WR_VR_DRD_DN") */
  routeId: string;
  /** Operating direction */
  direction: 'UP' | 'DOWN';
  /** Session status */
  status: 'active' | 'paused' | 'stopped' | 'expired';
  /** Timestamp when session started (epoch ms) */
  startedAt: number;
  /** Timestamp when session will automatically expire (epoch ms) */
  expiresAt: number;
  /** Timestamp of most recent validated observation */
  lastObservationAt: number | null;
  /** Total count of observations accepted during this session */
  acceptedObservationCount: number;
  /** Explicit user consent flag */
  consentGranted: boolean;
}

/**
 * Rejection reasons for invalid or untrusted GPS observations.
 */
export type ObservationRejectionReason =
  | 'ACCURACY_TOO_POOR'        // Horizontal accuracy > 75m
  | 'STALE_TIMESTAMP'          // Timestamp older than 30s or in future
  | 'OFF_CORRIDOR'             // Distance from rail track > 200m
  | 'IMPLAUSIBLE_SPEED'        // Speed > 130 km/h or retrograde
  | 'WRONG_DIRECTION'          // Progress ratio decreasing on uni-directional trip
  | 'SESSION_INACTIVE';        // Session expired or stopped

/**
 * Output of edge GPS validation against railway geometry.
 */
export interface ObservationValidationResult {
  /** Whether the observation passed all filters */
  isValid: boolean;
  /** Specific reason if rejected */
  rejectionReason?: ObservationRejectionReason;
  /** Perpendicular distance from physical railway track (meters) */
  distanceFromTrackMeters: number;
  /** Station closest to this observation */
  nearestStationId: string;
  /** Segment start station code */
  segmentFromStationId: string;
  /** Segment end station code */
  segmentToStationId: string;
  /** Traversal fraction of current segment (0.0 to 1.0) */
  segmentRatio: number;
}

/**
 * Validated crowdsourced payload transmitted to ingestion service.
 */
export interface CrowdsourcedLocationPayload {
  sessionId: string;
  trainNumber: string;
  routeId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speedKmh: number | null;
  heading: number | null;
  segmentFrom: string;
  segmentTo: string;
  segmentRatio: number;
  timestamp: number;
}

/**
 * Aggregated live train report consumed by waiting passengers.
 */
export interface AggregatedTrainLiveReport {
  trainNumber: string;
  routeId: string;
  /** Data provenance: crowdsourced live vs pure schedule estimation */
  source: 'CROWDSOURCED_GPS' | 'SCHEDULE_ESTIMATE';
  /** Confidence score based on reporter consensus and freshness */
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  /** Number of distinct active passenger devices confirming this location */
  activeContributors: number;
  /** Last update timestamp (epoch ms) */
  lastUpdatedAt: number;
  /** Whether report is stale (> 3 minutes without new update) */
  isStale: boolean;
  /** Current / last passed station */
  currentStationId: string;
  /** Next upcoming station */
  nextStationId: string;
  /** Traversal percentage along entire route (0 - 100) */
  overallProgress: number;
  /** Delay relative to timetable (+mins = late, -mins = early) */
  delayMinutes: number;
  /** Estimated arrival times for upcoming stops keyed by stationId */
  estimatedArrivals: Record<string, string>;
}

