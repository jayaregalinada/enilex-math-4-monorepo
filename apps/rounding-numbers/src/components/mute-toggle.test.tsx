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
const { MuteToggle } = await import('./mute-toggle');

describe('MuteToggle', () => {
  beforeEach(() => {
    useSettingsStore.setState({ muted: false });
    vi.clearAllMocks();
  });

  it('renders an unpressed "Mute sound" button when unmuted', () => {
    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: 'Mute sound' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('mutes, flips its label and pressed state, and plays a tap on click', () => {
    render(<MuteToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'Mute sound' }));

    expect(useSettingsStore.getState().muted).toBe(true);
    const button = screen.getByRole('button', { name: 'Unmute sound' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(gameAudio.playSoundEffect).toHaveBeenCalledWith('tap');
  });

  it('renders an SVG icon inside the button in both muted and unmuted states', () => {
    render(<MuteToggle />);

    // a11y: the icon-only control swaps emoji for a pixel-art SVG; verify it renders.
    expect(
      screen.getByRole('button', { name: 'Mute sound' }).querySelector('svg'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mute sound' }));

    expect(
      screen.getByRole('button', { name: 'Unmute sound' }).querySelector('svg'),
    ).toBeInTheDocument();
  });
});
