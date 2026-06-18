import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** localStorage key for persisted settings. Nicknames-only project — no PII (ADR 0003). */
const STORAGE_KEY = 'enilex-math-4:rounding-numbers:settings';

/** Persisted player settings. Mute is the only one today; themes/etc. arrive later. */
export interface SettingsStore {
  muted: boolean;
  toggleMuted: () => void;
  setMuted: (muted: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      muted: false,
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Bump `version` and branch here when the persisted shape changes.
      migrate: (persisted) => persisted as SettingsStore,
    },
  ),
);
