import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Speaker with sound waves — the "sound on" / unmuted state. */
export function IconSoundOn(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M2 6 L5 6 L9 2 L9 14 L5 10 L2 10 Z" />
      <rect x="11" y="6" width="1" height="4" />
      <rect x="13" y="4" width="1" height="8" />
    </PixelIcon>
  );
}
