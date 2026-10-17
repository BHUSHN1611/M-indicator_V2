import * as Location from "expo-location";

export interface GPSObservation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission was not granted");
  }

  return true;
}

export async function getCurrentLocation(): Promise<GPSObservation> {
  await requestLocationPermission();

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy ?? 999,
    speed: location.coords.speed,
    heading: location.coords.heading,
    timestamp: location.timestamp,
  };
}