import { MascotSvg } from './mascot-svg';
import type { MascotSpriteProps } from './theme';

/** Candy theme mascot: a unicorn. Mood changes its mouth. */
export function MascotUnicorn({ mood }: MascotSpriteProps) {
  return (
    <MascotSvg>
      {/* Golden horn. */}
      <path d="M7 0 L9 0 L8 4 Z" fill="#ffe14d" />
      {/* Head. */}
      <rect x="4" y="4" width="8" height="8" fill="#fdf4ff" />
      {/* Pink mane. */}
      <rect x="3" y="4" width="2" height="8" fill="#f472b6" />
      <rect x="2" y="6" width="1" height="4" fill="#ec4899" />
      {/* Eye. */}
      <rect x="8" y="6" width="2" height="2" fill="#1a1a2e" />
      <rect x="9" y="6" width="1" height="1" fill="#ffffff" />
      {/* Snout + mouth. */}
      <rect x="10" y="9" width="2" height="2" fill="#fbcfe8" />
      {mood === 'cheer' && <rect x="7" y="10" width="3" height="1" fill="#d6679f" />}
      {mood === 'idle' && <rect x="8" y="10" width="2" height="1" fill="#d6679f" />}
      {mood === 'sad' && <rect x="8" y="11" width="2" height="1" fill="#d6679f" />}
    </MascotSvg>
  );
}
