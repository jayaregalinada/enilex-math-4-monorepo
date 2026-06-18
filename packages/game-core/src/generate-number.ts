import type { Difficulty } from './difficulty';
import type { Rng } from './rng';

const MAX_EXPONENT = 8;
/** Far-from-boundary look digits used to keep Easy questions clear-cut. */
const EASY_LOOK_POOL = [0, 1, 2, 3, 6, 7, 8, 9] as const;
const EASY_BOUNDARY_CHANCE = 0.08;
const HARD_CASCADE_CHANCE = 0.35;
const BIG_CASCADE_CHANCE = 0.5;

function randomInt(rng: Rng, max: number): number {
  return Math.floor(rng() * (max + 1));
}

function pick<T>(rng: Rng, options: readonly T[]): T {
  const item = options[Math.floor(rng() * options.length)];
  if (item === undefined) {
    throw new Error('cannot pick from an empty array');
  }

  return item;
}

/** The two digits (and a cascade hint) that shape a question's difficulty. */
interface DigitProfile {
  targetDigit: number;
  lookDigit: number;
  forceMaxAbove: boolean;
}

function easyDigits(rng: Rng): DigitProfile {
  // Target 0..8 (never 9) so rounding up cannot cascade; look digit mostly off 5.
  return {
    targetDigit: randomInt(rng, 8),
    lookDigit: rng() < EASY_BOUNDARY_CHANCE ? 5 : pick(rng, EASY_LOOK_POOL),
    forceMaxAbove: false,
  };
}

function normalDigits(rng: Rng): DigitProfile {
  // Cascade-free, but a uniform look digit surfaces exactly-5 boundaries.
  return { targetDigit: randomInt(rng, 8), lookDigit: randomInt(rng, 9), forceMaxAbove: false };
}

function hardDigits(rng: Rng): DigitProfile {
  // Some questions deliberately engineer a carry: a 9 in the target place that rounds up.
  if (rng() < HARD_CASCADE_CHANCE) {
    return {
      targetDigit: 9,
      lookDigit: 5 + randomInt(rng, 4),
      forceMaxAbove: rng() < BIG_CASCADE_CHANCE,
    };
  }

  return { targetDigit: randomInt(rng, 9), lookDigit: randomInt(rng, 9), forceMaxAbove: false };
}

function digitsFor(difficulty: Difficulty, rng: Rng): DigitProfile {
  switch (difficulty) {
    case 'easy':
      return easyDigits(rng);

    case 'normal':
      return normalDigits(rng);

    default:
      return hardDigits(rng);
  }
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
  const placeValue = 10 ** exponent;
  const lookPlaceValue = 10 ** (exponent - 1);

  // Digits sitting above the target place (1..3 of them), or none at the very top.
  const aboveDigits = exponent >= MAX_EXPONENT ? 0 : Math.min(MAX_EXPONENT - exponent, 3);
  let aboveValue = 0;
  if (aboveDigits > 0) {
    const low = 10 ** (aboveDigits - 1);
    const high = 10 ** aboveDigits - 1;
    aboveValue = low + randomInt(rng, high - low);
  }

  const profile = digitsFor(difficulty, rng);
  const lookDigit = profile.lookDigit;
  let targetDigit = profile.targetDigit;

  if (profile.forceMaxAbove && aboveDigits > 0) {
    aboveValue = 10 ** aboveDigits - 1;
  }

  // Guarantee the target place exists when there are no higher digits.
  if (aboveDigits === 0 && targetDigit === 0) {
    targetDigit = 1 + randomInt(rng, 8);
  }

  const belowLook = exponent === 1 ? 0 : randomInt(rng, lookPlaceValue - 1);

  return (
    aboveValue * (placeValue * 10) +
    targetDigit * placeValue +
    lookDigit * lookPlaceValue +
    belowLook
  );
}
