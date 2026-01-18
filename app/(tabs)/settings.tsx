import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Volume2, Eye, Type, Info, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@/contexts/SettingsContext';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const { 
    settings, 
    toggleVibration, 
    toggleSound, 
    toggleReducedMotion, 
    toggleLargerText 
  } = useSettings();

  const handleToggle = (toggleFn: () => void) => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFn();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
                <Bell size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Vibration</Text>
                <Text style={styles.settingDescription}>Haptic feedback for interactions</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={() => handleToggle(toggleVibration)}
              trackColor={{ false: Colors.pathLine, true: Colors.primary + '60' }}
              thumbColor={settings.vibrationEnabled ? Colors.primary : Colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.secondary + '20' }]}>
                <Volume2 size={20} color={Colors.secondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Audio feedback for correct/wrong answers</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => handleToggle(toggleSound)}
              trackColor={{ false: Colors.pathLine, true: Colors.primary + '60' }}
              thumbColor={settings.soundEnabled ? Colors.primary : Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.success + '20' }]}>
                <Eye size={20} color={Colors.success} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Reduce Motion</Text>
                <Text style={styles.settingDescription}>Minimize animations throughout the app</Text>
              </View>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={() => handleToggle(toggleReducedMotion)}
              trackColor={{ false: Colors.pathLine, true: Colors.primary + '60' }}
              thumbColor={settings.reducedMotion ? Colors.primary : Colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.xp + '20' }]}>
                <Type size={20} color={Colors.xp} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Larger Text</Text>
                <Text style={styles.settingDescription}>Increase text size for readability</Text>
              </View>
            </View>
            <Switch
              value={settings.largerText}
              onValueChange={() => handleToggle(toggleLargerText)}
              trackColor={{ false: Colors.pathLine, true: Colors.primary + '60' }}
              thumbColor={settings.largerText ? Colors.primary : Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.textSecondary + '20' }]}>
                <Info size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>App Version</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
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
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
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
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
