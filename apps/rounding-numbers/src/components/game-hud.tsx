import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';
import { formatNumber } from '@/lib/format-number';

export interface GameHudProps {
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  /** Theme-supplied emoji for each life; defaults to a heart when unthemed. */
  lifeIcon?: string;
  remaining?: number;
  timerMax?: number;
}

/** The in-game heads-up display: lives, score, streak, and (Hard) the timer bar. */
export function GameHud({
  lives,
  maxLives,
  score,
  streak,
  lifeIcon = '♥',
  remaining,
  timerMax,
}: GameHudProps) {
  const hearts = Array.from({ length: maxLives }, (_, i) => ({
    id: `heart-${i}`,
    filled: i < lives,
  }));
  const showTimer = timerMax !== undefined && remaining !== undefined;

  return (
    <header className="hud">
      {/* a11y: hearts are decorative glyphs, so expose the count as one labelled image. */}
      <div className="hud__hearts" role="img" aria-label={`${lives} of ${maxLives} lives`}>
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className={heart.filled ? 'heart heart--full' : 'heart heart--empty'}
          >
            {lifeIcon}
          </span>
        ))}
      </div>
      <div className="hud__score">Score: {formatNumber(score)}</div>
      <div className="hud__streak">Streak: {streak}</div>
      <div className="hud__controls">
        <NextTrackButton />
        <MuteToggle />
      </div>
      {/* a11y: the countdown is a progressbar so assistive tech can announce time left. */}
      {showTimer && (
        <div
          className="timer"
          role="progressbar"
          aria-label="time remaining"
          aria-valuemin={0}
          aria-valuemax={timerMax}
          aria-valuenow={Math.round(remaining)}
        >
          <div className="timer__bar" style={{ width: `${(remaining / timerMax) * 100}%` }} />
        </div>
      )}
    </header>
  );
}
