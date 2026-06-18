import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NumberDisplay } from './number-display';

describe('NumberDisplay', () => {
  it('renders every digit of the number', () => {
    render(<NumberDisplay value={634_572} exponent={2} />);
    for (const digit of ['6', '3', '4', '5', '7', '2']) {
      expect(screen.getByText(digit)).toBeInTheDocument();
    }
  });

  it('marks the target digit and the look digit (hundreds place)', () => {
    render(<NumberDisplay value={634_572} exponent={2} />);
    // For 634,572 to the nearest hundreds: target digit is 5, look digit is 7.
    expect(screen.getByText('5').className).toContain('number-display__digit--target');
    expect(screen.getByText('7').className).toContain('number-display__digit--look');
  });

  it('exposes an accessible label with the formatted number and place', () => {
    render(<NumberDisplay value={634_572} exponent={2} />);
    const label = screen.getByRole('img');
    expect(label).toHaveAccessibleName(/634,572/);
    expect(label).toHaveAccessibleName(/hundreds/);
  });
});
