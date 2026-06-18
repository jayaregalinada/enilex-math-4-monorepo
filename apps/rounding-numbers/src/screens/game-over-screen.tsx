import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { useState } from 'react';
import { NameEntryDialog } from '@/components/name-entry-dialog';
import { NavButton } from '@/components/nav-button';
import { formatNumber } from '@/lib/format-number';

export interface GameOverScreenProps {
  score: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
  onHome: () => void;
}

/** End-of-run summary: final score, a name-entry prompt to save it, and replay options. */
export function GameOverScreen({
  score,
  difficulty,
  onPlayAgain,
  onLeaderboard,
  onHome,
}: GameOverScreenProps) {
  // Prompt to save the score as soon as the run ends; dismissable.
  const [nameOpen, setNameOpen] = useState(true);

  return (
    <section className="screen game-over">
      <NavButton variant="home" onClick={onHome} />
      <h2 className="screen__title">Game over</h2>
      <p className="game-over__score">{formatNumber(score)}</p>
      <p className="game-over__label">points · {difficulty}</p>
      <div className="game-over__actions">
        <button type="button" className="btn btn--primary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn btn--ghost" onClick={onLeaderboard}>
          Leaderboard
        </button>
      </div>
      <NameEntryDialog
        open={nameOpen}
        score={score}
        difficulty={difficulty}
        onClose={() => setNameOpen(false)}
      />
    </section>
  );
}
