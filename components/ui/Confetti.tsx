import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { palette } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';

const COLORS = [palette.brass, palette.brassLight, palette.ember, palette.parchment, palette.laurel, palette.crimson];

interface Piece {
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  drift: number;
  spin: number;
  round: boolean;
}

/**
 * A single burst of brass and parchment confetti that falls from the top of the
 * screen. Rendered with the core Animated API so it works in Expo Go without
 * extra native modules.
 */
export function Confetti({ count = 60, run = true }: { count?: number; run?: boolean }) {
  const { width, height } = useWindowDimensions();
  const { reducedMotion } = useSettings();
  const progress = useRef(new Animated.Value(0)).current;

  const pieces = useMemo<Piece[]>(() => {
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: count }, () => ({
      x: rnd() * width,
      delay: rnd() * 500,
      duration: 1800 + rnd() * 1400,
      size: 6 + rnd() * 8,
      color: COLORS[Math.floor(rnd() * COLORS.length)],
      drift: (rnd() - 0.5) * 140,
      spin: (rnd() - 0.5) * 720,
      round: rnd() > 0.6,
    }));
  }, [count, width]);

  useEffect(() => {
    if (!run || reducedMotion) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 3400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [run, progress, reducedMotion]);

  if (!run || reducedMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const start = p.delay / 3400;
        const end = Math.min(1, (p.delay + p.duration) / 3400);
        const translateY = progress.interpolate({
          inputRange: [0, start, end, 1],
          outputRange: [-40, -40, height + 40, height + 40],
        });
        const translateX = progress.interpolate({
          inputRange: [0, start, end, 1],
          outputRange: [0, 0, p.drift, p.drift],
        });
        const rotate = progress.interpolate({
          inputRange: [0, start, end, 1],
          outputRange: ['0deg', '0deg', `${p.spin}deg`, `${p.spin}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, start, start + 0.02, end - 0.1, end, 1],
          outputRange: [0, 0, 1, 1, 0, 0],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: 0,
              width: p.size,
              height: p.round ? p.size : p.size * 1.6,
              borderRadius: p.round ? p.size / 2 : 2,
              backgroundColor: p.color,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}
