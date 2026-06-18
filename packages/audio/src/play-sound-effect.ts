import { playTone } from './play-tone';

/** The game events that have a sound. Driven by the game state machine's transitions. */
export type SoundEffectName =
  | 'tap'
  | 'correct'
  | 'wrong'
  | 'streak'
  | 'lifeLost'
  | 'lifeGained'
  | 'gameOver';

/**
 * Synthesizes a short sound for `name`, scheduled from the context's current
 * time and routed into `destination` (typically the master gain). Each effect is
 * a tiny hand-tuned phrase — no audio files (see CONVENTIONS "no copyrighted
 * assets").
 */
export function playSoundEffect(
  context: AudioContext,
  destination: AudioNode,
  name: SoundEffectName,
): void {
  const now = context.currentTime;

  switch (name) {
    case 'tap': {
      playTone(context, destination, {
        frequency: 440,
        type: 'triangle',
        startAt: now,
        duration: 0.07,
        peak: 0.1,
      });

      return;
    }

    case 'correct': {
      // Rising major third — a cheerful "yes".
      playTone(context, destination, {
        frequency: 523.25,
        type: 'triangle',
        startAt: now,
        duration: 0.12,
      });
      playTone(context, destination, {
        frequency: 659.25,
        type: 'triangle',
        startAt: now + 0.1,
        duration: 0.16,
      });

      return;
    }

    case 'wrong': {
      // Falling minor second — a gentle "not quite", never harsh for kids.
      playTone(context, destination, {
        frequency: 311.13,
        type: 'sawtooth',
        startAt: now,
        duration: 0.18,
        peak: 0.12,
      });
      playTone(context, destination, {
        frequency: 277.18,
        type: 'sawtooth',
        startAt: now + 0.12,
        duration: 0.2,
        peak: 0.12,
      });

      return;
    }

    case 'streak': {
      // Quick rising arpeggio to celebrate a streak milestone.
      playTone(context, destination, {
        frequency: 523.25,
        type: 'square',
        startAt: now,
        duration: 0.1,
        peak: 0.09,
      });
      playTone(context, destination, {
        frequency: 659.25,
        type: 'square',
        startAt: now + 0.08,
        duration: 0.1,
        peak: 0.09,
      });
      playTone(context, destination, {
        frequency: 783.99,
        type: 'square',
        startAt: now + 0.16,
        duration: 0.14,
        peak: 0.09,
      });

      return;
    }

    case 'lifeLost': {
      playTone(context, destination, {
        frequency: 220,
        type: 'sawtooth',
        startAt: now,
        duration: 0.25,
        peak: 0.14,
      });

      return;
    }

    case 'lifeGained': {
      playTone(context, destination, {
        frequency: 587.33,
        type: 'sine',
        startAt: now,
        duration: 0.12,
      });
      playTone(context, destination, {
        frequency: 880,
        type: 'sine',
        startAt: now + 0.1,
        duration: 0.18,
      });

      return;
    }

    case 'gameOver': {
      // Descending three-note phrase to close the run.
      playTone(context, destination, {
        frequency: 392,
        type: 'triangle',
        startAt: now,
        duration: 0.2,
      });
      playTone(context, destination, {
        frequency: 311.13,
        type: 'triangle',
        startAt: now + 0.18,
        duration: 0.2,
      });
      playTone(context, destination, {
        frequency: 261.63,
        type: 'triangle',
        startAt: now + 0.36,
        duration: 0.35,
      });

      return;
    }

    default: {
      return;
    }
  }
}
