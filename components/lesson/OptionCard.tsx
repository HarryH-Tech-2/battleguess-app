import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import { tap } from '@/utils/haptics';

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'muted' | 'paired' | 'receivable';

interface Props {
  label: string;
  status?: OptionStatus;
  disabled?: boolean;
  onPress?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  align?: 'left' | 'center';
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A parchment answer card with a thick lower edge that presses in. Colour tells the
 * state: brass when chosen, laurel when right, crimson when wrong.
 */
export function OptionCard({
  label,
  status = 'idle',
  disabled,
  onPress,
  left,
  right,
  align = 'left',
  compact,
  style,
}: Props) {
  const { colors, haptics, fontScale, reducedMotion } = useSettings();
  const press = useRef(new Animated.Value(0)).current;
  const EDGE = 4;

  const face = (() => {
    switch (status) {
      case 'selected':
        return { bg: colors.optionSelected, edge: colors.brassDark, border: colors.brass, text: colors.optionText };
      case 'paired':
        return { bg: colors.optionSelected, edge: colors.brassDark, border: colors.brass, text: colors.optionText };
      case 'receivable':
        return { bg: colors.option, edge: colors.brass, border: colors.brass, text: colors.optionText };
      case 'correct':
        return { bg: '#E3F4E7', edge: colors.successDark, border: colors.success, text: '#1F5B31' };
      case 'wrong':
        return { bg: '#FBE3E3', edge: colors.errorDark, border: colors.error, text: '#7A1F23' };
      case 'muted':
        return { bg: colors.option, edge: colors.optionEdge, border: colors.optionEdge, text: colors.textOnParchmentSoft };
      default:
        return { bg: colors.option, edge: colors.optionEdge, border: colors.optionEdge, text: colors.optionText };
    }
  })();

  const animate = (v: number) => {
    if (reducedMotion) {
      press.setValue(v);
      return;
    }
    Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };

  return (
    <Pressable
      disabled={disabled || !onPress}
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onPress={() => {
        if (haptics) tap();
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: status === 'selected' || status === 'paired', disabled: !!disabled }}
      style={[{ opacity: status === 'muted' ? 0.65 : 1 }, style]}
    >
      <View style={{ paddingBottom: EDGE }}>
        <View style={[styles.edge, { backgroundColor: face.edge, top: EDGE }]} />
        <Animated.View
          style={[
            styles.face,
            {
              backgroundColor: face.bg,
              borderColor: face.border,
              minHeight: compact ? 52 : 60,
              justifyContent: align === 'center' ? 'center' : 'flex-start',
              transform: [{ translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, EDGE] }) }],
            },
          ]}
        >
          {left ? <View style={styles.side}>{left}</View> : null}
          <Text
            style={[
              styles.label,
              {
                color: face.text,
                fontSize: (compact ? 14 : 16) * fontScale,
                textAlign: align,
                flex: align === 'left' ? 1 : undefined,
              },
            ]}
          >
            {label}
          </Text>
          {right ? <View style={styles.side}>{right}</View> : null}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  label: {
    fontFamily: fonts.bodyBold,
    lineHeight: 22,
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
