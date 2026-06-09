import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/contexts/SettingsContext';

export default function TermsOfServiceScreen() {
  const { colors } = useSettings();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>{t('terms.lastUpdated')}</Text>

          <Text style={styles.sectionTitle}>{t('terms.acceptTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.acceptText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.descTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.descText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.userTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.userText')}
          </Text>
          <Text style={styles.bulletPoint}>• {t('terms.userItem1')}</Text>
          <Text style={styles.bulletPoint}>• {t('terms.userItem2')}</Text>
          <Text style={styles.bulletPoint}>• {t('terms.userItem3')}</Text>
          <Text style={styles.bulletPoint}>• {t('terms.userItem4')}</Text>

          <Text style={styles.sectionTitle}>{t('terms.eduTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.eduText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.ipTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.ipText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.warrantyTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.warrantyText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.liabilityTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.liabilityText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.updatesTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.updatesText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.changesToTermsTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.changesToTermsText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.lawTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.lawText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terms.contactTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('terms.contactText')}
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
