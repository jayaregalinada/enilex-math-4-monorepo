import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './use-countdown';

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts down while active and fires onElapsed at zero', () => {
    const onElapsed = vi.fn();
    const { result } = renderHook(() => useCountdown(10, true, onElapsed));
    expect(result.current).toBe(10);

    act(() => vi.advanceTimersByTime(5_000));
    expect(result.current).toBeLessThanOrEqual(5);
    expect(result.current).toBeGreaterThan(0);
    expect(onElapsed).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(6_000));
    expect(onElapsed).toHaveBeenCalled();
  });

  it('stays idle when inactive or the duration is null', () => {
    const onElapsed = vi.fn();
    const { result } = renderHook(() => useCountdown(null, true, onElapsed));
    act(() => vi.advanceTimersByTime(20_000));
    expect(onElapsed).not.toHaveBeenCalled();
    expect(result.current).toBe(0);
  });
});
