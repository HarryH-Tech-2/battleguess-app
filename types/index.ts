export type Era = 'ancient' | 'medieval' | 'napoleonic' | 'ww1' | 'ww2' | 'modern';

export type Continent = 'europe' | 'asia' | 'africa' | 'americas' | 'all';

export type Interest = 'Ancient' | 'Medieval' | 'Modern' | 'Random';

export type DailyGoal = 5 | 10 | 15;

export type KnowledgeLevel = 'nothing' | 'some' | 'lots';

export interface Mascot {
  id: string;
  name: string;
  avatar: string;
  description: string;
  gender: 'male' | 'female';
  dates: string;
  dob: string;
  dod: string;
  causeOfDeath: string;
}

export interface Battle {
  id: string;
  title: string;
  date: string;
  year: number;
  era: Era;
  continent: Continent;
  region: string;
  conflict: string;
  lat: number;
  lng: number;
  sides: {
    aName: string;
    bName: string;
  };
  commanders: {
    a: string[];
    b: string[];
  };
  outcome: string;
  shortSummary: string;
  whyItMatters: string[];
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  facts: string[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  themeTag: Era;
  continent: Continent;
  orderIndex: number;
  lessonIds: string[];
  icon: string;
}

export type StepType = 
  | 'mapTap' 
  | 'multiChoice' 
  | 'orderEvents' 
  | 'matchPairs' 
  | 'fillBlank' 
  | 'timelineSlider' 
  | 'twoTruths' 
  | 'nameBattle' 
  | 'storyCard';

export interface BaseStep {
  id: string;
  type: StepType;
  prompt: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface MapTapStep extends BaseStep {
  type: 'mapTap';
  data: {
    regions: { id: string; name: string; lat: number; lng: number }[];
    correctRegionId: string;
  };
}

export interface MultiChoiceStep extends BaseStep {
  type: 'multiChoice';
  data: {
    options: string[];
    correctIndex: number;
  };
}

export interface OrderEventsStep extends BaseStep {
  type: 'orderEvents';
  data: {
    events: { id: string; text: string; order: number }[];
  };
}

export interface MatchPairsStep extends BaseStep {
  type: 'matchPairs';
  data: {
    pairs: { left: string; right: string }[];
  };
}

export interface FillBlankStep extends BaseStep {
  type: 'fillBlank';
  data: {
    sentence: string;
    blankWord: string;
    options: string[];
  };
}

export interface TimelineSliderStep extends BaseStep {
  type: 'timelineSlider';
  data: {
    correctYear: number;
    minYear: number;
    maxYear: number;
    tolerance: number;
  };
}

export interface TwoTruthsStep extends BaseStep {
  type: 'twoTruths';
  data: {
    statements: { text: string; isLie: boolean }[];
  };
}

export interface NameBattleStep extends BaseStep {
  type: 'nameBattle';
  data: {
    correctName: string;
    hints: string[];
    acceptableAnswers: string[];
  };
}

export interface StoryCardStep extends BaseStep {
  type: 'storyCard';
  data: {
    title: string;
    narrative: string;
    imageUrl?: string;
    battleId: string;
  };
}

export type Step = 
  | MapTapStep 
  | MultiChoiceStep 
  | OrderEventsStep 
  | MatchPairsStep 
  | FillBlankStep 
  | TimelineSliderStep 
  | TwoTruthsStep 
  | NameBattleStep 
  | StoryCardStep;

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  orderIndex: number;
  estimatedMinutes: number;
  steps: Step[];
  battleId: string;
  xpReward: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  unlockedAt?: string;
}

export interface QuestionAttempt {
  id: string;
  lessonId: string;
  stepId: string;
  stepType: StepType;
  battleId: string;
  battleTitle: string;
  prompt: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface UserProgress {
  completedLessons: string[];
  masteryLevels: Record<string, number>;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  totalXp: number;
  dailyXp: number;
  dailyXpDate: string;
  hearts: number;
  lastHeartRefill: string;
  wrongAnswers: Record<string, number>;
  badges: string[];
  selectedMascotId: string;
  dailyGoal: DailyGoal;
  interests: Interest[];
  knowledgeLevel: KnowledgeLevel;
  hasCompletedOnboarding: boolean;
  questionAttempts: QuestionAttempt[];
}

export interface LessonAttempt {
  lessonId: string;
  correctAnswers: number;
  totalSteps: number;
  xpEarned: number;
  isPerfect: boolean;
}
