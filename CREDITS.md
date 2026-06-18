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

These are the tracks currently used **locally** during development. They are
**royalty-free for use inside a work** (a game), but neither source permits
**redistributing the raw audio file on its own** — and committing an `.mp3` into
this public MIT repo *is* standalone redistribution. So none of them are
committed; they stay gitignored (`*.mp3` guard in `.gitignore`) and the
synthesized fallback (`packages/audio` → `MUSIC_TRACKS`) keeps each pool playing.

| File | Title | Author / Source | Licence | Committable to repo? |
|------|-------|-----------------|---------|----------------------|
| `retro-funk-fesliyan-studios.mp3` | 8 Bit Retro Funk | David Renda · FesliyanStudios.com | FesliyanStudios free licence (attribution; no file redistribution) | ❌ no — file redistribution not permitted |
| `boss-time-feslyan-studios-hard-mode.mp3` | Boss Time | FesliyanStudios.com | FesliyanStudios free licence (attribution; no file redistribution) | ❌ no — file redistribution not permitted |
| `retro-platforming-david-fesliyan-hard-mode.mp3` | Retro Platforming | David Fesliyan · FesliyanStudios.com | FesliyanStudios free licence (attribution; no file redistribution) | ❌ no — file redistribution not permitted |
| `dark-and-ominus-treblo.mp3` | Dark and Ominous | Treblo | Pixabay Content License (no standalone file redistribution) | ❌ no — file redistribution not permitted |
| `level-up-division-treblo.mp3` | Level Up | Treblo | Pixabay Content License (no standalone file redistribution) | ❌ no — file redistribution not permitted |
| `track-2-treblo.mp3` | Treblo (untitled) | Treblo | Pixabay Content License (no standalone file redistribution) | ❌ no — file redistribution not permitted |

> ⚠️ **Why none are committed.** Per [ADR 0006](./docs/adr/0006-authored-audio-assets.md),
> a committed audio file must be under a licence that **permits redistribution**
> in this MIT repo. Both FesliyanStudios and Pixabay/Treblo allow using the music
> *within* a project but **forbid redistributing the audio file itself**, which is
> what committing it here would do. These remain local-only dev assets.

### Thanks (attribution for local use)

Even though these aren't committed, the local build uses their work — with thanks:

- Music from **[FesliyanStudios](https://www.fesliyanstudios.com)** (David Renda, David Fesliyan).
- Music by **Treblo**, via [Pixabay](https://pixabay.com/music/).

### Adding music that *can* be committed

To bundle music in the repo, use tracks whose licence **permits redistribution**,
then add a row above and (if required) a thanks line here:

- **CC0 / public domain** — no attribution required, but still credit it as a courtesy.
- **CC-BY** — redistribution allowed *with* attribution; record the required
  credit in the **Thanks** list above (this single file is the one place for it).
- **Original work** by a contributor — note it as original.

Sources that explicitly allow file redistribution include
[OpenGameArt](https://opengameart.org) (filter to CC0/CC-BY) and
[incompetech](https://incompetech.com) (Kevin MacLeod, CC-BY 4.0).

## Fonts

System font stack only (`system-ui`, `-apple-system`, `Segoe UI`, `Roboto`,
sans-serif). No bundled font files — nothing to credit.

## Code / libraries

Third-party dependencies are tracked in `package.json` / `pnpm-lock.yaml` and
their licences are covered by the dependency-licence CI gate. List here only any
vendored code that falls outside that gate (none at present).

## Others

Music by <a href="https://pixabay.com/users/reganati-46795721/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=527182">Reganati</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=527182">Pixabay</a>