import { type Choice, explain, roundTo } from '@enilex-math-4-pkg/game-core';
import { NumberDisplay } from './number-display';
import { NumberLine } from './number-line';

export interface ExplanationPanelProps {
  value: number;
  exponent: number;
  /** The option the player tapped, or `null` when the question timed out. */
  chosen: Choice | null;
}

/**
 * The Easy/Normal teaching panel shown after answering: the highlighted number,
 * the rule that gives the answer, the named misconception for a wrong tap, and a
 * number line proving which way it rounds.
 */
export function ExplanationPanel({ value, exponent, chosen }: ExplanationPanelProps) {
  const rounding = roundTo(value, exponent);
  const rule = explain({ value: rounding.rounded, kind: 'correct' }, value, exponent);
  const mistake =
    chosen !== null && chosen.kind !== 'correct' ? explain(chosen, value, exponent) : null;

  return (
    // a11y: announce the explanation when it appears.
    <section className="explanation" aria-live="polite">
      <NumberDisplay value={value} exponent={exponent} />

      <p className="explanation__rule">{rule.detail}</p>

      {mistake && (
        <p className="explanation__mistake">
          <strong>{mistake.headline}.</strong> {mistake.detail}
        </p>
      )}

      <NumberLine
        value={value}
        lower={rounding.lower}
        upper={rounding.upper}
        rounded={rounding.rounded}
      />
    </section>
  );
}
