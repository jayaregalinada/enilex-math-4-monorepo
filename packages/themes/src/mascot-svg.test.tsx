import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MascotSvg } from './mascot-svg';

describe('MascotSvg', () => {
  it('renders its children inside an svg', () => {
    const { container } = render(
      <MascotSvg>
        <rect data-testid="pixel" />
      </MascotSvg>,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.querySelector('rect')).not.toBeNull();
  });

  it('is a decorative 16x16 crisp-edged canvas', () => {
    const { container } = render(
      <MascotSvg>
        <rect />
      </MascotSvg>,
    );

    const svg = container.querySelector('svg');
    // a11y: decorative; the labelled image is the parent Mascot wrapper.
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    expect(svg).toHaveAttribute('shape-rendering', 'crispEdges');
  });
});
