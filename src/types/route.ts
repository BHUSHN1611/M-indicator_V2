export type LineType = 'WESTERN' | 'CENTRAL' | 'HARBOUR' | 'TRANS_HARBOUR';
export type RouteDirection = 'UP' | 'DOWN';

export interface RouteStopConfig {
  /** Station ID referencing Station.id */
  stationId: string;
  /** Distance from route origin in kilometers (if available) */
  distanceFromOriginKm?: number;
  /** Default platform at this station for this route */
  defaultPlatform?: string;
  /** Sequence index (0-based) along this route */
  sequence: number;
}

export interface Route {
  /** Unique route identifier, e.g. 'WR_VR_DRD_DN' */
  id: string;
  /** Human-readable route name, e.g. 'Virar → Dahanu Road' */
  name: string;
  /** Railway line */
  line: LineType;
  /** Route direction: DOWN (towards suburban terminus) or UP (towards city centre) */
  direction: RouteDirection;
  /** Origin station ID */
  originStationId: string;
  /** Destination station ID */
  destinationStationId: string;
  /** Ordered array of stops along this route */
  stops: RouteStopConfig[];
}
