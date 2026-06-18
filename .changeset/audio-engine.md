---
"@enilex-math-4-pkg/audio": minor
---

Add the `audio` package: a framework-light Web Audio engine with synthesized
SFX (tap, correct, wrong, streak, life lost/gained, game over), three looping
per-difficulty background tunes, and a master-gain mute — all generated in-code
(no audio files). Exposes `createAudioEngine` plus the underlying `playTone`,
`playSoundEffect`, `createMusicPlayer`, and `MUSIC_TRACKS` building blocks.
