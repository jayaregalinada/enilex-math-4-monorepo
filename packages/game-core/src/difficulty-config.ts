import type { Difficulty } from './difficulty';

/** Per-difficulty lives, timer, and life-regain rules. */
export interface DifficultyConfig {
  /** Starting lives. */
  lives: number;
  /** Maximum lives (cap for Hard's regain). */
  maxLives: number;
  /** Per-question countdown in seconds, or `null` for untimed play. */
  timer: number | null;
  /** Whether a streak can regain a lost life. */
  regain: boolean;
  /** Streak length that regains a life, or `null` when `regain` is false. */
  regainEvery: number | null;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { lives: 5, maxLives: 5, timer: null, regain: false, regainEvery: null },
  normal: { lives: 4, maxLives: 4, timer: null, regain: false, regainEvery: null },
  hard: { lives: 3, maxLives: 3, timer: 10, regain: true, regainEvery: 10 },
};
