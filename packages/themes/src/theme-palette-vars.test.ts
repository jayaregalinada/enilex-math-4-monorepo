import { describe, expect, it } from 'vitest';
import type { ThemePalette } from './theme';
import { themePaletteVars } from './theme-palette-vars';

const palette: ThemePalette = {
  bg: '#111111',
  bgAccent: '#222222',
  surface: 'rgba(0, 0, 0, 0.1)',
  text: '#fefefe',
  muted: '#cccccc',
  accent: '#ff8800',
};

describe('themePaletteVars', () => {
  it('maps each palette field onto its matching --color-* variable', () => {
    expect(themePaletteVars(palette)).toEqual({
      '--color-bg': '#111111',
      '--color-bg-accent': '#222222',
      '--color-surface': 'rgba(0, 0, 0, 0.1)',
      '--color-text': '#fefefe',
      '--color-muted': '#cccccc',
      '--color-accent': '#ff8800',
    });
  });

  it('produces exactly the six --color-* keys', () => {
    expect(Object.keys(themePaletteVars(palette))).toEqual([
      '--color-bg',
      '--color-bg-accent',
      '--color-surface',
      '--color-text',
      '--color-muted',
      '--color-accent',
    ]);
  });
});
