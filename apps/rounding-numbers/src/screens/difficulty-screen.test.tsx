import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DifficultyScreen } from './difficulty-screen';

describe('DifficultyScreen', () => {
  it('offers all three difficulties and reports the chosen one', () => {
    const onSelect = vi.fn();
    render(<DifficultyScreen onSelect={onSelect} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /normal/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /hard/i }));
    expect(onSelect).toHaveBeenCalledWith('hard');
  });

  it('goes back', () => {
    const onBack = vi.fn();
    render(<DifficultyScreen onSelect={vi.fn()} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
