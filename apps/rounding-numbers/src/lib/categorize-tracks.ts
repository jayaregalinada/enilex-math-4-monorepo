/** Background-music tracks split by mode. `general` covers Home, Easy and Normal. */
export interface MusicLibrary {
  general: string[];
  hard: string[];
  gameOver: string[];
}

/** Filenames containing this marker are Hard-mode-only music. */
const HARD_MODE_MARKER = '-hard-mode';
/** Filenames containing this marker play on the game-over screen. */
const GAME_OVER_MARKER = '-game-over';

/**
 * Splits discovered track files into pools by filename: anything containing
 * `-game-over` is for the loss screen, `-hard-mode` is Hard-only, and everything
 * else is shared by Home/Easy/Normal. Input maps each file path to its served URL.
 */
export function categorizeTracks(files: Record<string, string>): MusicLibrary {
  const general: string[] = [];
  const hard: string[] = [];
  const gameOver: string[] = [];

  for (const [path, url] of Object.entries(files)) {
    if (path.includes(GAME_OVER_MARKER)) {
      gameOver.push(url);

      continue;
    }

    if (path.includes(HARD_MODE_MARKER)) {
      hard.push(url);

      continue;
    }

    general.push(url);
  }

  return { general, hard, gameOver };
}
