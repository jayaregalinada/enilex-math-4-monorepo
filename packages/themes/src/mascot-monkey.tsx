import { MascotSvg } from './mascot-svg';
import type { MascotSpriteProps } from './theme';

/** Jungle theme mascot: a monkey. Mood changes its mouth. */
export function MascotMonkey({ mood }: MascotSpriteProps) {
  return (
    <MascotSvg>
      {/* Ears. */}
      <rect x="2" y="5" width="2" height="3" fill="#7c4a1e" />
      <rect x="12" y="5" width="2" height="3" fill="#7c4a1e" />
      <rect x="3" y="6" width="1" height="1" fill="#c98a4b" />
      <rect x="12" y="6" width="1" height="1" fill="#c98a4b" />
      {/* Head. */}
      <rect x="4" y="3" width="8" height="9" fill="#7c4a1e" />
      {/* Muzzle. */}
      <rect x="5" y="7" width="6" height="4" fill="#c98a4b" />
      {/* Eyes. */}
      <rect x="5" y="5" width="2" height="2" fill="#ffffff" />
      <rect x="9" y="5" width="2" height="2" fill="#ffffff" />
      <rect x="6" y="5" width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y="5" width="1" height="1" fill="#1a1a2e" />
      {/* Mouth. */}
      {mood === 'cheer' && <path d="M6 8 L7 9 L9 9 L10 8 Z" fill="#5a3214" />}
      {mood === 'idle' && <rect x="7" y="9" width="2" height="1" fill="#5a3214" />}
      {mood === 'sad' && <path d="M6 10 L7 9 L9 9 L10 10 Z" fill="#5a3214" />}
    </MascotSvg>
  );
}
