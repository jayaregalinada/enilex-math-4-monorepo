import type { Question } from './create-question';
import { createQuestion } from './create-question';
import type { Difficulty } from './difficulty';
import { DIFFICULTY_CONFIG } from './difficulty-config';
import { milestoneBonus } from './milestone-bonus';
import { nextPlace } from './next-place';
import type { Rng } from './rng';
import { scoreFor } from './score-for';

export type GameStatus = 'playing' | 'answered' | 'paused' | 'gameOver';

/** The outcome of the most recent answer — enough to drive audio and animation. */
export interface AnswerResult {
  correct: boolean;
  chosenValue: number | null;
  correctValue: number;
  missed: boolean;
  gained: number;
  streakAfter: number;
  lifeLost: boolean;
  lifeGained: boolean;
}

export interface GameState {
  difficulty: Difficulty;
  exponent: number;
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  status: GameStatus;
  question: Question;
  lastResult: AnswerResult | null;
}

export type GameAction =
  | { type: 'answer'; value: number }
  | { type: 'timeout' }
  | { type: 'next'; rng?: Rng }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'quit' };

function resolveAnswer(state: GameState, value: number | null, missed: boolean): GameState {
  const config = DIFFICULTY_CONFIG[state.difficulty];
  const isCorrect = !missed && value === state.question.correct;

  if (isCorrect) {
    const streakAfter = state.streak + 1;
    const gained = scoreFor(streakAfter) + milestoneBonus(streakAfter);
    const lifeGained =
      config.regain &&
      config.regainEvery !== null &&
      streakAfter % config.regainEvery === 0 &&
      state.lives < state.maxLives;
    const lives = lifeGained ? state.lives + 1 : state.lives;
    return {
      ...state,
      lives,
      score: state.score + gained,
      streak: streakAfter,
      status: 'answered',
      lastResult: {
        correct: true,
        chosenValue: value,
        correctValue: state.question.correct,
        missed: false,
        gained,
        streakAfter,
        lifeLost: false,
        lifeGained,
      },
    };
  }

  const lives = state.lives - 1;
  return {
    ...state,
    lives,
    streak: 0,
    status: lives <= 0 ? 'gameOver' : 'answered',
    lastResult: {
      correct: false,
      chosenValue: value,
      correctValue: state.question.correct,
      missed,
      gained: 0,
      streakAfter: 0,
      lifeLost: true,
      lifeGained: false,
    },
  };
}

/**
 * Pure state machine for a survival run. The app wires timers, audio, and
 * animation to its transitions; all rules and scoring live here.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'answer':
      return state.status === 'playing' ? resolveAnswer(state, action.value, false) : state;
    case 'timeout':
      return state.status === 'playing' ? resolveAnswer(state, null, true) : state;
    case 'next': {
      if (state.status !== 'answered') return state;
      if (state.lives <= 0) return { ...state, status: 'gameOver' };
      const rng = action.rng ?? Math.random;
      const exponent = nextPlace(state.difficulty, state.exponent, rng);
      return {
        ...state,
        exponent,
        question: createQuestion(state.difficulty, exponent, rng),
        status: 'playing',
        lastResult: null,
      };
    }
    case 'pause':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state;
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state;
    case 'quit':
      return { ...state, status: 'gameOver' };
    default:
      return state;
  }
}
