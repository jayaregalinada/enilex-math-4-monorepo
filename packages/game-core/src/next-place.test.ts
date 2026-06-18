import { describe, expect, it } from 'vitest';
import { nextPlace } from './next-place';

/** Deterministic PRNG so the random-walk assertions are reproducible. */
function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('nextPlace', () => {
  it('keeps the same place on Easy', () => {
    expect(nextPlace('easy', 4)).toBe(4);
    expect(nextPlace('easy', 1)).toBe(1);
  });

  it('moves exactly one step on Normal and stays in 1..8', () => {
    const rng = mulberry32(7);
    let current = 4;
    for (let i = 0; i < 500; i++) {
      const next = nextPlace('normal', current, rng);
      expect(Math.abs(next - current)).toBe(1);
      expect(next).toBeGreaterThanOrEqual(1);
      expect(next).toBeLessThanOrEqual(8);
      current = next;
    }
  });

  it('bounces inward at both ends on Normal', () => {
    expect(nextPlace('normal', 1, () => 0.9)).toBe(2); // +1
    expect(nextPlace('normal', 1, () => 0.1)).toBe(2); // would be 0 → bounce to 2
    expect(nextPlace('normal', 8, () => 0.1)).toBe(7); // -1
    expect(nextPlace('normal', 8, () => 0.9)).toBe(7); // would be 9 → bounce to 7
  });

  it('stays within 1..8 on Hard', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 500; i++) {
      const next = nextPlace('hard', 4, rng);
      expect(next).toBeGreaterThanOrEqual(1);
      expect(next).toBeLessThanOrEqual(8);
    }
  });
});
