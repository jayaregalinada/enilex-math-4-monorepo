import type { AudioEngine } from '@enilex-math-4-pkg/audio';
import type { GameState } from '@enilex-math-4-pkg/game-core';

/** A streak this long (and every multiple of it) earns the celebratory streak sound. */
const STREAK_SOUND_EVERY = 5;

/**
 * Translates a session transition into SFX, playing one sound for each
 * newly-landed answer result. Background music is handled separately (it follows
 * the music context, not the session — see `useAudio`). Pure aside from the
 * engine calls, so it can be unit-tested with a fake engine.
 */
export function reactToSession(
  engine: AudioEngine,
  game: GameState | null,
  previous: GameState | null,
): void {
  if (game === null) {
    return;
  }

  const result = game.lastResult;
  const previousResult = previous?.lastResult ?? null;

  // Only fire when a genuinely new result has landed.
  if (result === null || result === previousResult) {
    return;
  }

  if (game.status === 'gameOver') {
    engine.playSoundEffect('gameOver');

    return;
  }

  if (!result.correct) {
    engine.playSoundEffect('wrong');

    return;
  }

  if (result.lifeGained) {
    engine.playSoundEffect('lifeGained');

    return;
  }

  const isStreakMilestone =
    result.streakAfter >= STREAK_SOUND_EVERY && result.streakAfter % STREAK_SOUND_EVERY === 0;
  engine.playSoundEffect(isStreakMilestone ? 'streak' : 'correct');
}
