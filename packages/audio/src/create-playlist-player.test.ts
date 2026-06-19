import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlaylistPlayer } from './create-playlist-player';

interface FakeSource {
  buffer: AudioBuffer | null;
  loop: boolean;
  onended: (() => void) | null;
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

interface FakeGain {
  gain: {
    value: number;
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
    cancelScheduledValues: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

function fakeSource(): FakeSource {
  return {
    buffer: null,
    loop: false,
    onended: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  };
}

function fakeGain(): FakeGain {
  return {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

const fakeBuffer = { length: 1 } as unknown as AudioBuffer;

function fakeContext(): { context: AudioContext; sources: FakeSource[]; gains: FakeGain[] } {
  const sources: FakeSource[] = [];
  const gains: FakeGain[] = [];
  const context = {
    currentTime: 0,
    createBufferSource: vi.fn(() => {
      const source = fakeSource();
      sources.push(source);

      return source;
    }),
    createGain: vi.fn(() => {
      const gain = fakeGain();
      gains.push(gain);

      return gain;
    }),
    decodeAudioData: vi.fn().mockResolvedValue(fakeBuffer),
  } as unknown as AudioContext;

  return { context, sources, gains };
}

// The load chain (fetch → arrayBuffer → decodeAudioData) is all microtasks, so a
// few ticks settle it. `advance` after an `onended` adds another load, hence loop.
async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 8; i += 1) {
    await Promise.resolve();
  }
}

describe('createPlaylistPlayer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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

  it('plays a non-looping source through a gain into the destination', async () => {
    stubOkFetch();
    const { context, sources, gains } = fakeContext();
    const destination = {} as AudioNode;
    const player = createPlaylistPlayer(context, destination);

    player.setPlaylist(['/a.mp3']);
    player.play();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalled();
    const source = sources[0];
    const gain = gains[0];
    expect(source?.buffer).toBe(fakeBuffer);
    expect(source?.loop).not.toBe(true);
    // The source runs into its fade gain, which runs into the destination.
    expect(source?.connect).toHaveBeenCalledWith(gain);
    expect(gain?.connect).toHaveBeenCalledWith(destination);
    expect(source?.start).toHaveBeenCalledOnce();
  });

  it('advances to another track when the current one ends', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.setPlaylist(['/a.mp3', '/b.mp3']);
    player.play();
    await flushMicrotasks();
    expect(sources).toHaveLength(1);

    // Simulate the first track ending.
    sources[0]?.onended?.();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalledTimes(2);
  });

  it('cross-fades to the next track on next()', async () => {
    stubOkFetch();
    const { context, sources, gains } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.setPlaylist(['/a.mp3', '/b.mp3']);
    player.play();
    await flushMicrotasks();

    player.next();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalledTimes(2);
    // The outgoing track is stopped and ramped down; the incoming one ramps up.
    expect(sources[0]?.stop).toHaveBeenCalled();
    expect(gains[0]?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));
    expect(gains[1]?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, expect.any(Number));
  });

  it('reshuffles and keeps playing when a looping queue is exhausted', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.setPlaylist(['/a.mp3']); // loops by default
    player.play();
    await flushMicrotasks();

    sources[0]?.onended?.();
    await flushMicrotasks();

    // Single-track loop replays from the top: a second source is created.
    expect(context.createBufferSource).toHaveBeenCalledTimes(2);
  });

  it('picks one track and stops at its end when loop is false', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    // Multiple tracks available, but loop:false must play exactly one of them.
    player.setPlaylist(['/a.mp3', '/b.mp3', '/c.mp3'], { loop: false });
    player.play();
    await flushMicrotasks();
    expect(context.createBufferSource).toHaveBeenCalledTimes(1);

    // When that single track ends, playback stops — no advance to the others.
    sources[0]?.onended?.();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalledTimes(1);
  });

  it('stops playback so an ended track does not advance', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.setPlaylist(['/a.mp3', '/b.mp3']);
    player.play();
    await flushMicrotasks();
    expect(context.createBufferSource).toHaveBeenCalledTimes(1);

    player.stop();
    // The detached source's onended must not schedule another track.
    sources[0]?.onended?.();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalledTimes(1);
  });

  it('does not create a source when the playlist is empty', async () => {
    stubOkFetch();
    const { context } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.play();
    await flushMicrotasks();

    expect(context.createBufferSource).not.toHaveBeenCalled();
  });
});
