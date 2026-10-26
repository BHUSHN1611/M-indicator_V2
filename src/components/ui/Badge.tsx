import React from "react";
import { View, Text } from "react-native";
import { colors } from "@/theme";

interface BadgeProps {
  label: string;
  isLive?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ label, isLive }) => {
  if (isLive) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.liveGreenBg,
          borderColor: colors.liveGreenBorder,
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
        }}
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.liveGreen }} />
        <Text style={{ color: colors.liveGreen, fontSize: 10, fontWeight: "600", fontFamily: "monospace" }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.signalRedBadge,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
      }}
    >
      <Text style={{ color: colors.ivory, fontSize: 10, fontWeight: "600", fontFamily: "monospace" }}>
        {label}
      </Text>
    </View>
  );
};
