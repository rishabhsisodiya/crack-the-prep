// Deploy target. For GitHub project pages the site lives under /crack-the-prep/.
// Moving to a root domain later: set ROOT = '' and ORIGIN to the domain.
const ORIGIN = 'https://rishabhsisodiya.github.io';
const ROOT = '/crack-the-prep';

export const SITE = {
  name: 'CrackThePrep',
  origin: ORIGIN,
  root: ROOT,
  url: `${ORIGIN}${ROOT}`,
  base: ROOT,
  title: 'CrackThePrep — Full-Stack Interview Preparation',
  description:
    'Free, practitioner-grade interview preparation for full-stack engineers: JavaScript, React, Node.js, system design, DSA, AI engineering and behavioral — notes, questions and worked examples in one place.',
} as const;

export type RoadmapId = 'fullstack' | 'ai';

export type Roadmap = { id: RoadmapId; title: string; blurb: string };

/** Top-level groupings of tracks. Each roadmap is navigated and paged on its own. */
export const ROADMAPS: Roadmap[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Interview Prep',
    blurb: 'JavaScript, React, Node.js, machine coding, system design, DSA and behavioral.',
  },
  {
    id: 'ai',
    title: 'AI Engineering Roadmap',
    blurb: 'GenAI & LLM engineering for working engineers — from advanced Python to production agents.',
  },
];

export type Track = {
  slug: string;
  roadmap: RoadmapId;
  title: string;
  blurb: string;
  badge: string;
  /** whether the track has a dedicated /questions drill page */
  hasQuestions?: boolean;
  /** extra sidebar sub-links, path relative to the track (e.g. "algorithms" -> /prep/dsa/algorithms) */
  sections?: { label: string; path: string }[];
};

export const TRACKS: Track[] = [
  {
    slug: 'plan',
    roadmap: 'fullstack',
    title: 'Prep Plan',
    blurb: 'How to prepare, what to prioritise, and a week-by-week roadmap.',
    badge: '01',
  },
  {
    slug: 'javascript',
    roadmap: 'fullstack',
    title: 'JavaScript',
    blurb: 'Language core — scope, closures, prototypes, the event loop, async, ES6+.',
    badge: 'JS',
    hasQuestions: true,
  },
  {
    slug: 'react',
    roadmap: 'fullstack',
    title: 'React',
    blurb: 'Rendering, hooks, state, performance and the patterns interviewers probe.',
    badge: '⚛',
    hasQuestions: true,
  },
  {
    slug: 'nodejs',
    roadmap: 'fullstack',
    title: 'Node.js',
    blurb: 'Runtime model, modules, Express, middleware, auth and backend fundamentals.',
    badge: '⬢',
    hasQuestions: true,
  },
  {
    slug: 'machine-coding',
    roadmap: 'fullstack',
    title: 'Machine Coding',
    blurb: 'Polyfills, utilities, async helpers and UI components — built live, step by step, the way the round is scored.',
    badge: '⌨',
  },
  {
    slug: 'system-design',
    roadmap: 'fullstack',
    title: 'System Design',
    blurb: 'A framework, the building blocks, and worked problems with diagrams.',
    badge: '▤',
  },
  {
    slug: 'dsa',
    roadmap: 'fullstack',
    title: 'DSA',
    blurb: 'Theory, two dozen patterns, a curated interview-core list, and practice problems with an editor, tests and worked solutions.',
    badge: '∑',
    sections: [
      { label: 'Algorithms & Big-O', path: 'algorithms' },
      { label: 'Data Structures', path: 'data-structures' },
      { label: 'Patterns', path: 'patterns' },
      { label: 'Interview core', path: 'core' },
      { label: 'Practice problems', path: 'solutions' },
    ],
  },
  {
    slug: 'behavioral',
    roadmap: 'fullstack',
    title: 'Behavioral',
    blurb: 'The STAR method and a bank of leadership and teamwork prompts.',
    badge: '✦',
  },
  {
    slug: 'ai-engineering',
    roadmap: 'ai',
    title: 'AI Engineering',
    blurb: 'GenAI & LLM engineering — Python for AI, prompts, RAG, agents, memory, voice, MCP, evals, guardrails. Theory, free resources and a build project in every chapter.',
    badge: 'AI',
    hasQuestions: true,
    sections: [
      { label: 'Advanced Python', path: 'python' },
      { label: 'How LLMs work', path: 'llm-foundations' },
      { label: 'Prompt engineering', path: 'prompting' },
      { label: 'LLM APIs & local models', path: 'llm-apis' },
      { label: 'RAG', path: 'rag' },
      { label: 'Agents & LangGraph', path: 'agents' },
      { label: 'Agent memory', path: 'memory' },
      { label: 'Voice, multimodal & MCP', path: 'voice-multimodal' },
      { label: 'Production AI', path: 'production' },
    ],
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);
export const tracksIn = (roadmap: RoadmapId) => TRACKS.filter((t) => t.roadmap === roadmap);

/** Prefix an absolute-from-root path with the configured base. */
export function u(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export { kebab } from './lib/slug.mjs';
import { kebab } from './lib/slug.mjs';

/** URL segment for a notes entry: explicit frontmatter slug, else NN-title-kebab */
export function noteSlug(data: { slug?: string; order?: number; title: string }): string {
  if (data.slug) return data.slug;
  const n = data.order ? String(data.order).padStart(2, '0') + '-' : '';
  return n + kebab(data.title);
}
