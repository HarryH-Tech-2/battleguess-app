import { useRef, useEffect, useCallback, useState } from 'react';
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
import { Flame, Star, Lock, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { units } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 70;
const BRANCH_WIDTH = 100;

// Continent configuration
const continents = [
  { id: 'europe', name: 'Europe', color: '#4A90D9' },
  { id: 'asia', name: 'Asia', color: '#E85D75' },
  { id: 'africa', name: 'Africa', color: '#F5A623' },
  { id: 'americas', name: 'Americas', color: '#7B68EE' },
];

export default function LearnScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [expandedContinent, setExpandedContinent] = useState<string | null>('europe');

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

  // Get units for a specific continent
  const getUnitsForContinent = useCallback((continentId: string) => {
    return units
      .filter(u => u.continent === continentId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, []);

  // Check if unit is unlocked (first unit of each continent is always unlocked)
  const isUnitUnlocked = useCallback((unit: typeof units[0], continentUnits: typeof units) => {
    const unitIndex = continentUnits.findIndex(u => u.id === unit.id);
    if (unitIndex === 0) return true;

    const prevUnit = continentUnits[unitIndex - 1];
    if (!prevUnit) return true;

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

  // Get continent progress
  const getContinentProgress = useCallback((continentId: string) => {
    const continentUnits = getUnitsForContinent(continentId);
    let totalLessons = 0;
    let completedLessons = 0;

    continentUnits.forEach(unit => {
      const unitLessons = getLessonsByUnitId(unit.id);
      totalLessons += unitLessons.length;
      completedLessons += unitLessons.filter(l => isLessonCompleted(l.id)).length;
    });

    return { completed: completedLessons, total: totalLessons };
  }, [getUnitsForContinent, isLessonCompleted]);

  const handleNodePress = (unit: typeof units[0], continentUnits: typeof units) => {
    if (!isUnitUnlocked(unit, continentUnits)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextLesson = getNextLesson(unit.id);
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  const handleContinentPress = (continentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedContinent(expandedContinent === continentId ? null : continentId);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={20} color={colors.streak} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
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
        {/* Main branching path */}
        <View style={styles.branchingPath}>
          {continents.map((continent, continentIndex) => {
            const continentUnits = getUnitsForContinent(continent.id);
            const continentProgress = getContinentProgress(continent.id);
            const isExpanded = expandedContinent === continent.id;
            const isComplete = continentProgress.completed === continentProgress.total && continentProgress.total > 0;

            return (
              <View key={continent.id} style={styles.continentSection}>
                {/* Connector line from previous continent */}
                {continentIndex > 0 && (
                  <View style={styles.continentConnector}>
                    <View style={[styles.connectorLine, { backgroundColor: colors.pathLine }]} />
                  </View>
                )}

                {/* Continent header button */}
                <TouchableOpacity
                  style={[
                    styles.continentHeader,
                    { borderColor: continent.color },
                    isExpanded && { backgroundColor: continent.color + '15' },
                  ]}
                  onPress={() => handleContinentPress(continent.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.continentDot, { backgroundColor: continent.color }]} />
                  <View style={styles.continentInfo}>
                    <Text style={[styles.continentName, { color: continent.color }]}>
                      {continent.name}
                    </Text>
                    <Text style={styles.continentProgressText}>
                      {continentProgress.completed}/{continentProgress.total} lessons
                    </Text>
                  </View>
                  <View style={styles.continentExpandIcon}>
                    {isExpanded ? (
                      <ChevronUp size={20} color={continent.color} />
                    ) : (
                      <ChevronDown size={20} color={continent.color} />
                    )}
                  </View>
                  {isComplete && (
                    <View style={[styles.completeBadge, { backgroundColor: colors.success }]}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Expanded units path */}
                {isExpanded && (
                  <View style={styles.unitsContainer}>
                    {continentUnits.map((unit, index) => {
                      const unlocked = isUnitUnlocked(unit, continentUnits);
                      const unitProgress = getUnitProgress(unit.id);
                      const isUnitComplete = unitProgress.completed === unitProgress.total && unitProgress.total > 0;
                      const isCurrent = unlocked && !isUnitComplete;

                      return (
                        <View key={unit.id} style={styles.unitRow}>
                          {/* Vertical connector */}
                          <View style={styles.unitConnectorContainer}>
                            <View
                              style={[
                                styles.unitConnectorLine,
                                { backgroundColor: unlocked ? continent.color : colors.pathLine },
                              ]}
                            />
                          </View>

                          {/* Unit node */}
                          <Animated.View
                            style={[
                              styles.unitNodeWrapper,
                              { transform: [{ scale: isCurrent ? pulseAnim : 1 }] },
                            ]}
                          >
                            <TouchableOpacity
                              style={[
                                styles.unitNode,
                                { borderColor: continent.color },
                                !unlocked && styles.unitNodeLocked,
                                isUnitComplete && { backgroundColor: continent.color },
                                isCurrent && { backgroundColor: continent.color + '30' },
                              ]}
                              onPress={() => handleNodePress(unit, continentUnits)}
                              activeOpacity={0.7}
                            >
                              {!unlocked ? (
                                <Lock size={24} color={colors.textLight} />
                              ) : isUnitComplete ? (
                                <Check size={26} color="#FFFFFF" strokeWidth={3} />
                              ) : (
                                <Text style={styles.unitIcon}>{unit.icon}</Text>
                              )}
                            </TouchableOpacity>

                            <View style={styles.unitInfo}>
                              <Text
                                style={[
                                  styles.unitTitle,
                                  !unlocked && styles.unitTitleLocked,
                                ]}
                                numberOfLines={2}
                              >
                                {unit.title}
                              </Text>
                              <Text style={styles.unitProgressText}>
                                {unitProgress.completed}/{unitProgress.total}
                              </Text>
                            </View>
                          </Animated.View>
                        </View>
                      );
                    })}
                  </View>
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
    paddingVertical: 12,
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
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  branchingPath: {
    width: '100%',
  },
  continentSection: {
    marginBottom: 8,
  },
  continentConnector: {
    height: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  connectorLine: {
    width: 3,
    height: '100%',
    borderRadius: 2,
  },
  continentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    position: 'relative',
  },
  continentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  continentInfo: {
    flex: 1,
  },
  continentName: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  continentProgressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  continentExpandIcon: {
    marginLeft: 8,
  },
  completeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  unitsContainer: {
    marginLeft: 24,
    marginTop: 4,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 90,
  },
  unitConnectorContainer: {
    width: 24,
    alignItems: 'center',
    paddingTop: 0,
    height: '100%',
  },
  unitConnectorLine: {
    width: 3,
    height: '100%',
    borderRadius: 2,
  },
  unitNodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  unitNode: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: colors.card,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitNodeLocked: {
    backgroundColor: colors.pathNodeLocked,
    borderColor: colors.pathLine,
  },
  unitIcon: {
    fontSize: 26,
  },
  unitInfo: {
    marginLeft: 16,
    flex: 1,
  },
  unitTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  unitTitleLocked: {
    color: colors.textLight,
  },
  unitProgressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
