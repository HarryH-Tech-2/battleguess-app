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
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { mascots as rawMascots } from '@/mocks/mascots';
import { getCivImage } from '@/mocks/civImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 72;
const BRANCH_NODE_SIZE = 56;
const PATH_WIDTH = SCREEN_WIDTH - 40;
const CENTER_X = PATH_WIDTH / 2;
const HORIZONTAL_OFFSET = 80;
const VERTICAL_SPACING = 120;
// Sub-battle (branch) layout — fan out below the trunk
const SUB_HORIZONTAL = 100; // left/right offset of sub-battle center from trunk center
const SUB_VERTICAL_FROM_TRUNK = 130; // vertical distance from trunk center to first sub-battle row center
const SUB_ROW_SPACING = 80; // vertical distance between sub-battle rows when there are 3+ subs
const SUB_TO_NEXT_TRUNK = 110; // vertical distance from last sub-battle row center to next trunk center

// Orange color palette (Duolingo-inspired but warmer)
const THEME_COLORS = {
  primary: '#FF9500',
  primaryDark: '#E68600',
  success: '#58CC02',
  successDark: '#4CAF00',
  locked: '#D9CFB8',
  lockedBorder: '#9C8E6E',
  current: '#FFC800',
  pathLine: '#D9CFB8',
  pathLineComplete: '#58CC02',
};

// Parchment palette — warm cream tones for an "old map" feel on the Learn screen
const PARCHMENT = {
  base: '#FBF5E5',     // warm cream base
  baseSoft: '#F6EDD3', // a touch deeper for gradient bottom
  baseEdge: '#EFE2BD', // slight vignette tint at extreme edges
  ink: '#5C4A2B',      // dark ink-brown for text on parchment
  inkSoft: '#8A7656',  // muted ink for secondary text
  divider: '#E8DBB8',
};

