export type RailwayZone = 'WR' | 'CR' | 'HR' | 'TR';

export interface Station {
  /** Unique station identifier (canonical code, e.g. 'VR', 'DRD') */
  id: string;
  /** Primary display name (e.g. 'Virar', 'Dahanu Road') */
  name: string;
  /** Official Indian Railways station code */
  code: string;
  /** Alternate aliases/spellings for search matching (e.g. ['Dahanu', 'Dhanu Road']) */
  aliases?: string[];
  /** Latitude coordinate for GPS tracking & map rendering */
  lat?: number;
  /** Longitude coordinate for GPS tracking & map rendering */
  lng?: number;
  /** Railway zone */
  zone: RailwayZone;
  /** Whether this station is a major junction or express/fast stop */
  isMajor?: boolean;
}
