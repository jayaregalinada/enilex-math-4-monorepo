import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AnswerButton } from './answer-button';

describe('AnswerButton', () => {
  it('shows the formatted value and fires onClick', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={634_600} state="idle" disabled={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('reflects its state in the class and respects disabled', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={10} state="correct" disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: '10' });
    expect(button.className).toContain('answer--correct');
    expect(button).toBeDisabled();
  });
});
