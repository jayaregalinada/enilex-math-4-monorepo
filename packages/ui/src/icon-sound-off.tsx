import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Speaker with an X — the "sound off" / muted state. */
export function IconSoundOff(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M2 6 L5 6 L9 2 L9 14 L5 10 L2 10 Z" />
      {/* Pixel-stepped X to the right of the speaker. */}
      <rect x="11" y="5" width="1" height="1" />
      <rect x="12" y="6" width="1" height="1" />
      <rect x="13" y="7" width="1" height="1" />
      <rect x="14" y="6" width="1" height="1" />
      <rect x="15" y="5" width="1" height="1" />
      <rect x="12" y="8" width="1" height="1" />
      <rect x="14" y="8" width="1" height="1" />
      <rect x="11" y="9" width="1" height="1" />
      <rect x="13" y="9" width="1" height="1" />
      <rect x="15" y="9" width="1" height="1" />
    </PixelIcon>
  );
}
