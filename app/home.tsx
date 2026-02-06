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
import { Flame, Heart, Star, User, Lock, Check } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { units } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const NODE_SIZE = 70;

export default function HomeScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const styles = createStyles(colors);

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

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={20} color={colors.streak} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color={colors.hearts} fill={colors.hearts} />
            <Text style={styles.statValue}>{progress.hearts}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color={colors.xp} fill={colors.xp} />
            <Text style={styles.statValue}>{progress.totalXp}</Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            {mascot ? (
              <Image source={{ uri: mascot.avatar }} style={styles.profileImage} />
            ) : (
              <User size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

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
                      <Lock size={28} color={colors.textLight} />
                    ) : isComplete ? (
                      <Check size={32} color={colors.textInverse} strokeWidth={3} />
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  profileButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
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
    backgroundColor: colors.pathLine,
    borderRadius: 2,
    marginVertical: 8,
  },
  pathLineComplete: {
    backgroundColor: colors.pathNodeComplete,
  },
  nodeWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeLocked: {
    backgroundColor: colors.pathNodeLocked,
    shadowOpacity: 0,
  },
  nodeComplete: {
    backgroundColor: colors.pathNodeComplete,
    shadowColor: colors.pathNodeComplete,
  },
  nodeCurrent: {
    borderWidth: 4,
    borderColor: colors.secondary,
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
    color: colors.text,
    textAlign: 'center',
  },
  nodeTitleLocked: {
    color: colors.textLight,
  },
  nodeProgress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
