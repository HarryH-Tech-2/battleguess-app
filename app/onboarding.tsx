import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { mascots } from '@/mocks/mascots';
import { Mascot } from '@/types';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useUserProgress();
  const { colors } = useSettings();
  const [selectedMascot, setSelectedMascot] = useState<Mascot | null>(null);

  const handleComplete = () => {
    if (selectedMascot) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeOnboarding(
        selectedMascot.id,
        10, // Default daily goal
        ['Random'], // Default interests
        'nothing' // Default knowledge level
      );
      router.replace('/home');
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeIcon}>⚔️</Text>
          <Text style={styles.title}>Welcome to BattleGuess</Text>
          <Text style={styles.subtitle}>Choose your guide to begin your journey</Text>
        </View>

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
          <ChevronRight size={20} color={colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
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
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  mascotCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  mascotImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  mascotImageContainerSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '30',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  mascotNameSelected: {
    color: colors.primary,
  },
  mascotDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    marginTop: 'auto',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.pathLine,
    shadowOpacity: 0,
    borderBottomColor: colors.textLight,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '700' as const,
  },
});
