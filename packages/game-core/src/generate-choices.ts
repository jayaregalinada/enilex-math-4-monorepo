import type { Choice } from './choice';
import type { Rng } from './rng';
import { roundTo } from './round-to';

const MAX_EXPONENT = 8;
const DISTRACTOR_COUNT = 3;

function shuffle<T>(input: readonly T[], rng: Rng): T[] {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const itemAtI = items[i];
    const itemAtJ = items[j];
    if (itemAtI === undefined || itemAtJ === undefined) {
      continue;
    }

    items[i] = itemAtJ;
    items[j] = itemAtI;
  }

  return items;
}

/**
 * Build four shuffled choices: the correct answer plus three distinct distractors
 * drawn from the four modeled misconceptions. Candidates equal to the correct
 * answer (or to each other) are dropped; if misconceptions collapse for a given
 * number, neighbouring multiples backfill so there are always three distractors.
 */
export function generateChoices(value: number, exponent: number, rng: Rng = Math.random): Choice[] {
  const placeValue = 10 ** exponent;
  const rounding = roundTo(value, exponent);
  const correct = rounding.rounded;
  const adjacentExponent = exponent < MAX_EXPONENT ? exponent + 1 : exponent - 1;

  const candidates: Choice[] = [
    { value: rounding.roundedUp ? rounding.lower : rounding.upper, kind: 'wrongDirection' },
    { value: rounding.lower, kind: 'truncated' },
    { value: correct + (value % placeValue), kind: 'didntZero' },
    { value: roundTo(value, adjacentExponent).rounded, kind: 'adjacentPlace' },
  ];

  const seen = new Set<number>([correct]);
  const distractors: Choice[] = [];
  for (const candidate of shuffle(candidates, rng)) {
    if (candidate.value < 0 || !Number.isFinite(candidate.value) || seen.has(candidate.value)) {
      continue;
    }

    seen.add(candidate.value);
    distractors.push(candidate);
    if (distractors.length === DISTRACTOR_COUNT) {
      break;
    }
  }

  // Backfill from neighbouring multiples if misconceptions collided.
  const offsets = [placeValue, -placeValue, 2 * placeValue, -2 * placeValue, 3 * placeValue];
  for (const offset of offsets) {
    if (distractors.length === DISTRACTOR_COUNT) {
      break;
    }

    const candidateValue = correct + offset;
    if (candidateValue < 0 || seen.has(candidateValue)) {
      continue;
    }

    seen.add(candidateValue);
    distractors.push({ value: candidateValue, kind: 'other' });
  }

  return shuffle([{ value: correct, kind: 'correct' }, ...distractors], rng);
}
