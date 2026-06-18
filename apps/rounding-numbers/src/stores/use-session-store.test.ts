import type { GameState } from '@enilex-math-4-pkg/game-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from './use-session-store';

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

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({ game: null });
  });

  it('start sets the game', () => {
    useSessionStore.getState().start(easyState());

    expect(useSessionStore.getState().game?.status).toBe('playing');
  });

  it('dispatch delegates a correct answer to the reducer (score and streak rise)', () => {
    useSessionStore.getState().start(easyState());
    useSessionStore.getState().dispatch({ type: 'answer', value: 634_600 });

    const game = useSessionStore.getState().game;
    expect(game?.score).toBe(10);
    expect(game?.streak).toBe(1);
    expect(game?.status).toBe('answered');
  });

  it('dispatch delegates a wrong answer to the reducer (a life is lost)', () => {
    useSessionStore.getState().start(easyState());
    useSessionStore.getState().dispatch({ type: 'answer', value: 634_500 });

    expect(useSessionStore.getState().game?.lives).toBe(4);
  });

  it('dispatch is a no-op when there is no game', () => {
    useSessionStore.getState().dispatch({ type: 'answer', value: 634_600 });

    expect(useSessionStore.getState().game).toBeNull();
  });

  it('end resets the game to null', () => {
    useSessionStore.getState().start(easyState());
    useSessionStore.getState().end();

    expect(useSessionStore.getState().game).toBeNull();
  });
});
