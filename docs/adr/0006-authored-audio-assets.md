# 6. Background-music files, with synthesized fallback

Date: 2026-06-18
Status: Accepted

## Context

CONVENTIONS stated that all game assets are "original and generated in-code
(CSS/SVG/Web Audio)", and M4 delivered exactly that: three background tunes
synthesized at runtime (`packages/audio` → `MUSIC_TRACKS` + `createMusicPlayer`),
no media files.

The project owner wants richer background music than the synth produces, sourced
as audio files (one per difficulty). This relaxes the "generated in-code" rule
for audio and raises new questions: where files live, how their provenance and
licensing are recorded, and what happens when a file is absent or fails to load.

Alternatives considered:

- **Stay synth-only.** Smallest repo, fully reproducible, but discards better
  music.
- **Replace synth entirely with files.** Best audio, but a missing/oversized or
  failed-to-decode file leaves a difficulty silent, and the tested synth code is
  deleted.
- **Files with synth fallback.** Play the file when present; fall back to the
  synthesized tune on any load/decode failure or when a file is absent.

## Decision

Adopt **background-music files with a synthesized fallback**:

- Music files live in the app at `apps/rounding-numbers/public/audio/` (Vite
  serves `public/` verbatim), referenced by URL in `src/lib/music-sources.ts`.
  They are **not** imported/bundled.
- The audio engine prefers the file per difficulty and **falls back to the
  synthesized `MUSIC_TRACKS` tune** if the file is missing or fails to load, so
  the app is never broken by an absent asset. Both paths route through the master
  gain, so mute covers them equally.
- **Provenance is mandatory.** Every committed audio file is either (a) original
  work by a contributor, or (b) third-party audio under a licence that **permits
  redistribution** in this MIT repo. Either way, its **source and licence are
  recorded in the repo-root `CREDITS.md`** before the file is committed.
  Third-party audio is **never** attributed as original work.

## Consequences

- CONVENTIONS' "generated in-code" rule is relaxed for **audio specifically**:
  audio files are allowed, documented here and credited in `CREDITS.md`.
- Binary files enter the repo, increasing its size; keep tunes reasonably sized.
- The synth music code stays — it is the fallback — so its tests remain valid.
- New surface in `packages/audio` (`loadAudioBuffer`, `createBufferMusicPlayer`,
  the engine's `musicSources` option) is unit-tested with a mocked context/fetch.
- Licence/provenance of media is **not** machine-checked by CI (the existing
  gates cover secrets and dependency licences, not media). It is a **review-time
  gate**: no audio file merges without a correct `CREDITS.md` entry. A file whose
  licence is unclear must not be committed (the synth fallback covers it).
