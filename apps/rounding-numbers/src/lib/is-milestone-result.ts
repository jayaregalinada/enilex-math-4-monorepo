import type { GameState } from '@enilex-math-4-pkg/game-core';

/** Every Nth correct answer in a streak is a milestone (matches the +100 bonus). */
const MILESTONE_EVERY = 10;

/**
 * True when the latest transition is a freshly-landed correct answer that hits a
 * streak milestone — the moment worth a confetti burst. Pure, so it's easy to
 * test; the celebration hook just wires it to `celebrate`.
 */
export function isMilestoneResult(game: GameState | null, previous: GameState | null): boolean {
  if (game === null) {
    return false;
  }

  const result = game.lastResult;
  const previousResult = previous?.lastResult ?? null;

  if (result === null || result === previousResult) {
    return false;
  }

  if (!result.correct) {
    return false;
  }

  return result.streakAfter > 0 && result.streakAfter % MILESTONE_EVERY === 0;
}
