# Contributing

Thanks for your interest in contributing! This is an open-source project of
educational math games for Grade 4 learners (ages 9–10). Contributions of all
kinds are welcome — bug fixes, new games, accessibility improvements, docs, and
ideas.

By participating, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing of contributions (inbound = outbound)

By submitting a pull request, **you agree that your contribution is licensed
under the same [MIT License](LICENSE) that covers this project** ("inbound =
outbound"). You also confirm you have the right to submit the code.

### Developer Certificate of Origin (DCO)

Every commit must be **signed off** to certify the
[Developer Certificate of Origin](https://developercertificate.org/). Add the
sign-off automatically with:

```bash
git commit -s -m "feat(game-core): add round-to"
```

This appends a `Signed-off-by: Your Name <your@email>` trailer. CI verifies it on
every pull request.

## Prerequisites

- **Node.js 22 LTS** (see `.nvmrc` → `nvm use`).
- **pnpm** via Corepack — no global install needed:

  ```bash
  corepack enable
  ```

## Getting started

```bash
git clone https://github.com/<your-fork>/enilex-math-4-monorepo.git
cd enilex-math-4-monorepo
pnpm install
pnpm dev        # run the app(s)
pnpm test       # run the test suite
pnpm lint       # Biome lint + format check
```

> Real secrets never live in the repo. Copy `.env.example` to `.env` for local
> config; `.env` is gitignored. See [SECURITY.md](SECURITY.md).

## Making a change

1. **Fork** the repo and create a branch off `main`:
   `git checkout -b feat/short-description`.
2. Make your change following the conventions below.
3. **Add or update tests** — see [CONVENTIONS.md](CONVENTIONS.md). Logic without a
   co-located test will fail CI.
4. If you changed a `packages/*` package, **add a changeset**:
   `pnpm changeset` (pick the bump + write a summary).
5. Run `pnpm lint && pnpm test` locally.
6. Commit with a **Conventional Commit** message and **`-s`** sign-off.
7. Open a pull request and fill in the template.

## Conventions (must read)

All code follows [CONVENTIONS.md](CONVENTIONS.md). Highlights:

- **Files** are `lower-kebab-case`; the filename matches its single value export.
- **One value export per file** (co-located types OK; `index.ts` barrels exempt).
- **Named exports** only (except config files, Next.js special files, and
  `React.lazy` targets).
- **Biome** is the single linter/formatter. Run `pnpm lint`.
- **Tests** are co-located (`name.test.ts(x)`), required for logic.
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/);
  enforced by commitlint.
- **Imports:** cross-package via the package's public barrel; intra-package via
  relative paths.

These are enforced by Biome plus a custom convention checker, run on pre-commit
(Lefthook) and in CI.

## What will get a PR rejected

- ❌ Committing secrets, credentials, or `.env` values.
- ❌ Collecting, logging, or storing **personal data from children** (real names,
  emails, PII). This project never does — see
  [ADR 0003](docs/adr/0003-no-children-pii.md). Leaderboard names are display
  **nicknames** only.
- ❌ Adding a dependency under a **non-permissive license**. Only MIT, ISC,
  BSD-2/3-Clause, Apache-2.0, 0BSD, or CC0 are allowed; copyleft (GPL/LGPL/AGPL)
  and source-available/non-commercial licenses are rejected (checked in CI).
- ❌ Adding copyrighted third-party material (e.g. textbook PDFs, copyrighted art
  or audio). The games use original, in-code (CSS/SVG/Web Audio) assets.
- ❌ Missing tests, missing DCO sign-off, or a non-conventional commit title.

## Reporting bugs & ideas

- **Bugs / features:** open an issue using the provided forms.
- **Security vulnerabilities:** report privately — see [SECURITY.md](SECURITY.md).
- **Conduct concerns:** report privately — see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Reuse & forking

You're free to use, fork, and build on this project under the MIT License — just
keep the copyright/license notice. A friendly link back is appreciated but not
required.

Thank you for helping kids learn math! 🎉
