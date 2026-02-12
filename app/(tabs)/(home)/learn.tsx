import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
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
import { Flame, Star, Lock, Check, ChevronDown, Globe } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { units, getUnitsByContinent } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 72;
const PATH_WIDTH = SCREEN_WIDTH - 40;
const CENTER_X = PATH_WIDTH / 2;
const HORIZONTAL_OFFSET = 80;
const VERTICAL_SPACING = 120;

// Orange color palette (Duolingo-inspired but warmer)
const THEME_COLORS = {
  primary: '#FF9500',
  primaryDark: '#E68600',
  success: '#58CC02',
  successDark: '#4CAF00',
  locked: '#E5E5E5',
  lockedBorder: '#AFAFAF',
  current: '#FFC800',
  pathLine: '#E5E5E5',
  pathLineComplete: '#58CC02',
};

// Continent data with icons and colors
const CONTINENTS = [
  { id: 'all', name: 'All Continents', icon: '🌍', color: '#FF9500' },
  { id: 'europe', name: 'Europe', icon: '🏰', color: '#3B82F6' },
  { id: 'asia', name: 'Asia', icon: '🏯', color: '#EF4444' },
  { id: 'africa', name: 'Africa', icon: '🌴', color: '#F59E0B' },
  { id: 'americas', name: 'Americas', icon: '🗽', color: '#10B981' },
];

// Get winding path position (alternates left-center-right like Duolingo)
const getNodePosition = (index: number): 'left' | 'center' | 'right' => {
  // Pattern: center, right, center, left, center, right, center, left...
  const pattern: ('left' | 'center' | 'right')[] = ['center', 'right', 'center', 'left'];
  return pattern[index % pattern.length];
};

const getHorizontalOffset = (position: 'left' | 'center' | 'right'): number => {
  switch (position) {
    case 'left': return -HORIZONTAL_OFFSET;
    case 'right': return HORIZONTAL_OFFSET;
    default: return 0;
  }
};

