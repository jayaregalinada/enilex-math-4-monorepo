/**
 * Dependency license gate — permissive-only, per CONVENTIONS.md.
 * Parses `pnpm licenses list` and fails if any production dependency uses a
 * license outside the allowlist. Run with `pnpm check:licenses`.
 */
import { execSync } from 'node:child_process';

/** Permissive licenses allowed in shipped dependencies (CONVENTIONS.md). */
const ALLOWED = new Set([
  'MIT',
  'MIT-0',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'Apache-2.0',
  '0BSD',
  'CC0-1.0',
]);

interface PkgEntry {
  name: string;
  versions?: string[];
  version?: string;
}

/** Allow an SPDX expression: any-of for OR, all-of for AND. */
function isAllowed(license: string): boolean {
  const expr = license.replace(/[()]/g, '').trim();
  if (ALLOWED.has(expr)) return true;
  if (/\bOR\b/.test(expr)) {
    return expr.split(/\s+OR\s+/).some((t) => ALLOWED.has(t.trim()));
  }
  if (/\bAND\b/.test(expr)) {
    return expr.split(/\s+AND\s+/).every((t) => ALLOWED.has(t.trim()));
  }
  return false;
}

let raw: string;
try {
  raw = execSync('pnpm licenses list --prod --json', { encoding: 'utf8' });
} catch (error) {
  // pnpm exits non-zero when there are no dependencies yet — treat as clean.
  const out = (error as { stdout?: string }).stdout ?? '';
  if (!out.trim()) {
    console.log('✓ License check passed (no production dependencies yet).');
    process.exit(0);
  }
  raw = out;
}

const data = JSON.parse(raw) as Record<string, PkgEntry[]>;
const violations: string[] = [];

for (const [license, pkgs] of Object.entries(data)) {
  if (isAllowed(license)) continue;
  for (const pkg of pkgs) {
    const version = pkg.version ?? pkg.versions?.join(', ') ?? '?';
    violations.push(`${pkg.name}@${version} — ${license}`);
  }
}

if (violations.length > 0) {
  console.error(
    `\n✗ License check failed — non-permissive licenses found (${violations.length}):\n`,
  );
  for (const v of violations) console.error(`  • ${v}`);
  console.error(
    '\nAllowed: ' +
      [...ALLOWED].join(', ') +
      '.\nRemove the dependency, or open a discussion before widening the allowlist.\n',
  );
  process.exit(1);
}

console.log('✓ License check passed — all production dependencies are permissively licensed.');
