import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// App mounts SettingsDialog (mute toggle) and the leaderboard, whose stores
// persist via localStorage; jsdom here has none, so stub one before they import.
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

const { useLeaderboardStore } = await import('@/stores/use-leaderboard-store');
const { useSettingsStore } = await import('@/stores/use-settings-store');
const { App } = await import('./app');

describe('App', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
    // Keep the onboarding modal closed so it doesn't block navigation.
    useSettingsStore.setState({ seenHowToPlay: true, muted: false });
  });

  it('renders the home screen with the game title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /rounding numbers/i })).toBeInTheDocument();
  });

  it('navigates Home → Difficulty → (Hard) Game', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(screen.getByRole('heading', { name: /choose a difficulty/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /hard/i }));
    // Hard skips the picker and lands straight in a game.
    expect(screen.getByText(/to the nearest/i)).toBeInTheDocument();
  });

  it('navigates Home → Difficulty → Picker for Easy', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    fireEvent.click(screen.getByRole('button', { name: /easy/i }));
    expect(screen.getByRole('heading', { name: /pick a place value/i })).toBeInTheDocument();
  });

  it('navigates Home → Leaderboard', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeInTheDocument();
  });
});
