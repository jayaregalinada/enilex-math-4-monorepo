/** A single synthesized note: an oscillator shaped by a short gain envelope. */
export interface ToneSpec {
  /** Pitch in hertz. */
  frequency: number;
  /** When to start, in the context's clock seconds. */
  startAt: number;
  /** How long the note lasts, in seconds. */
  duration: number;
  type?: OscillatorType;
  /** Loudness at the envelope's peak (0–1). */
  peak?: number;
}

const MIN_GAIN = 0.0001;
const ATTACK_SECONDS = 0.01;

/**
 * Plays one note: an oscillator with a quick attack and an exponential decay,
 * routed into `destination`. Nodes stop and free themselves when the note ends.
 */
export function playTone(context: AudioContext, destination: AudioNode, spec: ToneSpec): void {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const peak = spec.peak ?? 0.2;
  const endAt = spec.startAt + spec.duration;

  oscillator.type = spec.type ?? 'sine';
  oscillator.frequency.setValueAtTime(spec.frequency, spec.startAt);

  // Exponential ramps need a non-zero floor, hence MIN_GAIN rather than 0.
  envelope.gain.setValueAtTime(MIN_GAIN, spec.startAt);
  envelope.gain.exponentialRampToValueAtTime(peak, spec.startAt + ATTACK_SECONDS);
  envelope.gain.exponentialRampToValueAtTime(MIN_GAIN, endAt);

  oscillator.connect(envelope);
  envelope.connect(destination);

  oscillator.start(spec.startAt);
  oscillator.stop(endAt);
}
