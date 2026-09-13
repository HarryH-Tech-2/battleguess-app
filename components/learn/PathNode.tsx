import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, Text, Easing } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { Check, Lock, Crown, Star } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, palette } from '@/constants/theme';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { tap, warn } from '@/utils/haptics';

export type NodeState = 'locked' | 'available' | 'current' | 'complete';

interface Props {
  image?: ImageSourcePropType;
  state: NodeState;
  size?: number;
  /** 0..5 mastery crowns for a completed lesson. */
  mastery?: number;
  /** Progress ring 0..1 (used on chapter trunks). */
  ring?: number;
  label?: string;
  sublabel?: string;
  /** Tooltip shown above the current node. */
  tooltip?: string;
  onPress?: () => void;
}

/**
 * A "coin" on the campaign path: a painted battle scene inside a brass ring, sitting
 * on a chunky darker edge. The current node breathes and carries a bouncing tooltip.
 */
export function PathNode({
  image,
  state,
  size = 84,
  mastery = 0,
  ring,
  label,
  sublabel,
  tooltip,
  onPress,
}: Props) {
  const { colors, haptics, reducedMotion, fontScale } = useSettings();
  const press = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'current' || reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    const tip = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -6, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    tip.start();
    return () => {
      loop.stop();
      tip.stop();
    };
  }, [state, breathe, bounce, reducedMotion]);

  const EDGE = 6;
  const locked = state === 'locked';
  const ringColor =
    state === 'complete' ? colors.success : state === 'locked' ? colors.pathLockedEdge : colors.brass;
  const edgeColor =
    state === 'complete' ? colors.successDark : state === 'locked' ? colors.pathLockedEdge : colors.brassDark;

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const glow = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] });

  return (
    <View style={[styles.wrap, { width: size + 60 }]}>
      {tooltip && state === 'current' ? (
        <Animated.View
          style={[
            styles.tooltip,
            { backgroundColor: colors.option, borderColor: colors.optionEdge, transform: [{ translateY: bounce }] },
          ]}
        >
          <Text style={[styles.tooltipText, { color: colors.brassDark, fontSize: 12 * fontScale }]}>{tooltip}</Text>
          <View style={[styles.tooltipArrow, { borderTopColor: colors.option }]} />
        </Animated.View>
      ) : null}

      <Pressable
        onPressIn={() => {
          if (locked) return;
          Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        }}
        onPressOut={() => Animated.spring(press, { toValue: 0, useNativeDriver: true, speed: 50, bounciness: 6 }).start()}
        onPress={() => {
          if (locked) {
            if (haptics) warn();
            return;
          }
          if (haptics) tap();
          onPress?.();
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: locked }}
        style={{ width: size, height: size + EDGE }}
      >
        {state === 'current' ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                width: size + 28,
                height: size + 28,
                borderRadius: (size + 28) / 2,
                left: -14,
                top: -14 + EDGE / 2,
                backgroundColor: colors.brass,
                opacity: glow,
                transform: [{ scale }],
              },
            ]}
          />
        ) : null}
        <View style={[styles.edge, { backgroundColor: edgeColor, width: size, height: size, borderRadius: size / 2, top: EDGE }]} />
        <Animated.View
          style={[
            styles.coin,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: locked ? colors.pathLocked : colors.bgRaised,
              borderColor: ringColor,
              transform: [
                { translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, EDGE] }) },
                { scale: state === 'current' ? scale : 1 },
              ],
            },
          ]}
        >
          {image ? (
            <Image
              source={image}
              style={[StyleSheet.absoluteFill, { opacity: locked ? 0.28 : 1 }]}
              contentFit="cover"
              transition={200}
            />
          ) : null}
          {locked ? (
            <View style={styles.center}>
              <Lock size={size * 0.3} color={colors.textSecondary} strokeWidth={2.4} />
            </View>
          ) : null}
          {state === 'complete' ? (
            <View style={[styles.checkBadge, { backgroundColor: colors.success, borderColor: colors.bg }]}>
              <Check size={14} color="#fff" strokeWidth={3.5} />
            </View>
          ) : null}
          {typeof ring === 'number' ? (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <ProgressRing size={size} strokeWidth={4} value={ring} color={colors.brassLight} track="rgba(0,0,0,0.35)" />
            </View>
          ) : null}
        </Animated.View>
        {mastery > 0 && state === 'complete' ? (
          <View style={[styles.crowns, { backgroundColor: colors.bgRaised, borderColor: colors.brass }]}>
            <Crown size={11} color={palette.brassLight} fill={palette.brassLight} />
            <Text style={[styles.crownText, { color: colors.brassLight }]}>{mastery}</Text>
          </View>
        ) : null}
        {state === 'available' ? (
          <View style={[styles.starBadge, { backgroundColor: colors.ember, borderColor: colors.bg }]}>
            <Star size={12} color="#fff" fill="#fff" />
          </View>
        ) : null}
      </Pressable>

      {label ? (
        <Text
          style={[
            styles.label,
            { color: locked ? colors.textMuted : colors.text, fontSize: 13 * fontScale },
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      ) : null}
      {sublabel ? (
        <Text style={[styles.sublabel, { color: colors.textMuted, fontSize: 11 * fontScale }]} numberOfLines={1}>
          {sublabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
  },
  edge: {
    position: 'absolute',
    left: 0,
  },
  coin: {
    overflow: 'hidden',
    borderWidth: 4,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crowns: {
    position: 'absolute',
    left: -6,
    top: -4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  crownText: {
    fontFamily: fonts.bodyBlack,
    fontSize: 11,
  },
  tooltip: {
    position: 'absolute',
    top: -38,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  tooltipText: {
    fontFamily: fonts.bodyBlack,
    letterSpacing: 0.4,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  label: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    textAlign: 'center',
    lineHeight: 17,
  },
  sublabel: {
    marginTop: 2,
    fontFamily: fonts.bodySemi,
    textAlign: 'center',
  },
});
