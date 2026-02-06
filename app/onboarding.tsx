import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(mascots.map(() => new Animated.Value(0))).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Icon rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 150,
        useNativeDriver: true,
      }).start();
    });

    // Button animation
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 500,
      delay: 900,
      useNativeDriver: true,
    }).start();

    // Pulse animation for selected card
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  }, []);

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

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundDark || colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[styles.welcomeIcon, { transform: [{ rotate: iconRotation }] }]}
          >
            ⚔️
          </Animated.Text>
          <Text style={styles.title}>Welcome to BattleGuess</Text>
          <Text style={styles.subtitle}>Choose your legendary commander</Text>
        </Animated.View>

        <View style={styles.mascotGrid}>
          {mascots.map((mascot, index) => {
            const isSelected = selectedMascot?.id === mascot.id;
            return (
              <Animated.View
                key={mascot.id}
                style={[
                  {
                    opacity: cardAnims[index],
                    transform: [
                      {
                        translateY: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                      { scale: isSelected ? pulseAnim : 1 },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.mascotCard,
                    isSelected && styles.mascotCardSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setSelectedMascot(mascot);
                  }}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.mascotImageContainer,
                      isSelected && styles.mascotImageContainerSelected,
                    ]}
                  >
                    <Image
                      source={{ uri: mascot.avatar }}
                      style={styles.mascotImage}
                      contentFit="cover"
                    />
                  </View>
                  <Text
                    style={[
                      styles.mascotName,
                      isSelected && styles.mascotNameSelected,
                    ]}
                  >
                    {mascot.name}
                  </Text>
                  <Text style={styles.mascotDates}>{mascot.dates}</Text>
                  <Text style={styles.mascotDescription} numberOfLines={2}>
                    {mascot.description}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !selectedMascot && styles.primaryButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!selectedMascot}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
            <ChevronRight size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    headerSection: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 24,
    },
    welcomeIcon: {
      fontSize: 56,
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
      alignContent: 'flex-start',
    },
    mascotCard: {
      width: (width - 52) / 2,
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: colors.cardBorder,
      padding: 16,
      alignItems: 'center',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    mascotCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight + '15',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    selectedBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.card,
      zIndex: 10,
    },
    mascotImageContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: colors.cardBorder,
      overflow: 'hidden',
    },
    mascotImageContainerSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight + '30',
    },
    mascotImage: {
      width: '100%',
      height: '100%',
      borderRadius: 35,
    },
    mascotName: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 2,
      textAlign: 'center',
    },
    mascotNameSelected: {
      color: colors.primary,
    },
    mascotDates: {
      fontSize: 11,
      color: colors.textLight,
      marginBottom: 6,
      fontStyle: 'italic',
    },
    mascotDescription: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 15,
    },
    buttonContainer: {
      marginTop: 'auto',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      gap: 8,
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
