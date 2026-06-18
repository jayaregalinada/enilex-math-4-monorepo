/**
 * Points awarded for a correct answer, given the streak length *after* it.
 * Base 10, plus a combo bonus of `5 × (streak − 2)` once the streak reaches 3.
 * The every-10 milestone bonus is separate — see `milestoneBonus`.
 */
export function scoreFor(streakAfter: number): number {
  return 10 + (streakAfter >= 3 ? 5 * (streakAfter - 2) : 0);
}
