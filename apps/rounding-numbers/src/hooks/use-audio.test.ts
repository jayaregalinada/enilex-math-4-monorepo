import type { MusicContext } from '@enilex-math-4-pkg/audio';
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
    setVolume: vi.fn(),
    playSoundEffect: vi.fn(),
    setMusicContext: vi.fn(),
    skipTrack: vi.fn(),
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
    useSettingsStore.setState({ muted: false, volume: 0.8 });
    vi.clearAllMocks();
  });

  it('syncs the muted setting onto the engine on mount', () => {
    useSettingsStore.setState({ muted: true });

    renderHook(() => useAudio('general'));

    expect(gameAudio.setMuted).toHaveBeenCalledWith(true);
  });

  it('syncs the volume onto the engine on mount and on change', () => {
    useSettingsStore.setState({ volume: 0.5 });

    renderHook(() => useAudio('general'));
    expect(gameAudio.setVolume).toHaveBeenCalledWith(0.5);

    act(() => useSettingsStore.getState().setVolume(0.25));
    expect(gameAudio.setVolume).toHaveBeenCalledWith(0.25);
  });

  it('mirrors later mute toggles onto the engine', () => {
    renderHook(() => useAudio('general'));
    vi.clearAllMocks();

    act(() => useSettingsStore.getState().toggleMuted());

    expect(gameAudio.setMuted).toHaveBeenCalledWith(true);
  });

  it('follows the given music context', () => {
    const { rerender } = renderHook(({ context }: { context: MusicContext }) => useAudio(context), {
      initialProps: { context: 'general' },
    });

    expect(gameAudio.setMusicContext).toHaveBeenCalledWith('general');

    rerender({ context: 'hard' });

    expect(gameAudio.setMusicContext).toHaveBeenCalledWith('hard');
  });

  it('plays an SFX off a session transition', () => {
    renderHook(() => useAudio('general'));

    act(() => useSessionStore.getState().start(easyState()));
    act(() => useSessionStore.getState().dispatch({ type: 'answer', value: 634_600 }));

    expect(gameAudio.playSoundEffect).toHaveBeenCalledWith('correct');
  });

  it('resumes the engine on the first pointerdown gesture', () => {
    renderHook(() => useAudio('general'));

    fireEvent.pointerDown(window);

    expect(gameAudio.resume).toHaveBeenCalled();
  });
});
