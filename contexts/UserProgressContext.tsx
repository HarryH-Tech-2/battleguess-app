import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  UserProgress,
  DailyGoal,
  Interest,
  KnowledgeLevel,
  LessonAttempt,
  QuestionAttempt,
} from '@/types';
import { lessons as allLessons } from '@/mocks/lessons';
import {
  DailyStats,
  emptyDailyStats,
  todayKey,
  getDailyQuests,
  isQuestComplete,
  QuestDef,
} from '@/utils/quests';

const STORAGE_KEY = 'battleguess_progress';
const HEARTS_REFILL_HOURS = 3; // One heart back every 3 hours
export const MAX_HEARTS = 5;
const MAX_QUESTION_HISTORY = 200;

let questionAttemptCounter = 0;

const defaultProgress: UserProgress = {
  completedLessons: [],
  masteryLevels: {},
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  totalXp: 0,
  dailyXp: 0,
  dailyXpDate: '',
  hearts: MAX_HEARTS,
  lastHeartRefill: new Date().toISOString(),
  wrongAnswers: {},
  badges: [],
  selectedMascotId: '',
  dailyGoal: 10,
  interests: [],
  knowledgeLevel: 'nothing',
  hasCompletedOnboarding: false,
  questionAttempts: [],
  daily: emptyDailyStats(),
  studiedBattles: [],
};

/** Roll the per-day counters over when the calendar day changes. */
function freshDaily(daily: DailyStats | undefined): DailyStats {
  const today = todayKey();
  if (!daily || daily.date !== today) return emptyDailyStats(today);
  return daily;
}

/** Derive studied battles for users upgrading from a version without the field. */
function deriveStudiedBattles(completedLessons: string[]): string[] {
  const ids = new Set<string>();
  for (const lessonId of completedLessons) {
    const lesson = allLessons.find((l) => l.id === lessonId);
    if (lesson) ids.add(lesson.battleId);
  }
  return [...ids];
}

