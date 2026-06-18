import { MascotSvg } from './mascot-svg';
import type { MascotSpriteProps } from './theme';

/** Ocean theme mascot: an octopus. Mood changes its mouth. */
export function MascotOctopus({ mood }: MascotSpriteProps) {
  return (
    <MascotSvg>
      {/* Head / mantle. */}
      <path d="M4 5 L5 3 L11 3 L12 5 L12 10 L4 10 Z" fill="#a855f7" />
      {/* Tentacles. */}
      <rect x="4" y="10" width="2" height="3" fill="#9333ea" />
      <rect x="7" y="10" width="2" height="4" fill="#9333ea" />
      <rect x="10" y="10" width="2" height="3" fill="#9333ea" />
      {/* Eyes. */}
      <rect x="6" y="5" width="2" height="2" fill="#ffffff" />
      <rect x="9" y="5" width="2" height="2" fill="#ffffff" />
      <rect x="7" y="6" width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y="6" width="1" height="1" fill="#1a1a2e" />
      {/* Mouth — smile when cheering, frown when sad, neutral otherwise. */}
      {mood === 'cheer' && <path d="M6 8 L7 9 L9 9 L10 8 Z" fill="#5b1192" />}
      {mood === 'idle' && <rect x="7" y="8" width="2" height="1" fill="#5b1192" />}
      {mood === 'sad' && <path d="M6 9 L7 8 L9 8 L10 9 Z" fill="#5b1192" />}
    </MascotSvg>
  );
}
