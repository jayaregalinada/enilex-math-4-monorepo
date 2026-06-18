import { describe, expect, it } from 'vitest';
import type { Choice } from './choice';
import type { GameState } from './game-reducer';
import { gameReducer } from './game-reducer';

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHOICES: Choice[] = [
  { value: 634_600, kind: 'correct' },
  { value: 634_500, kind: 'truncated' },
  { value: 630_000, kind: 'adjacentPlace' },
  { value: 634_672, kind: 'didntZero' },
];

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    difficulty: 'easy',
    exponent: 2,
    lives: 3,
    maxLives: 5,
    score: 0,
    streak: 0,
    status: 'playing',
    question: { n: 634_572, exponent: 2, correct: 634_600, choices: CHOICES },
    lastResult: null,
    ...overrides,
  };
}

describe('gameReducer', () => {
  it('scores a correct answer and grows the streak', () => {
    const next = gameReducer(baseState({ streak: 2 }), { type: 'answer', value: 634_600 });
    expect(next.status).toBe('answered');
    expect(next.streak).toBe(3);
    expect(next.score).toBe(15); // scoreFor(3)
    expect(next.lives).toBe(3);
    expect(next.lastResult).toMatchObject({ correct: true, gained: 15, lifeLost: false });
  });

  it('loses a life and resets the streak on a wrong answer', () => {
    const next = gameReducer(baseState({ streak: 5, lives: 3 }), {
      type: 'answer',
      value: 634_500,
    });
    expect(next.lives).toBe(2);
    expect(next.streak).toBe(0);
    expect(next.status).toBe('answered');
    expect(next.lastResult).toMatchObject({ correct: false, missed: false, lifeLost: true });
  });

  it('ends the game when the last life is lost', () => {
    const next = gameReducer(baseState({ lives: 1 }), { type: 'answer', value: 0 });
    expect(next.lives).toBe(0);
    expect(next.status).toBe('gameOver');
  });

  it('treats a timeout as a missed answer', () => {
    const next = gameReducer(baseState({ lives: 2 }), { type: 'timeout' });
    expect(next.lives).toBe(1);
    expect(next.lastResult).toMatchObject({ correct: false, missed: true });
  });

  it('ignores answers unless the game is playing', () => {
    const answered = baseState({ status: 'answered' });
    expect(gameReducer(answered, { type: 'answer', value: 634_600 })).toBe(answered);
  });

  it('regains a Hard life on a 10-streak milestone, capped at max', () => {
    const state = baseState({ difficulty: 'hard', lives: 2, maxLives: 3, streak: 9 });
    const next = gameReducer(state, { type: 'answer', value: 634_600 });
    expect(next.streak).toBe(10);
    expect(next.lives).toBe(3); // +1 life back
    expect(next.lastResult).toMatchObject({ lifeGained: true, gained: 150 }); // 50 combo + 100 milestone
  });

  it('advances to a fresh question on next', () => {
    const answered = gameReducer(baseState(), { type: 'answer', value: 634_600 });
    const next = gameReducer(answered, { type: 'next', rng: mulberry32(3) });
    expect(next.status).toBe('playing');
    expect(next.lastResult).toBeNull();
    expect(next.exponent).toBe(2); // Easy stays put
    expect(next.question.choices).toHaveLength(4);
  });

  it('pauses and resumes', () => {
    const paused = gameReducer(baseState(), { type: 'pause' });
    expect(paused.status).toBe('paused');
    expect(gameReducer(paused, { type: 'resume' }).status).toBe('playing');
  });

  it('quits to game over', () => {
    expect(gameReducer(baseState(), { type: 'quit' }).status).toBe('gameOver');
  });
});
