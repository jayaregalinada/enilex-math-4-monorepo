import type { AnswerResult, GameState } from '@enilex-math-4-pkg/game-core';
import { describe, expect, it } from 'vitest';
import { isMilestoneResult } from './is-milestone-result';

function easyState(): GameState {
  return {
    difficulty: 'easy',
    exponent: 2,
    lives: 5,
    maxLives: 5,
    score: 0,
    streak: 0,
    status: 'answered',
    question: {
      value: 634_572,
      exponent: 2,
      correct: 634_600,
      choices: [
        { value: 634_600, kind: 'correct' },
        { value: 634_500, kind: 'truncated' },
        { value: 630_000, kind: 'adjacentPlace' },
        { value: 634_672, kind: 'didntZero' },
      ],
    },
    lastResult: null,
  };
}

function result(overrides: Partial<AnswerResult> = {}): AnswerResult {
  return {
    correct: true,
    chosenValue: 634_600,
    correctValue: 634_600,
    missed: false,
    gained: 10,
    streakAfter: 10,
    lifeLost: false,
    lifeGained: false,
    ...overrides,
  };
}

function stateWith(lastResult: AnswerResult | null): GameState {
  return { ...easyState(), lastResult };
}

describe('isMilestoneResult', () => {
  it('is true for a fresh correct result at streakAfter 10', () => {
    const game = stateWith(result({ streakAfter: 10 }));
    expect(isMilestoneResult(game, stateWith(null))).toBe(true);
  });

  it('is true for a fresh correct result at streakAfter 20', () => {
    const game = stateWith(result({ streakAfter: 20 }));
    expect(isMilestoneResult(game, stateWith(null))).toBe(true);
  });

  it('is false for a non-multiple-of-ten streak', () => {
    const game = stateWith(result({ streakAfter: 5 }));
    expect(isMilestoneResult(game, stateWith(null))).toBe(false);
  });

  it('is false for a wrong result', () => {
    const game = stateWith(result({ correct: false, streakAfter: 0 }));
    expect(isMilestoneResult(game, stateWith(null))).toBe(false);
  });

  it('is false when the result is the same reference as before', () => {
    const shared = result({ streakAfter: 10 });
    expect(isMilestoneResult(stateWith(shared), stateWith(shared))).toBe(false);
  });

  it('is false when the game is null', () => {
    expect(isMilestoneResult(null, stateWith(result()))).toBe(false);
  });
});
