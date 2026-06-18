import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Bold pixel X — the "wrong" cue (paired with colour, never colour alone). */
export function IconCross(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M3 4 L4 3 L8 7 L12 3 L13 4 L9 8 L13 12 L12 13 L8 9 L4 13 L3 12 L7 8 Z" />
    </PixelIcon>
  );
}
