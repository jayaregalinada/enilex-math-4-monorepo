import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// ScreenControls renders the settings/mute controls, whose store persists via
// localStorage; jsdom here has none, so stub one before those modules import.
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

const { ScreenControls } = await import('./screen-controls');

describe('ScreenControls', () => {
  it('renders the next-track, mute, and settings controls', () => {
    render(<ScreenControls />);

    expect(screen.getByRole('button', { name: 'Next track' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mute sound' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });
});
