import type { Difficulty } from '@enilex-math-4-pkg/game-core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** localStorage key for the leaderboard. Nicknames only — no PII (ADR 0003). */
const STORAGE_KEY = 'enilex-math-4:rounding-numbers:leaderboard';

/** One saved run. `name` is a free-text nickname, never a real name. */
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  difficulty: Difficulty;
  playedAt: number;
}

/** The fields a caller supplies; the store fills in `id` and `playedAt`. */
export interface NewLeaderboardEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
}

export interface LeaderboardStore {
  entries: LeaderboardEntry[];
  /** Last nickname used, to prefill the next name-entry prompt. */
  lastName: string;
  addEntry: (entry: NewLeaderboardEntry) => void;
  clearEntries: () => void;
}

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set) => ({
      entries: [],
      lastName: '',
      addEntry: ({ name, score, difficulty }) =>
        set((state) => {
          const nickname = name.trim();
          const entry: LeaderboardEntry = {
            id: crypto.randomUUID(),
            name: nickname,
            score,
            difficulty,
            playedAt: Date.now(),
          };

          return { entries: [...state.entries, entry], lastName: nickname };
        }),
      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Bump `version` and branch here when the persisted shape changes.
      migrate: (persisted) => persisted as LeaderboardStore,
    },
  ),
);
