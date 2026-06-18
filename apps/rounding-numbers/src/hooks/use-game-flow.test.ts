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
});
