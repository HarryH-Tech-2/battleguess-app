import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Star, Flame, ArrowRight } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getLessonById } from '@/mocks/lessons';
import { getBattleById } from '@/mocks/battles';
import { mascots } from '@/mocks/mascots';
import Colors from '@/constants/colors';

export default function LessonCompleteScreen() {
  const { lessonId, correctAnswers, totalSteps, xpReward } = useLocalSearchParams<{
    lessonId: string;
    correctAnswers: string;
    totalSteps: string;
    xpReward: string;
  }>();
  
  const router = useRouter();
  const { completeLesson, progress } = useUserProgress();
  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  
  const lesson = getLessonById(lessonId || '');
  const battle = lesson ? getBattleById(lesson.battleId) : null;
  const correct = parseInt(correctAnswers || '0', 10);
  const total = parseInt(totalSteps || '1', 10);
  const xp = parseInt(xpReward || '0', 10);
  const isPerfect = correct === total;
  const bonusXp = isPerfect ? Math.round(xp * 0.5) : 0;
  const totalXp = xp + bonusXp;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (lesson) {
      completeLesson({
        lessonId: lesson.id,
        correctAnswers: correct,
        totalSteps: total,
        xpEarned: totalXp,
        isPerfect,
      });
    }

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    starsAnim.forEach((anim, index) => {
      setTimeout(() => {
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }).start();
      }, 300 + index * 150);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const starCount = isPerfect ? 3 : correct >= total * 0.7 ? 2 : 1;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/(home)/learn');
  };

  const getMapUrl = (lat: number, lng: number) => {
    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-l+FF6B35(${lng},${lat})/${lng},${lat},6,0/400x200@2x?access_token=REDACTED_MAPBOX_TOKEN`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View style={[styles.trophyContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.trophy}>
              {mascot ? (
                <Image
                  source={{ uri: mascot.avatar }}
                  style={styles.mascotCheerImage}
                  contentFit="cover"
                />
              ) : (
                <Text style={styles.cheerEmoji}>🎉</Text>
              )}
            </View>
          </Animated.View>

          <View style={styles.starsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.starWrapper,
                  {
                    opacity: starsAnim[index],
                    transform: [{ scale: starsAnim[index] }],
                  },
                ]}
              >
                <Star
                  size={40}
                  color={index < starCount ? Colors.xp : Colors.pathLine}
                  fill={index < starCount ? Colors.xp : 'transparent'}
                />
              </Animated.View>
            ))}
          </View>

          <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>
              {isPerfect ? 'Perfect!' : 'Lesson Complete!'}
            </Text>
            <Text style={styles.lessonTitle}>{lesson?.title}</Text>
          </Animated.View>

          {battle && (
            <Animated.View style={[styles.battleMapContainer, { opacity: fadeAnim }]}>
              <View style={styles.mapWrapper}>
                <Image
                  source={{ uri: getMapUrl(battle.lat, battle.lng) }}
                  style={styles.battleMap}
                  contentFit="cover"
                />
                <View style={styles.mapPinOverlay}>
                  <View style={styles.mapPin}>
                    <Text style={styles.mapPinIcon}>⚔️</Text>
                  </View>
                </View>
              </View>
              <View style={styles.battleInfoCard}>
                <Text style={styles.battleName}>{battle.title}</Text>
                <View style={styles.battleMeta}>
                  <Text style={styles.battleDate}>📅 {battle.date}</Text>
                  <Text style={styles.battleRegion}>📍 {battle.region}</Text>
                </View>
                <Text style={styles.battleSummary} numberOfLines={2}>
                  {battle.shortSummary}
                </Text>
              </View>
            </Animated.View>
          )}

          <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
            <View style={styles.statCard}>
              <Star size={24} color={Colors.xp} fill={Colors.xp} />
              <Text style={styles.statValue}>+{totalXp}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
              {bonusXp > 0 && (
                <Text style={styles.bonusText}>+{bonusXp} bonus!</Text>
              )}
            </View>

            <View style={styles.statCard}>
              <View style={styles.accuracyCircle}>
                <Text style={styles.accuracyText}>
                  {Math.round((correct / total) * 100)}%
                </Text>
              </View>
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text style={styles.statSubLabel}>{correct}/{total} correct</Text>
            </View>

            <View style={styles.statCard}>
              <Flame size={24} color={Colors.streak} />
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  trophyContainer: {
    marginBottom: 20,
  },
  trophy: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.secondary,
    overflow: 'hidden',
  },
  mascotCheerImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cheerEmoji: {
    fontSize: 64,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  starWrapper: {
    padding: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  battleMapContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  mapWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  battleMap: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 3,
    borderColor: Colors.textInverse,
  },
  mapPinIcon: {
    fontSize: 18,
  },
  battleInfoCard: {
    padding: 12,
  },
  battleName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  battleMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  battleDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  battleRegion: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  battleSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statSubLabel: {
    fontSize: 11,
    color: Colors.textLight,
  },
  bonusText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  accuracyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  footer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
});