// Continent data with icons and colors
const CONTINENT_DATA = [
  { id: 'all', key: 'learn.allContinents', icon: '🌍', color: '#FF9500' },
  { id: 'europe', key: 'learn.europe', icon: '🏰', color: '#3B82F6' },
  { id: 'asia', key: 'learn.asia', icon: '🏯', color: '#EF4444' },
  { id: 'africa', key: 'learn.africa', icon: '🌴', color: '#F59E0B' },
  { id: 'americas', key: 'learn.americas', icon: '🗽', color: '#10B981' },
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
  const { t } = useTranslation();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors, fontScale } = useSettings();
  const { getUnitsByContinent, getLessonsByUnitId, mascots: translatedMascots } = useContent();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [showContinentMenu, setShowContinentMenu] = useState(false);

  const mascot = rawMascots.find(m => m.id === progress.selectedMascotId);
  const continents = CONTINENT_DATA.map(c => ({ ...c, name: t(c.key) }));
  const selectedContinentData = continents.find(c => c.id === selectedContinent) || continents[0];

  // Get units for selected continent
  const filteredUnits = useMemo(() => {
    const continentUnits = getUnitsByContinent(selectedContinent);
    return continentUnits.sort((a, b) => a.orderIndex - b.orderIndex);
  }, [selectedContinent, getUnitsByContinent]);

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
    // Only the previous unit's MAIN BATTLE (trunk lesson) needs to be completed
    // to unlock the next stage. Sub-battles are optional.
    const prevUnit = filteredUnits[unitIndex - 1];
    const prevLessons = getLessonsByUnitId(prevUnit.id);
    const prevTrunkLesson = prevLessons[0];
    return prevTrunkLesson ? isLessonCompleted(prevTrunkLesson.id) : true;
  }, [isLessonCompleted, filteredUnits, getLessonsByUnitId]);

  const getNextLesson = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    return unitLessons.find(l => !isLessonCompleted(l.id)) || unitLessons[0];
  }, [isLessonCompleted, getLessonsByUnitId]);

  const getUnitProgress = useCallback((unitId: string) => {
    const unitLessons = getLessonsByUnitId(unitId);
    const completed = unitLessons.filter(l => isLessonCompleted(l.id)).length;
    return { completed, total: unitLessons.length };
  }, [isLessonCompleted, getLessonsByUnitId]);

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

  const handleBranchPress = (lessonId: string, unlocked: boolean) => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/lesson/${lessonId}`);
  };

  // Only show branching layout when viewing all continents
  const showBranches = selectedContinent === 'all';

  const handleContinentSelect = (continentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContinent(continentId);
    setShowContinentMenu(false);
  };

  const styles = createStyles(colors, fontScale);

  // Number of branch lessons (sub-battles) for a given unit
  const getBranchCount = useCallback((unitId: string) => {
    if (!showBranches) return 0;
    return Math.max(0, getLessonsByUnitId(unitId).length - 1);
  }, [showBranches, getLessonsByUnitId]);

  // For sub-battle index i: which row (0-based) and which side (-1=left, +1=right).
  // The first sub-battle alternates side based on unitIndex (even→left, odd→right)
  // so units with only one sub-battle don't all land on the same side.
  const getSubInfo = (subIdx: number, unitIndex: number) => {
    const baseSide: 1 | -1 = unitIndex % 2 === 0 ? -1 : 1;
    const side = (subIdx % 2 === 0 ? baseSide : -baseSide) as 1 | -1;
    return {
      row: Math.floor(subIdx / 2),
      side,
    };
  };

  // Number of sub-battle rows (each row holds left + right)
  const getNumSubRows = (branchCount: number) =>
    branchCount === 0 ? 0 : Math.ceil(branchCount / 2);

  // When sub-battles are shown for a unit, the trunk is centered so subs fit on both sides.
  // Without sub-battles, trunks use the original winding pattern.
  const getTrunkX = useCallback((index: number) => {
    if (showBranches) return CENTER_X;
    return CENTER_X + getHorizontalOffset(getNodePosition(index));
  }, [showBranches]);

  // Per-unit vertical layout: trunk-center Y, and total path height
  // Y=56 matches the actual rendered trunk-center: pathContainer paddingTop(20) +
  // nodeRow paddingTop(20) + NODE_SIZE/2(36) - svgContainer top(20) = 56
  const { unitYs, totalPathHeight } = useMemo(() => {
    const ys: number[] = [];
    let y = 56;
    filteredUnits.forEach((unit) => {
      ys.push(y);
      const branchCount = getBranchCount(unit.id);
      const numRows = getNumSubRows(branchCount);
      const delta = numRows > 0
        ? SUB_VERTICAL_FROM_TRUNK + (numRows - 1) * SUB_ROW_SPACING + SUB_TO_NEXT_TRUNK
        : VERTICAL_SPACING;
      y += delta;
    });
    return { unitYs: ys, totalPathHeight: y };
  }, [filteredUnits, getBranchCount]);

  // Main spine: connects trunk nodes only. Sub-battle connectors are drawn separately.
  const generatePath = () => {
    if (filteredUnits.length === 0) return '';

    let pathD = '';
    filteredUnits.forEach((_, index) => {
      const x = getTrunkX(index);
      const trunkY = unitYs[index];
      const trunkTop = trunkY - NODE_SIZE / 2;
      const trunkBottom = trunkY + NODE_SIZE / 2;

      if (index === 0) {
        pathD += `M ${x} ${trunkY} L ${x} ${trunkBottom}`;
      } else {
        const prevX = getTrunkX(index - 1);
        const prevTrunkBottom = unitYs[index - 1] + NODE_SIZE / 2;
        const midY = (prevTrunkBottom + trunkTop) / 2;
        pathD += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${trunkTop} L ${x} ${trunkBottom}`;
      }
    });

    return pathD;
  };

  // Short curves from each trunk down-and-out to its sub-battles
  const generateBranchPaths = () => {
    if (!showBranches || filteredUnits.length === 0) return [];

    const segments: string[] = [];
    filteredUnits.forEach((unit, index) => {
      const branchCount = getBranchCount(unit.id);
      if (branchCount === 0) return;

      const trunkX = getTrunkX(index);
      const trunkY = unitYs[index];

      for (let i = 0; i < branchCount; i++) {
        const { row, side } = getSubInfo(i, index);
        const subCenterX = trunkX + side * SUB_HORIZONTAL;
        const subCenterY = trunkY + SUB_VERTICAL_FROM_TRUNK + row * SUB_ROW_SPACING;
        // Place endpoints exactly on each circle's edge along the line connecting their centers,
        // so the connector touches both circles with no whitespace gap.
        const dx = subCenterX - trunkX;
        const dy = subCenterY - trunkY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist;
        const uy = dy / dist;
        const startX = trunkX + (NODE_SIZE / 2) * ux;
        const startY = trunkY + (NODE_SIZE / 2) * uy;
        const endX = subCenterX - (BRANCH_NODE_SIZE / 2) * ux;
        const endY = subCenterY - (BRANCH_NODE_SIZE / 2) * uy;
        const midY = (startY + endY) / 2;
        segments.push(
          `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
        );
      }
    });
    return segments;
  };

  const pathD = generatePath();
  const branchPaths = generateBranchPaths();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Parchment background — warm cream gradient gives an aged-paper feel */}
      <LinearGradient
        colors={[PARCHMENT.base, PARCHMENT.baseSoft, PARCHMENT.baseEdge]}
        locations={[0, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
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
            color={PARCHMENT.ink}
            style={{ transform: [{ rotate: showContinentMenu ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {showContinentMenu && (
          <View style={styles.continentMenu}>
            {continents.map((continent) => (
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
          { minHeight: totalPathHeight + 200 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredUnits.length === 0 ? (
          <View style={styles.emptyState}>
            <Globe size={48} color={THEME_COLORS.locked} />
            <Text style={styles.emptyStateText}>{t('learn.noBattles')}</Text>
          </View>
        ) : (
          <>
            {/* SVG Path background */}
            <View style={styles.pathSvgContainer}>
              <Svg width={PATH_WIDTH} height={totalPathHeight + 100}>
                {/* Main spine connecting trunks */}
                <Path
                  d={pathD}
                  stroke={THEME_COLORS.pathLine}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Sub-battle connectors (fan out from trunk) */}
                {branchPaths.map((d, i) => (
                  <Path
                    key={`branch-${i}`}
                    d={d}
                    stroke={THEME_COLORS.pathLine}
                    strokeWidth={5}
                    fill="none"
                    strokeLinecap="round"
                  />
                ))}
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

                const lessons = getLessonsByUnitId(unit.id);
                const trunkLesson = lessons[0];
                const branchLessons = showBranches ? lessons.slice(1) : [];
                const trunkComplete = trunkLesson ? isLessonCompleted(trunkLesson.id) : false;
                const numSubRows = getNumSubRows(branchLessons.length);
                const rowHeight = numSubRows > 0
                  ? SUB_VERTICAL_FROM_TRUNK + (numSubRows - 1) * SUB_ROW_SPACING + SUB_TO_NEXT_TRUNK
                  : VERTICAL_SPACING;
                // When sub-battles are present, trunk is centered. Otherwise use winding pattern.
                const trunkTranslateX = showBranches ? 0 : horizontalOffset;

                return (
                  <View
                    key={unit.id}
                    style={[
                      styles.nodeRow,
                      { height: rowHeight }
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.nodeWrapper,
                        {
                          transform: [
                            { translateX: trunkTranslateX },
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
                          <>
                            {getCivImage(unit.id) && (
                              <Image
                                source={getCivImage(unit.id)}
                                style={styles.civImageLocked}
                                contentFit="cover"
                              />
                            )}
                            <View style={styles.lockOverlay}>
                              <Lock size={26} color="#FFFFFF" />
                            </View>
                          </>
                        ) : isComplete ? (
                          <Check size={32} color="#FFFFFF" strokeWidth={3} />
                        ) : getCivImage(unit.id) ? (
                          <Image
                            source={getCivImage(unit.id)}
                            style={styles.civImage}
                            contentFit="cover"
                          />
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
                      </View>
                    </Animated.View>

                    {/* Sub-battles fan out left/right below the trunk (only on "All Continents") */}
                    {branchLessons.map((lesson, branchIdx) => {
                      const branchUnlocked = unlocked && trunkComplete;
                      const branchComplete = isLessonCompleted(lesson.id);
                      const { row: subRow, side: subSide } = getSubInfo(branchIdx, index);
                      // Trunk node center sits at row Y = 20 (paddingTop) + NODE_SIZE/2 = 56.
                      // Sub row N center: 56 + SUB_VERTICAL_FROM_TRUNK + N * SUB_ROW_SPACING.
                      const branchTopInRow =
                        20 + NODE_SIZE / 2 + SUB_VERTICAL_FROM_TRUNK - BRANCH_NODE_SIZE / 2 +
                        subRow * SUB_ROW_SPACING;
                      // Trunk centered when subs are shown, so subSide * SUB_HORIZONTAL is absolute offset from CENTER_X
                      const subMarginLeft = subSide * SUB_HORIZONTAL - BRANCH_NODE_SIZE / 2;
                      return (
                        <View
                          key={lesson.id}
                          style={[
                            styles.branchNodeWrapper,
                            {
                              left: '50%',
                              marginLeft: subMarginLeft,
                              top: branchTopInRow,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            style={[
                              styles.branchNode,
                              !branchUnlocked && styles.nodeLocked,
                              branchComplete && styles.nodeComplete,
                            ]}
                            onPress={() => handleBranchPress(lesson.id, branchUnlocked)}
                            activeOpacity={0.7}
                          >
                            {!branchUnlocked ? (
                              <Lock size={20} color={THEME_COLORS.lockedBorder} />
                            ) : branchComplete ? (
                              <Check size={24} color="#FFFFFF" strokeWidth={3} />
                            ) : (
                              <Text style={styles.branchNodeIcon}>{unit.icon}</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
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

const createStyles = (colors: any, fs: number = 1) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PARCHMENT.base,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: PARCHMENT.divider,
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
    fontSize: 18 * fs,
    fontWeight: '700' as const,
    color: PARCHMENT.ink,
  },
  profileButton: {
    marginLeft: 'auto',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'transparent',
    zIndex: 1000,
    elevation: 1000,
  },
  continentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: PARCHMENT.divider,
  },
  continentIcon: {
    fontSize: 24,
  },
  continentName: {
    flex: 1,
    fontSize: 16 * fs,
    fontWeight: '600' as const,
    color: PARCHMENT.ink,
  },
  continentMenu: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: PARCHMENT.base,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: PARCHMENT.divider,
    zIndex: 1000,
  },
  continentMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: PARCHMENT.divider,
  },
  continentMenuItemActive: {
    backgroundColor: 'rgba(88, 204, 2, 0.12)',
  },
  continentMenuIcon: {
    fontSize: 22,
  },
  continentMenuText: {
    flex: 1,
    fontSize: 15 * fs,
    color: PARCHMENT.ink,
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
    overflow: 'hidden',
  },
  civImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: NODE_SIZE,
    height: NODE_SIZE,
  },
  civImageLocked: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: NODE_SIZE,
    height: NODE_SIZE,
    opacity: 0.55,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(80, 80, 80, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeLocked: {
    backgroundColor: THEME_COLORS.locked,
  },
  nodeComplete: {
    backgroundColor: THEME_COLORS.success,
  },
  nodeCurrent: {
    backgroundColor: THEME_COLORS.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nodeIcon: {
    fontSize: 30,
  },
  branchNodeWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  branchNode: {
    width: BRANCH_NODE_SIZE,
    height: BRANCH_NODE_SIZE,
    borderRadius: BRANCH_NODE_SIZE / 2,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME_COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 4,
    borderBottomWidth: 4,
    borderBottomColor: THEME_COLORS.primaryDark,
  },
  branchNodeIcon: {
    fontSize: 22,
  },
  unitTitleContainer: {
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 120,
  },
  unitTitle: {
    fontSize: 13 * fs,
    fontWeight: '600' as const,
    color: PARCHMENT.ink,
    textAlign: 'center',
  },
  unitTitleLocked: {
    color: PARCHMENT.inkSoft,
  },
  unitProgress: {
    fontSize: 11 * fs,
    color: PARCHMENT.inkSoft,
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
    fontSize: 16 * fs,
    color: PARCHMENT.inkSoft,
    textAlign: 'center',
  },
});
