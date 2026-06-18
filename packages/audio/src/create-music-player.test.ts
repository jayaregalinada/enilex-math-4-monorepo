import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMusicPlayer } from './create-music-player';
import { MUSIC_TRACKS } from './music-tracks';

function fakeParam() {
  return {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

function countingContext(): AudioContext {
  return {
    currentTime: 0,
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

/** The easy phrase has a trailing rest; only the pitched notes become tones. */
const EASY_TONES = MUSIC_TRACKS.easy.notes.filter((note) => note.frequency !== null).length;
const EASY_PHRASE_MS =
  MUSIC_TRACKS.easy.notes.reduce((beats, note) => beats + note.beats, 0) *
  (60 / MUSIC_TRACKS.easy.tempo) *
  1000;

describe('createMusicPlayer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules one tone per non-rest note of the track on play', () => {
    const context = countingContext();
    const player = createMusicPlayer(context, {} as AudioNode);

    player.play('easy');

    expect(context.createOscillator).toHaveBeenCalledTimes(EASY_TONES);
  });

  it('loops the phrase after the phrase length elapses', () => {
    const context = countingContext();
    const player = createMusicPlayer(context, {} as AudioNode);

    player.play('easy');
    expect(context.createOscillator).toHaveBeenCalledTimes(EASY_TONES);

    vi.advanceTimersByTime(EASY_PHRASE_MS);

    // A second phrase has been scheduled, doubling the tone count.
    expect(context.createOscillator).toHaveBeenCalledTimes(EASY_TONES * 2);
  });

  it('cancels the pending loop on stop so no further tones are scheduled', () => {
    const context = countingContext();
    const player = createMusicPlayer(context, {} as AudioNode);

    player.play('easy');
    expect(context.createOscillator).toHaveBeenCalledTimes(EASY_TONES);

    player.stop();
    vi.advanceTimersByTime(EASY_PHRASE_MS * 3);

    expect(context.createOscillator).toHaveBeenCalledTimes(EASY_TONES);
  });
});
