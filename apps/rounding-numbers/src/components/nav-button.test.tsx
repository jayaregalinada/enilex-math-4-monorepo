import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NavButton } from './nav-button';

describe('NavButton', () => {
  it('renders a "Back" button containing an icon by default', () => {
    render(<NavButton onClick={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Back' });
    // a11y: icon-only nav control exposes its label and renders an icon.
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a "Home" accessible name for the home variant', () => {
    render(<NavButton onClick={vi.fn()} variant="home" />);

    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('uses a custom label to override the default name', () => {
    render(<NavButton onClick={vi.fn()} label="Go back" />);

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<NavButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
