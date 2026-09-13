import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts } from '@/constants/theme';

type Tone = 'default' | 'secondary' | 'muted' | 'brass' | 'onParchment' | 'onParchmentSoft' | 'inverse';

interface Props extends TextProps {
  tone?: Tone;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

function useToneColor(tone: Tone, override?: string) {
  const { colors } = useSettings();
  if (override) return override;
  switch (tone) {
    case 'secondary':
      return colors.textSecondary;
    case 'muted':
      return colors.textMuted;
    case 'brass':
      return colors.brass;
    case 'onParchment':
      return colors.textOnParchment;
    case 'onParchmentSoft':
      return colors.textOnParchmentSoft;
    case 'inverse':
      return colors.textOnAccent;
    default:
      return colors.text;
  }
}

/** Cinzel display text for titles, chapter names and hero numbers. */
export function Display({ tone = 'default', size = 28, color, align, style, ...rest }: Props) {
  const { fontScale } = useSettings();
  const c = useToneColor(tone, color);
  return (
    <Text
      {...rest}
      style={[
        styles.display,
        { color: c, fontSize: size * fontScale, lineHeight: size * fontScale * 1.2, textAlign: align },
        style,
      ]}
    />
  );
}

/** Nunito body text. */
export function Body({ tone = 'default', size = 15, color, align, style, ...rest }: Props) {
  const { fontScale } = useSettings();
  const c = useToneColor(tone, color);
  return (
    <Text
      {...rest}
      style={[
        styles.body,
        { color: c, fontSize: size * fontScale, lineHeight: size * fontScale * 1.45, textAlign: align },
        style,
      ]}
    />
  );
}

/** Nunito bold, for labels, buttons and stat values. */
export function Strong({ tone = 'default', size = 15, color, align, style, ...rest }: Props) {
  const { fontScale } = useSettings();
  const c = useToneColor(tone, color);
  return (
    <Text
      {...rest}
      style={[
        styles.strong,
        { color: c, fontSize: size * fontScale, lineHeight: size * fontScale * 1.35, textAlign: align },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: fonts.body,
  },
  strong: {
    fontFamily: fonts.bodyBold,
  },
});
