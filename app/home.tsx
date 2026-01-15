import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Flame, Heart, Star, User, Lock, Check, ChevronRight, BookOpen } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { units } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';
import Colors from '@/constants/colors';

const NODE_SIZE = 70;

export default function HomeScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted, getDailyGoalProgress } = useUserProgress();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dailyProgress = getDailyGoalProgress();

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const isUnitUnlocked = useCallback((unitIndex: number) => {
    if (unitIndex === 0) return true;
    const prevUnit = units[unitIndex - 1];
    const prevLessons = getLessonsByUnitId(prevUnit.id);
    const completedCount = prevLessons.filter(l => isLessonCompleted(l.id)).length;
    return completedCount >= Math.min(2, prevLessons.length);
  }, [isLessonCompleted]);

  const getNextLesson = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    return unitLessons.find(l => !isLessonCompleted(l.id)) || unitLessons[0];
  }, [isLessonCompleted]);

  const getUnitProgress = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    const completed = unitLessons.filter(l => isLessonCompleted(l.id)).length;
    return { completed, total: unitLessons.length };
  }, [isLessonCompleted]);

  const handleNodePress = (unitId: string, unitIndex: number) => {
    if (!isUnitUnlocked(unitIndex)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextLesson = getNextLesson(unitId);
    router.push(`/lesson/${nextLesson.id}`);
  };

  const handleReviewPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/review');
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={20} color={Colors.streak} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color={Colors.hearts} fill={Colors.hearts} />
            <Text style={styles.statValue}>{progress.hearts}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color={Colors.xp} fill={Colors.xp} />
            <Text style={styles.statValue}>{progress.totalXp}</Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            {mascot ? (
              <Image source={{ uri: mascot.avatar }} style={styles.profileImage} />
            ) : (
              <User size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.dailyGoalContainer}>
          <View style={styles.dailyGoalHeader}>
            <Text style={styles.dailyGoalTitle}>Daily Goal</Text>
            <Text style={styles.dailyGoalPercent}>{Math.round(dailyProgress * 100)}%</Text>
          </View>
          <View style={styles.dailyGoalBar}>
            <View style={[styles.dailyGoalFill, { width: `${dailyProgress * 100}%` }]} />
          </View>
        </View>
      </View>

      {progress.completedLessons.length > 0 && (
        <TouchableOpacity style={styles.reviewBanner} onPress={handleReviewPress} activeOpacity={0.8}>
          <BookOpen size={24} color={Colors.secondary} />
          <View style={styles.reviewTextContainer}>
            <Text style={styles.reviewTitle}>Daily Review Ready</Text>
            <Text style={styles.reviewSubtitle}>Practice what you have learned</Text>
          </View>
          <ChevronRight size={24} color={Colors.secondary} />
        </TouchableOpacity>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.path}>
          {units.map((unit, index) => {
            const unlocked = isUnitUnlocked(index);
            const unitProgress = getUnitProgress(unit.id);
            const isComplete = unitProgress.completed === unitProgress.total;
            const isCurrent = unlocked && !isComplete;

            return (
              <View key={unit.id} style={styles.nodeContainer}>
                <Animated.View
                  style={[
                    styles.nodeWrapper,
                    { transform: [{ scale: isCurrent ? pulseAnim : 1 }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.node,
                      !unlocked && styles.nodeLocked,
                      isComplete && styles.nodeComplete,
                      isCurrent && styles.nodeCurrent,
                    ]}
                    onPress={() => handleNodePress(unit.id, index)}
                    activeOpacity={0.7}
                  >
                    {!unlocked ? (
                      <Lock size={28} color={Colors.textLight} />
                    ) : isComplete ? (
                      <Check size={32} color={Colors.textInverse} strokeWidth={3} />
                    ) : (
                      <Text style={styles.nodeIcon}>{unit.icon}</Text>
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.nodeInfo}>
                    <Text style={[
                      styles.nodeTitle,
                      !unlocked && styles.nodeTitleLocked,
                    ]} numberOfLines={1}>
                      {unit.title}
                    </Text>
                    <Text style={styles.nodeProgress}>
                      {unitProgress.completed}/{unitProgress.total} lessons
                    </Text>
                  </View>
                </Animated.View>
                
                {index < units.length - 1 && (
                  <View style={[
                    styles.pathLine,
                    unlocked && styles.pathLineComplete,
                  ]} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  profileButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  dailyGoalContainer: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 12,
    padding: 12,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dailyGoalTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  dailyGoalPercent: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  dailyGoalBar: {
    height: 8,
    backgroundColor: Colors.pathLine,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dailyGoalFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '15',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
    gap: 12,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  reviewSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  pathContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  path: {
    alignItems: 'center',
    width: '100%',
  },
  nodeContainer: {
    alignItems: 'center',
  },
  pathLine: {
    width: 4,
    height: 32,
    backgroundColor: Colors.pathLine,
    borderRadius: 2,
    marginVertical: 8,
  },
  pathLineComplete: {
    backgroundColor: Colors.pathNodeComplete,
  },
  nodeWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeLocked: {
    backgroundColor: Colors.pathNodeLocked,
    shadowOpacity: 0,
  },
  nodeComplete: {
    backgroundColor: Colors.pathNodeComplete,
    shadowColor: Colors.pathNodeComplete,
  },
  nodeCurrent: {
    borderWidth: 4,
    borderColor: Colors.secondary,
  },
  nodeIcon: {
    fontSize: 28,
  },
  nodeInfo: {
    alignItems: 'center',
    maxWidth: 140,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  nodeTitleLocked: {
    color: Colors.textLight,
  },
  nodeProgress: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
