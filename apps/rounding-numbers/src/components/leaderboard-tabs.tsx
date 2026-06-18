import * as Tabs from '@radix-ui/react-tabs';
import { formatNumber } from '@/lib/format-number';
import { type LeaderboardTab, rankLeaderboard } from '@/lib/rank-leaderboard';
import { useLeaderboardStore } from '@/stores/use-leaderboard-store';

const TAB_ITEMS: { value: LeaderboardTab; label: string }[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

/**
 * The leaderboard: four Radix tabs (Overall + per difficulty) over the persisted
 * entries. Overall ranks by weighted points; the rest by raw score. Radix gives
 * the tabs their roving-focus/ARIA behaviour (ADR 0004); styling is our own CSS.
 */
export function LeaderboardTabs() {
  const entries = useLeaderboardStore((state) => state.entries);

  return (
    <Tabs.Root defaultValue="overall" className="leaderboard">
      <Tabs.List className="leaderboard__tabs" aria-label="Leaderboard categories">
        {TAB_ITEMS.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value} className="leaderboard__tab">
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {TAB_ITEMS.map((tab) => {
        const ranked = rankLeaderboard(entries, tab.value);

        return (
          <Tabs.Content key={tab.value} value={tab.value} className="leaderboard__panel">
            {ranked.length === 0 ? (
              <p className="leaderboard__empty">No scores yet — be the first!</p>
            ) : (
              <ol className="leaderboard__list">
                {ranked.map((row, index) => (
                  <li key={row.entry.id} className="leaderboard__row">
                    <span className="leaderboard__rank">{index + 1}</span>
                    <span className="leaderboard__name">{row.entry.name || 'Anonymous'}</span>
                    <span className="leaderboard__points">{formatNumber(row.points)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
