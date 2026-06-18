import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetReady } from './use-get-ready';

describe('useGetReady', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts 3 → 2 → 1 then goes inactive when enabled', () => {
    const { result } = renderHook(() => useGetReady(true));
    expect(result.current).toEqual({ count: 3, active: true });

    act(() => vi.advanceTimersByTime(1_000));
    expect(result.current).toEqual({ count: 2, active: true });

    act(() => vi.advanceTimersByTime(1_000));
    expect(result.current).toEqual({ count: 1, active: true });

    act(() => vi.advanceTimersByTime(1_000));
    expect(result.current).toEqual({ count: 0, active: false });
  });

  it('never counts when disabled', () => {
    const { result } = renderHook(() => useGetReady(false));
    expect(result.current).toEqual({ count: 0, active: false });

    act(() => vi.advanceTimersByTime(5_000));
    expect(result.current).toEqual({ count: 0, active: false });
  });
});
