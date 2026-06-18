# Build Plan — Enilex Math 4 Monorepo / Rounding Numbers

This plan turns the design in [`CONTEXT.md`](./CONTEXT.md) into an ordered,
reviewable implementation. The first deliverable is the **Rounding Numbers**
game; the structure is set up so later games reuse the shared packages.

Tooling decision: see
[ADR 0001](../../../docs/adr/0001-monorepo-pnpm-turborepo.md)
(pnpm workspaces + Turborepo).

---

## 1. Repository layout

```
enilex-math-4-monorepo/
├── package.json                 # root: pnpm workspaces, turbo, shared dev deps
├── pnpm-workspace.yaml          # apps/*, packages/*
├── turbo.json                   # build / dev / test / lint pipelines
├── tsconfig.base.json           # shared compiler options, path aliases
├── .eslintrc.* / .prettierrc    # shared lint/format
├── docs/                        # system-wide ADRs + this plan
├── packages/
│   ├── game-core/               # pure TS, no React, no DOM. Fully unit-tested.
│   ├── audio/                   # Web Audio synthesis (SFX + music), framework-light
│   ├── themes/                  # cosmetic theme defs + provider
│   └── ui/                      # shared presentational React components
└── apps/
    └── rounding-numbers/        # the Vite + React game (composition root)
        └── CONTEXT.md           # design + an own-words summary of the rounding rule
```

Stack: **React 18 + TypeScript + Vite**, **Vitest** + **React Testing Library**
for tests, **Framer Motion** (or CSS) for animation, **canvas-confetti** for
milestone bursts. No backend; persistence is `localStorage`.

---

## 2. Package responsibilities & key contracts

### `packages/game-core` (the brain — no UI)

The place where all correctness lives, so it can be exhaustively unit-tested
without a browser.

- **Place-value ladder.** `PLACES` = ordered list, index 0→7:
  tens(10¹) … hundred millions(10⁸). Each entry: `{ index, label, exponent }`.
