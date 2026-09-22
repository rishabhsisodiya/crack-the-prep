/**
 * Integrity checks for DSA data and notes. Blocks the deploy on any ERROR.
 * Run:  npm run check:data
 *
 * Checks
 *   - every solution has a statement; no orphan statement / test keys
 *   - every Interview Core problem resolves to a solution (by name, alias or `solution`)
 *   - no two solutions in a topic share an anchor (◆ solutions links stay unique)
 *   - test specs are well-formed, and every reference approach passes its tests
 *   - notes: no duplicate `order` within a track (warn)
 *   - machine-coding problem pages follow the fixed section template, in order
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

import { solutions } from '../src/data/dsa-solutions.mjs';
import { statements } from '../src/data/dsa-statements.mjs';
import { tests } from '../src/data/dsa-tests.mjs';
import { kebab } from '../src/lib/slug.mjs';
import { defines, specFor } from '../src/lib/runner-spec.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const core = readJson('src/data/dsa-core.json');

const errors = [];
const warns = [];
const err = (area, msg) => errors.push(`${area}: ${msg}`);
const warn = (area, msg) => warns.push(`${area}: ${msg}`);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const byTitle = new Map(solutions.map((s) => [s.problem, s]));

// ---------------------------------------------------------------- statements
for (const s of solutions) if (!statements[s.problem]) err('statements', `missing for "${s.problem}"`);
for (const k of Object.keys(statements)) if (!byTitle.has(k)) err('statements', `orphan key "${k}" (no such solution)`);

// ---------------------------------------------------------------- anchors
const anchors = new Map();
for (const s of solutions) {
  const a = `${kebab(s.topic)}#${kebab(s.problem)}`;
  if (anchors.has(a)) err('anchors', `"${s.problem}" and "${anchors.get(a)}" share anchor ${a}`);
  else anchors.set(a, s.problem);
}

// ---------------------------------------------------------------- core → solution
const solvedBy = new Map();
for (const s of solutions) {
  solvedBy.set(norm(s.problem), s);
  for (const a of s.also ?? []) solvedBy.set(norm(a), s);
}
const coreSolutions = new Set();
for (const g of core) {
  for (const p of g.problems) {
    const s = solvedBy.get(norm(p.solution ?? p.name));
    if (!s) err('core', `"${p.name}" has no solution${p.solution ? ` (alias "${p.solution}" not found)` : ''}`);
    else coreSolutions.add(s.problem);
  }
}

// ---------------------------------------------------------------- tests
const harnessCtx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(ROOT, 'public/runner/harness.js'), 'utf8'), harnessCtx);
const H = harnessCtx.CTPHarness;

const KINDS = ['function', 'design'];
const CHECKS = ['return', 'arg0'];

function validSpec(title, t) {
  const area = `tests "${title}"${t.fn ? ` (${t.fn})` : ''}`;
  let ok = true;
  const bad = (m) => { err(area, m); ok = false; };
  const sol = byTitle.get(title);
  if (!sol) bad('no such solution');
  if (typeof t.fn !== 'string' || !t.fn) bad('`fn` is required');
  if (t.after !== undefined && (typeof t.after !== 'string' || !t.after)) bad('`after` must be a function name');
  if (t.approaches !== undefined) {
    if (!Array.isArray(t.approaches) || !t.approaches.length) bad('`approaches` must be a non-empty array of indices');
    else if (sol) for (const i of t.approaches) if (!sol.approaches[i]) bad(`approach index ${i} does not exist`);
  }
  if (t.kind && !KINDS.includes(t.kind)) bad(`unknown kind "${t.kind}"`);
  if (t.check && !CHECKS.includes(t.check)) bad(`unknown check "${t.check}"`);
  if (t.compare && !H.COMPARE_MODES.includes(t.compare)) bad(`unknown compare "${t.compare}"`);
  if (t.output && !H.OUTPUT_KINDS.includes(t.output)) bad(`unknown output "${t.output}"`);
  for (const k of t.input ?? []) if (!H.INPUT_KINDS.includes(k)) bad(`unknown input "${k}"`);
  if (!Array.isArray(t.cases) || !t.cases.length) bad('needs at least one case');
  (t.cases ?? []).forEach((c, i) => {
    if (!Array.isArray(c.args)) bad(`case ${i + 1}: \`args\` must be an array`);
    if (!('expected' in c)) bad(`case ${i + 1}: \`expected\` is missing`);
    if (t.compare === 'any-of' && !Array.isArray(c.expected)) bad(`case ${i + 1}: any-of needs an array of answers`);
  });
  return ok;
}

let ran = 0;
for (const [title, entry] of Object.entries(tests)) {
  const specs = Array.isArray(entry) ? entry : [entry];
  if (!specs.map((t) => validSpec(title, t)).every(Boolean)) continue;
  const sol = byTitle.get(title);
  // every spec must apply to at least one approach
  for (const t of specs) {
    const hits = sol.approaches.filter((a, i) => (!t.approaches || t.approaches.includes(i)) && defines(a.code, t.fn));
    if (!hits.length) err(`tests "${title}" (${t.fn})`, `no ${t.approaches ? 'listed ' : ''}approach defines "${t.fn}"`);
  }
  for (const [i, a] of sol.approaches.entries()) {
    const t = specFor(entry, i, a.code);
    if (!t) continue;
    harnessCtx.__code = a.code;
    harnessCtx.__spec = t;
    let out;
    try {
      out = vm.runInContext('CTPHarness.runAll(__code, __spec)', harnessCtx, { timeout: 5000 });
    } catch (e) {
      err(`tests "${title}" / ${a.name}`, `timed out or crashed: ${e.message}`);
      continue;
    }
    ran++;
    if (out.error) {
      err(`tests "${title}" / ${a.name}`, out.error);
      continue;
    }
    for (const r of out.results) {
      if (r.pass) continue;
      const detail = r.error ? `error: ${r.error}` : `got ${H.show(r.got)}, expected ${H.show(r.expected)}`;
      err(`tests "${title}" / ${a.name}`, `case ${r.i + 1} failed — ${detail}`);
    }
  }
}
const untested = [...coreSolutions].filter((p) => !tests[p]);
if (untested.length) warn('tests', `${untested.length} of ${coreSolutions.size} Interview Core solutions have no tests yet`);

// ---------------------------------------------------------------- notes
const NOTES = path.join(ROOT, 'src/content/notes');
const orders = new Map();
for (const f of fs.readdirSync(NOTES).filter((f) => /\.mdx?$/.test(f))) {
  const fm = fs.readFileSync(path.join(NOTES, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const get = (k) => fm[1].match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1];
  if (get('draft') === 'true') continue;
  const k = `${get('track')}|${get('kind') ?? 'notes'}|${get('order') ?? '1'}`;
  if (orders.has(k)) warn('notes', `${f} and ${orders.get(k)} share track/kind/order ${k}`);
  else orders.set(k, f);
}

// ---------------------------------------------------------------- machine-coding template
// Problem pages (order >= 10; lower orders are intro pages) must use exactly
// these `##` sections, in this order, and show the final code as a js/jsx block.
const MC_SECTIONS = [
  'Problem', 'Clarifying questions', 'Approach', 'Step-by-step build', 'Final code',
  'Edge cases', 'Follow-ups', 'Common mistakes', 'Related',
];
for (const f of fs.readdirSync(NOTES).filter((f) => f.startsWith('machine-coding-') && f.endsWith('.mdx'))) {
  const src = fs.readFileSync(path.join(NOTES, f), 'utf8');
  const order = Number(src.match(/^order:\s*(\d+)/m)?.[1] ?? 1);
  if (order < 10) continue;
  const body = src.replace(/```[\s\S]*?```/g, ''); // headings inside code blocks do not count
  const found = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  if (found.join('|') !== MC_SECTIONS.join('|')) {
    err('machine-coding', `${f}: sections must be [${MC_SECTIONS.join(', ')}], found [${found.join(', ')}]`);
  }
  const final = src.split(/^## Final code$/m)[1]?.split(/^## /m)[0] ?? '';
  if (!/```jsx?\n/.test(final)) err('machine-coding', `${f}: "Final code" needs a \`\`\`js or \`\`\`jsx block`);
  if (!/^### Step 1/m.test(src)) err('machine-coding', `${f}: "Step-by-step build" needs "### Step 1 …" headings`);
}

// ---------------------------------------------------------------- report
for (const w of warns) console.log(`  warn   ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);
console.log(
  `\n  ${solutions.length} solutions · ${Object.keys(tests).length} tested problems · ${ran} approaches run` +
    `\n  ${errors.length} error   ${warns.length} warn`,
);
process.exit(errors.length ? 1 : 0);
