import { DIFFICULTY_CONFIG, type Difficulty } from '@enilex-math-4-pkg/game-core';

const ORDER: Difficulty[] = ['easy', 'normal', 'hard'];

const BLURB: Record<Difficulty, string> = {
  easy: 'Pick one place value and keep it. Gentle numbers.',
  normal: 'The place value drifts by one step each round.',
  hard: 'Random places, a ticking clock, and tricky carries.',
};

export interface DifficultyScreenProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

/** Difficulty chooser, summarising lives and timer from the shared config. */
export function DifficultyScreen({ onSelect, onBack }: DifficultyScreenProps) {
  return (
    <section className="screen">
      <h2 className="screen__title">Choose a difficulty</h2>
      <div className="difficulty-list">
        {ORDER.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          return (
            <button
              key={difficulty}
              type="button"
              className="difficulty-card"
              onClick={() => onSelect(difficulty)}
            >
              <span className="difficulty-card__name">{difficulty}</span>
              <span className="difficulty-card__stats">
                {config.lives} lives · {config.timer ? `${config.timer}s timer` : 'no timer'}
              </span>
              <span className="difficulty-card__blurb">{BLURB[difficulty]}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
