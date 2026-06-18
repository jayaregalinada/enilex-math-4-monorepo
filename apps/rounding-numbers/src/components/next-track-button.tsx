import { IconNextTrack } from '@enilex-math-4-pkg/ui';
import { gameAudio } from '@/lib/game-audio';

export interface NextTrackButtonProps {
  className?: string;
}

/** Skips to the next shuffled background track. */
export function NextTrackButton({ className }: NextTrackButtonProps) {
  function handleClick() {
    gameAudio.skipTrack();
    gameAudio.playSoundEffect('tap');
  }

  return (
    <button
      type="button"
      className={className === undefined ? 'icon-button' : `icon-button ${className}`}
      onClick={handleClick}
      // a11y: icon-only control needs an explicit label.
      aria-label="Next track"
    >
      <IconNextTrack />
    </button>
  );
}
