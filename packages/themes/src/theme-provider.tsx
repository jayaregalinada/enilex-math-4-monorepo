import type { ReactNode } from 'react';
import type { Theme } from './theme';
import { ThemeContext } from './theme-context';
import { themePaletteVars } from './theme-palette-vars';

export interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

/**
 * Provides the active theme to descendants and injects its palette as `--color-*`
 * CSS variables on a wrapping element, so all themed styling flows from one
 * source. Pure presentation — the app decides which theme and when to switch.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className="theme-root" data-theme={theme.id} style={themePaletteVars(theme.palette)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
