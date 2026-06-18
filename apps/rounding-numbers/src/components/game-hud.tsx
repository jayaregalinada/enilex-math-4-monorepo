import { IconHeart } from '@enilex-math-4-pkg/ui';
import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';

export interface GameHudProps {
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  /** Best score on record, for the arcade HI readout. */
  hiScore: number;
  remaining?: number;
  timerMax?: number;
}

const SCORE_DIGITS = 6;
/** The streak at which the scoring combo bonus begins (see CONTEXT scoring). */
const COMBO_THRESHOLD = 3;

/** Arcade zero-padded score, e.g. 1234 -> "001234". */
function padScore(value: number): string {
  return String(Math.max(0, Math.trunc(value))).padStart(SCORE_DIGITS, '0');
}

/** The in-game arcade HUD: SCORE / HI, pixel-heart lives, a combo meter, and (Hard) the timer. */
export function GameHud({
  lives,
  maxLives,
  score,
  streak,
  hiScore,
  remaining,
  timerMax,
}: GameHudProps) {
  const hearts = Array.from({ length: maxLives }, (_, i) => ({
    id: `heart-${i}`,
    filled: i < lives,
  }));
  const showTimer = timerMax !== undefined && remaining !== undefined;
  // HI tracks the best score, beating it live as the current run climbs.
  const best = Math.max(hiScore, score);

  return (
    <header className="hud">
      <div className="hud__stat">
        <span className="hud__stat-label">Score</span>
        <span className="hud__stat-value">{padScore(score)}</span>
      </div>
      <div className="hud__stat">
        <span className="hud__stat-label">Hi</span>
        <span className="hud__stat-value">{padScore(best)}</span>
      </div>
      {/* a11y: hearts are decorative glyphs, so expose the count as one labelled image. */}
      <div className="hud__hearts" role="img" aria-label={`${lives} of ${maxLives} lives`}>
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className={heart.filled ? 'heart heart--full' : 'heart heart--empty'}
          >
            <IconHeart filled={heart.filled} />
          </span>
        ))}
      </div>
      {streak >= 2 && (
        // a11y: expose the streak as one labelled image so it reads as "streak N".
        <div className="hud__combo" role="img" aria-label={`streak ${streak}`}>
          ×{streak}
          {streak >= COMBO_THRESHOLD ? ' COMBO!' : ''}
        </div>
      )}
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
