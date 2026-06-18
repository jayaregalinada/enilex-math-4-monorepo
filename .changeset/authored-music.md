---
"@enilex-math-4-pkg/audio": minor
---

Support authored background-music files with a synthesized fallback. The engine
gains a `musicSources` option (per-difficulty URLs); it plays the file when it
loads and falls back to the in-code `MUSIC_TRACKS` tune when a file is missing or
fails to decode. Adds `loadAudioBuffer` and `createBufferMusicPlayer`. Both file
and synth music route through the master gain, so mute covers them equally.
