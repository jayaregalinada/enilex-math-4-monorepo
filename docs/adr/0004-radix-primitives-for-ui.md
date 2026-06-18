# 4. Radix Primitives for interactive UI, styled with CSS variables

Date: 2026-06-18
Status: Accepted

## Context

The game needs a small set of stateful, accessibility-sensitive widgets —
modals (pause, settings, onboarding, quit-confirm, name entry), the leaderboard
tabs, a mute toggle, and a clear-scores confirmation. Getting these right by hand
(focus trapping, Escape handling, ARIA roles/state, keyboard interaction) is
error-prone, and the project has explicitly committed to accessibility
(colorblind-safe highlighting, focus, tablet touch targets).

At the same time, the signature pieces — the number line, answer grid, HUD, and
mascots — are bespoke and drawn in-code. The theme system (planned for M5)
injects each cosmetic theme's palette as **CSS custom properties** through a
provider, so styling is already designed around CSS variables, not a utility
framework.

Alternatives considered:

- **Fully custom (status quo).** Zero dependencies and the smallest bundle, but
  we would re-implement modal/tabs/toggle/slider accessibility ourselves —
  exactly the behavior that is easy to get subtly wrong.
- **Tailwind (styling only).** Fast styling iteration, but it adds a second
  styling paradigm next to the CSS variables we already rely on, and does nothing
  for the hard part (widget behavior/a11y) — we'd still want Radix on top.
- **ShadCN (Radix + Tailwind, copy-paste).** Fastest to polished components, but
  it pulls in the whole Tailwind toolchain, ships a neutral/SaaS aesthetic that
  fights a playful kids' theme (so most of it gets overridden), and its generated
  files don't follow our conventions (one value export per file, kebab filenames).
- **Radix Primitives + CSS variables.** Unstyled, accessible behavior for the few
  hard widgets; styling stays entirely ours via CSS variables.

## Decision

Use **Radix Primitives** (`@radix-ui/react-*`) for stateful, accessibility-heavy
widgets — dialogs, tabs, toggle/switch, slider, and similar — and style them with
our own **plain CSS + CSS variables**. We do **not** adopt Tailwind or ShadCN.

Bespoke, presentational pieces (number line, answer buttons, HUD, mascots) remain
hand-built. Radix-based widgets live in `packages/ui` as thin, themed wrappers so
apps consume project components, not Radix directly.

## Consequences

- Correct, well-tested accessibility (focus trap, Escape, ARIA, keyboard) for the
  widgets where it matters most, with no styling lock-in.
- The CSS-variable theme system stays fully intact; the playful look is entirely
  ours. No utility-class build step or second styling paradigm.
- We take on a set of `@radix-ui/react-*` dependencies (each tree-shakeable, MIT,
  covered by Dependabot and the permissive-license gate).
- Radix wrappers in `packages/ui` must still follow repo conventions (named
  exports, one value export per file, kebab filenames, co-located tests).
- Radix is not needed for the teaching layer (M3); it first earns its place with
  the leaderboard tabs and overlays (M6–M7).
