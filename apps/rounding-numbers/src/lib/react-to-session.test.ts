import type { AnswerResult, GameState } from '@enilex-math-4-pkg/game-core';
import { describe, expect, it, vi } from 'vitest';
import { reactToSession } from './react-to-session';

function fakeEngine() {
  return {
    resume: vi.fn(),
    setMuted: vi.fn(),
    playSoundEffect: vi.fn(),
    startMusic: vi.fn(),
    stopMusic: vi.fn(),
    dispose: vi.fn(),
  };
}

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

function result(overrides: Partial<AnswerResult> = {}): AnswerResult {
  return {
    correct: true,
    chosenValue: 634_600,
    correctValue: 634_600,
    missed: false,
    gained: 10,
    streakAfter: 1,
    lifeLost: false,
    lifeGained: false,
    ...overrides,
  };
}

describe('reactToSession', () => {
  it('starts music with the difficulty on a null → active transition', () => {
    const engine = fakeEngine();

    reactToSession(engine, easyState(), null);

    expect(engine.startMusic).toHaveBeenCalledWith('easy');
  });

  it('stops music on an active → gameOver transition', () => {
    const engine = fakeEngine();
    const previous = easyState();
    const game: GameState = { ...easyState(), status: 'gameOver', lastResult: previous.lastResult };

    reactToSession(engine, game, previous);

    expect(engine.stopMusic).toHaveBeenCalledOnce();
  });

  it('plays correct for a newly-landed correct answer with a low streak', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'playing' };
    const game: GameState = {
      ...easyState(),
      status: 'answered',
      lastResult: result({ streakAfter: 1 }),
    };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).toHaveBeenCalledWith('correct');
  });

  it('plays streak when streakAfter is a multiple of 5', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'playing' };
    const game: GameState = {
      ...easyState(),
      status: 'answered',
      lastResult: result({ streakAfter: 5 }),
    };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).toHaveBeenCalledWith('streak');
  });

  it('plays lifeGained when a correct answer regained a life', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'playing' };
    const game: GameState = {
      ...easyState(),
      status: 'answered',
      lastResult: result({ streakAfter: 5, lifeGained: true }),
    };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).toHaveBeenCalledWith('lifeGained');
  });

  it('plays wrong for an incorrect answer that did not end the run', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'playing' };
    const game: GameState = {
      ...easyState(),
      lives: 4,
      status: 'answered',
      lastResult: result({
        correct: false,
        streakAfter: 0,
        gained: 0,
        lifeLost: true,
      }),
    };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).toHaveBeenCalledWith('wrong');
  });

  it('plays gameOver when the result lands on a gameOver status', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'playing' };
    const game: GameState = {
      ...easyState(),
      lives: 0,
      status: 'gameOver',
      lastResult: result({
        correct: false,
        streakAfter: 0,
        gained: 0,
        lifeLost: true,
      }),
    };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).toHaveBeenCalledWith('gameOver');
  });

  it('fires no SFX when the result is the same reference as before', () => {
    const engine = fakeEngine();
    const shared = result();
    const previous: GameState = { ...easyState(), status: 'answered', lastResult: shared };
    const game: GameState = { ...easyState(), status: 'answered', lastResult: shared };

    reactToSession(engine, game, previous);

    expect(engine.playSoundEffect).not.toHaveBeenCalled();
  });

  it('fires no SFX when the game is null', () => {
    const engine = fakeEngine();
    const previous: GameState = { ...easyState(), status: 'gameOver', lastResult: result() };

    reactToSession(engine, null, previous);

    expect(engine.playSoundEffect).not.toHaveBeenCalled();
  });
});
