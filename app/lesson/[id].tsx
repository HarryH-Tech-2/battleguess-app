import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Flame, GripVertical, MapPin, Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useContent } from '@/i18n/useContent';
import { getBattleImage, getMascotImage } from '@/mocks/images';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Dialog } from '@/components/ui/Modal';
import { OptionCard, OptionStatus } from '@/components/lesson/OptionCard';
import { MapTap } from '@/components/lesson/MapTap';
import { TimelineSlider, formatYear } from '@/components/lesson/TimelineSlider';
import { FeedbackSheet } from '@/components/lesson/FeedbackSheet';
import { fonts, radius } from '@/constants/theme';
import { success, failure, warn, tap } from '@/utils/haptics';
import { goBack } from '@/utils/navigation';
import {
  Step,
  MultiChoiceStep,
  MapTapStep,
  OrderEventsStep,
  MatchPairsStep,
  FillBlankStep,
  TimelineSliderStep,
  TwoTruthsStep,
  StoryCardStep,
} from '@/types';

type FeedbackState = 'none' | 'correct' | 'wrong';

const QUIZ_STARTING_HEARTS = 3;

// Deterministic shuffle so the right-hand column of a match question is
// stable across re-renders but never in the same order as the left column.
const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  const rand = () => {
    h = (h ^ (h << 13)) | 0;
    h = (h ^ (h >>> 17)) | 0;
    h = (h ^ (h << 5)) | 0;
    return (h >>> 0) / 4294967296;
  };
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
    arr.push(arr.shift() as T);
  }
  return arr;
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { progress, recordQuestionAttempt } = useUserProgress();
  const { colors, fontScale, haptics, reducedMotion } = useSettings();
  const { getLessonById, getBattleById, mascots } = useContent();

  const lesson = getLessonById(id || '');
  const battle = lesson ? getBattleById(lesson.battleId) : null;
  const battleImage = battle ? getBattleImage(battle.id) : undefined;
  const mascot = mascots.find((m) => m.id === progress.selectedMascotId);
  const mascotImage = mascot ? getMascotImage(mascot.id) : undefined;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [quizHearts, setQuizHearts] = useState(QUIZ_STARTING_HEARTS);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [showQuit, setShowQuit] = useState(false);

  const stepAnim = useRef(new Animated.Value(1)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const heartShake = useRef(new Animated.Value(0)).current;

  const currentStep = lesson?.steps[currentStepIndex];

  const shuffledRights = useMemo(() => {
    if (!currentStep || currentStep.type !== 'matchPairs') return [];
    return seededShuffle(currentStep.data.pairs.map((p) => p.right), currentStep.id);
  }, [currentStep]);

  const shuffledEvents = useMemo(() => {
    if (!currentStep || currentStep.type !== 'orderEvents') return [];
    const events = currentStep.data.events;
    const sortedIds = [...events].sort((a, b) => a.order - b.order).map((e) => e.id);
    let attempt = seededShuffle(events, currentStep.id);
    // Never present the pool already in the correct order.
    for (let i = 0; i < 5 && attempt.map((e) => e.id).join() === sortedIds.join(); i++) {
      attempt = seededShuffle(events, `${currentStep.id}-${i}`);
    }
    return attempt;
  }, [currentStep]);

  const questionMeta = useMemo(() => {
    if (!lesson) return { current: 0, total: 0 };
    const total = lesson.steps.filter((s) => s.type !== 'storyCard').length;
    const current = lesson.steps.slice(0, currentStepIndex + 1).filter((s) => s.type !== 'storyCard').length;
    return { current, total };
  }, [lesson, currentStepIndex]);

  // Slide each new step in from the right.
  useEffect(() => {
    if (reducedMotion) return;
    stepAnim.setValue(0);
    Animated.spring(stepAnim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 4 }).start();
  }, [currentStepIndex, stepAnim, reducedMotion]);

  useEffect(() => {
    if (combo < 2 || reducedMotion) return;
    comboAnim.setValue(0);
    Animated.spring(comboAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 14 }).start();
  }, [combo, comboAnim, reducedMotion]);

  const resetStepState = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback('none');
    setOrderedItems([]);
    setMatchedPairs({});
    setSelectedLeft(null);
    setSliderValue(null);
  }, []);

  const showFeedback = useCallback(
    (isCorrect: boolean) => {
      setFeedback(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        if (haptics) success();
        setCorrectCount((c) => c + 1);
        setCombo((c) => {
          const next = c + 1;
          setBestCombo((b) => Math.max(b, next));
          return next;
        });
      } else {
        if (haptics) failure();
        setCombo(0);
        setQuizHearts((h) => h - 1);
        if (!reducedMotion) {
          heartShake.setValue(0);
          Animated.sequence([
            Animated.timing(heartShake, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(heartShake, { toValue: -1, duration: 60, useNativeDriver: true }),
            Animated.timing(heartShake, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(heartShake, { toValue: 0, duration: 60, useNativeDriver: true }),
          ]).start();
        }
        if (quizHearts <= 1) setOutOfHearts(true);
      }
    },
    [haptics, quizHearts, heartShake, reducedMotion]
  );

  const checkAnswer = useCallback(() => {
    if (!currentStep) return;
    let isCorrect = false;
    let userAnswerText = '';
    let correctAnswerText = '';

    switch (currentStep.type) {
      case 'multiChoice': {
        const step = currentStep as MultiChoiceStep;
        isCorrect = selectedAnswer === step.data.correctIndex;
        userAnswerText = typeof selectedAnswer === 'number' ? step.data.options[selectedAnswer] ?? '' : '';
        correctAnswerText = step.data.options[step.data.correctIndex];
        break;
      }
      case 'mapTap': {
        const step = currentStep as MapTapStep;
        isCorrect = selectedAnswer === step.data.correctRegionId;
        userAnswerText = step.data.regions.find((r) => r.id === selectedAnswer)?.name ?? '';
        correctAnswerText = step.data.regions.find((r) => r.id === step.data.correctRegionId)?.name ?? '';
        break;
      }
      case 'orderEvents': {
        const step = currentStep as OrderEventsStep;
        const sorted = [...step.data.events].sort((a, b) => a.order - b.order);
        isCorrect = JSON.stringify(orderedItems) === JSON.stringify(sorted.map((e) => e.id));
        userAnswerText = orderedItems
          .map((eid, i) => `${i + 1}. ${step.data.events.find((e) => e.id === eid)?.text ?? ''}`)
          .join(' | ');
        correctAnswerText = sorted.map((e, i) => `${i + 1}. ${e.text}`).join(' | ');
        break;
      }
      case 'matchPairs': {
        const step = currentStep as MatchPairsStep;
        isCorrect = step.data.pairs.every((p) => matchedPairs[p.left] === p.right);
        userAnswerText = Object.entries(matchedPairs).map(([l, r]) => `${l} → ${r}`).join(' | ');
        correctAnswerText = step.data.pairs.map((p) => `${p.left} → ${p.right}`).join(' | ');
        break;
      }
      case 'fillBlank': {
        const step = currentStep as FillBlankStep;
        isCorrect = selectedAnswer === step.data.blankWord;
        userAnswerText = typeof selectedAnswer === 'string' ? selectedAnswer : '';
        correctAnswerText = step.data.blankWord;
        break;
      }
      case 'timelineSlider': {
        const step = currentStep as TimelineSliderStep;
        const minYear = Number(step.data.minYear);
        const maxYear = Number(step.data.maxYear);
        const correctYear = Number(step.data.correctYear);
        const v = sliderValue === null ? Math.round((minYear + maxYear) / 2) : sliderValue;
        // Only the exact year counts; the slider has nudge buttons for fine control.
        isCorrect = v === correctYear;
        userAnswerText = formatYear(v);
        correctAnswerText = formatYear(correctYear);
        break;
      }
      case 'twoTruths': {
        const step = currentStep as TwoTruthsStep;
        const lieIndex = step.data.statements.findIndex((s) => s.isLie);
        isCorrect = selectedAnswer === lieIndex;
        userAnswerText = typeof selectedAnswer === 'number' ? step.data.statements[selectedAnswer]?.text ?? '' : '';
        correctAnswerText = step.data.statements[lieIndex]?.text ?? '';
        break;
      }
      case 'storyCard':
        isCorrect = true;
        break;
    }

    if (currentStep.type !== 'storyCard' && lesson && battle) {
      recordQuestionAttempt({
        lessonId: lesson.id,
        stepId: currentStep.id,
        stepType: currentStep.type,
        battleId: battle.id,
        battleTitle: battle.title,
        prompt: currentStep.prompt,
        userAnswerText,
        correctAnswerText,
        isCorrect,
      });
    }
    showFeedback(isCorrect);
  }, [currentStep, selectedAnswer, orderedItems, matchedPairs, sliderValue, showFeedback, lesson, battle, recordQuestionAttempt]);

  const handleContinue = useCallback(() => {
    if (!lesson) return;
    if (outOfHearts) {
      if (haptics) warn();
      router.replace('/(tabs)/(home)/learn');
      return;
    }
    if (currentStepIndex < lesson.steps.length - 1) {
      resetStepState();
      setCurrentStepIndex((i) => i + 1);
    } else {
      const totalSteps = lesson.steps.filter((s) => s.type !== 'storyCard').length;
      router.replace({
        pathname: '/lesson-complete',
        params: {
          lessonId: lesson.id,
          correctAnswers: String(correctCount),
          totalSteps: String(totalSteps),
          xpReward: String(lesson.xpReward),
          bestCombo: String(bestCombo),
        },
      });
    }
  }, [lesson, currentStepIndex, correctCount, bestCombo, resetStepState, router, outOfHearts, haptics]);

  const canCheck = useCallback(() => {
    if (!currentStep) return false;
    switch (currentStep.type) {
      case 'multiChoice':
      case 'mapTap':
      case 'fillBlank':
      case 'twoTruths':
        return selectedAnswer !== null;
      case 'orderEvents':
        return orderedItems.length === (currentStep as OrderEventsStep).data.events.length;
      case 'matchPairs':
        return Object.keys(matchedPairs).length === (currentStep as MatchPairsStep).data.pairs.length;
      default:
        return true;
    }
  }, [currentStep, selectedAnswer, orderedItems, matchedPairs]);

  const choiceStatus = (index: number, correctIndex: number): OptionStatus => {
    if (feedback === 'none') return selectedAnswer === index ? 'selected' : 'idle';
    if (index === correctIndex) return 'correct';
    if (selectedAnswer === index) return 'wrong';
    return 'muted';
  };

  const renderMultiChoice = (step: MultiChoiceStep) => (
    <View style={styles.stack}>
      {step.data.options.map((option, index) => (
        <OptionCard
          key={index}
          label={option}
          status={choiceStatus(index, step.data.correctIndex)}
          disabled={feedback !== 'none'}
          onPress={() => setSelectedAnswer(index)}
          left={
            <View style={[styles.letter, { backgroundColor: colors.optionEdge }]}>
              <Text style={[styles.letterText, { color: colors.textOnParchment }]}>{String.fromCharCode(65 + index)}</Text>
            </View>
          }
        />
      ))}
    </View>
  );

  const renderTwoTruths = (step: TwoTruthsStep) => {
    const lieIndex = step.data.statements.findIndex((s) => s.isLie);
    return (
      <View style={styles.stack}>
        {step.data.statements.map((s, index) => (
          <OptionCard
            key={index}
            label={s.text}
            status={choiceStatus(index, lieIndex)}
            disabled={feedback !== 'none'}
            onPress={() => setSelectedAnswer(index)}
          />
        ))}
      </View>
    );
  };

  const renderFillBlank = (step: FillBlankStep) => {
    const chosen = typeof selectedAnswer === 'string' ? selectedAnswer : null;
    const [before, after] = step.data.sentence.split('_____');
    return (
      <View style={styles.stack}>
        <View style={[styles.sentenceCard, { backgroundColor: colors.option, borderColor: colors.optionEdge }]}>
          <Text style={[styles.sentence, { color: colors.textOnParchment, fontSize: 18 * fontScale }]}>
            {before}
            <Text
              style={{
                color: feedback === 'correct' ? colors.successDark : feedback === 'wrong' ? colors.errorDark : colors.brassDark,
                textDecorationLine: chosen ? 'none' : 'underline',
                fontFamily: fonts.bodyBlack,
              }}
            >
              {chosen ?? '______'}
            </Text>
            {after}
          </Text>
        </View>
        <View style={styles.wrapRow}>
          {step.data.options.map((option) => {
            let status: OptionStatus = 'idle';
            if (feedback === 'none') status = chosen === option ? 'selected' : 'idle';
            else if (option === step.data.blankWord) status = 'correct';
            else if (chosen === option) status = 'wrong';
            else status = 'muted';
            return (
              <OptionCard
                key={option}
                label={option}
                status={status}
                compact
                align="center"
                disabled={feedback !== 'none'}
                onPress={() => setSelectedAnswer(option)}
                style={{ minWidth: '46%', flexGrow: 1 }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderOrderEvents = (step: OrderEventsStep) => {
    const unordered = shuffledEvents.filter((e) => !orderedItems.includes(e.id));
    const sorted = [...step.data.events].sort((a, b) => a.order - b.order);
    return (
      <View style={styles.stack}>
        <View style={[styles.orderSlot, { borderColor: colors.surfaceBorder, minHeight: 72 }]}>
          {orderedItems.length === 0 ? (
            <Text style={[styles.slotHint, { color: colors.textMuted }]}>{t('lesson.putInOrder')}</Text>
          ) : null}
          {orderedItems.map((itemId, index) => {
            const event = step.data.events.find((e) => e.id === itemId);
            let status: OptionStatus = 'selected';
            if (feedback !== 'none') status = sorted[index]?.id === itemId ? 'correct' : 'wrong';
            return (
              <OptionCard
                key={itemId}
                label={event?.text ?? ''}
                status={status}
                compact
                disabled={feedback !== 'none'}
                onPress={() => setOrderedItems(orderedItems.filter((x) => x !== itemId))}
                left={
                  <View style={[styles.letter, { backgroundColor: colors.brass }]}>
                    <Text style={[styles.letterText, { color: '#2B2419' }]}>{index + 1}</Text>
                  </View>
                }
              />
            );
          })}
        </View>
        <View style={styles.stack}>
          {unordered.map((event) => (
            <OptionCard
              key={event.id}
              label={event.text}
              compact
              disabled={feedback !== 'none'}
              onPress={() => setOrderedItems([...orderedItems, event.id])}
              left={<GripVertical size={18} color={colors.textOnParchmentSoft} />}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderMatchPairs = (step: MatchPairsStep) => {
    const pairOrder = Object.keys(matchedPairs);
    const badgeFor = (left: string) => {
      const i = pairOrder.indexOf(left);
      return i === -1 ? null : i + 1;
    };
    const leftOfRight = (right: string) => pairOrder.find((l) => matchedPairs[l] === right) ?? null;
    const isPairCorrect = (left: string) => step.data.pairs.some((p) => p.left === left && p.right === matchedPairs[left]);
    const unpair = (left: string) => {
      const next = { ...matchedPairs };
      delete next[left];
      setMatchedPairs(next);
    };
    const allPaired = pairOrder.length === step.data.pairs.length;
    const statusFor = (left: string | null, base: OptionStatus): OptionStatus => {
      if (feedback === 'none' || !left) return base;
      return isPairCorrect(left) ? 'correct' : 'wrong';
    };
    const badge = (n: number | null) =>
      n === null ? null : (
        <View style={[styles.letter, { backgroundColor: colors.brass, width: 24, height: 24 }]}>
          <Text style={[styles.letterText, { color: '#2B2419', fontSize: 12 }]}>{n}</Text>
        </View>
      );

    return (
      <View style={styles.stack}>
        <View style={styles.columns}>
          <View style={styles.column}>
            {step.data.pairs.map((pair) => {
              const b = badgeFor(pair.left);
              const isSelected = selectedLeft === pair.left;
              const isPaired = b !== null;
              const base: OptionStatus = isSelected ? 'selected' : isPaired ? 'paired' : 'idle';
              return (
                <OptionCard
                  key={pair.left}
                  label={pair.left}
                  compact
                  align="center"
                  status={statusFor(isPaired ? pair.left : null, base)}
                  disabled={feedback !== 'none'}
                  onPress={() => {
                    if (isPaired) {
                      unpair(pair.left);
                      setSelectedLeft(pair.left);
                    } else {
                      setSelectedLeft(isSelected ? null : pair.left);
                    }
                  }}
                  right={badge(b)}
                />
              );
            })}
          </View>
          <View style={styles.column}>
            {shuffledRights.map((right) => {
              const left = leftOfRight(right);
              const b = left ? badgeFor(left) : null;
              const isPaired = b !== null;
              const canReceive = feedback === 'none' && !!selectedLeft && !isPaired;
              const base: OptionStatus = isPaired ? 'paired' : canReceive ? 'receivable' : 'idle';
              return (
                <OptionCard
                  key={right}
                  label={right}
                  compact
                  align="center"
                  status={statusFor(left, base)}
                  disabled={feedback !== 'none' || (!isPaired && !selectedLeft)}
                  onPress={() => {
                    if (isPaired && left) {
                      unpair(left);
                      setSelectedLeft(left);
                    } else if (selectedLeft) {
                      setMatchedPairs({ ...matchedPairs, [selectedLeft]: right });
                      setSelectedLeft(null);
                    }
                  }}
                  right={badge(b)}
                />
              );
            })}
          </View>
        </View>
        {feedback === 'none' ? (
          <Text style={[styles.slotHint, { color: colors.textMuted }]}>
            {allPaired ? t('lesson.matchTapToUnpair') : t('lesson.matchHint')}
          </Text>
        ) : null}
      </View>
    );
  };

  const renderStoryCard = (step: StoryCardStep) => (
    <View style={[styles.storyCard, { backgroundColor: colors.option, borderColor: colors.optionEdge }]}>
      <Text style={[styles.storyTitle, { color: colors.textOnParchment, fontSize: 24 * fontScale }]}>{step.data.title}</Text>
      {battle ? (
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={14} color={colors.brassDark} />
            <Text style={[styles.metaText, { color: colors.textOnParchmentSoft, fontSize: 13 * fontScale }]}>{battle.region}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.brassDark} />
            <Text style={[styles.metaText, { color: colors.textOnParchmentSoft, fontSize: 13 * fontScale }]}>{battle.date}</Text>
          </View>
        </View>
      ) : null}
      <View style={[styles.rule, { backgroundColor: colors.optionEdge }]} />
      <Text style={[styles.storyText, { color: colors.textOnParchment, fontSize: 16 * fontScale }]}>{step.data.narrative}</Text>
      {battle ? (
        <View style={[styles.outcomeBox, { borderColor: colors.brass }]}>
          <Text style={[styles.outcomeLabel, { color: colors.brassDark, fontSize: 11 * fontScale }]}>{t('codex.outcome')}</Text>
          <Text style={[styles.outcomeText, { color: colors.textOnParchment, fontSize: 14 * fontScale }]}>{battle.outcome}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderStep = (step: Step) => {
    switch (step.type) {
      case 'multiChoice':
        return renderMultiChoice(step as MultiChoiceStep);
      case 'mapTap':
        return (
          <MapTap
            step={step as MapTapStep}
            selected={typeof selectedAnswer === 'string' ? selectedAnswer : null}
            feedback={feedback}
            onSelect={(rid) => setSelectedAnswer(rid)}
          />
        );
      case 'orderEvents':
        return renderOrderEvents(step as OrderEventsStep);
      case 'matchPairs':
        return renderMatchPairs(step as MatchPairsStep);
      case 'fillBlank':
        return renderFillBlank(step as FillBlankStep);
      case 'timelineSlider':
        return (
          <TimelineSlider step={step as TimelineSliderStep} value={sliderValue} feedback={feedback} onChange={setSliderValue} />
        );
      case 'twoTruths':
        return renderTwoTruths(step as TwoTruthsStep);
      case 'storyCard':
        return renderStoryCard(step as StoryCardStep);
      default:
        return null;
    }
  };

  if (!lesson || !currentStep || !battle) {
    return (
      <ScreenBackground>
        <View style={[styles.center, { paddingTop: insets.top + 40 }]}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.bodyBold }}>{t('lesson.lessonNotFound')}</Text>
        </View>
      </ScreenBackground>
    );
  }

  const isStory = currentStep.type === 'storyCard';
  const heroHeight = isStory ? 220 : 128;
  const footerSpace = 126 + insets.bottom;

  return (
    <ScreenBackground topography={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={() => {
            if (haptics) tap();
            setShowQuit(true);
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          style={styles.closeBtn}
        >
          <X size={24} color={colors.textSecondary} />
        </Pressable>
        <ProgressBar value={(currentStepIndex + 1) / lesson.steps.length} height={14} style={{ flex: 1 }} />
        {combo >= 2 ? (
          <Animated.View
            style={[
              styles.comboChip,
              { backgroundColor: colors.ember, transform: [{ scale: comboAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
            ]}
          >
            <Flame size={14} color="#fff" fill="#fff" />
            <Text style={styles.comboText}>{t('lesson.combo', { count: combo })}</Text>
          </Animated.View>
        ) : null}
        <Animated.View
          style={[
            styles.hearts,
            { transform: [{ translateX: heartShake.interpolate({ inputRange: [-1, 1], outputRange: [-5, 5] }) }] },
          ]}
        >
          <Heart size={20} color={colors.hearts} fill={colors.hearts} />
          <Text style={[styles.heartsText, { color: colors.hearts }]}>{quizHearts}</Text>
        </Animated.View>
      </View>

      {/* Hero */}
      <View style={[styles.hero, { height: heroHeight }]}>
        {battleImage ? <Image source={battleImage} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} /> : null}
        <LinearGradient
          colors={['rgba(15,20,32,0.05)', 'rgba(15,20,32,0.55)', colors.bg]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroText}>
          <Text style={[styles.heroTitle, { fontSize: (isStory ? 13 : 12) * fontScale }]} numberOfLines={1}>
            {battle.title}
          </Text>
          <Text style={[styles.heroDate, { fontSize: 11 * fontScale }]} numberOfLines={1}>
            {battle.date}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerSpace }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: stepAnim,
            transform: [{ translateX: stepAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}
        >
          <View style={styles.stepMeta}>
            <View style={[styles.typeChip, { borderColor: colors.brass }]}>
              <Text style={[styles.typeText, { color: colors.brass, fontSize: 11 * fontScale }]}>
                {t(`lesson.stepTypes.${currentStep.type}`)}
              </Text>
            </View>
            {!isStory ? (
              <Text style={[styles.counter, { color: colors.textMuted, fontSize: 12 * fontScale }]}>
                {t('lesson.questionOf', questionMeta)}
              </Text>
            ) : null}
          </View>
          {!isStory ? (
            <Text style={[styles.prompt, { color: colors.text, fontSize: 22 * fontScale, lineHeight: 30 * fontScale }]}>
              {currentStep.prompt}
            </Text>
          ) : null}
          {renderStep(currentStep)}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      {feedback === 'none' ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.bg, borderTopColor: colors.surfaceBorder }]}>
          <ChunkyButton
            label={isStory ? t('lesson.continue') : t('lesson.check')}
            variant={isStory ? 'brass' : 'ember'}
            disabled={!canCheck()}
            onPress={isStory ? handleContinue : checkAnswer}
          />
        </View>
      ) : (
        <FeedbackSheet
          kind={feedback}
          title={feedback === 'correct' ? t('lesson.correct') : outOfHearts ? t('lesson.outOfHearts') : t('lesson.wrong')}
          mascotLine={feedback === 'correct' ? mascot?.cheer : mascot?.consolation}
          mascotImage={mascotImage}
          explanation={
            outOfHearts ? t('lesson.outOfHeartsBody') : feedback === 'correct' ? currentStep.feedbackCorrect : currentStep.feedbackWrong
          }
          buttonLabel={outOfHearts ? t('lesson.retreat') : t('lesson.continue')}
          onContinue={handleContinue}
          bottomInset={insets.bottom}
        />
      )}

      <Dialog visible={showQuit} title={t('lesson.quitTitle')} body={t('lesson.quitBody')} onDismiss={() => setShowQuit(false)}>
        <ChunkyButton label={t('lesson.quitCancel')} variant="brass" onPress={() => setShowQuit(false)} />
        <ChunkyButton
          label={t('lesson.quitConfirm')}
          variant="ghost"
          onPress={() => {
            setShowQuit(false);
            goBack();
          }}
        />
      </Dialog>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
    zIndex: 3,
  },
  closeBtn: { padding: 2 },
  hearts: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heartsText: { fontFamily: fonts.bodyBlack, fontSize: 16 },
  comboChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
  },
  comboText: { color: '#fff', fontFamily: fonts.bodyBlack, fontSize: 11 },
  hero: { width: '100%', overflow: 'hidden', justifyContent: 'flex-end' },
  heroText: { paddingHorizontal: 20, paddingBottom: 6 },
  heroTitle: { fontFamily: fonts.display, color: '#F4E8CF', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroDate: { fontFamily: fonts.bodySemi, color: 'rgba(244,232,207,0.7)', marginTop: 2 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  stepMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  typeChip: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, height: 24, justifyContent: 'center' },
  typeText: { fontFamily: fonts.bodyBlack, letterSpacing: 0.6 },
  counter: { fontFamily: fonts.bodyBold, fontVariant: ['tabular-nums'] },
  prompt: { fontFamily: fonts.bodyBlack, marginBottom: 20 },
  stack: { gap: 10 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  letter: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontFamily: fonts.bodyBlack, fontSize: 13 },
  sentenceCard: { borderRadius: radius.md, borderWidth: 2, padding: 16 },
  sentence: { fontFamily: fonts.bodyBold, lineHeight: 28 },
  orderSlot: { borderWidth: 2, borderStyle: 'dashed', borderRadius: radius.md, padding: 8, gap: 8, justifyContent: 'center' },
  slotHint: { fontFamily: fonts.bodySemi, textAlign: 'center', fontSize: 13, paddingVertical: 4 },
  columns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 10 },
  storyCard: { borderRadius: radius.lg, borderWidth: 2, padding: 20, gap: 12 },
  storyTitle: { fontFamily: fonts.display, lineHeight: 30 },
  metaRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fonts.bodyBold },
  rule: { height: 1, opacity: 0.8 },
  storyText: { fontFamily: fonts.body, lineHeight: 25 },
  outcomeBox: { borderLeftWidth: 3, paddingLeft: 12, gap: 2, marginTop: 4 },
  outcomeLabel: { fontFamily: fonts.bodyBlack, letterSpacing: 1, textTransform: 'uppercase' },
  outcomeText: { fontFamily: fonts.bodyBold, lineHeight: 20 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
