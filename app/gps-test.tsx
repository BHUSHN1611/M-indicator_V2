import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { getCurrentLocation, GPSObservation } from "../utils/gps/location";
import { findCurrentSegment } from "@/utils/gps/routeDetector";

export default function GPSTestScreen() {
  const [location, setLocation] = useState<GPSObservation | null>(null);
  const [error, setError] = useState("");
  // const[data,setData] = useState("")

  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const getLocation = async () => {
    try {
      setError("");

      const result = await getCurrentLocation();

      setLocation(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to get location"
      );
    }
  };

  const segment = findCurrentSegment(Number(latitude),Number(longitude));
  console.log(segment);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center",backgroundColor:"white" }}>
      <Button title="Get GPS Location" onPress={getLocation} />

      {location && (
        <View style={{ marginTop: 20 }}>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Accuracy: {location.accuracy} m</Text>
          <Text>Speed: {location.speed ?? "N/A"}</Text>
          <Text>Heading: {location.heading ?? "N/A"}</Text>
        </View>
      )}
      {/* <Text>Heading: {data}</Text> */}
      {error !== "" && (
        <Text style={{ marginTop: 20 }}>
          Error: {error}
        </Text>
      )}
    </View>
  );
}