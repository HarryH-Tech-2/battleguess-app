/**
 * Daily quests. Three are chosen per calendar day from the pool, seeded by the date,
 * so every device shows the same set for a given day without a server.
 */
export type QuestMetric = 'xp' | 'lessons' | 'correct' | 'perfect' | 'newBattles';

export interface QuestReward {
  xp?: number;
  hearts?: number;
}

export interface QuestDef {
  id: string;
  metric: QuestMetric;
  target: number;
  reward: QuestReward;
}

export interface DailyStats {
  date: string;
  xp: number;
  lessons: number;
  correct: number;
  perfect: number;
  newBattles: number;
  claimed: string[];
}

export const QUEST_POOL: QuestDef[] = [
  { id: 'xp-30', metric: 'xp', target: 30, reward: { hearts: 1 } },
  { id: 'xp-60', metric: 'xp', target: 60, reward: { xp: 20 } },
  { id: 'lessons-1', metric: 'lessons', target: 1, reward: { xp: 10 } },
  { id: 'lessons-2', metric: 'lessons', target: 2, reward: { xp: 20 } },
  { id: 'lessons-3', metric: 'lessons', target: 3, reward: { hearts: 1 } },
  { id: 'correct-8', metric: 'correct', target: 8, reward: { xp: 10 } },
  { id: 'correct-15', metric: 'correct', target: 15, reward: { xp: 25 } },
  { id: 'perfect-1', metric: 'perfect', target: 1, reward: { hearts: 1 } },
  { id: 'newBattles-1', metric: 'newBattles', target: 1, reward: { xp: 15 } },
  { id: 'newBattles-2', metric: 'newBattles', target: 2, reward: { hearts: 1 } },
];

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function emptyDailyStats(date: string = todayKey()): DailyStats {
  return { date, xp: 0, lessons: 0, correct: 0, perfect: 0, newBattles: 0, claimed: [] };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function metricScale(metric: QuestMetric): number {
  switch (metric) {
    case 'xp': return 30;
    case 'correct': return 8;
    default: return 1;
  }
}

/** Deterministic pick of 3 quests with distinct metrics for the given day. */
export function getDailyQuests(date: string = todayKey()): QuestDef[] {
  let seed = hashString(date) || 1;
  const rand = () => {
    seed = (seed ^ (seed << 13)) >>> 0;
    seed = (seed ^ (seed >>> 17)) >>> 0;
    seed = (seed ^ (seed << 5)) >>> 0;
    return seed / 4294967296;
  };
  const pool = [...QUEST_POOL];
  const picked: QuestDef[] = [];
  const usedMetrics = new Set<QuestMetric>();
  while (picked.length < 3 && pool.length > 0) {
    const i = Math.floor(rand() * pool.length);
    const q = pool.splice(i, 1)[0];
    if (usedMetrics.has(q.metric)) continue;
    usedMetrics.add(q.metric);
    picked.push(q);
  }
  // Easiest first so the day starts with a quick win.
  return picked.sort(
    (a, b) => a.target / metricScale(a.metric) - b.target / metricScale(b.metric)
  );
}

export function questProgress(q: QuestDef, stats: DailyStats): number {
  return Math.min(q.target, stats[q.metric]);
}

export function isQuestComplete(q: QuestDef, stats: DailyStats): boolean {
  return questProgress(q, stats) >= q.target;
}
