import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** localStorage key for persisted settings. Nicknames-only project — no PII (ADR 0003). */
const STORAGE_KEY = 'enilex-math-4:rounding-numbers:settings';

/** Default playback volume (0–1). Sound starts on, fairly loud but not full. */
const DEFAULT_VOLUME = 0.8;

/** Persisted player settings: audio, onboarding flags, and the retro-FX preference. */
export interface SettingsStore {
  muted: boolean;
  /** Playback volume, 0–1. 0 is effectively muted; defaults to {@link DEFAULT_VOLUME}. */
  volume: number;
  seenHowToPlay: boolean;
  /**
   * Whether the "Turn on sound?" gate has been answered **this session**. Not
   * persisted — browsers need a fresh user gesture to unlock audio on every load,
   * so the gate re-asks each visit regardless of the previous choice.
   */
  soundReady: boolean;
  /** When true, tone down the retro FX (CRT, scanlines, background, transitions). */
  reduceEffects: boolean;
  toggleMuted: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  markHowToPlaySeen: () => void;
  markSoundReady: () => void;
  setReduceEffects: (reduceEffects: boolean) => void;
  toggleReduceEffects: () => void;
}

/** Clamp a volume into the 0–1 range. */
function clampVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume));
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      muted: false,
      volume: DEFAULT_VOLUME,
      seenHowToPlay: false,
      soundReady: false,
      reduceEffects: false,
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
      setVolume: (volume) => set({ volume: clampVolume(volume) }),
      markHowToPlaySeen: () => set({ seenHowToPlay: true }),
      markSoundReady: () => set({ soundReady: true }),
      setReduceEffects: (reduceEffects) => set({ reduceEffects }),
      toggleReduceEffects: () => set((state) => ({ reduceEffects: !state.reduceEffects })),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      // `soundReady` is per-session: never persist it, so the sound gate re-asks
      // on every load (audio needs a fresh gesture to unlock anyway).
      partialize: (state) => ({
        muted: state.muted,
        volume: state.volume,
        seenHowToPlay: state.seenHowToPlay,
        reduceEffects: state.reduceEffects,
      }),
      // Older versions had no `volume` (and a persisted `seenSoundPrompt`, now
      // dropped); default the volume so existing players aren't left silent.
      migrate: (persisted) => {
        const state = persisted as Partial<SettingsStore>;

        return {
          ...state,
          volume: state.volume ?? DEFAULT_VOLUME,
          reduceEffects: state.reduceEffects ?? false,
        } as SettingsStore;
      },
    },
  ),
);
