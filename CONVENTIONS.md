# Code Conventions — Enilex Math 4 Monorepo

System-wide engineering conventions for every app and package. These are
implementation standards (not domain language — see `CONTEXT-MAP.md` for that).
Hard-to-reverse trade-offs behind them are recorded in [`docs/adr/`](./docs/adr/).

## Language & tooling

- **TypeScript** everywhere. `.ts` for logic, `.tsx` only when a file contains
  JSX. Plain `.js`/`.jsx` only where a tool forces it (e.g. some config files).
- **Biome** is the single source of truth for linting **and** formatting. There
  is no ESLint/Prettier/StandardJS in the toolchain. See
  [ADR 0002](./docs/adr/0002-biome-over-standardjs.md).
- **TypeScript strictness** (shared `tsconfig.base.json`): `strict: true` plus
  `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`,
  `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `isolatedModules`.
- **Toolchain versions:** Node 24 LTS pinned via `.nvmrc`; pnpm pinned via the
  root `packageManager` field (Corepack-activated) and required through
  `engines`. CI uses the same versions.

## Formatting (Biome, tuned toward "JS Standard with semicolons")

- 2-space indentation.
- **Single quotes** for strings; JSX attributes per Biome default.
- **Semicolons: on** (this is "Standard *with* semicolon").
- **Trailing commas: all** (multiline) — diverges from classic Standard for
  cleaner diffs; consistent with choosing Biome over literal Standard.
- **Line width: 100**.
- Known divergence we accept: Biome does **not** support Standard's
  space-before-function-paren (`function foo ()`); Biome formats `function foo()`.
- `organizeImports` enabled.

## Files

- **All filenames are lower-kebab-case.**
- **One value export per file.** Exactly one runtime/value export per file
  (function, component, class, or const). Accompanying **type/interface exports
  that belong to it** (e.g. `AnswerButtonProps`, `RoundResult`) may live in the
  same file. `index.ts` barrel files are exempt — they only re-export, never
  define.
- **Filename = kebab-case transform of the export identifier.**
  - `AnswerButton` → `answer-button.tsx`
  - `roundTo` → `round-to.ts`
  - `useAudio` → `use-audio.ts`
  - `PLACES` → `places.ts`
  - Kebab transform rules: runs of capitals (acronyms) lowercase as one unit and
    digits attach to the preceding word — `UIProvider` → `ui-provider`,
    `NumberLineSVG` → `number-line-svg`, `roundToNearest10` →
    `round-to-nearest-10`, `HTTPClient` → `http-client`.

## Exports

- **Named exports by default.** Default exports are allowed ONLY for:
  1. Tooling **config files** that require them (`vite.config.ts`,
     `vitest.config.ts`, …).
  2. **Next.js App Router special files** (`page.tsx`, `layout.tsx`, `route.ts`,
     `error.tsx`, …) — via a path-scoped override, only inside a Next app.
  3. **React.lazy / dynamic-import targets**.

## Layout

- **Flat within a feature/domain folder.** A source file, its co-located test,
  and any stylesheet sit side by side (e.g. `ui/src/answer-button.tsx`,
  `answer-button.test.tsx`, `answer-button.module.css`). Group by feature area,
  not one folder per file.
- Each package MAY expose a single `index.ts` barrel as its public API.

## Tests

- **Co-located** with the file under test: `answer-button.test.tsx`,
  `round-to.test.ts` (suffix `.test.`, next to the source).
- **Required** for files with real logic/behavior (game-core functions,
  components, hooks).
- **Exempt:** `index.ts` barrels, `*.config.*`, type-only files (pure
  interfaces/`*.types.ts`), app entry (`main.tsx`), and pure constant tables.
- Runner: **Vitest** (+ React Testing Library for components).

## Package naming

- **Apps** use the scope `@enilex-math-4/*` — e.g. `@enilex-math-4/rounding-numbers`.
- **Shared packages** use the scope `@enilex-math-4-pkg/*` — e.g.
  `@enilex-math-4-pkg/game-core`, `@enilex-math-4-pkg/audio`,
  `@enilex-math-4-pkg/themes`, `@enilex-math-4-pkg/ui`.
- A workspace's folder name is the unscoped, kebab-case package name
  (`apps/rounding-numbers`, `packages/game-core`).

## Imports

- **Cross-package:** import another workspace package only through its public
  barrel — `import { roundTo } from '@enilex-math-4-pkg/game-core'`. No deep
  imports into another package's internals.
- **Intra-package:** import directly from source files with **relative paths**
  (`./round-to`); never import a package via its own barrel (avoids cycles).

## Commit messages

- **Conventional Commits**: `type(scope): subject` — `feat`, `fix`, `chore`,
  `docs`, `test`, `refactor`, etc. Scope is usually the package/app, e.g.
  `feat(game-core): add roundTo`.
- **Enforced** by commitlint via Lefthook's `commit-msg` hook. Enables automated
  changelogs/versioning (e.g. Changesets) later.

## CI

- **GitHub Actions** on PR + `main`: cached `pnpm install`, then
  `turbo run lint test build` across the affected graph, plus the convention
  checker. (Assumes GitHub hosting.)

## Enforcement

Conventions are gated, not honor-system.

- **Biome** enforces what it natively can: kebab-case filenames
  (`useFilenamingConvention`) and named-only exports (`noDefaultExport`, with
  path-scoped overrides for the allowed default-export cases above).
- A **custom convention checker** (`scripts/check-conventions.ts`) enforces the
  three rules Biome can't: filename matches its single export, exactly one value
  export per file, and every logic file has a co-located test. It fails with a
  clear per-file message.
- **Lefthook** runs the gate. **Pre-commit:** Biome (format + lint), the
  convention checker, and `gitleaks` on **staged files only** (fast).
  **commit-msg:** commitlint. The full **Vitest** suite runs in **CI**, using
  Turborepo's affected/cached task graph. Commits stay snappy; merges are gated
  on green tests.

## Security & supply chain

- **No secrets in the repo, ever.** Real values live only in each dev's untracked
  `.env` and the deploy platform's env store. Only `.env.example` (placeholders)
  is committed. `.env*` is gitignored. See [SECURITY.md](./SECURITY.md).
- **Secret scanning, three layers:** `gitleaks` in the Lefthook pre-commit hook,
  `gitleaks` in CI, and GitHub push protection + secret scanning.
- **Dependency licenses: permissive-only.** Allowed: MIT, ISC, BSD-2/3-Clause,
  Apache-2.0, 0BSD, CC0. Disallowed: copyleft (GPL/LGPL/AGPL) and
  source-available/non-commercial. Enforced in CI (`pnpm check:licenses`).
- **Dependency freshness:** Dependabot (security + weekly grouped version PRs);
  `pnpm-lock.yaml` is committed for reproducible installs. Vet each new dependency
  (vulnerabilities, license, trust) before adding it.
- **No children's PII** is collected, logged, or stored anywhere — see
  [ADR 0003](./docs/adr/0003-no-children-pii.md).
- **No analytics/telemetry** today. If ever added, it must be cookieless,
  anonymous, aggregate-only, with no child profiling and no ads.
- **No copyrighted third-party assets** (textbook PDFs, art, audio). Game assets
  are original and generated in-code (CSS/SVG/Web Audio).

## Releases & versioning

- **Changesets** manage versioning and changelogs for `packages/*`. A PR that
  changes a package includes a changeset (`pnpm changeset`) with the semver bump
  and a human-readable summary.
- Apps (`apps/*`) are not published/versioned and are ignored by Changesets.
- Package versions follow **semver**; the changelog is generated from changesets.
