import { useContext } from 'react';
import type { Theme } from './theme';
import { ThemeContext } from './theme-context';

/** Reads the active theme. Throws if used outside a `ThemeProvider` (a wiring bug). */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (theme === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
}
