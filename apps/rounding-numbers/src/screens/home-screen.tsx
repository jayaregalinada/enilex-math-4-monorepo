import { HowToPlayDialog } from '@/components/how-to-play-dialog';
import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';
import { SettingsDialog } from '@/components/settings-dialog';
import { SoundGateDialog } from '@/components/sound-gate-dialog';

export interface HomeScreenProps {
  onPlay: () => void;
  onLeaderboard: () => void;
}

/** Landing screen: title, Play, Leaderboard, how-to-play, and the audio/settings controls. */
export function HomeScreen({ onPlay, onLeaderboard }: HomeScreenProps) {
  return (
    <section className="screen home">
      <div className="screen-controls">
        <NextTrackButton />
        <MuteToggle />
        <SettingsDialog />
      </div>
      <p className="screen__eyebrow">Enilex Math 4</p>
      <h1 className="screen__title">Rounding Numbers</h1>
      <p className="screen__subtitle">Round whole numbers to the nearest place value.</p>
      <button type="button" className="btn btn--primary" onClick={onPlay}>
        Play
      </button>
      <button type="button" className="btn btn--ghost" onClick={onLeaderboard}>
        Leaderboard
      </button>
      <HowToPlayDialog />
      <SoundGateDialog />
    </section>
  );
}
