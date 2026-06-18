import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Right-pointing triangle — play / resume. */
export function IconPlay(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M4 3 L4 13 L13 8 Z" />
    </PixelIcon>
  );
}
