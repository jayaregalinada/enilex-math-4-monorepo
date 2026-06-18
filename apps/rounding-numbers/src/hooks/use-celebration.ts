import { useEffect } from 'react';
import { celebrate } from '@/lib/celebrate';
import { isMilestoneResult } from '@/lib/is-milestone-result';
import { useSessionStore } from '@/stores/use-session-store';

/**
 * Fires a confetti burst when the session reaches a streak milestone. Subscribes
 * to the session store out of the render cycle (like the audio wiring). Mount
 * once, near the root.
 */
export function useCelebration(): void {
  useEffect(() => {
    const unsubscribe = useSessionStore.subscribe((state, previous) => {
      if (isMilestoneResult(state.game, previous.game)) {
        celebrate();
      }
    });

    return unsubscribe;
  }, []);
}
