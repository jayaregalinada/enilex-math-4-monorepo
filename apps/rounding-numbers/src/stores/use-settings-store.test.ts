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
    useSettingsStore.setState({
      muted: false,
      volume: 0.8,
      soundReady: false,
      reduceEffects: false,
    });
  });

  it('defaults muted to false', () => {
    expect(useSettingsStore.getState().muted).toBe(false);
  });

  it('defaults soundReady and reduceEffects to false', () => {
    expect(useSettingsStore.getState().soundReady).toBe(false);
    expect(useSettingsStore.getState().reduceEffects).toBe(false);
  });

  it('markSoundReady sets soundReady to true', () => {
    useSettingsStore.getState().markSoundReady();
    expect(useSettingsStore.getState().soundReady).toBe(true);
  });

  it('setVolume sets and clamps the volume into 0–1', () => {
    useSettingsStore.getState().setVolume(0.5);
    expect(useSettingsStore.getState().volume).toBe(0.5);

    useSettingsStore.getState().setVolume(2);
    expect(useSettingsStore.getState().volume).toBe(1);

    useSettingsStore.getState().setVolume(-1);
    expect(useSettingsStore.getState().volume).toBe(0);
  });

  it('setReduceEffects sets the reduceEffects flag directly', () => {
    useSettingsStore.getState().setReduceEffects(true);
    expect(useSettingsStore.getState().reduceEffects).toBe(true);

    useSettingsStore.getState().setReduceEffects(false);
    expect(useSettingsStore.getState().reduceEffects).toBe(false);
  });

  it('toggleReduceEffects flips the reduceEffects flag', () => {
    useSettingsStore.getState().toggleReduceEffects();
    expect(useSettingsStore.getState().reduceEffects).toBe(true);

    useSettingsStore.getState().toggleReduceEffects();
    expect(useSettingsStore.getState().reduceEffects).toBe(false);
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
