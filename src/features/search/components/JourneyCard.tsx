import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, styles } from "@/theme";
import { strings } from "@/i18n";

interface JourneyCardProps {
  fromStation: string;
  toStation: string;
  onChangeFromStation: (val: string) => void;
  onChangeToStation: (val: string) => void;
  onSwapStations: () => void;
  onSearch: () => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  fromStation,
  toStation,
  onChangeFromStation,
  onChangeToStation,
  onSwapStations,
  onSearch,
}) => {
  const [swapDirection, setSwapDirection] = useState(0);
  const [swapRotation] = useState(() => new Animated.Value(0));

  const handleSwap = () => {
    const nextDirection = swapDirection === 0 ? 1 : 0;
    setSwapDirection(nextDirection);

    Animated.timing(swapRotation, {
      toValue: nextDirection,
      duration: 320,
      useNativeDriver: true,
    }).start();

    onSwapStations();
  };

  const spin = useMemo(
    () =>
      swapRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
      }),
    [swapRotation]
  );

  return (
    <View style={styles.journeyCard}>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{strings.search.fromLabel}</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputIconDot}>
            <Ionicons
              name="radio-button-on"
              size={14}
              color={colors.brass}
            />
          </View>
          <TextInput
            value={fromStation}
            onChangeText={onChangeFromStation}
            placeholder={strings.search.fromPlaceholder}
            placeholderTextColor={colors.slate}
            style={styles.input}
          />
        </View>
      </View>

      {/* Swap control */}
      <View style={styles.swapSeam}>
        <View style={styles.seamLine} />
        <Pressable onPress={handleSwap} style={styles.swapButton}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons
              name="swap-vertical"
              size={18}
              color={colors.ivory}
            />
          </Animated.View>
        </Pressable>
        <View style={styles.seamLine} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{strings.search.toLabel}</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputIconDot}>
            <Ionicons name="flag" size={14} color={colors.crimson} />
          </View>
          <TextInput
            value={toStation}
            onChangeText={onChangeToStation}
            placeholder={strings.search.toPlaceholder}
            placeholderTextColor={colors.slate}
            style={styles.input}
          />
        </View>
      </View>

      <Pressable
        onPress={onSearch}
        style={({ pressed }) => [
          styles.searchCta,
          pressed && { opacity: 0.9 },
        ]}
      >
        <LinearGradient
          colors={[colors.crimson, colors.crimsonDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchCtaGradient}
        >
          <Ionicons name="search" size={16} color={colors.ivory} />
          <Text style={styles.searchCtaText}>{strings.common.findTrains}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};
