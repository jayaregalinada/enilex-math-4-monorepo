import { createGame, type Difficulty, type GameState } from '@enilex-math-4-pkg/game-core';
import { useCallback, useReducer } from 'react';
import { useThemeStore } from '@/stores/use-theme-store';

/** Which screen is showing, plus the data that screen needs. */
export type FlowState =
  | { screen: 'home' }
  | { screen: 'difficulty' }
  | { screen: 'placePicker'; difficulty: Difficulty }
  | { screen: 'game'; difficulty: Difficulty; game: GameState }
  | { screen: 'gameOver'; difficulty: Difficulty; score: number }
  | { screen: 'leaderboard' };

type FlowAction =
  | { type: 'toDifficulty' }
  | { type: 'toPicker'; difficulty: Difficulty }
  | { type: 'startGame'; difficulty: Difficulty; game: GameState }
  | { type: 'endGame'; score: number }
  | { type: 'leaderboard' }
  | { type: 'home' };

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'toDifficulty':
      return { screen: 'difficulty' };

    case 'toPicker':
      return { screen: 'placePicker', difficulty: action.difficulty };

    case 'startGame':
      return { screen: 'game', difficulty: action.difficulty, game: action.game };

    case 'endGame':
      return state.screen === 'game'
        ? { screen: 'gameOver', difficulty: state.difficulty, score: action.score }
        : state;

    case 'leaderboard':
      return { screen: 'leaderboard' };

    case 'home':
      return { screen: 'home' };

    default:
      return state;
  }
}

export interface GameFlow {
  state: FlowState;
  play: () => void;
  selectDifficulty: (difficulty: Difficulty) => void;
  pickPlace: (exponent: number) => void;
  endGame: (score: number) => void;
  playAgain: () => void;
  viewLeaderboard: () => void;
  goHome: () => void;
}

/**
 * Screen-flow state machine for the app: Home → Difficulty → (Picker) → Game →
 * GameOver. New games are created here (calling the pure `createGame`) so the
 * reducer stays free of side effects.
 */
export function useGameFlow(): GameFlow {
  const [state, dispatch] = useReducer(flowReducer, { screen: 'home' });

  const play = useCallback(() => dispatch({ type: 'toDifficulty' }), []);

  const selectDifficulty = useCallback((difficulty: Difficulty) => {
    // Hard skips the picker — its place value is random each question.
    if (difficulty === 'hard') {
      // Each run gets a fresh random theme.
      useThemeStore.getState().pickRandom();
      dispatch({ type: 'startGame', difficulty, game: createGame('hard', 1) });
      return;
    }

    dispatch({ type: 'toPicker', difficulty });
  }, []);

  const pickPlace = useCallback(
    (exponent: number) => {
      if (state.screen !== 'placePicker') {
        return;
      }

      // Each run gets a fresh random theme.
      useThemeStore.getState().pickRandom();
      dispatch({
        type: 'startGame',
        difficulty: state.difficulty,
        game: createGame(state.difficulty, exponent),
      });
    },
    [state],
  );

  const endGame = useCallback((score: number) => dispatch({ type: 'endGame', score }), []);
  const playAgain = useCallback(() => dispatch({ type: 'toDifficulty' }), []);
  const viewLeaderboard = useCallback(() => dispatch({ type: 'leaderboard' }), []);
  const goHome = useCallback(() => dispatch({ type: 'home' }), []);

  return {
    state,
    play,
    selectDifficulty,
    pickPlace,
    endGame,
    playAgain,
    viewLeaderboard,
    goHome,
  };
}
