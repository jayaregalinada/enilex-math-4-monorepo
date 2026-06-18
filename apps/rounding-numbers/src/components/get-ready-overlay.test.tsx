import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GetReadyOverlay } from './get-ready-overlay';

describe('GetReadyOverlay', () => {
  it('announces the prompt and shows the current count', () => {
    render(<GetReadyOverlay count={3} />);
    expect(screen.getByText('Get ready!')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('is a polite live region so the countdown is announced', () => {
    render(<GetReadyOverlay count={1} />);
    expect(screen.getByRole('status')).toHaveTextContent('1');
  });
});
