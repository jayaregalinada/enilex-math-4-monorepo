import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LeaderboardEntry } from '@/stores/use-leaderboard-store';

// The leaderboard store persists via localStorage; jsdom here has none, so stub
// an in-memory one before the store module is imported.
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
const { LeaderboardTabs } = await import('./leaderboard-tabs');

function entry(id: string, score: number, difficulty: Difficulty): LeaderboardEntry {
  return { id, name: id, score, difficulty, playedAt: 0 };
}

describe('LeaderboardTabs', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('defaults to the Overall tab and lists all entries', () => {
    useLeaderboardStore.setState({
      entries: [entry('alpha', 100, 'easy'), entry('beta', 100, 'hard')],
    });
    render(<LeaderboardTabs />);

    expect(screen.getByRole('tab', { name: 'Overall' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  it('shows only the selected difficulty after clicking its tab', () => {
    useLeaderboardStore.setState({
      entries: [entry('easycat', 100, 'easy'), entry('hardcat', 100, 'hard')],
    });
    render(<LeaderboardTabs />);

    // Radix Tabs activate on pointer-down, not a synthetic click.
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Hard' }));

    // Inactive panels stay mounted but hidden; getByRole returns only the visible
    // one, so scope the assertion to it.
    const activePanel = screen.getByRole('tabpanel');
    expect(within(activePanel).getByText('hardcat')).toBeInTheDocument();
    expect(within(activePanel).queryByText('easycat')).toBeNull();
  });

  it('shows an empty state when there are no scores', () => {
    render(<LeaderboardTabs />);

    expect(screen.getByText(/No scores yet/i)).toBeInTheDocument();
  });
});
