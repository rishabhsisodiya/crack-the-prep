/**
 * URL-anchor slug shared by the site (re-exported from consts.ts) and Node
 * scripts (scripts/check-data.mjs). Pure — no Astro/Vite imports.
 *
 * @param {string} s
 * @returns {string}
 */
export const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/`[^`]*`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'section';
