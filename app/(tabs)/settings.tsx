import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Volume2, Eye, Type, Info, ChevronRight, Moon, Sun, Smartphone, FileText, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSettings, ThemeMode } from '@/contexts/SettingsContext';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    settings,
    toggleVibration,
    toggleSound,
    toggleReducedMotion,
    toggleLargerText,
    setThemeMode,
    colors,
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

  const styles = createStyles(colors);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Moon size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingDescription}>Choose your preferred appearance</Text>
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
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Vibration</Text>
                <Text style={styles.settingDescription}>Haptic feedback for interactions</Text>
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
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Audio feedback for correct/wrong answers</Text>
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
          <Text style={styles.sectionTitle}>Accessibility</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                <Eye size={20} color={colors.success} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Reduce Motion</Text>
                <Text style={styles.settingDescription}>Minimize animations throughout the app</Text>
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
                <Text style={styles.settingTitle}>Larger Text</Text>
                <Text style={styles.settingDescription}>Increase text size for readability</Text>
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
          <Text style={styles.sectionTitle}>Legal</Text>

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
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>How we handle your data</Text>
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
                <Text style={styles.settingTitle}>Terms of Service</Text>
                <Text style={styles.settingDescription}>Rules and guidelines for using the app</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <Info size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>App Version</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    fontSize: 28,
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
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
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
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  themeOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
});
