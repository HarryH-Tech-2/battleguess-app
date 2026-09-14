import React, { useMemo, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
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

/** Horizontal inset so the end-of-track labels stay inside the card. */
const PAD = 30;
const THUMB = 40;
const LABEL_W = 64;

/** A brass-scaled timeline the player drags a marker along, with nudge buttons for exact years. */
export function TimelineSlider({ step, value, feedback, onChange }: Props) {
  const { colors, haptics, fontScale } = useSettings();
  const [trackWidth, setTrackWidth] = useState(300);
  const minYear = Number(step.data.minYear);
  const maxYear = Number(step.data.maxYear);
  const correctYear = Number(step.data.correctYear);
  const range = maxYear - minYear;
  const current = value ?? Math.round((minYear + maxYear) / 2);
  const pct = (current - minYear) / range;
  const correctPct = (correctYear - minYear) / range;
  const locked = feedback !== 'none';

  const clamp = (y: number) => Math.max(minYear, Math.min(maxYear, y));
  const yearFromX = (x: number) => {
    const p = Math.max(0, Math.min(1, (x - PAD) / trackWidth));
    return Math.round(minYear + p * range);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !locked,
        onMoveShouldSetPanResponder: () => !locked,
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
    [locked, minYear, maxYear, haptics, trackWidth]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(Math.max(1, e.nativeEvent.layout.width - PAD * 2));
  };

  const nudge = (delta: number) => {
    if (locked) return;
    onChange(clamp(current + delta));
    if (haptics) tap();
  };

  // Short ranges get one tick per year; longer ranges get five evenly spaced ticks.
  const ticks = useMemo(() => {
    const count = range <= 8 ? range + 1 : 5;
    return Array.from({ length: count }, (_, i) => {
      const p = count === 1 ? 0 : i / (count - 1);
      return { p, year: Math.round(minYear + p * range) };
    });
  }, [minYear, range]);

  const tone = feedback === 'correct' ? colors.success : feedback === 'wrong' ? colors.error : colors.brass;
  const thumbLeft = PAD + pct * trackWidth - THUMB / 2;
  const canMinus = !locked && current > minYear;
  const canPlus = !locked && current < maxYear;

  return (
    <View style={[styles.card, { backgroundColor: colors.option, borderColor: colors.optionEdge }]}>
      {/* Year readout with fine-adjust buttons */}
      <View style={styles.readout}>
        <NudgeButton icon="minus" enabled={canMinus} onPress={() => nudge(-1)} color={colors.brassDark} bg={colors.optionEdge} />
        <View style={styles.yearWrap}>
          <Text style={[styles.year, { color: tone, fontSize: 40 * fontScale }]}>{formatYear(current)}</Text>
          {feedback === 'wrong' ? (
            <Text style={[styles.hint, { color: colors.success, fontSize: 13 * fontScale }]}>{formatYear(correctYear)}</Text>
          ) : null}
        </View>
        <NudgeButton icon="plus" enabled={canPlus} onPress={() => nudge(1)} color={colors.brassDark} bg={colors.optionEdge} />
      </View>

      {/* Track */}
      <View style={styles.trackArea} onLayout={onLayout} {...pan.panHandlers}>
        <View style={[styles.track, { backgroundColor: colors.optionEdge, marginHorizontal: PAD }]}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: tone }]} />
          {ticks.map((tk, i) => (
            <View
              key={i}
              style={[
                styles.tick,
                { left: `${tk.p * 100}%`, backgroundColor: colors.textOnParchmentSoft },
                i === 0 || i === ticks.length - 1 ? styles.tickEnd : null,
              ]}
            />
          ))}
          {locked ? (
            <View style={[styles.answerMark, { left: `${correctPct * 100}%`, borderColor: colors.success, backgroundColor: colors.option }]}>
              <View style={[styles.answerDot, { backgroundColor: colors.success }]} />
            </View>
          ) : null}
        </View>
        <View style={[styles.thumb, { left: thumbLeft, backgroundColor: tone, borderColor: colors.option }]}>
          <View style={[styles.thumbGrip, { backgroundColor: colors.option }]} />
          <View style={[styles.thumbGrip, { backgroundColor: colors.option }]} />
        </View>
      </View>

      {/* Tick labels */}
      <View style={styles.labels}>
        {ticks.map((tk, i) => (
          <Text
            key={i}
            numberOfLines={1}
            style={[
              styles.label,
              {
                left: PAD + tk.p * trackWidth - LABEL_W / 2,
                color: colors.textOnParchmentSoft,
                fontSize: 11 * fontScale,
                opacity: i === 0 || i === ticks.length - 1 ? 1 : 0.8,
              },
            ]}
          >
            {formatYear(tk.year)}
          </Text>
        ))}
      </View>
    </View>
  );
}

function NudgeButton({
  icon,
  enabled,
  onPress,
  color,
  bg,
}: {
  icon: 'minus' | 'plus';
  enabled: boolean;
  onPress: () => void;
  color: string;
  bg: string;
}) {
  const Icon = icon === 'minus' ? Minus : Plus;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={icon === 'minus' ? 'Earlier year' : 'Later year'}
      disabled={!enabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.nudge, { backgroundColor: bg, opacity: !enabled ? 0.35 : pressed ? 0.7 : 1 }]}
    >
      <Icon size={20} color={color} strokeWidth={3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingVertical: 18,
    gap: 4,
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  yearWrap: { flex: 1, alignItems: 'center' },
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
  nudge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackArea: {
    height: 64,
    justifyContent: 'center',
    marginTop: 6,
  },
  track: {
    height: 14,
    borderRadius: 7,
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
  },
  tick: {
    position: 'absolute',
    top: -5,
    width: 2,
    height: 24,
    marginLeft: -1,
    opacity: 0.45,
    borderRadius: 1,
  },
  tickEnd: {
    top: -8,
    height: 30,
    opacity: 0.7,
  },
  answerMark: {
    position: 'absolute',
    top: -7,
    width: 28,
    height: 28,
    marginLeft: -14,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerDot: { width: 10, height: 10, borderRadius: 5 },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  thumbGrip: { width: 3, height: 14, borderRadius: 1.5, opacity: 0.85 },
  labels: {
    height: 18,
  },
  label: {
    position: 'absolute',
    top: 0,
    width: LABEL_W,
    textAlign: 'center',
    fontFamily: fonts.bodyBold,
    fontVariant: ['tabular-nums'],
  },
});
