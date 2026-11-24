#!/usr/bin/env node
/**
 * Builds the interactive system design diagrams.
 *
 *   src/diagrams/<note>/<id>.json   archify source (committed)
 *   .archify/build/<note>/<id>.html archify output + check receipts (ignored)
 *   public/diagrams/<note>/<id>.html the page the site serves (committed)
 *
 * Usage:
 *   node scripts/build-diagrams.mjs                    # every diagram
 *   node scripts/build-diagrams.mjs url-shortener      # one note's diagrams
 *
 * Needs the archify skill locally (and the Chrome it uses for its browser gate).
 * Override its location with ARCHIFY_BIN=/path/to/archify.mjs.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const SRC = join(ROOT, 'src/diagrams');
const BUILD = join(ROOT, '.archify/build');
const PUBLIC = join(ROOT, 'public/diagrams');
const ARCHIFY = process.env.ARCHIFY_BIN ?? join(homedir(), '.claude/skills/archify/bin/archify.mjs');

if (!existsSync(ARCHIFY)) {
  console.error(`archify not found at ${ARCHIFY}. Set ARCHIFY_BIN.`);
  process.exit(1);
}

const only = process.argv.slice(2);
const notes = readdirSync(SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory() && (only.length === 0 || only.includes(d.name)))
  .map((d) => d.name);

if (only.length && notes.length !== only.length) {
  const missing = only.filter((n) => !notes.includes(n));
  console.error(`No diagram folder for: ${missing.join(', ')}`);
  process.exit(1);
}

let failed = 0;
for (const note of notes) {
  for (const file of readdirSync(join(SRC, note)).filter((f) => f.endsWith('.json'))) {
    const id = file.replace(/\.json$/, '');
    const src = join(SRC, note, file);
    const out = join(BUILD, note, `${id}.html`);
    const spec = JSON.parse(readFileSync(src, 'utf8'));
    const expected = relative(ROOT, out);

    if (spec.meta?.output !== expected) {
      console.error(`✗ ${note}/${id}: meta.output must be "${expected}"`);
      failed++;
      continue;
    }

    mkdirSync(dirname(out), { recursive: true });
    const run = spawnSync(
      'node',
      [ARCHIFY, 'finalize', spec.diagram_type, relative(ROOT, src), expected,
        '--quality', spec.meta.quality_profile ?? 'showcase', '--json'],
      { cwd: ROOT, encoding: 'utf8' },
    );

    if (run.status !== 0) {
      console.error(`✗ ${note}/${id}: archify finalize failed`);
      console.error((run.stdout || run.stderr).slice(-2000));
      failed++;
      continue;
    }

    // The note itself is the search result; keep Pagefind from indexing the diagram page.
    const html = readFileSync(out, 'utf8');
    if (!/<body(\s|>)/.test(html)) {
      console.error(`✗ ${note}/${id}: no <body> tag in archify output`);
      failed++;
      continue;
    }
    mkdirSync(join(PUBLIC, note), { recursive: true });
    writeFileSync(join(PUBLIC, note, `${id}.html`), html.replace(/<body(\s|>)/, '<body data-pagefind-ignore="all"$1'));
    console.log(`✓ ${note}/${id}`);
  }
}

process.exit(failed ? 1 : 0);
