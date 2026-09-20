/**
 * Scan generated note content for conversion artifacts and rough spots.
 * Run:  npm run lint:notes        (exits 1 if any ERROR-level findings)
 *       npm run lint:notes -- js  (only files matching "js")
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/notes');
const filter = process.argv[2];

/** each rule: { id, level, test(line, ctx) -> bool, msg } ; ctx has {inFence, prev, next, lineNo} */
const RULES = [
  {
    id: 'broken-table-row',
    level: 'error',
    msg: 'literal pipe-table separator mixed with text — table did not convert',
    test: (l, c) => !c.inFence && /\|\s*-{3,}\s*\|/.test(l) && !/^\|(.+\|)+\s*$/.test(l),
  },
  {
    id: 'lone-table-separator',
    level: 'warn',
    msg: 'stray "| ---" table remnant',
    test: (l, c) => !c.inFence && !c.inFrontmatter && /\|/.test(l) && /-{3,}/.test(l) && /^[\s|:-]+$/.test(l) && !/^\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(l),
  },
  {
    id: 'orphan-pipe',
    level: 'warn',
    msg: 'orphan "|" line (table remnant)',
    test: (l, c) => !c.inFence && /^\s*\|\s*$/.test(l),
  },
  {
    id: 'table-missing-body',
    level: 'error',
    msg: 'table header + separator but no data rows',
    test: (l, c) => /^\|(.+\|)+\s*$/.test(l) && /^\|(\s*-{3,}\s*\|)+\s*$/.test(c.next || '') && !/^\|/.test(c.after2 || ''),
  },
  {
    id: 'heading-looks-like-code',
    level: 'warn',
    msg: 'heading text looks like code (lost its fence?)',
    test: (l, c) => {
      if (c.inFence || !/^#{2,6}\s+/.test(l)) return false;
      const t = l.replace(/^#{2,6}\s+/, '');
      return (
        /^\/\//.test(t) ||
        /[;{}]\s*$/.test(t) ||
        /=>/.test(t) ||
        /^(function|const|let|var|return|class|async function)\b.*[({;]/.test(t) ||
        /^(if|for|while|switch)\s*\(/.test(t) ||
        /^[\w$.]+\s*=[^=]/.test(t) ||
        /\w\.\w+\([^)]*[a-zA-Z0-9'"]/.test(t)
      );
    },
  },
  {
    id: 'heading-styled',
    level: 'warn',
    msg: 'heading wrapped in ** or _ (should be plain)',
    test: (l, c) => !c.inFence && /^#{1,6}\s+([_*]{1,2}).+\1\s*$/.test(l),
  },
  {
    id: 'empty-heading',
    level: 'warn',
    msg: 'heading with no text',
    test: (l, c) => !c.inFence && /^#{1,6}\s*$/.test(l),
  },
  {
    id: 'consecutive-headings',
    level: 'warn',
    msg: 'heading immediately followed by another heading (empty section)',
    test: (l, c) => !c.inFence && /^#{2,6}\s+\S/.test(l) && /^#{2,6}\s+\S/.test((c.next || '').trim()),
  },
  {
    id: 'escaped-punct-in-code',
    level: 'error',
    msg: 'backslash-escaped punctuation inside a code fence',
    test: (l, c) => c.inFence && /\\[*_\-=[\]<>|`~^&]/.test(l),
  },
  {
    id: 'smart-quote-in-code',
    level: 'error',
    msg: 'curly quote inside a code fence (would break if pasted)',
    test: (l, c) => c.inFence && /[“”‘’]/.test(l),
  },
  {
    id: 'prose-in-code',
    level: 'warn',
    msg: 'code fence line looks like prose or program output',
    test: (l, c) =>
      c.inFence &&
      c.fenceLang === 'js' &&
      /[a-z]/.test(l) &&
      l.trim().split(/\s+/).length >= 6 &&
      !/[;{}()=]|=>|\/\/|console\.|:/.test(l) &&
      /\b(the|is|are|will|when|then|this|that|which|because|output)\b/i.test(l),
  },
  {
    id: 'zero-width-char',
    level: 'warn',
    msg: 'zero-width / invisible unicode char',
    test: (l) => /[​‌‍⁡﻿­]/.test(l),
  },
  {
    id: 'space-before-punct',
    level: 'info',
    msg: 'space before , ; : or .',
    test: (l, c) => !c.inFence && / +[,;:](?=\s)| +\.(?= |$)/.test(l) && !/https?:/.test(l),
  },
  {
    id: 'lowercase-javascript',
    level: 'info',
    msg: '"javascript"/"Javascript" not capitalized as "JavaScript"',
    test: (l, c) => !c.inFence && /\bjava\s?script\b/.test(l) && !/JavaScript/.test(l) && !/https?:/.test(l),
  },
  {
    id: 'raw-table-tag',
    level: 'warn',
    msg: 'raw table tag in prose (table conversion leftover)',
    test: (l, c) => !c.inFence && /<\/?(table|thead|tbody|tr|td|th)\b/.test(l),
  },
  {
    id: 'stacked-images',
    level: 'info',
    msg: 'two images on one line (no caption)',
    test: (l, c) => !c.inFence && /!\[[^\]]*\]\([^)]+\)\s*!\[[^\]]*\]\([^)]+\)/.test(l),
  },
  {
    id: 'external-doc-link',
    level: 'info',
    msg: 'link to a Google Doc / personal doc',
    test: (l, c) => !c.inFence && /docs\.google\.com|notion\.so/.test(l),
  },
];

function lintFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  let inFence = false;
  let fenceLang = '';
  let fmDelims = 0;
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fmDelims < 2 && line.trim() === '---') { fmDelims++; continue; }
    if (fmDelims < 2) continue; // skip frontmatter entirely
    const fenceMatch = line.match(/^\s*```(\w*)/);
    if (fenceMatch) {
      if (!inFence) { inFence = true; fenceLang = fenceMatch[1] || ''; }
      else { inFence = false; fenceLang = ''; }
      continue;
    }
    const ctx = {
      inFence,
      fenceLang,
      prev: lines[i - 1],
      next: lines[i + 1],
      after2: lines[i + 2],
      lineNo: i + 1,
    };
    for (const r of RULES) {
      try {
        if (r.test(line, ctx)) findings.push({ line: i + 1, rule: r.id, level: r.level, msg: r.msg, text: line.trim().slice(0, 100) });
      } catch { /* rule error, skip */ }
    }
  }
  return findings;
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => /\.mdx?$/.test(f))
  .filter((f) => !filter || f.includes(filter))
  .sort();

let totals = { error: 0, warn: 0, info: 0 };
const byRule = {};

for (const f of files) {
  const findings = lintFile(path.join(DIR, f));
  if (!findings.length) continue;
  console.log(`\n\x1b[1m${f}\x1b[0m`);
  for (const x of findings) {
    totals[x.level]++;
    byRule[x.rule] = (byRule[x.rule] || 0) + 1;
    const color = x.level === 'error' ? 31 : x.level === 'warn' ? 33 : 90;
    console.log(`  \x1b[${color}m${x.level.toUpperCase().padEnd(5)}\x1b[0m L${String(x.line).padEnd(5)} ${x.rule.padEnd(24)} ${x.msg}`);
    console.log(`        \x1b[90m${x.text}\x1b[0m`);
  }
}

console.log('\n\x1b[1mSummary by rule\x1b[0m');
for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${rule}`);
}
console.log(`\n  ${totals.error} error   ${totals.warn} warn   ${totals.info} info   across ${files.length} files`);
process.exit(totals.error > 0 ? 1 : 0);
