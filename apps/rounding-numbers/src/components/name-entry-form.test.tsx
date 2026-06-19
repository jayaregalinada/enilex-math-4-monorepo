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
const { NameEntryForm } = await import('./name-entry-form');

describe('NameEntryForm', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('prefills the input with the last-used nickname', () => {
    useLeaderboardStore.setState({ lastName: 'Pixel' });
    render(<NameEntryForm score={500} difficulty="normal" />);

    expect(screen.getByLabelText('Nickname')).toHaveValue('Pixel');
  });

  it('saves the typed nickname with the score and difficulty, then confirms', () => {
    const onSaved = vi.fn();
    render(<NameEntryForm score={500} difficulty="normal" onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Nova' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const entries = useLeaderboardStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0]?.name).toBe('Nova');
    expect(entries[0]?.score).toBe(500);
    expect(entries[0]?.difficulty).toBe('normal');
    expect(onSaved).toHaveBeenCalledOnce();
    // The form is replaced by a confirmation; the input is gone.
    expect(screen.queryByLabelText('Nickname')).toBeNull();
    expect(screen.getByText('Saved to the leaderboard.')).toBeInTheDocument();
  });
});
