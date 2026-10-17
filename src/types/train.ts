export type TrainType = 'SLOW' | 'FAST' | 'AC' | 'MEMU' | 'EXP';

export interface TrainStopSchedule {
  /** Station ID referencing Station.id */
  stationId: string;
  /** Scheduled arrival/passing time in "HH:MM" (24h), or null if skipped */
  time: string | null;
  /** Scheduled departure time in "HH:MM" (optional if differs from arrival) */
  departureTime?: string | null;
  /** Platform number/identifier (e.g. "4", "PF 1") */
  platform?: string;
  /** Flag for prominent display in timelines */
  isMajor?: boolean;
  /** Flag indicating terminus/endpoint stop */
  isEndpoint?: boolean;
  /** Accent highlight flag */
  isHighlighted?: boolean;
}

export interface Train {
  /** Train number (e.g. "93001", "09051") */
  trainNumber: string;
  /** Route ID referencing Route.id */
  routeId: string;
  /** Display route label (e.g. "VR-DRD", "VIRAR - DAHANU ROAD") */
  routeLabel: string;
  /** Train service type */
  trainType: TrainType;
  /** Number of coaches / cars (e.g. 12, 15, 19) */
  cars: number | string;
  /** Origin station ID */
  originStationId: string;
  /** Destination station ID */
  destinationStationId: string;
  /** Scheduled initial departure time ("HH:MM") */
  departureTime: string;
  /** AM/PM period marker */
  departurePeriod?: 'AM' | 'PM';
  /** Scheduled final arrival time ("HH:MM") */
  arrivalTime: string;
  /** Ordered list of scheduled stops */
  stops: TrainStopSchedule[];
}
