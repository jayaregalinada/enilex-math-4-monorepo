import confetti from 'canvas-confetti';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { celebrate } from './celebrate';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const confettiMock = vi.mocked(confetti);

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches }) as MediaQueryList),
  );
}

describe('celebrate', () => {
  beforeEach(() => {
    confettiMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fires confetti when reduced motion is not preferred', () => {
    stubMatchMedia(false);

    celebrate();

    expect(confettiMock).toHaveBeenCalledOnce();
  });

  it('does not fire confetti when reduced motion is preferred', () => {
    stubMatchMedia(true);

    celebrate();

    expect(confettiMock).not.toHaveBeenCalled();
  });
});
