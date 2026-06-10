import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Volume2, Eye, Type, Info, ChevronRight, Moon, Sun, Smartphone, FileText, Shield, UserCircle, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useSettings, ThemeMode } from '@/contexts/SettingsContext';
import { LANGUAGES, LanguageCode } from '@/i18n';

export default function SettingsScreen() {
  const router = useRouter();
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
  } = useSettings();

  const handleToggle = (toggleFn: () => void) => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFn();
  };

  const handleThemeChange = (mode: ThemeMode) => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setThemeMode(mode);
  };

  const handleLanguageChange = (lang: LanguageCode | 'auto') => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLanguage(lang);
  };

  const styles = createStyles(colors, fontScale);

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return <Sun size={16} color={settings.themeMode === mode ? colors.primary : colors.textSecondary} />;
      case 'dark':
        return <Moon size={16} color={settings.themeMode === mode ? colors.primary : colors.textSecondary} />;
      case 'system':
        return <Smartphone size={16} color={settings.themeMode === mode ? colors.primary : colors.textSecondary} />;
    }
  };

  const currentLang = settings.language === 'auto' ? 'auto' : settings.language;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => router.push('/choose-guide' as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <UserCircle size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.changeGuide')}</Text>
                <Text style={styles.settingDescription}>{t('settings.changeGuideDesc')}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Moon size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.theme')}</Text>
                <Text style={styles.settingDescription}>{t('settings.themeDesc')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.themeOptions}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeOption,
                  settings.themeMode === mode && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange(mode)}
                activeOpacity={0.7}
              >
                {getThemeIcon(mode)}
                <Text style={[
                  styles.themeOptionText,
                  settings.themeMode === mode && styles.themeOptionTextSelected,
                ]}>
                  {t(`settings.${mode}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Globe size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.language')}</Text>
                <Text style={styles.settingDescription}>{t('settings.languageDesc')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLang === 'auto' && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageChange('auto')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.languageOptionText,
                currentLang === 'auto' && styles.languageOptionTextSelected,
              ]}>
                Auto
              </Text>
            </TouchableOpacity>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  currentLang === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.languageOptionText,
                  currentLang === lang.code && styles.languageOptionTextSelected,
                ]}>
                  {lang.nativeName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.feedback')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.vibration')}</Text>
                <Text style={styles.settingDescription}>{t('settings.vibrationDesc')}</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={() => handleToggle(toggleVibration)}
              trackColor={{ false: colors.pathLine, true: colors.primary + '60' }}
              thumbColor={settings.vibrationEnabled ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <Volume2 size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.soundEffects')}</Text>
                <Text style={styles.settingDescription}>{t('settings.soundEffectsDesc')}</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => handleToggle(toggleSound)}
              trackColor={{ false: colors.pathLine, true: colors.primary + '60' }}
              thumbColor={settings.soundEnabled ? colors.primary : colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.accessibility')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                <Eye size={20} color={colors.success} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.reduceMotion')}</Text>
                <Text style={styles.settingDescription}>{t('settings.reduceMotionDesc')}</Text>
              </View>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={() => handleToggle(toggleReducedMotion)}
              trackColor={{ false: colors.pathLine, true: colors.primary + '60' }}
              thumbColor={settings.reducedMotion ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.xp + '20' }]}>
                <Type size={20} color={colors.xp} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.largerText')}</Text>
                <Text style={styles.settingDescription}>{t('settings.largerTextDesc')}</Text>
              </View>
            </View>
            <Switch
              value={settings.largerText}
              onValueChange={() => handleToggle(toggleLargerText)}
              trackColor={{ false: colors.pathLine, true: colors.primary + '60' }}
              thumbColor={settings.largerText ? colors.primary : colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.legal')}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => router.push('/privacy-policy' as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <Shield size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.privacyPolicy')}</Text>
                <Text style={styles.settingDescription}>{t('settings.privacyPolicyDesc')}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => router.push('/terms-of-service' as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <FileText size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.termsOfService')}</Text>
                <Text style={styles.settingDescription}>{t('settings.termsOfServiceDesc')}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <Info size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('settings.appVersion')}</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, fs: number = 1) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 28 * fs,
    fontWeight: '700' as const,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14 * fs,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16 * fs,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13 * fs,
    color: colors.textSecondary,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  themeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  themeOptionText: {
    fontSize: 14 * fs,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  themeOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  languageOptionText: {
    fontSize: 14 * fs,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  languageOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
});
