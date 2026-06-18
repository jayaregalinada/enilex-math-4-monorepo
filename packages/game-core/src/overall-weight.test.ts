import { describe, expect, it } from 'vitest';
import { overallWeight } from './overall-weight';

describe('overallWeight', () => {
  it('weights difficulties 1 / 2 / 3', () => {
    expect(overallWeight('easy')).toBe(1);
    expect(overallWeight('normal')).toBe(2);
    expect(overallWeight('hard')).toBe(3);
  });
});
