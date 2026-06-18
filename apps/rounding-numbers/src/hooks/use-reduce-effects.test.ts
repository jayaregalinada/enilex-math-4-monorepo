import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The settings store persists via localStorage, captured when its module is
// imported; jsdom here exposes none, so install an in-memory stub before that
// import runs (vi.hoisted lifts this above the dynamic imports below).
vi.hoisted(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  });
});

const { useSettingsStore } = await import('@/stores/use-settings-store');
const { useReduceEffects } = await import('./use-reduce-effects');

describe('useReduceEffects', () => {
  beforeEach(() => {
    useSettingsStore.setState({ reduceEffects: false });
  });

  it('defaults to false when the setting is off and matchMedia is unavailable', () => {
    // jsdom exposes no window.matchMedia, so the hook guards and falls back to false.
    const { result } = renderHook(() => useReduceEffects());
    expect(result.current).toBe(false);
  });

  it('returns true when the player enables the reduce-effects setting', () => {
    const { result } = renderHook(() => useReduceEffects());
    act(() => {
      useSettingsStore.setState({ reduceEffects: true });
    });
    expect(result.current).toBe(true);
  });

  it('returns true from prefers-reduced-motion even when the setting is off', () => {
    const matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    // Scope the matchMedia stub to this test, then restore so jsdom's default
    // (no matchMedia) holds for the others. Avoid unstubAllGlobals here — it
    // would also drop the hoisted localStorage stub the store depends on.
    const original = window.matchMedia;
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useReduceEffects());
    expect(result.current).toBe(true);

    window.matchMedia = original;
  });
});
