# CrackThePrep

Free, practitioner-grade interview preparation for full-stack engineers: notes, questions and
worked examples in one place.

**[rishabhsisodiya.github.io/crack-the-prep](https://rishabhsisodiya.github.io/crack-the-prep)**

## Tracks

| Track | What it covers |
|---|---|
| **Prep Plan** | How to prepare, what to prioritise, a week by week roadmap |
| **JavaScript** | Scope, closures, prototypes, the event loop, async, ES6+ |
| **React** | Rendering, hooks, state, performance, the patterns interviewers probe |
| **Node.js** | Runtime model, modules, Express, middleware, auth, backend fundamentals |
| **Machine Coding** | Polyfills, utilities, async helpers and UI components, built step by step |
| **System Design** | A framework, the building blocks, worked problems with diagrams |
| **DSA** | Theory, two dozen patterns, an interview core list, a 450 problem checklist, worked solutions |
| **Behavioral** | The STAR method and a bank of leadership and teamwork prompts |

Around 135 notes and question sets. JavaScript, React and Node.js each have a dedicated
questions drill page. Everything is searchable from any page.

## Running it locally

```bash
npm ci
npm run dev        # http://localhost:4321/crack-the-prep
```

Other commands:

```bash
npm run check      # data integrity, machine-coding tests, note linting
npm run build      # astro build, then a Pagefind search index over dist/
npm run preview    # serve the built site
```

`npm run check` is what CI runs before deploying: it verifies the DSA solutions against
their tests, compiles and runs the "Final code" from each Machine Coding page, and lints the
notes. Run it before opening a pull request.

Node 22, matching CI.

## Adding or editing a note

Notes are Markdown or MDX in `src/content/notes/`, loaded as an Astro content collection.
The frontmatter schema lives in `src/content.config.ts`:

```yaml
---
title: Closures and scope        # required
track: javascript                # required, a slug from TRACKS in src/consts.ts
kind: notes                      # notes | questions
order: 3                         # lower comes first; the lowest notes doc is the landing page
imp: true                        # marks a high yield section
slug: closures                   # optional, sets the URL segment
description: ...                 # optional, used for meta tags
updated: 2026-01-20              # optional
draft: false                     # true keeps it out of the build
---
```

The URL is `/<track>/<slug>`, where the slug is the explicit one or `NN-title-kebab` built
from `order` and `title`. A track's lowest-ordered notes doc is its landing page, at
`/<track>`.

After editing, run `npm run check`.

To add a **track**, add an entry to `TRACKS` in `src/consts.ts`, then add notes with that
`track` slug.

To add a **DSA problem**, the statement, solution and tests live in `src/data/`. `check:data`
will tell you what is missing or unlinked.

## Layout

```
src/
  content/notes/     the notes and question sets (Markdown / MDX)
  data/              DSA statements, solutions and test specs
  pages/             routes: index, search, [track]/, dsa/
  components/        UI
  layouts/           page shells
  lib/               helpers
  plugins/           Markdown and MDX plugins
  consts.ts          site metadata and the track list
scripts/             the three check scripts and the machine-coding tests
```

## Built with

[Astro](https://astro.build) with MDX, [Pagefind](https://pagefind.app) for search,
[Expressive Code](https://expressive-code.com) for code blocks, and Mermaid for diagrams.
Deployed to GitHub Pages by GitHub Actions on every push to `main`, after `npm run check`
passes.

## Contributing

Corrections and additions are welcome, especially where an explanation is wrong or a worked
solution can be clearer. Open an issue or a pull request. Run `npm run check` first; CI runs
the same command and will not deploy without it.
