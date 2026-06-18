/** The misconception a multiple-choice option models (or `correct`). */
export type ChoiceKind =
  | 'correct'
  | 'wrongDirection'
  | 'adjacentPlace'
  | 'truncated'
  | 'didntZero'
  | 'other';

/** A single multiple-choice option. */
export interface Choice {
  value: number;
  kind: ChoiceKind;
}
