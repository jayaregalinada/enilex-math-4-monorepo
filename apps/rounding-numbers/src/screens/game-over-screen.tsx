import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { formatNumber } from '@/lib/format-number';

export interface GameOverScreenProps {
  score: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onHome: () => void;
}

/** End-of-run summary with the final score and replay options. */
export function GameOverScreen({ score, difficulty, onPlayAgain, onHome }: GameOverScreenProps) {
  return (
    <section className="screen game-over">
      <h2 className="screen__title">Game over</h2>
      <p className="game-over__score">{formatNumber(score)}</p>
      <p className="game-over__label">points · {difficulty}</p>
      <div className="game-over__actions">
        <button type="button" className="btn btn--primary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          Home
        </button>
      </div>
    </section>
  );
}
