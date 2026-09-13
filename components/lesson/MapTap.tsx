import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect, Circle, Ellipse, Path } from 'react-native-svg';
import { MapPin } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import type { MapTapStep } from '@/types';
import { WORLD_LAND } from '@/mocks/worldLand';
import { tap } from '@/utils/haptics';

interface Props {
  step: MapTapStep;
  selected: string | null;
  feedback: 'none' | 'correct' | 'wrong';
  onSelect: (id: string) => void;
}

const LABEL_W = 120;
// Cap the chart so it stays a readable map on tablets and web, not a wall of grid.
const MAX_W = 440;

/**
 * A commander's chart: pins are placed by real latitude and longitude on a graticule,
 * so the player has to reason about where in the world the battle happened.
 */
export function MapTap({ step, selected, feedback, onSelect }: Props) {
  const { width } = useWindowDimensions();
  const { colors, haptics, fontScale } = useSettings();
  const W = Math.min(width - 40, MAX_W);
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

  // Coastlines from Natural Earth, projected with the same math as the pins so land and
  // markers always agree. Rings fully outside the viewport are skipped.
  const landPath = useMemo(() => {
    const parts: string[] = [];
    for (const ring of WORLD_LAND) {
      let rMinLng = Infinity;
      let rMaxLng = -Infinity;
      let rMinLat = Infinity;
      let rMaxLat = -Infinity;
      for (let i = 0; i < ring.length; i += 2) {
        const lng = ring[i];
        const lat = ring[i + 1];
        if (lng < rMinLng) rMinLng = lng;
        if (lng > rMaxLng) rMaxLng = lng;
        if (lat < rMinLat) rMinLat = lat;
        if (lat > rMaxLat) rMaxLat = lat;
      }
      if (rMaxLng < minLng || rMinLng > maxLng || rMaxLat < minLat || rMinLat > maxLat) continue;
      let d = '';
      for (let i = 0; i < ring.length; i += 2) {
        const { x, y } = project(ring[i + 1], ring[i]);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      parts.push(d + 'Z');
    }
    return parts.join('');
    // project is derived from these bounds and the chart size.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minLng, maxLng, minLat, maxLat, W, H]);

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

  // Labels sit centred under their pin. When two pins are close, the later one (by x)
  // flips its label above the pin so the two never overlap. Pins near the bottom edge
  // also flip above so the label stays inside the chart.
  const placed = step.data.regions
    .map((r) => ({ r, p: project(r.lat, r.lng) }))
    .sort((a, b) => a.p.x - b.p.x);
  const labelAbove = new Map<string, boolean>();
  placed.forEach((cur, i) => {
    let above = cur.p.y > H - 44;
    for (let j = 0; j < i && !above; j++) {
      const prev = placed[j];
      const close = Math.abs(prev.p.x - cur.p.x) < LABEL_W && Math.abs(prev.p.y - cur.p.y) < 56;
      if (close && !labelAbove.get(prev.r.id)) above = true;
    }
    if (above && cur.p.y < 70) above = false;
    labelAbove.set(cur.r.id, above);
  });

  return (
    <View style={[styles.chart, { width: W, height: H, backgroundColor: colors.bgRaised, borderColor: colors.surfaceBorder }]}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={W} height={H} fill={colors.mapSea} />
        <Path d={landPath} fill={colors.mapLand} stroke={colors.mapCoast} strokeWidth={1} fillRule="evenodd" />
        {gridLines}
        {step.data.regions.map((r) => {
          const p = project(r.lat, r.lng);
          return <Ellipse key={`s${r.id}`} cx={p.x} cy={p.y + 2} rx={18} ry={6} fill="rgba(0,0,0,0.22)" />;
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
        const above = labelAbove.get(r.id) ?? false;
        return (
          <View key={r.id} pointerEvents="box-none" style={[styles.pinWrap, { left: p.x - LABEL_W / 2, top: p.y - 40 }]}>
            <Pressable
              onPress={() => {
                if (feedback !== 'none') return;
                if (haptics) tap();
                onSelect(r.id);
              }}
              disabled={feedback !== 'none'}
              accessibilityRole="button"
              accessibilityLabel={r.name}
              accessibilityState={{ selected: isSel }}
              hitSlop={6}
              style={[styles.pin, { transform: [{ scale: isSel || isCorrect ? 1.15 : 1 }] }]}
            >
              <MapPin size={36} color={color} fill={color} strokeWidth={1.5} />
              <View style={[styles.pinHole, { backgroundColor: colors.bgSunken }]} />
            </Pressable>
            <View
              pointerEvents="none"
              style={[
                styles.labelWrap,
                { backgroundColor: colors.option, borderColor: color },
                above ? { bottom: 52 } : { top: 40 },
              ]}
            >
              <Text style={[styles.label, { color: colors.optionText, fontSize: 12 * fontScale }]} numberOfLines={1}>
                {r.name}
              </Text>
            </View>
          </View>
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
    width: LABEL_W,
    height: 48,
    alignItems: 'center',
  },
  pin: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHole: {
    position: 'absolute',
    top: 14,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  labelWrap: {
    position: 'absolute',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    maxWidth: LABEL_W,
  },
  label: {
    fontFamily: fonts.bodyBlack,
  },
});
