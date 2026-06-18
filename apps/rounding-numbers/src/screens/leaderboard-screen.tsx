import { LeaderboardTabs } from '@/components/leaderboard-tabs';
import { NavButton } from '@/components/nav-button';

export interface LeaderboardScreenProps {
  onBack: () => void;
}

/** Full-screen leaderboard: the tabbed top-10s, with a way back. */
export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  return (
    <section className="screen">
      <NavButton onClick={onBack} />
      <h2 className="screen__title">Leaderboard</h2>
      <LeaderboardTabs />
    </section>
  );
}
