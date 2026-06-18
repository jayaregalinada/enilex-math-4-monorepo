import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlacePickerScreen } from './place-picker-screen';

describe('PlacePickerScreen', () => {
  it('lists the eight places and reports the chosen exponent', () => {
    const onSelect = vi.fn();
    render(<PlacePickerScreen onSelect={onSelect} onBack={vi.fn()} />);
    expect(
      screen.getAllByRole('button', { name: /tens|hundreds|thousands|millions/i }).length,
    ).toBeGreaterThanOrEqual(8);
    fireEvent.click(screen.getByRole('button', { name: /^tens/i }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
