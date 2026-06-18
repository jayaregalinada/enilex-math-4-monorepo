# Credits

This project ([MIT](./LICENSE)) bundles third-party and original assets. Every
committed media asset must appear here with its source and licence **before** it
is committed — see [ADR 0006](./docs/adr/0006-authored-audio-assets.md). Audio
files are gitignored until they have an entry here.

Third-party assets may only be committed under a licence that **permits
redistribution** in this MIT repository. Third-party work is never attributed as
original.

## Audio — background music

`apps/rounding-numbers/src/assets/music/`

All tracks below are **royalty-free for non-commercial use and distribution**,
sourced from FesliyanStudios and Treblo. The "Redistribution OK?" column asks
whether the licence permits redistribution **under this repo's MIT terms** (which
include commercial use) — see the warning below.

| File | Title | Author / Source | Licence | Redistribution OK? (MIT) |
|------|-------|-----------------|---------|--------------------------|
| `retro-funk-fesliyan-studios.mp3` | 8 Bit Retro Funk | David Renda · FesliyanStudios.com | Royalty-free, non-commercial distribution | ❌ non-commercial only |
| `boss-time-feslyan-studios-hard-mode.mp3` | Boss Time | FesliyanStudios.com | Royalty-free, non-commercial distribution | ❌ non-commercial only |
| `retro-platforming-david-fesliyan-hard-mode.mp3` | Retro Platforming | David Fesliyan · FesliyanStudios.com | Royalty-free, non-commercial distribution | ❌ non-commercial only |
| `dark-and-ominus-treblo.mp3` | Dark and Ominous | Treblo | Royalty-free, non-commercial distribution | ❌ non-commercial only |
| `level-up-division-treblo.mp3` | Level Up | Treblo | Royalty-free, non-commercial distribution | ❌ non-commercial only |
| `track-2-treblo.mp3` | Treblo (untitled) | Treblo | Royalty-free, non-commercial distribution | ❌ non-commercial only |

> ⚠️ **Licence conflict — these files are not committed.** The repo is
> [MIT](./LICENSE), which grants **commercial** redistribution. A
> "royalty-free, non-commercial distribution" licence does **not** permit that,
> so per [ADR 0006](./docs/adr/0006-authored-audio-assets.md) these files **must
> not be committed**. They stay gitignored (`*.mp3` guard in `.gitignore`) and
> the synthesized fallback (`packages/audio` → `MUSIC_TRACKS`) covers each pool,
> so the app still has music. To bundle music in the repo, replace these with
> tracks under a redistribution-friendly licence (e.g. CC0, CC-BY, or MIT) or
> original work by a contributor.

## Fonts

System font stack only (`system-ui`, `-apple-system`, `Segoe UI`, `Roboto`,
sans-serif). No bundled font files — nothing to credit.

## Code / libraries

Third-party dependencies are tracked in `package.json` / `pnpm-lock.yaml` and
their licences are covered by the dependency-licence CI gate. List here only any
vendored code that falls outside that gate (none at present).
