import type { AnswerResult, GameState } from '@enilex-math-4-pkg/game-core';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionStore } from '@/stores/use-session-store';
import { useCelebration } from './use-celebration';

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }));

const { celebrate } = await import('@/lib/celebrate');

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

function result(streakAfter: number): AnswerResult {
  return {
    correct: true,
    chosenValue: 634_600,
    correctValue: 634_600,
    missed: false,
    gained: 10,
    streakAfter,
    lifeLost: false,
    lifeGained: false,
  };
}

describe('useCelebration', () => {
  beforeEach(() => {
    useSessionStore.setState({ game: null });
    vi.clearAllMocks();
  });

  it('celebrates when a milestone result lands', () => {
    useSessionStore.setState({ game: easyState() });
    renderHook(() => useCelebration());

    act(() => {
      useSessionStore.setState({
        game: { ...easyState(), status: 'answered', lastResult: result(10) },
      });
    });

    expect(celebrate).toHaveBeenCalledOnce();
  });

  it('does not celebrate on a non-milestone update', () => {
    useSessionStore.setState({ game: easyState() });
    renderHook(() => useCelebration());

    act(() => {
      useSessionStore.setState({
        game: { ...easyState(), status: 'answered', lastResult: result(3) },
      });
    });

    expect(celebrate).not.toHaveBeenCalled();
  });
});
