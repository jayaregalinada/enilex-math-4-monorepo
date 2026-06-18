import {
  DIFFICULTY_CONFIG,
  type GameState,
  gameReducer,
  PLACES,
} from '@enilex-math-4-pkg/game-core';
import { useCallback, useEffect, useReducer } from 'react';
import { AnswerButton, type AnswerState } from '../components/answer-button';
import { GameHud } from '../components/game-hud';
import { useCountdown } from '../hooks/use-countdown';
import { formatNumber } from '../lib/format-number';

const CORRECT_ADVANCE_MS = 1500;
const WRONG_ADVANCE_MS = 2000;

export interface GameScreenProps {
  initialState: GameState;
  onExit: (score: number) => void;
  onQuit: () => void;
}

function placeLabel(exponent: number): string {
  return PLACES.find((place) => place.exponent === exponent)?.label ?? '';
}

/** The reveal styling for one answer button once the question is answered. */
function answerStateFor(
  optionValue: number,
  correctValue: number,
  chosenValue: number | null,
  answered: boolean,
): AnswerState {
  if (!answered) {
    return 'idle';
  }

  if (optionValue === correctValue) {
    return 'correct';
  }

  if (optionValue === chosenValue) {
    return 'wrong';
  }

  return 'dimmed';
}

/** The play screen: HUD, prompt, and answer buttons driven by the game-core reducer. */
export function GameScreen({ initialState, onExit, onQuit }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timer = DIFFICULTY_CONFIG[state.difficulty].timer;

  const handleTimeout = useCallback(() => dispatch({ type: 'timeout' }), []);
  const remaining = useCountdown(timer, state.status === 'playing', handleTimeout);

  // Bubble the final score up once the run ends.
  useEffect(() => {
    if (state.status === 'gameOver') {
      onExit(state.score);
    }
  }, [state.status, state.score, onExit]);

  // Hard mode: auto-advance after the answer is revealed.
  useEffect(() => {
    if (state.difficulty !== 'hard' || state.status !== 'answered') {
      return;
    }

    const delay = state.lastResult?.correct ? CORRECT_ADVANCE_MS : WRONG_ADVANCE_MS;
    const id = setTimeout(() => dispatch({ type: 'next' }), delay);

    return () => clearTimeout(id);
  }, [state.difficulty, state.status, state.lastResult]);

  const handleAnswer = useCallback((value: number) => dispatch({ type: 'answer', value }), []);

  const answered = state.status === 'answered';
  const chosenValue = state.lastResult?.chosenValue ?? null;

  return (
    <section className="screen game">
      <GameHud
        lives={state.lives}
        maxLives={state.maxLives}
        score={state.score}
        streak={state.streak}
        {...(timer !== null ? { remaining, timerMax: timer } : {})}
      />

      <p className="game__prompt">
        Round <strong>{formatNumber(state.question.value)}</strong> to the nearest{' '}
        <strong>{placeLabel(state.question.exponent)}</strong>.
      </p>

      <div className="answer-grid">
        {state.question.choices.map((choice) => (
          <AnswerButton
            key={choice.value}
            value={choice.value}
            state={answerStateFor(choice.value, state.question.correct, chosenValue, answered)}
            disabled={state.status !== 'playing'}
            onClick={() => handleAnswer(choice.value)}
          />
        ))}
      </div>

      {answered && state.difficulty !== 'hard' && (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => dispatch({ type: 'next' })}
        >
          Next →
        </button>
      )}

      <button type="button" className="btn btn--ghost game__quit" onClick={onQuit}>
        Quit
      </button>
    </section>
  );
}
