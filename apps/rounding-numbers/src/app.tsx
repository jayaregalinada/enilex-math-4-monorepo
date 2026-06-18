import { ThemeProvider } from '@enilex-math-4-pkg/themes';
import type { ReactNode } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { type GameFlow, useGameFlow } from '@/hooks/use-game-flow';
import { DifficultyScreen } from '@/screens/difficulty-screen';
import { GameOverScreen } from '@/screens/game-over-screen';
import { GameScreen } from '@/screens/game-screen';
import { HomeScreen } from '@/screens/home-screen';
import { PlacePickerScreen } from '@/screens/place-picker-screen';
import { useThemeStore } from '@/stores/use-theme-store';
import './app.css';
import './game.css';

function currentScreen(flow: GameFlow): ReactNode {
  const { state } = flow;

  switch (state.screen) {
    case 'difficulty':
      return <DifficultyScreen onSelect={flow.selectDifficulty} onBack={flow.goHome} />;

    case 'placePicker':
      return <PlacePickerScreen onSelect={flow.pickPlace} onBack={flow.play} />;

    case 'game':
      return <GameScreen initialState={state.game} onExit={flow.endGame} onQuit={flow.goHome} />;

    case 'gameOver':
      return (
        <GameOverScreen
          score={state.score}
          difficulty={state.difficulty}
          onPlayAgain={flow.playAgain}
          onHome={flow.goHome}
        />
      );

    default:
      return <HomeScreen onPlay={flow.play} />;
  }
}

export function App() {
  useAudio();
  const flow = useGameFlow();
  const theme = useThemeStore((store) => store.theme);

  return <ThemeProvider theme={theme}>{currentScreen(flow)}</ThemeProvider>;
}
