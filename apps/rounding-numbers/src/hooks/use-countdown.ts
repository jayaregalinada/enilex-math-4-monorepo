import { useEffect, useRef, useState } from 'react';

/**
 * A per-question countdown in seconds. Returns the remaining time and calls
 * `onElapsed` once it hits zero. The timer (re)starts whenever it becomes active
 * or the duration changes; a `null` duration disables it entirely (untimed modes).
 */
export function useCountdown(
  durationSeconds: number | null,
  active: boolean,
  onElapsed: () => void,
): number {
  const [remaining, setRemaining] = useState(durationSeconds ?? 0);
  const onElapsedRef = useRef(onElapsed);
  onElapsedRef.current = onElapsed;

  useEffect(() => {
    if (durationSeconds === null || !active) {
      return;
    }

    setRemaining(durationSeconds);
    const start = Date.now();
    const id = setInterval(() => {
      const left = durationSeconds - (Date.now() - start) / 1000;
      if (left <= 0) {
        clearInterval(id);
        onElapsedRef.current();
      } else {
        setRemaining(left);
      }
    }, 100);

    return () => clearInterval(id);
  }, [durationSeconds, active]);

  return remaining;
}
