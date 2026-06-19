import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// HomeScreen renders the sound-gate and how-to-play dialogs, whose settings store
// persists via localStorage; jsdom here has none, so stub one before they import.
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
const { THEMES, ThemeProvider } = await import('@enilex-math-4-pkg/themes');

const [theme] = THEMES;
if (theme === undefined) {
  throw new Error('THEMES must not be empty');
}

// HomeScreen renders <Mascot>, which calls useTheme(), so wrap every render in a provider.
const renderHome = (props: Parameters<typeof HomeScreen>[0]) =>
  render(
    <ThemeProvider theme={theme}>
      <HomeScreen {...props} />
    </ThemeProvider>,
  );

describe('HomeScreen', () => {
  beforeEach(() => {
    // The sound gate and HowToPlayDialog auto-open as modals for first-time
    // players, which would make the Play/Leaderboard buttons inert; answer the
    // sound gate (seenSoundPrompt) and mark how-to-play seen so both stay closed.
    useSettingsStore.setState({ seenHowToPlay: true, soundReady: true, muted: false });
  });

  it('plays when the Play button is pressed', () => {
    const onPlay = vi.fn();
    renderHome({ onPlay, onLeaderboard: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(onPlay).toHaveBeenCalledOnce();
  });

  it('opens the leaderboard when the Leaderboard button is pressed', () => {
    const onLeaderboard = vi.fn();
    renderHome({ onPlay: vi.fn(), onLeaderboard });
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(onLeaderboard).toHaveBeenCalledOnce();
  });

  it('shows the theme mascot as a hero character', () => {
    renderHome({ onPlay: vi.fn(), onLeaderboard: vi.fn() });
    expect(screen.getByRole('img', { name: /mascot/i })).toBeInTheDocument();
  });
});
