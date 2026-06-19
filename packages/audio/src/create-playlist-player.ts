import { loadAudioBuffer } from './load-audio-buffer';
import { shuffle } from './shuffle';

/** Cross-fade duration, in seconds, when switching tracks. */
const FADE_SECONDS = 1.5;

/** Options for {@link PlaylistPlayer.setPlaylist}. */
export interface PlaylistOptions {
  /**
   * Loop the playlist (advance on track end, reshuffle when exhausted). Default
   * true. With `loop: false` exactly one track plays — a single random pick from
   * the list — and playback stops when it ends (the one-shot game-over jingle).
   */
  loop?: boolean;
}

/**
 * Plays a playlist of audio files in shuffled order, cross-fading between tracks
 * (on natural end and on manual skip) and reshuffling each time the list is
 * exhausted. With `loop: false` it picks one random track, plays it once, and
 * stops. Each track runs through its own gain node into `destination` (the master
 * gain), so mute/volume still apply.
 */
export interface PlaylistPlayer {
  /** Replace the playlist (reshuffled). Restarts playback if already playing. */
  setPlaylist: (tracks: readonly string[], options?: PlaylistOptions) => void;
  play: () => void;
  stop: () => void;
  /** Skip to the next track. */
  next: () => void;
}

/** One playing (or fading) track: its source and its dedicated fade gain. */
interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

export function createPlaylistPlayer(
  context: AudioContext,
  destination: AudioNode,
): PlaylistPlayer {
  const cache = new Map<string, AudioBuffer>();
  let queue: string[] = [];
  let position = 0;
  let loop = true;
  let current: Voice | null = null;
  let playing = false;
  // Bumped whenever playback is redirected, so a slow buffer load knows it is stale.
  let generation = 0;

  /** Current audio clock time, or 0 for minimal fakes that omit `currentTime`. */
  function now(): number {
    return typeof context.currentTime === 'number' ? context.currentTime : 0;
  }

  /** Ramp a gain param to `target` over `seconds`, tolerant of partial fakes. */
  function rampGain(gain: GainNode, target: number, seconds: number): void {
    const param = gain.gain;
    const at = now();

    try {
      param.cancelScheduledValues?.(at);
      param.setValueAtTime?.(param.value, at);
      param.linearRampToValueAtTime?.(target, at + seconds);
    } catch {
      // A minimal fake param without ramp methods — set the value directly.
      param.value = target;
    }
  }

  /** Fade a voice out and tear it down once the fade completes. */
  function fadeOutVoice(voice: Voice): void {
    voice.source.onended = null;
    rampGain(voice.gain, 0, FADE_SECONDS);

    try {
      voice.source.stop(now() + FADE_SECONDS);
    } catch {
      try {
        voice.source.stop();
      } catch {
        // Already stopped or never started — nothing to do.
      }
    }

    setTimeout(
      () => {
        try {
          voice.source.disconnect();
          voice.gain.disconnect();
        } catch {
          // Already disconnected — nothing to do.
        }
      },
      FADE_SECONDS * 1000 + 50,
    );
  }

  /** Immediately tear down the current voice with no fade (hard stop). */
  function teardownCurrent(): void {
    if (current === null) {
      return;
    }

    current.source.onended = null;

    try {
      current.source.stop();
    } catch {
      // Already stopped or never started — nothing to do.
    }

    try {
      current.source.disconnect();
      current.gain.disconnect();
    } catch {
      // Already disconnected — nothing to do.
    }

    current = null;
  }

  function advance(): void {
    if (queue.length === 0) {
      return;
    }

    position += 1;

    if (position >= queue.length) {
      if (!loop) {
        return;
      }

      queue = shuffle(queue);
      position = 0;
    }

    void playCurrent({ crossfade: true });
  }

  async function playCurrent({ crossfade }: { crossfade: boolean }): Promise<void> {
    const url = queue[position];
    if (url === undefined) {
      return;
    }

    const startedGeneration = generation;
    const previous = current;

    try {
      const buffer = cache.get(url) ?? (await loadAudioBuffer(context, url));
      cache.set(url, buffer);

      if (startedGeneration !== generation || !playing) {
        return;
      }

      const gain = context.createGain();
      gain.connect(destination);
      const node = context.createBufferSource();
      node.buffer = buffer;
      node.connect(gain);
      node.onended = () => {
        // A non-looping context plays a single track, so it never auto-advances.
        if (startedGeneration === generation && playing && loop) {
          advance();
        }
      };

      // Fade in from silence; the previous voice (if any) fades out in parallel.
      gain.gain.value = crossfade ? 0 : 1;
      node.start();
      current = { source: node, gain };

      if (crossfade) {
        rampGain(gain, 1, FADE_SECONDS);

        if (previous !== null) {
          fadeOutVoice(previous);
        }
      }
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
    void playCurrent({ crossfade: false });
  }

  function stop(): void {
    playing = false;
    generation += 1;
    teardownCurrent();
  }

  function next(): void {
    if (!playing) {
      return;
    }

    generation += 1;
    advance();
  }

  function setPlaylist(tracks: readonly string[], options?: PlaylistOptions): void {
    queue = shuffle(tracks);
    position = 0;
    loop = options?.loop ?? true;

    if (!playing) {
      return;
    }

    generation += 1;
    void playCurrent({ crossfade: true });
  }

  return { setPlaylist, play, stop, next };
}
