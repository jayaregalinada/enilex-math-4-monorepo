import { MascotSvg } from './mascot-svg';
import type { MascotSpriteProps } from './theme';

/** Cosmic theme mascot: a little rocket. Mood changes its face and exhaust. */
export function MascotRocket({ mood }: MascotSpriteProps) {
  return (
    <MascotSvg>
      {/* Exhaust flame — taller when cheering, a flicker when sad. */}
      <path d={mood === 'cheer' ? 'M6 12 L8 16 L10 12 Z' : 'M7 12 L8 14 L9 12 Z'} fill="#ff9f1c" />
      <path d="M7 12 L8 13 L9 12 Z" fill="#ffd23f" />
      {/* Fins. */}
      <path d="M6 9 L4 12 L6 12 Z" fill="#ff4d4d" />
      <path d="M10 9 L12 12 L10 12 Z" fill="#ff4d4d" />
      {/* Body capsule + red nose cone. */}
      <path d="M6 4 L10 4 L10 12 L6 12 Z" fill="#e8e8f0" />
      <path d="M6 4 L8 1 L10 4 Z" fill="#ff4d4d" />
      {/* Window / face. */}
      <rect x="6" y="5" width="4" height="4" fill="#1a1a2e" />
      <rect x="6" y="6" width="1" height="1" fill="#4db8ff" />
      <rect x="9" y="6" width="1" height="1" fill="#4db8ff" />
      {mood === 'sad' ? (
        <rect x="7" y="8" width="2" height="1" fill="#4db8ff" />
      ) : (
        <rect x="6" y="8" width="4" height="1" fill="#4db8ff" />
      )}
    </MascotSvg>
  );
}
