import { useGameFlow } from './hooks/use-game-flow';
import { DifficultyScreen } from './screens/difficulty-screen';
import { GameOverScreen } from './screens/game-over-screen';
import { GameScreen } from './screens/game-screen';
import { HomeScreen } from './screens/home-screen';
import { PlacePickerScreen } from './screens/place-picker-screen';
import './app.css';
import './game.css';

export function App() {
  const flow = useGameFlow();
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
