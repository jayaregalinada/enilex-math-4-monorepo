import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
const { NameEntryDialog } = await import('./name-entry-dialog');

describe('NameEntryDialog', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('prefills the input with the last-used nickname', () => {
    useLeaderboardStore.setState({ lastName: 'Pixel' });
    render(<NameEntryDialog open score={500} difficulty="normal" onClose={vi.fn()} />);

    expect(screen.getByLabelText('Nickname')).toHaveValue('Pixel');
  });

  it('saves the typed nickname with the score and difficulty, then closes', () => {
    const onClose = vi.fn();
    render(<NameEntryDialog open score={500} difficulty="normal" onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Nova' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const entries = useLeaderboardStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0]?.name).toBe('Nova');
    expect(entries[0]?.score).toBe(500);
    expect(entries[0]?.difficulty).toBe('normal');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
