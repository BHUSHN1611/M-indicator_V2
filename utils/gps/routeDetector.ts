import {VIRAR_DAHANU_STATIONS,Station,} from "../../data/station";

import {Coordinate,projectPointOntoSegment,} from "./geo";

export interface RouteSegment {
  from: Station;
  to: Station;

  ratio: number;

  distanceFromRoute: number;

  projectedPoint: Coordinate;
}

export function findCurrentSegment(latitude: number,longitude: number): RouteSegment {
  const gpsPoint = {
    lat: latitude,
    lng: longitude,
  };

  let bestSegment: RouteSegment | null = null;

  for (let i = 0;i < VIRAR_DAHANU_STATIONS.length - 1;i++) {
    const from = VIRAR_DAHANU_STATIONS[i];
    const to = VIRAR_DAHANU_STATIONS[i + 1];

    const projection = projectPointOntoSegment(
      gpsPoint,
      {
        lat: from.lat,
        lng: from.lng,
      },
      {
        lat: to.lat,
        lng: to.lng,
      }
    );

    if (
      !bestSegment ||
      projection.distanceFromLine <
        bestSegment.distanceFromRoute
    ) {
      bestSegment = {
        from,
        to,
        ratio: projection.ratio,
        distanceFromRoute: projection.distanceFromLine,
        projectedPoint: {
          lat: projection.lat,
          lng: projection.lng,
        },
      };
    }
  }

  if (!bestSegment) {
    throw new Error("Unable to determine route segment");
  }

  return bestSegment;
}

