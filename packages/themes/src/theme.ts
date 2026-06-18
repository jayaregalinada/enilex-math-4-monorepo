/** Mascot reactions to the game's flow. */
export type MascotMood = 'idle' | 'cheer' | 'sad';

/** A theme's colour set. Maps onto the app's `--color-*` CSS variables. */
export interface ThemePalette {
  bg: string;
  bgAccent: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}

/** A cosmetic theme: colours, a life icon, and a mascot character. No game logic. */
export interface Theme {
  id: string;
  name: string;
  palette: ThemePalette;
  /** Emoji used for each life in the HUD. */
  lifeIcon: string;
  /** Emoji character shown by the `Mascot` component. */
  mascot: string;
}
