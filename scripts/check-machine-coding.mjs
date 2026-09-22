/**
 * Verifies the "Final code" of every Machine Coding problem page actually works.
 * Run:  npm run check:mc        (exits 1 on any failure)
 *
 * For each src/content/notes/machine-coding-*.mdx with order >= 10:
 *   1. extract the first ```js / ```jsx block under "## Final code"
 *   2. compile it with esbuild (JSX → React.createElement, imports → require)
 *   3. evaluate it with a React stub — components are defined, never rendered,
 *      so UI pages are checked through their pure logic (reducers, key handlers)
 *   4. run that page's tests from scripts/machine-coding.tests.mjs
 * A problem page without a test entry is an error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

import { tests } from './machine-coding.tests.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = path.join(ROOT, 'src/content/notes');

// Hooks must never run here — calling one means a test rendered a component.
const hook = (name) => () => { throw new Error(`React stub: ${name}() cannot run outside a component render`); };
const ReactStub = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  Fragment: 'Fragment',
  createContext: (value) => ({ Provider: 'Provider', Consumer: 'Consumer', _default: value }),
};
for (const h of ['useState', 'useEffect', 'useReducer', 'useRef', 'useCallback', 'useMemo', 'useId', 'useContext', 'useLayoutEffect']) {
  ReactStub[h] = hook(h);
}
const stubRequire = (id) => {
  if (id === 'react') return ReactStub;
  throw new Error(`unexpected import "${id}" in final code`);
};

function finalCode(src, file) {
  const section = src.split(/^## Final code$/m)[1]?.split(/^## /m)[0];
  const m = section?.match(/```(jsx?)\n([\s\S]*?)```/);
  if (!m) throw new Error(`${file}: no js/jsx block under "## Final code"`);
  return { lang: m[1], code: m[2] };
}

function load(file, names) {
  const src = fs.readFileSync(path.join(NOTES, file), 'utf8');
  const { lang, code } = finalCode(src, file);
  const out = transformSync(code, {
    loader: lang,
    format: 'cjs',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2022',
  }).code;
  const module = { exports: {} };
  // eslint-disable-next-line no-new-func
  return new Function('require', 'module', 'exports', 'React', `${out}\nreturn { ${names.join(', ')} };`)(
    stubRequire, module, module.exports, ReactStub,
  );
}

const pages = fs
  .readdirSync(NOTES)
  .filter((f) => f.startsWith('machine-coding-') && f.endsWith('.mdx'))
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
    errors.push(`${page.file}: no tests for slug "${page.slug}" in scripts/machine-coding.tests.mjs`);
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
  if (!pages.some((p) => p.slug === slug)) errors.push(`tests for "${slug}" match no machine-coding page`);
}

for (const e of errors) console.log(`  ERROR  ${e}`);
console.log(`\n  ${passed}/${pages.length} machine-coding pages verified · ${errors.length} error`);
process.exit(errors.length ? 1 : 0);
