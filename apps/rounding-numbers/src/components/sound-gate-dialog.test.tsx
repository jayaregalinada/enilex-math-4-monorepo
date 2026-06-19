import { fireEvent, render, screen } from '@testing-library/react';
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
const { useSettingsStore } = await import('@/stores/use-settings-store');
const { SoundGateDialog } = await import('./sound-gate-dialog');

describe('SoundGateDialog', () => {
  beforeEach(() => {
    useSettingsStore.setState({ soundReady: false, muted: false });
    vi.clearAllMocks();
  });

  it('opens the gate with Yes/No on a fresh load (sound not yet readied)', () => {
    render(<SoundGateDialog />);

    expect(screen.getByText('Turn on sound?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('turns sound on, plays a tap, and closes on Yes', () => {
    render(<SoundGateDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(useSettingsStore.getState().muted).toBe(false);
    expect(useSettingsStore.getState().soundReady).toBe(true);
    expect(gameAudio.playSoundEffect).toHaveBeenCalledWith('tap');
    // The choice dismisses the gate, so the Yes button is gone.
    expect(screen.queryByRole('button', { name: 'Yes' })).toBeNull();
  });

  it('mutes and marks sound readied on No', () => {
    render(<SoundGateDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'No' }));

    expect(useSettingsStore.getState().muted).toBe(true);
    expect(useSettingsStore.getState().soundReady).toBe(true);
    expect(gameAudio.playSoundEffect).not.toHaveBeenCalled();
  });

  it('stays closed once sound has been readied this session', () => {
    useSettingsStore.setState({ soundReady: true });

    render(<SoundGateDialog />);

    expect(screen.queryByRole('button', { name: 'Yes' })).toBeNull();
  });
});
