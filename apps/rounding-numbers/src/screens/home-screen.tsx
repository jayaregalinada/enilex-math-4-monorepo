import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';

export interface HomeScreenProps {
  onPlay: () => void;
}

/** Landing screen: title and a single Play call-to-action. */
export function HomeScreen({ onPlay }: HomeScreenProps) {
  return (
    <section className="screen home">
      <div className="screen-controls">
        <NextTrackButton />
        <MuteToggle />
      </div>
      <p className="screen__eyebrow">Enilex Math 4</p>
      <h1 className="screen__title">Rounding Numbers</h1>
      <p className="screen__subtitle">Round whole numbers to the nearest place value.</p>
      <button type="button" className="btn btn--primary" onClick={onPlay}>
        Play
      </button>
    </section>
  );
}
