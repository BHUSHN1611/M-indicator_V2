import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function usePulse(active: boolean): Animated.Value {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity]);

  return opacity;
}
