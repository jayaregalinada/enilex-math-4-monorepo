import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** localStorage key for persisted settings. Nicknames-only project — no PII (ADR 0003). */
const STORAGE_KEY = 'enilex-math-4:rounding-numbers:settings';

/** Persisted player settings: mute and whether the how-to-play card has been seen. */
export interface SettingsStore {
  muted: boolean;
  seenHowToPlay: boolean;
  toggleMuted: () => void;
  setMuted: (muted: boolean) => void;
  markHowToPlaySeen: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      muted: false,
      seenHowToPlay: false,
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
      markHowToPlaySeen: () => set({ seenHowToPlay: true }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Bump `version` and branch here when the persisted shape changes.
      migrate: (persisted) => persisted as SettingsStore,
    },
  ),
);
