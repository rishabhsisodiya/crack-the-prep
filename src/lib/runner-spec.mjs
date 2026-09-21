/**
 * Build-time helpers for runnable solutions, shared by the solutions pages and
 * scripts/check-data.mjs. (Execution itself lives in public/runner/harness.js.)
 */

/**
 * True when `code` defines `fn` as a function, class or const/let/var — i.e.
 * the approach can be run against the problem's tests.
 * @param {string} code
 * @param {string} fn
 */
export function defines(code, fn) {
  const n = fn.replace(/[$]/g, '\\$');
  return new RegExp('\\b(function\\*?|class)\\s+' + n + '\\b|\\b(const|let|var)\\s+' + n + '\\s*=').test(code);
}

/**
 * The test spec that applies to one approach, or null. A problem's entry in
 * dsa-tests.mjs is a spec or an array of specs; a spec with `approaches`
 * applies only to those approach indices. The approach must define the spec's
 * function(s).
 * @param {object | object[] | undefined} entry
 * @param {number} index approach index
 * @param {string} code approach code
 */
export function specFor(entry, index, code) {
  if (!entry) return null;
  for (const spec of Array.isArray(entry) ? entry : [entry]) {
    if (spec.approaches && !spec.approaches.includes(index)) continue;
    if (defines(code, spec.fn) && (!spec.after || defines(code, spec.after))) return spec;
  }
  return null;
}
