import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The settings store persists via localStorage; jsdom here has none, so stub an
// in-memory one before the store module is imported.
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

const { useSettingsStore } = await import('@/stores/use-settings-store');
const { HowToPlayDialog } = await import('./how-to-play-dialog');

describe('HowToPlayDialog', () => {
  beforeEach(() => {
    useSettingsStore.setState({ seenHowToPlay: false, soundReady: true, muted: false });
  });

  it('auto-opens for a first-time player and marks it seen on dismiss', () => {
    render(<HowToPlayDialog />);

    expect(screen.getByRole('heading', { name: 'How to play' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    expect(screen.queryByRole('heading', { name: 'How to play' })).toBeNull();
    expect(useSettingsStore.getState().seenHowToPlay).toBe(true);
  });

  it('does not auto-open while the sound gate is unanswered', () => {
    useSettingsStore.setState({ soundReady: false });
    render(<HowToPlayDialog />);

    expect(screen.queryByRole('heading', { name: 'How to play' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Got it' })).toBeNull();
  });

  it('does not auto-open once seen, but reopens from the trigger', () => {
    useSettingsStore.setState({ seenHowToPlay: true });
    render(<HowToPlayDialog />);

    expect(screen.queryByRole('heading', { name: 'How to play' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'How to play' }));

    expect(screen.getByRole('heading', { name: 'How to play' })).toBeInTheDocument();
  });
});
