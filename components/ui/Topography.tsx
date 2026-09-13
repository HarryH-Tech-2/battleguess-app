import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Faint contour lines, like a campaign map. Deterministic so it never flickers
 * between renders; cheap enough to sit under every screen.
 */
export function Topography({ opacity = 1 }: { opacity?: number }) {
  const { width, height } = useWindowDimensions();
  const { colors } = useSettings();

  const paths = useMemo(() => {
    const out: string[] = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const rows = Math.ceil(height / 90) + 2;
    for (let r = 0; r < rows; r++) {
      const baseY = r * 90 + rnd() * 30 - 40;
      let d = `M -20 ${baseY}`;
      let x = -20;
      while (x < width + 40) {
        const nx = x + 70 + rnd() * 60;
        const cy1 = baseY + (rnd() - 0.5) * 70;
        const cy2 = baseY + (rnd() - 0.5) * 70;
        const ny = baseY + (rnd() - 0.5) * 34;
        d += ` C ${x + 30} ${cy1}, ${nx - 30} ${cy2}, ${nx} ${ny}`;
        x = nx;
      }
      out.push(d);
    }
    return out;
  }, [width, height]);

  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      style={[StyleSheet.absoluteFill, { opacity }]}
    >
      {paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={colors.pathLine}
          strokeWidth={i % 3 === 0 ? 1.2 : 0.7}
          strokeOpacity={i % 3 === 0 ? 0.5 : 0.3}
          fill="none"
        />
      ))}
    </Svg>
  );
}
