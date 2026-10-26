import { findCurrentSegment } from "./routeDetector";

const MAX_DISTANCE_FROM_ROUTE = 150;

export function getTrainPosition(latitude: number,longitude: number) {
  const segment = findCurrentSegment(
    latitude,
    longitude
  );

  // User is too far away from railway
  if (
    segment.distanceFromRoute >
    MAX_DISTANCE_FROM_ROUTE
  ) {
    return {
      state: "OFF_ROUTE" as const,
      distanceFromRoute:
        segment.distanceFromRoute,
    };
  }

  return {
    state: "ON_ROUTE" as const,

    from: segment.from,
    to: segment.to,

    ratio: segment.ratio,

    distanceFromRoute:
      segment.distanceFromRoute,
  };
}


