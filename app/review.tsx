import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts, radius } from '@/constants/theme';
import { tap } from '@/utils/haptics';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { lessons, getBattleById } = useContent();

  const reviewLessons = useMemo(() => {
    return lessons
      .filter((l) => isLessonCompleted(l.id))
      .map((lesson) => ({ lesson, battle: getBattleById(lesson.battleId), wrong: progress.wrongAnswers[lesson.battleId] || 0 }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, 8);
  }, [lessons, isLessonCompleted, getBattleById, progress.wrongAnswers]);

  return (
    <ScreenBackground>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]} accessibilityRole="button" accessibilityLabel={t('common.back')}>
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text, fontSize: 22 * fontScale }]}>{t('review.title')}</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {reviewLessons.length === 0 ? (
          <View style={styles.empty}>
            <BookOpen size={56} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text, fontSize: 20 * fontScale }]}>{t('review.noReviews')}</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>{t('review.completeLessonsFirst')}</Text>
            <ChunkyButton label={t('review.backToLearning')} variant="brass" onPress={() => router.back()} style={{ marginTop: 12 }} />
          </View>
        ) : (
          <>
            <Text style={[styles.lead, { color: colors.text, fontSize: 18 * fontScale }]}>{t('review.practiceMakesPerfect')}</Text>
            <Text style={[styles.sub, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>{t('review.reviewBattles')}</Text>
            <View style={{ gap: 10, marginTop: 8 }}>
              {reviewLessons.map(({ lesson, battle, wrong }) => (
                <Pressable
                  key={lesson.id}
                  onPress={() => {
                    if (haptics) tap();
                    router.push(`/lesson/${lesson.id}`);
                  }}
                  accessibilityRole="button"
                  style={[styles.card, { backgroundColor: colors.surface, borderColor: wrong > 0 ? colors.error : colors.surfaceBorder }]}
                >
                  <View style={[styles.thumb, { borderColor: colors.surfaceBorder }]}>
                    {battle ? <Image source={getBattleImage(battle.id)} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.cardTitle, { color: colors.text, fontSize: 15 * fontScale }]} numberOfLines={1}>{battle?.title ?? lesson.title}</Text>
                    <Text style={[styles.cardSub, { color: colors.textSecondary, fontSize: 12 * fontScale }]} numberOfLines={1}>{lesson.title}</Text>
                    {wrong > 0 ? (
                      <View style={styles.wrongRow}>
                        <AlertTriangle size={12} color={colors.error} />
                        <Text style={[styles.wrongText, { color: colors.error, fontSize: 12 * fontScale }]}>{t('review.mistakes', { count: wrong })}</Text>
                      </View>
                    ) : null}
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 6 },
  lead: { fontFamily: fonts.display },
  sub: { fontFamily: fonts.bodySemi, lineHeight: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.lg, borderWidth: 1.5 },
  thumb: { width: 64, height: 64, borderRadius: radius.sm, overflow: 'hidden', borderWidth: 1, backgroundColor: '#26324A' },
  cardTitle: { fontFamily: fonts.bodyBlack },
  cardSub: { fontFamily: fonts.bodySemi },
  wrongRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  wrongText: { fontFamily: fonts.bodyBold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 12 },
  emptyTitle: { fontFamily: fonts.display, textAlign: 'center' },
  emptyBody: { fontFamily: fonts.bodySemi, textAlign: 'center', lineHeight: 20 },
});
