/** Mascot reactions to the game's flow. */
export type MascotMood = 'idle' | 'cheer' | 'sad';

/** Identifies which pixel-art mascot sprite a theme uses. */
export type MascotSprite = 'rocket' | 'octopus' | 'monkey' | 'unicorn';

/** Props shared by every mascot sprite component. */
export interface MascotSpriteProps {
  mood: MascotMood;
}

/** A theme's colour set. Maps onto the app's `--color-*` CSS variables. */
export interface ThemePalette {
  bg: string;
  bgAccent: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}

/**
 * A cosmetic theme: a limited-colour 8-bit palette and a pixel-art mascot. No
 * game logic. The life icon is a universal pixel heart (app-side), tinted by the
 * palette accent — themes no longer carry a per-theme life glyph.
 */
export interface Theme {
  id: string;
  name: string;
  palette: ThemePalette;
  /** Which pixel-art mascot sprite this theme shows. */
  mascot: MascotSprite;
}
