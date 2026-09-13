import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Star, Heart, Check, Target, BookOpen, Sparkles, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts, radius } from '@/constants/theme';
import { isQuestComplete, questProgress, QuestDef } from '@/utils/quests';
import { success } from '@/utils/haptics';

const METRIC_ICON: Record<QuestDef['metric'], typeof Star> = {
  xp: Star,
  lessons: Target,
  correct: Check,
  perfect: Trophy,
  newBattles: BookOpen,
};

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { progress, daily, dailyQuests, claimQuest } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();

  const allDone = dailyQuests.every((q) => daily.claimed.includes(q.id));

  const questLabel = (q: QuestDef) => {
    switch (q.metric) {
      case 'lessons':
        return t('quests.metric.lessons', { count: q.target });
      case 'newBattles':
        return t('quests.metric.newBattles', { count: q.target });
      case 'perfect':
        return t('quests.metric.perfect');
      default:
        return t(`quests.metric.${q.metric}`, { target: q.target });
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text, fontSize: 30 * fontScale }]}>{t('quests.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>{t('quests.subtitle')}</Text>

        {/* Streak card */}
        <View style={[styles.streakCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <View style={[styles.streakIcon, { backgroundColor: progress.currentStreak > 0 ? colors.ember : colors.surfaceStrong }]}>
            <Flame size={28} color="#fff" fill={progress.currentStreak > 0 ? '#fff' : 'transparent'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.streakTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t('quests.streakTitle')}</Text>
            <Text style={[styles.streakBody, { color: colors.textSecondary, fontSize: 13 * fontScale }]}>
              {progress.currentStreak > 0 ? t('quests.streakBody', { count: progress.currentStreak }) : t('quests.streakZero')}
            </Text>
          </View>
          <Text style={[styles.streakNumber, { color: colors.ember, fontSize: 34 * fontScale }]}>{progress.currentStreak}</Text>
        </View>

        <View style={styles.list}>
          {dailyQuests.map((q, i) => {
            const done = isQuestComplete(q, daily);
            const claimed = daily.claimed.includes(q.id);
            const current = questProgress(q, daily);
            const Icon = METRIC_ICON[q.metric];
            return (
              <View
                key={q.id}
                style={[
                  styles.quest,
                  {
                    backgroundColor: colors.surface,
                    borderColor: done && !claimed ? colors.brass : colors.surfaceBorder,
                    opacity: claimed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={styles.questRow}>
                  <View style={[styles.questIcon, { backgroundColor: claimed ? colors.success : colors.surfaceStrong }]}>
                    {claimed ? <Check size={22} color="#fff" strokeWidth={3} /> : <Icon size={22} color={colors.brassLight} />}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.questLabel, { color: colors.text, fontSize: 15 * fontScale }]}>{questLabel(q)}</Text>
                    <View style={styles.rewardRow}>
                      {q.reward.xp ? (
                        <View style={styles.reward}>
                          <Star size={13} color={colors.xp} fill={colors.xp} />
                          <Text style={[styles.rewardText, { color: colors.xp }]}>{t('quests.rewardXp', { xp: q.reward.xp })}</Text>
                        </View>
                      ) : null}
                      {q.reward.hearts ? (
                        <View style={styles.reward}>
                          <Heart size={13} color={colors.hearts} fill={colors.hearts} />
                          <Text style={[styles.rewardText, { color: colors.hearts }]}>{t('quests.rewardHeart')}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {t('quests.progress', { current, target: q.target })}
                  </Text>
                </View>
                <ProgressBar value={current / q.target} height={10} color={claimed ? colors.success : colors.brass} />
                {done && !claimed ? (
                  <ChunkyButton
                    label={t('quests.claim')}
                    variant="brass"
                    size="md"
                    icon={<Sparkles size={16} color="#2B2419" />}
                    onPress={() => {
                      claimQuest(q);
                      if (haptics) success();
                    }}
                    style={{ marginTop: 2 }}
                  />
                ) : null}
              </View>
            );
          })}
        </View>

        {allDone ? (
          <Text style={[styles.allDone, { color: colors.brassLight, fontSize: 14 * fontScale }]}>{t('quests.allDone')}</Text>
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 14 },
  title: { fontFamily: fonts.display },
  subtitle: { fontFamily: fonts.bodySemi, marginTop: -8 },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.lg, borderWidth: 1 },
  streakIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  streakTitle: { fontFamily: fonts.bodyBlack },
  streakBody: { fontFamily: fonts.bodySemi, marginTop: 2 },
  streakNumber: { fontFamily: fonts.display },
  list: { gap: 12 },
  quest: { padding: 14, borderRadius: radius.lg, borderWidth: 1.5, gap: 12 },
  questRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  questIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  questLabel: { fontFamily: fonts.bodyBold },
  rewardRow: { flexDirection: 'row', gap: 12 },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardText: { fontFamily: fonts.bodyBlack, fontSize: 12 },
  progressText: { fontFamily: fonts.bodyBold, fontSize: 13, fontVariant: ['tabular-nums'] },
  allDone: { fontFamily: fonts.bodyBold, textAlign: 'center', marginTop: 8 },
});
