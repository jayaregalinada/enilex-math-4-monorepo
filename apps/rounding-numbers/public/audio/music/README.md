# Background music

Drop the three authored background tunes here, named exactly:

- `easy.mp3` — calm, slow (Easy mode)
- `normal.mp3` — brighter, mid-tempo (Normal mode)
- `hard.mp3` — fast, tense (Hard mode)

Vite serves `public/` at the site root, so these resolve at
`/audio/music/easy.mp3` etc. The paths are configured in
`src/lib/music-sources.ts`.

**Fallback:** if a file is missing or fails to load, the audio engine plays the
synthesized tune for that difficulty instead (`packages/audio` → `MUSIC_TRACKS`),
so the app never breaks on a missing asset.

**Format:** `.mp3` is assumed (universally supported). To use a different format,
change the extensions in `src/lib/music-sources.ts` to match your files.

**Provenance:** only commit audio that is original work **or** third-party audio
under a licence that permits redistribution in this MIT repo. Record every file's
source and licence in the repo-root `CREDITS.md` **before** committing it — and
never attribute third-party audio as original. A file whose licence is unclear
must not be committed; the synth fallback covers it. See
[ADR 0006](../../../../../docs/adr/0006-authored-audio-assets.md).
