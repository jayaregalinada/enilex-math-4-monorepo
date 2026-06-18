import { describe, expect, it } from 'vitest';
import { scoreFor } from './score-for';

describe('scoreFor', () => {
  it('awards the flat base before the combo kicks in', () => {
    expect(scoreFor(1)).toBe(10);
    expect(scoreFor(2)).toBe(10);
  });

  it('adds 5 × (streak − 2) once the streak reaches 3', () => {
    expect(scoreFor(3)).toBe(15);
    expect(scoreFor(4)).toBe(20);
    expect(scoreFor(10)).toBe(50);
  });
});
