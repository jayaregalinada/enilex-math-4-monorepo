import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { gameAudio } from '@/lib/game-audio';
import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * "Turn on sound?" gate shown on Home before the how-to-play card. It appears on
 * **every** load (the `soundReady` flag is session-only) because browsers need a
 * fresh user gesture each visit to unlock the audio context — answering the gate
 * is that gesture. It records the choice into the `muted` setting and demands an
 * explicit Yes/No (no Escape/outside dismiss). Yes is the default action.
 */
export function SoundGateDialog() {
  const soundReady = useSettingsStore((state) => state.soundReady);
  const setMuted = useSettingsStore((state) => state.setMuted);
  const markSoundReady = useSettingsStore((state) => state.markSoundReady);
  const [open, setOpen] = useState(!soundReady);
  const yesRef = useRef<HTMLButtonElement>(null);

  function choose(soundOn: boolean) {
    setMuted(!soundOn);
    markSoundReady();
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
          // Default to Yes: focus it on open so Enter turns sound on.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            yesRef.current?.focus();
          }}
        >
          <Dialog.Title className="dialog__title">Turn on sound?</Dialog.Title>
          <Dialog.Description className="dialog__description">
            This game has music and sound effects. You can change this later in Settings.
          </Dialog.Description>
          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={() => choose(false)}>
              No
            </button>
            <button
              ref={yesRef}
              type="button"
              className="btn btn--primary"
              onClick={() => choose(true)}
            >
              Yes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
