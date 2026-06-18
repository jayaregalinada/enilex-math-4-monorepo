# Vendored pixel font

The 8-bit display font (`--font-pixel`) is a self-hosted OFL asset, per
[ADR 0007](../../../../docs/adr/0007-vendored-ofl-pixel-font.md).

## To add it

1. Drop the font file here as **`press-start-2p.woff2`** (or update the
   `@font-face` `src` in `src/fonts.css` to match the filename you use).
2. Record its **source + licence** in the repo-root `CREDITS.md` (OFL requires
   the notice to travel with the font).
3. Force-add it past the gitignore guard: `git add -f public/fonts/press-start-2p.woff2`.

Until then, `--font-pixel` falls back to a monospace stack — the layout works,
it just isn't the bitmap face yet. Font files are **gitignored** here so an
un-credited binary can't be committed by accident.

> Use an OFL-or-more-permissive font, self-hosted only — no third-party font CDN
> (privacy for kids). *Press Start 2P* (SIL OFL 1.1) is the reference choice.
