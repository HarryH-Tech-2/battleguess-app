/** XP-based rank ladder. Titles are translated via `profile.ranks.<id>`. */
export interface Rank {
  id: string;
  minXp: number;
}

export const RANKS: Rank[] = [
  { id: 'recruit', minXp: 0 },
  { id: 'private', minXp: 50 },
  { id: 'corporal', minXp: 150 },
  { id: 'sergeant', minXp: 300 },
  { id: 'lieutenant', minXp: 500 },
  { id: 'captain', minXp: 800 },
  { id: 'major', minXp: 1200 },
  { id: 'colonel', minXp: 1800 },
  { id: 'general', minXp: 2600 },
  { id: 'fieldMarshal', minXp: 3600 },
];

export interface RankProgress {
  rank: Rank;
  index: number;
  next: Rank | null;
  /** 0..1 progress from this rank's floor to the next rank's floor (1 at max rank). */
  progress: number;
  xpIntoRank: number;
  xpToNext: number;
}

export function getRankProgress(totalXp: number): RankProgress {
  const xp = Math.max(0, totalXp);
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) index = i;
  }
  const rank = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const xpIntoRank = xp - rank.minXp;
  const span = next ? next.minXp - rank.minXp : 1;
  const progress = next ? Math.min(1, xpIntoRank / span) : 1;
  const xpToNext = next ? Math.max(0, next.minXp - xp) : 0;
  return { rank, index, next, progress, xpIntoRank, xpToNext };
}
