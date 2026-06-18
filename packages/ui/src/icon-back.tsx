import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Left-pointing arrow for "back". */
export function IconBack(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <path d="M7 3 L2 8 L7 13 L7 10 L13 10 L13 6 L7 6 Z" />
    </PixelIcon>
  );
}
