import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";
import { colors } from "@/theme";

interface ScreenContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  edges = ["top"],
  ...props
}) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges} {...props}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navyDeep,
  },
});
