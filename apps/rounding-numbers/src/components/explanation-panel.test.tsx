import type { Choice } from '@enilex-math-4-pkg/game-core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExplanationPanel } from './explanation-panel';

describe('ExplanationPanel', () => {
  it('always shows the rule sentence with the rounded answer', () => {
    render(<ExplanationPanel value={634_572} exponent={2} chosen={null} />);
    // The rule text uses the raw number 634600 (no commas).
    expect(screen.getByText(/634600/)).toBeInTheDocument();
    expect(screen.getByText(/nearest hundreds/)).toBeInTheDocument();
  });

  it('shows the misconception headline when a wrong option was chosen', () => {
    const chosen: Choice = { value: 634_500, kind: 'truncated' };
    render(<ExplanationPanel value={634_572} exponent={2} chosen={chosen} />);
    expect(screen.getByText(/Dropped the digits without checking/)).toBeInTheDocument();
  });

  it('hides the mistake paragraph when nothing was chosen', () => {
    const { container } = render(<ExplanationPanel value={634_572} exponent={2} chosen={null} />);
    expect(container.querySelector('.explanation__mistake')).toBeNull();
  });

  it('hides the mistake paragraph when the correct option was chosen', () => {
    const chosen: Choice = { value: 634_600, kind: 'correct' };
    const { container } = render(<ExplanationPanel value={634_572} exponent={2} chosen={chosen} />);
    expect(container.querySelector('.explanation__mistake')).toBeNull();
  });

  it('renders both the number display and number line as labelled images', () => {
    render(<ExplanationPanel value={634_572} exponent={2} chosen={null} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
