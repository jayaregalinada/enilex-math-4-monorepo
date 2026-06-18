import type { MusicContext } from '@enilex-math-4-pkg/audio';
import { ThemeProvider } from '@enilex-math-4-pkg/themes';
import type { ReactNode } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { type FlowState, type GameFlow, useGameFlow } from '@/hooks/use-game-flow';
import { DifficultyScreen } from '@/screens/difficulty-screen';
import { GameOverScreen } from '@/screens/game-over-screen';
import { GameScreen } from '@/screens/game-screen';
import { HomeScreen } from '@/screens/home-screen';
import { LeaderboardScreen } from '@/screens/leaderboard-screen';
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
          onLeaderboard={flow.viewLeaderboard}
          onHome={flow.goHome}
        />
      );

    case 'leaderboard':
      return <LeaderboardScreen onBack={flow.goHome} />;

    default:
      return <HomeScreen onPlay={flow.play} onLeaderboard={flow.viewLeaderboard} />;
  }
}

/** Hard runs get their own playlist; everything else shares the general pool. */
function musicContextFor(state: FlowState): MusicContext {
  if (state.screen === 'game' && state.difficulty === 'hard') {
    return 'hard';
  }

  return 'general';
}

export function App() {
  const flow = useGameFlow();
  const theme = useThemeStore((store) => store.theme);
  useAudio(musicContextFor(flow.state));

  return <ThemeProvider theme={theme}>{currentScreen(flow)}</ThemeProvider>;
}
