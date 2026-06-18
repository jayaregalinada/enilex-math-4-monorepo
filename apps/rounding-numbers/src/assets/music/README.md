# Background music

Drop background-music files here. They are **auto-discovered** by Vite
(`src/lib/music-library.ts`) and bundled — no manifest to edit. Just add or
remove files.

## Naming → which mode

- **Hard mode:** include `-hard-mode` in the filename, e.g.
  `boss-theme-hard-mode.mp3`. These play only during a Hard run.
- **Everything else:** any other file is shared by **Home, Easy and Normal**.

Add as many as you like per pool — they play in **shuffled order**, advancing to
the next when one ends, and the player can **skip** to the next track. Hard music
swaps in for a Hard run and the general pool resumes afterward.

**Formats:** `.mp3`, `.ogg`, `.m4a`, `.wav` are discovered (mp3 recommended).

**Fallback:** if a pool has no files, the engine plays its synthesized tune
(`packages/audio` → `MUSIC_TRACKS`), so the app always has music.

**Provenance (required):** only add audio that is original work **or** third-party
audio licensed for redistribution in this MIT repo. Record every file's source
and licence in the repo-root `CREDITS.md` **before** committing it, and never
attribute third-party audio as original. See
[ADR 0006](../../../../docs/adr/0006-authored-audio-assets.md).
