import { Mascot } from '@enilex-math-4-pkg/themes';
import { HowToPlayDialog } from '@/components/how-to-play-dialog';
import { InstallDialog } from '@/components/install-dialog';
import { SoundGateDialog } from '@/components/sound-gate-dialog';

export interface HomeScreenProps {
  onPlay: () => void;
  onLeaderboard: () => void;
}

/** Landing screen: the theme's mascot hero, title, Play, Leaderboard, how-to-play. */
export function HomeScreen({ onPlay, onLeaderboard }: HomeScreenProps) {
  return (
    <section className="screen home">
      <div className="home__mascot">
        <Mascot mood="idle" />
      </div>
      <p className="screen__eyebrow">Enilex Math 4</p>
      <h1 className="screen__title">Rounding Numbers</h1>
      <p className="screen__subtitle">Round whole numbers to the nearest place value.</p>
      <button type="button" className="btn btn--primary btn--lg" onClick={onPlay}>
        Play
      </button>
      <button type="button" className="btn btn--ghost btn--sm" onClick={onLeaderboard}>
        Leaderboard
      </button>
      <HowToPlayDialog />
      <InstallDialog />
      <SoundGateDialog />
    </section>
  );
}
