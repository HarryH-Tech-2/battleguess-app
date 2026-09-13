import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import { tap } from '@/utils/haptics';

type Variant = 'ember' | 'brass' | 'laurel' | 'crimson' | 'ghost' | 'parchment';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'md' | 'lg';
  /** Fill the row. */
  block?: boolean;
  testID?: string;
}

/**
 * The app's one button. A solid slab with a darker bottom edge that physically
 * presses down, like a game-console key.
 */
export function ChunkyButton({
  label,
  onPress,
  variant = 'ember',
  disabled,
  icon,
  iconRight,
  style,
  textStyle,
  size = 'lg',
  block = true,
  testID,
}: Props) {
  const { colors, haptics, reducedMotion } = useSettings();
  const press = useRef(new Animated.Value(0)).current;

  const face = {
    ember: { bg: colors.ember, edge: colors.emberDark, text: colors.textOnAccent },
    brass: { bg: colors.brass, edge: colors.brassDark, text: '#2B2419' },
    laurel: { bg: colors.success, edge: colors.successDark, text: colors.textOnAccent },
    crimson: { bg: colors.error, edge: colors.errorDark, text: colors.textOnAccent },
    parchment: { bg: colors.option, edge: colors.optionEdge, text: colors.optionText },
    ghost: { bg: 'transparent', edge: 'transparent', text: colors.textSecondary },
  }[variant];

  const EDGE = variant === 'ghost' ? 0 : 5;
  const height = size === 'lg' ? 56 : 46;

  const animateTo = (v: number) => {
    if (reducedMotion) {
      press.setValue(v);
      return;
    }
    Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      onPress={() => {
        if (haptics) tap();
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[block ? styles.block : null, { opacity: disabled ? 0.45 : 1 }, style]}
    >
      <View style={{ height: height + EDGE }}>
        {EDGE > 0 ? (
          <View
            style={[
              styles.edge,
              {
                backgroundColor: face.edge,
                height,
                top: EDGE,
                borderRadius: radius.md,
                borderWidth: variant === 'ghost' ? 1 : 0,
              },
            ]}
          />
        ) : null}
        <Animated.View
          style={[
            styles.face,
            {
              backgroundColor: face.bg,
              height,
              borderRadius: radius.md,
              transform: [{ translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, EDGE] }) }],
              borderWidth: variant === 'ghost' ? 2 : 0,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text
            style={[
              styles.label,
              { color: face.text, fontSize: size === 'lg' ? 17 : 15 },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    alignSelf: 'stretch',
  },
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  label: {
    fontFamily: fonts.bodyBlack,
    letterSpacing: 0.3,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
