import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// MuteToggle and the leaderboard store both persist via localStorage; jsdom here
// has none, so stub an in-memory one before those store modules are imported.
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
    setMusicContext: vi.fn(),
    skipTrack: vi.fn(),
    stopMusic: vi.fn(),
    dispose: vi.fn(),
  },
}));

const { SettingsDialog } = await import('./settings-dialog');

describe('SettingsDialog', () => {
  it('opens the settings dialog from the gear trigger', () => {
    render(<SettingsDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mute sound' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear scores' })).toBeInTheDocument();
  });

  it('renders a pixel glyph inside the gear trigger', () => {
    render(<SettingsDialog />);

    // a11y: the trigger keeps its label; the icon itself is decorative.
    const trigger = screen.getByRole('button', { name: 'Settings' });
    expect(trigger.querySelector('svg')).not.toBeNull();
  });
});
