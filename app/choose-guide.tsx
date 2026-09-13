import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { X, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getMascotImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { fonts, radius } from '@/constants/theme';
import { tap, success } from '@/utils/haptics';
import { goBack } from '@/utils/navigation';

export default function ChooseGuideScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { progress, updateProgress } = useUserProgress();
  const { colors, fontScale, haptics } = useSettings();
  const { mascots } = useContent();
  const [selected, setSelected] = useState(progress.selectedMascotId);

  const save = () => {
    if (haptics) success();
    updateProgress({ selectedMascotId: selected });
    goBack('/(tabs)/player-profile');
  };

  return (
    <ScreenBackground>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={{ width: 42 }} />
        <Text style={[styles.title, { color: colors.text, fontSize: 22 * fontScale }]}>{t('chooseGuide.title')}</Text>
        <Pressable onPress={() => goBack('/(tabs)/player-profile')} style={[styles.iconBtn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]} accessibilityRole="button" accessibilityLabel={t('common.close')}>
          <X size={22} color={colors.text} />
        </Pressable>
      </View>
      <Text style={[styles.sub, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>{t('chooseGuide.subtitle')}</Text>

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {mascots.map((m) => {
          const active = selected === m.id;
          const isCurrent = progress.selectedMascotId === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                if (haptics) tap();
                setSelected(m.id);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[styles.card, { backgroundColor: active ? colors.option : colors.surface, borderColor: active ? colors.brass : colors.surfaceBorder }]}
            >
              <View style={[styles.portrait, { borderColor: active ? colors.brass : colors.surfaceBorder }]}>
                <Image source={getMascotImage(m.id)} style={StyleSheet.absoluteFill} contentFit="cover" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: active ? colors.textOnParchment : colors.text, fontSize: 17 * fontScale }]}>{m.name}</Text>
                  {isCurrent ? (
                    <View style={[styles.currentChip, { backgroundColor: colors.brass }]}>
                      <Text style={styles.currentText}>{t('chooseGuide.currentGuide')}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.dates, { color: active ? colors.brassDark : colors.brassLight, fontSize: 12 * fontScale }]}>{m.dates}</Text>
                <Text style={[styles.desc, { color: active ? colors.textOnParchmentSoft : colors.textSecondary, fontSize: 13 * fontScale }]}>{m.description}</Text>
                <Text style={[styles.quote, { color: active ? colors.textOnParchment : colors.textSecondary, fontSize: 13 * fontScale }]}>
                  {'“'}{m.cheer}{'”'}
                </Text>
              </View>
              {active ? (
                <View style={[styles.check, { backgroundColor: colors.brass }]}>
                  <Check size={14} color="#2B2419" strokeWidth={3.5} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.bg, borderTopColor: colors.surfaceBorder }]}>
        <ChunkyButton label={t('chooseGuide.saveGuide')} variant="ember" disabled={!selected} onPress={save} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 4 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display },
  sub: { fontFamily: fonts.bodySemi, textAlign: 'center', paddingHorizontal: 24, marginBottom: 12 },
  list: { paddingHorizontal: 20, gap: 12 },
  card: { flexDirection: 'row', gap: 14, padding: 14, borderRadius: radius.lg, borderWidth: 2 },
  portrait: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, overflow: 'hidden', backgroundColor: '#26324A' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontFamily: fonts.bodyBlack },
  currentChip: { paddingHorizontal: 8, height: 20, borderRadius: 10, justifyContent: 'center' },
  currentText: { fontFamily: fonts.bodyBlack, fontSize: 10, color: '#2B2419' },
  dates: { fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  desc: { fontFamily: fonts.bodySemi, lineHeight: 18 },
  quote: { fontFamily: fonts.bodyBold, fontStyle: 'italic', marginTop: 4 },
  check: { position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
