import {
  type Choice,
  DIFFICULTY_CONFIG,
  type GameState,
  gameReducer,
} from '@enilex-math-4-pkg/game-core';
import { useCallback, useEffect, useReducer } from 'react';
import { useCountdown } from './use-countdown';

const CORRECT_ADVANCE_MS = 1500;
const WRONG_ADVANCE_MS = 2000;

/** Everything `GameScreen` needs to render a run, with the hook wiring hidden. */
export interface RoundingGame {
  state: GameState;
  remaining: number;
  timerMax: number | null;
  answered: boolean;
  chosenChoice: Choice | null;
  showExplanation: boolean;
  answer: (value: number) => void;
  next: () => void;
}

/**
 * Drives a single run: the game-core reducer, the Hard countdown, Hard's
 * auto-advance, and bubbling the final score up. Returns a flat view model so the
 * screen stays presentational.
 */
export function useRoundingGame(
  initialState: GameState,
  onGameOver: (score: number) => void,
): RoundingGame {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerMax = DIFFICULTY_CONFIG[state.difficulty].timer;

  const handleTimeout = useCallback(() => dispatch({ type: 'timeout' }), []);
  const remaining = useCountdown(timerMax, state.status === 'playing', handleTimeout);

  // Bubble the final score up once the run ends.
  useEffect(() => {
    if (state.status === 'gameOver') {
      onGameOver(state.score);
    }
  }, [state.status, state.score, onGameOver]);

  // Hard mode: auto-advance after the answer is revealed.
  useEffect(() => {
    if (state.difficulty !== 'hard' || state.status !== 'answered') {
      return;
    }

    const delay = state.lastResult?.correct ? CORRECT_ADVANCE_MS : WRONG_ADVANCE_MS;
    const id = setTimeout(() => dispatch({ type: 'next' }), delay);

    return () => clearTimeout(id);
  }, [state.difficulty, state.status, state.lastResult]);

  const answer = useCallback((value: number) => dispatch({ type: 'answer', value }), []);
  const next = useCallback(() => dispatch({ type: 'next' }), []);

  const chosenValue = state.lastResult?.chosenValue ?? null;
  const chosenChoice =
    state.question.choices.find((choice) => choice.value === chosenValue) ?? null;
  const answered = state.status === 'answered';

  return {
    state,
    remaining,
    timerMax,
    answered,
    chosenChoice,
    // The teaching panel is for the untimed modes; Hard auto-advances instead.
    showExplanation: answered && state.difficulty !== 'hard',
    answer,
    next,
  };
}
