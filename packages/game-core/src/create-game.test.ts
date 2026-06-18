import { describe, expect, it } from 'vitest';
import { createGame } from './create-game';

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('createGame', () => {
  it('starts Easy on the chosen place with five lives', () => {
    const game = createGame('easy', 3, mulberry32(1));
    expect(game).toMatchObject({
      difficulty: 'easy',
      exponent: 3,
      lives: 5,
      maxLives: 5,
      score: 0,
      streak: 0,
      status: 'playing',
      lastResult: null,
    });
    expect(game.question.exponent).toBe(3);
    expect(game.question.choices).toHaveLength(4);
  });

  it('uses per-difficulty starting lives', () => {
    expect(createGame('normal', 4, mulberry32(2)).lives).toBe(4);
    expect(createGame('hard', 5, mulberry32(3)).lives).toBe(3);
  });

  it('randomises the place on Hard but keeps it in range', () => {
    for (let i = 0; i < 50; i++) {
      const game = createGame('hard', 5, mulberry32(i));
      expect(game.exponent).toBeGreaterThanOrEqual(1);
      expect(game.exponent).toBeLessThanOrEqual(8);
    }
  });
});
