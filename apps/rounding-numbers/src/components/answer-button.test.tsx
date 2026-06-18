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

  it('renders a pixel glyph when state is correct', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={10} state="correct" disabled={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: '10' });
    // a11y: the glyph is aria-hidden, so query it from the DOM, not by accessible name.
    expect(button.querySelector('.answer__glyph svg')).not.toBeNull();
  });

  it('renders a pixel glyph when state is wrong', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={10} state="wrong" disabled={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: '10' });
    expect(button.querySelector('.answer__glyph svg')).not.toBeNull();
  });

  it('renders no glyph when state is idle', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={10} state="idle" disabled={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: '10' });
    expect(button.querySelector('.answer__glyph')).toBeNull();
  });

  it('renders no glyph when state is dimmed', () => {
    const onClick = vi.fn();
    render(<AnswerButton value={10} state="dimmed" disabled={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: '10' });
    expect(button.querySelector('.answer__glyph')).toBeNull();
  });
});
