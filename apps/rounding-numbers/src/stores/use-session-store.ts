import { type GameAction, type GameState, gameReducer } from '@enilex-math-4-pkg/game-core';
import { create } from 'zustand';

/**
 * The live game session. Actions delegate to the pure `gameReducer` — no game
 * rules live here (see ADR 0005). Holding the session in a store lets audio and
 * effects subscribe to its transitions out of the React render cycle.
 */
export interface SessionStore {
  game: GameState | null;
  start: (initial: GameState) => void;
  dispatch: (action: GameAction) => void;
  end: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  game: null,
  start: (initial) => set({ game: initial }),
  dispatch: (action) =>
    set((state) => {
      if (state.game === null) {
        return state;
      }

      return { game: gameReducer(state.game, action) };
    }),
  end: () => set({ game: null }),
}));
