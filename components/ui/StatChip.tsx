import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';

interface Props {
  icon: React.ReactNode;
  value: string | number;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/** Compact stat pill for the top bar: streak, XP, hearts. */
export function StatChip({ icon, value, color, onPress, accessibilityLabel }: Props) {
  const { colors, fontScale } = useSettings();
  const inner = (
    <View
      style={[
        styles.chip,
        { backgroundColor: colors.glass, borderColor: colors.glassBorder },
      ]}
    >
      {icon}
      <Text
        style={[styles.value, { color: color ?? colors.text, fontSize: 15 * fontScale }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  value: {
    fontFamily: fonts.bodyBlack,
    fontVariant: ['tabular-nums'],
  },
});
