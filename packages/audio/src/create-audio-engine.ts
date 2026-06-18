import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { type AudioContextFactory, createAudioContext } from './create-audio-context';
import { createMusicPlayer, type MusicPlayer } from './create-music-player';
import { playSoundEffect, type SoundEffectName } from './play-sound-effect';

export interface AudioEngineOptions {
  /** Injectable for tests; defaults to a real browser `AudioContext`. */
  contextFactory?: AudioContextFactory;
  muted?: boolean;
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
  let context: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let musicPlayer: MusicPlayer | null = null;
  let muted = options.muted ?? false;

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
    musicPlayer = createMusicPlayer(created, gain);

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

  function startMusic(difficulty: Difficulty): void {
    ensureContext();
    if (musicPlayer === null) {
      return;
    }

    musicPlayer.play(difficulty);
  }

  function stopMusic(): void {
    if (musicPlayer === null) {
      return;
    }

    musicPlayer.stop();
  }

  function dispose(): void {
    stopMusic();

    if (context !== null) {
      void context.close();
    }

    context = null;
    masterGain = null;
    musicPlayer = null;
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
