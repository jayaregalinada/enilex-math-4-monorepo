import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { MUSIC_TRACKS, type MusicTrack } from './music-tracks';
import { playTone } from './play-tone';

/** Loops a background tune until stopped. One player drives all difficulties. */
export interface MusicPlayer {
  play: (difficulty: Difficulty) => void;
  stop: () => void;
}

const NOTE_GAP_SECONDS = 0.04;
const NOTE_PEAK = 0.06;

/**
 * Schedules a track's notes against the audio clock, then re-arms a timer to loop
 * the whole phrase. Stopping cancels the pending loop; notes already scheduled
 * fade out on their own short envelopes.
 */
export function createMusicPlayer(context: AudioContext, destination: AudioNode): MusicPlayer {
  let loopTimer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  function schedulePhrase(track: MusicTrack): void {
    if (!running) {
      return;
    }

    const secondsPerBeat = 60 / track.tempo;
    let offsetSeconds = 0;

    for (const note of track.notes) {
      const noteSeconds = note.beats * secondsPerBeat;

      if (note.frequency !== null) {
        playTone(context, destination, {
          frequency: note.frequency,
          type: track.type,
          startAt: context.currentTime + offsetSeconds,
          duration: Math.max(0.05, noteSeconds - NOTE_GAP_SECONDS),
          peak: NOTE_PEAK,
        });
      }

      offsetSeconds += noteSeconds;
    }

    loopTimer = setTimeout(() => schedulePhrase(track), offsetSeconds * 1000);
  }

  function stop(): void {
    running = false;

    if (loopTimer !== null) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
  }

  function play(difficulty: Difficulty): void {
    const track = MUSIC_TRACKS[difficulty];
    stop();

    if (track === undefined) {
      return;
    }

    running = true;
    schedulePhrase(track);
  }

  return { play, stop };
}
