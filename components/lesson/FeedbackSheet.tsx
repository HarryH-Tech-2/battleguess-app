import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Check, X } from 'lucide-react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import { ChunkyButton } from '@/components/ui/ChunkyButton';

interface Props {
  kind: 'correct' | 'wrong';
  title: string;
  mascotLine?: string;
  mascotImage?: ImageSourcePropType;
  explanation: string;
  buttonLabel: string;
  onContinue: () => void;
  bottomInset: number;
}

/** Slides up from the bottom after an answer is checked, Duolingo-style. */
export function FeedbackSheet({
  kind,
  title,
  mascotLine,
  mascotImage,
  explanation,
  buttonLabel,
  onContinue,
  bottomInset,
}: Props) {
  const { colors, reducedMotion, fontScale } = useSettings();
  const slide = useRef(new Animated.Value(reducedMotion ? 0 : 1)).current;
  const pop = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 5 }),
      Animated.sequence([
        Animated.delay(120),
        Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 12 }),
      ]),
    ]).start();
  }, [slide, pop, reducedMotion]);

  const good = kind === 'correct';
  const bg = good ? colors.success : colors.error;
  const dark = good ? colors.successDark : colors.errorDark;

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          backgroundColor: bg,
          paddingBottom: bottomInset + 16,
          transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 320] }) }],
        },
      ]}
    >
      <View style={styles.row}>
        <Animated.View style={[styles.avatarWrap, { borderColor: 'rgba(255,255,255,0.7)', backgroundColor: dark, transform: [{ scale: pop }] }]}>
          {mascotImage ? (
            <Image source={mascotImage} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <View style={styles.iconFallback}>
              {good ? <Check size={26} color="#fff" strokeWidth={3} /> : <X size={26} color="#fff" strokeWidth={3} />}
            </View>
          )}
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontSize: 20 * fontScale }]}>{title}</Text>
          {mascotLine ? <Text style={[styles.mascotLine, { fontSize: 13 * fontScale }]}>{mascotLine}</Text> : null}
        </View>
      </View>
      {explanation ? (
        <Text style={[styles.explanation, { fontSize: 15 * fontScale }]} numberOfLines={4}>
          {explanation}
        </Text>
      ) : null}
      <ChunkyButton label={buttonLabel} variant="parchment" onPress={onContinue} textStyle={{ color: dark }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 14,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    overflow: 'hidden',
  },
  iconFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bodyBlack,
    color: '#fff',
  },
  mascotLine: {
    fontFamily: fonts.bodySemi,
    color: 'rgba(255,255,255,0.88)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  explanation: {
    fontFamily: fonts.bodySemi,
    color: '#fff',
    lineHeight: 21,
  },
});
