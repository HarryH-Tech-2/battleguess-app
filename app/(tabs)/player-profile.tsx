import { useState, useRef, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  BookOpen, 
  ChevronRight,
  X,
  Clock,
  Check,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { mascots } from '@/mocks/mascots';
import { educationalArticles, EducationalArticle } from '@/mocks/educational';
import { DailyGoal } from '@/types';
import Colors from '@/constants/colors';

const DAILY_GOAL_OPTIONS: DailyGoal[] = [5, 10, 15];

const FormattedContent = ({ content }: { content: string }) => {
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
  const { progress, updateProgress } = useUserProgress();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);

  const handleGoalPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowGoalModal(true);
  };

  const handleSelectGoal = (goal: DailyGoal) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProgress({ dailyGoal: goal });
    setShowGoalModal(false);
  };

  const handleArticlePress = useCallback((article: EducationalArticle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedArticle(article);
  }, []);

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {mascot && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: mascot.avatar }} style={styles.avatar} contentFit="cover" />
            </View>
          )}
          <Text style={styles.mascotName}>{mascot?.name || 'Choose a Guide'}</Text>
          <Text style={styles.mascotDescription}>{mascot?.description || ''}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.streak + '20' }]}>
              <Flame size={24} color={Colors.streak} />
            </View>
            <Text style={styles.statValue}>{progress.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.xp + '20' }]}>
              <Star size={24} color={Colors.xp} />
            </View>
            <Text style={styles.statValue}>{progress.totalXp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.success + '20' }]}>
              <Trophy size={24} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.goalCard} 
            onPress={() => { animatePress(); handleGoalPress(); }}
            activeOpacity={0.9}
          >
            <View style={styles.goalLeft}>
              <View style={[styles.goalIconContainer, { backgroundColor: Colors.primary + '20' }]}>
                <Target size={24} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.goalTitle}>Daily Goal</Text>
                <Text style={styles.goalValue}>{progress.dailyGoal} minutes per day</Text>
              </View>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Learn More</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Educational articles about military history</Text>

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
                  <View style={styles.readTime}>
                    <Clock size={12} color={Colors.textSecondary} />
                    <Text style={styles.readTimeText}>{article.readTime} min</Text>
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
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Daily Goal</Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <X size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>How much time do you want to learn each day?</Text>
            
            {DAILY_GOAL_OPTIONS.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalOption,
                  progress.dailyGoal === goal && styles.goalOptionSelected,
                ]}
                onPress={() => handleSelectGoal(goal)}
              >
                <View style={styles.goalOptionLeft}>
                  <Target size={20} color={progress.dailyGoal === goal ? Colors.primary : Colors.textSecondary} />
                  <Text style={[
                    styles.goalOptionText,
                    progress.dailyGoal === goal && styles.goalOptionTextSelected,
                  ]}>
                    {goal} minutes
                  </Text>
                </View>
                {progress.dailyGoal === goal && (
                  <Check size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView style={styles.articleModalContainer}>
          <View style={styles.articleModalHeader}>
            <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
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
                    <View style={styles.readTime}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.readTimeText}>{selectedArticle.readTime} min read</Text>
                    </View>
                  </View>
                  <Text style={styles.articleModalHeading}>{selectedArticle.title}</Text>
                  <FormattedContent content={selectedArticle.content} />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  mascotName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  mascotDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
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
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  goalValue: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  articleCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
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
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundDark,
    marginBottom: 12,
  },
  goalOptionSelected: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  goalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalOptionText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  goalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  articleModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  articleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
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
    color: Colors.text,
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
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 34,
  },
  articleModalBody: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
  },
  articleHeading: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  articleParagraph: {
    fontSize: 16,
    color: Colors.text,
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
    color: Colors.primary,
    marginRight: 8,
    lineHeight: 26,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
  },
});
