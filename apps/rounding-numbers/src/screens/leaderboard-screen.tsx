import { LeaderboardTabs } from '@/components/leaderboard-tabs';

export interface LeaderboardScreenProps {
  onBack: () => void;
}

/** Full-screen leaderboard: the tabbed top-10s, with a way back. */
export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  return (
    <section className="screen">
      <h2 className="screen__title">Leaderboard</h2>
      <LeaderboardTabs />
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
