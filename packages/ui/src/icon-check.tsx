import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Bold pixel checkmark — the "correct" cue (paired with colour, never colour alone). */
export function IconCheck(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M2 8 L6 12 L14 4 L12 2 L6 8 L4 6 Z" />
    </PixelIcon>
  );
}
