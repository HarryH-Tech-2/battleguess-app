import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { X, Check, MapPin, ArrowRight, GripVertical } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getLessonById } from '@/mocks/lessons';
import { getBattleById } from '@/mocks/battles';
import { mascots } from '@/mocks/mascots';
import { Step, MultiChoiceStep, MapTapStep, OrderEventsStep, MatchPairsStep, FillBlankStep, TimelineSliderStep, TwoTruthsStep, StoryCardStep } from '@/types';

const { width } = Dimensions.get('window');

type FeedbackState = 'none' | 'correct' | 'wrong';

const QUIZ_STARTING_HEARTS = 3;

// Local battle images generated with Gemini API (nano-banana)
// Images are stored in assets/images/battles/{battleId}.png
const battleImages: Record<string, any> = {
  'thermopylae': require('@/assets/images/battles/thermopylae.png'),
  'marathon': require('@/assets/images/battles/marathon.png'),
  'hastings': require('@/assets/images/battles/hastings.png'),
  'agincourt': require('@/assets/images/battles/agincourt.png'),
  'waterloo': require('@/assets/images/battles/waterloo.png'),
  'austerlitz': require('@/assets/images/battles/austerlitz.png'),
  'somme': require('@/assets/images/battles/somme.png'),
  'stalingrad': require('@/assets/images/battles/stalingrad.png'),
  'dday': require('@/assets/images/battles/dday.png'),
  'gettysburg': require('@/assets/images/battles/gettysburg.png'),
  'yorktown': require('@/assets/images/battles/yorktown.png'),
  'alamo': require('@/assets/images/battles/alamo.png'),
  'puebla': require('@/assets/images/battles/puebla.png'),
  'ayacucho': require('@/assets/images/battles/ayacucho.png'),
  'gaugamela': require('@/assets/images/battles/gaugamela.png'),
  'sekigahara': require('@/assets/images/battles/sekigahara.png'),
  'red-cliffs': require('@/assets/images/battles/red-cliffs.png'),
  'panipat-first': require('@/assets/images/battles/panipat-first.png'),
  'tsushima': require('@/assets/images/battles/tsushima.png'),
  'midway': require('@/assets/images/battles/midway.png'),
  'zama': require('@/assets/images/battles/zama.png'),
  'el-alamein': require('@/assets/images/battles/el-alamein.png'),
  'isandlwana': require('@/assets/images/battles/isandlwana.png'),
  'adwa': require('@/assets/images/battles/adwa.png'),
  'cannae': require('@/assets/images/battles/cannae.png'),
  'verdun': require('@/assets/images/battles/verdun.png'),
  'kursk': require('@/assets/images/battles/kursk.png'),
  'tours': require('@/assets/images/battles/tours.png'),
  'gallipoli': require('@/assets/images/battles/gallipoli.png'),
  'lepanto': require('@/assets/images/battles/lepanto.png'),
  'borodino': require('@/assets/images/battles/borodino.png'),
  'trafalgar': require('@/assets/images/battles/trafalgar.png'),
  'vienna-1683': require('@/assets/images/battles/vienna-1683.png'),
  'plassey': require('@/assets/images/battles/plassey.png'),
  'singapore': require('@/assets/images/battles/singapore.png'),
  'dien-bien-phu': require('@/assets/images/battles/dien-bien-phu.png'),
  'changping': require('@/assets/images/battles/changping.png'),
  'omdurman': require('@/assets/images/battles/omdurman.png'),
  'carthage-destruction': require('@/assets/images/battles/carthage-destruction.png'),
  'tobruk': require('@/assets/images/battles/tobruk.png'),
  'saratoga': require('@/assets/images/battles/saratoga.png'),
  'chacabuco': require('@/assets/images/battles/chacabuco.png'),
  'new-orleans': require('@/assets/images/battles/new-orleans.png'),
  'boyaca': require('@/assets/images/battles/boyaca.png'),
  'rorkes-drift': require('@/assets/images/battles/rorkes-drift.png'),
  'iwo-jima': require('@/assets/images/battles/iwo-jima.png'),
  'marne': require('@/assets/images/battles/marne.png'),
  'passchendaele': require('@/assets/images/battles/passchendaele.png'),
  'bulge': require('@/assets/images/battles/bulge.png'),
  'buena-vista': require('@/assets/images/battles/buena-vista.png'),
  'talas': require('@/assets/images/battles/talas.png'),
  'constantinople-1453': require('@/assets/images/battles/constantinople-1453.png'),
  'nagashino': require('@/assets/images/battles/nagashino.png'),
  'myeongnyang': require('@/assets/images/battles/myeongnyang.png'),
  'kohima': require('@/assets/images/battles/kohima.png'),
  'bach-dang': require('@/assets/images/battles/bach-dang.png'),
  'panipat-third': require('@/assets/images/battles/panipat-third.png'),
  'pyramids': require('@/assets/images/battles/pyramids.png'),
  'khartoum': require('@/assets/images/battles/khartoum.png'),
  'tangier': require('@/assets/images/battles/tangier.png'),
  'kairouan': require('@/assets/images/battles/kairouan.png'),
  'tenochtitlan': require('@/assets/images/battles/tenochtitlan.png'),
  'cajamarca': require('@/assets/images/battles/cajamarca.png'),
  'san-juan-hill': require('@/assets/images/battles/san-juan-hill.png'),
  'falklands': require('@/assets/images/battles/falklands.png'),
  'chapultepec': require('@/assets/images/battles/chapultepec.png'),
  'carabobo': require('@/assets/images/battles/carabobo.png'),
};

