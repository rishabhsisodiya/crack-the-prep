/**
 * Verifies the "Final code" of every Low-Level Design problem page actually works.
 * Run:  npm run check:lld        (exits 1 on any failure)
 *
 * For each src/content/notes/lld-*.mdx with order >= 10:
 *   1. extract the first ```ts block under "## Final code"
 *   2. compile it with esbuild (types stripped; the code must not import anything)
 *   3. run that page's tests from scripts/lld.tests.mjs
 * A problem page without a test entry is an error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

import { tests } from './lld.tests.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = path.join(ROOT, 'src/content/notes');

function finalCode(src, file) {
  const section = src.split(/^## Final code$/m)[1]?.split(/^## /m)[0];
  const m = section?.match(/```ts\n([\s\S]*?)```/);
  if (!m) throw new Error(`${file}: no ts block under "## Final code"`);
  return m[1];
}

function load(file, names) {
  const src = fs.readFileSync(path.join(NOTES, file), 'utf8');
  const out = transformSync(finalCode(src, file), { loader: 'ts', format: 'cjs', target: 'es2022' }).code;
  const module = { exports: {} };
  const noImports = (id) => { throw new Error(`unexpected import "${id}" in final code`); };
  // eslint-disable-next-line no-new-func
  return new Function('require', 'module', 'exports', `${out}\nreturn { ${names.join(', ')} };`)(
    noImports, module, module.exports,
  );
}

const pages = fs
  .readdirSync(NOTES)
  .filter((f) => f.startsWith('lld-') && f.endsWith('.mdx'))
  .map((f) => {
    const src = fs.readFileSync(path.join(NOTES, f), 'utf8');
    return {
      file: f,
      slug: src.match(/^slug:\s*"?([^"\n]+)"?/m)?.[1],
      order: Number(src.match(/^order:\s*(\d+)/m)?.[1] ?? 1),
    };
  })
  .filter((p) => p.order >= 10)
  .sort((a, b) => a.order - b.order);

const errors = [];
let passed = 0;
for (const page of pages) {
  const t = tests[page.slug];
  if (!t) {
    errors.push(`${page.file}: no tests for slug "${page.slug}" in scripts/lld.tests.mjs`);
    continue;
  }
  try {
    const mod = load(page.file, t.names);
    for (const n of t.names) if (mod[n] === undefined) throw new Error(`"${n}" is not defined by the final code`);
    await t.run(mod);
    passed++;
    console.log(`  ✓ ${page.slug}`);
  } catch (e) {
    errors.push(`${page.file}: ${e.message}`);
  }
}
for (const slug of Object.keys(tests)) {
  if (!pages.some((p) => p.slug === slug)) errors.push(`tests for "${slug}" match no lld page`);
}

for (const e of errors) console.log(`  ERROR  ${e}`);
console.log(`\n  ${passed}/${pages.length} lld pages verified · ${errors.length} error`);
process.exit(errors.length ? 1 : 0);
