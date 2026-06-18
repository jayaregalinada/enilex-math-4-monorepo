/** Background-music tracks split by mode. `general` covers Home, Easy and Normal. */
export interface MusicLibrary {
  general: string[];
  hard: string[];
}

/** Filenames containing this marker are Hard-mode-only music. */
const HARD_MODE_MARKER = '-hard-mode';

/**
 * Splits discovered track files into the Hard pool and the general pool by
 * filename: anything containing `-hard-mode` is Hard-only; everything else is
 * shared by Home/Easy/Normal. Input maps each file path to its served URL.
 */
export function categorizeTracks(files: Record<string, string>): MusicLibrary {
  const general: string[] = [];
  const hard: string[] = [];

  for (const [path, url] of Object.entries(files)) {
    if (path.includes(HARD_MODE_MARKER)) {
      hard.push(url);

      continue;
    }

    general.push(url);
  }

  return { general, hard };
}
