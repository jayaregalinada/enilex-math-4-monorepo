import { useEffect, useRef, useState } from 'react';

/**
 * A per-question countdown in seconds. Returns the remaining time and calls
 * `onElapsed` once it hits zero. It resets to full whenever `resetKey` changes (a
 * new question) and otherwise **resumes from the time left** when `active` toggles
 * — so pausing freezes the clock instead of refilling it. A `null` duration
 * disables it entirely (untimed modes).
 */
export function useCountdown(
  durationSeconds: number | null,
  active: boolean,
  onElapsed: () => void,
  resetKey: string,
): number {
  const [remaining, setRemaining] = useState(durationSeconds ?? 0);
  const onElapsedRef = useRef(onElapsed);
  onElapsedRef.current = onElapsed;
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  // A new question (resetKey change) refills the clock.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refill is keyed on resetKey, not remaining.
  useEffect(() => {
    setRemaining(durationSeconds ?? 0);
  }, [resetKey, durationSeconds]);

  // Tick while active, resuming from whatever time is left.
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey re-arms ticking after a refill.
  useEffect(() => {
    if (durationSeconds === null || !active) {
      return;
    }

    const startRemaining = remainingRef.current;
    const startedAt = Date.now();
    const id = setInterval(() => {
      const left = startRemaining - (Date.now() - startedAt) / 1000;

      if (left <= 0) {
        clearInterval(id);
        onElapsedRef.current();

        return;
      }

      setRemaining(left);
    }, 100);

    return () => clearInterval(id);
  }, [durationSeconds, active, resetKey]);

  return remaining;
}
