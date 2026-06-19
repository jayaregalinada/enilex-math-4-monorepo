import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { NameEntryForm } from '@/components/name-entry-form';
import { NavButton } from '@/components/nav-button';
import { formatNumber } from '@/lib/format-number';

export interface GameOverScreenProps {
  score: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
  onHome: () => void;
}

/**
 * End-of-run summary: final score, an inline name-entry form to save it to the
 * leaderboard, and replay options — all on one page (no modal).
 */
export function GameOverScreen({
  score,
  difficulty,
  onPlayAgain,
  onLeaderboard,
  onHome,
}: GameOverScreenProps) {
  return (
    <section className="screen game-over">
      <NavButton variant="home" onClick={onHome} />
      <h2 className="screen__title">Game over</h2>
      <p className="game-over__score">{formatNumber(score)}</p>
      <p className="game-over__label">points · {difficulty}</p>
      <NameEntryForm score={score} difficulty={difficulty} />
      <div className="game-over__actions">
        <button type="button" className="btn btn--primary" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
      {/* Leaderboard is a secondary action, set below and de-emphasised so it
          doesn't crowd the primary "Play again" and the page stays compact on
          short screens (mirrors the home screen's Play / Leaderboard stack). */}
      <button type="button" className="btn btn--ghost btn--sm" onClick={onLeaderboard}>
        Leaderboard
      </button>
    </section>
  );
}
