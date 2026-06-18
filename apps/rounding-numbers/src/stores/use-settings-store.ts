import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** localStorage key for persisted settings. Nicknames-only project — no PII (ADR 0003). */
const STORAGE_KEY = 'enilex-math-4:rounding-numbers:settings';

/** Persisted player settings: audio, onboarding flags, and the retro-FX preference. */
export interface SettingsStore {
  muted: boolean;
  seenHowToPlay: boolean;
  /** Whether the first-visit "Turn on sound?" gate has been answered. */
  seenSoundPrompt: boolean;
  /** When true, tone down the retro FX (CRT, scanlines, background, transitions). */
  reduceEffects: boolean;
  toggleMuted: () => void;
  setMuted: (muted: boolean) => void;
  markHowToPlaySeen: () => void;
  markSoundPromptSeen: () => void;
  setReduceEffects: (reduceEffects: boolean) => void;
  toggleReduceEffects: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      muted: false,
      seenHowToPlay: false,
      seenSoundPrompt: false,
      reduceEffects: false,
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
      markHowToPlaySeen: () => set({ seenHowToPlay: true }),
      markSoundPromptSeen: () => set({ seenSoundPrompt: true }),
      setReduceEffects: (reduceEffects) => set({ reduceEffects }),
      toggleReduceEffects: () => set((state) => ({ reduceEffects: !state.reduceEffects })),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      // v1 had no `seenSoundPrompt`/`reduceEffects`; default them so an existing
      // player isn't re-shown the sound gate with the wrong shape.
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsStore>;

        if (version < 2) {
          return {
            ...state,
            seenSoundPrompt: state.seenSoundPrompt ?? false,
            reduceEffects: state.reduceEffects ?? false,
          } as SettingsStore;
        }

        return state as SettingsStore;
      },
    },
  ),
);
