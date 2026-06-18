import { describe, expect, it } from 'vitest';
import type { ChoiceKind } from './choice';
import { explain } from './explain';

describe('explain', () => {
  it('marks the correct choice and names the rule and place', () => {
    const e = explain({ value: 634_600, kind: 'correct' }, 634_572, 2);
    expect(e.isCorrect).toBe(true);
    expect(e.headline).toBe('Correct!');
    expect(e.detail).toContain('hundreds');
    expect(e.detail).toContain('634600');
  });

  it('gives a distinct, non-correct note for each misconception', () => {
    const kinds: ChoiceKind[] = [
      'wrongDirection',
      'adjacentPlace',
      'truncated',
      'didntZero',
      'other',
    ];
    const headlines = new Set<string>();
    for (const kind of kinds) {
      const e = explain({ value: 0, kind }, 634_572, 2);
      expect(e.isCorrect).toBe(false);
      expect(e.detail).toContain('hundreds');
      headlines.add(e.headline);
    }
    expect(headlines.size).toBe(kinds.length); // every kind reads differently
  });
});
