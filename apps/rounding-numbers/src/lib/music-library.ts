import { categorizeTracks, type MusicLibrary } from '@/lib/categorize-tracks';
import { selectPlayableTracks } from '@/lib/select-playable-tracks';

/**
 * All background-music files dropped into `src/assets/music/`, discovered at
 * build time by Vite and split into the Hard pool and the general (Home/Easy/
 * Normal) pool by the `-hard-mode` filename marker. Add or remove files in that
 * folder — no manifest to maintain. Empty until tracks are added, in which case
 * the audio engine plays its synthesized fallback.
 *
 * A song may ship in several formats (e.g. `kawaii.ogg` + `kawaii.m4a`);
 * `selectPlayableTracks` collapses each song to the one format the current
 * browser can decode — preferring OGG, falling back to M4A on Safari/iOS, which
 * cannot decode OGG Vorbis through the Web Audio API.
 */
const files = import.meta.glob('../assets/music/*.{mp3,ogg,m4a,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const MUSIC_LIBRARY: MusicLibrary = categorizeTracks(selectPlayableTracks(files));
