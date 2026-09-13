import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect, Circle, Ellipse } from 'react-native-svg';
import { MapPin } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import type { MapTapStep } from '@/types';
import { tap } from '@/utils/haptics';

interface Props {
  step: MapTapStep;
  selected: string | null;
  feedback: 'none' | 'correct' | 'wrong';
  onSelect: (id: string) => void;
}

/**
 * A commander's chart: pins are placed by real latitude and longitude on a graticule,
 * so the player has to reason about where in the world the battle happened.
 */
export function MapTap({ step, selected, feedback, onSelect }: Props) {
  const { width } = useWindowDimensions();
  const { colors, haptics, fontScale } = useSettings();
  const W = width - 40;
  const H = Math.round(W * 0.58);

  // Fit the projection to the pins with generous padding, so nearby regions are readable.
  const lats = step.data.regions.map((r) => r.lat);
  const lngs = step.data.regions.map((r) => r.lng);
  const padLat = Math.max(12, (Math.max(...lats) - Math.min(...lats)) * 0.45);
  const padLng = Math.max(18, (Math.max(...lngs) - Math.min(...lngs)) * 0.35);
  const minLat = Math.min(...lats) - padLat;
  const maxLat = Math.max(...lats) + padLat;
  const minLng = Math.min(...lngs) - padLng;
  const maxLng = Math.max(...lngs) + padLng;

  const project = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * W,
    y: ((maxLat - lat) / (maxLat - minLat)) * H,
  });

  const gridLines: React.ReactNode[] = [];
  const stepDeg = maxLng - minLng > 90 ? 20 : 10;
  for (let lng = Math.ceil(minLng / stepDeg) * stepDeg; lng <= maxLng; lng += stepDeg) {
    const { x } = project(0, lng);
    gridLines.push(<Line key={`v${lng}`} x1={x} y1={0} x2={x} y2={H} stroke={colors.pathLine} strokeWidth={1} />);
  }
  for (let lat = Math.ceil(minLat / stepDeg) * stepDeg; lat <= maxLat; lat += stepDeg) {
    const { y } = project(lat, 0);
    gridLines.push(<Line key={`h${lat}`} x1={0} y1={y} x2={W} y2={y} stroke={colors.pathLine} strokeWidth={1} />);
  }

  return (
    <View style={[styles.chart, { width: W, height: H, backgroundColor: colors.bgRaised, borderColor: colors.surfaceBorder }]}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={W} height={H} fill={colors.bgSunken} />
        {gridLines}
        {step.data.regions.map((r) => {
          const p = project(r.lat, r.lng);
          return <Ellipse key={`s${r.id}`} cx={p.x} cy={p.y + 2} rx={18} ry={6} fill="rgba(0,0,0,0.35)" />;
        })}
        {feedback !== 'none'
          ? step.data.regions
              .filter((r) => r.id === step.data.correctRegionId)
              .map((r) => {
                const p = project(r.lat, r.lng);
                return <Circle key={`ring${r.id}`} cx={p.x} cy={p.y} r={26} stroke={colors.success} strokeWidth={3} fill="rgba(63,163,91,0.18)" />;
              })
          : null}
      </Svg>
      {step.data.regions.map((r) => {
        const p = project(r.lat, r.lng);
        const isSel = selected === r.id;
        const isCorrect = feedback !== 'none' && r.id === step.data.correctRegionId;
        const isWrong = feedback === 'wrong' && isSel;
        const color = isCorrect ? colors.success : isWrong ? colors.error : isSel ? colors.brass : colors.ember;
        const labelLeft = p.x > W * 0.6;
        return (
          <Pressable
            key={r.id}
            onPress={() => {
              if (feedback !== 'none') return;
              if (haptics) tap();
              onSelect(r.id);
            }}
            disabled={feedback !== 'none'}
            accessibilityRole="button"
            accessibilityLabel={r.name}
            accessibilityState={{ selected: isSel }}
            style={[styles.pinWrap, { left: p.x - 22, top: p.y - 40 }]}
          >
            <View style={[styles.pin, { transform: [{ scale: isSel || isCorrect ? 1.15 : 1 }] }]}>
              <MapPin size={36} color={color} fill={color} strokeWidth={1.5} />
              <View style={[styles.pinHole, { backgroundColor: colors.bgSunken }]} />
            </View>
            <View
              style={[
                styles.labelWrap,
                { backgroundColor: colors.option, borderColor: color },
                labelLeft ? { right: 44 } : { left: 44 },
              ]}
            >
              <Text style={[styles.label, { color: colors.optionText, fontSize: 12 * fontScale }]} numberOfLines={1}>
                {r.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    alignSelf: 'center',
  },
  pinWrap: {
    position: 'absolute',
    width: 44,
    height: 48,
    alignItems: 'center',
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHole: {
    position: 'absolute',
    top: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  labelWrap: {
    position: 'absolute',
    top: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    maxWidth: 130,
  },
  label: {
    fontFamily: fonts.bodyBlack,
  },
});
