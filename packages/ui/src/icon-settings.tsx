import { PixelIcon, type PixelIconProps } from './pixel-icon';

/** Settings cog: four teeth, an octagonal body, and a punched-out centre hole. */
export function IconSettings(props: PixelIconProps) {
  return (
    <PixelIcon {...props}>
      <rect x="7" y="2" width="2" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      {/* Body with an even-odd hole so the centre reads as a gear. */}
      <path
        fillRule="evenodd"
        d="M5 4 L11 4 L12 5 L12 11 L11 12 L5 12 L4 11 L4 5 Z M7 7 L9 7 L9 9 L7 9 Z"
      />
    </PixelIcon>
  );
}
