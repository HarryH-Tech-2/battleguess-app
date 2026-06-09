import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Flame, Heart, Star, Trophy, Calendar, ChevronRight, Cake, Skull } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { badges as allBadgesRaw } from '@/mocks/badges';
import { lessons as rawLessons } from '@/mocks/lessons';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const { mascots, badges: allBadges } = useContent();

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const styles = createStyles(colors);

  const stats = useMemo(() => {
    const completedCount = rawLessons.filter(l => isLessonCompleted(l.id)).length;
    const totalCount = rawLessons.length;
    return {
      completedLessons: completedCount,
      totalLessons: totalCount,
      progressPercent: Math.round((completedCount / totalCount) * 100),
    };
  }, [isLessonCompleted]);

  const earnedBadges = useMemo(() => {
    return progress.badges.map(id => allBadges.find(b => b.id === id)).filter(Boolean);
  }, [progress.badges, allBadges]);

  const handleBackToLearning = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Profile' }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          {mascot && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: mascot.avatar }} style={styles.avatar} />
            </View>
          )}
          <Text style={styles.mascotName}>{mascot?.name || t('profile.historian')}</Text>
          <Text style={styles.mascotDescription}>{mascot?.description}</Text>

          {mascot && (
            <View style={styles.mascotDates}>
              <View style={styles.dateRow}>
                <Cake size={16} color={colors.success} />
                <Text style={styles.dateLabel}>{t('profile.born')}</Text>
                <Text style={styles.dateValue}>{mascot.dob}</Text>
              </View>
              <View style={styles.dateRow}>
                <Skull size={16} color={colors.textSecondary} />
                <Text style={styles.dateLabel}>{t('profile.died')}</Text>
                <Text style={styles.dateValue}>{mascot.dod}</Text>
              </View>
              <Text style={styles.causeOfDeath}>{mascot.causeOfDeath}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Flame size={28} color={colors.streak} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
            <Text style={styles.statLabel}>{t('profile.dayStreak')}</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={28} color={colors.xp} fill={colors.xp} />
            <Text style={styles.statValue}>{progress.totalXp}</Text>
            <Text style={styles.statLabel}>{t('profile.totalXp')}</Text>
          </View>
          <View style={styles.statCard}>
            <Heart size={28} color={colors.hearts} fill={colors.hearts} />
            <Text style={styles.statValue}>{progress.hearts}/5</Text>
            <Text style={styles.statLabel}>{t('profile.hearts')}</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={28} color={colors.secondary} />
            <Text style={styles.statValue}>{progress.bestStreak}</Text>
            <Text style={styles.statLabel}>{t('profile.bestStreak')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.progress')}</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{stats.progressPercent}%</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>{t('profile.lessonsCompleted')}</Text>
              <Text style={styles.progressDetail}>
                {t('profile.lessonsOf', { completed: stats.completedLessons, total: stats.totalLessons })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profile.badges')}</Text>
            <Text style={styles.badgeCount}>
              {earnedBadges.length}/{allBadges.length}
            </Text>
          </View>
          
          <View style={styles.badgesGrid}>
            {allBadges.slice(0, 6).map((badge) => {
              const isEarned = progress.badges.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !isEarned && styles.badgeCardLocked,
                  ]}
                >
                  <Text style={[
                    styles.badgeIcon,
                    !isEarned && styles.badgeIconLocked,
                  ]}>
                    {isEarned ? badge.icon : '🔒'}
                  </Text>
                  <Text style={[
                    styles.badgeTitle,
                    !isEarned && styles.badgeTitleLocked,
                  ]} numberOfLines={1}>
                    {badge.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.streakCalendar')}</Text>
          <View style={styles.calendarCard}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.calendarInfo}>
              <Text style={styles.calendarTitle}>
                {progress.currentStreak > 0
                  ? t('profile.dayStreakCount', { count: progress.currentStreak })
                  : t('profile.startStreak')}
              </Text>
              <Text style={styles.calendarSubtitle}>
                {progress.lastActiveDate
                  ? t('profile.lastActive', { date: new Date(progress.lastActiveDate).toLocaleDateString() })
                  : t('profile.completeToStart')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleBackToLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>{t('profile.backToLearning')}</Text>
          <ChevronRight size={20} color={colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.secondary,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  mascotName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  mascotDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mascotDates: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    width: '100%',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    width: 40,
  },
  dateValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600' as const,
  },
  causeOfDeath: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  badgeCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  progressDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  badgeCardLocked: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.pathLine,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: colors.textLight,
  },
  calendarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  calendarInfo: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  calendarSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.textInverse,
  },
});
