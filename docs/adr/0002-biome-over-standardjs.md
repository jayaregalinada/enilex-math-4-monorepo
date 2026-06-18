# 2. Biome as the single lint/format tool (over StandardJS)

Date: 2026-06-18
Status: Accepted

## Context

The desired code style was stated as "JS Standard with semicolons" *and* "use
Biome for linting and formatting." These cannot both be the literal tool:
StandardJS (and its `semistandard` / `ts-standard` variants) is a self-contained
ESLint-based linter+formatter, while Biome is a separate, independently
opinionated formatter+linter. Running both makes them fight over every file.

Alternatives considered:

- **ts-standard / semistandard as the tool, drop Biome.** Truly "Standard with
  semicolons," but ESLint-based and slower, and contradicts the explicit "use
  Biome" requirement.
- **Biome formats, a Standard ESLint config lints.** Two toolchains; easy to
  misconfigure into formatting conflicts; more maintenance.
- **Biome as the single tool, tuned toward Standard+semicolons.** One fast tool,
  no conflicts; "JS Standard with semicolons" becomes a *style target* rather than
  a literal dependency.

## Decision

Use **Biome** as the single source of truth for both linting and formatting. No
ESLint, Prettier, or StandardJS in the toolchain. Configure Biome to approximate
Standard-with-semicolons: 2-space indent, single quotes, semicolons on, trailing
commas `all`, line width 100, `organizeImports` on.

## Consequences

- One fast, unified tool; no formatter conflicts; simple CI.
- We accept minor divergences from classic StandardJS that Biome can't express —
  notably **no space-before-function-paren**, and trailing commas `all` instead of
  Standard's `none`. "JS Standard with semicolons" is therefore an intent, not a
  guarantee of byte-for-byte Standard output.
- Some of our file conventions (one-value-export-per-file, filename-matches-export,
  test-must-be-present) are **not** native Biome rules and need separate
  enforcement (see follow-up decision on enforcement).
