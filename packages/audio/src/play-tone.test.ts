import { describe, expect, it, vi } from 'vitest';
import { playTone } from './play-tone';

interface FakeParam {
  setValueAtTime: ReturnType<typeof vi.fn>;
  exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
}

interface FakeOscillator {
  type: OscillatorType;
  frequency: FakeParam;
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

interface FakeGain {
  gain: FakeParam;
  connect: ReturnType<typeof vi.fn>;
}

function fakeParam(): FakeParam {
  return {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

function fakeContext(): {
  context: AudioContext;
  oscillator: FakeOscillator;
  envelope: FakeGain;
} {
  const oscillator: FakeOscillator = {
    type: 'sine',
    frequency: fakeParam(),
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const envelope: FakeGain = {
    gain: fakeParam(),
    connect: vi.fn(),
  };
  const context = {
    createOscillator: vi.fn(() => oscillator),
    createGain: vi.fn(() => envelope),
  } as unknown as AudioContext;

  return { context, oscillator, envelope };
}

describe('playTone', () => {
  it('creates an oscillator and gain and wires oscillator → envelope → destination', () => {
    const { context, oscillator, envelope } = fakeContext();
    const destination = {} as AudioNode;

    playTone(context, destination, { frequency: 440, startAt: 1, duration: 0.2 });

    expect(context.createOscillator).toHaveBeenCalledOnce();
    expect(context.createGain).toHaveBeenCalledOnce();
    expect(oscillator.connect).toHaveBeenCalledWith(envelope);
    expect(envelope.connect).toHaveBeenCalledWith(destination);
  });

  it('sets the oscillator type and frequency from the spec', () => {
    const { context, oscillator } = fakeContext();

    playTone(context, {} as AudioNode, {
      frequency: 523.25,
      type: 'square',
      startAt: 2,
      duration: 0.1,
    });

    expect(oscillator.type).toBe('square');
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(523.25, 2);
  });

  it('schedules start at startAt and stop at startAt + duration', () => {
    const { context, oscillator } = fakeContext();

    playTone(context, {} as AudioNode, { frequency: 440, startAt: 3, duration: 0.25 });

    expect(oscillator.start).toHaveBeenCalledWith(3);
    expect(oscillator.stop).toHaveBeenCalledWith(3.25);
  });

  it('defaults the type to sine when none is given', () => {
    const { context, oscillator } = fakeContext();

    playTone(context, {} as AudioNode, { frequency: 440, startAt: 0, duration: 0.1 });

    expect(oscillator.type).toBe('sine');
  });

  it('defaults the peak to 0.2 when none is given', () => {
    const { context, envelope } = fakeContext();

    playTone(context, {} as AudioNode, { frequency: 440, startAt: 0, duration: 0.1 });

    // The attack ramp targets the peak; with no peak supplied it is 0.2.
    expect(envelope.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      0.2,
      expect.any(Number),
    );
  });

  it('uses the supplied peak for the attack ramp', () => {
    const { context, envelope } = fakeContext();

    playTone(context, {} as AudioNode, { frequency: 440, startAt: 0, duration: 0.1, peak: 0.5 });

    expect(envelope.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      0.5,
      expect.any(Number),
    );
  });
});
