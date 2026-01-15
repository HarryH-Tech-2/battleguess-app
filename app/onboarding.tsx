import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight, ChevronLeft, Target, Clock, Sparkles } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { mascots } from '@/mocks/mascots';
import { Interest, DailyGoal, KnowledgeLevel, Mascot } from '@/types';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'interests' | 'goal' | 'knowledge' | 'mascot';

const interests: { id: Interest; label: string; icon: string }[] = [
  { id: 'Ancient', label: 'Ancient', icon: '🏛️' },
  { id: 'Medieval', label: 'Medieval', icon: '⚔️' },
  { id: 'Modern', label: 'Modern', icon: '🎖️' },
  { id: 'Random', label: 'Surprise Me', icon: '🎲' },
];

const goals: { value: DailyGoal; label: string; description: string }[] = [
  { value: 5, label: 'Casual', description: '5 min/day' },
  { value: 10, label: 'Regular', description: '10 min/day' },
  { value: 15, label: 'Serious', description: '15 min/day' },
];

const knowledgeLevels: { id: KnowledgeLevel; label: string; description: string }[] = [
  { id: 'nothing', label: 'Beginner', description: 'I know very little about military history' },
  { id: 'some', label: 'Intermediate', description: 'I know some famous battles' },
  { id: 'lots', label: 'Expert', description: 'I know a lot about military history' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useUserProgress();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<DailyGoal>(10);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeLevel>('nothing');
  const [selectedMascot, setSelectedMascot] = useState<Mascot | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (nextStep: OnboardingStep) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setStep(nextStep), 150);
  };

  const toggleInterest = (interest: Interest) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleComplete = () => {
    if (selectedMascot) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeOnboarding(
        selectedMascot.id,
        selectedGoal,
        selectedInterests.length ? selectedInterests : ['Random'],
        selectedKnowledge
      );
      router.replace('/home');
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.welcomeIcon}>⚔️</Text>
      </View>
      <Text style={styles.title}>Welcome to BattleGuess</Text>
      <Text style={styles.subtitle}>
        Learn history through the battles that shaped our world
      </Text>
      <View style={styles.features}>
        <View style={styles.feature}>
          <Target size={24} color={Colors.secondary} />
          <Text style={styles.featureText}>Short, interactive lessons</Text>
        </View>
        <View style={styles.feature}>
          <Clock size={24} color={Colors.secondary} />
          <Text style={styles.featureText}>Just minutes a day</Text>
        </View>
        <View style={styles.feature}>
          <Sparkles size={24} color={Colors.secondary} />
          <Text style={styles.featureText}>Track your progress</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => animateTransition('interests')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
        <ChevronRight size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepSubtitle}>Pick one or more eras to explore</Text>
      <View style={styles.optionsGrid}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestCard,
              selectedInterests.includes(interest.id) && styles.interestCardSelected,
            ]}
            onPress={() => toggleInterest(interest.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.interestIcon}>{interest.icon}</Text>
            <Text
              style={[
                styles.interestLabel,
                selectedInterests.includes(interest.id) && styles.interestLabelSelected,
              ]}
            >
              {interest.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => animateTransition('goal')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
        <ChevronRight size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderGoal = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set your daily goal</Text>
      <Text style={styles.stepSubtitle}>How much time can you dedicate?</Text>
      <View style={styles.goalOptions}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.value}
            style={[
              styles.goalCard,
              selectedGoal === goal.value && styles.goalCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedGoal(goal.value);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.goalLabel,
                selectedGoal === goal.value && styles.goalLabelSelected,
              ]}
            >
              {goal.label}
            </Text>
            <Text
              style={[
                styles.goalDescription,
                selectedGoal === goal.value && styles.goalDescriptionSelected,
              ]}
            >
              {goal.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => animateTransition('knowledge')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
        <ChevronRight size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderKnowledge = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your experience level?</Text>
      <Text style={styles.stepSubtitle}>We will tailor lessons to you</Text>
      <View style={styles.knowledgeOptions}>
        {knowledgeLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.knowledgeCard,
              selectedKnowledge === level.id && styles.knowledgeCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedKnowledge(level.id);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.knowledgeLabel,
                selectedKnowledge === level.id && styles.knowledgeLabelSelected,
              ]}
            >
              {level.label}
            </Text>
            <Text
              style={[
                styles.knowledgeDescription,
                selectedKnowledge === level.id && styles.knowledgeDescriptionSelected,
              ]}
            >
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => animateTransition('mascot')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
        <ChevronRight size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderMascot = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your guide</Text>
      <Text style={styles.stepSubtitle}>They will accompany you on your journey</Text>
      <View style={styles.mascotGrid}>
        {mascots.map((mascot) => (
          <TouchableOpacity
            key={mascot.id}
            style={[
              styles.mascotCard,
              selectedMascot?.id === mascot.id && styles.mascotCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setSelectedMascot(mascot);
            }}
            activeOpacity={0.7}
          >
            <View style={[
              styles.mascotImageContainer,
              selectedMascot?.id === mascot.id && styles.mascotImageContainerSelected,
            ]}>
              <Image
                source={{ uri: mascot.avatar }}
                style={styles.mascotImage}
                contentFit="cover"
              />
            </View>
            <Text
              style={[
                styles.mascotName,
                selectedMascot?.id === mascot.id && styles.mascotNameSelected,
              ]}
            >
              {mascot.name}
            </Text>
            <Text style={styles.mascotDescription}>
              {mascot.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          !selectedMascot && styles.primaryButtonDisabled,
        ]}
        onPress={handleComplete}
        disabled={!selectedMascot}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Start Learning</Text>
        <ChevronRight size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return renderWelcome();
      case 'interests':
        return renderInterests();
      case 'goal':
        return renderGoal();
      case 'knowledge':
        return renderKnowledge();
      case 'mascot':
        return renderMascot();
    }
  };

  const stepIndex = ['welcome', 'interests', 'goal', 'knowledge', 'mascot'].indexOf(step);

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const steps: OnboardingStep[] = ['welcome', 'interests', 'goal', 'knowledge', 'mascot'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      animateTransition(steps[currentIndex - 1]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        {step !== 'welcome' ? (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <View style={styles.progressContainer}>
        {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= stepIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.backButtonPlaceholder} />
      </View>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderStep()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pathLine,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  welcomeIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  features: {
    gap: 16,
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    flex: 1,
  },
  interestCard: {
    width: (width - 72) / 2,
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  interestCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  interestIcon: {
    fontSize: 40,
  },
  interestLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  interestLabelSelected: {
    color: Colors.primary,
  },
  goalOptions: {
    gap: 12,
    flex: 1,
  },
  goalCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  goalLabelSelected: {
    color: Colors.primary,
  },
  goalDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  goalDescriptionSelected: {
    color: Colors.primary,
  },
  knowledgeOptions: {
    gap: 12,
    flex: 1,
  },
  knowledgeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    padding: 20,
  },
  knowledgeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  knowledgeLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  knowledgeLabelSelected: {
    color: Colors.primary,
  },
  knowledgeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  knowledgeDescriptionSelected: {
    color: Colors.primaryLight,
  },
  mascotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    flex: 1,
  },
  mascotCard: {
    width: (width - 72) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  mascotCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  mascotImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  mascotImageContainerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '30',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  mascotNameSelected: {
    color: Colors.primary,
  },
  mascotDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    marginTop: 'auto',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.pathLine,
    shadowOpacity: 0,
    borderBottomColor: '#A8A29E',
  },
  primaryButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '700' as const,
  },
});
