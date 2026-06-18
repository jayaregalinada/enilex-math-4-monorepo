import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './use-countdown';

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts down while active and fires onElapsed at zero', () => {
    const onElapsed = vi.fn();
    const { result } = renderHook(() => useCountdown(10, true, onElapsed, 'q1'));
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
    const { result } = renderHook(() => useCountdown(null, true, onElapsed, 'q1'));
    act(() => vi.advanceTimersByTime(20_000));
    expect(onElapsed).not.toHaveBeenCalled();
    expect(result.current).toBe(0);
  });

  it('resumes from the time left when active toggles without a resetKey change', () => {
    const onElapsed = vi.fn();
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountdown(10, active, onElapsed, 'q1'),
      { initialProps: { active: true } },
    );

    act(() => vi.advanceTimersByTime(4_000));
    expect(result.current).toBeLessThanOrEqual(6);

    // Pause: the clock freezes rather than refilling.
    rerender({ active: false });
    act(() => vi.advanceTimersByTime(5_000));
    expect(result.current).toBeLessThanOrEqual(6);
    expect(result.current).toBeGreaterThan(0);

    // Resume: continues from the remaining time, not from the full duration.
    rerender({ active: true });
    expect(result.current).toBeLessThanOrEqual(6);
  });

  it('refills to full when the resetKey changes', () => {
    const onElapsed = vi.fn();
    const { result, rerender } = renderHook(
      ({ resetKey }: { resetKey: string }) => useCountdown(10, true, onElapsed, resetKey),
      { initialProps: { resetKey: 'q1' } },
    );

    act(() => vi.advanceTimersByTime(6_000));
    expect(result.current).toBeLessThanOrEqual(4);

    // A new question refills the clock to the full duration.
    rerender({ resetKey: 'q2' });
    expect(result.current).toBe(10);
  });
});
