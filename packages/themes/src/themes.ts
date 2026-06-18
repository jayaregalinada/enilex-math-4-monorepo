import type { Theme } from './theme';

/**
 * The cosmetic themes. One is picked at random per run (see `pickRandomTheme`).
 * All visuals are colour + emoji — no image files (CONVENTIONS "no copyrighted
 * assets"). The first entry, Cosmic, doubles as the default palette.
 */
export const THEMES: Theme[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    palette: {
      bg: '#1e1b4b',
      bgAccent: '#312e81',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#f8fafc',
      muted: '#c7d2fe',
      accent: '#fbbf24',
    },
    lifeIcon: '⭐',
    mascot: '🚀',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    palette: {
      bg: '#082f49',
      bgAccent: '#0e7490',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ecfeff',
      muted: '#a5f3fc',
      accent: '#fde047',
    },
    lifeIcon: '🐚',
    mascot: '🐙',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    palette: {
      bg: '#052e16',
      bgAccent: '#15803d',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#f0fdf4',
      muted: '#bbf7d0',
      accent: '#fb923c',
    },
    lifeIcon: '🍌',
    mascot: '🐵',
  },
  {
    id: 'candy',
    name: 'Candy',
    palette: {
      bg: '#4a044e',
      bgAccent: '#a21caf',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#fdf4ff',
      muted: '#f5d0fe',
      accent: '#fde047',
    },
    lifeIcon: '🍭',
    mascot: '🦄',
  },
];
