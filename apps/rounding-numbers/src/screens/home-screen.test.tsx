import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// HomeScreen renders SettingsDialog (mute toggle + clear-scores), whose stores
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

const { useSettingsStore } = await import('@/stores/use-settings-store');
const { HomeScreen } = await import('./home-screen');

describe('HomeScreen', () => {
  beforeEach(() => {
    // The sound gate and HowToPlayDialog auto-open as modals for first-time
    // players, which would make the Play/Leaderboard buttons inert; answer the
    // sound gate (seenSoundPrompt) and mark how-to-play seen so both stay closed.
    useSettingsStore.setState({ seenHowToPlay: true, seenSoundPrompt: true, muted: false });
  });

  it('plays when the Play button is pressed', () => {
    const onPlay = vi.fn();
    render(<HomeScreen onPlay={onPlay} onLeaderboard={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(onPlay).toHaveBeenCalledOnce();
  });

  it('opens the leaderboard when the Leaderboard button is pressed', () => {
    const onLeaderboard = vi.fn();
    render(<HomeScreen onPlay={vi.fn()} onLeaderboard={onLeaderboard} />);
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(onLeaderboard).toHaveBeenCalledOnce();
  });
});
