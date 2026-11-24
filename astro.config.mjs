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
  // Old URLs of pages that were split or renamed. Astro does not add `base` to the target.
  redirects: {
    '/machine-coding/map-filter-reduce': `${BASE}/machine-coding/foreach-map-filter`,
    '/dsa/checklist': `${BASE}/dsa/solutions`,
    '/system-design/scenario-cdc-outbox-monolith': `${BASE}/scenarios/scenario-cdc-outbox-monolith`,
    '/system-design/scenario-customer-360-ingestion': `${BASE}/scenarios/scenario-customer-360-ingestion`,
    '/system-design/scenario-effectively-once-payments': `${BASE}/scenarios/scenario-effectively-once-payments`,
    '/system-design/scenario-finance-reconciliation': `${BASE}/scenarios/scenario-finance-reconciliation`,
    '/system-design/scenario-gdpr-erasure': `${BASE}/scenarios/scenario-gdpr-erasure`,
    '/system-design/scenario-hot-partition-flash-events': `${BASE}/scenarios/scenario-hot-partition-flash-events`,
    '/system-design/scenario-inventory-sync-conflicts': `${BASE}/scenarios/scenario-inventory-sync-conflicts`,
    '/system-design/scenario-lakehouse-etl': `${BASE}/scenarios/scenario-lakehouse-etl`,
    '/system-design/scenario-log-analytics-pipeline': `${BASE}/scenarios/scenario-log-analytics-pipeline`,
    '/system-design/scenario-metrics-cardinality': `${BASE}/scenarios/scenario-metrics-cardinality`,
    '/system-design/scenario-multi-region-dr': `${BASE}/scenarios/scenario-multi-region-dr`,
    '/system-design/scenario-multi-tenant-throttling': `${BASE}/scenarios/scenario-multi-tenant-throttling`,
    '/system-design/scenario-nightly-batch-window': `${BASE}/scenarios/scenario-nightly-batch-window`,
    '/system-design/scenario-rate-limited-api-sync': `${BASE}/scenarios/scenario-rate-limited-api-sync`,
    '/system-design/scenario-realtime-fraud-detection': `${BASE}/scenarios/scenario-realtime-fraud-detection`,
    '/system-design/scenario-retail-reporting': `${BASE}/scenarios/scenario-retail-reporting`,
    '/system-design/scenario-search-indexing-pipeline': `${BASE}/scenarios/scenario-search-indexing-pipeline`,
    '/system-design/scenario-small-files-lake': `${BASE}/scenarios/scenario-small-files-lake`,
    '/system-design/scenario-stream-join-fulfilment': `${BASE}/scenarios/scenario-stream-join-fulfilment`,
    '/system-design/scenario-telemetry-ingestion': `${BASE}/scenarios/scenario-telemetry-ingestion`,
  },
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
