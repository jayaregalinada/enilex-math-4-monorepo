# Enilex Math 4

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe5196.svg)](https://www.conventionalcommits.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A monorepo of free, open-source **math learning games for Grade 4 students
(ages 9–10)**. The first game teaches **rounding whole numbers** to a given place
value (tens through hundred millions).

> 🔗 **Live demo:** _coming soon_

## ✨ Highlights

- 🎮 Kid-friendly, **tablet-first** games with sound, music, and playful feedback —
  all generated in-code (Web Audio + CSS/SVG), no external assets.
- 🧠 Built around real lesson pedagogy, with explanations that teach *why* an
  answer is right (number line + place-value rule).
- 🔒 **Privacy by design:** no accounts, no tracking, and **no personal data from
  children** — leaderboards use display nicknames stored locally.
- 🧩 Shared engines (game logic, audio, themes, UI) so new games are quick to add.

## 🕹️ The games

| App | Status | Description |
|-----|--------|-------------|
| [`rounding-numbers`](apps/rounding-numbers) | 🚧 In development | Round whole numbers to a chosen place value, with Easy / Normal / Hard modes, lives, streaks, and a leaderboard. See its [spec](apps/rounding-numbers/docs/CONTEXT.md) and [build plan](apps/rounding-numbers/docs/BUILD-PLAN.md). |

## 📁 Monorepo layout

```
enilex-math-4-monorepo/
├── apps/                # games (each app has its own docs/)
│   └── rounding-numbers/
├── packages/            # shared, reusable code (planned)
│   ├── game-core/       # framework-agnostic logic, fully unit-tested
│   ├── audio/           # Web Audio synthesis (SFX + music)
│   ├── themes/          # cosmetic theme system
│   └── ui/              # shared React components
├── docs/adr/            # system-wide architecture decisions
├── CONVENTIONS.md       # engineering conventions
└── CONTEXT-MAP.md       # index of contexts & doc organization
```

Built with **React + TypeScript + Vite**, **pnpm workspaces + Turborepo**,
**Biome**, and **Vitest**.

## 🚀 Quick start

Requires **Node.js 24 LTS** and **pnpm** (via Corepack).

```bash
corepack enable                 # activates pnpm, no global install needed
nvm use                         # Node 24 (see .nvmrc)

git clone https://github.com/jayaregalinada/enilex-math-4-monorepo.git
cd enilex-math-4-monorepo
pnpm install

pnpm dev                        # run the app(s)
pnpm test                       # run tests
pnpm lint                       # Biome lint + format check
```

> Copy `.env.example` to `.env` for local config. Never commit secrets — see
> [SECURITY.md](SECURITY.md).

## 🤝 Contributing

Contributions are very welcome! Please read:

- [CONTRIBUTING.md](CONTRIBUTING.md) — setup, workflow, DCO sign-off, conventions
- [CONVENTIONS.md](CONVENTIONS.md) — code style & structure
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — be kind
- [SECURITY.md](SECURITY.md) — report vulnerabilities privately

Architecture decisions are recorded in [`docs/adr/`](docs/adr/).

## 📄 License & credit

Licensed under the [MIT License](LICENSE) — © 2026 Jay Are Galinada.

You're free to use, fork, modify, and distribute this project, including
commercially, as long as you keep the copyright and license notice. A link back
is appreciated but not required.
