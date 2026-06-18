import * as Dialog from '@radix-ui/react-dialog';

export interface PauseDialogProps {
  open: boolean;
  onResume: () => void;
  onQuit: () => void;
}

/**
 * The pause overlay. Driven by the paused game state, so the Hard timer freezes
 * while it's open. Resume continues the run; Quit abandons it (no score saved).
 * `modal` and not dismissable by Escape/overlay — the player must choose.
 */
export function PauseDialog({ open, onResume, onQuit }: PauseDialogProps) {
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
          <div className="dialog__actions">
            <button type="button" className="btn btn--primary" onClick={onResume}>
              Resume
            </button>
            <button type="button" className="btn btn--ghost" onClick={onQuit}>
              Quit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
