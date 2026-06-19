/** Creates a Web Audio context, or null where the API is unavailable (SSR, tests). */
export type AudioContextFactory = () => AudioContext | null;

/** Older iOS Safari only exposes the prefixed constructor. */
interface WebkitAudioWindow {
  webkitAudioContext?: typeof AudioContext;
}

/** iOS 16.4+ exposes an audio session whose category we can set. */
interface AudioSessionNavigator {
  audioSession?: { type: string };
}

/**
 * iOS Safari plays Web Audio in the "ambient" session by default, which the
 * hardware ring/silent switch mutes — so a phone on silent hears nothing, even
 * the synthesized sound effects. Declaring "playback" makes game audio sound
 * regardless of the switch. No-op where the API is absent (pre-16.4, other
 * browsers, SSR/tests).
 */
function enablePlaybackAudioSession(): void {
  const session = (globalThis.navigator as (Navigator & AudioSessionNavigator) | undefined)
    ?.audioSession;

  if (session === undefined) {
    return;
  }

  try {
    session.type = 'playback';
  } catch {
    // Some engines expose a read-only audioSession — nothing to do.
  }
}

/**
 * Default factory. Returns null instead of throwing when the Web Audio API is
 * missing, so the engine can degrade to silence rather than crash. Falls back to
 * the `webkit`-prefixed constructor for older iOS, and opts into the "playback"
 * audio session so sound isn't gated by the iPhone silent switch.
 */
export function createAudioContext(): AudioContext | null {
  const Ctor =
    globalThis.AudioContext ?? (globalThis as unknown as WebkitAudioWindow).webkitAudioContext;

  if (Ctor === undefined) {
    return null;
  }

  const context = new Ctor();
  enablePlaybackAudioSession();

  return context;
}
