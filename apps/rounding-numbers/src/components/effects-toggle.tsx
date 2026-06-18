import { gameAudio } from '@/lib/game-audio';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * Settings toggle for the "Reduce effects" preference. On flips the retro FX
 * (CRT, scanlines, background, transitions) down regardless of the OS setting.
 */
export function EffectsToggle() {
  const reduceEffects = useSettingsStore((state) => state.reduceEffects);
  const toggleReduceEffects = useSettingsStore((state) => state.toggleReduceEffects);

  function handleClick() {
    toggleReduceEffects();
    gameAudio.playSoundEffect('tap');
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={handleClick}
      // a11y: pressed = effects are reduced; the visible word echoes that state.
      aria-pressed={reduceEffects}
      aria-label="Reduce effects"
    >
      {reduceEffects ? 'On' : 'Off'}
    </button>
  );
}
