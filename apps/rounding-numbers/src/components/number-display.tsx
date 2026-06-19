import { PLACES } from '@enilex-math-4-pkg/game-core';
import { formatNumber } from '@/lib/format-number';

export interface NumberDisplayProps {
  value: number;
  exponent: number;
  /**
   * Also highlight the "look" digit (the one to the right that the rounding rule
   * inspects). On by default for the teaching panel; turn off for a plain prompt
   * highlight that only marks the target place.
   */
  showLook?: boolean;
  /** Override the accessible label (defaults to a "…rounding to the nearest…" phrase). */
  label?: string;
}

type DigitKind = 'normal' | 'target' | 'look';

interface Token {
  key: string;
  char: string;
  kind: DigitKind | 'comma';
}

function placeLabel(exponent: number): string {
  return PLACES.find((place) => place.exponent === exponent)?.label ?? `10^${exponent}`;
}

function digitKind(index: number, targetIndex: number, lookIndex: number): DigitKind {
  if (index === targetIndex) {
    return 'target';
  }

  if (index === lookIndex) {
    return 'look';
  }

  return 'normal';
}

function buildTokens(value: number, exponent: number, showLook: boolean): Token[] {
  const digits = value.toString().split('');
  const length = digits.length;
  const targetIndex = length - 1 - exponent;
  // -1 disables the look highlight (no index can match) when not wanted.
  const lookIndex = showLook ? length - exponent : -1;
  const tokens: Token[] = [];

  for (let index = 0; index < length; index++) {
    const positionFromRight = length - 1 - index;
    // A comma precedes any digit that opens a new thousands group (but never the first).
    if (index > 0 && positionFromRight % 3 === 2) {
      tokens.push({ key: `comma-${index}`, char: ',', kind: 'comma' });
    }

    tokens.push({
      key: `digit-${index}`,
      char: digits[index] ?? '',
      kind: digitKind(index, targetIndex, lookIndex),
    });
  }

  return tokens;
}

/**
 * The number with comma grouping, highlighting the target-place digit (bold +
 * underline) and the look digit (the one the rule inspects).
 */
export function NumberDisplay({ value, exponent, showLook = true, label }: NumberDisplayProps) {
  const tokens = buildTokens(value, exponent, showLook);

  return (
    // a11y: highlighting is visual, so the whole number is exposed as one label.
    <span
      className="number-display"
      role="img"
      aria-label={
        label ?? `${formatNumber(value)}, rounding to the nearest ${placeLabel(exponent)}`
      }
    >
      <span aria-hidden="true">
        {tokens.map((token) =>
          token.kind === 'comma' ? (
            <span key={token.key} className="number-display__comma">
              ,
            </span>
          ) : (
            <span
              key={token.key}
              className={`number-display__digit number-display__digit--${token.kind}`}
            >
              {token.char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
