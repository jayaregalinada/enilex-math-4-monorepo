import { afterEach, describe, expect, it } from 'vitest';
import { createAudioContext } from './create-audio-context';

/** Minimal stand-in so we can construct one without a real browser. */
class StubAudioContext {}

const original = globalThis.AudioContext;

describe('createAudioContext', () => {
  afterEach(() => {
    if (original === undefined) {
      // Restore the global to its originally-absent state.
      delete (globalThis as { AudioContext?: unknown }).AudioContext;

      return;
    }

    globalThis.AudioContext = original;
  });

  it('returns null when AudioContext is unavailable', () => {
    // Simulate an environment without Web Audio.
    delete (globalThis as { AudioContext?: unknown }).AudioContext;

    expect(createAudioContext()).toBeNull();
  });

  it('returns an instance when AudioContext is available', () => {
    (globalThis as { AudioContext: unknown }).AudioContext = StubAudioContext;

    expect(createAudioContext()).toBeInstanceOf(StubAudioContext);
  });
});
