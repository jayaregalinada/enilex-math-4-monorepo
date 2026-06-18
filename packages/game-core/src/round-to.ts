/** Everything the UI needs to render a rounding result and its explanation. */
export interface RoundResult {
  /** The rounded value. */
  rounded: number;
  /** Nearest multiple of 10^exponent at or below the input (the lower endpoint). */
  lower: number;
  /** Nearest multiple of 10^exponent above `lower` (the upper endpoint). */
  upper: number;
  /** The digit currently sitting in the target place. */
  targetDigit: number;
  /** The digit immediately to the right of the target place (drives the rule). */
  lookDigit: number;
  /** Whether the look digit (≥5) rounded the value up to `upper`. */
  roundedUp: boolean;
}

/**
 * Round `value` to the nearest 10^exponent using the half-up rule the lesson
 * teaches (look digit 5 or greater rounds up). Carries/cascades fall out naturally
 * because `upper = lower + 10^exponent` (e.g. 95,500 → 100,000 to the nearest ten
 * thousand).
 */
export function roundTo(value: number, exponent: number): RoundResult {
  const placeValue = 10 ** exponent;
  const lookPlaceValue = 10 ** (exponent - 1);
  const lower = Math.floor(value / placeValue) * placeValue;
  const upper = lower + placeValue;
  const targetDigit = Math.floor(value / placeValue) % 10;
  const lookDigit = Math.floor(value / lookPlaceValue) % 10;
  const roundedUp = lookDigit >= 5;

  return { rounded: roundedUp ? upper : lower, lower, upper, targetDigit, lookDigit, roundedUp };
}
