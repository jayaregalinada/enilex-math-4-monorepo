import { useSettingsStore } from '@/stores/use-settings-store';

/** Percent steps for the volume range input (0–100 maps to a 0–1 volume). */
const MAX_PERCENT = 100;

/**
 * A volume slider backed by the persisted settings store. 0 is silent (an
 * effective mute); the engine folds this value into the master gain via
 * `setVolume` (see `useAudio`).
 */
export function VolumeSlider() {
  const volume = useSettingsStore((state) => state.volume);
  const setVolume = useSettingsStore((state) => state.setVolume);
  const percent = Math.round(volume * MAX_PERCENT);

  return (
    <input
      type="range"
      className="volume-slider"
      min={0}
      max={MAX_PERCENT}
      value={percent}
      onChange={(event) => setVolume(Number(event.target.value) / MAX_PERCENT)}
      // a11y: name the control and announce the current level as a percentage.
      aria-label="Volume"
      aria-valuetext={`${percent}%`}
    />
  );
}
