import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './theme-provider';
import { THEMES } from './themes';
import { useTheme } from './use-theme';

const [sampleTheme] = THEMES;
if (sampleTheme === undefined) {
  throw new Error('THEMES must not be empty');
}

describe('useTheme', () => {
  it('returns the provided theme when rendered within a ThemeProvider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={sampleTheme}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBe(sampleTheme);
  });

  it('throws when used outside a ThemeProvider', () => {
    // The thrown error is expected; silence React's noisy error logging for it.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);

    errorSpy.mockRestore();
  });
});
