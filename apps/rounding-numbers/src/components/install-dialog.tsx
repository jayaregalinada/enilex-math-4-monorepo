import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/use-install-prompt';

/**
 * "Install app" button and contextual install instructions dialog.
 *
 * Renders nothing when the app is already installed in standalone mode. On click:
 *  - If a native `beforeinstallprompt` event was captured, triggers it directly
 *    (no dialog opens; the browser handles the UI).
 *  - Otherwise opens a Radix dialog with platform-appropriate manual steps
 *    (iOS share-sheet, or browser-menu hint for desktop/Android).
 *
 * Radix handles focus-trap, Escape, and ARIA for the dialog.
 */
export function InstallDialog() {
  const { canPromptInstall, isInstalled, isIOS, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);

  // Already installed — hide entirely.
  if (isInstalled) {
    return null;
  }

  function handleButtonClick() {
    if (canPromptInstall) {
      // Native flow: browser handles the prompt UI — no dialog needed.
      void promptInstall();
    } else {
      // Manual flow: open platform-specific instructions.
      setOpen(true);
    }
  }

  return (
    <>
      <button type="button" className="btn btn--ghost btn--sm" onClick={handleButtonClick}>
        Install app
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog__overlay" />
          <Dialog.Content className="dialog__content">
            <Dialog.Title className="dialog__title">Install app</Dialog.Title>
            {isIOS ? (
              <Dialog.Description className="dialog__description">
                Tap the <strong>Share</strong> button in Safari, then choose{' '}
                <strong>Add to Home Screen</strong>.
              </Dialog.Description>
            ) : (
              <Dialog.Description className="dialog__description">
                Open your browser menu and choose <strong>Install app</strong>, or look for the
                install icon in the address bar.
              </Dialog.Description>
            )}
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
    </>
  );
}
