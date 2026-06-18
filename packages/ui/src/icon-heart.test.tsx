import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconHeart } from './icon-heart';

describe('IconHeart', () => {
  it('renders a solid heart path by default', () => {
    const { container } = render(<IconHeart />);

    const path = container.querySelector('svg path');
    expect(path).not.toBeNull();
    expect(path).not.toHaveAttribute('fill', 'none');
  });

  it('renders a solid heart path when filled is true', () => {
    const { container } = render(<IconHeart filled={true} />);

    const path = container.querySelector('svg path');
    expect(path).not.toBeNull();
    expect(path).not.toHaveAttribute('fill', 'none');
  });

  it('renders a hollow outline for a lost life when filled is false', () => {
    const { container } = render(<IconHeart filled={false} />);

    const path = container.querySelector('svg path');
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute('fill', 'none');
    expect(path).toHaveAttribute('stroke', 'currentColor');
  });

  it('passes a title through as an img role with an aria-label', () => {
    // a11y: a labelled heart is announced as an image with its title.
    render(<IconHeart title="Life" />);

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'Life');
  });

  it('passes a custom size through to the svg width and height', () => {
    const { container } = render(<IconHeart size={24} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });
});
