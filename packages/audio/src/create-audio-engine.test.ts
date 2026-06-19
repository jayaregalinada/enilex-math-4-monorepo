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
    // Browsers gate audio until resumed; flip to 'running' so the engine's
    // music-gate (`applyMusic` only plays when not suspended) opens.
    resume: vi.fn(async () => {
      context.state = 'running';
    }),
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

  it('applies volume to the master gain, with mute overriding it', async () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    await engine.resume();

    engine.setVolume(0.5);
    expect(masterGain.gain.value).toBe(0.5);

    // Muting forces 0 regardless of volume; unmuting restores the set volume.
    engine.setMuted(true);
    expect(masterGain.gain.value).toBe(0);

    engine.setMuted(false);
    expect(masterGain.gain.value).toBe(0.5);
  });

  it('clamps volume into 0–1', async () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    await engine.resume();

    engine.setVolume(5);
    expect(masterGain.gain.value).toBe(1);

    engine.setVolume(-1);
    expect(masterGain.gain.value).toBe(0);
  });

  it('starts the lazily-created gain at the constructed volume', async () => {
    const { context, masterGain } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
      volume: 0.3,
    });

    await engine.resume();

    expect(masterGain.gain.value).toBe(0.3);
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

  it('switches music context and stops without throwing', () => {
    const { context } = fakeContext();
    const engine = createAudioEngine({
      contextFactory: () => context as unknown as AudioContext,
    });

    expect(() => engine.setMusicContext('general')).not.toThrow();
    expect(() => engine.skipTrack()).not.toThrow();
    expect(() => engine.stopMusic()).not.toThrow();
  });

  it('is a safe no-op for every method when the factory returns null', async () => {
    const engine = createAudioEngine({ contextFactory: () => null });

    await expect(engine.resume()).resolves.toBeUndefined();
    expect(() => engine.setMuted(true)).not.toThrow();
    expect(() => engine.setVolume(0.5)).not.toThrow();
    expect(() => engine.playSoundEffect('tap')).not.toThrow();
    expect(() => engine.setMusicContext('general')).not.toThrow();
    expect(() => engine.skipTrack()).not.toThrow();
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

  describe('music contexts', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    // The playlist load path awaits fetch → arrayBuffer → decodeAudioData, all
    // microtasks (not timers), so a few ticks flush them even under fake timers.
    async function flushMicrotasks(): Promise<void> {
      for (let i = 0; i < 8; i += 1) {
        await Promise.resolve();
      }
    }

    function stubOkFetch(): void {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as Response),
      );
    }

    it('plays the playlist (creates a buffer source) when the context has tracks', async () => {
      stubOkFetch();
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        playlists: { general: ['/a.mp3'] },
      });

      // resume() flips the fake context to 'running' so the music gate opens.
      await engine.resume();
      engine.setMusicContext('general');
      await flushMicrotasks();

      expect(context.decodeAudioData).toHaveBeenCalled();
      expect(context.createBufferSource).toHaveBeenCalled();
    });

    it('falls back to the synth (no buffer source) when the context has no tracks', async () => {
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
      });

      await engine.resume();
      engine.setMusicContext('general');
      await flushMicrotasks();

      expect(context.createBufferSource).not.toHaveBeenCalled();
    });

    it('stays silent on game-over with no tracks — no playlist and no synth fallback', async () => {
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
      });

      await engine.resume();
      // createOscillator may run during resume's synth setup for other contexts;
      // clear it so we only measure what game-over triggers.
      (context.createOscillator as ReturnType<typeof vi.fn>).mockClear();
      engine.setMusicContext('gameOver');
      await flushMicrotasks();

      // Empty game-over pool: neither a file (buffer source) nor the synth (oscillator).
      expect(context.createBufferSource).not.toHaveBeenCalled();
      expect(context.createOscillator).not.toHaveBeenCalled();
    });

    it('plays the game-over track when its pool has files', async () => {
      stubOkFetch();
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        playlists: { gameOver: ['/sad.mp3'] },
      });

      await engine.resume();
      engine.setMusicContext('gameOver');
      await flushMicrotasks();

      expect(context.createBufferSource).toHaveBeenCalled();
    });

    it('does not restart when set to the same context twice', async () => {
      stubOkFetch();
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        playlists: { general: ['/a.mp3'] },
      });

      await engine.resume();
      engine.setMusicContext('general');
      await flushMicrotasks();
      const createdOnce = (context.createBufferSource as ReturnType<typeof vi.fn>).mock.calls
        .length;

      engine.setMusicContext('general');
      await flushMicrotasks();

      // Same context is a no-op: no additional source beyond the first track.
      expect(context.createBufferSource).toHaveBeenCalledTimes(createdOnce);
    });

    it('skipTrack does not throw', () => {
      const { context } = fakeContext();
      const engine = createAudioEngine({
        contextFactory: () => context as unknown as AudioContext,
        playlists: { general: ['/a.mp3'] },
      });

      expect(() => engine.skipTrack()).not.toThrow();
    });
  });
});
