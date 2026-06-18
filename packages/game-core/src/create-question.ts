import type { Choice } from './choice';
import type { Difficulty } from './difficulty';
import { generateChoices } from './generate-choices';
import { generateNumber } from './generate-number';
import type { Rng } from './rng';
import { roundTo } from './round-to';

/** A single round: the number, the target place, the correct answer, and the options. */
export interface Question {
  n: number;
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
  const n = generateNumber(exponent, difficulty, rng);
  return {
    n,
    exponent,
    correct: roundTo(n, exponent).rounded,
    choices: generateChoices(n, exponent, rng),
  };
}
