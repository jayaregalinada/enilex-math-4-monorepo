import { describe, expect, it } from 'vitest';
import { PLACES } from './places';
import { roundTo } from './round-to';

describe('roundTo', () => {
  it('rounds up when the look digit is ≥ 5', () => {
    const r = roundTo(634_572, 2); // nearest hundred
    expect(r.rounded).toBe(634_600);
    expect(r.lower).toBe(634_500);
    expect(r.upper).toBe(634_600);
    expect(r.targetDigit).toBe(5);
    expect(r.lookDigit).toBe(7);
    expect(r.roundedUp).toBe(true);
  });

  it('keeps the value when the look digit is < 5', () => {
    const r = roundTo(634_512, 2);
    expect(r.rounded).toBe(634_500);
    expect(r.roundedUp).toBe(false);
    expect(r.lookDigit).toBe(1);
  });

  it('rounds the boundary look digit (=5) up', () => {
    expect(roundTo(2_450, 2).rounded).toBe(2_500);
    expect(roundTo(2_450, 2).roundedUp).toBe(true);
  });

  it('cascades carries across all-nine runs', () => {
    expect(roundTo(95_500, 4).rounded).toBe(100_000); // nearest ten thousand
    expect(roundTo(999_999, 1).rounded).toBe(1_000_000); // nearest ten
    expect(roundTo(8_950, 2).rounded).toBe(9_000);
  });

  it('produces consistent endpoints for every place in the ladder', () => {
    const n = 387_654_321;
    for (const place of PLACES) {
      const r = roundTo(n, place.exponent);
      const p = 10 ** place.exponent;
      expect(r.upper - r.lower).toBe(p);
      expect(r.lower % p).toBe(0);
      expect(r.rounded).toBe(r.roundedUp ? r.upper : r.lower);
      expect([r.lower, r.upper]).toContain(r.rounded);
    }
  });
});
