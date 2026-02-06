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
import { Flame, Heart, Star, User, Lock, Check, Swords, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { units } from '@/mocks/units';
import { getLessonsByUnitId } from '@/mocks/lessons';
import { mascots } from '@/mocks/mascots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 70;
const PARTICLE_COUNT = 12;

// Generate particle configurations
const generateParticles = () => {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    size: 3 + Math.random() * 5,
    duration: 2000 + Math.random() * 2000,
    delay: Math.random() * 2000,
  }));
};

const particles = generateParticles();

export default function HomeScreen() {
  const router = useRouter();
  const { progress, isLessonCompleted } = useUserProgress();
  const { colors } = useSettings();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bannerGlowAnim = useRef(new Animated.Value(0)).current;
  const swordRotateAnim = useRef(new Animated.Value(0)).current;
  const bannerScaleAnim = useRef(new Animated.Value(1)).current;

  // Particle animations
  const particleAnims = useRef(
    particles.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const styles = createStyles(colors);

  useEffect(() => {
    // Pulse animation for current node
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

    // Banner glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bannerGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bannerGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sword rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(swordRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(swordRotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animations - floating upward with fade
    particleAnims.forEach((anim, index) => {
      const particle = particles[index];
      const startParticleAnimation = () => {
        // Reset values
        anim.opacity.setValue(0);
        anim.translateY.setValue(0);
        anim.translateX.setValue(0);
        anim.scale.setValue(0);

        Animated.sequence([
          Animated.delay(particle.delay),
          Animated.parallel([
            // Fade in then out
            Animated.sequence([
              Animated.timing(anim.opacity, {
                toValue: 0.8,
                duration: particle.duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: particle.duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
            // Float upward
            Animated.timing(anim.translateY, {
              toValue: -60 - Math.random() * 40,
              duration: particle.duration,
              useNativeDriver: true,
            }),
            // Slight horizontal drift
            Animated.timing(anim.translateX, {
              toValue: (Math.random() - 0.5) * 30,
              duration: particle.duration,
              useNativeDriver: true,
            }),
            // Scale up then down
            Animated.sequence([
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: particle.duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.5,
                duration: particle.duration * 0.8,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => startParticleAnimation());
      };

      startParticleAnimation();
    });
  }, [pulseAnim, bannerGlowAnim, swordRotateAnim, particleAnims]);

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

  const handleBannerPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Animate banner press
    Animated.sequence([
      Animated.timing(bannerScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bannerScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    // Navigate to learn tab
    router.push('/(tabs)/(home)/learn');
  };

  const swordRotation = swordRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

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

      {/* Animated Hero Banner */}
      <Animated.View style={[styles.bannerContainer, { transform: [{ scale: bannerScaleAnim }] }]}>
        <TouchableOpacity onPress={handleBannerPress} activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark || '#1a1a2e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            {/* Animated glow overlay */}
            <Animated.View
              style={[
                styles.bannerGlow,
                {
                  opacity: bannerGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 0.3],
                  }),
                },
              ]}
            />

            {/* Floating particles */}
            {particles.map((particle, index) => (
              <Animated.View
                key={particle.id}
                style={[
                  styles.particle,
                  {
                    left: `${particle.startX}%`,
                    top: `${particle.startY}%`,
                    width: particle.size,
                    height: particle.size,
                    borderRadius: particle.size / 2,
                    opacity: particleAnims[index].opacity,
                    transform: [
                      { translateY: particleAnims[index].translateY },
                      { translateX: particleAnims[index].translateX },
                      { scale: particleAnims[index].scale },
                    ],
                  },
                ]}
              />
            ))}

            <View style={styles.bannerContent}>
              <View style={styles.bannerLeft}>
                <Animated.View style={[styles.swordIcon, { transform: [{ rotate: swordRotation }] }]}>
                  <Swords size={40} color="#FFD700" />
                </Animated.View>
              </View>
              <View style={styles.bannerCenter}>
                <Text style={styles.bannerTitle}>BattleGuess</Text>
                <Text style={styles.bannerSubtitle}>Master the Art of War</Text>
                <View style={styles.bannerCta}>
                  <Text style={styles.bannerCtaText}>Start Learning</Text>
                  <ChevronRight size={16} color="#FFD700" />
                </View>
              </View>
              <View style={styles.bannerRight}>
                <Text style={styles.bannerEmoji}>⚔️</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.path}>
          {units.slice(0, 6).map((unit, index) => {
            const unlocked = isUnitUnlocked(index);
            const unitProgress = getUnitProgress(unit.id);
            const isComplete = unitProgress.completed === unitProgress.total && unitProgress.total > 0;
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

                {index < 5 && (
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
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 140,
  },
  bannerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFD700',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  bannerLeft: {
    flex: 1,
  },
  swordIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  bannerCtaText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFD700',
    marginRight: 4,
  },
  bannerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bannerEmoji: {
    fontSize: 32,
  },
  scrollView: {
    flex: 1,
  },
  pathContainer: {
    paddingVertical: 24,
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
