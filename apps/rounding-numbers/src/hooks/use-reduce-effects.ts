import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/use-settings-store';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Whether the retro FX should be toned down: true when the player turned on the
 * "Reduce effects" setting OR the OS reports `prefers-reduced-motion`. The single
 * boolean lets the app gate every ambient effect with one class.
 */
export function useReduceEffects(): boolean {
  const reduceEffects = useSettingsStore((state) => state.reduceEffects);
  const [prefersReduced, setPrefersReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setPrefersReduced(query.matches);
    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduceEffects || prefersReduced;
}
