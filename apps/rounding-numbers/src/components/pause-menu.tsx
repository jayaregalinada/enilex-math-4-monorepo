import * as Dialog from '@radix-ui/react-dialog';
import { MuteToggle } from '@/components/mute-toggle';

export interface PauseMenuProps {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

/**
 * The in-game pause menu. Driven by the paused game state, so the Hard timer
 * freezes while it's open. Resume continues; Restart re-runs the same difficulty
 * and place value; Sound toggles audio; Quit abandons the run (no score saved).
 * Modal and not dismissable by Escape/overlay — the player must choose.
 */
export function PauseMenu({ open, onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        {/* Blur + darken the board so the question can't be read while paused. */}
        <Dialog.Overlay className="dialog__overlay dialog__overlay--blur" />
        <Dialog.Content
          className="dialog__content"
          // Keep focus on the choice; don't let Escape/outside-click dismiss it.
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className="dialog__title">Paused</Dialog.Title>
          <Dialog.Description className="dialog__description">
            Take a breather. Your run is waiting.
          </Dialog.Description>
          <div className="pause-menu">
            <button type="button" className="btn btn--primary" onClick={onResume}>
              Resume
            </button>
            <button type="button" className="btn" onClick={onRestart}>
              Restart
            </button>
            <div className="settings__row">
              <span>Sound</span>
              <MuteToggle />
            </div>
            <button type="button" className="btn btn--ghost" onClick={onQuit}>
              Quit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
