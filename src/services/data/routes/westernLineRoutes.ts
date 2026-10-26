import { Route } from '@/types/route';

// Helper to construct route stops from station IDs
function buildStops(stationIds: string[]) {
  return stationIds.map((id, index) => ({
    stationId: id,
    sequence: index,
  }));
}

// 1. Virar -> Dahanu Road (DOWN)
export const ROUTE_VR_DRD_DN: Route = {
  id: 'WR_VR_DRD_DN',
  name: 'Virar → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'VR',
  destinationStationId: 'DRD',
  stops: buildStops(['VR', 'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD']),
};

// 2. Dahanu Road -> Virar (UP)
export const ROUTE_DRD_VR_UP: Route = {
  id: 'WR_DRD_VR_UP',
  name: 'Dahanu Road → Virar',
  line: 'WESTERN',
  direction: 'UP',
  originStationId: 'DRD',
  destinationStationId: 'VR',
  stops: buildStops(['DRD', 'VGN', 'BOR', 'UM', 'PLG', 'KVR', 'SPL', 'VTN', 'VR']),
};

// 3. Churchgate -> Dahanu Road (DOWN)
export const ROUTE_CCG_DRD_DN: Route = {
  id: 'WR_CCG_DRD_DN',
  name: 'Churchgate → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'CCG',
  destinationStationId: 'DRD',
  stops: buildStops([
    'CCG', 'MEL', 'CYR', 'GTR', 'MMCT', 'DDR', 'BA', 'ADH', 'BVI',
    'DIC', 'MIRA', 'BYR', 'NIG', 'VSR', 'NSP', 'VR',
    'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD',
  ]),
};

// 4. Borivali -> Dahanu Road (DOWN)
export const ROUTE_BVI_DRD_DN: Route = {
  id: 'WR_BVI_DRD_DN',
  name: 'Borivali → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'BVI',
  destinationStationId: 'DRD',
  stops: buildStops([
    'BVI', 'DIC', 'MIRA', 'BYR', 'NIG', 'VSR', 'NSP', 'VR',
    'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD',
  ]),
};

// 5. Dadar -> Dahanu Road (DOWN)
export const ROUTE_DDR_DRD_DN: Route = {
  id: 'WR_DDR_DRD_DN',
  name: 'Dadar → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'DDR',
  destinationStationId: 'DRD',
  stops: buildStops([
    'DDR', 'BA', 'ADH', 'BVI', 'BYR', 'VSR', 'VR',
    'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD',
  ]),
};

// 6. Bandra -> Dahanu Road (DOWN)
export const ROUTE_BA_DRD_DN: Route = {
  id: 'WR_BA_DRD_DN',
  name: 'Bandra → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'BA',
  destinationStationId: 'DRD',
  stops: buildStops([
    'BA', 'ADH', 'BVI', 'VSR', 'VR',
    'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD',
  ]),
};

// 7. Mumbai Central -> Dahanu Road (DOWN)
export const ROUTE_MMCT_DRD_DN: Route = {
  id: 'WR_MMCT_DRD_DN',
  name: 'Mumbai Central → Dahanu Road',
  line: 'WESTERN',
  direction: 'DOWN',
  originStationId: 'MMCT',
  destinationStationId: 'DRD',
  stops: buildStops([
    'MMCT', 'DDR', 'BA', 'ADH', 'BVI', 'VSR', 'VR',
    'VTN', 'SPL', 'KVR', 'PLG', 'UM', 'BOR', 'VGN', 'DRD',
  ]),
};

export const WESTERN_LINE_ROUTES: Route[] = [
  ROUTE_VR_DRD_DN,
  ROUTE_DRD_VR_UP,
  ROUTE_CCG_DRD_DN,
  ROUTE_BVI_DRD_DN,
  ROUTE_DDR_DRD_DN,
  ROUTE_BA_DRD_DN,
  ROUTE_MMCT_DRD_DN,
];
