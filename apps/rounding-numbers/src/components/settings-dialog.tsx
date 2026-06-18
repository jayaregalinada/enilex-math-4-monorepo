import { IconSettings } from '@enilex-math-4-pkg/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { ClearScoresButton } from '@/components/clear-scores-button';
import { EffectsToggle } from '@/components/effects-toggle';
import { MuteToggle } from '@/components/mute-toggle';

/**
 * Settings overlay: sound on/off and clear-scores. Opened from a gear button.
 * Radix Dialog handles focus-trap/Escape/ARIA (ADR 0004); styling is our own CSS.
 */
export function SettingsDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {/* a11y: icon-only trigger needs an explicit label. */}
        <button type="button" className="icon-button" aria-label="Settings">
          <IconSettings />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog__overlay" />
        <Dialog.Content className="dialog__content">
          <Dialog.Title className="dialog__title">Settings</Dialog.Title>
          <Dialog.Description className="dialog__description">
            Sound, effects, and saved scores.
          </Dialog.Description>
          <div className="settings">
            <div className="settings__row">
              <span>Sound</span>
              <MuteToggle />
            </div>
            <div className="settings__row">
              <span>Reduce effects</span>
              <EffectsToggle />
            </div>
            <div className="settings__row">
              <span>Leaderboard</span>
              <ClearScoresButton />
            </div>
          </div>
          <div className="dialog__actions">
            <Dialog.Close asChild>
              <button type="button" className="btn btn--ghost">
                Done
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
