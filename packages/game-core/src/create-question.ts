import type { Choice } from './choice';
import type { Difficulty } from './difficulty';
import { generateChoices } from './generate-choices';
import { generateNumber } from './generate-number';
import type { Rng } from './rng';
import { roundTo } from './round-to';

/** A single round: the number, the target place, the correct answer, and the options. */
export interface Question {
  value: number;
  exponent: number;
  correct: number;
  choices: Choice[];
}

/** Assemble a question for the given difficulty and place value. */
export function createQuestion(
  difficulty: Difficulty,
  exponent: number,
  rng: Rng = Math.random,
): Question {
  const value = generateNumber(exponent, difficulty, rng);

  return {
    value,
    exponent,
    correct: roundTo(value, exponent).rounded,
    choices: generateChoices(value, exponent, rng),
  };
}
