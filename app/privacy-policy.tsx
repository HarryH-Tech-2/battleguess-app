import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/contexts/SettingsContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: February 2025</Text>

          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to BattleGuess. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our application.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            BattleGuess collects minimal data to provide you with the best learning experience:
          </Text>
          <Text style={styles.bulletPoint}>• App preferences and settings (theme, sound, vibration preferences)</Text>
          <Text style={styles.bulletPoint}>• Learning progress and statistics (lessons completed, XP earned, streaks)</Text>
          <Text style={styles.bulletPoint}>• Selected mascot and customization choices</Text>

          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information solely to:
          </Text>
          <Text style={styles.bulletPoint}>• Save your learning progress locally on your device</Text>
          <Text style={styles.bulletPoint}>• Remember your app preferences</Text>
          <Text style={styles.bulletPoint}>• Provide a personalized learning experience</Text>

          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.paragraph}>
            All your data is stored locally on your device. We do not transmit your personal information to external servers. Your progress and preferences remain on your device unless you choose to delete the app.
          </Text>

          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            BattleGuess does not share your data with third parties. We do not use analytics services that track your personal information or behavior outside of the app.
          </Text>

          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            BattleGuess is designed to be educational and family-friendly. We do not knowingly collect personal information from children under 13. The app is suitable for users of all ages interested in learning about historical battles.
          </Text>

          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Delete your data by uninstalling the app</Text>
          <Text style={styles.bulletPoint}>• Modify your preferences at any time in Settings</Text>
          <Text style={styles.bulletPoint}>• Use the app without creating an account</Text>

          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy.
          </Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this privacy policy, please contact us through the app store listing or our support channels.
          </Text>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginLeft: 8,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
