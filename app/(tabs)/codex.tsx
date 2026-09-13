import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fonts, radius } from '@/constants/theme';
import type { Battle } from '@/types';
import { tap } from '@/utils/haptics';

type Filter = 'all' | 'unlocked' | 'locked';

export default function CodexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { progress } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { battles } = useContent();
  const [filter, setFilter] = useState<Filter>('all');

  const studied = new Set(progress.studiedBattles);
  const sorted = useMemo(() => [...battles].sort((a, b) => a.year - b.year), [battles]);
  const data = useMemo(() => {
    if (filter === 'unlocked') return sorted.filter((b) => studied.has(b.id));
    if (filter === 'locked') return sorted.filter((b) => !studied.has(b.id));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, filter, progress.studiedBattles]);

  const GAP = 12;
  const cardW = (width - 40 - GAP) / 2;

  const renderItem = ({ item }: { item: Battle }) => {
    const unlocked = studied.has(item.id);
    return (
      <Pressable
        onPress={() => {
          if (haptics) tap();
          router.push(`/battle/${item.id}`);
        }}
        accessibilityRole="button"
        accessibilityLabel={item.title}
        style={[styles.card, { width: cardW, borderColor: unlocked ? colors.brass : colors.surfaceBorder, backgroundColor: colors.surface }]}
      >
        <Image
          source={getBattleImage(item.id)}
          style={[StyleSheet.absoluteFill, { opacity: unlocked ? 1 : 0.22 }]}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient colors={['rgba(15,20,32,0)', 'rgba(15,20,32,0.92)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
        {!unlocked ? (
          <View style={styles.lock}>
            <Lock size={22} color={colors.textSecondary} />
          </View>
        ) : null}
        <View style={styles.cardBody}>
          <Text style={[styles.year, { color: colors.brassLight, fontSize: 11 * fontScale }]}>
            {item.year < 0 ? `${Math.abs(item.year)} BC` : item.year}
          </Text>
          <Text style={[styles.cardTitle, { color: unlocked ? '#F4E8CF' : colors.textSecondary, fontSize: 14 * fontScale }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenBackground>
      <FlatList
        data={data}
        keyExtractor={(b) => b.id}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontSize: 30 * fontScale }]}>{t('codex.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>
              {t('codex.subtitle', { unlocked: studied.size, total: battles.length })}
            </Text>
            <ProgressBar value={battles.length ? studied.size / battles.length : 0} height={8} />
            <View style={styles.filters}>
              {(['all', 'unlocked', 'locked'] as Filter[]).map((f) => {
                const active = f === filter;
                return (
                  <Pressable
                    key={f}
                    onPress={() => {
                      if (haptics) tap();
                      setFilter(f);
                    }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    style={[styles.chip, { backgroundColor: active ? colors.brass : 'transparent', borderColor: active ? colors.brass : colors.surfaceBorder }]}
                  >
                    <Text style={[styles.chipText, { color: active ? '#2B2419' : colors.textSecondary, fontSize: 13 * fontScale }]}>
                      {t(`codex.filters.${f}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted, fontSize: 14 * fontScale }]}>{t('codex.empty')}</Text>
        }
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, gap: 12 },
  header: { gap: 10, marginBottom: 6 },
  title: { fontFamily: fonts.display },
  subtitle: { fontFamily: fonts.bodySemi, marginTop: -6 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 14, height: 32, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.bodyBlack },
  card: { height: 150, borderRadius: radius.md, borderWidth: 1.5, overflow: 'hidden', justifyContent: 'flex-end' },
  cardBody: { padding: 10, gap: 2 },
  year: { fontFamily: fonts.bodyBlack, letterSpacing: 0.8 },
  cardTitle: { fontFamily: fonts.bodyBold, lineHeight: 18 },
  lock: { position: 'absolute', top: 10, right: 10 },
  empty: { fontFamily: fonts.bodySemi, textAlign: 'center', paddingVertical: 40 },
});
