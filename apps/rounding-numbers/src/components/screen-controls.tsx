import { MuteToggle } from '@/components/mute-toggle';
import { NextTrackButton } from '@/components/next-track-button';
import { SettingsDialog } from '@/components/settings-dialog';

/**
 * The always-on audio/settings cluster (next track, mute, settings). Rendered once
 * at the app root so it floats over every screen — Home, the picker, in-game, and
 * game-over alike — keeping sound controls reachable everywhere.
 */
export function ScreenControls() {
  return (
    <div className="screen-controls">
      <NextTrackButton />
      <MuteToggle />
      <SettingsDialog />
    </div>
  );
}
