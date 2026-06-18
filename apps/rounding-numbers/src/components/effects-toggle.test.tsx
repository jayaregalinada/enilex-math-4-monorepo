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
const { EffectsToggle } = await import('./effects-toggle');

describe('EffectsToggle', () => {
  beforeEach(() => {
    useSettingsStore.setState({ reduceEffects: false });
    vi.clearAllMocks();
  });

  it('renders an unpressed "Reduce effects" button showing "Off"', () => {
    render(<EffectsToggle />);

    const button = screen.getByRole('button', { name: 'Reduce effects' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('Off');
  });

  it('reduces effects, flips its label and pressed state, and plays a tap on click', () => {
    render(<EffectsToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'Reduce effects' }));

    expect(useSettingsStore.getState().reduceEffects).toBe(true);
    const button = screen.getByRole('button', { name: 'Reduce effects' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('On');
    expect(gameAudio.playSoundEffect).toHaveBeenCalledWith('tap');
  });
});