- **Rounding engine.** `roundTo(n, exponent)`. Uses half-up at the look digit
  (matches the lesson's "5 or greater rounds up"). Returns `{ rounded, lower,
  upper, targetDigit, lookDigit, roundedUp }` so the UI can render the
  explanation and number line without recomputing.
- **Number generator.** `generateNumber(exponent, difficulty) -> number` with
  invariants: the target place exists in the number, value < 10⁹. Difficulty
  shapes the **look-digit distribution**:
  - *Easy* — look digit mostly far from 5 ({0–3} or {6–9}); boundary (=5) rare;
    no cascade.
  - *Normal* — adds exactly-5 boundaries; mild.
  - *Hard* — any look digit; deliberately engineers cascade/carry cases
    (target digit 9 with round-up → ripples, e.g. 95,500 → 100,000).
- **Distractor generator.** `generateChoices(n, exponent, difficulty) ->
  Choice[]` where `Choice = { value, kind }`, `kind ∈ {correct,
  wrongDirection, adjacentPlace, truncated, didntZero}`. Builds candidates from
  all four misconceptions, **dedups** (drop any equal to the correct answer or to
  each other), then picks 3 distinct distractors (+ correct), shuffled. A
  fallback ordering guarantees 3 valid options even when some misconceptions
  collapse for a given number.
- **Explanation builder.** `explain(choice, n, exponent) -> Explanation` giving
  the tailored "why right / why this wrong" text per `kind`.
- **Difficulty config.** Lives/timer/regain table:
  `{ easy:{lives:5,timer:null,regain:false}, normal:{lives:4,...},
  hard:{lives:3,timer:10,regain:true,maxLives:3} }`.
- **Scoring.** `scoreFor(streakAfter)` → base 10 + (streak≥3 ? 5*(streak-2) : 0);
  milestone +100 every 10. `overallWeight(difficulty)` → 1 / 2 / 3.
- **Place-value sequencer.** Given difficulty + current place, returns the next
  question's place: Easy = fixed; Normal = ±1 random walk bouncing at ends;
  Hard = uniform random.
- **Game state machine.** A reducer (`init/answer/timeout/next/pause/resume/quit`)
  holding `lives, score, streak, currentQuestion, status`. Pure and tested; the
  app wires timers/audio/animation to its transitions.

### `packages/audio`

- Lazily-created shared `AudioContext` (resumed on first user gesture — required
  by browsers).
- **SFX:** small synth helpers (oscillator + gain envelopes) for `tap, correct,
  wrong, streak, lifeLost, lifeGained, gameOver`.
- **Music:** a tiny note-sequencer playing a looping melody; **3 tunes**, one per
  difficulty (different tempo/scale/mood). Start/stop on game enter/exit.
- **Mute:** master gain to 0; persisted to `localStorage`.
- React-friendly `useAudio()` hook wrapper.

### `packages/themes`

- `THEMES` = array of ~4 cosmetic themes: `{ id, name, palette (CSS vars),
  Mascot (React component w/ idle/cheer/sad states), lifeIcon, bgArt }`.
- `pickRandomTheme()` and a `<ThemeProvider>` that injects palette CSS variables.
- Mascots & backgrounds are CSS/SVG/emoji — no image files.

### `packages/ui`

Presentational, theme-aware, no game logic:
`NumberDisplay` (comma grouping + digit highlighting for the explanation),
`AnswerButton` (green-pop / red-shake states), `NumberLine` (animated endpoints +
tick), `LivesBar`, `ScoreBadge`, `StreakMeter`, `TimerBar`, `Modal`, `Card`.

---

## 3. App screens (`apps/rounding-numbers`)

Single-page, client-side screen state (no router needed): `Splash → Home →
Difficulty → (PlaceValuePicker) → Game → GameOver → Leaderboard`, plus overlays
`HowToPlay`, `Pause`, `Settings`, `NameEntry`.

- **Game screen** composes the HUD (lives, score, streak, Hard timer bar, pause),
  the question + 4 answer buttons, and — on Easy/Normal after answering — the
  **Explanation panel** (digit-highlighted number + rule + number line + Next).
  Hard auto-advances (~1.5s correct / ~2s wrong/missed).
- **Leaderboard** = `localStorage` repo (key `enilex-math-4:rounding-numbers:leaderboard`):
  four tabs (Easy/Normal/Hard top-10 by points + Overall by weighted points).
- **Settings**: mute toggle, Clear scores (confirm-gated).
- **Name entry**: prompted at every game-over, prefilled with last-used name.

---

## 4. Build order (reviewable milestones)

Each milestone is independently demoable and staged for review.

- **M0 — Bootstrap.** pnpm workspace, turbo.json, tsconfig.base, lint/format,
  empty `apps/rounding-numbers` Vite app that boots a blank themed page.
- **M1 — game-core + tests.** Ladder, rounding engine, number generator,
  distractor generator, sequencer, scoring, state machine. Vitest suite covering:
  rounding correctness across all 8 places incl. boundaries & cascades;
  generator invariants & difficulty distributions; distractors always 3 distinct,
  valid, never == correct; scoring/streak math; Normal random-walk bounces.
- **M2 — Playable shell.** Home → Difficulty → Picker → Game → GameOver wired to
  game-core with plain styling. No audio/themes yet. End-to-end playable.
- **M3 — Teaching layer.** Explanation panel: `NumberDisplay` highlighting +
  animated `NumberLine` + per-kind explanation text (Easy/Normal only).
- **M4 — Audio.** SFX + 3 per-difficulty tunes + mute, wired to state-machine
  transitions.
- **M5 — Themes.** 4 themes, random selection per game, mascots with
  idle/cheer/sad reactions.
- **M6 — Leaderboard & settings.** localStorage repo, 4 tabs, name entry, clear
  scores.
- **M7 — Juice & flow.** Button pop/shake, confetti on streak milestones, screen
  transitions, onboarding card, pause/quit.
- **M8 — Polish & QA.** Responsive/tablet pass, accessibility (non-color-only
  highlighting, focus, touch sizing), a Playwright smoke test of a full run.

---

## 5. Testing strategy

- **Unit (Vitest):** all of `game-core` — this is where correctness is proven.
  Aim for full coverage of rounding, generation, distractors, scoring.
- **Component (RTL):** answer flow, explanation rendering, leaderboard sorting,
  life/score updates.
- **E2E (Playwright, smoke):** play a short game in each difficulty; verify
  game-over, name entry, and a leaderboard entry appears.

---

## 6. Open implementation details (decided during build, not blocking)

- Exact mascot art per theme and their idle/cheer/sad poses.
- Precise music note sequences per difficulty.
- Animation timing/easing constants and confetti density.
- `didntZero` distractor's exact construction when it collides with `n`
  (fallback to another misconception — generator already guarantees 3 valid).
