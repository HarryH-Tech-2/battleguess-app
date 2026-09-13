import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ImageSourcePropType } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { fonts, radius } from '@/constants/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props {
  index: number;
  chapterLabel: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  emblem?: ImageSourcePropType;
  completed: number;
  total: number;
  progressLabel: string;
  locked?: boolean;
  lockedHint?: string;
  onPress?: () => void;
}

/**
 * Painted header for each chapter of the campaign. The chapter's own battle scene bleeds
 * across the card behind a dark gradient, with the era emblem set in a brass roundel.
 */
export function ChapterBanner({
  chapterLabel,
  title,
  description,
  image,
  emblem,
  completed,
  total,
  progressLabel,
  locked,
  lockedHint,
  onPress,
}: Props) {
  const { colors, fontScale } = useSettings();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, { borderColor: locked ? colors.surfaceBorder : colors.glassBorder }]}
      accessibilityRole="header"
    >
      {image ? (
        <Image
          source={image}
          style={[StyleSheet.absoluteFill, { opacity: locked ? 0.35 : 1 }]}
          contentFit="cover"
          transition={300}
        />
      ) : null}
      <LinearGradient
        colors={['rgba(15,20,32,0.15)', 'rgba(15,20,32,0.72)', 'rgba(15,20,32,0.96)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={[styles.chapter, { color: colors.brassLight, fontSize: 11 * fontScale }]}>
              {chapterLabel}
            </Text>
            <Text style={[styles.title, { fontSize: 22 * fontScale }]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={[styles.desc, { fontSize: 13 * fontScale }]} numberOfLines={2}>
              {locked && lockedHint ? lockedHint : description}
            </Text>
          </View>
          <View style={[styles.emblemRing, { borderColor: locked ? colors.pathLockedEdge : colors.brass }]}>
            {emblem ? (
              <Image source={emblem} style={[styles.emblem, { opacity: locked ? 0.4 : 1 }]} contentFit="cover" />
            ) : null}
            {locked ? (
              <View style={styles.lockOverlay}>
                <Lock size={20} color="#fff" />
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.progressRow}>
          <ProgressBar
            value={total ? completed / total : 0}
            height={8}
            color={completed === total && total > 0 ? colors.success : colors.brass}
            track="rgba(255,255,255,0.14)"
            style={{ flex: 1 }}
          />
          <Text style={[styles.progressLabel, { fontSize: 12 * fontScale }]}>{progressLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 150,
    backgroundColor: '#1A2233',
  },
  body: {
    padding: 16,
    paddingTop: 22,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  chapter: {
    fontFamily: fonts.bodyBlack,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    color: '#F4E8CF',
    lineHeight: 28,
  },
  desc: {
    fontFamily: fonts.bodySemi,
    color: 'rgba(244,232,207,0.82)',
    lineHeight: 18,
  },
  emblemRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#0F1420',
  },
  emblem: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    fontFamily: fonts.bodyBold,
    color: 'rgba(244,232,207,0.9)',
  },
});
