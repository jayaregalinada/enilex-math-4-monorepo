import { pickRandomTheme, THEMES, type Theme } from '@enilex-math-4-pkg/themes';
import { create } from 'zustand';

/**
 * The active cosmetic theme. Chosen once per run (ADR 0005): `pickRandom` is
 * called when a game starts. Not persisted — a fresh look each run is the point.
 */
export interface ThemeStore {
  theme: Theme;
  pickRandom: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  // Cosmic (the first theme) is the default until the first run begins.
  theme: THEMES[0] ?? pickRandomTheme(),
  pickRandom: () => set({ theme: pickRandomTheme() }),
}));
