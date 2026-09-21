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
    'Free, practitioner-grade interview preparation for full-stack engineers: JavaScript, React, Node.js, system design, DSA and behavioral — notes, questions and worked examples in one place.',
} as const;

export type Track = {
  slug: string;
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
    title: 'Prep Plan',
    blurb: 'How to prepare, what to prioritise, and a week-by-week roadmap.',
    badge: '01',
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    blurb: 'Language core — scope, closures, prototypes, the event loop, async, ES6+.',
    badge: 'JS',
    hasQuestions: true,
  },
  {
    slug: 'react',
    title: 'React',
    blurb: 'Rendering, hooks, state, performance and the patterns interviewers probe.',
    badge: '⚛',
    hasQuestions: true,
  },
  {
    slug: 'nodejs',
    title: 'Node.js',
    blurb: 'Runtime model, modules, Express, middleware, auth and backend fundamentals.',
    badge: '⬢',
    hasQuestions: true,
  },
  {
    slug: 'system-design',
    title: 'System Design',
    blurb: 'A framework, the building blocks, and worked problems with diagrams.',
    badge: '▤',
  },
  {
    slug: 'dsa',
    title: 'DSA',
    blurb: 'Theory, two dozen patterns, a curated interview-core list, a 450-problem checklist, and worked solutions.',
    badge: '∑',
    sections: [
      { label: 'Algorithms & Big-O', path: 'algorithms' },
      { label: 'Data Structures', path: 'data-structures' },
      { label: 'Patterns', path: 'patterns' },
      { label: 'Interview core', path: 'core' },
      { label: 'Practice checklist', path: 'checklist' },
      { label: 'Worked solutions', path: 'solutions' },
    ],
  },
  {
    slug: 'behavioral',
    title: 'Behavioral',
    blurb: 'The STAR method and a bank of leadership and teamwork prompts.',
    badge: '✦',
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);

/** Prefix an absolute-from-root path with the configured base. */
export function u(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/`[^`]*`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'section';

/** URL segment for a notes entry: explicit frontmatter slug, else NN-title-kebab */
export function noteSlug(data: { slug?: string; order?: number; title: string }): string {
  if (data.slug) return data.slug;
  const n = data.order ? String(data.order).padStart(2, '0') + '-' : '';
  return n + kebab(data.title);
}
