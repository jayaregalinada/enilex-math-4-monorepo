import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { type AudioContextFactory, createAudioContext } from './create-audio-context';
import { createMusicPlayer, type MusicPlayer } from './create-music-player';
import { createPlaylistPlayer, type PlaylistPlayer } from './create-playlist-player';
import { playSoundEffect, type SoundEffectName } from './play-sound-effect';

/**
 * Which playlist is playing: the shared Home/Easy/Normal pool, Hard's own, or the
 * game-over screen's. `gameOver` has no synth fallback — until a `-game-over` file
 * is added it stays silent, so the loss screen isn't scored by an upbeat tune.
 */
export type MusicContext = 'general' | 'hard' | 'gameOver';

export interface AudioEngineOptions {
  /** Injectable for tests; defaults to a real browser `AudioContext`. */
  contextFactory?: AudioContextFactory;
  muted?: boolean;
  /** Master playback volume, 0–1. Defaults to 1 (full). Muting overrides it to 0. */
  volume?: number;
  /**
   * Background-music file URLs per context. When a context has tracks, the
   * engine shuffles and plays them; otherwise it falls back to the synthesized
   * tune, so music always plays even before any files are added.
   */
  playlists?: Partial<Record<MusicContext, readonly string[]>>;
}

/**
 * The app-facing audio facade. Owns a lazily-created context and a master gain
 * that doubles as the mute control, and exposes SFX + context-driven music.
 */
export interface AudioEngine {
  /** Resume the context after a user gesture (browsers start it suspended). */
  resume: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  /** Set master volume, 0–1. Takes effect immediately unless muted. */
  setVolume: (volume: number) => void;
  playSoundEffect: (name: SoundEffectName) => void;
  /** Switch the background playlist. Same context twice is a no-op (keeps playing). */
  setMusicContext: (context: MusicContext) => void;
  /** Skip to the next track (only affects file playlists, not the synth fallback). */
  skipTrack: () => void;
  stopMusic: () => void;
  dispose: () => void;
}

/** Clamp a volume into the 0–1 range. */
function clampVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume));
}

/** The synth tune to fall back to when a context has no files. */
function fallbackDifficulty(context: MusicContext): Difficulty {
  if (context === 'hard') {
    return 'hard';
  }

  return 'normal';
}

/**
 * Builds an audio engine. The context is created lazily on first use, so
 * constructing the engine is safe outside a browser (it stays silent when no
 * `AudioContext` is available).
 */
export function createAudioEngine(options: AudioEngineOptions = {}): AudioEngine {
  const factory = options.contextFactory ?? createAudioContext;
  const playlists = options.playlists ?? {};
  let context: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let synthPlayer: MusicPlayer | null = null;
  let playlistPlayer: PlaylistPlayer | null = null;
  let muted = options.muted ?? false;
  let volume = clampVolume(options.volume ?? 1);
  let desiredContext: MusicContext | null = null;
  let playingContext: MusicContext | null = null;

  /** The master gain to apply, folding mute into the volume. */
  function effectiveGain(): number {
    return muted ? 0 : volume;
  }

  function ensureContext(): AudioContext | null {
    if (context !== null) {
      return context;
    }

    const created = factory();
    if (created === null) {
      return null;
    }

    const gain = created.createGain();
    gain.gain.value = effectiveGain();
    gain.connect(created.destination);

    context = created;
    masterGain = gain;
    synthPlayer = createMusicPlayer(created, gain);
    playlistPlayer = createPlaylistPlayer(created, gain);

    return context;
  }

  /**
   * Starts the music for `desiredContext`, but only once the context is running
   * (browsers gate audio until a user gesture; `resume` re-invokes this). Playing
   * the same context twice is a no-op, which is what keeps music continuous across
   * Home → Easy/Normal.
   */
  function applyMusic(): void {
    if (context === null || desiredContext === null) {
      return;
    }

    if (context.state === 'suspended') {
      return;
    }

    if (desiredContext === playingContext) {
      return;
    }

    const tracks = playlists[desiredContext] ?? [];
    synthPlayer?.stop();
    playlistPlayer?.stop();

    if (tracks.length > 0) {
      // The game-over jingle plays once; every other context loops its playlist.
      playlistPlayer?.setPlaylist(tracks, { loop: desiredContext !== 'gameOver' });
      playlistPlayer?.play();
    } else if (desiredContext !== 'gameOver') {
      // Every context but game-over loops a synth tune when it has no files.
      // Game-over stays silent until a dedicated `-game-over` track is added.
      synthPlayer?.play(fallbackDifficulty(desiredContext));
    }

    playingContext = desiredContext;
  }

  async function resume(): Promise<void> {
    const active = ensureContext();
    if (active === null) {
      return;
    }

    if (active.state === 'suspended') {
      await active.resume();
    }

    applyMusic();
  }

  function setMuted(next: boolean): void {
    muted = next;

    if (masterGain !== null) {
      masterGain.gain.value = effectiveGain();
    }
  }

  function setVolume(next: number): void {
    volume = clampVolume(next);

    if (masterGain !== null) {
      masterGain.gain.value = effectiveGain();
    }
  }

  function playEffect(name: SoundEffectName): void {
    const active = ensureContext();
    if (active === null || masterGain === null) {
      return;
    }

    playSoundEffect(active, masterGain, name);
  }

  function setMusicContext(next: MusicContext): void {
    ensureContext();
    desiredContext = next;
    applyMusic();
  }

  function skipTrack(): void {
    playlistPlayer?.next();
  }

  function stopMusic(): void {
    desiredContext = null;
    playingContext = null;
    synthPlayer?.stop();
    playlistPlayer?.stop();
  }

  function dispose(): void {
    stopMusic();

    if (context !== null) {
      void context.close();
    }

    context = null;
    masterGain = null;
    synthPlayer = null;
    playlistPlayer = null;
  }

  return {
    resume,
    setMuted,
    setVolume,
    playSoundEffect: playEffect,
    setMusicContext,
    skipTrack,
    stopMusic,
    dispose,
  };
}
