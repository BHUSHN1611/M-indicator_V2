import { useEffect, useState } from "react";
import { Animated } from "react-native";

export function usePulse(active: boolean): Animated.Value {
  const [opacity] = useState(() => new Animated.Value(1));

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
