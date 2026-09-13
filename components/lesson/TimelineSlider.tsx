import React, { useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import type { TimelineSliderStep } from '@/types';
import { tap, thud } from '@/utils/haptics';

interface Props {
  step: TimelineSliderStep;
  value: number | null;
  feedback: 'none' | 'correct' | 'wrong';
  onChange: (year: number) => void;
}

export const formatYear = (y: number) => (y < 0 ? `${Math.abs(y)} BC` : y < 1000 ? `${y} AD` : `${y}`);

/** A brass-scaled timeline the player drags a marker along. */
export function TimelineSlider({ step, value, feedback, onChange }: Props) {
  const { colors, haptics, fontScale } = useSettings();
  const trackWidth = useRef(300);
  const minYear = Number(step.data.minYear);
  const maxYear = Number(step.data.maxYear);
  const correctYear = Number(step.data.correctYear);
  const range = maxYear - minYear;
  const current = value ?? Math.round((minYear + maxYear) / 2);
  const pct = (current - minYear) / range;
  const correctPct = (correctYear - minYear) / range;

  const PAD = 18;
  const yearFromX = (x: number) => {
    const p = Math.max(0, Math.min(1, (x - PAD) / trackWidth.current));
    return Math.round(minYear + p * range);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => feedback === 'none',
        onMoveShouldSetPanResponder: () => feedback === 'none',
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          onChange(yearFromX(e.nativeEvent.locationX));
          if (haptics) tap();
        },
        onPanResponderMove: (e) => onChange(yearFromX(e.nativeEvent.locationX)),
        onPanResponderRelease: () => {
          if (haptics) thud();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedback, minYear, maxYear, haptics]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width - PAD * 2;
  };

  const ticks = 5;
  const tone = feedback === 'correct' ? colors.success : feedback === 'wrong' ? colors.error : colors.brass;

  return (
    <View style={[styles.card, { backgroundColor: colors.option, borderColor: colors.optionEdge }]}>
      <Text style={[styles.year, { color: tone, fontSize: 40 * fontScale }]}>{formatYear(current)}</Text>
      {feedback === 'wrong' ? (
        <Text style={[styles.hint, { color: colors.textOnParchmentSoft, fontSize: 13 * fontScale }]}>
          {formatYear(correctYear)}
        </Text>
      ) : null}
      <View style={styles.trackArea} onLayout={onLayout} {...pan.panHandlers}>
        <View style={[styles.track, { backgroundColor: colors.optionEdge, marginHorizontal: PAD }]}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: tone }]} />
          {Array.from({ length: ticks }, (_, i) => (
            <View
              key={i}
              style={[styles.tick, { left: `${(i / (ticks - 1)) * 100}%`, backgroundColor: colors.textOnParchmentSoft }]}
            />
          ))}
          {feedback !== 'none' ? (
            <View style={[styles.answerMark, { left: `${correctPct * 100}%`, borderColor: colors.success }]} />
          ) : null}
        </View>
        <View style={[styles.thumb, { left: PAD + pct * trackWidth.current - 18, backgroundColor: tone, borderColor: colors.option }]} />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: colors.textOnParchmentSoft, fontSize: 12 * fontScale }]}>{formatYear(minYear)}</Text>
        <Text style={[styles.label, { color: colors.textOnParchmentSoft, fontSize: 12 * fontScale }]}>{formatYear(maxYear)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingVertical: 18,
    gap: 6,
  },
  year: {
    fontFamily: fonts.display,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontFamily: fonts.bodyBold,
    textAlign: 'center',
    marginTop: -4,
  },
  trackArea: {
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
  },
  track: {
    height: 12,
    borderRadius: 6,
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  tick: {
    position: 'absolute',
    top: -6,
    width: 2,
    height: 24,
    marginLeft: -1,
    opacity: 0.5,
    borderRadius: 1,
  },
  answerMark: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 32,
    marginLeft: -16,
    borderRadius: 16,
    borderWidth: 3,
  },
  thumb: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  label: {
    fontFamily: fonts.bodyBold,
  },
});
