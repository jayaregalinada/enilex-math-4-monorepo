import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** House glyph for "home", with a punched-out door. */
export function IconHome(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      {/* Roof + body as one shape; the door is an even-odd hole. */}
      <path
        fillRule="evenodd"
        d="M8 2 L15 9 L13 9 L13 14 L3 14 L3 9 L1 9 Z M7 10 L9 10 L9 14 L7 14 Z"
      />
    </PixelIcon>
  );
}
