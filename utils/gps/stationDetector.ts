import {
  VIRAR_DAHANU_STATIONS,
  Station,
} from "../../data/station";

import {
  distanceBetweenPoints,
} from "./geo";

export interface NearestStationResult {
  station: Station;
  distanceMeters: number;
}

export function findNearestStation(
  latitude: number,
  longitude: number
): NearestStationResult {
  let nearestStation = VIRAR_DAHANU_STATIONS[0];
  let minimumDistance = Infinity;

  for (const station of VIRAR_DAHANU_STATIONS) {
    const distance = distanceBetweenPoints(
      {
        lat: latitude,
        lng: longitude,
      },
      {
        lat: station.lat,
        lng: station.lng,
      }
    );

    if (distance < minimumDistance) {
      minimumDistance = distance;
      nearestStation = station;
    }
  }

  return {
    station: nearestStation,
    distanceMeters: minimumDistance,
  };
}