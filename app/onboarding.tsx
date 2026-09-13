import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Map, Heart, Target, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { artImages, getMascotImage } from '@/mocks/images';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts, radius, palette } from '@/constants/theme';
import { tap, success } from '@/utils/haptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const { completeOnboarding } = useUserProgress();
  const { fontScale, haptics, reducedMotion } = useSettings();
  const { mascots } = useContent();
  const [page, setPage] = useState<0 | 1>(0);
  const [selected, setSelected] = useState<string | null>(null);

  const fade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const rise = useRef(new Animated.Value(reducedMotion ? 0 : 40)).current;

  useEffect(() => {
    if (reducedMotion) return;
    fade.setValue(0);
    rise.setValue(40);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, useNativeDriver: true, speed: 8, bounciness: 4 }),
    ]).start();
  }, [page, fade, rise, reducedMotion]);

  const finish = () => {
    if (!selected) return;
    if (haptics) success();
    completeOnboarding(selected, 10, [], 'nothing');
    router.replace('/(tabs)/(home)/learn');
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.ink }]}>
      <Image source={artImages.onboardingHero} style={[StyleSheet.absoluteFill, { height: height * (page === 0 ? 0.72 : 0.42) }]} contentFit="cover" contentPosition="top" transition={400} />
      <LinearGradient
        colors={['rgba(15,20,32,0)', 'rgba(15,20,32,0.2)', palette.ink]}
        locations={[0, page === 0 ? 0.45 : 0.15, page === 0 ? 0.72 : 0.42]}
        style={StyleSheet.absoluteFill}
      />

      {page === 0 ? (
        <Animated.View style={[styles.page, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20), opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={{ flex: 1 }} />
          <Text style={[styles.brand, { fontSize: 40 * fontScale }]}>{t('app.name')}</Text>
          <Text style={[styles.tagline, { fontSize: 17 * fontScale }]}>{t('onboarding.tagline')}</Text>
          <View style={styles.features}>
            <Feature icon={<Map size={20} color={palette.brassLight} />} title={t('onboarding.features.pathTitle')} body={t('onboarding.features.pathBody')} />
            <Feature icon={<Heart size={20} color={palette.crimson} fill={palette.crimson} />} title={t('onboarding.features.heartsTitle')} body={t('onboarding.features.heartsBody')} />
            <Feature icon={<Target size={20} color={palette.laurel} />} title={t('onboarding.features.questsTitle')} body={t('onboarding.features.questsBody')} />
          </View>
          <ChunkyButton
            label={t('onboarding.startCampaign')}
            variant="ember"
            onPress={() => {
              if (haptics) tap();
              setPage(1);
            }}
          />
        </Animated.View>
      ) : (
        <Animated.View style={[styles.page, { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 20), opacity: fade, transform: [{ translateY: rise }] }]}>
          <Text style={[styles.h1, { fontSize: 28 * fontScale }]}>{t('onboarding.chooseCommander')}</Text>
          <Text style={[styles.sub, { fontSize: 14 * fontScale }]}>{t('onboarding.chooseCommanderSub')}</Text>
          <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 16 }}>
            {mascots.map((m) => {
              const active = selected === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    if (haptics) tap();
                    setSelected(m.id);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={m.name}
                  style={[styles.mascotCard, { borderColor: active ? palette.brass : palette.ink3, backgroundColor: active ? 'rgba(217,164,65,0.12)' : palette.ink2 }]}
                >
                  <View style={[styles.portrait, { borderColor: active ? palette.brass : palette.ink4 }]}>
                    <Image source={getMascotImage(m.id)} style={StyleSheet.absoluteFill} contentFit="cover" />
                    {active ? (
                      <View style={[styles.checkBadge, { backgroundColor: palette.brass }]}>
                        <Check size={14} color="#2B2419" strokeWidth={3.5} />
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.mascotName, { fontSize: 15 * fontScale }]} numberOfLines={2}>{m.name}</Text>
                  <Text style={[styles.mascotDates, { fontSize: 11 * fontScale }]}>{m.dates}</Text>
                  <Text style={[styles.mascotDesc, { fontSize: 12 * fontScale }]} numberOfLines={3}>{m.description}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <ChunkyButton label={t('onboarding.beginJourney')} variant="ember" disabled={!selected} onPress={finish} style={{ marginTop: 12 }} />
        </Animated.View>
      )}
    </View>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  const { fontScale } = useSettings();
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { fontSize: 15 * fontScale }]}>{title}</Text>
        <Text style={[styles.featureBody, { fontSize: 13 * fontScale }]}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { flex: 1, paddingHorizontal: 24 },
  brand: { fontFamily: fonts.displayBlack, color: palette.parchment, letterSpacing: 1.5, textAlign: 'center' },
  tagline: { fontFamily: fonts.bodySemi, color: 'rgba(244,232,207,0.85)', textAlign: 'center', marginTop: 8, lineHeight: 24 },
  features: { gap: 14, marginVertical: 28 },
  feature: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  featureIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(26,34,51,0.9)', borderWidth: 1, borderColor: palette.ink3, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontFamily: fonts.bodyBlack, color: palette.parchment },
  featureBody: { fontFamily: fonts.bodySemi, color: palette.steel, marginTop: 2 },
  h1: { fontFamily: fonts.display, color: palette.parchment, textAlign: 'center' },
  sub: { fontFamily: fonts.bodySemi, color: palette.steel, textAlign: 'center', marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 8 },
  mascotCard: { width: '47%', flexGrow: 1, borderRadius: radius.lg, borderWidth: 2, padding: 12, alignItems: 'center', gap: 4 },
  portrait: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, overflow: 'hidden', marginBottom: 6, backgroundColor: palette.ink3 },
  checkBadge: { position: 'absolute', right: 2, bottom: 2, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mascotName: { fontFamily: fonts.bodyBlack, color: palette.parchment, textAlign: 'center' },
  mascotDates: { fontFamily: fonts.bodyBold, color: palette.brassLight, letterSpacing: 0.5 },
  mascotDesc: { fontFamily: fonts.bodySemi, color: palette.steel, textAlign: 'center', lineHeight: 16 },
});
