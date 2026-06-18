import { loadAudioBuffer } from './load-audio-buffer';
import { shuffle } from './shuffle';

/**
 * Plays a playlist of audio files in shuffled order, advancing to the next track
 * when one ends and reshuffling each time the list is exhausted. Supports manual
 * skip. Tracks play through `destination` (the master gain), so mute applies.
 */
export interface PlaylistPlayer {
  /** Replace the playlist (reshuffled). Restarts playback if already playing. */
  setPlaylist: (tracks: readonly string[]) => void;
  play: () => void;
  stop: () => void;
  /** Skip to the next track. */
  next: () => void;
}

export function createPlaylistPlayer(
  context: AudioContext,
  destination: AudioNode,
): PlaylistPlayer {
  const cache = new Map<string, AudioBuffer>();
  let queue: string[] = [];
  let position = 0;
  let source: AudioBufferSourceNode | null = null;
  let playing = false;
  // Bumped whenever playback is redirected, so a slow buffer load knows it is stale.
  let generation = 0;

  function teardownSource(): void {
    if (source === null) {
      return;
    }

    source.onended = null;

    try {
      source.stop();
    } catch {
      // Already stopped or never started — nothing to do.
    }

    source.disconnect();
    source = null;
  }

  function advance(): void {
    if (queue.length === 0) {
      return;
    }

    position += 1;

    if (position >= queue.length) {
      queue = shuffle(queue);
      position = 0;
    }

    void playCurrent();
  }

  async function playCurrent(): Promise<void> {
    const url = queue[position];
    if (url === undefined) {
      return;
    }

    const startedGeneration = generation;

    try {
      const buffer = cache.get(url) ?? (await loadAudioBuffer(context, url));
      cache.set(url, buffer);

      if (startedGeneration !== generation || !playing) {
        return;
      }

      teardownSource();
      const node = context.createBufferSource();
      node.buffer = buffer;
      node.connect(destination);
      node.onended = () => {
        if (startedGeneration === generation && playing) {
          advance();
        }
      };
      node.start();
      source = node;
    } catch {
      if (startedGeneration !== generation || !playing) {
        return;
      }

      // A track failed to load — skip past it rather than stalling the playlist.
      advance();
    }
  }

  function play(): void {
    if (playing || queue.length === 0) {
      return;
    }

    playing = true;
    generation += 1;
    void playCurrent();
  }

  function stop(): void {
    playing = false;
    generation += 1;
    teardownSource();
  }

  function next(): void {
    if (!playing) {
      return;
    }

    generation += 1;
    teardownSource();
    advance();
  }

  function setPlaylist(tracks: readonly string[]): void {
    queue = shuffle(tracks);
    position = 0;

    if (!playing) {
      return;
    }

    generation += 1;
    teardownSource();
    void playCurrent();
  }

  return { setPlaylist, play, stop, next };
}
