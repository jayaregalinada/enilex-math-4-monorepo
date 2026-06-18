import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { fireEvent, render, screen } from '@testing-library/react';
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
const { ClearScoresButton } = await import('./clear-scores-button');

function entry(id: string, difficulty: Difficulty): LeaderboardEntry {
  return { id, name: id, score: 10, difficulty, playedAt: 0 };
}

describe('ClearScoresButton', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [entry('a', 'easy')], lastName: '' });
  });

  it('clears the store after confirming', () => {
    render(<ClearScoresButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear scores' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(useLeaderboardStore.getState().entries).toEqual([]);
  });

  it('leaves the store intact when cancelled', () => {
    render(<ClearScoresButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear scores' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(useLeaderboardStore.getState().entries).toHaveLength(1);
  });
});
