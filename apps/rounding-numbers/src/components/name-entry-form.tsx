import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { type FormEvent, useState } from 'react';
import { useLeaderboardStore } from '@/stores/use-leaderboard-store';

export interface NameEntryFormProps {
  score: number;
  difficulty: Difficulty;
  /** Called once the score has been saved, so the parent can reflect it. */
  onSaved?: () => void;
}

const MAX_NAME_LENGTH = 16;

/**
 * Inline nickname entry that saves the run to the leaderboard. Lives directly on
 * the game-over screen (no modal). Prefilled with the last-used nickname. Once
 * saved it shows a confirmation instead of the form. Nicknames only — never real
 * names (ADR 0003).
 */
export function NameEntryForm({ score, difficulty, onSaved }: NameEntryFormProps) {
  const lastName = useLeaderboardStore((state) => state.lastName);
  const addEntry = useLeaderboardStore((state) => state.addEntry);
  const [name, setName] = useState(lastName);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addEntry({ name, score, difficulty });
    setSaved(true);
    onSaved?.();
  }

  if (saved) {
    return (
      <p className="name-entry__saved" aria-live="polite">
        Saved to the leaderboard.
      </p>
    );
  }

  return (
    <form className="name-entry" onSubmit={handleSubmit}>
      <label className="name-entry__label" htmlFor="name-entry-input">
        Save your score — enter a nickname
      </label>
      <input
        id="name-entry-input"
        className="name-entry__input"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={MAX_NAME_LENGTH}
        placeholder="Nickname"
        aria-label="Nickname"
      />
      <button type="submit" className="btn btn--primary">
        Save
      </button>
    </form>
  );
}
