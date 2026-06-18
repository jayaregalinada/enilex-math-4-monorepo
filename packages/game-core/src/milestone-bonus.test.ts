import { describe, expect, it } from 'vitest';
import { milestoneBonus } from './milestone-bonus';

describe('milestoneBonus', () => {
  it('pays 100 every 10th answer', () => {
    expect(milestoneBonus(10)).toBe(100);
    expect(milestoneBonus(20)).toBe(100);
  });

  it('pays nothing off a milestone or at zero', () => {
    expect(milestoneBonus(0)).toBe(0);
    expect(milestoneBonus(9)).toBe(0);
    expect(milestoneBonus(11)).toBe(0);
  });
});
