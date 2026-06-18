# Security Policy

## Supported versions

This project is in active early development. Security fixes are applied to the
latest `main` only. There are no separately maintained release branches yet.

| Version        | Supported |
| -------------- | --------- |
| `main` (latest)| ✅        |
| older commits  | ❌        |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Report privately using **GitHub Private Vulnerability Reporting** for this
repository:

1. Go to the **Security** tab → **Report a vulnerability**, or open
   `https://github.com/jayaregalinada/enilex-math-4-monorepo/security/advisories/new`.
2. Describe the issue, the affected component (`apps/*` or `packages/*`), and
   steps to reproduce.

We aim to acknowledge reports within **72 hours** and to keep you updated as we
investigate. Please give us a reasonable window to fix the issue before any
public disclosure (coordinated disclosure). We're happy to credit reporters who
wish to be named.

## What counts as "sensitive information"

For this public repository, sensitive information includes, but is not limited to:

- Secrets/credentials: API keys, tokens, passwords, private keys, connection
  strings, `.env` values.
- **Personal data of children** (real names, emails, any PII) — this project's
  policy is to never collect it (see
  [ADR 0003](docs/adr/0003-no-children-pii.md)).
- Internal URLs, infrastructure details, or anything else not intended to be
  public.

## If a secret or PII is ever committed (leak runbook)

A public commit must be treated as **already compromised** — deleting the file is
**not** enough, because the value remains in git history and may already be
scraped. Act in this order:

1. **Rotate / revoke first.** Immediately invalidate the exposed credential
   (rotate the key, revoke the token, change the password) at its source. This is
   the only step that actually stops the leak; do it before anything else.
2. **Purge from history.** Remove the value from the entire git history using
   [`git filter-repo`](https://github.com/newren/git-filter-repo) (preferred) or
   BFG Repo-Cleaner — not just a follow-up commit that deletes the file.
3. **Force-push and re-sync.** Force-push the cleaned history to the remote and
   have all collaborators **re-clone** (old clones still contain the secret).
   Invalidate any caches/forks where possible.
4. **Verify.** Re-run a secret scan (`gitleaks detect`) on the cleaned history to
   confirm the value is gone, and confirm the rotated credential is in use.
5. **Record.** Note what leaked and what was rotated (without re-pasting the
   secret) so the response is auditable.

Prevention is layered so this should be rare: local `gitleaks` pre-commit hook,
`gitleaks` in CI, and GitHub push protection. See
[`docs/REPO-SETUP.md`](docs/REPO-SETUP.md).
