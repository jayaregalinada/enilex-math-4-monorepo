/**
 * Fetches and decodes an audio file into an `AudioBuffer`. Throws on a network
 * or decode failure so callers can fall back (e.g. to synthesized music).
 */
export async function loadAudioBuffer(context: AudioContext, url: string): Promise<AudioBuffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load audio "${url}" (${response.status})`);
  }

  const encoded = await response.arrayBuffer();

  return context.decodeAudioData(encoded);
}
