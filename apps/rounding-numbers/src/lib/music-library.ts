import { categorizeTracks, type MusicLibrary } from '@/lib/categorize-tracks';

/**
 * All background-music files dropped into `src/assets/music/`, discovered at
 * build time by Vite and split into the Hard pool and the general (Home/Easy/
 * Normal) pool by the `-hard-mode` filename marker. Add or remove files in that
 * folder — no manifest to maintain. Empty until tracks are added, in which case
 * the audio engine plays its synthesized fallback.
 */
const files = import.meta.glob('../assets/music/*.{mp3,ogg,m4a,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const MUSIC_LIBRARY: MusicLibrary = categorizeTracks(files);
