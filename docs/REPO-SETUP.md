# Repository Setup Checklist

Some governance decisions can't be expressed as files — they're **GitHub settings**
that must be enabled in the repo. This checklist captures them so the public repo
matches the documented policies. (Most require admin access to the repo.)

## 1. Security & secret scanning

- [ ] **Settings → Code security**: enable **Secret scanning**.
- [ ] Enable **Push protection** (blocks pushes that contain detected secrets).
- [ ] Enable **Private vulnerability reporting** (powers the channel referenced in
      `SECURITY.md` and `CODE_OF_CONDUCT.md`).
- [ ] Enable **Dependabot alerts** and **Dependabot security updates**
      (the version-update PRs themselves are configured in
      `.github/dependabot.yml`).

## 2. Branch protection for `main`

Add a branch protection rule (or ruleset) for `main`:

- [ ] **Require a pull request before merging.**
- [ ] **Require approvals: 1**, and **Require review from Code Owners**
      (so outside PRs need maintainer review via `.github/CODEOWNERS`).
- [ ] **Require status checks to pass before merging**, and select the CI jobs
      (lint, test, build, convention check, license check, secret scan, DCO).
- [ ] **Require branches to be up to date before merging.**
- [ ] **Require linear history.**
- [ ] **Do not allow force pushes / deletions.**
- [ ] Leave **"Allow administrators to bypass"** **ON** for now — as a solo
      maintainer you can't approve your own PRs, so this lets you merge your own
      work once CI is green. Revisit (turn OFF) when a second maintainer joins.

## 3. DCO enforcement

The CI workflow checks for `Signed-off-by` trailers on PR commits. Optionally also
install the **[DCO GitHub App](https://github.com/apps/dco)** for a native status
check.

## 4. General

- [ ] Confirm the repo is **public**.
- [ ] Enable **Discussions** (linked from issue template `config.yml`).
- [ ] Set **Actions → General → Workflow permissions** to **read-only** by default;
      grant write only to jobs that need it (e.g. a future release job).
- [ ] Add repo **topics** (e.g. `education`, `math`, `react`, `kids`,
      `open-source`) and a description.

## 5. Tooling that comes online at M0 (build bootstrap)

These are implemented when the workspace is scaffolded (see the rounding-numbers
build plan, milestone **M0**):

- [ ] `package.json` + `pnpm-workspace.yaml` + `turbo.json` with scripts:
      `dev`, `build`, `test`, `lint`, `check:conventions`, `check:licenses`.
- [ ] `biome.json` tuned per `CONVENTIONS.md`.
- [ ] **Lefthook** hooks: pre-commit (Biome + convention checker on staged files,
      `gitleaks protect`), commit-msg (**commitlint**).
- [ ] **gitleaks** installed locally (e.g. `brew install gitleaks`) for the
      pre-commit hook.
- [ ] `scripts/check-conventions.ts` (filename↔export match, one value export per
      file, test-present).
- [ ] License checker wired to `pnpm check:licenses` (permissive-only allowlist).
- [ ] **Changesets** release workflow.

> **Adding dependencies at M0:** vet each new dependency (vulnerabilities, license,
> trust) before adding it to a manifest, per the project's dependency policy.