export const [UserProgressProvider, useUserProgress] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  const progressQuery = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserProgress>;
        // Merge with defaults so newly-added fields are present for upgrading users.
        const merged = { ...defaultProgress, ...parsed } as UserProgress;
        merged.daily = freshDaily(parsed.daily);
        if (!parsed.studiedBattles) {
          merged.studiedBattles = deriveStudiedBattles(merged.completedLessons);
        }
        return merged;
      }
      return defaultProgress;
    },
  });

  const { mutate: saveProgress } = useMutation({
    mutationFn: async (newProgress: UserProgress) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['userProgress'], data);
    },
  });

  const saveProgressRef = useRef(saveProgress);
  saveProgressRef.current = saveProgress;

  const checkAndRefillHearts = (p: UserProgress): UserProgress => {
    const now = new Date();
    const lastRefill = new Date(p.lastHeartRefill);
    const hoursPassed = (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60);
    const heartsToAdd = Math.floor(hoursPassed / HEARTS_REFILL_HOURS);

    if (heartsToAdd > 0 && p.hearts < MAX_HEARTS) {
      return {
        ...p,
        hearts: Math.min(p.hearts + heartsToAdd, MAX_HEARTS),
        lastHeartRefill: now.toISOString(),
      };
    }
    return p;
  };

  const checkStreak = (p: UserProgress): UserProgress => {
    const today = new Date().toDateString();
    const lastActive = p.lastActiveDate ? new Date(p.lastActiveDate).toDateString() : '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today || lastActive === yesterday) return p;
    if (lastActive && p.currentStreak !== 0) return { ...p, currentStreak: 0 };
    return p;
  };

  useEffect(() => {
    if (progressQuery.data) {
      const updated = checkAndRefillHearts(progressQuery.data);
      const withStreak = checkStreak(updated);
      const withDaily = { ...withStreak, daily: freshDaily(withStreak.daily) };
      setProgress(withDaily);
      if (withDaily !== progressQuery.data) {
        saveProgressRef.current(withDaily);
      }
    }
  }, [progressQuery.data]);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress((prev) => {
      const newProgress = { ...prev, ...updates };
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const completeOnboarding = useCallback(
    (mascotId: string, dailyGoal: DailyGoal, interests: Interest[], knowledgeLevel: KnowledgeLevel) => {
      updateProgress({
        selectedMascotId: mascotId,
        dailyGoal,
        interests,
        knowledgeLevel,
        hasCompletedOnboarding: true,
      });
    },
    [updateProgress]
  );

  const completeLesson = useCallback((attempt: LessonAttempt) => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      const todayISO = new Date().toISOString();

      let newDailyXp = prev.dailyXpDate === today ? prev.dailyXp : 0;
      newDailyXp += attempt.xpEarned;

      let newStreak = prev.currentStreak;
      const lastActive = prev.lastActiveDate ? new Date(prev.lastActiveDate).toDateString() : '';
      if (lastActive !== today) newStreak += 1;

      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      const newMastery = { ...prev.masteryLevels };
      const currentMastery = newMastery[attempt.lessonId] || 0;
      if (attempt.isPerfect) {
        newMastery[attempt.lessonId] = Math.min(currentMastery + 1, 5);
      } else if (currentMastery === 0) {
        newMastery[attempt.lessonId] = 0;
      }

      const newBadges = [...prev.badges];
      const award = (id: string) => {
        if (!newBadges.includes(id)) newBadges.push(id);
      };
      if (!prev.completedLessons.length) award('first-lesson');
      if (attempt.isPerfect) award('perfect-lesson');
      if (newStreak >= 3) award('streak-3');
      if (newStreak >= 7) award('streak-7');
      if (newStreak >= 30) award('streak-30');

      const newTotalXp = prev.totalXp + attempt.xpEarned;
      if (newTotalXp >= 100) award('xp-100');
      if (newTotalXp >= 500) award('xp-500');

      const isNewBattle = !prev.studiedBattles.includes(attempt.battleId);
      const daily = freshDaily(prev.daily);
      const newDaily: DailyStats = {
        ...daily,
        xp: daily.xp + attempt.xpEarned,
        lessons: daily.lessons + 1,
        perfect: daily.perfect + (attempt.isPerfect ? 1 : 0),
        newBattles: daily.newBattles + (isNewBattle ? 1 : 0),
      };

      const newProgress: UserProgress = {
        ...prev,
        completedLessons: [...new Set([...prev.completedLessons, attempt.lessonId])],
        studiedBattles: isNewBattle ? [...prev.studiedBattles, attempt.battleId] : prev.studiedBattles,
        masteryLevels: newMastery,
        totalXp: newTotalXp,
        dailyXp: newDailyXp,
        dailyXpDate: today,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastActiveDate: todayISO,
        badges: newBadges,
        daily: newDaily,
      };

      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const loseHeart = useCallback(() => {
    setProgress((prev) => {
      if (prev.hearts > 0) {
        const newProgress = { ...prev, hearts: prev.hearts - 1 };
        saveProgressRef.current(newProgress);
        return newProgress;
      }
      return prev;
    });
  }, []);

  const recordQuestionAttempt = useCallback((attempt: Omit<QuestionAttempt, 'id' | 'timestamp'>) => {
    setProgress((prev) => {
      const fullAttempt: QuestionAttempt = {
        ...attempt,
        id: `${attempt.lessonId}-${attempt.stepId}-${Date.now()}-${++questionAttemptCounter}`,
        timestamp: new Date().toISOString(),
      };
      const newAttempts = [fullAttempt, ...prev.questionAttempts].slice(0, MAX_QUESTION_HISTORY);
      const daily = freshDaily(prev.daily);
      const newDaily = attempt.isCorrect ? { ...daily, correct: daily.correct + 1 } : daily;
      const newWrong = { ...prev.wrongAnswers };
      if (!attempt.isCorrect) {
        newWrong[attempt.battleId] = (newWrong[attempt.battleId] || 0) + 1;
      }
      const newProgress = { ...prev, questionAttempts: newAttempts, daily: newDaily, wrongAnswers: newWrong };
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const gainHeartFromReview = useCallback(() => {
    setProgress((prev) => {
      if (prev.hearts < MAX_HEARTS) {
        const newProgress = { ...prev, hearts: prev.hearts + 1 };
        saveProgressRef.current(newProgress);
        return newProgress;
      }
      return prev;
    });
  }, []);

  const claimQuest = useCallback((quest: QuestDef) => {
    setProgress((prev) => {
      const daily = freshDaily(prev.daily);
      if (daily.claimed.includes(quest.id) || !isQuestComplete(quest, daily)) return prev;
      const xpBonus = quest.reward.xp ?? 0;
      const heartBonus = quest.reward.hearts ?? 0;
      const newProgress: UserProgress = {
        ...prev,
        totalXp: prev.totalXp + xpBonus,
        hearts: Math.min(MAX_HEARTS, prev.hearts + heartBonus),
        daily: { ...daily, claimed: [...daily.claimed, quest.id] },
      };
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const getLessonMastery = useCallback(
    (lessonId: string) => progress.masteryLevels[lessonId] || 0,
    [progress.masteryLevels]
  );

  const getDailyGoalProgress = useCallback(() => {
    const today = new Date().toDateString();
    if (progress.dailyXpDate !== today) return 0;
    return Math.min(progress.dailyXp / (progress.dailyGoal * 10), 1);
  }, [progress.dailyXp, progress.dailyXpDate, progress.dailyGoal]);

  const dailyQuests = useMemo(() => getDailyQuests(todayKey()), []);
  const daily = freshDaily(progress.daily);
  const claimableQuestCount = dailyQuests.filter(
    (q) => isQuestComplete(q, daily) && !daily.claimed.includes(q.id)
  ).length;

  return {
    progress,
    daily,
    dailyQuests,
    claimableQuestCount,
    isLoading: progressQuery.isLoading,
    completeOnboarding,
    completeLesson,
    loseHeart,
    recordQuestionAttempt,
    gainHeartFromReview,
    claimQuest,
    isLessonCompleted,
    getLessonMastery,
    getDailyGoalProgress,
    updateProgress,
  };
});
