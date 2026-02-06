import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Flame, Heart, Star, Lock, Check } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { units } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 70;
const BRANCH_OFFSET = 70;

// Get continent color/icon for visual distinction
const getContinentStyle = (continent: string) => {
  switch (continent) {
    case 'europe':
      return { color: '#4A90D9', icon: '🏰' };
    case 'asia':
      return { color: '#E85D75', icon: '🏯' };
    case 'africa':
      return { color: '#F5A623', icon: '🌴' };
    case 'americas':
      return { color: '#7B68EE', icon: '🗽' };
    default:
      return { color: '#4A90D9', icon: '🌍' };
  }
};

// Generate a branching pattern based on continent changes
const getBranchPosition = (index: number, continent: string, prevContinent: string | null): 'left' | 'center' | 'right' => {
  // When continent changes, branch in a different direction
  if (prevContinent && continent !== prevContinent) {
    const continentOrder = ['europe', 'asia', 'africa', 'americas'];
    const currentIdx = continentOrder.indexOf(continent);
    if (currentIdx % 2 === 0) return 'left';
    return 'right';
  }

  // Within same continent, create a winding path
  const patterns: ('left' | 'center' | 'right')[][] = [
    ['center', 'left', 'center', 'right', 'center', 'left'],
    ['center', 'right', 'center', 'left', 'center', 'right'],
  ];
  const patternIndex = Math.floor(index / 6) % patterns.length;
  const positionIndex = index % 6;
  return patterns[patternIndex][positionIndex];
};

// Sort units to create an interesting path across continents
const getSortedUnits = () => {
  const continentOrder = ['europe', 'asia', 'europe', 'africa', 'americas', 'asia', 'europe', 'africa', 'americas'];
  const usedUnits = new Set<string>();
  const sortedUnits: typeof units = [];

  continentOrder.forEach(continent => {
    const continentUnits = units
      .filter(u => u.continent === continent && !usedUnits.has(u.id))
      .sort((a, b) => a.orderIndex - b.orderIndex);

    if (continentUnits.length > 0) {
      const unit = continentUnits[0];
      sortedUnits.push(unit);
      usedUnits.add(unit.id);
    }
  });

  // Add remaining units
  units.forEach(unit => {
    if (!usedUnits.has(unit.id)) {
      sortedUnits.push(unit);
    }
  });

  return sortedUnits;
};

export default function LearnScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const sortedUnits = getSortedUnits();

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
    const prevUnit = sortedUnits[unitIndex - 1];
    if (!prevUnit) return true;
    const prevLessons = getLessonsByUnitId(prevUnit.id);
    const completedCount = prevLessons.filter(l => isLessonCompleted(l.id)).length;
    return completedCount >= Math.min(2, prevLessons.length);
  }, [isLessonCompleted, sortedUnits]);

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
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  const styles = createStyles(colors);

  const getNodeHorizontalPosition = (position: 'left' | 'center' | 'right') => {
    switch (position) {
      case 'left':
        return -BRANCH_OFFSET;
      case 'right':
        return BRANCH_OFFSET;
      default:
        return 0;
    }
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
          <View style={styles.profileButton}>
            {mascot ? (
              <Image source={{ uri: mascot.avatar }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.path}>
          {sortedUnits.map((unit, index) => {
            const unlocked = isUnitUnlocked(index);
            const unitProgress = getUnitProgress(unit.id);
            const isComplete = unitProgress.completed === unitProgress.total && unitProgress.total > 0;
            const isCurrent = unlocked && !isComplete;
            const prevContinent = index > 0 ? sortedUnits[index - 1].continent : null;
            const branchPosition = getBranchPosition(index, unit.continent, prevContinent);
            const horizontalOffset = getNodeHorizontalPosition(branchPosition);
            const prevPosition = index > 0 ? getBranchPosition(index - 1, sortedUnits[index - 1].continent, index > 1 ? sortedUnits[index - 2].continent : null) : 'center';
            const prevOffset = getNodeHorizontalPosition(prevPosition);
            const continentStyle = getContinentStyle(unit.continent);
            const isContinentChange = prevContinent && unit.continent !== prevContinent;

            return (
              <View key={unit.id} style={styles.nodeContainer}>
                {/* Branching path connectors */}
                {index > 0 && (
                  <View style={styles.pathLineContainer}>
                    {/* SVG-like curved path using multiple lines */}
                    {prevOffset === horizontalOffset ? (
                      // Straight vertical line
                      <View
                        style={[
                          styles.pathLineVertical,
                          unlocked && styles.pathLineComplete,
                          {
                            left: SCREEN_WIDTH / 2 - 2 + prevOffset,
                            height: 40,
                          },
                        ]}
                      />
                    ) : (
                      // Curved path using diagonal segments
                      <>
                        {/* Top vertical segment */}
                        <View
                          style={[
                            styles.pathLineVertical,
                            unlocked && styles.pathLineComplete,
                            {
                              left: SCREEN_WIDTH / 2 - 2 + prevOffset,
                              height: 12,
                              top: 0,
                            },
                          ]}
                        />
                        {/* Horizontal connector */}
                        <View
                          style={[
                            styles.pathLineHorizontal,
                            unlocked && styles.pathLineComplete,
                            isContinentChange && { backgroundColor: continentStyle.color },
                            {
                              left: Math.min(SCREEN_WIDTH / 2 + prevOffset, SCREEN_WIDTH / 2 + horizontalOffset) - 2,
                              width: Math.abs(horizontalOffset - prevOffset) + 4,
                              top: 12,
                            },
                          ]}
                        />
                        {/* Bottom vertical segment */}
                        <View
                          style={[
                            styles.pathLineVertical,
                            unlocked && styles.pathLineComplete,
                            {
                              left: SCREEN_WIDTH / 2 - 2 + horizontalOffset,
                              height: 24,
                              top: 16,
                            },
                          ]}
                        />
                      </>
                    )}
                  </View>
                )}

                {/* Continent change indicator */}
                {isContinentChange && (
                  <View style={[styles.continentBadge, { backgroundColor: continentStyle.color }]}>
                    <Text style={styles.continentBadgeText}>{continentStyle.icon}</Text>
                  </View>
                )}

                <Animated.View
                  style={[
                    styles.nodeWrapper,
                    { transform: [{ scale: isCurrent ? pulseAnim : 1 }, { translateX: horizontalOffset }] },
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
    paddingBottom: 16,
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
  profilePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: colors.pathLine,
    borderRadius: 20,
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
    width: '100%',
    marginBottom: 20,
  },
  pathLineContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
  },
  pathLineVertical: {
    position: 'absolute',
    width: 4,
    backgroundColor: colors.pathLine,
    borderRadius: 2,
  },
  pathLineHorizontal: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.pathLine,
    borderRadius: 2,
  },
  pathLineComplete: {
    backgroundColor: colors.pathNodeComplete,
  },
  continentBadge: {
    position: 'absolute',
    top: -30,
    left: SCREEN_WIDTH / 2 - 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continentBadgeText: {
    fontSize: 16,
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
