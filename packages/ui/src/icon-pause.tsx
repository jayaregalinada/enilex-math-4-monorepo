import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Two bars — the pause glyph. */
export function IconPause(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <rect x="4" y="3" width="3" height="10" />
      <rect x="9" y="3" width="3" height="10" />
    </PixelIcon>
  );
}
