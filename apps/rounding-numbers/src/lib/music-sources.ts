import type { Difficulty } from '@enilex-math-4-pkg/game-core';

/**
 * Background-music files, served from `public/audio/music/`. Each must be
 * credited with its source and licence in CREDITS.md (ADR 0006). If a file is
 * absent or fails to load, the audio engine falls back to its synthesized tune,
 * so the app never breaks on a missing asset.
 */
export const MUSIC_SOURCES: Record<Difficulty, string> = {
  easy: '/audio/music/easy.mp3',
  normal: '/audio/music/normal.mp3',
  hard: '/audio/music/hard.mp3',
};
