# 3. Data minimization — never collect children's PII

Date: 2026-06-18
Status: Accepted

## Context

The product is a math game for children aged 9–10, in a public repository that may
evolve into a full-stack app. Collecting personal data from children triggers
strict legal regimes — COPPA (US), GDPR-K (EU), and the Philippine Data Privacy
Act — requiring parental consent, age gating, privacy policies, and data-deletion
machinery. "Sensitive information" for this project therefore includes not only
maintainer secrets but any player data we might collect.

Alternatives considered:

- **Allow real accounts/profiles later** with full COPPA/GDPR-K compliance
  (parental consent flows, age gating, deletion). Enables cross-device saves but
  is a large legal and engineering burden disproportionate to a learning project.
- **Defer the decision** until a backend exists. Risk: whoever first adds a
  leaderboard API stores real names server-side without realizing the legal
  weight.
- **Data minimization: collect no PII from children, ever.** Sidesteps the legal
  regimes entirely.

## Decision

Adopt a project-wide **no-children's-PII** rule. The app never collects real
names, emails, or any personally identifying information from players. Leaderboard
entries are free-form **display nicknames** with explicit "don't use your real
name" guidance, stored client-side (`localStorage`) with no identifying linkage.
No child accounts. Any future backend must uphold this: no PII at rest, no PII in
logs, no third-party trackers that profile children.

## Consequences

- The app stays out of COPPA/GDPR-K/DPA scope, dramatically reducing legal and
  compliance burden.
- No cross-device progress or real user accounts for players (a deliberate
  trade-off); leaderboards are device-local unless a privacy-preserving,
  non-identifying design is introduced later.
- Contribution and review processes must reject any change that would collect or
  store player PII (called out in CONTRIBUTING and the PR checklist).
