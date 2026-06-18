import { beforeEach, describe, expect, it, vi } from 'vitest';

// The store persists via localStorage, captured when its module is imported;
// jsdom here exposes none, so install an in-memory stub before that import runs
// (vi.hoisted lifts this above the dynamic import below).
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

const { useLeaderboardStore } = await import('./use-leaderboard-store');

describe('useLeaderboardStore', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('appends an entry with the given fields, a generated id, and a trimmed lastName', () => {
    useLeaderboardStore.getState().addEntry({ name: '  Pixel  ', score: 120, difficulty: 'easy' });

    const { entries, lastName } = useLeaderboardStore.getState();
    expect(entries).toHaveLength(1);
    const entry = entries[0];
    expect(entry?.name).toBe('Pixel');
    expect(entry?.score).toBe(120);
    expect(entry?.difficulty).toBe('easy');
    expect(typeof entry?.id).toBe('string');
    expect(entry?.id).not.toBe('');
    expect(lastName).toBe('Pixel');
  });

  it('accumulates multiple entries', () => {
    useLeaderboardStore.getState().addEntry({ name: 'A', score: 10, difficulty: 'easy' });
    useLeaderboardStore.getState().addEntry({ name: 'B', score: 20, difficulty: 'hard' });

    expect(useLeaderboardStore.getState().entries).toHaveLength(2);
  });

  it('clears all entries', () => {
    useLeaderboardStore.getState().addEntry({ name: 'A', score: 10, difficulty: 'easy' });
    useLeaderboardStore.getState().clearEntries();

    expect(useLeaderboardStore.getState().entries).toEqual([]);
  });
});
