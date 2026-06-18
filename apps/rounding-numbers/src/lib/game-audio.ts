import { createAudioEngine } from '@enilex-math-4-pkg/audio';
import { MUSIC_LIBRARY } from '@/lib/music-library';

/**
 * The app's single audio engine. The context is created lazily on first use, so
 * importing this is safe outside a browser. `useAudio` keeps it in sync with the
 * muted setting and the game session. Background music plays from the discovered
 * playlists (general vs Hard), falling back to synthesized tunes when empty.
 */
export const gameAudio = createAudioEngine({
  playlists: { general: MUSIC_LIBRARY.general, hard: MUSIC_LIBRARY.hard },
});
