/** One rung of the place-value ladder. `exponent` is the power of ten (10^exponent). */
export interface Place {
  index: number;
  label: string;
  exponent: number;
}

/**
 * The eight supported place values, smallest to largest (index 0..7).
 * `exponent` runs 1..8: tens (10^1) … hundred millions (10^8).
 */
export const PLACES: readonly Place[] = [
  { index: 0, label: 'tens', exponent: 1 },
  { index: 1, label: 'hundreds', exponent: 2 },
  { index: 2, label: 'thousands', exponent: 3 },
  { index: 3, label: 'ten thousands', exponent: 4 },
  { index: 4, label: 'hundred thousands', exponent: 5 },
  { index: 5, label: 'millions', exponent: 6 },
  { index: 6, label: 'ten millions', exponent: 7 },
  { index: 7, label: 'hundred millions', exponent: 8 },
];
