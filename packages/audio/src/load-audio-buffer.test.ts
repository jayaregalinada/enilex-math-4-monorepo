import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadAudioBuffer } from './load-audio-buffer';

const fakeBuffer = { length: 1 } as unknown as AudioBuffer;

function fakeContext(): {
  context: AudioContext;
  decodeAudioData: ReturnType<typeof vi.fn>;
} {
  const decodeAudioData = vi.fn().mockResolvedValue(fakeBuffer);
  const context = { decodeAudioData } as unknown as AudioContext;

  return { context, decodeAudioData };
}

function fakeResponse(ok: boolean, status: number, encoded: ArrayBuffer): Response {
  return {
    ok,
    status,
    arrayBuffer: vi.fn().mockResolvedValue(encoded),
  } as unknown as Response;
}

describe('loadAudioBuffer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the decoded buffer when the response is ok', async () => {
    const encoded = new ArrayBuffer(8);
    const { context, decodeAudioData } = fakeContext();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse(true, 200, encoded)));

    const result = await loadAudioBuffer(context, '/music/easy.mp3');

    expect(result).toBe(fakeBuffer);
    expect(decodeAudioData).toHaveBeenCalledWith(encoded);
  });

  it('rejects when the response is not ok', async () => {
    const { context } = fakeContext();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse(false, 404, new ArrayBuffer(0))));

    await expect(loadAudioBuffer(context, '/music/missing.mp3')).rejects.toThrow();
  });
});
