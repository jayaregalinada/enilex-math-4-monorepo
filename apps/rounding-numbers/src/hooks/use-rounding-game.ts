import { type Choice, DIFFICULTY_CONFIG, type GameState } from '@enilex-math-4-pkg/game-core';
import { useCallback, useEffect, useRef } from 'react';
import { useSessionStore } from '@/stores/use-session-store';
import { useCountdown } from './use-countdown';
import { useGetReady } from './use-get-ready';

const CORRECT_ADVANCE_MS = 1500;
const WRONG_ADVANCE_MS = 2000;

/** Everything `GameScreen` needs to render a run, with the hook wiring hidden. */
export interface RoundingGame {
  state: GameState;
  remaining: number;
  timerMax: number | null;
  /** The "Get ready!" 3-2-1 number while it counts in, or `null` once play starts. */
  getReadyCount: number | null;
  answered: boolean;
  paused: boolean;
  chosenChoice: Choice | null;
  showExplanation: boolean;
  answer: (value: number) => void;
  next: () => void;
  pause: () => void;
  resume: () => void;
}

/**
 * Drives a single run off the Zustand session store (ADR 0005): seeds the
 * session on mount, owns the Hard countdown and auto-advance, and bubbles the
 * final score up. Returns a flat view model so the screen stays presentational.
 * Audio subscribes to the same store separately (see `useAudio`).
 */
export function useRoundingGame(
  initialState: GameState,
  onGameOver: (score: number) => void,
): RoundingGame {
  const storedGame = useSessionStore((store) => store.game);

  // Render from the seed until the session is initialized for this run.
  const state = storedGame ?? initialState;
  const initialStateRef = useRef(initialState);

  // Seed this run's session on mount; clear it on unmount so the next run starts fresh.
  useEffect(() => {
    useSessionStore.getState().start(initialStateRef.current);

    return () => {
      useSessionStore.getState().end();
    };
  }, []);

  const timerMax = DIFFICULTY_CONFIG[state.difficulty].timer;

  // Every run opens with a "Get ready!" 3-2-1; on Hard the clock stays frozen until "go".
  const getReady = useGetReady(true);

  const handleTimeout = useCallback(() => {
    useSessionStore.getState().dispatch({ type: 'timeout' });
  }, []);
  // Reset the clock per question (keyed by place + value), not on pause/resume.
  const resetKey = `${state.exponent}:${state.question.value}`;
  const timerActive = state.status === 'playing' && !getReady.active;
  const remaining = useCountdown(timerMax, timerActive, handleTimeout, resetKey);

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
    const id = setTimeout(() => {
      useSessionStore.getState().dispatch({ type: 'next' });
    }, delay);

    return () => clearTimeout(id);
  }, [state.difficulty, state.status, state.lastResult]);

  const answer = useCallback((value: number) => {
    useSessionStore.getState().dispatch({ type: 'answer', value });
  }, []);
  const next = useCallback(() => {
    useSessionStore.getState().dispatch({ type: 'next' });
  }, []);
  const pause = useCallback(() => {
    useSessionStore.getState().dispatch({ type: 'pause' });
  }, []);
  const resume = useCallback(() => {
    useSessionStore.getState().dispatch({ type: 'resume' });
  }, []);

  const chosenValue = state.lastResult?.chosenValue ?? null;
  const chosenChoice =
    state.question.choices.find((choice) => choice.value === chosenValue) ?? null;
  const answered = state.status === 'answered';

  return {
    state,
    remaining,
    timerMax,
    getReadyCount: getReady.active ? getReady.count : null,
    answered,
    paused: state.status === 'paused',
    chosenChoice,
    // The teaching panel is for the untimed modes; Hard auto-advances instead.
    showExplanation: answered && state.difficulty !== 'hard',
    answer,
    next,
    pause,
    resume,
  };
}
