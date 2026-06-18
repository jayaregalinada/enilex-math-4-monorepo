# Changesets

This folder holds [changesets](https://github.com/changesets/changesets) — small
markdown files describing changes that should bump a package's version and appear
in its CHANGELOG.

When you make a change to a shared package under `packages/*`, add a changeset:

```bash
pnpm changeset
```

Pick the affected package(s) and the semver bump (patch / minor / major), and
write a short human-readable summary. Commit the generated file with your PR.

Apps (e.g. `@enilex-math-4/rounding-numbers`) are not versioned/published and are
ignored in `config.json`.
