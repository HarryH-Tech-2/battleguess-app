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
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { mascots } from '@/mocks/mascots';
import { Mascot } from '@/types';

const { width } = Dimensions.get('window');

export default function ChooseGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { progress, updateProgress } = useUserProgress();
  const { colors } = useSettings();
  const { mascots: translatedMascots } = useContent();
  const [selectedMascot, setSelectedMascot] = useState<Mascot | null>(
    mascots.find(m => m.id === progress.selectedMascotId) || null
  );

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(mascots.map(() => new Animated.Value(0))).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 100,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 400,
      delay: 700,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
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

  const handleSelect = () => {
    if (selectedMascot) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateProgress({ selectedMascotId: selectedMascot.id });
      router.back();
    }
  };

  const hasChanged = selectedMascot?.id !== progress.selectedMascotId;

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
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
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>{t('chooseGuide.title')}</Text>
          <Text style={styles.subtitle}>{t('chooseGuide.subtitle')}</Text>
        </Animated.View>

        <View style={styles.mascotGrid}>
          {translatedMascots.map((mascot, index) => {
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
                          outputRange: [40, 0],
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
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !hasChanged && styles.primaryButtonDisabled,
            ]}
            onPress={handleSelect}
            disabled={!hasChanged}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {hasChanged ? t('chooseGuide.saveGuide') : t('chooseGuide.currentGuide')}
            </Text>
            {hasChanged && <ChevronRight size={20} color={colors.textInverse} />}
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
      marginBottom: 24,
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
      borderWidth: 2,
      borderColor: colors.secondary,
      padding: 16,
      alignItems: 'center',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    mascotCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      shadowColor: colors.primary,
      shadowOpacity: 0.25,
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
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: colors.secondary,
      overflow: 'hidden',
    },
    mascotImageContainerSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight + '30',
    },
    mascotImage: {
      width: '100%',
      height: '100%',
      borderRadius: 36,
    },
    mascotName: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    mascotNameSelected: {
      color: colors.primary,
    },
    mascotDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
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
