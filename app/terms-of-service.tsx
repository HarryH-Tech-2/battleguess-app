import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/contexts/SettingsContext';

export default function TermsOfServiceScreen() {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: February 2025</Text>

          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using BattleGuess, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </Text>

          <Text style={styles.sectionTitle}>Description of Service</Text>
          <Text style={styles.paragraph}>
            BattleGuess is an educational mobile application designed to teach users about historical battles through interactive quizzes and lessons. The app provides engaging content about military history from various eras and regions around the world.
          </Text>

          <Text style={styles.sectionTitle}>User Responsibilities</Text>
          <Text style={styles.paragraph}>
            As a user of BattleGuess, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Use the app for personal, non-commercial purposes</Text>
          <Text style={styles.bulletPoint}>• Not attempt to reverse engineer, modify, or distribute the app</Text>
          <Text style={styles.bulletPoint}>• Not use the app in any way that violates applicable laws</Text>
          <Text style={styles.bulletPoint}>• Respect the intellectual property rights of the content</Text>

          <Text style={styles.sectionTitle}>Educational Content</Text>
          <Text style={styles.paragraph}>
            The historical information provided in BattleGuess is intended for educational purposes. While we strive for accuracy, historical interpretations may vary, and some details may be simplified for learning purposes. Users are encouraged to explore additional sources for comprehensive historical study.
          </Text>

          <Text style={styles.sectionTitle}>Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content within BattleGuess, including but not limited to text, graphics, images, and the overall design, is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.
          </Text>

          <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            BattleGuess is provided "as is" without warranties of any kind. We do not guarantee that the app will be error-free, uninterrupted, or free of harmful components. Use of the app is at your own risk.
          </Text>

          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the app.
          </Text>

          <Text style={styles.sectionTitle}>App Updates</Text>
          <Text style={styles.paragraph}>
            We may update the app from time to time to add new features, fix bugs, or improve performance. These updates may be required for continued use of the app. We reserve the right to modify or discontinue the app at any time.
          </Text>

          <Text style={styles.sectionTitle}>Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms of Service at any time. Continued use of the app after changes constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
          </Text>

          <Text style={styles.sectionTitle}>Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </Text>

          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us through the app store listing or our official support channels.
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
