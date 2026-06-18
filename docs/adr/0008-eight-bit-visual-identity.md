# 8. 8-bit / retro visual identity

Date: 2026-06-19
Status: Accepted

## Context

The game shipped (M0–M8) with a "soft modern" look: rounded cards, soft shadows,
translucent surfaces, emoji icons, and 4 themes that apply a **random per-run
colour palette + emoji mascot**. The project owner wants it to feel "like an
actual 8-bit game".

A true 8-bit look is a *global, consistent* visual language (limited palette, hard
edges, chunky borders, pixel font) — which is in tension with random soft palettes
and with emoji, and raises a real pedagogical risk: this is a math game where a
child must read the number to round, and pixel fonts can make a long number like
`389,645,000` ambiguous.

Key forks and what was chosen (alternatives in parentheses):

- **Aesthetic vs themes:** keep the 4 themes and the random-per-run mechanic but
  redesign each palette as a cohesive retro palette; the retro *chrome* is global,
  only colours vary. (vs. one fixed palette; vs. chrome over untouched palettes.)
- **Icons:** hand-built **pixel-art SVG** components replace all emoji. Shared
  chrome icons live in the newly-created `@enilex-math-4-pkg/ui` package; per-theme
  mascots stay in `packages/themes`; one universal pixel-heart life icon replaces
  the per-theme emoji life-icons. (vs. app-local icons; vs. dumping all art in the
  themes package.)
- **Font scope:** the pixel font applies **everywhere, including the math
  numbers** — cohesion was chosen over rendering numerals in an alternate legible
  font, with the readability risk mitigated by large size, generous
  letter-spacing, and comma separators. This is a deliberate deviation from the
  obvious "keep the numbers in a legible font" choice and is recorded so it isn't
  silently "fixed" later. (Font sourcing/licensing: see ADR-0007.)
- **Opening / sound gate:** a first-visit-only "Turn on sound?" retro modal over
  Home (persisted `seenSoundPrompt`), sequenced before the How-to-Play card; it
  records the `muted` setting and serves as the audio-unlock gesture. (vs. a full
  arcade title screen every launch.)
- **Navigation:** the in-game pause control becomes a retro **Pause Menu**
  (Resume / Restart / Sound / Quit), and every screen gets a consistent Back/Home
  affordance.
- **Game-feel FX:** arcade HUD (SCORE / HI-SCORE / pixel-heart lives / combo),
  CRT-scanline overlay, pixel-wipe screen transitions, and an animated tiled pixel
  background.

## Decision

Adopt a cohesive **8-bit/retro visual identity** across the whole app as described
above: global retro chrome, retro-redesigned theme palettes, pixel-art SVG icons
in a new `@enilex-math-4-pkg/ui` package, a vendored pixel font applied
everywhere, a first-visit sound-gate modal, a pause menu + uniform back nav, and
the retro FX layers.

All motion/FX (CRT, scanlines, background scroll, screen wipes) are gated by a new
persisted **"Reduce effects"** setting **OR** the OS `prefers-reduced-motion`
query — whichever is active reduces them. Readability of the math numbers remains
the hard constraint the FX must not compromise.

## Consequences

- **Breaking changes** to existing code: the `Theme` interface's `lifeIcon` and
  emoji `mascot` string fields change shape (mascot → sprite identity; life-icon →
  universal heart), the `themes` package and `Mascot`/`game-hud` components change,
  and many component/CSS tests will need updating.
- A new published package, `@enilex-math-4-pkg/ui`, enters the workspace (barrel,
  build, tests, changesets) — reusable by future games.
- New persisted settings state: `seenSoundPrompt` and `reduceEffects` (settings
  store `persist` version bump + migration).
- New flow capability: **Restart** (re-run same difficulty + place value).
- The pixel-font-on-numbers choice carries an accepted readability risk for young
  kids; revisit if testing shows digit confusion (the mitigation knobs are size,
  spacing, and separators; the fallback is an alternate legible numeral font).
- A vendored font file and the OFL exception are governed by ADR-0007.
