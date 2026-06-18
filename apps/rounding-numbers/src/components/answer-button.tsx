import { IconCheck, IconCross } from '@enilex-math-4-pkg/ui';
import { formatNumber } from '@/lib/format-number';

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'dimmed';

export interface AnswerButtonProps {
  value: number;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

/** A single multiple-choice answer. After answering it reveals correct/wrong styling. */
export function AnswerButton({ value, state, disabled, onClick }: AnswerButtonProps) {
  return (
    <button
      type="button"
      className={`answer answer--${state}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="answer__value">{formatNumber(value)}</span>
      {/* a11y: a pixel glyph (not just colour) marks right/wrong, for colourblind players. */}
      {(state === 'correct' || state === 'wrong') && (
        <span className="answer__glyph" aria-hidden="true">
          {state === 'correct' ? <IconCheck /> : <IconCross />}
        </span>
      )}
    </button>
  );
}
