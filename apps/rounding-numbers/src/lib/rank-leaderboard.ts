import { type Difficulty, overallWeight } from '@enilex-math-4-pkg/game-core';
import type { LeaderboardEntry } from '@/stores/use-leaderboard-store';

/** The leaderboard's four views: one per difficulty, plus weighted Overall. */
export type LeaderboardTab = Difficulty | 'overall';

/** A ranked row: the entry plus the points it was ranked by (weighted on Overall). */
export interface RankedEntry {
  entry: LeaderboardEntry;
  points: number;
}

const DEFAULT_LIMIT = 10;

/**
 * Ranks entries for a tab: difficulty tabs filter to that difficulty and rank by
 * raw score; Overall keeps all entries and ranks by score × difficulty weight
 * (Easy ×1, Normal ×2, Hard ×3). Returns the top `limit`, highest first.
 */
export function rankLeaderboard(
  entries: readonly LeaderboardEntry[],
  tab: LeaderboardTab,
  limit: number = DEFAULT_LIMIT,
): RankedEntry[] {
  const ranked = entries
    .filter((entry) => tab === 'overall' || entry.difficulty === tab)
    .map((entry) => ({
      entry,
      points: tab === 'overall' ? entry.score * overallWeight(entry.difficulty) : entry.score,
    }));

  ranked.sort((first, second) => second.points - first.points);

  return ranked.slice(0, limit);
}
