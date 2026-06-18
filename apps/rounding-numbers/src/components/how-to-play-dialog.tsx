import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * Onboarding card explaining the game. On first visit it opens automatically, but
 * only AFTER the sound gate has been answered (`seenSoundPrompt`), so the two
 * first-run modals don't stack. Dismissal is remembered via `seenHowToPlay`, and
 * it stays reopenable from its button. Radix handles focus-trap/Escape/ARIA.
 */
export function HowToPlayDialog() {
  const seenHowToPlay = useSettingsStore((state) => state.seenHowToPlay);
  const seenSoundPrompt = useSettingsStore((state) => state.seenSoundPrompt);
  const markHowToPlaySeen = useSettingsStore((state) => state.markHowToPlaySeen);
  const [open, setOpen] = useState(false);

  // Auto-open once the sound gate is done, on first visit only.
  useEffect(() => {
    if (!seenHowToPlay && seenSoundPrompt) {
      setOpen(true);
    }
  }, [seenHowToPlay, seenSoundPrompt]);

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
