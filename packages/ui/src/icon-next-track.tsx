import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Skip-forward / next-track glyph: two triangles and an end bar. */
export function IconNextTrack(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M2 3 L2 13 L8 8 Z" />
      <path d="M8 3 L8 13 L14 8 Z" />
      <rect x="13" y="3" width="2" height="10" />
    </PixelIcon>
  );
}
