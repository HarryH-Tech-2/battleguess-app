import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProgress, DailyGoal, Interest, KnowledgeLevel, LessonAttempt } from '@/types';

const STORAGE_KEY = 'battleguess_progress';
const HEARTS_REFILL_HOURS = 4;
const MAX_HEARTS = 5;

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
};

export const [UserProgressProvider, useUserProgress] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  const progressQuery = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      console.log('[UserProgress] Loading from storage...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProgress;
        console.log('[UserProgress] Loaded:', parsed);
        return parsed;
      }
      console.log('[UserProgress] No stored data, using defaults');
      return defaultProgress;
    },
  });

  const { mutate: saveProgress } = useMutation({
    mutationFn: async (newProgress: UserProgress) => {
      console.log('[UserProgress] Saving...', newProgress);
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
      const newHearts = Math.min(p.hearts + heartsToAdd, MAX_HEARTS);
      return {
        ...p,
        hearts: newHearts,
        lastHeartRefill: now.toISOString(),
      };
    }
    return p;
  };

  const checkStreak = (p: UserProgress): UserProgress => {
    const today = new Date().toDateString();
    const lastActive = p.lastActiveDate ? new Date(p.lastActiveDate).toDateString() : '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today) {
      return p;
    }

    if (lastActive === yesterday) {
      return p;
    }

    if (lastActive && lastActive !== today && lastActive !== yesterday) {
      console.log('[UserProgress] Streak broken!');
      return { ...p, currentStreak: 0 };
    }

    return p;
  };

  useEffect(() => {
    if (progressQuery.data) {
      const updated = checkAndRefillHearts(progressQuery.data);
      const withStreak = checkStreak(updated);
      setProgress(withStreak);
      if (updated !== progressQuery.data || withStreak !== updated) {
        saveProgressRef.current(withStreak);
      }
    }
  }, [progressQuery.data]);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const completeOnboarding = useCallback((
    mascotId: string,
    dailyGoal: DailyGoal,
    interests: Interest[],
    knowledgeLevel: KnowledgeLevel
  ) => {
    console.log('[UserProgress] Completing onboarding...');
    updateProgress({
      selectedMascotId: mascotId,
      dailyGoal,
      interests,
      knowledgeLevel,
      hasCompletedOnboarding: true,
    });
  }, [updateProgress]);

  const completeLesson = useCallback((attempt: LessonAttempt) => {
    setProgress(prev => {
      const today = new Date().toDateString();
      const todayISO = new Date().toISOString();
      
      let newDailyXp = prev.dailyXp;
      if (prev.dailyXpDate !== today) {
        newDailyXp = 0;
      }
      newDailyXp += attempt.xpEarned;

      let newStreak = prev.currentStreak;
      const lastActive = prev.lastActiveDate ? new Date(prev.lastActiveDate).toDateString() : '';
      if (lastActive !== today) {
        newStreak += 1;
      }

      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      const newMastery = { ...prev.masteryLevels };
      const currentMastery = newMastery[attempt.lessonId] || 0;
      if (attempt.isPerfect) {
        newMastery[attempt.lessonId] = Math.min(currentMastery + 1, 5);
      }

      const newBadges = [...prev.badges];
      if (!prev.completedLessons.length && !newBadges.includes('first-lesson')) {
        newBadges.push('first-lesson');
      }
      if (attempt.isPerfect && !newBadges.includes('perfect-lesson')) {
        newBadges.push('perfect-lesson');
      }
      if (newStreak >= 3 && !newBadges.includes('streak-3')) {
        newBadges.push('streak-3');
      }
      if (newStreak >= 7 && !newBadges.includes('streak-7')) {
        newBadges.push('streak-7');
      }

      const newTotalXp = prev.totalXp + attempt.xpEarned;
      if (newTotalXp >= 100 && !newBadges.includes('xp-100')) {
        newBadges.push('xp-100');
      }
      if (newTotalXp >= 500 && !newBadges.includes('xp-500')) {
        newBadges.push('xp-500');
      }

      const newProgress = {
        ...prev,
        completedLessons: [...new Set([...prev.completedLessons, attempt.lessonId])],
        masteryLevels: newMastery,
        totalXp: newTotalXp,
        dailyXp: newDailyXp,
        dailyXpDate: today,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastActiveDate: todayISO,
        badges: newBadges,
      };
      
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const loseHeart = useCallback(() => {
    setProgress(prev => {
      if (prev.hearts > 0) {
        const newProgress = { ...prev, hearts: prev.hearts - 1 };
        saveProgressRef.current(newProgress);
        return newProgress;
      }
      return prev;
    });
  }, []);

  const recordWrongAnswer = useCallback((battleId: string) => {
    setProgress(prev => {
      const newWrong = { ...prev.wrongAnswers };
      newWrong[battleId] = (newWrong[battleId] || 0) + 1;
      const newProgress = { ...prev, wrongAnswers: newWrong };
      saveProgressRef.current(newProgress);
      return newProgress;
    });
  }, []);

  const gainHeartFromReview = useCallback(() => {
    setProgress(prev => {
      if (prev.hearts < MAX_HEARTS) {
        const newProgress = { ...prev, hearts: prev.hearts + 1 };
        saveProgressRef.current(newProgress);
        return newProgress;
      }
      return prev;
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const getLessonMastery = useCallback((lessonId: string) => {
    return progress.masteryLevels[lessonId] || 0;
  }, [progress.masteryLevels]);

  const getDailyGoalProgress = useCallback(() => {
    const today = new Date().toDateString();
    if (progress.dailyXpDate !== today) return 0;
    return Math.min(progress.dailyXp / (progress.dailyGoal * 10), 1);
  }, [progress.dailyXp, progress.dailyXpDate, progress.dailyGoal]);

  return {
    progress,
    isLoading: progressQuery.isLoading,
    completeOnboarding,
    completeLesson,
    loseHeart,
    recordWrongAnswer,
    gainHeartFromReview,
    isLessonCompleted,
    getLessonMastery,
    getDailyGoalProgress,
    updateProgress,
  };
});
