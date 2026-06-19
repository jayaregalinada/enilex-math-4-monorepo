import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// GameOverScreen renders an inline NameEntryForm reading the persisted leaderboard
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

  it('shows the final score, an inline save form, and replay actions', () => {
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
    expect(screen.getByText('1,250')).toBeInTheDocument();
    // The save form is inline (no modal), so the nickname field and replay
    // buttons are all live on the page at once.
    expect(screen.getByLabelText('Nickname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('saves the score to the leaderboard from the inline form', () => {
    render(
      <GameOverScreen
        score={1_250}
        difficulty="hard"
        onPlayAgain={vi.fn()}
        onLeaderboard={vi.fn()}
        onHome={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Nova' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const entries = useLeaderboardStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0]?.name).toBe('Nova');
    expect(screen.getByText('Saved to the leaderboard.')).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(onLeaderboard).toHaveBeenCalledOnce();
  });
});
