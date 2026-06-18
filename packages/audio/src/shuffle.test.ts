import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('returns a permutation: same length and same members', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input, () => 0.5);

    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it('does not mutate the input', () => {
    const input = ['a', 'b', 'c', 'd'];
    shuffle(input, () => 0.5);

    expect(input).toEqual(['a', 'b', 'c', 'd']);
  });

  it('produces a deterministic order for a fixed rng', () => {
    // With rng = () => 0, every Fisher–Yates swap targets index 0, which rotates
    // the first element to the back step by step.
    expect(shuffle(['a', 'b', 'c', 'd'], () => 0)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('returns an empty array for empty input', () => {
    expect(shuffle([])).toEqual([]);
  });
});
