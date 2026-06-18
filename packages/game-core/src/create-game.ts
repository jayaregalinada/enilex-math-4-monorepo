import { createQuestion } from './create-question';
import type { Difficulty } from './difficulty';
import { DIFFICULTY_CONFIG } from './difficulty-config';
import type { GameState } from './game-reducer';
import { nextPlace } from './next-place';
import type { Rng } from './rng';

/**
 * Start a new run. Easy/Normal begin on the player's chosen place value; Hard
 * ignores the choice and picks a random place each question.
 */
export function createGame(
  difficulty: Difficulty,
  startExponent: number,
  rng: Rng = Math.random,
): GameState {
  const config = DIFFICULTY_CONFIG[difficulty];
  const exponent = difficulty === 'hard' ? nextPlace('hard', startExponent, rng) : startExponent;
  return {
    difficulty,
    exponent,
    lives: config.lives,
    maxLives: config.maxLives,
    score: 0,
    streak: 0,
    status: 'playing',
    question: createQuestion(difficulty, exponent, rng),
    lastResult: null,
  };
}
