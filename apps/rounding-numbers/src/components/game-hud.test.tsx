import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameHud } from './game-hud';

describe('GameHud', () => {
  it('shows score, streak, and a labelled lives count', () => {
    render(<GameHud lives={3} maxLives={5} score={1234} streak={4} />);
    expect(screen.getByText('Score: 1,234')).toBeInTheDocument();
    expect(screen.getByText('Streak: 4')).toBeInTheDocument();
    expect(screen.getByLabelText('3 of 5 lives')).toBeInTheDocument();
  });

  it('shows the timer only when a max is provided', () => {
    const { rerender } = render(<GameHud lives={3} maxLives={3} score={0} streak={0} />);
    expect(screen.queryByLabelText('time remaining')).toBeNull();
    rerender(<GameHud lives={3} maxLives={3} score={0} streak={0} remaining={5} timerMax={10} />);
    expect(screen.getByLabelText('time remaining')).toBeInTheDocument();
  });
});
