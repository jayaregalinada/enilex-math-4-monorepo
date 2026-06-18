import type { GameState } from '@enilex-math-4-pkg/game-core';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRoundingGame } from './use-rounding-game';

function easyState(): GameState {
  return {
    difficulty: 'easy',
    exponent: 2,
    lives: 5,
    maxLives: 5,
    score: 0,
    streak: 0,
    status: 'playing',
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

function hardState(): GameState {
  return {
    ...easyState(),
    difficulty: 'hard',
    lives: 3,
    maxLives: 3,
  };
}

describe('useRoundingGame', () => {
  it('scores a correct answer and reveals the explanation (Easy)', () => {
    const { result } = renderHook(() => useRoundingGame(easyState(), vi.fn()));
    act(() => result.current.answer(634_600));
    expect(result.current.state.score).toBe(10);
    expect(result.current.answered).toBe(true);
    expect(result.current.showExplanation).toBe(true);
    expect(result.current.chosenChoice?.kind).toBe('correct');
  });

  it('loses a life on a wrong answer and tracks the chosen distractor', () => {
    const { result } = renderHook(() => useRoundingGame(easyState(), vi.fn()));
    act(() => result.current.answer(634_500));
    expect(result.current.state.lives).toBe(4);
    expect(result.current.chosenChoice?.kind).toBe('truncated');
  });

  it('reports the final score to onGameOver when the run ends', () => {
    const onGameOver = vi.fn();
    const lastLife: GameState = { ...easyState(), lives: 1 };
    const { result } = renderHook(() => useRoundingGame(lastLife, onGameOver));
    // A wrong answer on the last life ends the run.
    act(() => result.current.answer(634_500));
    expect(result.current.state.status).toBe('gameOver');
    expect(onGameOver).toHaveBeenCalledWith(0);
  });

  it('returns to playing after next()', () => {
    const { result } = renderHook(() => useRoundingGame(easyState(), vi.fn()));
    act(() => result.current.answer(634_600));
    act(() => result.current.next());
    expect(result.current.state.status).toBe('playing');
  });

  it('has no timer on Easy', () => {
    const { result } = renderHook(() => useRoundingGame(easyState(), vi.fn()));
    expect(result.current.timerMax).toBeNull();
  });

  it('uses a timer and hides the explanation on Hard', () => {
    const { result } = renderHook(() => useRoundingGame(hardState(), vi.fn()));
    expect(result.current.timerMax).toBe(10);
    act(() => result.current.answer(634_600));
    expect(result.current.showExplanation).toBe(false);
  });
});
