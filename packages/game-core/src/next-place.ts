import type { Difficulty } from './difficulty';
import type { Rng } from './rng';

const MIN_EXPONENT = 1;
const MAX_EXPONENT = 8;

/**
 * The place value (exponent 1..8) for the next question.
 * - **Easy** — stays on the player's chosen place.
 * - **Normal** — a ±1 random walk along the ladder, bouncing off both ends.
 * - **Hard** — a uniformly random place each question.
 */
export function nextPlace(difficulty: Difficulty, current: number, rng: Rng = Math.random): number {
  if (difficulty === 'easy') {
    return current;
  }

  if (difficulty === 'hard') {
    return MIN_EXPONENT + Math.floor(rng() * (MAX_EXPONENT - MIN_EXPONENT + 1));
  }

  // Normal: a ±1 step that bounces back inward at either end of the ladder.
  const step = rng() < 0.5 ? -1 : 1;
  const next = current + step;

  return next < MIN_EXPONENT || next > MAX_EXPONENT ? current - step : next;
}
