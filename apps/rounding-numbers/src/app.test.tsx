import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('renders the home screen with the game title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /rounding numbers/i })).toBeInTheDocument();
  });

  it('navigates Home → Difficulty → (Hard) Game', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(screen.getByRole('heading', { name: /choose a difficulty/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /hard/i }));
    // Hard skips the picker and lands straight in a game.
    expect(screen.getByText(/to the nearest/i)).toBeInTheDocument();
  });

  it('navigates Home → Difficulty → Picker for Easy', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    fireEvent.click(screen.getByRole('button', { name: /easy/i }));
    expect(screen.getByRole('heading', { name: /pick a place value/i })).toBeInTheDocument();
  });
});
