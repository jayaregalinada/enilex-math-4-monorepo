/** Creates a Web Audio context, or null where the API is unavailable (SSR, tests). */
export type AudioContextFactory = () => AudioContext | null;

/**
 * Default factory. Returns null instead of throwing when `AudioContext` is
 * missing, so the engine can degrade to silence rather than crash.
 */
export function createAudioContext(): AudioContext | null {
  if (typeof globalThis.AudioContext === 'undefined') {
    return null;
  }

  return new globalThis.AudioContext();
}
