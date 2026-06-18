import type { Theme } from './theme';

/**
 * The cosmetic themes. One is picked at random per run (see `pickRandomTheme`).
 * Palettes are cohesive, limited-colour 8-bit sets (dark backgrounds, one punchy
 * accent) and `surface` is a solid panel colour (not translucent) for the hard
 * retro chrome. The first entry, Cosmic, doubles as the default palette.
 */
export const THEMES: Theme[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    palette: {
      bg: '#0d0b1f',
      bgAccent: '#241a47',
      surface: '#1c1640',
      text: '#f4f4ff',
      muted: '#b0a8e0',
      accent: '#ffd23f',
    },
    mascot: 'rocket',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    palette: {
      bg: '#06243a',
      bgAccent: '#0a3a5c',
      surface: '#0d2f4a',
      text: '#eaffff',
      muted: '#8fd6e8',
      accent: '#ffe14d',
    },
    mascot: 'octopus',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    palette: {
      bg: '#0a2417',
      bgAccent: '#14532d',
      surface: '#103d24',
      text: '#f0fff4',
      muted: '#9fe0b0',
      accent: '#ff9f1c',
    },
    mascot: 'monkey',
  },
  {
    id: 'candy',
    name: 'Candy',
    palette: {
      bg: '#2a0a2e',
      bgAccent: '#5e1361',
      surface: '#45104a',
      text: '#fff0fb',
      muted: '#f0a8e8',
      accent: '#ffe14d',
    },
    mascot: 'unicorn',
  },
];
