import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { colors } from "@/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: colors.navyPanelAlt, borderColor: colors.borderNavy };
      case "outline":
        return { backgroundColor: "transparent", borderColor: colors.brass, borderWidth: 1 };
      case "primary":
      default:
        return { backgroundColor: colors.crimson };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        getVariantStyles(),
        style,
      ]}
      {...props}
    >
      <Text style={{ color: colors.ivory, fontWeight: "700", fontSize: 14 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
