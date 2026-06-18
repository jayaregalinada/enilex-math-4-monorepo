import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useLeaderboardStore } from '@/stores/use-leaderboard-store';

/**
 * Clears the whole leaderboard, gated behind a Radix confirm dialog (destructive
 * and irreversible, so it must not be a single tap). Radix gives the alert dialog
 * its focus-trap and ARIA (ADR 0004).
 */
export function ClearScoresButton() {
  const clearEntries = useLeaderboardStore((state) => state.clearEntries);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button type="button" className="btn btn--ghost">
          Clear scores
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog__overlay" />
        <AlertDialog.Content className="dialog__content">
          <AlertDialog.Title className="dialog__title">Clear all scores?</AlertDialog.Title>
          <AlertDialog.Description className="dialog__description">
            This removes every leaderboard entry saved on this device. It can&apos;t be undone.
          </AlertDialog.Description>
          <div className="dialog__actions">
            <AlertDialog.Action asChild>
              <button type="button" className="btn btn--danger" onClick={clearEntries}>
                Clear
              </button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <button type="button" className="btn btn--ghost">
                Cancel
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
