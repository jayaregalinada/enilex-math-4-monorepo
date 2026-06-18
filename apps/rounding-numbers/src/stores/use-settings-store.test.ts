import { beforeEach, describe, expect, it, vi } from 'vitest';

// The store persists via localStorage, captured when its module is imported;
// jsdom here exposes none, so install a tiny in-memory stub before that import
// runs (vi.hoisted lifts this above the import below).
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

const { useSettingsStore } = await import('./use-settings-store');

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({ muted: false });
  });

  it('defaults muted to false', () => {
    expect(useSettingsStore.getState().muted).toBe(false);
  });

  it('toggleMuted flips the muted flag', () => {
    useSettingsStore.getState().toggleMuted();
    expect(useSettingsStore.getState().muted).toBe(true);

    useSettingsStore.getState().toggleMuted();
    expect(useSettingsStore.getState().muted).toBe(false);
  });

  it('setMuted sets the muted flag directly', () => {
    useSettingsStore.getState().setMuted(true);
    expect(useSettingsStore.getState().muted).toBe(true);

    useSettingsStore.getState().setMuted(false);
    expect(useSettingsStore.getState().muted).toBe(false);
  });
});
