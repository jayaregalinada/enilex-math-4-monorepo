import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PauseDialog } from './pause-dialog';

describe('PauseDialog', () => {
  it('calls onResume and onQuit from their buttons when open', () => {
    const onResume = vi.fn();
    const onQuit = vi.fn();
    render(<PauseDialog open onResume={onResume} onQuit={onQuit} />);

    expect(screen.getByRole('heading', { name: 'Paused' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quit' }));

    expect(onResume).toHaveBeenCalledOnce();
    expect(onQuit).toHaveBeenCalledOnce();
  });

  it('renders no dialog content when closed', () => {
    render(<PauseDialog open={false} onResume={vi.fn()} onQuit={vi.fn()} />);

    expect(screen.queryByRole('heading', { name: 'Paused' })).toBeNull();
  });
});
