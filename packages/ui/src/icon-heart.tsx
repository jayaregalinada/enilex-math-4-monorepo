import { PixelIcon, type PixelIconProps } from './pixel-icon';

export interface IconHeartProps extends PixelIconProps {
  /** Filled = a remaining life; false draws a hollow outline for a lost life. */
  filled?: boolean;
}

const HEART_PATH = 'M8 12 L3 7 L3 5 L4 4 L6 4 L7 5 L8 6 L9 5 L10 4 L12 4 L13 5 L13 7 Z';

/** Pixel heart used for lives. Tinted via `currentColor`; hollow when spent. */
export function IconHeart({ filled = true, ...props }: IconHeartProps) {
  return (
    <PixelIcon {...props}>
      {filled ? (
        <path d={HEART_PATH} />
      ) : (
        // a11y: hollow outline keeps a lost life visible without relying on colour.
        <path d={HEART_PATH} fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </PixelIcon>
  );
}
