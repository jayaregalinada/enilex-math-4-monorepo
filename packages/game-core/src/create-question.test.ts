import { describe, expect, it } from 'vitest';
import { createQuestion } from './create-question';
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

describe('createQuestion', () => {
  it('produces a self-consistent question whose options contain the correct answer', () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 200; i++) {
      const q = createQuestion('normal', 1 + (i % 8), rng);
      expect(q.correct).toBe(roundTo(q.n, q.exponent).rounded);
      expect(q.choices).toHaveLength(4);
      expect(q.choices.map((c) => c.value)).toContain(q.correct);
    }
  });
});
