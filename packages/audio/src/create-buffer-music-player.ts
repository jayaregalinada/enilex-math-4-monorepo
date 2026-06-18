/** Loops a decoded audio buffer until stopped. Used for authored background music. */
export interface BufferMusicPlayer {
  play: (buffer: AudioBuffer) => void;
  stop: () => void;
}

/**
 * Plays a looping `AudioBufferSourceNode` routed into `destination` (the master
 * gain, so mute applies). A source node is single-use, so each `play` creates a
 * fresh one and `stop` tears the current one down.
 */
export function createBufferMusicPlayer(
  context: AudioContext,
  destination: AudioNode,
): BufferMusicPlayer {
  let source: AudioBufferSourceNode | null = null;

  function stop(): void {
    if (source === null) {
      return;
    }

    source.stop();
    source.disconnect();
    source = null;
  }

  function play(buffer: AudioBuffer): void {
    stop();

    const next = context.createBufferSource();
    next.buffer = buffer;
    next.loop = true;
    next.connect(destination);
    next.start();

    source = next;
  }

  return { play, stop };
}
