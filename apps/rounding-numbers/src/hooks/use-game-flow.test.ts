import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGameFlow } from './use-game-flow';

describe('useGameFlow', () => {
  it('walks Home → Difficulty → Picker → Game → GameOver and back', () => {
    const { result } = renderHook(() => useGameFlow());
    expect(result.current.state.screen).toBe('home');

    act(() => result.current.play());
    expect(result.current.state.screen).toBe('difficulty');

    act(() => result.current.selectDifficulty('easy'));
    expect(result.current.state).toMatchObject({ screen: 'placePicker', difficulty: 'easy' });

    act(() => result.current.pickPlace(3));
    expect(result.current.state.screen).toBe('game');

    act(() => result.current.endGame(120));
    expect(result.current.state).toMatchObject({
      screen: 'gameOver',
      difficulty: 'easy',
      score: 120,
    });

    act(() => result.current.playAgain());
    expect(result.current.state.screen).toBe('difficulty');

    act(() => result.current.goHome());
    expect(result.current.state.screen).toBe('home');
  });

  it('skips the picker and starts a game on Hard', () => {
    const { result } = renderHook(() => useGameFlow());
    act(() => result.current.selectDifficulty('hard'));
    expect(result.current.state).toMatchObject({ screen: 'game', difficulty: 'hard' });
  });

  it('starts an easy game on the picked place with runId 0', () => {
    const { result } = renderHook(() => useGameFlow());
    act(() => result.current.selectDifficulty('easy'));
    act(() => result.current.pickPlace(3));
    expect(result.current.state).toMatchObject({
      screen: 'game',
      difficulty: 'easy',
      startExponent: 3,
      runId: 0,
    });
  });

  it('starts a hard game on startExponent 1 with runId 0', () => {
    const { result } = renderHook(() => useGameFlow());
    act(() => result.current.selectDifficulty('hard'));
    expect(result.current.state).toMatchObject({
      screen: 'game',
      difficulty: 'hard',
      startExponent: 1,
      runId: 0,
    });
  });

  it('restart keeps difficulty and startExponent while bumping runId', () => {
    const { result } = renderHook(() => useGameFlow());
    act(() => result.current.selectDifficulty('easy'));
    act(() => result.current.pickPlace(3));

    act(() => result.current.restart());
    expect(result.current.state).toMatchObject({
      screen: 'game',
      difficulty: 'easy',
      startExponent: 3,
      runId: 1,
    });

    act(() => result.current.restart());
    expect(result.current.state).toMatchObject({
      screen: 'game',
      difficulty: 'easy',
      startExponent: 3,
      runId: 2,
    });
  });
});
