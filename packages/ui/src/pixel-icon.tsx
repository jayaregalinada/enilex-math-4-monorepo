import type { ReactNode, SVGProps } from 'react';

export interface PixelIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width/height. Defaults to `1em` so the icon scales with the surrounding font-size. */
  size?: number | string;
  /**
   * Accessible label. When provided the icon is exposed as `role="img"` with this
   * label; when omitted the icon is decorative and hidden from assistive tech.
   */
  title?: string;
}

interface PixelIconBaseProps extends PixelIconProps {
  children: ReactNode;
}

/**
 * Shared wrapper for the pixel-art icons: a 16×16 grid SVG rendered with
 * `crispEdges` so blocks stay hard-edged (the 8-bit look). Icons draw with
 * `currentColor`, so they inherit text colour and can be tinted via CSS.
 */
export function PixelIcon({ size = '1em', title, children, ...rest }: PixelIconBaseProps) {
  const decorative = title === undefined;

  return (
    // a11y: a labelled icon is an image with a <title>; an unlabelled one is
    // decorative and hidden from assistive tech.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      focusable="false"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      {...rest}
    >
      {title === undefined ? null : <title>{title}</title>}
      {children}
    </svg>
  );
}
