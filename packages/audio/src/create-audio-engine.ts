import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { type AudioContextFactory, createAudioContext } from './create-audio-context';
import { type BufferMusicPlayer, createBufferMusicPlayer } from './create-buffer-music-player';
import { createMusicPlayer, type MusicPlayer } from './create-music-player';
import { loadAudioBuffer } from './load-audio-buffer';
import { playSoundEffect, type SoundEffectName } from './play-sound-effect';

export interface AudioEngineOptions {
  /** Injectable for tests; defaults to a real browser `AudioContext`. */
  contextFactory?: AudioContextFactory;
  muted?: boolean;
  /**
   * Authored background-music URLs per difficulty. When a difficulty has a URL,
   * the engine plays the file; if it is missing or fails to load, it falls back
   * to the synthesized tune. Difficulties with no URL always use the synth.
   */
  musicSources?: Partial<Record<Difficulty, string>>;
}

/**
 * The app-facing audio facade. Owns a lazily-created context and a master gain
 * that doubles as the mute control, and exposes SFX + looping music.
 */
export interface AudioEngine {
  /** Resume the context after a user gesture (browsers start it suspended). */
  resume: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  playSoundEffect: (name: SoundEffectName) => void;
  startMusic: (difficulty: Difficulty) => void;
  stopMusic: () => void;
  dispose: () => void;
}

/**
 * Builds an audio engine. The context is created lazily on first use, so
 * constructing the engine is safe outside a browser (it stays silent when no
 * `AudioContext` is available).
 */
export function createAudioEngine(options: AudioEngineOptions = {}): AudioEngine {
  const factory = options.contextFactory ?? createAudioContext;
  const musicSources = options.musicSources ?? {};
  const bufferCache = new Map<string, AudioBuffer>();
  let context: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let synthPlayer: MusicPlayer | null = null;
  let bufferPlayer: BufferMusicPlayer | null = null;
  let muted = options.muted ?? false;
  // Bumped on every stop/start so a slow file load can tell it has been superseded.
  let musicGeneration = 0;

  function ensureContext(): AudioContext | null {
    if (context !== null) {
      return context;
    }

    const created = factory();
    if (created === null) {
      return null;
    }

    const gain = created.createGain();
    gain.gain.value = muted ? 0 : 1;
    gain.connect(created.destination);

    context = created;
    masterGain = gain;
    synthPlayer = createMusicPlayer(created, gain);
    bufferPlayer = createBufferMusicPlayer(created, gain);

    return context;
  }

  async function resume(): Promise<void> {
    const active = ensureContext();
    if (active === null) {
      return;
    }

    if (active.state === 'suspended') {
      await active.resume();
    }
  }

  function setMuted(next: boolean): void {
    muted = next;

    if (masterGain !== null) {
      masterGain.gain.value = next ? 0 : 1;
    }
  }

  function playEffect(name: SoundEffectName): void {
    const active = ensureContext();
    if (active === null || masterGain === null) {
      return;
    }

    playSoundEffect(active, masterGain, name);
  }

  async function playFileOrFallback(
    active: AudioContext,
    difficulty: Difficulty,
    url: string,
    generation: number,
  ): Promise<void> {
    try {
      const buffer = bufferCache.get(url) ?? (await loadAudioBuffer(active, url));
      bufferCache.set(url, buffer);

      // Bail if music was stopped or switched while the file was loading.
      if (generation !== musicGeneration) {
        return;
      }

      bufferPlayer?.play(buffer);
    } catch {
      if (generation !== musicGeneration) {
        return;
      }

      // Authored file missing or unsupported — fall back to the synthesized tune.
      synthPlayer?.play(difficulty);
    }
  }

  function startMusic(difficulty: Difficulty): void {
    const active = ensureContext();
    if (active === null) {
      return;
    }

    stopMusic();
    const generation = musicGeneration;
    const url = musicSources[difficulty];

    if (url === undefined) {
      synthPlayer?.play(difficulty);

      return;
    }

    void playFileOrFallback(active, difficulty, url, generation);
  }

  function stopMusic(): void {
    musicGeneration += 1;
    synthPlayer?.stop();
    bufferPlayer?.stop();
  }

  function dispose(): void {
    stopMusic();

    if (context !== null) {
      void context.close();
    }

    bufferCache.clear();
    context = null;
    masterGain = null;
    synthPlayer = null;
    bufferPlayer = null;
  }

  return {
    resume,
    setMuted,
    playSoundEffect: playEffect,
    startMusic,
    stopMusic,
    dispose,
  };
}
