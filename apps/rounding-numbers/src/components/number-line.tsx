import { formatNumber } from '@/lib/format-number';

export interface NumberLineProps {
  value: number;
  lower: number;
  upper: number;
  rounded: number;
}

function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

/**
 * A number line with the two endpoints, a midpoint, and a tick for the actual
 * value — showing which endpoint the value is nearer to. The tick eases into
 * position so the comparison animates when a new question is shown.
 */
export function NumberLine({ value, lower, upper, rounded }: NumberLineProps) {
  const span = upper - lower;
  const valuePercent = span === 0 ? 50 : clampPercent(((value - lower) / span) * 100);
  const lowerIsAnswer = rounded === lower;

  return (
    // a11y: the line is decorative; the comparison is stated as a label.
    <div
      className="number-line"
      role="img"
      aria-label={`${formatNumber(value)} is nearest ${formatNumber(rounded)}`}
    >
      <div className="number-line__track">
        <span className="number-line__mid" />
        <span className="number-line__tick" style={{ left: `${valuePercent}%` }} />
      </div>

      <div className="number-line__labels">
        <span className={lowerIsAnswer ? 'number-line__label is-answer' : 'number-line__label'}>
          {formatNumber(lower)}
        </span>
        <span className={lowerIsAnswer ? 'number-line__label' : 'number-line__label is-answer'}>
          {formatNumber(upper)}
        </span>
      </div>
    </div>
  );
}
