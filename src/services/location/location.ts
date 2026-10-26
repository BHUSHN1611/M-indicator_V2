import * as Location from "expo-location";

export interface GPSObservation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

export type LocationPermissionStatus = "granted" | "denied" | "undetermined";

/**
 * Checks current foreground permission status without prompting user.
 */
export async function checkLocationPermission(): Promise<{
  status: LocationPermissionStatus;
  canAskAgain: boolean;
}> {
  const perm = await Location.getForegroundPermissionsAsync();
  return {
    status: perm.status as LocationPermissionStatus,
    canAskAgain: perm.canAskAgain,
  };
}

/**
 * Prompts user for foreground location permission if not already granted.
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

/**
 * Checks if device location services (GPS hardware / toggle) are enabled.
 */
export async function isLocationServicesEnabled(): Promise<boolean> {
  return await Location.hasServicesEnabledAsync();
}

/**
 * Fetches a single current location fix.
 */
export async function getCurrentLocation(): Promise<GPSObservation> {
  const servicesEnabled = await isLocationServicesEnabled();
  if (!servicesEnabled) {
    throw new Error("Device location services are disabled. Please turn on GPS in device settings.");
  }

  const isGranted = await requestLocationPermission();
  if (!isGranted) {
    throw new Error("Foreground location permission was denied.");
  }

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

/**
 * Subscribes to live foreground GPS updates.
 * Returns an unsubscribe cleanup function.
 */
export async function watchLocation(
  onLocation: (obs: GPSObservation) => void,
  onError?: (err: Error) => void
): Promise<() => void> {
  const servicesEnabled = await isLocationServicesEnabled();
  if (!servicesEnabled) {
    const err = new Error("Device location services are disabled. Please turn on GPS in device settings.");
    onError?.(err);
    throw err;
  }

  const isGranted = await requestLocationPermission();
  if (!isGranted) {
    const err = new Error("Foreground location permission was denied.");
    onError?.(err);
    throw err;
  }

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000,
      distanceInterval: 5,
    },
    (loc) => {
      onLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? 999,
        speed: loc.coords.speed,
        heading: loc.coords.heading,
        timestamp: loc.timestamp,
      });
    }
  );

  return () => {
    subscription.remove();
  };
}