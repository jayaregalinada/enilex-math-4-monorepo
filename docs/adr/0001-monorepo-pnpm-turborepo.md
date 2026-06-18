# 1. Monorepo with pnpm workspaces + Turborepo

Date: 2026-06-18
Status: Accepted

## Context

This repository is intended to hold multiple Grade 4 math learning games, not
just the first (Rounding Numbers). The games will share substantial
infrastructure: a Web Audio synthesis engine, a cosmetic theme system, a
leaderboard pattern, and presentational UI components. We need a repository
structure that lets the first game ship quickly while making that shared code
reusable by later games without a disruptive restructuring.

Alternatives considered:

- **Single Vite app, refactor later.** Fastest path to the first game; extract
  shared packages only when a second game needs them. Risk: the first game's code
  bakes in assumptions that make later extraction painful, and the repo name
  ("monorepo") signals the multi-app intent from day one.
- **pnpm workspaces only (no Turborepo).** Gives the `apps/` + `packages/` split
  and dependency linking, but no cross-package task caching/orchestration. Fine at
  one app; less convenient as the app/package count grows.
- **pnpm workspaces + Turborepo.** Workspace linking plus cached, orchestrated
  build/dev/test tasks across packages.

## Decision

Use **pnpm workspaces + Turborepo**. Layout: `apps/*` for games and
`packages/*` for shared code (`game-core`, `audio`, `themes`, `ui`). A root
`turbo.json` defines `build`, `dev`, `test`, and `lint` pipelines; a shared
`tsconfig.base.json` and lint config are referenced by every workspace.

## Consequences

- Shared engines (game logic, audio, themes, UI) are first-class packages from the
  start, so the second game reuses rather than copies them.
- Slightly more upfront setup and a small toolchain learning cost (pnpm + Turbo)
  versus a single app.
- Contributors must use pnpm (not npm/yarn) to respect the workspace + lockfile.
- Reversing this (collapsing to a single app) later would be more work than the
  reverse direction, which is why it's recorded here.
