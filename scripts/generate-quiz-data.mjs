/**
 * Builds the static quiz question bank from the *-questions.md notes files.
 * No AI involved: it parses the existing Q&A markdown structure directly.
 *
 * A heading (##/###/####) is treated as one question when it has no child
 * heading under it (a "leaf") — same rule the /questions reveal-page script
 * uses to decide what becomes a collapsible <details>. Headings that only
 * group children (e.g. "### Type coercion & operators" wrapping "#### Q1 …")
 * are skipped; their children are the real questions.
 *
 * Run:  node scripts/generate-quiz-data.mjs
 * Output: public/quiz-data.json (consumed client-side by /quiz)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = path.join(ROOT, 'src/content/notes');
const OUT = path.join(ROOT, 'public/quiz-data.json');

const SOURCES = [
  { file: 'javascript-questions.md', section: 'javascript', label: 'JavaScript' },
  { file: 'react-questions.md', section: 'react', label: 'React' },
  { file: 'nodejs-questions.md', section: 'nodejs', label: 'Node.js' },
];

const MAX_MCQ_ANSWER_LEN = 320; // plain-text length cap for an answer to be MCQ-eligible

function stripFrontmatter(src) {
  return src.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

/** Parse ##/###/#### headings, ignoring any inside fenced code blocks. */
function parseHeadings(lines) {
  const headings = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^```/.test(line.trim())) { inFence = !inFence; return; }
    if (inFence) return;
    const m = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (m) headings.push({ level: m[1].length, title: m[2].trim(), line: i });
  });
  return headings;
}

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<details>[\s\S]*?<summary>[\s\S]*?<\/summary>/g, '')
    .replace(/<\/?details>|<\/?summary>/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuestions(src, section) {
  const body = stripFrontmatter(src);
  const lines = body.split('\n');
  const headings = parseHeadings(lines);
  const questions = [];

  headings.forEach((h, i) => {
    const next = headings[i + 1];
    const isLeaf = !next || next.level <= h.level;
    if (!isLeaf) return; // grouping heading, its children carry the content

    // this heading's own block ends at the next heading of level <= its own
    let endIdx = headings.length;
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) { endIdx = j; break; }
    }
    const endLine = endIdx < headings.length ? headings[endIdx].line : lines.length;
    const answerMd = lines
      .slice(h.line + 1, endLine)
      .join('\n')
      // drop standalone "[Deep dive → …](…)" nav lines — not part of the answer
      .replace(/^\s*\[Deep dive[^\n]*\]\([^)]*\)\s*$/gm, '')
      .trim();
    if (!answerMd) return; // heading with no body isn't a usable question

    const answerPlain = plainText(answerMd);
    if (!answerPlain) return;

    questions.push({
      id: `${section}-${questions.length + 1}`,
      section,
      question: h.title.replace(/^Q\d+\.\s*/, ''),
      answerMd,
      answerPlain,
      mcq: answerPlain.length <= MAX_MCQ_ANSWER_LEN,
    });
  });

  return questions;
}

const sections = {};
let all = [];

for (const { file, section, label } of SOURCES) {
  const p = path.join(NOTES, file);
  if (!fs.existsSync(p)) {
    console.warn(`  warn  quiz-data: ${file} not found, skipping "${section}"`);
    continue;
  }
  const qs = extractQuestions(fs.readFileSync(p, 'utf8'), section);
  sections[section] = { label, count: qs.length };
  all = all.concat(qs);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ sections, questions: all }));

const mcqCount = all.filter((q) => q.mcq).length;
console.log(
  `  quiz-data: ${all.length} questions across ${Object.keys(sections).length} sections ` +
    `(${mcqCount} MCQ-eligible, ${all.length - mcqCount} reveal-only) → public/quiz-data.json`,
);
