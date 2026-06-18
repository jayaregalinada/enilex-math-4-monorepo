<!--
Thanks for contributing! Please fill out the checklist below.
By submitting this PR you agree your contribution is licensed under the project's
MIT license (inbound = outbound) and you certify the Developer Certificate of
Origin (see CONTRIBUTING.md) via a `Signed-off-by` line (git commit -s).
-->

## What & why

<!-- What does this change do, and why? Link the issue it closes. -->

Closes #

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / chore
- [ ] Docs

## Checklist

- [ ] PR title follows **Conventional Commits** (e.g. `feat(game-core): add roundTo`).
- [ ] Commits are **signed off** (`git commit -s` → `Signed-off-by:`) per the DCO.
- [ ] Code follows the conventions in `CONVENTIONS.md` (kebab files, one value
      export per file, named exports, filename matches export).
- [ ] **Tests added/updated** and the full suite passes locally (`pnpm test`).
- [ ] Biome passes (`pnpm lint` / `pnpm format`).
- [ ] A **changeset** is included if a `packages/*` package changed (`pnpm changeset`).
- [ ] **No secrets, credentials, or `.env` values** are committed.
- [ ] **No personal data from children** (real names, emails, PII) is collected,
      logged, or stored — see ADR 0003.
- [ ] Any new dependency uses a **permissive license** (MIT/ISC/BSD/Apache-2.0).
- [ ] No copyrighted third-party material (e.g. textbook PDFs) is added.
