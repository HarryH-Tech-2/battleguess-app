import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BookOpen, ChevronRight, Heart, Star, Check } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { lessons } from '@/mocks/lessons';
import { getBattleById } from '@/mocks/battles';

export default function ReviewScreen() {
  const router = useRouter();
  const { progress, gainHeartFromReview, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);
  const styles = createStyles(colors);

  const reviewLessons = useMemo(() => {
    const completed = lessons.filter(l => isLessonCompleted(l.id));
    const withWrongAnswers = completed
      .map(lesson => {
        const battle = getBattleById(lesson.battleId);
        const wrongCount = battle ? progress.wrongAnswers[battle.id] || 0 : 0;
        return { lesson, wrongCount };
      })
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 5);
    
    return withWrongAnswers;
  }, [progress.wrongAnswers, isLessonCompleted]);

  const handleReviewLesson = useCallback((lessonId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/lesson/${lessonId}` as `/lesson/${string}`);
  }, [router]);

  const handleQuickReview = useCallback((lessonId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!completedReviews.includes(lessonId)) {
      setCompletedReviews([...completedReviews, lessonId]);
      gainHeartFromReview();
    }
  }, [completedReviews, gainHeartFromReview]);

  if (reviewLessons.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Review' }} />
        <View style={styles.emptyContainer}>
          <BookOpen size={64} color={colors.pathLine} />
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete some lessons first to unlock review sessions
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back to Learning</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Review' }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Makes Perfect</Text>
        <Text style={styles.headerSubtitle}>
          Review battles you have learned to strengthen your memory
        </Text>

        <View style={styles.rewardBanner}>
          <Heart size={20} color={colors.hearts} fill={colors.hearts} />
          <Text style={styles.rewardText}>
            Complete a review to earn a heart!
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        {reviewLessons.map(({ lesson, wrongCount }) => {
          const battle = getBattleById(lesson.battleId);
          const isReviewed = completedReviews.includes(lesson.id);
          
          return (
            <View key={lesson.id} style={styles.reviewCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>
                    {battle?.era === 'ancient' ? '🏛️' :
                     battle?.era === 'medieval' ? '⚔️' :
                     battle?.era === 'napoleonic' ? '👑' :
                     battle?.era === 'ww1' ? '💣' :
                     battle?.era === 'ww2' ? '✈️' : '🎖️'}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{lesson.title}</Text>
                  <Text style={styles.cardSubtitle}>{battle?.title}</Text>
                </View>
                {wrongCount > 0 && (
                  <View style={styles.needsPractice}>
                    <Text style={styles.needsPracticeText}>Needs practice</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.quickReviewButton,
                    isReviewed && styles.quickReviewButtonDone,
                  ]}
                  onPress={() => handleQuickReview(lesson.id)}
                  disabled={isReviewed}
                  activeOpacity={0.7}
                >
                  {isReviewed ? (
                    <>
                      <Check size={16} color={colors.success} />
                      <Text style={styles.quickReviewTextDone}>Reviewed</Text>
                    </>
                  ) : (
                    <>
                      <Star size={16} color={colors.secondary} />
                      <Text style={styles.quickReviewText}>Quick Review</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fullLessonButton}
                  onPress={() => handleReviewLesson(lesson.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.fullLessonText}>Full Lesson</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {completedReviews.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.completedBanner}>
            <Check size={20} color={colors.success} />
            <Text style={styles.completedText}>
              {completedReviews.length} review{completedReviews.length !== 1 ? 's' : ''} completed!
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.hearts + '15',
    padding: 12,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  needsPractice: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  needsPracticeText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600' as const,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  quickReviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
  },
  quickReviewButtonDone: {
    backgroundColor: colors.successLight,
  },
  quickReviewText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500' as const,
  },
  quickReviewTextDone: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500' as const,
  },
  fullLessonButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  fullLessonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textInverse,
  },
});
