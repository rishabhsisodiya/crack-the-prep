import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkCallouts from './src/plugins/remark-callouts.mjs';
import rehypeImgAttrs from './src/plugins/rehype-img-attrs.mjs';
import rehypeFigure from './src/plugins/rehype-figure.mjs';

// CrackThePrep is served from https://rishabhsisodiya.github.io/crack-the-prep/
// as a GitHub project page. Moving to a root domain later: set BASE to '' and
// `site` to that domain.
const BASE = '/crack-the-prep';

export default defineConfig({
  site: 'https://rishabhsisodiya.github.io',
  base: BASE,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    remarkPlugins: [remarkCallouts],
    rehypePlugins: [[rehypeImgAttrs, { base: BASE }], rehypeFigure],
  },
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      styleOverrides: {
        borderRadius: '6px',
        codeFontFamily: "'Space Mono', ui-monospace, SFMono-Regular, monospace",
      },
    }),
    mdx(),
    sitemap(),
  ],
});
