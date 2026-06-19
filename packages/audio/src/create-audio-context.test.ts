import { afterEach, describe, expect, it } from 'vitest';
import { createAudioContext } from './create-audio-context';

/** Minimal stand-in so we can construct one without a real browser. */
class StubAudioContext {}

const original = globalThis.AudioContext;

type Mutable = {
  AudioContext?: unknown;
  webkitAudioContext?: unknown;
  navigator?: unknown;
};

describe('createAudioContext', () => {
  afterEach(() => {
    const globals = globalThis as Mutable;
    delete globals.webkitAudioContext;
    delete globals.navigator;

    if (original === undefined) {
      // Restore the global to its originally-absent state.
      delete globals.AudioContext;

      return;
    }

    globalThis.AudioContext = original;
  });

  it('returns null when AudioContext is unavailable', () => {
    // Simulate an environment without Web Audio (neither standard nor prefixed).
    const globals = globalThis as Mutable;
    delete globals.AudioContext;
    delete globals.webkitAudioContext;

    expect(createAudioContext()).toBeNull();
  });

  it('returns an instance when AudioContext is available', () => {
    (globalThis as Mutable).AudioContext = StubAudioContext;

    expect(createAudioContext()).toBeInstanceOf(StubAudioContext);
  });

  it('falls back to the webkit-prefixed constructor (older iOS Safari)', () => {
    const globals = globalThis as Mutable;
    delete globals.AudioContext;
    globals.webkitAudioContext = StubAudioContext;

    expect(createAudioContext()).toBeInstanceOf(StubAudioContext);
  });

  it('opts into the "playback" audio session so the iPhone silent switch is ignored', () => {
    const globals = globalThis as Mutable;
    globals.AudioContext = StubAudioContext;
    const session = { type: 'auto' };
    globals.navigator = { audioSession: session };

    createAudioContext();

    expect(session.type).toBe('playback');
  });

  it('still constructs a context when no audio session API exists', () => {
    const globals = globalThis as Mutable;
    globals.AudioContext = StubAudioContext;
    globals.navigator = {};

    expect(createAudioContext()).toBeInstanceOf(StubAudioContext);
  });
});
