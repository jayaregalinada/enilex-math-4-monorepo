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
      {formatNumber(value)}
    </button>
  );
}
