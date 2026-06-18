import { useEffect } from 'react';
import { gameAudio } from '@/lib/game-audio';
import { reactToSession } from '@/lib/react-to-session';
import { useSessionStore } from '@/stores/use-session-store';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * Wires the shared audio engine to app state for the app's lifetime: resumes the
 * audio context on the first user gesture, mirrors the muted setting, and plays
 * SFX/music off the game session's transitions. Mount once, near the root.
 */
export function useAudio(): void {
  useEffect(() => {
    // a11y/browser: audio contexts start suspended and may only resume after a
    // real user gesture, so arm a one-shot listener instead of resuming eagerly.
    function resumeOnGesture(): void {
      void gameAudio.resume();
    }

    window.addEventListener('pointerdown', resumeOnGesture, { once: true });

    return () => window.removeEventListener('pointerdown', resumeOnGesture);
  }, []);

  useEffect(() => {
    gameAudio.setMuted(useSettingsStore.getState().muted);
    const unsubscribe = useSettingsStore.subscribe((state) => gameAudio.setMuted(state.muted));

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = useSessionStore.subscribe((state, previous) => {
      reactToSession(gameAudio, state.game, previous.game);
    });

    return unsubscribe;
  }, []);
}
