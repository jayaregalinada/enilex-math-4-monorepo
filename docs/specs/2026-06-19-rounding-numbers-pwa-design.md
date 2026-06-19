# Rounding Numbers PWA — Design

Date: 2026-06-19
App: `apps/rounding-numbers` (Vite 8 + React 19)

## Goal

Make the rounding-numbers app an installable, fully offline-capable Progressive
Web App: installable to the home screen, instant repeat loads, and playable
offline including its background music.

## Decisions

| Topic | Decision |
|-------|----------|
| Offline scope | Full offline — precache app shell, font, **and** all bundled audio |
| Installability | Yes — web app manifest + icons |
| App icon | The existing Octopus mascot sprite, rendered to PNG icon sizes |
| Update strategy | Silent auto-update (`registerType: 'autoUpdate'`) |
| App title | name `Rounding Numbers — Enilex Math 4`, short_name `Round Numbers` |
| Install prompt | "Install app" button on home → native prompt where supported, else instructions dialog |

## Tooling

- Add devDependencies: `vite-plugin-pwa` (Workbox generateSW) and
  `@vite-pwa/assets-generator`.
- Register `VitePWA(...)` in `apps/rounding-numbers/vite.config.ts`.
- `injectRegister: 'auto'` — the plugin injects SW registration; no manual
  registration code in `main.tsx`.
- `registerType: 'autoUpdate'`.
- `devOptions.enabled: false` (default) — `vite dev` is unaffected; the service
  worker is generated only in production builds.

## Manifest & icons

Source icon: a hand-authored `public/octopus-icon.svg` built from the existing
16×16 octopus sprite (`packages/themes/src/mascot-octopus.tsx`, idle mood):
purple mantle `#a855f7` / tentacles `#9333ea` / white eyes, centered on the app
background `#0d0b1f` with maskable safe-zone padding, `shape-rendering:
crispEdges` so pixels stay sharp when scaled up.

`@vite-pwa/assets-generator` rasterizes the source into:

- `pwa-192x192.png`
- `pwa-512x512.png`
- `maskable-icon-512x512.png`
- `apple-touch-icon-180x180.png`
- `favicon.ico` / favicon SVG

All icon outputs are committed (original work — MIT, no licensing concern) so
they exist in `dist` on both Git-integration and CLI deploys.

Manifest fields:

- `name`: `Rounding Numbers — Enilex Math 4`
- `short_name`: `Round Numbers`
- `description`: short one-liner about the rounding game
- `display`: `standalone`
- `theme_color`: `#0d0b1f`
- `background_color`: `#0d0b1f`
- `start_url`: `/`
- no orientation lock (plays on phone, tablet, desktop)
- icons: the 192 / 512 / maskable-512 entries above

`index.html` changes:

- `<title>` → `Rounding Numbers — Enilex Math 4`
- add `<meta name="theme-color" content="#0d0b1f">`
- the manifest `<link>` and apple-touch `<link>` are injected by the plugin /
  assets-generator integration.

> Note: launchers truncate `short_name` near ~12 chars, so "Round Numbers" (13)
> may render very slightly truncated under the home-screen icon. Accepted.

## Install prompt

A "How to Install" affordance, matching the existing `HowToPlayDialog` pattern
(Radix dialog + `btn btn--ghost btn--sm`).

- `useInstallPrompt()` hook (`src/hooks/`):
  - Listens for `beforeinstallprompt`, calls `preventDefault()`, and stashes the
    deferred event so we can fire it on demand.
  - Detects already-installed via `matchMedia('(display-mode: standalone)')` /
    `navigator.standalone`, and detects iOS Safari (no `beforeinstallprompt`).
  - Clears the deferred event on the `appinstalled` event.
- `InstallButton` / `InstallDialog` component (`src/components/`), placed on the
  home screen beside "How to play":
  - **Hidden entirely when already installed.**
  - On click, if a deferred prompt exists (Chrome/Edge/Android): call
    `.prompt()` — fires the browser's native install flow, no dialog.
  - Otherwise (iOS, or no captured event yet): open a small dialog with
    platform-specific steps:
    - iOS Safari: "Tap Share → Add to Home Screen."
    - Desktop Chromium: "Click the install icon in the address bar."
    - Generic fallback for anything else.
- Unit test the hook's state machine (installable / installed / ios) and that the
  button hides when standalone.

## Caching (Workbox)

- `workbox.globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ogg}']` —
  precaches the app shell, the Press Start 2P `.woff2`, and all bundled `.ogg`
  music tracks.
- `workbox.maximumFileSizeToCacheInBytes: 6 * 1024 * 1024` — the largest track
  is ≈2.5 MB; the Workbox default of 2 MiB would silently skip the big tracks.
- `workbox.cleanupOutdatedCaches: true`.

Consequence (by design): ~15 MB precache on first visit, then instant and fully
offline afterward.

## Deploy interaction (existing constraint)

The 6 third-party tracks (FesliyanStudios ×3, Suno ×2, Reganati ×1) are
gitignored and only present in `dist` on CLI `vercel deploy --prod` (see
`memory/vercel-third-party-music-deploy.md` and `CREDITS.md`).

- The Workbox precache manifest is generated from **actual `dist` contents** at
  build time. On Git-integration deploys those 6 files are absent, so the
  manifest simply omits them — no build error, consistent with today's
  synth/silent fallback.
- The complete 11-track offline bundle exists only on a CLI prod deploy.
- No `.vercelignore` / `.gitignore` changes required.

## Testing

- Existing Playwright smoke tests run against `vite preview` (the production
  bundle), so the SW is live in e2e. Precaching is background and non-blocking,
  and each Playwright context gets an isolated SW, so existing specs pass
  unchanged.
- Add one assertion to the e2e smoke test: the manifest `<link rel="manifest">`
  is present and the service worker registers.
- Unit tests (vitest) are unaffected.

## Out of scope (YAGNI)

- Push notifications.
- Background sync / offline score submission queue.
- Auto-appearing install banner — the install button is user-initiated only.
- Per-track lazy/runtime audio caching — the user chose full precache.
