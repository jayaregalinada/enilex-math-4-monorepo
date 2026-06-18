import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { describe, expect, it } from 'vitest';
import type { LeaderboardEntry } from '@/stores/use-leaderboard-store';
import { rankLeaderboard } from './rank-leaderboard';

function entry(id: string, score: number, difficulty: Difficulty, name = id): LeaderboardEntry {
  return { id, name, score, difficulty, playedAt: 0 };
}

const entries: LeaderboardEntry[] = [
  entry('easy-hi', 250, 'easy'),
  entry('easy-lo', 100, 'easy'),
  entry('normal-mid', 120, 'normal'),
  entry('hard-hi', 100, 'hard'),
];

describe('rankLeaderboard', () => {
  it('filters a difficulty tab to that difficulty and sorts by score desc', () => {
    const ranked = rankLeaderboard(entries, 'easy');

    expect(ranked.map((row) => row.entry.id)).toEqual(['easy-hi', 'easy-lo']);
    expect(ranked.every((row) => row.entry.difficulty === 'easy')).toBe(true);
  });

  it('uses raw score as points on a difficulty tab', () => {
    const ranked = rankLeaderboard(entries, 'easy');

    expect(ranked[0]?.points).toBe(250);
    expect(ranked[1]?.points).toBe(100);
  });

  it('ranks overall by weighted points so a weighted hard score beats a higher easy score', () => {
    const ranked = rankLeaderboard(entries, 'overall');

    // hard 100 × 3 = 300 outranks easy 250 × 1 = 250.
    expect(ranked[0]?.entry.id).toBe('hard-hi');
    expect(ranked[0]?.points).toBe(300);
    expect(ranked[1]?.entry.id).toBe('easy-hi');
    expect(ranked[1]?.points).toBe(250);
  });

  it('keeps all difficulties on the overall tab', () => {
    expect(rankLeaderboard(entries, 'overall')).toHaveLength(entries.length);
  });

  it('slices to the given limit', () => {
    expect(rankLeaderboard(entries, 'overall', 2)).toHaveLength(2);
  });
});
