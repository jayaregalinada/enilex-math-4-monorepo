import type { Choice, ChoiceKind } from './choice';
import { PLACES } from './places';
import { roundTo } from './round-to';

/** A teaching note for a chosen option: why it's right, or which mistake it models. */
export interface Explanation {
  kind: ChoiceKind;
  isCorrect: boolean;
  headline: string;
  detail: string;
}

function placeLabel(exponent: number): string {
  return PLACES.find((place) => place.exponent === exponent)?.label ?? `10^${exponent}`;
}

/**
 * Explain a chosen option for "round `value` to the nearest 10^exponent" — the
 * rule for the correct answer, or the specific misconception a distractor models.
 */
export function explain(choice: Choice, value: number, exponent: number): Explanation {
  const rounding = roundTo(value, exponent);
  const place = placeLabel(exponent);
  const rule = rounding.roundedUp
    ? `the digit to the right is ${rounding.lookDigit} (5 or more), so round up`
    : `the digit to the right is ${rounding.lookDigit} (less than 5), so round down`;

  const base = { kind: choice.kind, isCorrect: choice.kind === 'correct' };

  switch (choice.kind) {
    case 'correct':
      return {
        ...base,
        headline: 'Correct!',
        detail: `Since ${rule}, the nearest ${place} is ${rounding.rounded}.`,
      };

    case 'wrongDirection':
      return {
        ...base,
        headline: 'Rounded the wrong way',
        detail: `Check the rule: ${rule}. The nearest ${place} is ${rounding.rounded}, not ${choice.value}.`,
      };

    case 'adjacentPlace':
      return {
        ...base,
        headline: 'Wrong place value',
        detail: `That looks rounded to a neighbouring place. The question asks for the nearest ${place}: ${rounding.rounded}.`,
      };

    case 'truncated':
      return {
        ...base,
        headline: 'Dropped the digits without checking',
        detail: `That just removes the smaller digits. Apply the rule — ${rule} — for the nearest ${place}: ${rounding.rounded}.`,
      };

    case 'didntZero':
      return {
        ...base,
        headline: 'Forgot to zero the rest',
        detail: `You rounded the ${place} digit but kept the digits after it. They become zeros: ${rounding.rounded}.`,
      };

    default:
      return {
        ...base,
        headline: 'Not quite',
        detail: `The nearest ${place} is ${rounding.rounded}.`,
      };
  }
}