const getBattleImage = (battleId: string): any => {
  return battleImages[battleId] || null;
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress } = useUserProgress();
  const { colors } = useSettings();

  const lesson = getLessonById(id || '');
  const battle = lesson ? getBattleById(lesson.battleId) : null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | string[] | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  // Per-quiz hearts - start with 3 for each quiz
  const [quizHearts, setQuizHearts] = useState(QUIZ_STARTING_HEARTS);

  // Battle image (local file)
  const battleImage = battle ? getBattleImage(battle.id) : null;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const feedbackSlideAnim = useRef(new Animated.Value(100)).current;
  const mascotAnim = useRef(new Animated.Value(0)).current;
  const mascotBounceAnim = useRef(new Animated.Value(0)).current;
  const sliderWidthRef = useRef(0);

  const mascot = mascots.find(m => m.id === progress.selectedMascotId);

  const styles = createStyles(colors);

  useEffect(() => {
    if (lesson) {
      Animated.timing(progressAnim, {
        toValue: (currentStepIndex + 1) / lesson.steps.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStepIndex, lesson, progressAnim]);


  const currentStep = lesson?.steps[currentStepIndex];

  const resetStepState = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback('none');
    setOrderedItems([]);
    setMatchedPairs({});
    setSelectedLeft(null);
    setSliderValue(null);
    feedbackSlideAnim.setValue(100);
  }, [feedbackSlideAnim]);

  const [outOfHearts, setOutOfHearts] = useState(false);

  const showFeedback = useCallback((isCorrect: boolean) => {
    setFeedback(isCorrect ? 'correct' : 'wrong');

    mascotAnim.setValue(0);
    mascotBounceAnim.setValue(0);

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrectCount(prev => prev + 1);

      Animated.parallel([
        Animated.spring(mascotAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }),
        Animated.sequence([
          Animated.timing(mascotBounceAnim, { toValue: -15, duration: 150, useNativeDriver: true }),
          Animated.timing(mascotBounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(mascotBounceAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(mascotBounceAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Lose a quiz heart (per-quiz, not global)
      setQuizHearts(prev => prev - 1);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]),
        Animated.spring(mascotAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }),
        Animated.sequence([
          Animated.timing(mascotBounceAnim, { toValue: -8, duration: 100, useNativeDriver: true }),
          Animated.timing(mascotBounceAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]),
      ]).start();

      if (quizHearts <= 1) {
        setOutOfHearts(true);
      }
    }

    Animated.spring(feedbackSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [shakeAnim, feedbackSlideAnim, mascotAnim, mascotBounceAnim, quizHearts]);

  const checkAnswer = useCallback(() => {
    if (!currentStep) return;

    let isCorrect = false;

    switch (currentStep.type) {
      case 'multiChoice': {
        const step = currentStep as MultiChoiceStep;
        isCorrect = selectedAnswer === step.data.correctIndex;
        break;
      }
      case 'mapTap': {
        const step = currentStep as MapTapStep;
        isCorrect = selectedAnswer === step.data.correctRegionId;
        break;
      }
      case 'orderEvents': {
        const step = currentStep as OrderEventsStep;
        const correctOrder = [...step.data.events].sort((a, b) => a.order - b.order).map(e => e.id);
        isCorrect = JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
        break;
      }
      case 'matchPairs': {
        const step = currentStep as MatchPairsStep;
        isCorrect = step.data.pairs.every(p => matchedPairs[p.left] === p.right);
        break;
      }
      case 'fillBlank': {
        const step = currentStep as FillBlankStep;
        isCorrect = selectedAnswer === step.data.blankWord;
        break;
      }
      case 'timelineSlider': {
        const step = currentStep as TimelineSliderStep;
        const minYear = Number(step.data.minYear);
        const maxYear = Number(step.data.maxYear);
        const correctYear = Number(step.data.correctYear);
        const tolerance = Number(step.data.tolerance);
        const currentSliderValue = sliderValue === null ? Math.round((minYear + maxYear) / 2) : sliderValue;
        isCorrect = Math.abs(currentSliderValue - correctYear) <= tolerance;
        break;
      }
      case 'twoTruths': {
        const step = currentStep as TwoTruthsStep;
        const lieIndex = step.data.statements.findIndex(s => s.isLie);
        isCorrect = selectedAnswer === lieIndex;
        break;
      }
      case 'storyCard':
        isCorrect = true;
        break;
    }

    showFeedback(isCorrect);
  }, [currentStep, selectedAnswer, orderedItems, matchedPairs, sliderValue, showFeedback]);

  const handleContinue = useCallback(() => {
    if (!lesson) return;

    if (outOfHearts) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.replace('/(tabs)/(home)/learn');
      return;
    }

    if (currentStepIndex < lesson.steps.length - 1) {
      resetStepState();
      setCurrentStepIndex(prev => prev + 1);
    } else {
      const totalSteps = lesson.steps.filter(s => s.type !== 'storyCard').length;
      router.replace({
        pathname: '/lesson-complete',
        params: {
          lessonId: lesson.id,
          correctAnswers: correctCount.toString(),
          totalSteps: totalSteps.toString(),
          xpReward: lesson.xpReward.toString(),
        },
      });
    }
  }, [lesson, currentStepIndex, correctCount, resetStepState, router, outOfHearts]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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
      case 'timelineSlider':
        return true;
      case 'storyCard':
        return true;
    }
  }, [currentStep, selectedAnswer, orderedItems, matchedPairs]);

  const renderBattleImage = () => {
    if (!battle || !battleImage) return null;

    return (
      <Image
        source={battleImage}
        style={styles.battleImage}
        contentFit="cover"
      />
    );
  };

  const renderMultiChoice = (step: MultiChoiceStep) => (
    <View style={styles.optionsContainer}>
      {step.data.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.optionButtonSelected,
            feedback === 'correct' && selectedAnswer === index && styles.optionButtonCorrect,
            feedback === 'wrong' && selectedAnswer === index && styles.optionButtonWrong,
            feedback !== 'none' && index === step.data.correctIndex && styles.optionButtonCorrect,
          ]}
          onPress={() => {
            if (feedback === 'none') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedAnswer(index);
            }
          }}
          disabled={feedback !== 'none'}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.optionText,
            selectedAnswer === index && styles.optionTextSelected,
            feedback !== 'none' && index === step.data.correctIndex && styles.optionTextCorrect,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      {renderBattleImage()}
    </View>
  );

  const renderMapTap = (step: MapTapStep) => (
    <View style={styles.mapContainer}>
      <View style={styles.mapGrid}>
        {step.data.regions.map((region) => (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.regionButton,
              selectedAnswer === region.id && styles.regionButtonSelected,
              feedback === 'correct' && selectedAnswer === region.id && styles.regionButtonCorrect,
              feedback === 'wrong' && selectedAnswer === region.id && styles.regionButtonWrong,
              feedback !== 'none' && region.id === step.data.correctRegionId && styles.regionButtonCorrect,
            ]}
            onPress={() => {
              if (feedback === 'none') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAnswer(region.id);
              }
            }}
            disabled={feedback !== 'none'}
            activeOpacity={0.7}
          >
            <MapPin size={24} color={
              selectedAnswer === region.id ? colors.textInverse :
              feedback !== 'none' && region.id === step.data.correctRegionId ? colors.textInverse :
              colors.primary
            } />
            <Text style={[
              styles.regionText,
              (selectedAnswer === region.id || (feedback !== 'none' && region.id === step.data.correctRegionId)) && styles.regionTextSelected,
            ]}>
              {region.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderBattleImage()}
    </View>
  );

  const renderOrderEvents = (step: OrderEventsStep) => {
    const unordered = step.data.events.filter(e => !orderedItems.includes(e.id));

    return (
      <View style={styles.orderContainer}>
        <View style={styles.orderedList}>
          {orderedItems.map((itemId, index) => {
            const event = step.data.events.find(e => e.id === itemId);
            return (
              <TouchableOpacity
                key={itemId}
                style={styles.orderedItem}
                onPress={() => {
                  if (feedback === 'none') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setOrderedItems(orderedItems.filter(id => id !== itemId));
                  }
                }}
                disabled={feedback !== 'none'}
              >
                <View style={styles.orderNumber}>
                  <Text style={styles.orderNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.orderedItemText}>{event?.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.unorderedList}>
          {unordered.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.unorderedItem}
              onPress={() => {
                if (feedback === 'none') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setOrderedItems([...orderedItems, event.id]);
                }
              }}
              disabled={feedback !== 'none'}
            >
              <GripVertical size={16} color={colors.textSecondary} />
              <Text style={styles.unorderedItemText}>{event.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderBattleImage()}
      </View>
    );
  };

  const renderMatchPairs = (step: MatchPairsStep) => (
    <View style={styles.matchContainer}>
      <View style={styles.matchColumn}>
        {step.data.pairs.map((pair) => (
          <TouchableOpacity
            key={pair.left}
            style={[
              styles.matchItem,
              selectedLeft === pair.left && styles.matchItemSelected,
              matchedPairs[pair.left] && styles.matchItemMatched,
            ]}
            onPress={() => {
              if (feedback === 'none' && !matchedPairs[pair.left]) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedLeft(pair.left);
              }
            }}
            disabled={feedback !== 'none' || !!matchedPairs[pair.left]}
          >
            <Text style={[
              styles.matchItemText,
              (selectedLeft === pair.left || matchedPairs[pair.left]) && styles.matchItemTextSelected,
            ]}>
              {pair.left}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.matchColumn}>
        {step.data.pairs.map((pair) => {
          const isMatched = Object.values(matchedPairs).includes(pair.right);
          return (
            <TouchableOpacity
              key={pair.right}
              style={[
                styles.matchItem,
                isMatched && styles.matchItemMatched,
              ]}
              onPress={() => {
                if (feedback === 'none' && selectedLeft && !isMatched) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMatchedPairs({ ...matchedPairs, [selectedLeft]: pair.right });
                  setSelectedLeft(null);
                }
              }}
              disabled={feedback !== 'none' || isMatched || !selectedLeft}
            >
              <Text style={[
                styles.matchItemText,
                isMatched && styles.matchItemTextSelected,
              ]}>
                {pair.right}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderFillBlank = (step: FillBlankStep) => (
    <View style={styles.fillBlankContainer}>
      <Text style={styles.fillBlankSentence}>
        {step.data.sentence.replace('_____', selectedAnswer as string || '_____')}
      </Text>
      <View style={styles.fillBlankOptions}>
        {step.data.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.fillBlankOption,
              selectedAnswer === option && styles.fillBlankOptionSelected,
              feedback === 'correct' && selectedAnswer === option && styles.fillBlankOptionCorrect,
              feedback === 'wrong' && selectedAnswer === option && styles.fillBlankOptionWrong,
              feedback !== 'none' && option === step.data.blankWord && styles.fillBlankOptionCorrect,
            ]}
            onPress={() => {
              if (feedback === 'none') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAnswer(option);
              }
            }}
            disabled={feedback !== 'none'}
          >
            <Text style={[
              styles.fillBlankOptionText,
              (selectedAnswer === option || (feedback !== 'none' && option === step.data.blankWord)) && styles.fillBlankOptionTextSelected,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderBattleImage()}
    </View>
  );

  const renderTimelineSlider = (step: TimelineSliderStep) => {
    const minYear = Number(step.data.minYear);
    const maxYear = Number(step.data.maxYear);
    const range = maxYear - minYear;
    const currentValue = sliderValue === null ? Math.round((minYear + maxYear) / 2) : sliderValue;

    let displayYear: string;
    if (minYear < 0 || maxYear < 0) {
      displayYear = currentValue < 0
        ? `${Math.abs(currentValue)} BC`
        : `${currentValue} AD`;
    } else {
      displayYear = currentValue.toString();
    }

    const handleSliderTouch = (locationX: number) => {
      if (feedback !== 'none') return;
      const trackWidth = sliderWidthRef.current || 300;
      const percent = Math.max(0, Math.min(1, locationX / trackWidth));
      const year = Math.round(minYear + percent * range);
      setSliderValue(Math.max(minYear, Math.min(maxYear, year)));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSliderMove = (locationX: number) => {
      if (feedback !== 'none') return;
      const trackWidth = sliderWidthRef.current || 300;
      const percent = Math.max(0, Math.min(1, locationX / trackWidth));
      const newYear = Math.round(minYear + percent * range);

      if (newYear !== currentValue) {
        setSliderValue(Math.max(minYear, Math.min(maxYear, newYear)));
        Haptics.selectionAsync();
      }
    };

    const onSliderLayout = (e: LayoutChangeEvent) => {
      sliderWidthRef.current = e.nativeEvent.layout.width;
    };

    const fillPercent = ((currentValue - minYear) / range) * 100;

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineYear}>
          {displayYear}
        </Text>
        <View
          style={styles.sliderContainer}
          onLayout={onSliderLayout}
          onStartShouldSetResponder={() => feedback === 'none'}
          onMoveShouldSetResponder={() => feedback === 'none'}
          onResponderGrant={(e) => handleSliderTouch(e.nativeEvent.locationX)}
          onResponderMove={(e) => handleSliderMove(e.nativeEvent.locationX)}
          onResponderRelease={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${fillPercent}%` }]} />
            <View
              style={[
                styles.sliderThumb,
                { left: `${fillPercent}%` }
              ]}
            />
          </View>
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>
            {minYear < 0 ? `${Math.abs(minYear)} BC` : minYear}
          </Text>
          <Text style={styles.sliderLabel}>
            {maxYear < 0 ? `${Math.abs(maxYear)} BC` : maxYear}
          </Text>
        </View>
        <View style={styles.sliderHint}>
          <Text style={styles.sliderHintText}>Drag to select the year</Text>
        </View>
        {renderBattleImage()}
      </View>
    );
  };

  const renderTwoTruths = (step: TwoTruthsStep) => (
    <View style={styles.optionsContainer}>
      {step.data.statements.map((statement, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.optionButtonSelected,
            feedback === 'correct' && selectedAnswer === index && styles.optionButtonCorrect,
            feedback === 'wrong' && selectedAnswer === index && styles.optionButtonWrong,
            feedback !== 'none' && statement.isLie && styles.optionButtonCorrect,
          ]}
          onPress={() => {
            if (feedback === 'none') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedAnswer(index);
            }
          }}
          disabled={feedback !== 'none'}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.optionText,
            selectedAnswer === index && styles.optionTextSelected,
            feedback !== 'none' && statement.isLie && styles.optionTextCorrect,
          ]}>
            {statement.text}
          </Text>
        </TouchableOpacity>
      ))}
      {renderBattleImage()}
    </View>
  );

  const renderStoryCard = (step: StoryCardStep) => (
    <View style={styles.storyContainer}>
      {battleImage && (
        <Image
          source={battleImage}
          style={styles.storyBattleImage}
          contentFit="cover"
        />
      )}
      <View style={styles.storyCard}>
        <Text style={styles.storyTitle}>{step.data.title}</Text>
        <Text style={styles.storyNarrative}>{step.data.narrative}</Text>
        {battle && (
          <>
            <View style={styles.storyIconContainer}>
              <View style={styles.storyIconCircle}>
                <Text style={styles.storyIconText}>⚔️</Text>
              </View>
            </View>
            <View style={styles.storyMeta}>
              <Text style={styles.storyMetaText}>📍 {battle.region}</Text>
              <Text style={styles.storyMetaText}>📅 {battle.date}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const renderStep = (step: Step) => {
    switch (step.type) {
      case 'multiChoice':
        return renderMultiChoice(step as MultiChoiceStep);
      case 'mapTap':
        return renderMapTap(step as MapTapStep);
      case 'orderEvents':
        return renderOrderEvents(step as OrderEventsStep);
      case 'matchPairs':
        return renderMatchPairs(step as MatchPairsStep);
      case 'fillBlank':
        return renderFillBlank(step as FillBlankStep);
      case 'timelineSlider':
        return renderTimelineSlider(step as TimelineSliderStep);
      case 'twoTruths':
        return renderTwoTruths(step as TwoTruthsStep);
      case 'storyCard':
        return renderStoryCard(step as StoryCardStep);
      default:
        return null;
    }
  };

  if (!lesson || !currentStep) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })}
            ]}
          />
        </View>
        <View style={styles.heartsContainer}>
          <Text style={styles.heartsIcon}>❤️</Text>
          <Text style={styles.heartsText}>{quizHearts}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { transform: [{ translateX: shakeAnim }] }
          ]}
        >
          {currentStep.type !== 'storyCard' && (
            <Text style={styles.prompt}>{currentStep.prompt}</Text>
          )}
          {renderStep(currentStep)}
        </Animated.View>
      </ScrollView>

      {feedback !== 'none' && mascot && (
        <Animated.View
          style={[
            styles.mascotCelebration,
            {
              opacity: mascotAnim,
              transform: [
                { scale: mascotAnim },
                { translateY: mascotBounceAnim },
              ]
            }
          ]}
        >
          <View style={[styles.mascotBubble, feedback === 'wrong' && styles.mascotBubbleWrong]}>
            <Image
              source={{ uri: mascot.avatar }}
              style={styles.mascotAvatarImage}
              contentFit="cover"
            />
          </View>
          <View style={[styles.cheerBubble, feedback === 'wrong' && styles.cheerBubbleWrong]}>
            <Text style={styles.cheerText}>
              {feedback === 'correct' ? 'Great job!' : outOfHearts ? 'Try again!' : 'Keep going!'}
            </Text>
          </View>
        </Animated.View>
      )}

      <View style={styles.footer}>
        {feedback !== 'none' && (
          <View style={[
            styles.feedbackInline,
            feedback === 'correct' ? styles.feedbackInlineCorrect : styles.feedbackInlineWrong,
          ]}>
            <View style={styles.feedbackHeader}>
              {feedback === 'correct' ? (
                <Check size={20} color={colors.success} />
              ) : (
                <X size={20} color={colors.error} />
              )}
              <Text style={[
                styles.feedbackTitle,
                feedback === 'correct' ? styles.feedbackTitleCorrect : styles.feedbackTitleWrong,
              ]}>
                {feedback === 'correct' ? 'Correct!' : 'Not quite'}
              </Text>
            </View>
            <Text style={styles.feedbackText} numberOfLines={2}>
              {outOfHearts
                ? "You're out of hearts!"
                : (feedback === 'correct' ? currentStep.feedbackCorrect : currentStep.feedbackWrong)}
            </Text>
          </View>
        )}

        {feedback === 'none' ? (
          <TouchableOpacity
            style={[
              styles.checkButton,
              !canCheck() && styles.checkButtonDisabled,
            ]}
            onPress={currentStep.type === 'storyCard' ? handleContinue : checkAnswer}
            disabled={!canCheck()}
            activeOpacity={0.8}
          >
            <Text style={styles.checkButtonText}>
              {currentStep.type === 'storyCard' ? 'Continue' : 'Check'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.continueButton,
              feedback === 'correct' ? styles.continueButtonCorrect : styles.continueButtonWrong,
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight size={20} color={colors.textInverse} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeButton: {
    padding: 4,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: colors.pathLine,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 6,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartsIcon: {
    fontSize: 18,
  },
  heartsText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.hearts,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  prompt: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 24,
    lineHeight: 32,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  optionButtonCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  optionButtonWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  optionTextCorrect: {
    color: colors.success,
    fontWeight: '600' as const,
  },
  battleImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop: 20,
  },
  mapContainer: {
    flex: 1,
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  regionButton: {
    width: (width - 64) / 2,
    aspectRatio: 1.5,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  regionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  regionButtonCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  regionButtonWrong: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  regionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  regionTextSelected: {
    color: colors.textInverse,
  },
  orderContainer: {
    flex: 1,
    gap: 20,
  },
  orderedList: {
    gap: 8,
    minHeight: 100,
  },
  orderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  orderNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.textInverse,
  },
  orderedItemText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  unorderedList: {
    gap: 8,
  },
  unorderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  unorderedItemText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  matchContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  matchColumn: {
    flex: 1,
    gap: 12,
  },
  matchItem: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  matchItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  matchItemMatched: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  matchItemText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    textAlign: 'center',
  },
  matchItemTextSelected: {
    color: colors.success,
    fontWeight: '600' as const,
  },
  fillBlankContainer: {
    gap: 24,
  },
  fillBlankSentence: {
    fontSize: 20,
    color: colors.text,
    lineHeight: 30,
    textAlign: 'center',
  },
  fillBlankOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  fillBlankOption: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  fillBlankOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  fillBlankOptionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  fillBlankOptionWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  fillBlankOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  fillBlankOptionTextSelected: {
    color: colors.success,
    fontWeight: '600' as const,
  },
  timelineContainer: {
    alignItems: 'center',
    gap: 24,
    paddingTop: 20,
  },
  timelineYear: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  sliderContainer: {
    width: '100%',
    height: 70,
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  sliderTrack: {
    position: 'absolute',
    top: 24,
    left: 14,
    right: 14,
    height: 16,
    backgroundColor: colors.pathLine,
    borderRadius: 8,
    overflow: 'visible',
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: colors.primary + '40',
    borderRadius: 8,
  },
  sliderThumb: {
    position: 'absolute',
    top: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    marginLeft: -20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 4,
    borderColor: colors.textInverse,
  },
  sliderHint: {
    marginTop: 8,
    alignItems: 'center',
  },
  sliderHintText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  storyBattleImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  storyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  storyNarrative: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  storyIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  storyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.textInverse,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyIconText: {
    fontSize: 24,
  },
  storyMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mascotCelebration: {
    position: 'absolute',
    right: 16,
    top: 70,
    alignItems: 'center',
    zIndex: 100,
  },
  mascotBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  mascotBubbleWrong: {
    borderColor: colors.error,
  },
  mascotAvatarImage: {
    width: '100%',
    height: '100%',
  },
  cheerBubble: {
    backgroundColor: colors.success,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cheerBubbleWrong: {
    backgroundColor: colors.error,
  },
  cheerText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.textInverse,
  },
  footer: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  feedbackInline: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  feedbackInlineCorrect: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  feedbackInlineWrong: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  feedbackTitleCorrect: {
    color: colors.success,
  },
  feedbackTitleWrong: {
    color: colors.error,
  },
  feedbackText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
  },
  checkButtonDisabled: {
    backgroundColor: colors.pathLine,
    shadowOpacity: 0,
    borderBottomColor: '#A8A29E',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textInverse,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
  },
  continueButtonCorrect: {
    backgroundColor: colors.success,
    shadowColor: '#16A34A',
    borderBottomColor: '#16A34A',
  },
  continueButtonWrong: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    borderBottomColor: colors.primaryDark,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textInverse,
  },
});
