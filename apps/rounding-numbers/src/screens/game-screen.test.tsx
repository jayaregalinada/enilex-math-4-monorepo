import type { GameState } from '@enilex-math-4-pkg/game-core';
import { THEMES, ThemeProvider } from '@enilex-math-4-pkg/themes';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionStore } from '@/stores/use-session-store';
import { GameScreen } from './game-screen';

const [sampleTheme] = THEMES;
if (sampleTheme === undefined) {
  throw new Error('THEMES must not be empty');
}

// GameScreen calls useTheme()/renders <Mascot>, so every render needs a provider.
// Arrow form so the closure keeps the post-guard `sampleTheme` narrowing.
const renderGame = (props: ComponentProps<typeof GameScreen>) =>
  render(
    <ThemeProvider theme={sampleTheme}>
      <GameScreen {...props} />
    </ThemeProvider>,
  );

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

function hardState(): GameState {
  return { ...easyState(), difficulty: 'hard', lives: 3, maxLives: 3 };
}

describe('GameScreen', () => {
  beforeEach(() => {
    useSessionStore.setState({ game: null });
  });

  it('shows the Get ready! countdown on Hard but not on Easy', () => {
    const { unmount } = renderGame({
      initialState: hardState(),
      onExit: vi.fn(),
      onRestart: vi.fn(),
      onQuit: vi.fn(),
    });
    expect(screen.getByText('Get ready!')).toBeInTheDocument();
    unmount();

    useSessionStore.setState({ game: null });
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    expect(screen.queryByText('Get ready!')).toBeNull();
  });

  it('renders the prompt for the current question', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    expect(screen.getByText(/634,572/)).toBeInTheDocument();
    expect(screen.getByText(/hundreds/)).toBeInTheDocument();
  });

  it('scores a correct answer and reveals the Next button (Easy)', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
    expect(screen.getByLabelText('5 of 5 lives')).toBeInTheDocument();
    // Specific name so it doesn't also match the HUD's "Next track" button.
    expect(screen.getByRole('button', { name: 'Next →' })).toBeInTheDocument();
  });

  it('loses a life on a wrong answer', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '634,500' }));
    expect(screen.getByLabelText('4 of 5 lives')).toBeInTheDocument();
  });

  it('advances to a fresh question on Next', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));
    // Back to playing: the advance button is gone and the prompt is shown again.
    expect(screen.queryByRole('button', { name: 'Next →' })).toBeNull();
    expect(screen.getByText(/to the nearest/)).toBeInTheDocument();
  });

  it('shows the explanation panel after answering (Easy)', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '634,600' }));
    // The ExplanationPanel renders a NumberLine whose label states the nearest value.
    expect(screen.getByLabelText('634,572 is nearest 634,600')).toBeInTheDocument();
  });

  it('reports the score when the run ends', () => {
    const onExit = vi.fn();
    const oneLife: GameState = { ...easyState(), lives: 1 };
    renderGame({ initialState: oneLife, onExit, onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '634,500' })); // wrong → 0 lives
    expect(onExit).toHaveBeenCalledWith(0);
  });

  it('opens the pause menu when Pause is pressed', () => {
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart: vi.fn(), onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('heading', { name: 'Paused' })).toBeInTheDocument();
  });

  it('calls onRestart when Restart is pressed in the pause menu', () => {
    const onRestart = vi.fn();
    renderGame({ initialState: easyState(), onExit: vi.fn(), onRestart, onQuit: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    fireEvent.click(screen.getByRole('button', { name: 'Restart' }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
