import type { Difficulty } from './difficulty';

const WEIGHTS: Record<Difficulty, number> = { easy: 1, normal: 2, hard: 3 };

/** Difficulty multiplier for the Overall leaderboard: Easy ×1, Normal ×2, Hard ×3. */
export function overallWeight(difficulty: Difficulty): number {
  return WEIGHTS[difficulty];
}
