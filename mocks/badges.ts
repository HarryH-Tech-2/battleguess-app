import { Badge } from '@/types';

export const badges: Badge[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    requirement: 'complete_1_lesson',
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 'streak_3',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    requirement: 'streak_7',
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    requirement: 'streak_30',
  },
  {
    id: 'ancient-starter',
    title: 'Ancient Scholar',
    description: 'Complete all Ancient lessons',
    icon: '🏛️',
    requirement: 'complete_unit_ancient',
  },
  {
    id: 'medieval-starter',
    title: 'Knight Scholar',
    description: 'Complete all Medieval lessons',
    icon: '⚔️',
    requirement: 'complete_unit_medieval',
  },
  {
    id: 'napoleonic-starter',
    title: 'Emperor\'s Student',
    description: 'Complete all Napoleonic lessons',
    icon: '👑',
    requirement: 'complete_unit_napoleonic',
  },
  {
    id: 'ww1-starter',
    title: 'Trench Expert',
    description: 'Complete all WWI lessons',
    icon: '💣',
    requirement: 'complete_unit_ww1',
  },
  {
    id: 'ww2-starter',
    title: 'WWII Historian',
    description: 'Complete all WWII lessons',
    icon: '✈️',
    requirement: 'complete_unit_ww2',
  },
  {
    id: 'perfect-lesson',
    title: 'Perfectionist',
    description: 'Complete a lesson with no mistakes',
    icon: '💎',
    requirement: 'perfect_lesson',
  },
  {
    id: 'xp-100',
    title: 'Rising Star',
    description: 'Earn 100 XP',
    icon: '⭐',
    requirement: 'xp_100',
  },
  {
    id: 'xp-500',
    title: 'Battle Expert',
    description: 'Earn 500 XP',
    icon: '🌟',
    requirement: 'xp_500',
  },
  {
    id: 'map-master',
    title: 'Map Master',
    description: 'Answer 10 map questions correctly',
    icon: '🗺️',
    requirement: 'map_correct_10',
  },
];

export const getBadgeById = (id: string): Badge | undefined => {
  return badges.find(b => b.id === id);
};
