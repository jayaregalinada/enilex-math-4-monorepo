import type { ReactNode } from 'react';

export interface MascotSvgProps {
  children: ReactNode;
}

/**
 * Shared SVG canvas for the pixel-art mascot sprites: a 16×16 grid rendered with
 * `crispEdges`. The sprite is decorative here — the surrounding `Mascot`
 * component supplies the `role="img"` and accessible label — so the canvas is
 * hidden from assistive tech to avoid a duplicate node.
 */
export function MascotSvg({ children }: MascotSvgProps) {
  return (
    // a11y: decorative; the labelled image is the parent Mascot wrapper.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      focusable="false"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
