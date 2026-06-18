import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import * as Dialog from '@radix-ui/react-dialog';
import { type FormEvent, useState } from 'react';
import { formatNumber } from '@/lib/format-number';
import { useLeaderboardStore } from '@/stores/use-leaderboard-store';

export interface NameEntryDialogProps {
  open: boolean;
  score: number;
  difficulty: Difficulty;
  /** Called after saving or skipping, so the parent can close the dialog. */
  onClose: () => void;
}

const MAX_NAME_LENGTH = 16;

/**
 * Prompts for a nickname at game over and saves the run to the leaderboard.
 * Prefilled with the last-used nickname. Radix Dialog handles focus-trap, Escape,
 * and ARIA (ADR 0004). Nicknames only — never real names (ADR 0003).
 */
export function NameEntryDialog({ open, score, difficulty, onClose }: NameEntryDialogProps) {
  const lastName = useLeaderboardStore((state) => state.lastName);
  const addEntry = useLeaderboardStore((state) => state.addEntry);
  const [name, setName] = useState(lastName);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addEntry({ name, score, difficulty });
    onClose();
  }

  function handleOpenChange(next: boolean) {
    // Radix requests close (Escape / overlay / Skip) — bubble it to the parent.
    if (!next) {
      onClose();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog__overlay" />
        <Dialog.Content className="dialog__content">
          <Dialog.Title className="dialog__title">Save your score</Dialog.Title>
          <Dialog.Description className="dialog__description">
            {formatNumber(score)} points on {difficulty}. Enter a nickname for the leaderboard.
          </Dialog.Description>
          <form className="name-entry" onSubmit={handleSubmit}>
            {/* a11y: explicit label since the prompt is the dialog title, not a <label>. */}
            <input
              className="name-entry__input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={MAX_NAME_LENGTH}
              placeholder="Nickname"
              aria-label="Nickname"
            />
            <div className="dialog__actions">
              <button type="submit" className="btn btn--primary">
                Save
              </button>
              <Dialog.Close asChild>
                <button type="button" className="btn btn--ghost">
                  Skip
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
