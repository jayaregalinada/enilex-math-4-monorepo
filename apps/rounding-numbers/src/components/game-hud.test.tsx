import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameHud } from './game-hud';

describe('GameHud', () => {
  it('shows the padded score, the Hi readout, and a labelled lives count', () => {
    render(<GameHud lives={3} maxLives={5} score={1234} streak={4} hiScore={5000} />);
    expect(screen.getByText('001234')).toBeInTheDocument();
    // Hi shows max(hiScore, score), here the standing best.
    expect(screen.getByText('005000')).toBeInTheDocument();
    // a11y: hearts are decorative, exposed as one labelled count.
    expect(screen.getByLabelText('3 of 5 lives')).toBeInTheDocument();
  });

  it('lets the live score beat the Hi readout', () => {
    render(<GameHud lives={3} maxLives={5} score={9000} streak={0} hiScore={5000} />);
    // Both Score and Hi read 009000 once the live score overtakes the best.
    expect(screen.getAllByText('009000')).toHaveLength(2);
  });

  it('renders a COMBO meter once the streak reaches the bonus threshold', () => {
    render(<GameHud lives={3} maxLives={5} score={0} streak={4} hiScore={0} />);
    // a11y: the streak is announced via the combo's accessible name.
    const combo = screen.getByLabelText('streak 4');
    expect(combo).toHaveTextContent('×4');
    expect(combo).toHaveTextContent('COMBO!');
  });

  it('renders the combo without COMBO! when the streak is below the bonus threshold', () => {
    render(<GameHud lives={3} maxLives={5} score={0} streak={2} hiScore={0} />);
    const combo = screen.getByLabelText('streak 2');
    expect(combo).toHaveTextContent('×2');
    expect(combo).not.toHaveTextContent('COMBO!');
  });

  it('renders no combo meter when the streak is below 2', () => {
    render(<GameHud lives={3} maxLives={5} score={0} streak={1} hiScore={0} />);
    expect(screen.queryByLabelText(/streak/)).toBeNull();
  });

  it('shows the timer only when a max is provided', () => {
    const { rerender } = render(
      <GameHud lives={3} maxLives={3} score={0} streak={0} hiScore={0} />,
    );
    expect(screen.queryByLabelText('time remaining')).toBeNull();
    rerender(
      <GameHud
        lives={3}
        maxLives={3}
        score={0}
        streak={0}
        hiScore={0}
        remaining={5}
        timerMax={10}
      />,
    );
    expect(screen.getByLabelText('time remaining')).toBeInTheDocument();
  });
});
