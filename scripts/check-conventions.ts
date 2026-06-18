/**
 * Custom convention checker — enforces the three rules Biome can't:
 *   1. Exactly one *value* export per file (types/interfaces alongside are fine).
 *   2. The filename is the kebab-case transform of that single export's name.
 *   3. Every logic file (function/class/component) has a co-located `*.test.*`.
 *
 * Run with `pnpm check:conventions`. Exits non-zero on any violation.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import ts from 'typescript';

const ROOTS = ['apps', 'packages'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage']);

/** Kebab-case transform matching CONVENTIONS.md (acronyms + digits as their own runs). */
function toKebab(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
    .toLowerCase();
}

function walk(dir: string, acc: string[]): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (/\.tsx?$/.test(entry)) acc.push(full);
  }
  return acc;
}

/** Files that never carry a single-value-export contract. */
function isExempt(file: string): boolean {
  const name = basename(file);
  return (
    /\.test\.tsx?$/.test(name) ||
    /\.d\.ts$/.test(name) ||
    /\.config\.(ts|js|mjs|cjs)$/.test(name) ||
    /\.types\.ts$/.test(name) ||
    name === 'index.ts' ||
    name === 'index.tsx' ||
    name === 'main.tsx' ||
    name.startsWith('test-setup')
  );
}

interface ValueExport {
  name: string;
  needsTest: boolean;
}

function hasExportModifier(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function collectValueExports(file: string): ValueExport[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const exports: ValueExport[] = [];

  source.forEachChild((node) => {
    if (!hasExportModifier(node)) return;

    if (ts.isFunctionDeclaration(node) && node.name) {
      exports.push({ name: node.name.text, needsTest: true });
    } else if (ts.isClassDeclaration(node) && node.name) {
      exports.push({ name: node.name.text, needsTest: true });
    } else if (ts.isEnumDeclaration(node)) {
      exports.push({ name: node.name.text, needsTest: false });
    } else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        const init = decl.initializer;
        const isCallable = !!init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init));
        exports.push({ name: decl.name.text, needsTest: isCallable });
      }
    }
  });

  return exports;
}

const errors: string[] = [];

for (const root of ROOTS) {
  for (const file of walk(root, [])) {
    if (isExempt(file)) continue;

    const valueExports = collectValueExports(file);
    if (valueExports.length === 0) continue; // type-only / side-effect module

    const rel = file;
    if (valueExports.length > 1) {
      errors.push(
        `${rel}: ${valueExports.length} value exports (${valueExports
          .map((e) => e.name)
          .join(', ')}) — exactly one is allowed.`,
      );
      continue;
    }

    const only = valueExports[0];
    if (!only) continue;
    const stem = basename(file).replace(/\.tsx?$/, '');
    const expected = toKebab(only.name);
    if (stem !== expected) {
      errors.push(
        `${rel}: filename should be "${expected}.${file.endsWith('.tsx') ? 'tsx' : 'ts'}" to match export "${only.name}".`,
      );
    }

    if (only.needsTest) {
      const dir = dirname(file);
      const hasTest =
        existsSync(join(dir, `${stem}.test.ts`)) || existsSync(join(dir, `${stem}.test.tsx`));
      if (!hasTest) {
        errors.push(
          `${rel}: missing co-located test "${stem}.test.ts(x)" for export "${only.name}".`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n✗ Convention check failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('');
  process.exit(1);
}

console.log('✓ Convention check passed.');
