import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/contexts/SettingsContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useSettings();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>{t('privacy.lastUpdated')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.introTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.introText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacy.collectTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.collectText')}
          </Text>
          <Text style={styles.bulletPoint}>• {t('privacy.collectItem1')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.collectItem2')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.collectItem3')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.useTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.useText')}
          </Text>
          <Text style={styles.bulletPoint}>• {t('privacy.useItem1')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.useItem2')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.useItem3')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.storageTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.storageText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacy.thirdPartyTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.thirdPartyText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacy.childrenTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.childrenText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacy.rightsTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.rightsText')}
          </Text>
          <Text style={styles.bulletPoint}>• {t('privacy.rightsItem1')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.rightsItem2')}</Text>
          <Text style={styles.bulletPoint}>• {t('privacy.rightsItem3')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.changesTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.changesText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacy.contactTitle')}</Text>
          <Text style={styles.paragraph}>
            {t('privacy.contactText')}
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
