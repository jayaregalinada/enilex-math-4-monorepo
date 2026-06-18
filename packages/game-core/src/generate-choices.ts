import type { Choice } from './choice';
import type { Rng } from './rng';
import { roundTo } from './round-to';

const MAX_EXPONENT = 8;

function shuffle<T>(input: readonly T[], rng: Rng): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const ai = a[i];
    const aj = a[j];
    if (ai === undefined || aj === undefined) continue;
    a[i] = aj;
    a[j] = ai;
  }
  return a;
}

/**
 * Build four shuffled choices: the correct answer plus three distinct distractors
 * drawn from the four modeled misconceptions. Candidates equal to the correct
 * answer (or to each other) are dropped; if misconceptions collapse for a given
 * number, neighbouring multiples backfill so there are always three distractors.
 */
export function generateChoices(n: number, exponent: number, rng: Rng = Math.random): Choice[] {
  const p = 10 ** exponent;
  const r = roundTo(n, exponent);
  const correct = r.rounded;
  const adjacentExponent = exponent < MAX_EXPONENT ? exponent + 1 : exponent - 1;

  const candidates: Choice[] = [
    { value: r.roundedUp ? r.lower : r.upper, kind: 'wrongDirection' },
    { value: r.lower, kind: 'truncated' },
    { value: correct + (n % p), kind: 'didntZero' },
    { value: roundTo(n, adjacentExponent).rounded, kind: 'adjacentPlace' },
  ];

  const seen = new Set<number>([correct]);
  const distractors: Choice[] = [];
  for (const candidate of shuffle(candidates, rng)) {
    if (candidate.value < 0 || !Number.isFinite(candidate.value)) continue;
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }

  // Backfill from neighbouring multiples if misconceptions collided.
  for (const offset of [p, -p, 2 * p, -2 * p, 3 * p, 10 * p]) {
    if (distractors.length === 3) break;
    const value = correct + offset;
    if (value < 0 || seen.has(value)) continue;
    seen.add(value);
    distractors.push({ value, kind: 'other' });
  }

  return shuffle([{ value: correct, kind: 'correct' }, ...distractors], rng);
}
