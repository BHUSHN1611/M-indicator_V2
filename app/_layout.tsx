import "../global.css";
import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        contentStyle: { backgroundColor: colors.backgroundRoot },
      }}
    />
  );
}
