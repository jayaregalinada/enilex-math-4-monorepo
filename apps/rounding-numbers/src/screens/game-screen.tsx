import { type GameState, PLACES } from '@enilex-math-4-pkg/game-core';
import { Mascot, type MascotMood } from '@enilex-math-4-pkg/themes';
import { IconPause } from '@enilex-math-4-pkg/ui';
import { useState } from 'react';
import { AnswerButton, type AnswerState } from '@/components/answer-button';
import { ExplanationPanel } from '@/components/explanation-panel';
import { GameHud } from '@/components/game-hud';
import { GetReadyOverlay } from '@/components/get-ready-overlay';
import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';
import { NumberDisplay } from '@/components/number-display';
import { PauseMenu } from '@/components/pause-menu';
import { SettingsDialog } from '@/components/settings-dialog';
import { useRoundingGame } from '@/hooks/use-rounding-game';
import { formatNumber } from '@/lib/format-number';
import { useLeaderboardStore } from '@/stores/use-leaderboard-store';

export interface GameScreenProps {
  initialState: GameState;
  onExit: (score: number) => void;
  onRestart: () => void;
  onQuit: () => void;
}

function placeLabel(exponent: number): string {
  return PLACES.find((place) => place.exponent === exponent)?.label ?? '';
}

/** Maps the run's status to the mascot's reaction. */
function mascotMood(state: GameState): MascotMood {
  if (state.status === 'gameOver') {
    return 'sad';
  }

  if (state.status === 'answered') {
    return state.lastResult?.correct ? 'cheer' : 'sad';
  }

  return 'idle';
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
export function GameScreen({ initialState, onExit, onRestart, onQuit }: GameScreenProps) {
  const game = useRoundingGame(initialState, onExit);
  const { state } = game;
  // Which menu (if any) is open. Decoupled from the paused STATUS so opening
  // Settings can pause the run without summoning the Pause menu.
  const [openMenu, setOpenMenu] = useState<'none' | 'pause' | 'settings'>('none');
  const chosenValue = game.chosenChoice?.value ?? null;
  // HI-SCORE = best score on record across all boards.
  const hiScore = useLeaderboardStore((store) =>
    store.entries.reduce((best, entry) => Math.max(best, entry.score), 0),
  );

  return (
    <section className="screen game">
      {/* In-game top-right cluster (the app-level one is hidden during play): audio,
          Settings (pauses the run while open), and Pause. */}
      <div className="screen-controls">
        <NextTrackButton />
        <MuteToggle />
        <SettingsDialog
          onOpenChange={(open) => {
            if (open) {
              setOpenMenu('settings');
              game.pause();
            } else {
              setOpenMenu('none');
              game.resume();
            }
          }}
        />
        <button
          type="button"
          className="icon-button"
          aria-label="Pause"
          onClick={() => {
            setOpenMenu('pause');
            game.pause();
          }}
        >
          <IconPause />
        </button>
      </div>

      <GameHud
        lives={state.lives}
        maxLives={state.maxLives}
        score={state.score}
        streak={state.streak}
        hiScore={hiScore}
        {...(game.timerMax !== null ? { remaining: game.remaining, timerMax: game.timerMax } : {})}
      />

      <Mascot mood={mascotMood(state)} />

      <p className="game__prompt">
        Round{' '}
        {state.difficulty === 'easy' ? (
          // Easy mode highlights the target place digit right in the prompt.
          <NumberDisplay
            value={state.question.value}
            exponent={state.question.exponent}
            showLook={false}
            label={formatNumber(state.question.value)}
          />
        ) : (
          <strong>{formatNumber(state.question.value)}</strong>
        )}{' '}
        to the nearest <strong>{placeLabel(state.question.exponent)}</strong>.
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

      <PauseMenu
        open={openMenu === 'pause'}
        onResume={() => {
          setOpenMenu('none');
          game.resume();
        }}
        onRestart={onRestart}
        onQuit={onQuit}
      />

      {game.getReadyCount !== null && <GetReadyOverlay count={game.getReadyCount} />}
    </section>
  );
}
