import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Trophy,
  Flame,
  Star,
  BookOpen,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { EducationalArticle } from '@/mocks/educational';

const FormattedContent = ({ content, colors }: { content: string; colors: any }) => {
  const elements = useMemo(() => {
    const lines = content.split('\n');
    const result: { type: 'heading' | 'paragraph' | 'bullet'; text: string }[] = [];
    let currentParagraph = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        if (currentParagraph) {
          result.push({ type: 'paragraph', text: currentParagraph.trim() });
          currentParagraph = '';
        }
        result.push({ type: 'heading', text: trimmedLine.replace(/\*\*/g, '') });
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        if (currentParagraph) {
          result.push({ type: 'paragraph', text: currentParagraph.trim() });
          currentParagraph = '';
        }
        result.push({ type: 'bullet', text: trimmedLine.substring(2) });
      } else if (trimmedLine === '') {
        if (currentParagraph) {
          result.push({ type: 'paragraph', text: currentParagraph.trim() });
          currentParagraph = '';
        }
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
      }
    });

    if (currentParagraph) {
      result.push({ type: 'paragraph', text: currentParagraph.trim() });
    }

    return result;
  }, [content]);

  const styles = createFormattedStyles(colors);

  return (
    <View>
      {elements.map((element, index) => {
        if (element.type === 'heading') {
          return (
            <Text key={index} style={styles.articleHeading}>
              {element.text}
            </Text>
          );
        } else if (element.type === 'bullet') {
          return (
            <View key={index} style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{element.text}</Text>
            </View>
          );
        } else {
          return (
            <Text key={index} style={styles.articleParagraph}>
              {element.text}
            </Text>
          );
        }
      })}
    </View>
  );
};

export default function PlayerProfileScreen() {
  const { t } = useTranslation();
  const { progress } = useUserProgress();
  const { colors } = useSettings();
  const { mascots, articles: educationalArticles } = useContent();
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);
  const styles = createStyles(colors);

  const handleArticlePress = useCallback((article: EducationalArticle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedArticle(article);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {mascot && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: mascot.avatar }} style={styles.avatar} contentFit="cover" />
            </View>
          )}
          <Text style={styles.mascotName}>{mascot?.name || t('profile.chooseGuide')}</Text>
          <Text style={styles.mascotDescription}>{mascot?.description || ''}</Text>
          {mascot?.dates && <Text style={styles.mascotDates}>{mascot.dates}</Text>}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.streak + '20' }]}>
              <Flame size={24} color={colors.streak} />
            </View>
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
            <Text style={styles.statLabel}>{t('profile.dayStreak')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.xp + '20' }]}>
              <Star size={24} color={colors.xp} />
            </View>
            <Text style={styles.statValue}>{progress.totalXp}</Text>
            <Text style={styles.statLabel}>{t('profile.totalXp')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
              <Trophy size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
            <Text style={styles.statLabel}>{t('profile.lessons')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('profile.learnMore')}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{t('profile.educationalArticles')}</Text>

          {educationalArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => handleArticlePress(article)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: article.imageUrl }} style={styles.articleImage} contentFit="cover" />
              <View style={styles.articleContent}>
                <View style={styles.articleMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView style={styles.articleModalContainer}>
          <View style={styles.articleModalHeader}>
            <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.articleModalTitle} numberOfLines={1}>{selectedArticle?.title}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.articleModalScroll} showsVerticalScrollIndicator={false}>
            {selectedArticle && (
              <>
                <Image
                  source={{ uri: selectedArticle.imageUrl }}
                  style={styles.articleModalImage}
                  contentFit="cover"
                />
                <View style={styles.articleModalContent}>
                  <View style={styles.articleModalMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{selectedArticle.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.articleModalHeading}>{selectedArticle.title}</Text>
                  <FormattedContent content={selectedArticle.content} colors={colors} />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createFormattedStyles = (colors: any) => StyleSheet.create({
  articleHeading: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  articleParagraph: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
    marginBottom: 16,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    lineHeight: 26,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
  },
});

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
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  mascotName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  mascotDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mascotDates: {
    fontSize: 13,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  articleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  articleImage: {
    width: '100%',
    height: 140,
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
  articleModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  articleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleModalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  articleModalScroll: {
    flex: 1,
  },
  articleModalImage: {
    width: '100%',
    height: 220,
  },
  articleModalContent: {
    padding: 20,
  },
  articleModalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  articleModalHeading: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 34,
  },
});
