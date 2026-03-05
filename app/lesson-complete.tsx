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

const battleImages: Record<string, any> = {
  'thermopylae': require('@/assets/images/battles/thermopylae.png'),
  'marathon': require('@/assets/images/battles/marathon.png'),
  'hastings': require('@/assets/images/battles/hastings.png'),
  'agincourt': require('@/assets/images/battles/agincourt.png'),
  'waterloo': require('@/assets/images/battles/waterloo.png'),
  'austerlitz': require('@/assets/images/battles/austerlitz.png'),
  'somme': require('@/assets/images/battles/somme.png'),
  'stalingrad': require('@/assets/images/battles/stalingrad.png'),
  'dday': require('@/assets/images/battles/dday.png'),
  'gettysburg': require('@/assets/images/battles/gettysburg.png'),
  'yorktown': require('@/assets/images/battles/yorktown.png'),
  'alamo': require('@/assets/images/battles/alamo.png'),
  'puebla': require('@/assets/images/battles/puebla.png'),
  'ayacucho': require('@/assets/images/battles/ayacucho.png'),
  'gaugamela': require('@/assets/images/battles/gaugamela.png'),
  'sekigahara': require('@/assets/images/battles/sekigahara.png'),
  'red-cliffs': require('@/assets/images/battles/red-cliffs.png'),
  'panipat-first': require('@/assets/images/battles/panipat-first.png'),
  'tsushima': require('@/assets/images/battles/tsushima.png'),
  'midway': require('@/assets/images/battles/midway.png'),
  'zama': require('@/assets/images/battles/zama.png'),
  'el-alamein': require('@/assets/images/battles/el-alamein.png'),
  'isandlwana': require('@/assets/images/battles/isandlwana.png'),
  'adwa': require('@/assets/images/battles/adwa.png'),
  'cannae': require('@/assets/images/battles/cannae.png'),
  'verdun': require('@/assets/images/battles/verdun.png'),
  'kursk': require('@/assets/images/battles/kursk.png'),
  'tours': require('@/assets/images/battles/tours.png'),
  'gallipoli': require('@/assets/images/battles/gallipoli.png'),
  'lepanto': require('@/assets/images/battles/lepanto.png'),
  'borodino': require('@/assets/images/battles/borodino.png'),
  'trafalgar': require('@/assets/images/battles/trafalgar.png'),
  'vienna-1683': require('@/assets/images/battles/vienna-1683.png'),
  'plassey': require('@/assets/images/battles/plassey.png'),
  'singapore': require('@/assets/images/battles/singapore.png'),
  'dien-bien-phu': require('@/assets/images/battles/dien-bien-phu.png'),
  'changping': require('@/assets/images/battles/changping.png'),
  'omdurman': require('@/assets/images/battles/omdurman.png'),
  'carthage-destruction': require('@/assets/images/battles/carthage-destruction.png'),
  'tobruk': require('@/assets/images/battles/tobruk.png'),
  'saratoga': require('@/assets/images/battles/saratoga.png'),
  'chacabuco': require('@/assets/images/battles/chacabuco.png'),
  'new-orleans': require('@/assets/images/battles/new-orleans.png'),
  'boyaca': require('@/assets/images/battles/boyaca.png'),
  'rorkes-drift': require('@/assets/images/battles/rorkes-drift.png'),
  'iwo-jima': require('@/assets/images/battles/iwo-jima.png'),
  'marne': require('@/assets/images/battles/marne.png'),
  'passchendaele': require('@/assets/images/battles/passchendaele.png'),
  'bulge': require('@/assets/images/battles/bulge.png'),
  'buena-vista': require('@/assets/images/battles/buena-vista.png'),
  'talas': require('@/assets/images/battles/talas.png'),
  'constantinople-1453': require('@/assets/images/battles/constantinople-1453.png'),
  'nagashino': require('@/assets/images/battles/nagashino.png'),
  'myeongnyang': require('@/assets/images/battles/myeongnyang.png'),
  'kohima': require('@/assets/images/battles/kohima.png'),
  'bach-dang': require('@/assets/images/battles/bach-dang.png'),
  'panipat-third': require('@/assets/images/battles/panipat-third.png'),
  'pyramids': require('@/assets/images/battles/pyramids.png'),
  'khartoum': require('@/assets/images/battles/khartoum.png'),
  'tangier': require('@/assets/images/battles/tangier.png'),
  'kairouan': require('@/assets/images/battles/kairouan.png'),
  'tenochtitlan': require('@/assets/images/battles/tenochtitlan.png'),
  'cajamarca': require('@/assets/images/battles/cajamarca.png'),
  'san-juan-hill': require('@/assets/images/battles/san-juan-hill.png'),
  'falklands': require('@/assets/images/battles/falklands.png'),
  'chapultepec': require('@/assets/images/battles/chapultepec.png'),
  'carabobo': require('@/assets/images/battles/carabobo.png'),
};

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

  const battleImage = battle ? battleImages[battle.id] || null : null;

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
              {battleImage && (
                <Image
                  source={battleImage}
                  style={styles.battleMap}
                  contentFit="cover"
                />
              )}
              <View style={styles.battleInfoCard}>
                <Text style={styles.battleName}>{battle.title}</Text>
                <View style={styles.battleMeta}>
                  <Text style={styles.battleDate}>📅 {battle.date}</Text>
                  <Text style={styles.battleRegion}>📍 {battle.region}</Text>
                </View>
                <Text style={styles.battleSummary}>
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
  battleMap: {
    width: '100%',
    height: 160,
  },
  battleInfoCard: {
    padding: 14,
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
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
