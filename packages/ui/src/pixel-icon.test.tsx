import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PixelIcon } from './pixel-icon';

describe('PixelIcon', () => {
  it('renders a 16x16 crispEdges grid svg drawn with currentColor', () => {
    const { container } = render(
      <PixelIcon>
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    expect(svg).toHaveAttribute('shape-rendering', 'crispEdges');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('renders its children inside the svg', () => {
    const { container } = render(
      <PixelIcon>
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    expect(container.querySelector('svg rect')).not.toBeNull();
  });

  it('defaults size to 1em for width and height', () => {
    const { container } = render(
      <PixelIcon>
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '1em');
    expect(svg).toHaveAttribute('height', '1em');
  });

  it('passes a custom numeric size through to width and height', () => {
    const { container } = render(
      <PixelIcon size={32}>
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('passes a custom string size through to width and height', () => {
    const { container } = render(
      <PixelIcon size="2rem">
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '2rem');
    expect(svg).toHaveAttribute('height', '2rem');
  });

  it('forwards arbitrary svg props such as className and data attributes', () => {
    const { container } = render(
      <PixelIcon className="pixel" data-testid="grid">
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('pixel');
    expect(svg).toHaveAttribute('data-testid', 'grid');
  });

  it('is decorative and hidden from assistive tech when no title is given', () => {
    // a11y: an unlabelled icon must be aria-hidden and not exposed as an image.
    const { container } = render(
      <PixelIcon>
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role', 'img');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('exposes an img role and aria-label when a title is given', () => {
    // a11y: a labelled icon is an image announced by its title.
    render(
      <PixelIcon title="Score">
        <rect x="0" y="0" width="4" height="4" />
      </PixelIcon>,
    );

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'Score');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });
});
