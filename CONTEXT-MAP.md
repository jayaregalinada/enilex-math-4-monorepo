# Context Map — Enilex Math 4 Monorepo

A monorepo of interactive Grade 4 (ages 9–10) math learning games. Each game is
an app; shared engines (game logic, audio, themes, UI) live in `packages/`.

**Doc organization:** System-wide architecture decisions (ADRs) live in
[`docs/adr/`](./docs/adr/). App-specific docs — build plans, specs, CONTEXT, and
anything else scoped to one app — live in that app's own `docs/` folder.

## Contexts

| Context | Location | Description |
|---------|----------|-------------|
| Rounding Numbers | `apps/rounding-numbers/` | First game: round whole numbers to a given place value (tens → hundred millions). Domain language & decisions in its [`CONTEXT.md`](./apps/rounding-numbers/docs/CONTEXT.md); build plan in [`BUILD-PLAN.md`](./apps/rounding-numbers/docs/BUILD-PLAN.md). |

## Shared packages (planned)

| Package | Responsibility |
|---------|----------------|
| `packages/game-core` | Framework-agnostic TS: rounding engine, number/distractor generators, scoring, game state machine. Fully unit-tested. |
| `packages/audio` | Web Audio synthesis: SFX + per-difficulty background music, mute. |
| `packages/themes` | Cosmetic theme definitions (palettes, mascots, icons) + provider. |
| `packages/ui` | Shared presentational React components. |
