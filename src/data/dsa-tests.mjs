/**
 * Runnable test cases for DSA solutions, keyed by the solution's exact
 * `problem` string (like dsa-statements.mjs). Executed by the shared harness
 * in public/runner/harness.js — in the browser (Run button) and in CI
 * (npm run check:data), where every reference approach must pass.
 *
 * An entry is one spec, or an array of specs when approaches differ (different
 * function names, variants or return shapes). Spec:
 *   fn          entry point — function or class name defined in the approach code
 *   after       optional second function applied to fn's result, e.g. decode(encode(x))
 *   approaches  optional approach indices this spec applies to (default: every
 *               approach that defines `fn`)
 *   kind        'function' (default) | 'design' — design: args = [ctorArgs, [[method, ...args], …]],
 *               expected = one result per op (undefined → null)
 *   input       per-argument conversion:
 *                 'raw' (default) | 'list' (array → ListNode chain)
 *                 'tree' (LeetCode level-order array → TreeNode)
 *                 'cycle-list' ([values, pos] — tail links to index pos, −1 = none)
 *                 'y-lists' ([aOnly, bOnly, shared] — expands into TWO arguments that share a tail)
 *                 'random-list' ([[val, randomIndex | null], …])
 *   output      conversion of the return value: 'raw' | 'list' | 'tree' | 'random-list'
 *               | 'node-val' (a node → its val, null stays null)
 *   check       'return' (default) | 'arg0' — compare the mutated first argument (in-place functions)
 *   compare     'exact' (default) | 'unordered' | 'unordered-deep' | 'float' | 'any-of'
 *               (any-of: `expected` is an array of acceptable answers)
 *   cases       [{ args: [...], expected }]
 *
 * Approaches no spec applies to are shown without a Run button.
 */

/** @typedef {{ fn: string, after?: string, approaches?: number[], kind?: string, input?: string[], output?: string, check?: string, compare?: string, cases: { args: any[], expected: any }[] }} Spec */
/** @type {Record<string, Spec | Spec[]>} */
export const tests = {
  'Contains Duplicate': {
    fn: 'containsDuplicate',
    cases: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
      { args: [[7]], expected: false },
    ],
  },
  'Reverse a linked list': {
    fn: 'reverse',
    input: ['list'],
    output: 'list',
    cases: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { args: [[1, 2]], expected: [2, 1] },
      { args: [[]], expected: [] },
    ],
  },
  'Sort an array of 0s, 1s and 2s': {
    fn: 'sort012',
    check: 'arg0',
    cases: [
      { args: [[0, 2, 1, 2, 0]], expected: [0, 0, 1, 2, 2] },
      { args: [[2, 0, 1]], expected: [0, 1, 2] },
      { args: [[1, 1, 1]], expected: [1, 1, 1] },
      { args: [[]], expected: [] },
    ],
  },
  'Group all anagrams together': {
    fn: 'groupAnagrams',
    compare: 'unordered-deep',
    cases: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
    ],
  },
  'LRU Cache': {
    fn: 'LRUCache',
    kind: 'design',
    cases: [
      {
        args: [[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]],
        expected: [null, null, 1, null, -1, null, -1, 3, 4],
      },
      {
        args: [[1], [['put', 2, 1], ['get', 2], ['put', 3, 2], ['get', 2], ['get', 3]]],
        expected: [null, 1, null, -1, 2],
      },
    ],
  },
  'Level order traversal': {
    fn: 'levelOrder',
    input: ['tree'],
    cases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] },
    ],
  },
};
