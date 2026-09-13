import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Settings, Flame, Star, Heart, Trophy, Check, X, ChevronRight, Target, BookOpen } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage, getMascotImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fonts, radius } from '@/constants/theme';
import { getRankProgress } from '@/utils/ranks';
import { tap } from '@/utils/haptics';

type HistoryFilter = 'all' | 'wrong' | 'correct';

export default function PlayerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { progress } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { mascots, badges, lessons } = useContent();
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [showAllHistory, setShowAllHistory] = useState(false);

  const mascot = mascots.find((m) => m.id === progress.selectedMascotId);
  const rank = getRankProgress(progress.totalXp);
  const heroBattleId = progress.studiedBattles[progress.studiedBattles.length - 1] ?? 'thermopylae';

  const attempts = progress.questionAttempts;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const accuracy = attempts.length ? Math.round((correctCount / attempts.length) * 100) : 0;
  const mastered = Object.values(progress.masteryLevels).filter((m) => m >= 1).length;

  const filteredHistory = useMemo(() => {
    const list = attempts.filter((a) =>
      historyFilter === 'all' ? true : historyFilter === 'wrong' ? !a.isCorrect : a.isCorrect
    );
    return showAllHistory ? list : list.slice(0, 6);
  }, [attempts, historyFilter, showAllHistory]);
  const historyTotal = attempts.filter((a) =>
    historyFilter === 'all' ? true : historyFilter === 'wrong' ? !a.isCorrect : a.isCorrect
  ).length;

  // Streak calendar for the current month: days active are inferred from question attempts.
  const calendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const active = new Set<number>();
    attempts.forEach((a) => {
      const d = new Date(a.timestamp);
      if (d.getFullYear() === year && d.getMonth() === month) active.add(d.getDate());
    });
    if (progress.lastActiveDate) {
      const d = new Date(progress.lastActiveDate);
      if (d.getFullYear() === year && d.getMonth() === month) active.add(d.getDate());
    }
    return { daysInMonth, active, today: now.getDate(), firstWeekday: new Date(year, month, 1).getDay() };
  }, [attempts, progress.lastActiveDate]);

  const Section = ({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) => (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 18 * fontScale }]}>{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );

  return (
    <ScreenBackground image={getBattleImage(heroBattleId)} imageHeight={300}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.topRow, { paddingTop: insets.top + 10 }]}>
          <Text style={[styles.screenTitle, { color: colors.text, fontSize: 22 * fontScale }]}>{t('profile.title')}</Text>
          <Pressable
            onPress={() => {
              if (haptics) tap();
              router.push('/settings');
            }}
            accessibilityRole="button"
            accessibilityLabel={t('nav.settings')}
            style={[styles.iconBtn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
          >
            <Settings size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Identity */}
        <View style={styles.identity}>
          <Pressable
            onPress={() => router.push('/choose-guide')}
            accessibilityRole="button"
            accessibilityLabel={t('profile.chooseGuide')}
            style={[styles.avatarRing, { borderColor: colors.brass }]}
          >
            {mascot ? <Image source={getMascotImage(mascot.id)} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
          </Pressable>
          <Text style={[styles.rankTitle, { color: colors.brassLight, fontSize: 26 * fontScale }]}>
            {t(`profile.ranks.${rank.rank.id}`)}
          </Text>
          <Text style={[styles.guideLine, { color: colors.textSecondary, fontSize: 13 * fontScale }]}>
            {mascot ? `${t('profile.guide')}: ${mascot.name}` : t('profile.historian')}
          </Text>
          <View style={styles.rankBar}>
            <ProgressBar value={rank.progress} height={10} />
            <Text style={[styles.rankNext, { color: colors.textSecondary, fontSize: 12 * fontScale }]}>
              {rank.next ? t('profile.nextRank', { xp: rank.xpToNext, rank: t(`profile.ranks.${rank.next.id}`) }) : t('profile.maxRank')}
            </Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.grid}>
          <Stat icon={<Flame size={18} color={colors.streak} fill={colors.streak} />} value={progress.currentStreak} label={t('profile.dayStreak')} />
          <Stat icon={<Star size={18} color={colors.xp} fill={colors.xp} />} value={progress.totalXp.toLocaleString()} label={t('profile.totalXp')} />
          <Stat icon={<Heart size={18} color={colors.hearts} fill={colors.hearts} />} value={progress.hearts} label={t('profile.hearts')} />
          <Stat icon={<Trophy size={18} color={colors.brassLight} />} value={progress.bestStreak} label={t('profile.bestStreak')} />
        </View>

        {/* Progress */}
        <Section title={t('profile.progress')}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Row icon={<Target size={16} color={colors.success} />} label={t('profile.lessonsCompleted')} value={t('profile.lessonsOf', { completed: progress.completedLessons.length, total: lessons.length })} />
            <ProgressBar value={lessons.length ? progress.completedLessons.length / lessons.length : 0} height={8} color={colors.success} />
            <View style={styles.miniGrid}>
              <Mini label={t('profile.accuracy')} value={`${accuracy}%`} />
              <Mini label={t('profile.battlesStudied')} value={String(progress.studiedBattles.length)} />
              <Mini label={t('profile.lessonsMastered')} value={String(mastered)} />
            </View>
          </View>
        </Section>

        {/* Calendar */}
        <Section title={t('profile.streakCalendar')}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={styles.calendar}>
              {Array.from({ length: calendar.firstWeekday }).map((_, i) => (
                <View key={`pad${i}`} style={styles.day} />
              ))}
              {Array.from({ length: calendar.daysInMonth }, (_, i) => i + 1).map((d) => {
                const active = calendar.active.has(d);
                const isToday = d === calendar.today;
                return (
                  <View
                    key={d}
                    style={[
                      styles.day,
                      {
                        backgroundColor: active ? colors.ember : colors.bgSunken,
                        borderColor: isToday ? colors.brass : 'transparent',
                      },
                    ]}
                  >
                    {active ? (
                      <Flame size={12} color="#fff" fill="#fff" />
                    ) : (
                      <Text style={[styles.dayText, { color: colors.textMuted }]}>{d}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </Section>

        {/* Badges */}
        <Section title={t('profile.badges')}>
          <View style={styles.badges}>
            {badges.map((b) => {
              const earned = progress.badges.includes(b.id);
              return (
                <View
                  key={b.id}
                  style={[styles.badge, { backgroundColor: earned ? colors.option : colors.surface, borderColor: earned ? colors.brass : colors.surfaceBorder, opacity: earned ? 1 : 0.55 }]}
                >
                  <Text style={styles.badgeIcon}>{b.icon}</Text>
                  <Text style={[styles.badgeTitle, { color: earned ? colors.textOnParchment : colors.textSecondary, fontSize: 11 * fontScale }]} numberOfLines={2}>
                    {b.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </Section>

        {/* History */}
        <Section
          title={t('profile.questionHistory')}
          right={<Text style={[styles.count, { color: colors.textMuted, fontSize: 12 * fontScale }]}>{t('profile.answeredCount', { count: attempts.length })}</Text>}
        >
          <View style={styles.filters}>
            {(['all', 'wrong', 'correct'] as HistoryFilter[]).map((f) => {
              const active = f === historyFilter;
              return (
                <Pressable
                  key={f}
                  onPress={() => {
                    if (haptics) tap();
                    setHistoryFilter(f);
                    setShowAllHistory(false);
                  }}
                  style={[styles.chip, { backgroundColor: active ? colors.brass : 'transparent', borderColor: active ? colors.brass : colors.surfaceBorder }]}
                >
                  <Text style={[styles.chipText, { color: active ? '#2B2419' : colors.textSecondary, fontSize: 12 * fontScale }]}>
                    {t(`profile.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {filteredHistory.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted, fontSize: 13 * fontScale }]}>
              {attempts.length === 0 ? t('profile.historyEmpty') : t('profile.historyNoMatch')}
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {filteredHistory.map((a) => (
                <View key={a.id} style={[styles.history, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                  <View style={[styles.historyIcon, { backgroundColor: a.isCorrect ? colors.success : colors.error }]}>
                    {a.isCorrect ? <Check size={14} color="#fff" strokeWidth={3} /> : <X size={14} color="#fff" strokeWidth={3} />}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.historyBattle, { color: colors.brassLight, fontSize: 11 * fontScale }]}>{a.battleTitle}</Text>
                    <Text style={[styles.historyPrompt, { color: colors.text, fontSize: 13 * fontScale }]} numberOfLines={2}>{a.prompt}</Text>
                    {!a.isCorrect ? (
                      <Text style={[styles.historyAnswer, { color: colors.textSecondary, fontSize: 12 * fontScale }]} numberOfLines={2}>
                        {t('profile.correctLabel')} {a.correctAnswerText}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
              {historyTotal > 6 ? (
                <Pressable onPress={() => setShowAllHistory((s) => !s)} style={styles.more} accessibilityRole="button">
                  <Text style={[styles.moreText, { color: colors.brass, fontSize: 13 * fontScale }]}>
                    {showAllHistory ? t('profile.showLess') : t('profile.showAll', { count: historyTotal })}
                  </Text>
                  <ChevronRight size={16} color={colors.brass} />
                </Pressable>
              ) : null}
            </View>
          )}
        </Section>

        <Pressable
          onPress={() => router.push('/review')}
          style={[styles.practice, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
          accessibilityRole="button"
        >
          <BookOpen size={20} color={colors.brassLight} />
          <Text style={[styles.practiceText, { color: colors.text, fontSize: 15 * fontScale }]}>{t('review.title')}</Text>
          <ChevronRight size={18} color={colors.textMuted} />
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  const { colors, fontScale } = useSettings();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      {icon}
      <Text style={[styles.statValue, { color: colors.text, fontSize: 20 * fontScale }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: 10 * fontScale }]}>{label}</Text>
    </View>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const { colors, fontScale } = useSettings();
  return (
    <View style={styles.row}>
      {icon}
      <Text style={[styles.rowLabel, { color: colors.text, fontSize: 14 * fontScale }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.textSecondary, fontSize: 13 * fontScale }]}>{value}</Text>
    </View>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  const { colors, fontScale } = useSettings();
  return (
    <View style={styles.mini}>
      <Text style={[styles.miniValue, { color: colors.brassLight, fontSize: 18 * fontScale }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.textSecondary, fontSize: 11 * fontScale }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  screenTitle: { fontFamily: fonts.display },
  iconBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  identity: { alignItems: 'center', paddingTop: 18, paddingHorizontal: 20, gap: 6 },
  avatarRing: { width: 112, height: 112, borderRadius: 56, borderWidth: 4, overflow: 'hidden', backgroundColor: '#26324A' },
  rankTitle: { fontFamily: fonts.display, marginTop: 8 },
  guideLine: { fontFamily: fonts.bodySemi },
  rankBar: { width: '100%', gap: 6, marginTop: 8 },
  rankNext: { fontFamily: fonts.bodyBold, textAlign: 'center' },
  grid: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 20 },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1 },
  statValue: { fontFamily: fonts.display },
  statLabel: { fontFamily: fonts.bodyBold, textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },
  section: { paddingHorizontal: 20, marginTop: 24, gap: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: fonts.display },
  count: { fontFamily: fonts.bodyBold },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel: { fontFamily: fonts.bodyBold, flex: 1 },
  rowValue: { fontFamily: fonts.bodySemi },
  miniGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  mini: { flex: 1, alignItems: 'center', gap: 2 },
  miniValue: { fontFamily: fonts.display },
  miniLabel: { fontFamily: fonts.bodySemi, textAlign: 'center' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  day: { width: '12.2%', aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  dayText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { width: '23%', flexGrow: 1, aspectRatio: 0.95, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6 },
  badgeIcon: { fontSize: 26 },
  badgeTitle: { fontFamily: fonts.bodyBold, textAlign: 'center' },
  filters: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 12, height: 30, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.bodyBlack },
  empty: { fontFamily: fonts.bodySemi, textAlign: 'center', paddingVertical: 16 },
  history: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, borderWidth: 1 },
  historyIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  historyBattle: { fontFamily: fonts.bodyBlack, letterSpacing: 0.6, textTransform: 'uppercase' },
  historyPrompt: { fontFamily: fonts.bodyBold, lineHeight: 18 },
  historyAnswer: { fontFamily: fonts.bodySemi },
  more: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 },
  moreText: { fontFamily: fonts.bodyBlack },
  practice: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: radius.lg, borderWidth: 1 },
  practiceText: { fontFamily: fonts.bodyBold, flex: 1 },
});
