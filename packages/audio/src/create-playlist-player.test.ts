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

const fakeBuffer = { length: 1 } as unknown as AudioBuffer;

function fakeContext(): { context: AudioContext; sources: FakeSource[] } {
  const sources: FakeSource[] = [];
  const context = {
    createBufferSource: vi.fn(() => {
      const source = fakeSource();
      sources.push(source);

      return source;
    }),
    decodeAudioData: vi.fn().mockResolvedValue(fakeBuffer),
  } as unknown as AudioContext;

  return { context, sources };
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

  it('plays a non-looping source connected to the destination', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const destination = {} as AudioNode;
    const player = createPlaylistPlayer(context, destination);

    player.setPlaylist(['/a.mp3']);
    player.play();
    await flushMicrotasks();

    expect(context.createBufferSource).toHaveBeenCalled();
    const source = sources[0];
    expect(source?.buffer).toBe(fakeBuffer);
    expect(source?.loop).not.toBe(true);
    expect(source?.connect).toHaveBeenCalledWith(destination);
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

  it('tears down the current source and starts another on next()', async () => {
    stubOkFetch();
    const { context, sources } = fakeContext();
    const player = createPlaylistPlayer(context, {} as AudioNode);

    player.setPlaylist(['/a.mp3', '/b.mp3']);
    player.play();
    await flushMicrotasks();

    player.next();
    await flushMicrotasks();

    const first = sources[0];
    expect(first?.stop).toHaveBeenCalled();
    expect(first?.disconnect).toHaveBeenCalled();
    expect(context.createBufferSource).toHaveBeenCalledTimes(2);
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
