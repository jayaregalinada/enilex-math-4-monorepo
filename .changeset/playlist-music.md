---
"@enilex-math-4-pkg/audio": minor
---

Rework background music into a shuffling playlist. The engine now takes
`playlists` (a track list per music context: `general` and `hard`) and exposes
`setMusicContext` and `skipTrack`; music plays in shuffled order, auto-advances
when a track ends, and reshuffles each cycle. Adds `createPlaylistPlayer` and a
`shuffle` helper. Empty pools fall back to the synthesized `MUSIC_TRACKS` tune.
Replaces the previous per-difficulty `musicSources`/`startMusic` API and removes
`createBufferMusicPlayer`.
