import { Station } from '../../models/station';
import { WESTERN_LINE_STATIONS } from './westernLine';

// Master list of all stations in the application
export const ALL_STATIONS: Station[] = [
  ...WESTERN_LINE_STATIONS,
];

// O(1) Map by Station ID/Code
const stationsById = new Map<string, Station>();
// Map for fast lookup by uppercase name and alias
const stationsByNameOrAlias = new Map<string, Station>();

for (const station of ALL_STATIONS) {
  stationsById.set(station.id, station);
  stationsByNameOrAlias.set(station.name.toUpperCase().trim(), station);
  stationsByNameOrAlias.set(station.code.toUpperCase().trim(), station);

  if (station.aliases) {
    for (const alias of station.aliases) {
      stationsByNameOrAlias.set(alias.toUpperCase().trim(), station);
    }
  }
}

export const stationRepository = {
  /** Get all stations */
  getAll(): Station[] {
    return ALL_STATIONS;
  },

  /** Get a station by its canonical ID or IR Code (e.g. 'VR', 'DRD') */
  getById(id: string): Station | undefined {
    return stationsById.get(id);
  },

  /** Find a station by name or alias, case-insensitive */
  findByName(name: string): Station | undefined {
    if (!name) return undefined;
    return stationsByNameOrAlias.get(name.toUpperCase().trim());
  },

  /** Search stations by partial name query */
  search(query: string): Station[] {
    if (!query || query.trim().length === 0) return [];
    const clean = query.trim().toUpperCase();
    return ALL_STATIONS.filter((s) => {
      if (s.name.toUpperCase().includes(clean)) return true;
      if (s.code.toUpperCase().includes(clean)) return true;
      if (s.aliases?.some((a) => a.toUpperCase().includes(clean))) return true;
      return false;
    });
  },
};
