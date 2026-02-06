import { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Flame, Heart, Star, Lock, Check, Globe, ChevronDown, X } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings, Continent } from '@/contexts/SettingsContext';
import { getUnitsByContinent } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 70;
const BRANCH_OFFSET = 80; // How far nodes branch left/right

const CONTINENTS: { id: Continent; name: string; icon: string }[] = [
  { id: 'all', name: 'All Regions', icon: '🌍' },
  { id: 'europe', name: 'Europe', icon: '🏰' },
  { id: 'asia', name: 'Asia', icon: '🏯' },
  { id: 'africa', name: 'Africa', icon: '🌴' },
  { id: 'americas', name: 'Americas', icon: '🗽' },
];

// Generate a branching pattern for nodes
const getBranchPosition = (index: number): 'left' | 'center' | 'right' => {
  const patterns = [
    ['center', 'left', 'right', 'center', 'right', 'left'],
    ['center', 'right', 'left', 'center', 'left', 'right'],
    ['left', 'center', 'right', 'left', 'center', 'right'],
  ];
  const patternIndex = Math.floor(index / 6) % patterns.length;
  const positionIndex = index % 6;
  return patterns[patternIndex][positionIndex] as 'left' | 'center' | 'right';
};

export default function LearnScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { settings, setContinent, colors } = useSettings();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showContinentModal, setShowContinentModal] = useState(false);

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const filteredUnits = getUnitsByContinent(settings.selectedContinent);
  const selectedContinentData = CONTINENTS.find(c => c.id === settings.selectedContinent);

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
    const prevUnit = filteredUnits[unitIndex - 1];
    if (!prevUnit) return true;
    const prevLessons = getLessonsByUnitId(prevUnit.id);
    const completedCount = prevLessons.filter(l => isLessonCompleted(l.id)).length;
    return completedCount >= Math.min(2, prevLessons.length);
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

  const handleContinentSelect = (continent: Continent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setContinent(continent);
    setShowContinentModal(false);
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

      <TouchableOpacity
        style={styles.continentSelector}
        onPress={() => setShowContinentModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.continentLeft}>
          <Globe size={20} color={colors.primary} />
          <Text style={styles.continentText}>
            {selectedContinentData?.icon} {selectedContinentData?.name}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredUnits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🗺️</Text>
            <Text style={styles.emptyStateTitle}>No battles yet</Text>
            <Text style={styles.emptyStateText}>
              Battles from this region are coming soon!
            </Text>
          </View>
        ) : (
          <View style={styles.path}>
            {filteredUnits.map((unit, index) => {
              const unlocked = isUnitUnlocked(index);
              const unitProgress = getUnitProgress(unit.id);
              const isComplete = unitProgress.completed === unitProgress.total && unitProgress.total > 0;
              const isCurrent = unlocked && !isComplete;
              const branchPosition = getBranchPosition(index);
              const horizontalOffset = getNodeHorizontalPosition(branchPosition);
              const prevPosition = index > 0 ? getBranchPosition(index - 1) : 'center';
              const prevOffset = getNodeHorizontalPosition(prevPosition);

              return (
                <View key={unit.id} style={styles.nodeContainer}>
                  {/* Branching path line */}
                  {index > 0 && (
                    <View style={styles.pathLineContainer}>
                      {/* Vertical line from previous node */}
                      <View
                        style={[
                          styles.pathLineVertical,
                          unlocked && styles.pathLineComplete,
                          { left: SCREEN_WIDTH / 2 - 2 + prevOffset },
                        ]}
                      />
                      {/* Diagonal/horizontal connector if positions differ */}
                      {prevOffset !== horizontalOffset && (
                        <View
                          style={[
                            styles.pathLineDiagonal,
                            unlocked && styles.pathLineComplete,
                            {
                              left: Math.min(SCREEN_WIDTH / 2 + prevOffset, SCREEN_WIDTH / 2 + horizontalOffset),
                              width: Math.abs(horizontalOffset - prevOffset) + 4,
                              top: 16,
                            },
                          ]}
                        />
                      )}
                      {/* Vertical line to current node */}
                      <View
                        style={[
                          styles.pathLineVertical,
                          unlocked && styles.pathLineComplete,
                          {
                            left: SCREEN_WIDTH / 2 - 2 + horizontalOffset,
                            top: 20,
                            height: 12,
                          },
                        ]}
                      />
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
        )}
      </ScrollView>

      <Modal
        visible={showContinentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContinentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Region</Text>
              <TouchableOpacity onPress={() => setShowContinentModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Choose which battles you want to learn about</Text>

            {CONTINENTS.map((continent) => (
              <TouchableOpacity
                key={continent.id}
                style={[
                  styles.continentOption,
                  settings.selectedContinent === continent.id && styles.continentOptionSelected,
                ]}
                onPress={() => handleContinentSelect(continent.id)}
              >
                <View style={styles.continentOptionLeft}>
                  <Text style={styles.continentOptionIcon}>{continent.icon}</Text>
                  <Text style={[
                    styles.continentOptionText,
                    settings.selectedContinent === continent.id && styles.continentOptionTextSelected,
                  ]}>
                    {continent.name}
                  </Text>
                </View>
                {settings.selectedContinent === continent.id && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  continentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  continentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  continentText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
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
    marginBottom: 24,
  },
  pathLineContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    height: 32,
  },
  pathLineVertical: {
    position: 'absolute',
    width: 4,
    height: 16,
    backgroundColor: colors.pathLine,
    borderRadius: 2,
  },
  pathLineDiagonal: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.pathLine,
    borderRadius: 2,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  continentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundDark,
    marginBottom: 10,
  },
  continentOptionSelected: {
    backgroundColor: colors.primary + '15',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  continentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  continentOptionIcon: {
    fontSize: 24,
  },
  continentOptionText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  continentOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
});
