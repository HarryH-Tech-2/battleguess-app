import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { radius } from '@/constants/theme';

interface Props {
  /** 0..1 */
  value: number;
  color?: string;
  track?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** Animated horizontal progress with a glossy top highlight. */
export function ProgressBar({ value, color, track, height = 12, style }: Props) {
  const { colors, reducedMotion } = useSettings();
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    if (reducedMotion) {
      anim.setValue(value);
      return;
    }
    Animated.spring(anim, { toValue: value, useNativeDriver: false, speed: 10, bounciness: 4 }).start();
  }, [value, anim, reducedMotion]);

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: track ?? colors.bgSunken },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            borderRadius: height / 2,
            backgroundColor: color ?? colors.brass,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'], extrapolate: 'clamp' }),
          },
        ]}
      >
        <View style={[styles.gloss, { borderRadius: radius.pill, top: Math.max(2, height * 0.2) }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    minWidth: 6,
  },
  gloss: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
