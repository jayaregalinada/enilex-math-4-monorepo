import { gameAudio } from '@/lib/game-audio';
import { useSettingsStore } from '@/stores/use-settings-store';

export interface MuteToggleProps {
  className?: string;
}

/**
 * Plain accessible sound on/off switch backed by the persisted settings store.
 * A Radix Switch is deferred to M6/M7 (ADR 0004); a button with `aria-pressed`
 * is enough here.
 */
export function MuteToggle({ className }: MuteToggleProps) {
  const muted = useSettingsStore((state) => state.muted);
  const toggleMuted = useSettingsStore((state) => state.toggleMuted);

  function handleClick() {
    toggleMuted();
    // Play the tap after toggling so unmuting is confirmed audibly.
    gameAudio.playSoundEffect('tap');
  }

  return (
    <button
      type="button"
      className={className === undefined ? 'icon-button' : `icon-button ${className}`}
      onClick={handleClick}
      // a11y: an icon-only control needs an explicit label and pressed state.
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
    </button>
  );
}
