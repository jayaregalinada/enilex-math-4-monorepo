import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameOverScreen } from './game-over-screen';

describe('GameOverScreen', () => {
  it('shows the final score and replay actions', () => {
    const onPlayAgain = vi.fn();
    const onHome = vi.fn();
    render(
      <GameOverScreen score={1_250} difficulty="hard" onPlayAgain={onPlayAgain} onHome={onHome} />,
    );
    expect(screen.getByText('1,250')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });
});
