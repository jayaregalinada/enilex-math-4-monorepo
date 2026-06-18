import { createAudioEngine } from '@enilex-math-4-pkg/audio';
import { MUSIC_SOURCES } from '@/lib/music-sources';

/**
 * The app's single audio engine. The context is created lazily on first use, so
 * importing this is safe outside a browser. `useAudio` keeps it in sync with the
 * muted setting and the game session. Authored tunes play when present, with the
 * synthesized tunes as the fallback.
 */
export const gameAudio = createAudioEngine({ musicSources: MUSIC_SOURCES });
