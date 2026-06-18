import { describe, expect, it } from 'vitest';
import { generateNumber } from './generate-number';
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

const SAMPLES = 600;

describe('generateNumber', () => {
  it('holds the invariants for every place and difficulty', () => {
    const rng = mulberry32(1);
    for (const difficulty of ['easy', 'normal', 'hard'] as const) {
      for (let exponent = 1; exponent <= 8; exponent++) {
        for (let i = 0; i < 50; i++) {
          const n = generateNumber(exponent, difficulty, rng);
          expect(Number.isInteger(n)).toBe(true);
          expect(n).toBeGreaterThanOrEqual(10 ** exponent);
          expect(n).toBeLessThan(1_000_000_000);
        }
      }
    }
  });

  it('Easy keeps look digits mostly off the boundary and never cascades', () => {
    const rng = mulberry32(2);
    let boundary = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const n = generateNumber(3, 'easy', rng);
      const r = roundTo(n, 3);
      // No cascade: a target digit of 9 never rounds up on Easy.
      expect(r.roundedUp && r.targetDigit === 9).toBe(false);
      if (r.lookDigit === 5) {
        boundary++;
      }
    }
    expect(boundary / SAMPLES).toBeLessThan(0.2);
  });

  it('Normal surfaces exactly-5 boundary look digits', () => {
    const rng = mulberry32(3);
    let boundary = 0;
    for (let i = 0; i < SAMPLES; i++) {
      if (roundTo(generateNumber(3, 'normal', rng), 3).lookDigit === 5) {
        boundary++;
      }
    }
    expect(boundary).toBeGreaterThan(0);
  });

  it('Hard engineers cascade/carry cases', () => {
    const rng = mulberry32(4);
    let cascades = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const n = generateNumber(3, 'hard', rng);
      const r = roundTo(n, 3);
      if (r.roundedUp && r.targetDigit === 9) {
        cascades++;
      }
    }
    expect(cascades).toBeGreaterThan(0);
  });
});
