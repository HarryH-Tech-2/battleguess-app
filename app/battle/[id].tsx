import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, MapPin, Calendar, Swords } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts, radius } from '@/constants/theme';
import { tap } from '@/utils/haptics';

export default function BattleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { progress } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { getBattleById, lessons } = useContent();

  const battle = getBattleById(id || '');
  const unlocked = battle ? progress.studiedBattles.includes(battle.id) : false;
  const lesson = battle ? lessons.find((l) => l.battleId === battle.id) : undefined;

  if (!battle) return <ScreenBackground />;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.brass, fontSize: 12 * fontScale }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScreenBackground topography={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={getBattleImage(battle.id)} style={[StyleSheet.absoluteFill, { opacity: unlocked ? 1 : 0.3 }]} contentFit="cover" />
          <LinearGradient colors={['rgba(15,20,32,0.35)', 'rgba(15,20,32,0)', colors.bg]} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
          <Pressable
            onPress={() => {
              if (haptics) tap();
              router.back();
            }}
            style={[styles.back, { top: insets.top + 8, backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>
          <View style={styles.heroBody}>
            {!unlocked ? (
              <View style={[styles.lockedChip, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
                <Lock size={12} color={colors.textSecondary} />
                <Text style={[styles.lockedText, { color: colors.textSecondary }]}>{t('codex.locked')}</Text>
              </View>
            ) : null}
            <Text style={[styles.era, { color: colors.brassLight, fontSize: 12 * fontScale }]}>
              {t(`codex.era.${battle.era}`)}
            </Text>
            <Text style={[styles.title, { color: colors.text, fontSize: 30 * fontScale }]}>{battle.title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.meta}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: 13 * fontScale }]}>{battle.date}</Text>
              </View>
              <View style={styles.meta}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: 13 * fontScale }]}>{battle.region}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {!unlocked ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <Text style={[styles.text, { color: colors.textSecondary, fontSize: 15 * fontScale }]}>{t('codex.lockedHint')}</Text>
            </View>
          ) : (
            <>
              <Text style={[styles.summary, { color: colors.text, fontSize: 16 * fontScale }]}>{battle.shortSummary}</Text>

              <View style={[styles.sidesCard, { backgroundColor: colors.option, borderColor: colors.optionEdge }]}>
                <View style={styles.side}>
                  <Text style={[styles.sideName, { color: colors.textOnParchment, fontSize: 15 * fontScale }]}>{battle.sides.aName}</Text>
                  <Text style={[styles.commanders, { color: colors.textOnParchmentSoft, fontSize: 12 * fontScale }]}>{battle.commanders.a.join(', ')}</Text>
                </View>
                <View style={[styles.vs, { backgroundColor: colors.brass }]}>
                  <Swords size={16} color="#2B2419" />
                </View>
                <View style={[styles.side, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.sideName, { color: colors.textOnParchment, fontSize: 15 * fontScale, textAlign: 'right' }]}>{battle.sides.bName}</Text>
                  <Text style={[styles.commanders, { color: colors.textOnParchmentSoft, fontSize: 12 * fontScale, textAlign: 'right' }]}>{battle.commanders.b.join(', ')}</Text>
                </View>
              </View>

              <Section title={t('codex.outcome')}>
                <Text style={[styles.text, { color: colors.text, fontSize: 15 * fontScale }]}>{battle.outcome}</Text>
              </Section>

              <Section title={t('codex.whyItMatters')}>
                {battle.whyItMatters.map((w, i) => (
                  <View key={i} style={styles.bullet}>
                    <View style={[styles.dot, { backgroundColor: colors.brass }]} />
                    <Text style={[styles.text, { color: colors.text, fontSize: 15 * fontScale, flex: 1 }]}>{w}</Text>
                  </View>
                ))}
              </Section>

              <Section title={t('codex.facts')}>
                {battle.facts.map((f, i) => (
                  <View key={i} style={[styles.fact, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <Text style={[styles.text, { color: colors.text, fontSize: 14 * fontScale }]}>{f}</Text>
                  </View>
                ))}
              </Section>
            </>
          )}

          {lesson ? (
            <ChunkyButton
              label={unlocked ? t('codex.replay') : t('codex.study')}
              variant={unlocked ? 'brass' : 'ember'}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
              style={{ marginTop: 8 }}
            />
          ) : null}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  hero: { height: 340, justifyContent: 'flex-end' },
  back: { position: 'absolute', left: 16, width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  heroBody: { paddingHorizontal: 20, gap: 6 },
  lockedChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, height: 26, borderRadius: 13, borderWidth: 1 },
  lockedText: { fontFamily: fonts.bodyBlack, fontSize: 11 },
  era: { fontFamily: fonts.bodyBlack, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { fontFamily: fonts.display, lineHeight: 36 },
  metaRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fonts.bodySemi },
  body: { paddingHorizontal: 20, paddingTop: 16, gap: 20 },
  summary: { fontFamily: fonts.bodySemi, lineHeight: 25 },
  sidesCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.md, borderWidth: 2 },
  side: { flex: 1, gap: 2 },
  sideName: { fontFamily: fonts.bodyBlack },
  commanders: { fontFamily: fonts.bodySemi },
  vs: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  section: { gap: 8 },
  sectionTitle: { fontFamily: fonts.bodyBlack, letterSpacing: 1.2, textTransform: 'uppercase' },
  text: { fontFamily: fonts.body, lineHeight: 22 },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
  fact: { padding: 12, borderRadius: radius.sm, borderWidth: 1 },
  card: { padding: 16, borderRadius: radius.md, borderWidth: 1 },
});
