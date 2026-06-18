import { createContext } from 'react';
import type { Theme } from './theme';

/** Shared context for the active theme. Null until a `ThemeProvider` supplies one. */
export const ThemeContext = createContext<Theme | null>(null);
