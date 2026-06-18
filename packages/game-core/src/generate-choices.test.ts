import { describe, expect, it } from 'vitest';
import { generateChoices } from './generate-choices';
import { roundTo } from './round-to';

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('generateChoices', () => {
  it('always returns four options: one correct + three distinct, valid distractors', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 800; i++) {
      const exponent = 1 + Math.floor(rng() * 8);
      const n = 10 ** exponent + Math.floor(rng() * 10 ** 8);
      const choices = generateChoices(n, exponent, rng);
      const correct = roundTo(n, exponent).rounded;

      expect(choices).toHaveLength(4);

      const values = choices.map((c) => c.value);
      expect(new Set(values).size).toBe(4); // all distinct
      expect(values.every((v) => v >= 0 && Number.isInteger(v))).toBe(true);

      const correctChoices = choices.filter((c) => c.kind === 'correct');
      expect(correctChoices).toHaveLength(1);
      expect(correctChoices[0]?.value).toBe(correct);

      // No distractor equals the correct answer.
      for (const c of choices) {
        if (c.kind !== 'correct') expect(c.value).not.toBe(correct);
      }
    }
  });

  it('includes the modeled misconceptions for a representative number', () => {
    // 634,572 → nearest hundred = 634,600.
    const kinds = new Set(generateChoices(634_572, 2, mulberry32(5)).map((c) => c.kind));
    expect(kinds.has('correct')).toBe(true);
    expect(kinds.size).toBe(4); // correct + three distinct kinds
  });
});
