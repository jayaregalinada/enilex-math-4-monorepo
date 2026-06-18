import type { Difficulty } from './difficulty';
import type { Rng } from './rng';

const MAX_EXPONENT = 8;
/** Far-from-boundary look digits used to keep Easy questions clear-cut. */
const EASY_LOOK_POOL = [0, 1, 2, 3, 6, 7, 8, 9] as const;

function randInt(rng: Rng, max: number): number {
  return Math.floor(rng() * (max + 1));
}

function pick<T>(rng: Rng, arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) throw new Error('cannot pick from an empty array');
  return item;
}

/**
 * Generate a whole number to round to the nearest 10^exponent, with a look-digit
 * and cascade profile shaped by difficulty. Invariants for every result:
 * it is a non-negative integer, `≥ 10^exponent` (the target place exists), and
 * `< 10^9` (≤ hundred millions).
 *
 * - **Easy** — target digit 0..8 and a mostly-far-from-5 look digit (no carry).
 * - **Normal** — cascade-free, but the look digit is uniform 0..9 so exactly-5
 *   boundaries appear.
 * - **Hard** — uniform look digit, and deliberately engineers carry/cascade cases
 *   (target digit 9 rounding up, sometimes through a run of nines).
 */
export function generateNumber(
  exponent: number,
  difficulty: Difficulty,
  rng: Rng = Math.random,
): number {
  const p = 10 ** exponent;
  const pLow = 10 ** (exponent - 1);

  // Digits sitting above the target place (1..3 of them), or none at the very top.
  const aboveDigits = exponent >= MAX_EXPONENT ? 0 : Math.min(MAX_EXPONENT - exponent, 3);
  let aboveValue = 0;
  if (aboveDigits > 0) {
    const lo = 10 ** (aboveDigits - 1);
    const hi = 10 ** aboveDigits - 1;
    aboveValue = lo + randInt(rng, hi - lo);
  }

  let targetDigit: number;
  let lookDigit: number;

  if (difficulty === 'easy') {
    targetDigit = randInt(rng, 8);
    lookDigit = rng() < 0.08 ? 5 : pick(rng, EASY_LOOK_POOL);
  } else if (difficulty === 'normal') {
    targetDigit = randInt(rng, 8);
    lookDigit = randInt(rng, 9);
  } else if (rng() < 0.35) {
    // Engineer a cascade: a 9 in the target place that rounds up.
    targetDigit = 9;
    lookDigit = 5 + randInt(rng, 4);
    if (aboveDigits > 0 && rng() < 0.5) aboveValue = 10 ** aboveDigits - 1;
  } else {
    targetDigit = randInt(rng, 9);
    lookDigit = randInt(rng, 9);
  }

  // Guarantee the target place exists when there are no higher digits.
  if (aboveDigits === 0 && targetDigit === 0) targetDigit = 1 + randInt(rng, 8);

  const belowLook = exponent === 1 ? 0 : randInt(rng, pLow - 1);
  return aboveValue * (p * 10) + targetDigit * p + lookDigit * pLow + belowLook;
}
