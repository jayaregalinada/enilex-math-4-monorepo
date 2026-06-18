import { createAudioEngine } from '@enilex-math-4-pkg/audio';

/**
 * The app's single audio engine. The context is created lazily on first use, so
 * importing this is safe outside a browser. `useAudio` keeps it in sync with the
 * muted setting and the game session.
 */
export const gameAudio = createAudioEngine();
