export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * Distance between two coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export function distanceBetweenPoints(a: Coordinate,b: Coordinate): number {
  const R = 6371000;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const deltaLat = ((b.lat - a.lat) * Math.PI) / 180;
  const deltaLng = ((b.lng - a.lng) * Math.PI) / 180;

  const x =Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + 
  Math.cos(lat1) *Math.cos(lat2) *Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * y;
}
export interface ProjectionResult {
  lat: number;
  lng: number;
  ratio: number;
  distanceFromLine: number;
}

export function projectPointOntoSegment(
  point: Coordinate,
  start: Coordinate,
  end: Coordinate
): ProjectionResult {
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;

  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return {
      lat: start.lat,
      lng: start.lng,
      ratio: 0,
      distanceFromLine: distanceBetweenPoints(point, start),
    };
  }

  let ratio =
    ((point.lng - start.lng) * dx +
      (point.lat - start.lat) * dy) /
    lengthSquared;

  // Keep projection inside the segment
  ratio = Math.max(0, Math.min(1, ratio));

  const projected = {
    lat: start.lat + ratio * dy,
    lng: start.lng + ratio * dx,
  };

  return {
    lat: projected.lat,
    lng: projected.lng,
    ratio,
    distanceFromLine: distanceBetweenPoints(
      point,
      projected
    ),
  };
}