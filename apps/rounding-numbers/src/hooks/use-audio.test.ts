import type { GameState } from '@enilex-math-4-pkg/game-core';
import { act, fireEvent, renderHook } from '@testing-library/react';
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

vi.mock('@/lib/game-audio', () => ({
  gameAudio: {
    resume: vi.fn(),
    setMuted: vi.fn(),
    playSoundEffect: vi.fn(),
    startMusic: vi.fn(),
    stopMusic: vi.fn(),
    dispose: vi.fn(),
  },
}));

const { gameAudio } = await import('@/lib/game-audio');
const { useSessionStore } = await import('@/stores/use-session-store');
const { useSettingsStore } = await import('@/stores/use-settings-store');
const { useAudio } = await import('./use-audio');

function easyState(): GameState {
  return {
    difficulty: 'easy',
    exponent: 2,
    lives: 5,
    maxLives: 5,
    score: 0,
    streak: 0,
    status: 'playing',
    question: {
      value: 634_572,
      exponent: 2,
      correct: 634_600,
      choices: [
        { value: 634_600, kind: 'correct' },
        { value: 634_500, kind: 'truncated' },
        { value: 630_000, kind: 'adjacentPlace' },
        { value: 634_672, kind: 'didntZero' },
      ],
    },
    lastResult: null,
  };
}

describe('useAudio', () => {
  beforeEach(() => {
    useSessionStore.setState({ game: null });
    useSettingsStore.setState({ muted: false });
    vi.clearAllMocks();
  });

  it('syncs the muted setting onto the engine on mount', () => {
    useSettingsStore.setState({ muted: true });

    renderHook(() => useAudio());

    expect(gameAudio.setMuted).toHaveBeenCalledWith(true);
  });

  it('mirrors later mute toggles onto the engine', () => {
    renderHook(() => useAudio());
    vi.clearAllMocks();

    act(() => useSettingsStore.getState().toggleMuted());

    expect(gameAudio.setMuted).toHaveBeenCalledWith(true);
  });

  it('starts music when a session begins', () => {
    renderHook(() => useAudio());

    act(() => useSessionStore.getState().start(easyState()));

    expect(gameAudio.startMusic).toHaveBeenCalledWith('easy');
  });

  it('resumes the engine on the first pointerdown gesture', () => {
    renderHook(() => useAudio());

    fireEvent.pointerDown(window);

    expect(gameAudio.resume).toHaveBeenCalled();
  });
});
