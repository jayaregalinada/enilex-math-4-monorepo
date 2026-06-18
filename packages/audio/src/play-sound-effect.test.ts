import { describe, expect, it, vi } from 'vitest';
import { playSoundEffect, type SoundEffectName } from './play-sound-effect';

function fakeParam() {
  return {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

/** A context that counts how many oscillators (i.e. tones) get created. */
function countingContext(): AudioContext {
  return {
    currentTime: 5,
    createOscillator: vi.fn(() => ({
      type: 'sine' as OscillatorType,
      frequency: fakeParam(),
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: fakeParam(),
      connect: vi.fn(),
    })),
  } as unknown as AudioContext;
}

const TONE_COUNTS: Record<SoundEffectName, number> = {
  tap: 1,
  correct: 2,
  wrong: 2,
  streak: 3,
  lifeLost: 1,
  lifeGained: 2,
  gameOver: 3,
};

describe('playSoundEffect', () => {
  it('produces at least one tone for every sound effect', () => {
    for (const name of Object.keys(TONE_COUNTS) as SoundEffectName[]) {
      const context = countingContext();
      playSoundEffect(context, {} as AudioNode, name);
      expect(context.createOscillator).toHaveBeenCalled();
    }
  });

  it('produces the expected number of tones per sound effect', () => {
    for (const [name, count] of Object.entries(TONE_COUNTS) as [SoundEffectName, number][]) {
      const context = countingContext();
      playSoundEffect(context, {} as AudioNode, name);
      expect(context.createOscillator).toHaveBeenCalledTimes(count);
    }
  });

  it('schedules tones from the context current time', () => {
    const context = countingContext();
    const oscillator = {
      type: 'sine' as OscillatorType,
      frequency: fakeParam(),
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    (context.createOscillator as ReturnType<typeof vi.fn>).mockReturnValue(oscillator);

    playSoundEffect(context, {} as AudioNode, 'tap');

    // currentTime is 5, so the single tap tone starts there.
    expect(oscillator.start).toHaveBeenCalledWith(5);
  });
});
