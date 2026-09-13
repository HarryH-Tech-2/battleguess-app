import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Flame, Target, BookOpen, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Confetti } from '@/components/ui/Confetti';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fonts, radius } from '@/constants/theme';
import { getRankProgress } from '@/utils/ranks';
import { success } from '@/utils/haptics';

const PERFECT_BONUS = 10;
const comboBonusFor = (best: number) => (best >= 5 ? 10 : best >= 3 ? 5 : 0);

function useCountUp(target: number, duration = 900, delay = 300, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let raf: ReturnType<typeof setTimeout>;
    const start = Date.now() + delay;
    const tick = () => {
      const now = Date.now();
      if (now < start) {
        raf = setTimeout(tick, 16);
        return;
      }
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = setTimeout(tick, 16);
    };
    tick();
    return () => clearTimeout(raf);
  }, [target, duration, delay, enabled]);
  return value;
}

export default function LessonCompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    lessonId: string;
    correctAnswers: string;
    totalSteps: string;
    xpReward: string;
    bestCombo: string;
  }>();
  const { completeLesson, progress, claimableQuestCount } = useUserProgress();
  const { colors, fontScale, haptics, reducedMotion } = useSettings();
  const { getLessonById, getBattleById } = useContent();

  const lesson = getLessonById(params.lessonId || '');
  const battle = lesson ? getBattleById(lesson.battleId) : null;
  const correct = parseInt(params.correctAnswers || '0', 10);
  const total = Math.max(1, parseInt(params.totalSteps || '1', 10));
  const baseXp = parseInt(params.xpReward || '0', 10);
  const bestCombo = parseInt(params.bestCombo || '0', 10);
  const isPerfect = correct === total;
  const accuracy = Math.round((correct / total) * 100);
  const perfectBonus = isPerfect ? PERFECT_BONUS : 0;
  const comboBonus = comboBonusFor(bestCombo);
  const totalXp = baseXp + perfectBonus + comboBonus;

  const wasNewBattle = useMemo(
    () => (battle ? !progress.studiedBattles.includes(battle.id) : false),
    // Evaluate once, before completeLesson mutates progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const xpBefore = useRef(progress.totalXp).current;
  const committed = useRef(false);

  useEffect(() => {
    if (committed.current || !lesson || !battle) return;
    committed.current = true;
    completeLesson({
      lessonId: lesson.id,
      battleId: battle.id,
      correctAnswers: correct,
      totalSteps: total,
      xpEarned: totalXp,
      isPerfect,
      bestCombo,
    });
    if (haptics) success();
  }, [lesson, battle, completeLesson, correct, total, totalXp, isPerfect, bestCombo, haptics]);

  const xpShown = useCountUp(totalXp, 900, 500, !reducedMotion);
  const accShown = useCountUp(accuracy, 900, 700, !reducedMotion);

  const cardAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const titleAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const rowAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.sequence([
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 10 }),
      Animated.timing(cardAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.spring(rowAnim, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 6 }),
    ]).start();
  }, [titleAnim, cardAnim, rowAnim, reducedMotion]);

  const rankAfter = getRankProgress(xpBefore + totalXp);
  const rankBefore = getRankProgress(xpBefore);
  const rankedUp = rankAfter.index > rankBefore.index;
  const streak = progress.currentStreak;

  return (
    <ScreenBackground image={battle ? getBattleImage(battle.id) : undefined} imageHeight={360} topography={false}>
      <Confetti run={!reducedMotion} count={isPerfect ? 90 : 60} />
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Animated.View
          style={{
            alignItems: 'center',
            opacity: titleAnim,
            transform: [{ scale: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
          }}
        >
          <Trophy size={30} color={colors.brassLight} />
          <Text style={[styles.title, { color: colors.brassLight, fontSize: (isPerfect ? 34 : 40) * fontScale }]}>
            {isPerfect ? t('lessonComplete.perfect') : t('lessonComplete.complete')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text, fontSize: 15 * fontScale }]}>{lesson?.title}</Text>
        </Animated.View>

        {/* Battle card */}
        <Animated.View
          style={[
            styles.card,
            {
              borderColor: colors.brass,
              backgroundColor: colors.bgRaised,
              opacity: cardAnim,
              transform: [
                { perspective: 900 },
                { rotateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) },
                { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
              ],
            },
          ]}
        >
          {battle ? <Image source={getBattleImage(battle.id)} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
          <LinearGradient colors={['rgba(15,20,32,0)', 'rgba(15,20,32,0.9)']} style={StyleSheet.absoluteFill} />
          <View style={styles.cardBody}>
            {wasNewBattle ? (
              <View style={[styles.newChip, { backgroundColor: colors.brass }]}>
                <BookOpen size={12} color="#2B2419" />
                <Text style={styles.newChipText}>{t('lessonComplete.addedToCodex')}</Text>
              </View>
            ) : null}
            <Text style={[styles.cardTitle, { fontSize: 20 * fontScale }]} numberOfLines={2}>
              {battle?.title}
            </Text>
            <Text style={[styles.cardDate, { fontSize: 12 * fontScale }]}>{battle?.date}</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={{
            gap: 12,
            opacity: rowAnim,
            transform: [{ translateY: rowAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }}
        >
          <View style={styles.statsRow}>
            <StatTile icon={<Star size={18} color={colors.xp} fill={colors.xp} />} value={`+${xpShown}`} label={t('lessonComplete.xpEarned')} color={colors.xp} />
            <StatTile icon={<Target size={18} color={colors.success} />} value={`${accShown}%`} label={t('lessonComplete.accuracy')} color={colors.success} />
            <StatTile icon={<Flame size={18} color={colors.streak} fill={colors.streak} />} value={String(streak)} label={t('lessonComplete.dayStreak')} color={colors.streak} />
          </View>

          {(perfectBonus > 0 || comboBonus > 0) ? (
            <View style={styles.bonusRow}>
              {perfectBonus > 0 ? <Bonus label={t('lessonComplete.perfectBonus')} value={perfectBonus} /> : null}
              {comboBonus > 0 ? <Bonus label={t('lessonComplete.comboBonus')} value={comboBonus} /> : null}
            </View>
          ) : null}

          <View style={[styles.rankCard, { backgroundColor: colors.surface, borderColor: rankedUp ? colors.brass : colors.surfaceBorder }]}>
            <View style={styles.rankRow}>
              <Text style={[styles.rankName, { color: colors.brass, fontSize: 15 * fontScale }]}>
                {t(`profile.ranks.${rankAfter.rank.id}`)}
              </Text>
              <Text style={[styles.rankNext, { color: colors.textSecondary, fontSize: 12 * fontScale }]}>
                {rankAfter.next
                  ? t('lessonComplete.rankProgress', { xp: rankAfter.xpToNext, rank: t(`profile.ranks.${rankAfter.next.id}`) })
                  : t('lessonComplete.maxRank')}
              </Text>
            </View>
            <ProgressBar value={rankAfter.progress} height={10} />
          </View>

          {claimableQuestCount > 0 ? (
            <Text style={[styles.questHint, { color: colors.brassLight, fontSize: 13 * fontScale }]}>
              {t('lessonComplete.questReady', { count: claimableQuestCount })}
            </Text>
          ) : null}
        </Animated.View>

        <View style={{ flex: 1 }} />
        <ChunkyButton label={t('lessonComplete.continue')} variant="ember" onPress={() => router.replace('/(tabs)/(home)/learn')} />
      </View>
    </ScreenBackground>
  );
}

function StatTile({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  const { colors, fontScale } = useSettings();
  return (
    <View style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      {icon}
      <Text style={[styles.tileValue, { color, fontSize: 22 * fontScale }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: colors.textSecondary, fontSize: 11 * fontScale }]}>{label}</Text>
    </View>
  );
}

function Bonus({ label, value }: { label: string; value: number }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.bonus, { borderColor: colors.brass }]}>
      <Text style={[styles.bonusText, { color: colors.brassLight }]}>{label}</Text>
      <Text style={[styles.bonusValue, { color: colors.brassLight }]}>+{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, gap: 18 },
  title: { fontFamily: fonts.displayBlack, textAlign: 'center', marginTop: 6, letterSpacing: 1 },
  subtitle: { fontFamily: fonts.bodyBold, textAlign: 'center', marginTop: 2 },
  card: { height: 170, borderRadius: radius.lg, borderWidth: 2, overflow: 'hidden', justifyContent: 'flex-end' },
  cardBody: { padding: 16, gap: 4 },
  newChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, height: 24, borderRadius: 12, marginBottom: 6 },
  newChipText: { fontFamily: fonts.bodyBlack, fontSize: 11, color: '#2B2419' },
  cardTitle: { fontFamily: fonts.display, color: '#F4E8CF' },
  cardDate: { fontFamily: fonts.bodySemi, color: 'rgba(244,232,207,0.75)' },
  statsRow: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1 },
  tileValue: { fontFamily: fonts.display, fontVariant: ['tabular-nums'] },
  tileLabel: { fontFamily: fonts.bodyBold, textTransform: 'uppercase', letterSpacing: 0.6 },
  bonusRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  bonus: { flexDirection: 'row', gap: 8, alignItems: 'center', borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 12, height: 30 },
  bonusText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  bonusValue: { fontFamily: fonts.bodyBlack, fontSize: 13 },
  rankCard: { borderRadius: radius.md, borderWidth: 1, padding: 14, gap: 10 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankName: { fontFamily: fonts.display },
  rankNext: { fontFamily: fonts.bodyBold },
  questHint: { fontFamily: fonts.bodyBold, textAlign: 'center' },
});
