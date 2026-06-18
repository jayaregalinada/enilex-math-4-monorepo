# 5. Zustand as the app state layer (game-core stays pure)

Date: 2026-06-18
Status: Accepted

## Context

`packages/game-core` exposes a **pure, framework-agnostic** game state machine
(`gameReducer`) that is exhaustively unit-tested without React. That purity is a
deliberate strength and must be preserved.

The app, however, has cross-cutting and persisted state that local
`useState`/`useReducer` serve awkwardly:

- **Settings** (mute) and the **leaderboard**, both persisted to `localStorage`
  (single-device, nicknames only — see [ADR 0003](./0003-no-children-pii.md)).
- **Theme selection** (M5), chosen once per run.
- A **game session** that audio and effects (M4) need to react to. The design
  says "the app wires timers/audio/animation to the state machine's
  transitions"; doing that through prop-drilling from a local `useReducer` gets
  unwieldy.

Alternatives considered:

- **React Context + `useReducer`.** No dependency, but provider boilerplate,
  whole-subtree re-render fan-out unless split into many contexts, and we'd still
  hand-roll `localStorage` persistence.
- **Redux Toolkit.** More structure than this single-device game needs; heavier
  boilerplate.
- **Jotai (atoms).** Fine, but a store + `persist` maps more directly onto the
  leaderboard/settings need.
- **Stay on local hooks.** Works for M2, but doesn't serve out-of-React audio
  subscription or persistence.

## Decision

Adopt **Zustand** as the **app's** state layer:

- A **session store** holds the live `GameState`; its actions **delegate to the
  pure `gameReducer`** (`set((s) => ({ game: gameReducer(s.game, action) }))`).
  No game rules move into the store.
- **Persisted slices** — `settings` (mute) and `leaderboard` — use Zustand's
  `persist` middleware backed by `localStorage`, with an explicit store
  `version` and a `migrate` function so the persisted schema can evolve.
- Stores live in the **app** (`apps/rounding-numbers`), one store per concern,
  following repo conventions (named exports, one value export per file, kebab
  filenames, co-located tests). `packages/game-core` takes **no** dependency on
  Zustand and stays pure.

## Consequences

- Small (~1 KB) dependency; selective subscriptions mean the HUD re-renders
  without re-rendering the answer grid, and out-of-React code (audio) can
  subscribe to transitions.
- `persist` removes hand-rolled `localStorage` code but adds a **schema
  version/migration** responsibility for the leaderboard.
- The core/store boundary must be respected: correctness stays in `game-core`,
  the store only orchestrates. Store tests reset state between cases.
- First lands at **M4** (session store so audio reacts to transitions) and
  **M6** (persisted leaderboard + settings). M2 is not refactored immediately;
  it keeps its local `useReducer` until the session store arrives.
