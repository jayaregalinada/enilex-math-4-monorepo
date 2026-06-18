import type { Difficulty } from '@enilex-math-4-pkg/game-core';

/** One step in a looping melody. A null frequency is a rest. */
export interface MusicNote {
  frequency: number | null;
  /** Length in beats. */
  beats: number;
}

/** A looping background tune: a tempo, a timbre, and a short note sequence. */
export interface MusicTrack {
  /** Beats per minute. */
  tempo: number;
  type: OscillatorType;
  notes: MusicNote[];
}

/**
 * One tune per difficulty: Easy is slow and calm, Normal brighter, Hard fast and
 * tense. Original sequences generated in-code — no sampled/copyrighted music.
 */
export const MUSIC_TRACKS: Record<Difficulty, MusicTrack> = {
  easy: {
    tempo: 96,
    type: 'triangle',
    notes: [
      { frequency: 261.63, beats: 1 },
      { frequency: 329.63, beats: 1 },
      { frequency: 392.0, beats: 1 },
      { frequency: 329.63, beats: 1 },
      { frequency: 349.23, beats: 1 },
      { frequency: 440.0, beats: 1 },
      { frequency: 392.0, beats: 1 },
      { frequency: null, beats: 1 },
    ],
  },
  normal: {
    tempo: 120,
    type: 'triangle',
    notes: [
      { frequency: 392.0, beats: 1 },
      { frequency: 493.88, beats: 1 },
      { frequency: 523.25, beats: 1 },
      { frequency: 587.33, beats: 1 },
      { frequency: 659.25, beats: 1 },
      { frequency: 523.25, beats: 1 },
      { frequency: 392.0, beats: 1 },
      { frequency: null, beats: 1 },
    ],
  },
  hard: {
    tempo: 152,
    type: 'square',
    notes: [
      { frequency: 440.0, beats: 1 },
      { frequency: 523.25, beats: 1 },
      { frequency: 659.25, beats: 1 },
      { frequency: 587.33, beats: 1 },
      { frequency: 523.25, beats: 1 },
      { frequency: 440.0, beats: 1 },
      { frequency: 329.63, beats: 1 },
      { frequency: null, beats: 1 },
    ],
  },
};
