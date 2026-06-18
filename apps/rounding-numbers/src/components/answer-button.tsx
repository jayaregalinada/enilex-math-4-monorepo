import { formatNumber } from '@/lib/format-number';

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'dimmed';

export interface AnswerButtonProps {
  value: number;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

// a11y: a glyph (not just colour) marks right/wrong, for colourblind players.
const STATE_GLYPH: Partial<Record<AnswerState, string>> = {
  correct: '✓',
  wrong: '✗',
};

/** A single multiple-choice answer. After answering it reveals correct/wrong styling. */
export function AnswerButton({ value, state, disabled, onClick }: AnswerButtonProps) {
  const glyph = STATE_GLYPH[state];

  return (
    <button
      type="button"
      className={`answer answer--${state}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="answer__value">{formatNumber(value)}</span>
      {glyph !== undefined && (
        <span className="answer__glyph" aria-hidden="true">
          {glyph}
        </span>
      )}
    </button>
  );
}