export default function LearnScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [showContinentMenu, setShowContinentMenu] = useState(false);

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const selectedContinentData = CONTINENTS.find(c => c.id === selectedContinent) || CONTINENTS[0];

  // Get units for selected continent
  const filteredUnits = useMemo(() => {
    const continentUnits = getUnitsByContinent(selectedContinent);
    return continentUnits.sort((a, b) => a.orderIndex - b.orderIndex);
  }, [selectedContinent]);

  useEffect(() => {
    // Pulse animation for current node
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const isUnitUnlocked = useCallback((unitIndex: number) => {
    if (unitIndex === 0) return true;
    // Must complete ALL lessons in the previous unit to unlock the next one
    const prevUnit = filteredUnits[unitIndex - 1];
    const prevLessons = getLessonsByUnitId(prevUnit.id);
    const completedCount = prevLessons.filter(l => isLessonCompleted(l.id)).length;
    return completedCount >= prevLessons.length;
  }, [isLessonCompleted, filteredUnits]);

  const getNextLesson = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    return unitLessons.find(l => !isLessonCompleted(l.id)) || unitLessons[0];
  }, [isLessonCompleted]);

  const getUnitProgress = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    const completed = unitLessons.filter(l => isLessonCompleted(l.id)).length;
    return { completed, total: unitLessons.length };
  }, [isLessonCompleted]);

  // Find current unit index (first incomplete unlocked unit)
  const currentUnitIndex = useMemo(() => {
    for (let i = 0; i < filteredUnits.length; i++) {
      if (!isUnitUnlocked(i)) continue;
      const unitProgress = getUnitProgress(filteredUnits[i].id);
      if (unitProgress.completed < unitProgress.total) return i;
    }
    return 0;
  }, [filteredUnits, isUnitUnlocked, getUnitProgress]);

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

  const handleContinentSelect = (continentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContinent(continentId);
    setShowContinentMenu(false);
  };

  const styles = createStyles(colors);

  // Generate SVG path for the winding line
  const generatePath = () => {
    if (filteredUnits.length === 0) return '';

    let pathD = '';
    const nodePositions: { x: number; y: number }[] = [];

    filteredUnits.forEach((_, index) => {
      const position = getNodePosition(index);
      const x = CENTER_X + getHorizontalOffset(position);
      const y = 60 + index * VERTICAL_SPACING;
      nodePositions.push({ x, y });
    });

    // Draw curved paths between nodes
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      const midY = (current.y + next.y) / 2;

      if (i === 0) {
        pathD += `M ${current.x} ${current.y + NODE_SIZE / 2}`;
      }

      // Create S-curve between nodes
      pathD += ` C ${current.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y - NODE_SIZE / 2}`;
    }

    return pathD;
  };

  const pathD = generatePath();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={22} color={THEME_COLORS.primary} />
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={22} color={THEME_COLORS.current} fill={THEME_COLORS.current} />
            <Text style={styles.statValue}>{progress.totalXp}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            {mascot ? (
              <Image source={{ uri: mascot.avatar }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Continent Selector */}
      <View style={styles.continentSelectorContainer}>
        <TouchableOpacity
          style={styles.continentSelector}
          onPress={() => setShowContinentMenu(!showContinentMenu)}
          activeOpacity={0.7}
        >
          <Text style={styles.continentIcon}>{selectedContinentData.icon}</Text>
          <Text style={styles.continentName}>{selectedContinentData.name}</Text>
          <ChevronDown
            size={20}
            color="#4B4B4B"
            style={{ transform: [{ rotate: showContinentMenu ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {showContinentMenu && (
          <View style={styles.continentMenu}>
            {CONTINENTS.map((continent) => (
              <TouchableOpacity
                key={continent.id}
                style={[
                  styles.continentMenuItem,
                  selectedContinent === continent.id && styles.continentMenuItemActive,
                ]}
                onPress={() => handleContinentSelect(continent.id)}
              >
                <Text style={styles.continentMenuIcon}>{continent.icon}</Text>
                <Text style={[
                  styles.continentMenuText,
                  selectedContinent === continent.id && styles.continentMenuTextActive,
                ]}>
                  {continent.name}
                </Text>
                {selectedContinent === continent.id && (
                  <Check size={18} color={THEME_COLORS.success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.pathContainer,
          { minHeight: filteredUnits.length * VERTICAL_SPACING + 200 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredUnits.length === 0 ? (
          <View style={styles.emptyState}>
            <Globe size={48} color={THEME_COLORS.locked} />
            <Text style={styles.emptyStateText}>No battles found for this continent</Text>
          </View>
        ) : (
          <>
            {/* SVG Path background */}
            <View style={styles.pathSvgContainer}>
              <Svg width={PATH_WIDTH} height={filteredUnits.length * VERTICAL_SPACING + 100}>
                {/* Background path */}
                <Path
                  d={pathD}
                  stroke={THEME_COLORS.pathLine}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            {/* Nodes */}
            <View style={styles.nodesContainer}>
              {filteredUnits.map((unit, index) => {
                const unlocked = isUnitUnlocked(index);
                const unitProgress = getUnitProgress(unit.id);
                const isComplete = unitProgress.completed === unitProgress.total && unitProgress.total > 0;
                const isCurrent = index === currentUnitIndex;
                const position = getNodePosition(index);
                const horizontalOffset = getHorizontalOffset(position);

                return (
                  <View
                    key={unit.id}
                    style={[
                      styles.nodeRow,
                      { height: VERTICAL_SPACING }
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.nodeWrapper,
                        {
                          transform: [
                            { translateX: horizontalOffset },
                            { scale: isCurrent ? pulseAnim : 1 },
                          ],
                        },
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
                          <Lock size={28} color={THEME_COLORS.lockedBorder} />
                        ) : isComplete ? (
                          <Check size={32} color="#FFFFFF" strokeWidth={3} />
                        ) : (
                          <Text style={styles.nodeIcon}>{unit.icon}</Text>
                        )}
                      </TouchableOpacity>

                      {/* Unit title below node */}
                      <View style={styles.unitTitleContainer}>
                        <Text style={[
                          styles.unitTitle,
                          !unlocked && styles.unitTitleLocked,
                        ]} numberOfLines={2}>
                          {unit.title}
                        </Text>
                        {unitProgress.total > 0 && (
                          <Text style={styles.unitProgress}>
                            {unitProgress.completed}/{unitProgress.total}
                          </Text>
                        )}
                      </View>
                    </Animated.View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4B4B4B',
  },
  profileButton: {
    marginLeft: 'auto',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: THEME_COLORS.primary,
  },
  profileImage: {
    width: 44,
    height: 44,
  },
  profilePlaceholder: {
    width: 44,
    height: 44,
    backgroundColor: '#E5E5E5',
    borderRadius: 22,
  },
  continentSelectorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 1000,
  },
  continentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  continentIcon: {
    fontSize: 24,
  },
  continentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4B4B4B',
  },
  continentMenu: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    zIndex: 1000,
  },
  continentMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  continentMenuItemActive: {
    backgroundColor: '#F0FFF4',
  },
  continentMenuIcon: {
    fontSize: 22,
  },
  continentMenuText: {
    flex: 1,
    fontSize: 15,
    color: '#4B4B4B',
  },
  continentMenuTextActive: {
    fontWeight: '600' as const,
    color: THEME_COLORS.success,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  pathContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pathSvgContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  nodesContainer: {
    width: PATH_WIDTH,
    alignItems: 'center',
  },
  nodeRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  nodeWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME_COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 6,
    borderBottomWidth: 6,
    borderBottomColor: THEME_COLORS.primaryDark,
  },
  nodeLocked: {
    backgroundColor: THEME_COLORS.locked,
    borderBottomColor: THEME_COLORS.lockedBorder,
    shadowColor: THEME_COLORS.lockedBorder,
  },
  nodeComplete: {
    backgroundColor: THEME_COLORS.success,
    borderBottomColor: THEME_COLORS.successDark,
    shadowColor: THEME_COLORS.successDark,
  },
  nodeCurrent: {
    backgroundColor: THEME_COLORS.primary,
    borderBottomColor: THEME_COLORS.primaryDark,
    shadowColor: THEME_COLORS.primaryDark,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderBottomWidth: 6,
  },
  nodeIcon: {
    fontSize: 30,
  },
  unitTitleContainer: {
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 120,
  },
  unitTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#4B4B4B',
    textAlign: 'center',
  },
  unitTitleLocked: {
    color: '#AFAFAF',
  },
  unitProgress: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
});
