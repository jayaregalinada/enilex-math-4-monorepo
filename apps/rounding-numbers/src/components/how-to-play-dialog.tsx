import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * Onboarding card explaining the game. Opens automatically the first time (until
 * dismissed, persisted via `seenHowToPlay`) and is reopenable from its button.
 * Radix Dialog handles focus-trap/Escape/ARIA (ADR 0004).
 */
export function HowToPlayDialog() {
  const seenHowToPlay = useSettingsStore((state) => state.seenHowToPlay);
  const markHowToPlaySeen = useSettingsStore((state) => state.markHowToPlaySeen);
  const [open, setOpen] = useState(!seenHowToPlay);

  function handleOpenChange(next: boolean) {
    setOpen(next);

    // Remember the first dismissal so it doesn't auto-open again.
    if (!next) {
      markHowToPlaySeen();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn--ghost">
          How to play
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog__overlay" />
        <Dialog.Content className="dialog__content">
          <Dialog.Title className="dialog__title">How to play</Dialog.Title>
          <Dialog.Description className="dialog__description">
            Round the number to the place value shown.
          </Dialog.Description>
          <ul className="how-to-play">
            <li>Pick the answer that rounds the number to the nearest place value.</li>
            <li>A streak earns bonus points — every 10 in a row is a big bonus.</li>
            <li>Wrong answers cost a life. Run out of lives and the game ends.</li>
            <li>Hard mode is timed and picks a random place value each question.</li>
          </ul>
          <div className="dialog__actions">
            <Dialog.Close asChild>
              <button type="button" className="btn btn--primary">
                Got it
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
