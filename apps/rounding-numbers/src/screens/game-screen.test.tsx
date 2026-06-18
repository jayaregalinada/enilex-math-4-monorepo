import type { GameState } from '@enilex-math-4-pkg/game-core';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameScreen } from './game-screen';

function easyState(): GameState {
  return {
    difficulty: 'easy',
    exponent: 2,
    lives: 5,
    maxLives: 5,
    score: 0,
    streak: 0,
    status: 'playing',
    question: {
      value: 634_572,
      exponent: 2,
      correct: 634_600,
      choices: [
        { value: 634_600, kind: 'correct' },
        { value: 634_500, kind: 'truncated' },
        { value: 630_000, kind: 'adjacentPlace' },
        { value: 634_672, kind: 'didntZero' },
      ],
    },
    lastResult: null,
  };
}

describe('GameScreen', () => {
  it('renders the prompt for the current question', () => {
    render(<GameScreen initialState={easyState()} onExit={vi.fn()} onQuit={vi.fn()} />);
    expect(screen.getByText(/634,572/)).toBeInTheDocument();
    expect(screen.getByText(/hundreds/)).toBeInTheDocument();
  });

  it('scores a correct answer and reveals the Next button (Easy)', () => {
    render(<GameScreen initialState={easyState()} onExit={vi.fn()} onQuit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
    expect(screen.getByLabelText('5 of 5 lives')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('loses a life on a wrong answer', () => {
    render(<GameScreen initialState={easyState()} onExit={vi.fn()} onQuit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '634,500' }));
    expect(screen.getByLabelText('4 of 5 lives')).toBeInTheDocument();
  });

  it('advances to a fresh question on Next', () => {
    render(<GameScreen initialState={easyState()} onExit={vi.fn()} onQuit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // Back to playing: the Next button is gone and the prompt is shown again.
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
    expect(screen.getByText(/to the nearest/)).toBeInTheDocument();
  });

  it('shows the explanation panel after answering (Easy)', () => {
    render(<GameScreen initialState={easyState()} onExit={vi.fn()} onQuit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    // The ExplanationPanel renders a NumberLine whose label states the nearest value.
    expect(screen.getByLabelText('634,572 is nearest 634,600')).toBeInTheDocument();
  });

  it('reports the score when the run ends', () => {
    const onExit = vi.fn();
    const oneLife: GameState = { ...easyState(), lives: 1 };
    render(<GameScreen initialState={oneLife} onExit={onExit} onQuit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '634,500' })); // wrong → 0 lives
    expect(onExit).toHaveBeenCalledWith(0);
  });
});
