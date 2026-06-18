import { describe, expect, it, vi } from 'vitest';
import { createBufferMusicPlayer } from './create-buffer-music-player';

interface FakeSource {
  buffer: AudioBuffer | null;
  loop: boolean;
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

function fakeSource(): FakeSource {
  return {
    buffer: null,
    loop: false,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  };
}

function fakeContext(): {
  context: AudioContext;
  sources: FakeSource[];
} {
  const sources: FakeSource[] = [];
  const context = {
    createBufferSource: vi.fn(() => {
      const source = fakeSource();
      sources.push(source);

      return source;
    }),
  } as unknown as AudioContext;

  return { context, sources };
}

const buffer = { length: 1 } as unknown as AudioBuffer;

describe('createBufferMusicPlayer', () => {
  it('creates a looping source wired to the destination and starts it on play', () => {
    const { context, sources } = fakeContext();
    const destination = {} as AudioNode;
    const player = createBufferMusicPlayer(context, destination);

    player.play(buffer);

    expect(context.createBufferSource).toHaveBeenCalledOnce();
    const source = sources[0];
    expect(source?.buffer).toBe(buffer);
    expect(source?.loop).toBe(true);
    expect(source?.connect).toHaveBeenCalledWith(destination);
    expect(source?.start).toHaveBeenCalledOnce();
  });

  it('stops and disconnects the current source on stop', () => {
    const { context, sources } = fakeContext();
    const player = createBufferMusicPlayer(context, {} as AudioNode);

    player.play(buffer);
    player.stop();

    const source = sources[0];
    expect(source?.stop).toHaveBeenCalledOnce();
    expect(source?.disconnect).toHaveBeenCalledOnce();
  });

  it('does nothing on stop when nothing is playing', () => {
    const { context } = fakeContext();
    const player = createBufferMusicPlayer(context, {} as AudioNode);

    expect(() => player.stop()).not.toThrow();
    expect(context.createBufferSource).not.toHaveBeenCalled();
  });

  it('tears down the first source before starting the second on a repeat play', () => {
    const { context, sources } = fakeContext();
    const player = createBufferMusicPlayer(context, {} as AudioNode);

    player.play(buffer);
    player.play(buffer);

    expect(context.createBufferSource).toHaveBeenCalledTimes(2);
    const [first, second] = sources;
    expect(first?.stop).toHaveBeenCalledOnce();
    expect(first?.disconnect).toHaveBeenCalledOnce();
    expect(second?.start).toHaveBeenCalledOnce();
    expect(second?.stop).not.toHaveBeenCalled();
  });
});
