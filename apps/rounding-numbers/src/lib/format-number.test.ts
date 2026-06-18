import { describe, expect, it } from 'vitest';
import { formatNumber } from './format-number';

describe('formatNumber', () => {
  it('groups digits into thousands', () => {
    expect(formatNumber(1_234_567)).toBe('1,234,567');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(1_000)).toBe('1,000');
    expect(formatNumber(389_645_000)).toBe('389,645,000');
  });
});
