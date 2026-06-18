import { THEMES } from '@enilex-math-4-pkg/themes';
import { beforeEach, describe, expect, it } from 'vitest';
import { useThemeStore } from './use-theme-store';

const [sampleTheme] = THEMES;
if (sampleTheme === undefined) {
  throw new Error('THEMES must not be empty');
}

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: sampleTheme });
  });

  it('defaults to the first theme', () => {
    expect(useThemeStore.getState().theme).toBe(sampleTheme);
  });

  it('picks a member of THEMES on pickRandom', () => {
    useThemeStore.getState().pickRandom();

    expect(THEMES).toContain(useThemeStore.getState().theme);
  });
});
