import type { Theme } from './theme';
import { THEMES } from './themes';

/** A random source in [0, 1). Injectable so tests can pick deterministically. */
export type ThemeRng = () => number;

/**
 * Picks a theme at random. Falls back to the first theme if the list is somehow
 * empty, so callers always get a `Theme` (never undefined).
 */
export function pickRandomTheme(rng: ThemeRng = Math.random): Theme {
  const index = Math.floor(rng() * THEMES.length);
  const theme = THEMES[index] ?? THEMES[0];

  if (theme === undefined) {
    throw new Error('THEMES must not be empty');
  }

  return theme;
}
