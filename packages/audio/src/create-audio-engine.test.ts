import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAudioEngine } from './create-audio-engine';

interface FakeGain {
  gain: { value: number };
  connect: ReturnType<typeof vi.fn>;
}

interface FakeContext {
  destination: AudioNode;
  state: AudioContextState;
  currentTime: number;
  createGain: ReturnType<typeof vi.fn>;
  createOscillator: ReturnType<typeof vi.fn>;
  createBufferSource: ReturnType<typeof vi.fn>;
  decodeAudioData: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
}

const fakeAudioBuffer = { length: 1 } as unknown as AudioBuffer;

function fakeBufferSource() {
  return {
    buffer: null as AudioBuffer | null,
    loop: false,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  };
}

function fakeParam() {
  return {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

function fakeContext(state: AudioContextState = 'suspended'): {
  context: FakeContext;
  masterGain: FakeGain;
} {
  // The first createGain is the engine's master gain (it reads/writes .gain.value);
  // later ones are per-tone envelopes that need the AudioParam ramp methods.
  const masterGain: FakeGain = { gain: { value: 1 }, connect: vi.fn() };
  let createdGains = 0;
  const context: FakeContext = {
    destination: {} as AudioNode,
    state,
    currentTime: 0,
    createGain: vi.fn(() => {
      createdGains += 1;
      if (createdGains === 1) {
        return masterGain;
      }

      return { gain: fakeParam(), connect: vi.fn() };
    }),
    createOscillator: vi.fn(() => ({
      type: 'sine' as OscillatorType,
      frequency: fakeParam(),
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createBufferSource: vi.fn(() => fakeBufferSource()),
    decodeAudioData: vi.fn().mockResolvedValue(fakeAudioBuffer),
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
  };

  return { context, masterGain };
}

describe('createAudioEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates the context lazily — not until first use', () => {
    const factory = vi.fn(() => fakeContext().context as unknown as AudioContext);

    createAudioEngine({ contextFactory: factory });

    expect(factory).not.toHaveBeenCalled();
  });

  it('creates the context once, on first use', async () => {
    const { context } = fakeContext();
    const factory = vi.fn(() => context as unknown as AudioContext);
    const engine = createAudioEngine({ contextFactory: factory });

    await engine.resume();
    engine.playSoundEffect('tap');

    expect(factory).toHaveBeenCalledOnce();
  });

  it('resumes the context only when it is suspended', async () => {
    const { context } = fakeContext('suspended');
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    await engine.resume();

    expect(context.resume).toHaveBeenCalledOnce();
  });

  it('does not resume a running context', async () => {
    const { context } = fakeContext('running');
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    await engine.resume();

    expect(context.resume).not.toHaveBeenCalled();
  });

  it('sets the master gain to 0 when muted and 1 when unmuted', async () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    await engine.resume();

    engine.setMuted(true);
    expect(masterGain.gain.value).toBe(0);

    engine.setMuted(false);
    expect(masterGain.gain.value).toBe(1);
  });

  it('starts the lazily-created gain muted when constructed with muted: true', async () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
      muted: true,
    });

    await engine.resume();

    expect(masterGain.gain.value).toBe(0);
  });

  it('routes a sound effect through the master gain', () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    engine.playSoundEffect('tap');

    // The single tap oscillator connects toward the master gain chain.
    expect(context.createOscillator).toHaveBeenCalled();
    const oscillator = (context.createOscillator as ReturnType<typeof vi.fn>).mock.results[0]
      ?.value;
    // Envelope connects to the master gain destination.
    expect(masterGain.connect).toHaveBeenCalledWith(context.destination);
    expect(oscillator.connect).toHaveBeenCalled();
  });

  it('starts and stops music without throwing', () => {
    const { context } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    expect(() => engine.startMusic('easy')).not.toThrow();
    expect(() => engine.stopMusic()).not.toThrow();
  });

  it('is a safe no-op for every method when the factory returns null', async () => {
    const engine = createAudioEngine({ contextFactory: () => null });

    await expect(engine.resume()).resolves.toBeUndefined();
    expect(() => engine.setMuted(true)).not.toThrow();
    expect(() => engine.playSoundEffect('tap')).not.toThrow();
    expect(() => engine.startMusic('easy')).not.toThrow();
    expect(() => engine.stopMusic()).not.toThrow();
    expect(() => engine.dispose()).not.toThrow();
  });

  it('closes the context on dispose', () => {
    const { context } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    engine.playSoundEffect('tap');
    engine.dispose();

    expect(context.close).toHaveBeenCalledOnce();
  });

  describe('authored music sources', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    // The file path awaits fetch → arrayBuffer → decodeAudioData, all microtasks
    // (not timers), so a few ticks flush them even under fake timers.
    async function flushMicrotasks(): Promise<void> {
      for (let i = 0; i < 5; i += 1) {
        await Promise.resolve();
      }
    }

    function okFetch(): ReturnType<typeof vi.fn> {
      return vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as unknown as Response);
    }

    it('uses the synth path (no buffer source) when a difficulty has no URL', () => {
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
      });

      expect(() => engine.startMusic('easy')).not.toThrow();
      expect(context.createBufferSource).not.toHaveBeenCalled();
    });

    it('falls back to the synth (no buffer source) when the file fails to load', async () => {
      const { context } = fakeContext();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        musicSources: { easy: '/music/easy.mp3' },
      });

      expect(() => engine.startMusic('easy')).not.toThrow();
      await flushMicrotasks();

      expect(context.createBufferSource).not.toHaveBeenCalled();
    });

    it('plays the authored buffer (creates a buffer source) when the file loads', async () => {
      const { context } = fakeContext();
      vi.stubGlobal('fetch', okFetch());
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        musicSources: { easy: '/music/easy.mp3' },
      });

      engine.startMusic('easy');
      await flushMicrotasks();

      expect(context.decodeAudioData).toHaveBeenCalled();
      expect(context.createBufferSource).toHaveBeenCalledOnce();
    });
  });
});
