import { describe, expect, it } from 'vitest';
import { pickRandomTheme } from './pick-random-theme';
import { THEMES } from './themes';

describe('pickRandomTheme', () => {
  it('returns the first theme when the rng yields 0', () => {
    expect(pickRandomTheme(() => 0)).toBe(THEMES[0]);
  });

  it('returns the last theme when the rng yields close to 1', () => {
    expect(pickRandomTheme(() => 0.99)).toBe(THEMES[THEMES.length - 1]);
  });

  it('returns a member of THEMES with the default rng', () => {
    expect(THEMES).toContain(pickRandomTheme());
  });
});
