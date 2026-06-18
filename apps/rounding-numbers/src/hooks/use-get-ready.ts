import { useEffect, useState } from 'react';

/** The "Get ready!" countdown starts here and ticks down to zero (go). */
const GET_READY_FROM = 3;

/**
 * A one-shot "Get ready!" 3-2-1 countdown for timed runs. While `enabled`, it
 * counts `3 → 2 → 1` one second apart and then settles on zero. `active` is true
 * for as long as a number is showing, so callers can hold the clock until "go".
 * Disabled runs (untimed modes) never count and report `active: false`.
 */
export function useGetReady(enabled: boolean): { count: number; active: boolean } {
  const [count, setCount] = useState(enabled ? GET_READY_FROM : 0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);

      return;
    }

    setCount(GET_READY_FROM);
    const id = setInterval(() => {
      setCount((current) => {
        if (current <= 1) {
          clearInterval(id);

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [enabled]);

  return { count, active: count > 0 };
}
