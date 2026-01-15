import { Unit } from '@/types';

export const units: Unit[] = [
  {
    id: 'ancient-beginnings',
    title: 'Ancient Beginnings',
    description: 'Where warfare began - Greek and Persian conflicts',
    themeTag: 'ancient',
    orderIndex: 0,
    lessonIds: ['lesson-thermopylae', 'lesson-marathon'],
    icon: '🏛️',
  },
  {
    id: 'medieval-clashes',
    title: 'Medieval Clashes',
    description: 'Knights, conquests, and the age of chivalry',
    themeTag: 'medieval',
    orderIndex: 1,
    lessonIds: ['lesson-hastings', 'lesson-agincourt'],
    icon: '⚔️',
  },
  {
    id: 'napoleonic-era',
    title: 'Napoleonic Europe',
    description: 'The rise and fall of Napoleon Bonaparte',
    themeTag: 'napoleonic',
    orderIndex: 2,
    lessonIds: ['lesson-austerlitz', 'lesson-waterloo'],
    icon: '👑',
  },
  {
    id: 'great-war',
    title: 'The Great War',
    description: 'World War I and the trenches of Europe',
    themeTag: 'ww1',
    orderIndex: 3,
    lessonIds: ['lesson-somme'],
    icon: '💣',
  },
  {
    id: 'world-war-2',
    title: 'World War II',
    description: 'The largest conflict in human history',
    themeTag: 'ww2',
    orderIndex: 4,
    lessonIds: ['lesson-stalingrad', 'lesson-dday'],
    icon: '✈️',
  },
  {
    id: 'american-conflicts',
    title: 'American Conflicts',
    description: 'Battles that shaped the Americas',
    themeTag: 'modern',
    orderIndex: 5,
    lessonIds: ['lesson-gettysburg'],
    icon: '🦅',
  },
];

export const getUnitById = (id: string): Unit | undefined => {
  return units.find(u => u.id === id);
};
