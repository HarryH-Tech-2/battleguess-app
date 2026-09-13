import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { Topography } from './Topography';

interface Props {
  /** Optional painted backdrop shown behind the gradient (blurred, dimmed). */
  image?: ImageSourcePropType;
  /** Height the image occupies from the top; below it the ground colour takes over. */
  imageHeight?: number;
  /** Draw faint topographic contour lines over the ground. */
  topography?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * The "war room table": ink ground with an optional painted scene bleeding in from
 * the top. Every top-level screen sits on one of these.
 */
export function ScreenBackground({ image, imageHeight = 420, topography = true, style, children }: Props) {
  const { colors, isDarkMode } = useSettings();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }, style]}>
      {image ? (
        <View style={[styles.imageWrap, { height: imageHeight }]} pointerEvents="none">
          <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={isDarkMode ? 2 : 4} />
          <LinearGradient
            colors={[
              isDarkMode ? 'rgba(15,20,32,0.25)' : 'rgba(244,232,207,0.35)',
              isDarkMode ? 'rgba(15,20,32,0.65)' : 'rgba(244,232,207,0.7)',
              colors.bg,
            ]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}
      {topography ? <Topography /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  imageWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});
