import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { gameAudio } from '@/lib/game-audio';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * First-visit "Turn on sound?" gate (persisted via `seenSoundPrompt`). It opens
 * over Home before the how-to-play card, records the choice into the `muted`
 * setting, and — because the click is a real user gesture — unlocks the audio
 * context. It demands an explicit Yes/No (no Escape/outside dismiss) so the
 * choice is always made; later visits never show it.
 */
export function SoundGateDialog() {
  const seenSoundPrompt = useSettingsStore((state) => state.seenSoundPrompt);
  const setMuted = useSettingsStore((state) => state.setMuted);
  const markSoundPromptSeen = useSettingsStore((state) => state.markSoundPromptSeen);
  const [open, setOpen] = useState(!seenSoundPrompt);

  function choose(soundOn: boolean) {
    setMuted(!soundOn);
    markSoundPromptSeen();
    // The choice is the browser audio-unlock gesture; resume so music can start.
    void gameAudio.resume();

    if (soundOn) {
      gameAudio.playSoundEffect('tap');
    }

    setOpen(false);
  }

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog__overlay" />
        <Dialog.Content
          className="dialog__content"
          // a11y/gate: force an explicit choice — no Escape or outside dismissal.
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className="dialog__title">Turn on sound?</Dialog.Title>
          <Dialog.Description className="dialog__description">
            This game has music and sound effects. You can change this later in Settings.
          </Dialog.Description>
          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={() => choose(false)}>
              No
            </button>
            <button type="button" className="btn btn--primary" onClick={() => choose(true)}>
              Yes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
