import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// LeaderboardTabs reads the persisted leaderboard store; jsdom here has no
// localStorage, so stub an in-memory one before the store module is imported.
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
const { LeaderboardScreen } = await import('./leaderboard-screen');

describe('LeaderboardScreen', () => {
  beforeEach(() => {
    useLeaderboardStore.setState({ entries: [], lastName: '' });
  });

  it('renders the heading and calls onBack when Back is pressed', () => {
    const onBack = vi.fn();
    render(<LeaderboardScreen onBack={onBack} />);

    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
