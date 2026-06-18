import type { CSSProperties } from 'react';
import type { ThemePalette } from './theme';

/**
 * Translates a palette into the `--color-*` CSS custom properties the app's
 * stylesheets read. Applied as an inline `style` on the theme wrapper, it
 * overrides the `:root` defaults for everything inside.
 */
export function themePaletteVars(palette: ThemePalette): CSSProperties {
  return {
    '--color-bg': palette.bg,
    '--color-bg-accent': palette.bgAccent,
    '--color-surface': palette.surface,
    '--color-text': palette.text,
    '--color-muted': palette.muted,
    '--color-accent': palette.accent,
  } as CSSProperties;
}
