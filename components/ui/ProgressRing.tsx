import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSettings } from '@/contexts/SettingsContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size: number;
  strokeWidth?: number;
  /** 0..1 */
  value: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}

/** Circular progress used around path nodes and stat tiles. */
export function ProgressRing({ size, strokeWidth = 5, value, color, track, children }: Props) {
  const { colors, reducedMotion } = useSettings();
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    if (reducedMotion) {
      anim.setValue(value);
      return;
    }
    Animated.timing(anim, { toValue: value, duration: 700, useNativeDriver: false }).start();
  }, [value, anim, reducedMotion]);

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={track ?? colors.bgSunken}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color ?? colors.brass}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={anim.interpolate({ inputRange: [0, 1], outputRange: [c, 0], extrapolate: 'clamp' })}
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
      {children}
    </Svg>
  );
}
