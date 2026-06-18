import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// PauseMenu renders <MuteToggle/>, which pulls in the settings store (persists
// via localStorage, captured at import) and @/lib/game-audio. jsdom exposes no
// localStorage, so install an in-memory stub before that import runs (vi.hoisted
// lifts this above the dynamic imports below).
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

const { useSettingsStore } = await import('@/stores/use-settings-store');
const { PauseMenu } = await import('./pause-menu');

describe('PauseMenu', () => {
  beforeEach(() => {
    useSettingsStore.setState({ muted: false });
    vi.clearAllMocks();
  });

  it('renders the heading, choice buttons and a sound toggle when open', () => {
    render(<PauseMenu open onResume={vi.fn()} onRestart={vi.fn()} onQuit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Paused' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quit' })).toBeInTheDocument();
    // a11y: the icon-only sound control exposes an accessible name.
    expect(screen.getByRole('button', { name: /mute sound/i })).toBeInTheDocument();
  });

  it('calls onResume, onRestart and onQuit when their buttons are clicked', () => {
    const onResume = vi.fn();
    const onRestart = vi.fn();
    const onQuit = vi.fn();
    render(<PauseMenu open onResume={onResume} onRestart={onRestart} onQuit={onQuit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(onResume).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Restart' }));
    expect(onRestart).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Quit' }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('does not render the "Paused" heading when closed', () => {
    render(<PauseMenu open={false} onResume={vi.fn()} onRestart={vi.fn()} onQuit={vi.fn()} />);

    expect(screen.queryByRole('heading', { name: 'Paused' })).toBeNull();
  });
});
