import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// GameOverScreen auto-opens a NameEntryDialog reading the persisted leaderboard
// store; jsdom here has no localStorage, so stub one before that module imports.
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

const { useLeaderboardStore } = await import('@/stores/use-leaderboard-store');
const { GameOverScreen } = await import('./game-over-screen');

describe('GameOverScreen', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('shows the final score and replay actions', () => {
    const onPlayAgain = vi.fn();
    const onHome = vi.fn();
    render(
      <GameOverScreen
        score={1_250}
        difficulty="hard"
        onPlayAgain={onPlayAgain}
        onLeaderboard={vi.fn()}
        onHome={onHome}
      />,
    );
    // The bare score appears on the screen (the dialog text is "1,250 points on hard").
    expect(screen.getByText('1,250')).toBeInTheDocument();
    // The name-entry dialog is modal and opens by default; dismiss it so the
    // screen's own buttons are accessible again (not behind aria-hidden).
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('opens the leaderboard when the Leaderboard button is pressed', () => {
    const onLeaderboard = vi.fn();
    render(
      <GameOverScreen
        score={1_250}
        difficulty="hard"
        onPlayAgain={vi.fn()}
        onLeaderboard={onLeaderboard}
        onHome={vi.fn()}
      />,
    );
    // Dismiss the modal name-entry dialog first so the screen buttons are live.
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(onLeaderboard).toHaveBeenCalledOnce();
  });
});
