import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, Sun, Moon, Smartphone, UserCircle, Vibrate, Volume2, Eye, Type, FileText, Shield, Globe } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { useSettings, ThemeMode } from '@/contexts/SettingsContext';
import { LANGUAGES, LanguageCode } from '@/i18n';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { fonts, radius } from '@/constants/theme';
import { tap } from '@/utils/haptics';
import { goBack } from '@/utils/navigation';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    settings,
    toggleVibration,
    toggleSound,
    toggleReducedMotion,
    toggleLargerText,
    setThemeMode,
    setLanguage,
    colors,
    fontScale,
    haptics,
  } = useSettings();

  const press = (fn: () => void) => () => {
    if (haptics) tap();
    fn();
  };

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { color: colors.brass, fontSize: 12 * fontScale }]}>{title}</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>{children}</View>
    </View>
  );

  const RowItem = ({
    icon,
    label,
    desc,
    right,
    onPress,
    last,
  }: {
    icon: React.ReactNode;
    label: string;
    desc?: string;
    right?: React.ReactNode;
    onPress?: () => void;
    last?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder }]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.bgSunken }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text, fontSize: 15 * fontScale }]}>{label}</Text>
        {desc ? <Text style={[styles.rowDesc, { color: colors.textSecondary, fontSize: 12 * fontScale }]}>{desc}</Text> : null}
      </View>
      {right}
    </Pressable>
  );

  const themeOptions: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
    { mode: 'light', icon: Sun, label: t('settings.light') },
    { mode: 'dark', icon: Moon, label: t('settings.dark') },
    { mode: 'system', icon: Smartphone, label: t('settings.system') },
  ];

  const switchColors = { false: colors.bgSunken, true: colors.brass };

  return (
    <ScreenBackground>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={press(() => goBack('/(tabs)/player-profile'))} style={[styles.back, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]} accessibilityRole="button" accessibilityLabel={t('common.back')}>
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text, fontSize: 22 * fontScale }]}>{t('settings.title')}</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Group title={t('settings.profile')}>
          <RowItem
            icon={<UserCircle size={18} color={colors.brassLight} />}
            label={t('settings.changeGuide')}
            desc={t('settings.changeGuideDesc')}
            right={<ChevronRight size={18} color={colors.textMuted} />}
            onPress={press(() => router.push('/choose-guide'))}
            last
          />
        </Group>

        <Group title={t('settings.appearance')}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder, flexDirection: 'column', alignItems: 'stretch', gap: 12 }]}>
            <Text style={[styles.rowLabel, { color: colors.text, fontSize: 15 * fontScale }]}>{t('settings.theme')}</Text>
            <View style={styles.segment}>
              {themeOptions.map(({ mode, icon: Icon, label }) => {
                const active = settings.themeMode === mode;
                return (
                  <Pressable
                    key={mode}
                    onPress={press(() => setThemeMode(mode))}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[styles.segmentItem, { backgroundColor: active ? colors.brass : colors.bgSunken }]}
                  >
                    <Icon size={16} color={active ? '#2B2419' : colors.textSecondary} />
                    <Text style={[styles.segmentText, { color: active ? '#2B2419' : colors.textSecondary, fontSize: 13 * fontScale }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={[styles.row, { flexDirection: 'column', alignItems: 'stretch', gap: 12 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Globe size={16} color={colors.brassLight} />
              <Text style={[styles.rowLabel, { color: colors.text, fontSize: 15 * fontScale }]}>{t('settings.language')}</Text>
            </View>
            <View style={styles.langWrap}>
              {[{ code: 'auto' as const, nativeName: t('settings.auto') }, ...LANGUAGES].map((l) => {
                const active = settings.language === l.code;
                return (
                  <Pressable
                    key={l.code}
                    onPress={press(() => setLanguage(l.code as LanguageCode | 'auto'))}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[styles.langChip, { backgroundColor: active ? colors.brass : 'transparent', borderColor: active ? colors.brass : colors.surfaceBorder }]}
                  >
                    <Text style={[styles.segmentText, { color: active ? '#2B2419' : colors.textSecondary, fontSize: 13 * fontScale }]}>{l.nativeName}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Group>

        <Group title={t('settings.feedback')}>
          <RowItem
            icon={<Vibrate size={18} color={colors.brassLight} />}
            label={t('settings.vibration')}
            desc={t('settings.vibrationDesc')}
            right={<Switch value={settings.vibrationEnabled} onValueChange={press(toggleVibration)} trackColor={switchColors} thumbColor="#fff" />}
          />
          <RowItem
            icon={<Volume2 size={18} color={colors.brassLight} />}
            label={t('settings.soundEffects')}
            desc={t('settings.soundEffectsDesc')}
            right={<Switch value={settings.soundEnabled} onValueChange={press(toggleSound)} trackColor={switchColors} thumbColor="#fff" />}
            last
          />
        </Group>

        <Group title={t('settings.accessibility')}>
          <RowItem
            icon={<Eye size={18} color={colors.brassLight} />}
            label={t('settings.reduceMotion')}
            desc={t('settings.reduceMotionDesc')}
            right={<Switch value={settings.reducedMotion} onValueChange={press(toggleReducedMotion)} trackColor={switchColors} thumbColor="#fff" />}
          />
          <RowItem
            icon={<Type size={18} color={colors.brassLight} />}
            label={t('settings.largerText')}
            desc={t('settings.largerTextDesc')}
            right={<Switch value={settings.largerText} onValueChange={press(toggleLargerText)} trackColor={switchColors} thumbColor="#fff" />}
            last
          />
        </Group>

        <Group title={t('settings.legal')}>
          <RowItem
            icon={<Shield size={18} color={colors.brassLight} />}
            label={t('settings.privacyPolicy')}
            desc={t('settings.privacyPolicyDesc')}
            right={<ChevronRight size={18} color={colors.textMuted} />}
            onPress={press(() => router.push('/privacy-policy'))}
          />
          <RowItem
            icon={<FileText size={18} color={colors.brassLight} />}
            label={t('settings.termsOfService')}
            desc={t('settings.termsOfServiceDesc')}
            right={<ChevronRight size={18} color={colors.textMuted} />}
            onPress={press(() => router.push('/terms-of-service'))}
            last
          />
        </Group>

        <Text style={[styles.version, { color: colors.textMuted, fontSize: 12 * fontScale }]}>
          {t('settings.appVersion')} {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  back: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 22 },
  group: { gap: 8 },
  groupTitle: { fontFamily: fonts.bodyBlack, letterSpacing: 1.2, textTransform: 'uppercase' },
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: fonts.bodyBold },
  rowDesc: { fontFamily: fonts.bodySemi, marginTop: 2 },
  segment: { flexDirection: 'row', gap: 8 },
  segmentItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: radius.sm },
  segmentText: { fontFamily: fonts.bodyBlack },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: { paddingHorizontal: 12, height: 34, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  version: { fontFamily: fonts.bodySemi, textAlign: 'center' },
});
