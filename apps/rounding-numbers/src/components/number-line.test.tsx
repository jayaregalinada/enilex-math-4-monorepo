import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NumberLine } from './number-line';

describe('NumberLine', () => {
  it('renders both endpoint labels with comma formatting', () => {
    render(<NumberLine value={634_572} lower={634_500} upper={634_600} rounded={634_600} />);
    expect(screen.getByText('634,500')).toBeInTheDocument();
    expect(screen.getByText('634,600')).toBeInTheDocument();
  });

  it('marks the rounded endpoint as the answer', () => {
    render(<NumberLine value={634_572} lower={634_500} upper={634_600} rounded={634_600} />);
    expect(screen.getByText('634,600').className).toContain('is-answer');
    expect(screen.getByText('634,500').className).not.toContain('is-answer');
  });

  it('positions the tick proportionally between the endpoints', () => {
    const { container } = render(
      <NumberLine value={634_572} lower={634_500} upper={634_600} rounded={634_600} />,
    );
    // (634572 - 634500) / (634600 - 634500) = 72%.
    const tick = container.querySelector<HTMLElement>('.number-line__tick');
    expect(tick?.style.left).toBe('72%');
  });

  it('exposes an accessible label stating the nearest value', () => {
    render(<NumberLine value={634_572} lower={634_500} upper={634_600} rounded={634_600} />);
    expect(screen.getByRole('img')).toHaveAccessibleName('634,572 is nearest 634,600');
  });
});
