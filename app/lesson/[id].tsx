import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { X, Check, MapPin, ArrowRight, GripVertical } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getLessonById } from '@/mocks/lessons';
import { getBattleById } from '@/mocks/battles';
import { mascots } from '@/mocks/mascots';
import { Step, MultiChoiceStep, MapTapStep, OrderEventsStep, MatchPairsStep, FillBlankStep, TimelineSliderStep, TwoTruthsStep, StoryCardStep } from '@/types';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

type FeedbackState = 'none' | 'correct' | 'wrong';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loseHeart, progress } = useUserProgress();
  
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
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const feedbackSlideAnim = useRef(new Animated.Value(100)).current;
  const mascotAnim = useRef(new Animated.Value(0)).current;
  const mascotBounceAnim = useRef(new Animated.Value(0)).current;
  const sliderWidthRef = useRef(0);
  
  const mascot = mascots.find(m => m.id === progress.selectedMascotId);

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
      loseHeart();
      
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
      
      if (progress.hearts <= 1) {
        setOutOfHearts(true);
      }
    }

    Animated.spring(feedbackSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [loseHeart, shakeAnim, feedbackSlideAnim, mascotAnim, mascotBounceAnim, progress.hearts]);

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
      router.replace('/home');
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
              selectedAnswer === region.id ? Colors.textInverse :
              feedback !== 'none' && region.id === step.data.correctRegionId ? Colors.textInverse :
              Colors.primary
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
              <GripVertical size={16} color={Colors.textSecondary} />
              <Text style={styles.unorderedItemText}>{event.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    </View>
  );

  const getMapUrl = (lat: number, lng: number) => {
    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-l+FF6B35(${lng},${lat})/${lng},${lat},5,0/360x180@2x?access_token=REDACTED_MAPBOX_TOKEN`;
  };

  const renderStoryCard = (step: StoryCardStep) => (
    <View style={styles.storyContainer}>
      <View style={styles.storyCard}>
        <Text style={styles.storyTitle}>{step.data.title}</Text>
        <Text style={styles.storyNarrative}>{step.data.narrative}</Text>
        {battle && (
          <>
            <View style={styles.storyMapContainer}>
              <Image
                source={{ uri: getMapUrl(battle.lat, battle.lng) }}
                style={styles.storyMap}
                contentFit="cover"
              />
              <View style={styles.storyMapPin}>
                <Text style={styles.storyMapPinIcon}>⚔️</Text>
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
          <X size={24} color={Colors.textSecondary} />
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
          <Text style={styles.heartsText}>{progress.hearts}</Text>
        </View>
      </View>

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

      <Animated.View 
        style={[
          styles.feedbackPanel,
          { transform: [{ translateY: feedbackSlideAnim }] },
          feedback === 'correct' && styles.feedbackPanelCorrect,
          feedback === 'wrong' && styles.feedbackPanelWrong,
        ]}
      >
        {feedback !== 'none' && (
          <>
            <View style={styles.feedbackHeader}>
              {feedback === 'correct' ? (
                <Check size={24} color={Colors.success} />
              ) : (
                <X size={24} color={Colors.error} />
              )}
              <Text style={[
                styles.feedbackTitle,
                feedback === 'correct' ? styles.feedbackTitleCorrect : styles.feedbackTitleWrong,
              ]}>
                {feedback === 'correct' ? 'Correct!' : 'Not quite'}
              </Text>
            </View>
            <Text style={styles.feedbackText}>
              {outOfHearts 
                ? "You're out of hearts! Tap continue to restart this lesson."
                : (feedback === 'correct' ? currentStep.feedbackCorrect : currentStep.feedbackWrong)}
            </Text>
          </>
        )}
      </Animated.View>

      <View style={styles.footer}>
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
            <ArrowRight size={20} color={Colors.textInverse} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.pathLine,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
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
    color: Colors.hearts,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  prompt: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 24,
    lineHeight: 32,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    padding: 16,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  optionButtonCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  optionButtonWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  optionTextCorrect: {
    color: Colors.success,
    fontWeight: '600' as const,
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
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  regionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  regionButtonCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  regionButtonWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.error,
  },
  regionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  regionTextSelected: {
    color: Colors.textInverse,
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
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  orderNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  orderedItemText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  unorderedList: {
    gap: 8,
  },
  unorderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  unorderedItemText: {
    fontSize: 14,
    color: Colors.text,
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
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  matchItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  matchItemMatched: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  matchItemText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  matchItemTextSelected: {
    color: Colors.success,
    fontWeight: '600' as const,
  },
  fillBlankContainer: {
    gap: 24,
  },
  fillBlankSentence: {
    fontSize: 20,
    color: Colors.text,
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
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  fillBlankOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  fillBlankOptionCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  fillBlankOptionWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  fillBlankOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  fillBlankOptionTextSelected: {
    color: Colors.success,
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
    color: Colors.primary,
  },
  sliderContainer: {
    width: '100%',
    height: 50,
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  sliderTrack: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: Colors.pathLine,
    borderRadius: 6,
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.primary + '40',
    borderRadius: 6,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    marginLeft: -14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 3,
    borderColor: Colors.textInverse,
  },
  sliderHint: {
    marginTop: 8,
    alignItems: 'center',
  },
  sliderHintText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  storyCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  storyNarrative: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  storyMapContainer: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  storyMap: {
    width: '100%',
    height: '100%',
  },
  storyMapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.textInverse,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyMapPinIcon: {
    fontSize: 18,
  },
  storyMetaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  feedbackPanel: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 20,
    minHeight: 100,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.cardBorder,
  },
  feedbackPanelCorrect: {
    borderTopColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  feedbackPanelWrong: {
    borderTopColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  feedbackTitleCorrect: {
    color: Colors.success,
  },
  feedbackTitleWrong: {
    color: Colors.error,
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  mascotCelebration: {
    position: 'absolute',
    right: 20,
    top: 80,
    alignItems: 'center',
    zIndex: 100,
  },
  mascotBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  mascotBubbleWrong: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
  },
  mascotAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  cheerBubble: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  cheerBubbleWrong: {
    backgroundColor: Colors.primary,
  },
  cheerText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  footer: {
    padding: 20,
    paddingBottom: 24,
  },
  checkButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
  },
  checkButtonDisabled: {
    backgroundColor: Colors.pathLine,
    shadowOpacity: 0,
    borderBottomColor: '#A8A29E',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textInverse,
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
    backgroundColor: Colors.success,
    shadowColor: '#16A34A',
    borderBottomColor: '#16A34A',
  },
  continueButtonWrong: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primaryDark,
    borderBottomColor: Colors.primaryDark,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
});
