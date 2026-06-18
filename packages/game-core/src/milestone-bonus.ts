/** Celebratory +100 awarded every 10th consecutive correct answer (0 otherwise). */
export function milestoneBonus(streakAfter: number): number {
  return streakAfter > 0 && streakAfter % 10 === 0 ? 100 : 0;
}
