import { type GameState, PLACES } from '@enilex-math-4-pkg/game-core';
import { AnswerButton, type AnswerState } from '@/components/answer-button';
import { ExplanationPanel } from '@/components/explanation-panel';
import { GameHud } from '@/components/game-hud';
import { useRoundingGame } from '@/hooks/use-rounding-game';
import { formatNumber } from '@/lib/format-number';

export interface GameScreenProps {
  initialState: GameState;
  onExit: (score: number) => void;
  onQuit: () => void;
}

function placeLabel(exponent: number): string {
  return PLACES.find((place) => place.exponent === exponent)?.label ?? '';
}

/** The reveal styling for one answer button once the question is answered. */
function answerStateFor(
  optionValue: number,
  correctValue: number,
  chosenValue: number | null,
  answered: boolean,
): AnswerState {
  if (!answered) {
    return 'idle';
  }

  if (optionValue === correctValue) {
    return 'correct';
  }

  if (optionValue === chosenValue) {
    return 'wrong';
  }

  return 'dimmed';
}

/** The play screen: HUD, prompt, answer buttons, and the Easy/Normal teaching panel. */
export function GameScreen({ initialState, onExit, onQuit }: GameScreenProps) {
  const game = useRoundingGame(initialState, onExit);
  const { state } = game;
  const chosenValue = game.chosenChoice?.value ?? null;

  return (
    <section className="screen game">
      <GameHud
        lives={state.lives}
        maxLives={state.maxLives}
        score={state.score}
        streak={state.streak}
        {...(game.timerMax !== null ? { remaining: game.remaining, timerMax: game.timerMax } : {})}
      />

      <p className="game__prompt">
        Round <strong>{formatNumber(state.question.value)}</strong> to the nearest{' '}
        <strong>{placeLabel(state.question.exponent)}</strong>.
      </p>

      <div className="answer-grid">
        {state.question.choices.map((choice) => (
          <AnswerButton
            key={choice.value}
            value={choice.value}
            state={answerStateFor(choice.value, state.question.correct, chosenValue, game.answered)}
            disabled={state.status !== 'playing'}
            onClick={() => game.answer(choice.value)}
          />
        ))}
      </div>

      {game.showExplanation && (
        <ExplanationPanel
          value={state.question.value}
          exponent={state.question.exponent}
          chosen={game.chosenChoice}
        />
      )}

      {game.showExplanation && (
        <button type="button" className="btn btn--primary" onClick={game.next}>
          Next →
        </button>
      )}

      <button type="button" className="btn btn--ghost game__quit" onClick={onQuit}>
        Quit
      </button>
    </section>
  );
}
