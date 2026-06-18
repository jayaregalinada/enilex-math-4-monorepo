# 7. Vendored OFL pixel font as a licensed asset

Date: 2026-06-19
Status: Accepted

## Context

The 8-bit visual overhaul (ADR-0008) needs a pixel/bitmap font — it is the single
strongest signal of the retro aesthetic. The well-known pixel fonts (e.g. *Press
Start 2P*) ship under the **SIL Open Font License (OFL) 1.1**.

This bumps into two existing rules:

- CONVENTIONS says visual assets are "original and generated in-code (CSS/SVG)" —
  a font file is an external binary asset.
- The **dependency-license allow-list** is MIT/ISC/BSD-2/3/Apache-2.0/0BSD/CC0.
  OFL is **not** on it.

Alternatives considered:

- **CSS-only chunky monospace.** No asset, no license question, but does not read
  as authentically 8-bit — the font is the aesthetic.
- **CC0/MIT pixel font only.** Stays on the allow-list with no exception needed,
  but the selection is smaller and generally rougher than the OFL classics.
- **OFL font hosted via a font CDN (Google Fonts).** Easiest delivery, but sends
  every child's IP/request to a third party — a privacy concern for a kids' app
  (cf. ADR-0003, no children's PII) — and breaks offline self-containment.
- **Vendor an OFL font, self-hosted.** Bundle the font file in the repo and serve
  it from our own origin.

## Decision

**Vendor a self-hosted OFL pixel font as a licensed asset**, treated like audio
files under ADR-0006 rather than like a code dependency:

- The font file is committed in-repo and served via `@font-face` from our own
  origin — **no third-party font CDN**. The app stays offline-capable and leaks no
  requests.
- The font's **source and licence are recorded in `CREDITS.md`** before commit.
  OFL explicitly permits bundling and redistribution (including inside an MIT
  project), provided the OFL notice travels with the font and the font is not sold
  on its own — both satisfied by an unmodified vendored file plus credit.
- The dependency-license allow-list governs **npm/code dependencies**, not bundled
  media. OFL fonts are media assets and are governed by this ADR + `CREDITS.md`,
  the same review-time gate as audio.

## Consequences

- A binary font file enters the repo; keep it to the needed weights (a single
  woff2 is small).
- The asset-policy exception is explicit and citable: CONVENTIONS' "generated
  in-code" rule is relaxed for **fonts**, scoped to OFL-or-more-permissive,
  self-hosted, credited.
- License/provenance is a **review-time gate**, not CI-checked: no font merges
  without a correct `CREDITS.md` entry. A font whose licence is unclear must not
  be committed.
- If the font is ever removed, the retro chrome falls back to a monospace system
  stack (degraded but functional).
