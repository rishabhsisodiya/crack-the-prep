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
 *                 'list-array' (array of arrays → array of ListNode chains)
 *                 'dll' (array → doubly linked list of { val, prev, next })
 *                 'circular-list' (array → list whose last node points back to the head)
 *                 'graph' (LeetCode adjacency: entry i lists the neighbour values of node i + 1)
 *                 'tree-ref' (a value → that node in the preceding 'tree' argument)
 *   output      conversion of the return value: 'raw' | 'list' | 'tree' | 'random-list'
 *               | 'graph' (also fails if an original node was returned instead of a copy)
 *               | 'node-val' (a node → its val, null stays null)
 *               | 'dll' (also fails on a wrong prev link) | 'circular-list' (one lap from the head)
 *               | 'tree-dll' (a tree flattened in place: left = previous, right = next)
 *   check       'return' (default) | 'arg0' — compare the mutated first argument (in-place functions)
 *   compare     'exact' (default) | 'unordered' | 'unordered-deep' | 'float' | 'any-of'
 *               (any-of: `expected` is an array of acceptable answers)
 *   cases       [{ args: [...], expected }]
 *
 * Approaches no spec applies to are shown without a Run button.
 *
 * The reader's own code is tested against the first spec of an entry, so every
 * entry needs at least three cases, one of them an edge case. Work each
 * expected value out from the problem statement, not from the reference code.
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
      { args: [[2], [['get', 1], ['put', 1, 10], ['put', 1, 20], ['get', 1], ['put', 2, 2], ['put', 3, 3], ['get', 1], ['get', 2]]], expected: [-1, null, null, 20, null, null, -1, 2] },
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

  // ================================================================ Interview Core — Hashing
  'find all pairs on integer array whose sum is equal to given number': {
    fn: 'pairs',
    compare: 'unordered-deep',
    cases: [
      { args: [[1, 5, 7, -1, 3], 6], expected: [[1, 5], [-1, 7]] },
      { args: [[2, 4], 10], expected: [] },
      { args: [[0, 6, 2, 4], 6], expected: [[0, 6], [2, 4]] },
    ],
  },
  'Valid Anagram': {
    fn: 'isAnagram',
    cases: [
      { args: ['anagram', 'nagaram'], expected: true },
      { args: ['rat', 'car'], expected: false },
      { args: ['a', 'ab'], expected: false },
    ],
  },
  'Top K Frequent Elements': {
    fn: 'topKFrequent',
    compare: 'unordered',
    cases: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { args: [[1], 1], expected: [1] },
      { args: [[4, 4, 5, 5, 5, 6], 1], expected: [5] },
    ],
  },
  'Longest consecutive subsequence': {
    fn: 'longestConsecutive',
    cases: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { args: [[]], expected: 0 },
    ],
  },
  'Check if two strings are isomorphic': {
    fn: 'isIsomorphic',
    cases: [
      { args: ['egg', 'add'], expected: true },
      { args: ['foo', 'bar'], expected: false },
      { args: ['badc', 'baba'], expected: false },
      { args: ['paper', 'title'], expected: true },
    ],
  },
  'First Unique Character in a String': {
    fn: 'firstUniqChar',
    cases: [
      { args: ['leetcode'], expected: 0 },
      { args: ['loveleetcode'], expected: 2 },
      { args: ['aabb'], expected: -1 },
    ],
  },
  'Encode and Decode Strings': {
    fn: 'encode',
    after: 'decode',
    cases: [
      { args: [['neet', 'co#de', '']], expected: ['neet', 'co#de', ''] },
      { args: [[]], expected: [] },
      { args: [['1#2', '##', '12#']], expected: ['1#2', '##', '12#'] },
    ],
  },
  'Valid Sudoku': {
    fn: 'isValidSudoku',
    cases: [
      {
        args: [[
          ['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
          ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
          ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
          ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
          ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ]],
        expected: true,
      },
      {
        args: [[
          ['8', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
          ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
          ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
          ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
          ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ]],
        expected: false,
      },
      { args: [[['1', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '1', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.']]], expected: false },
      { args: [[['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '.', '.', '.', '.']]], expected: true },
    ],
  },

  // ================================================================ Prefix sum
  'Range Sum Query – Immutable': {
    fn: 'NumArray',
    kind: 'design',
    cases: [
      { args: [[[-2, 0, 3, -5, 2, -1]], [['sumRange', 0, 2], ['sumRange', 2, 5], ['sumRange', 0, 5]]], expected: [1, -1, -3] },
      { args: [[[1, 2, 3, 4]], [['sumRange', 1, 1], ['sumRange', 0, 3], ['sumRange', 2, 3]]], expected: [2, 10, 7] },
      { args: [[[5]], [['sumRange', 0, 0]]], expected: [5] },
    ],
  },
  'Subarray Sum Equals K': {
    fn: 'subarraySum',
    cases: [
      { args: [[1, 1, 1], 2], expected: 2 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[1, -1, 0], 0], expected: 3 },
    ],
  },
  'Product array puzzle (product of all except self)': {
    fn: 'productExceptSelf',
    cases: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expected: [3, 2] },
    ],
  },
  'Continuous Subarray Sum': {
    fn: 'checkSubarraySum',
    cases: [
      { args: [[23, 2, 4, 6, 7], 6], expected: true },
      { args: [[23, 2, 6, 4, 7], 13], expected: false },
      { args: [[23, 2, 6, 4, 7], 6], expected: true },
      { args: [[5, 0, 0], 3], expected: true },
    ],
  },
  'Contiguous Array (equal 0s and 1s)': {
    fn: 'findMaxLength',
    cases: [
      { args: [[0, 1]], expected: 2 },
      { args: [[0, 1, 0]], expected: 2 },
      { args: [[0, 0, 1, 0, 0, 0, 1, 1]], expected: 6 },
    ],
  },
  'Subarray Sums Divisible by K': {
    fn: 'subarraysDivByK',
    cases: [
      { args: [[4, 5, 0, -2, -3, 1], 5], expected: 7 },
      { args: [[5], 9], expected: 0 },
      { args: [[5, 10], 5], expected: 3 },
    ],
  },
  'Range Sum Query 2D – Immutable': {
    fn: 'NumMatrix',
    kind: 'design',
    cases: [
      {
        args: [
          [[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]],
          [['sumRegion', 2, 1, 4, 3], ['sumRegion', 1, 1, 2, 2], ['sumRegion', 1, 2, 2, 4]],
        ],
        expected: [8, 11, 12],
      },
      { args: [[[[1, 2], [3, 4]]], [['sumRegion', 0, 0, 1, 1], ['sumRegion', 0, 1, 1, 1], ['sumRegion', 1, 0, 1, 0]]], expected: [10, 6, 3] },
      { args: [[[[7]]], [['sumRegion', 0, 0, 0, 0]]], expected: [7] },
    ],
  },

  // ================================================================ Two pointers
  'Valid Palindrome': {
    fn: 'isPalindrome',
    cases: [
      { args: ['A man, a plan, a canal: Panama'], expected: true },
      { args: ['race a car'], expected: false },
      { args: [' '], expected: true },
    ],
  },
  'Two Sum II – Input Array Is Sorted': {
    fn: 'twoSum',
    cases: [
      { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { args: [[2, 3, 4], 6], expected: [1, 3] },
      { args: [[-1, 0], -1], expected: [1, 2] },
    ],
  },
  'Find a triplet that sums to a given value': {
    fn: 'findTriplet',
    cases: [
      { args: [[1, 4, 45, 6, 10, 8], 13], expected: [1, 4, 8] },
      { args: [[1, 2, 3], 10], expected: null },
      { args: [[1, 2, 3], 6], expected: [1, 2, 3] },
    ],
  },
  'Container With Most Water': {
    fn: 'maxArea',
    cases: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
    ],
  },
  'Remove Duplicates from Sorted Array': {
    fn: 'removeDuplicates',
    cases: [
      { args: [[1, 1, 2]], expected: 2 },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
      { args: [[]], expected: 0 },
    ],
  },
  'Move Zeroes': {
    fn: 'moveZeroes',
    check: 'arg0',
    cases: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2]], expected: [1, 2] },
    ],
  },
  'Trapping Rain water problem': {
    fn: 'trap',
    cases: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[2, 0, 2]], expected: 2 },
    ],
  },

  // ================================================================ Cyclic sort
  'Missing Number': {
    fn: 'missingNumber',
    cases: [
      { args: [[3, 0, 1]], expected: 2 },
      { args: [[0, 1]], expected: 2 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    ],
  },
  'Find All Numbers Disappeared in an Array': {
    fn: 'findDisappearedNumbers',
    compare: 'unordered',
    cases: [
      { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expected: [5, 6] },
      { args: [[1, 1]], expected: [2] },
      { args: [[1, 2, 3]], expected: [] },
    ],
  },
  'find duplicate in an array of N+1 Integers': {
    fn: 'findDuplicate',
    cases: [
      { args: [[1, 3, 4, 2, 2]], expected: 2 },
      { args: [[3, 1, 3, 4, 2]], expected: 3 },
      { args: [[3, 3, 3, 3, 3]], expected: 3 },
    ],
  },
  'Find All Duplicates in an Array': {
    fn: 'findDuplicates',
    compare: 'unordered',
    cases: [
      { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expected: [2, 3] },
      { args: [[1, 1, 2]], expected: [1] },
      { args: [[1]], expected: [] },
    ],
  },
  'Find the repeating and the missing number': {
    fn: 'repeatAndMissing',
    cases: [
      { args: [[3, 1, 3]], expected: { repeat: 3, missing: 2 } },
      { args: [[1, 2, 2, 4]], expected: { repeat: 2, missing: 3 } },
      { args: [[2, 2]], expected: { repeat: 2, missing: 1 } },
    ],
  },
  'First Missing Positive': {
    fn: 'firstMissingPositive',
    cases: [
      { args: [[1, 2, 0]], expected: 3 },
      { args: [[3, 4, -1, 1]], expected: 2 },
      { args: [[7, 8, 9, 11, 12]], expected: 1 },
    ],
  },

  // ================================================================ Sliding window
  'Best time to buy and Sell stock': {
    fn: 'maxProfit',
    cases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[5]], expected: 0 },
    ],
  },
  'Longest Substring Without Repeating Characters': {
    fn: 'lengthOfLongestSubstring',
    cases: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: ['abba'], expected: 2 },
    ],
  },
  'Longest Repeating Character Replacement': {
    fn: 'characterReplacement',
    cases: [
      { args: ['ABAB', 2], expected: 4 },
      { args: ['AABABBA', 1], expected: 4 },
      { args: ['A', 0], expected: 1 },
    ],
  },
  'Permutation in String': {
    fn: 'checkInclusion',
    cases: [
      { args: ['ab', 'eidbaooo'], expected: true },
      { args: ['ab', 'eidboaoo'], expected: false },
      { args: ['adc', 'dcda'], expected: true },
    ],
  },
  'Max Consecutive Ones III': {
    fn: 'longestOnes',
    cases: [
      { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6 },
      { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], expected: 10 },
      { args: [[0, 0], 0], expected: 0 },
    ],
  },
  'Fruit Into Baskets (at most k distinct)': {
    fn: 'totalFruit',
    cases: [
      { args: [[1, 2, 1]], expected: 3 },
      { args: [[0, 1, 2, 2]], expected: 3 },
      { args: [[1, 2, 3, 2, 2]], expected: 4 },
    ],
  },
  'Smallest subarray with sum greater than a given value': {
    fn: 'smallestSubWithSum',
    cases: [
      { args: [[1, 4, 45, 6, 0, 19], 51], expected: 3 },
      { args: [[1, 10, 5, 2, 7], 9], expected: 1 },
      { args: [[1, 2, 4], 8], expected: 0 },
    ],
  },
  'find the smallest window in a string containing all characters of another string': {
    fn: 'minWindow',
    cases: [
      { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { args: ['a', 'a'], expected: 'a' },
      { args: ['a', 'aa'], expected: '' },
    ],
  },

  // ================================================================ Binary search
  'Binary Search': {
    fn: 'search',
    cases: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
    ],
  },
  'Find first and last positions of an element in a sorted array': {
    fn: 'searchRange',
    cases: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { args: [[], 0], expected: [-1, -1] },
    ],
  },
  'Search in a rotated sorted array': {
    fn: 'search',
    cases: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[3, 1], 1], expected: 1 },
    ],
  },
  'Find pivot (minimum) in a rotated sorted array': {
    fn: 'findMin',
    cases: [
      { args: [[3, 4, 5, 1, 2]], expected: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { args: [[11, 13, 15, 17]], expected: 11 },
    ],
  },
  'Search an element in a matrix': [
    {
      fn: 'searchMatrix',
      approaches: [0], // rows and columns sorted independently → [row, col] | null
      cases: [
        { args: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5], expected: [1, 1] },
        { args: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20], expected: null },
        { args: [[[1]], 1], expected: [0, 0] },
      ],
    },
    {
      fn: 'searchMatrix',
      approaches: [1], // fully sorted in row-major order → boolean
      cases: [
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
        { args: [[[1]], 2], expected: false },
      ],
    },
  ],
  'Find Peak Element': {
    fn: 'findPeakElement',
    compare: 'any-of',
    cases: [
      { args: [[1, 2, 3, 1]], expected: [2] },
      { args: [[1, 2, 1, 3, 5, 6, 4]], expected: [1, 5] },
      { args: [[1]], expected: [0] },
    ],
  },
  'Time Based Key-Value Store': {
    fn: 'TimeMap',
    kind: 'design',
    cases: [
      {
        args: [[], [['set', 'foo', 'bar', 1], ['get', 'foo', 1], ['get', 'foo', 3], ['set', 'foo', 'bar2', 4], ['get', 'foo', 4], ['get', 'foo', 5], ['get', 'foo', 0], ['get', 'nope', 1]]],
        expected: [null, 'bar', 'bar', null, 'bar2', 'bar2', '', ''],
      },
      { args: [[], [['set', 'k', 'v1', 1], ['set', 'k', 'v2', 2], ['get', 'k', 1], ['get', 'k', 2], ['get', 'k', 10]]], expected: [null, null, 'v1', 'v2', 'v2'] },
      { args: [[], [['get', 'a', 1], ['set', 'a', 'x', 5], ['get', 'a', 4], ['get', 'a', 5]]], expected: ['', null, '', 'x'] },
    ],
  },
  'Median of two sorted arrays': {
    fn: 'findMedianSortedArrays',
    compare: 'float',
    cases: [
      { args: [[1, 3], [2]], expected: 2 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[], [1]], expected: 1 },
    ],
  },

  // ================================================================ Binary search on the answer
  'Koko Eating Bananas': {
    fn: 'minEatingSpeed',
    cases: [
      { args: [[3, 6, 7, 11], 8], expected: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
      { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
    ],
  },
  'Capacity To Ship Packages Within D Days': {
    fn: 'shipWithinDays',
    cases: [
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], expected: 15 },
      { args: [[3, 2, 2, 4, 1, 4], 3], expected: 6 },
      { args: [[1, 2, 3, 1, 1], 4], expected: 3 },
    ],
  },
  'Binary search on the answer — Aggressive Cows, Book Allocation, Painter’s Partition, EKO, ROTI-Prata': [
    {
      fn: 'aggressiveCows',
      cases: [
        { args: [[1, 2, 4, 8, 9], 3], expected: 3 },
        { args: [[10, 1, 2, 7, 5], 3], expected: 4 },
        { args: [[1, 2], 2], expected: 1 },
      ],
    },
    {
      fn: 'allocateBooks',
      cases: [
        { args: [[12, 34, 67, 90], 2], expected: 113 },
        { args: [[10, 20, 30, 40], 2], expected: 60 },
        { args: [[5, 5, 5], 3], expected: 5 },
      ],
    },
  ],
  'Minimum Number of Days to Make m Bouquets': {
    fn: 'minDays',
    cases: [
      { args: [[1, 10, 3, 10, 2], 3, 1], expected: 3 },
      { args: [[1, 10, 3, 10, 2], 3, 2], expected: -1 },
      { args: [[7, 7, 7, 7, 12, 7, 7], 2, 3], expected: 12 },
    ],
  },

  // ================================================================ Stack
  'Balanced Parenthesis problem': {
    fn: 'isValid',
    cases: [
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: ['('], expected: false },
    ],
  },
  'Design a stack that supports getMin in O(1)': {
    fn: 'MinStack',
    kind: 'design',
    cases: [
      {
        args: [[], [['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]],
        expected: [null, null, null, -3, null, 0, -2],
      },
      { args: [[], [['push', 5], ['push', 3], ['push', 7], ['getMin'], ['pop'], ['pop'], ['getMin']]], expected: [null, null, null, 3, null, null, 5] },
      { args: [[], [['push', 1], ['push', 1], ['pop'], ['getMin'], ['top']]], expected: [null, null, null, 1, 1] },
    ],
  },
  'Evaluate a postfix expression': {
    fn: 'evalPostfix',
    cases: [
      { args: [['2', '1', '+', '3', '*']], expected: 9 },
      { args: [['4', '13', '5', '/', '+']], expected: 6 },
      { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
    ],
  },
  'Daily Temperatures': {
    fn: 'dailyTemperatures',
    cases: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { args: [[50]], expected: [0] },
    ],
  },
  'Next Greater Element II': {
    fn: 'nextGreaterElements',
    cases: [
      { args: [[1, 2, 1]], expected: [2, -1, 2] },
      { args: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4] },
      { args: [[5, 5]], expected: [-1, -1] },
    ],
  },
  'Decode String': {
    fn: 'decodeString',
    cases: [
      { args: ['3[a]2[bc]'], expected: 'aaabcbc' },
      { args: ['3[a2[c]]'], expected: 'accaccacc' },
      { args: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef' },
      { args: ['10[a]'], expected: 'aaaaaaaaaa' },
    ],
  },
  'Asteroid Collision': {
    fn: 'asteroidCollision',
    cases: [
      { args: [[5, 10, -5]], expected: [5, 10] },
      { args: [[8, -8]], expected: [] },
      { args: [[10, 2, -5]], expected: [10] },
      { args: [[-2, -1, 1, 2]], expected: [-2, -1, 1, 2] },
    ],
  },
  'Online Stock Span': {
    fn: 'StockSpanner',
    kind: 'design',
    cases: [
      {
        args: [[], [['next', 100], ['next', 80], ['next', 60], ['next', 70], ['next', 60], ['next', 75], ['next', 85]]],
        expected: [1, 1, 1, 2, 1, 4, 6],
      },
      { args: [[], [['next', 10], ['next', 10], ['next', 10]]], expected: [1, 2, 3] },
      { args: [[], [['next', 3], ['next', 2], ['next', 1]]], expected: [1, 1, 1] },
    ],
  },
  'Largest rectangular area in a histogram': {
    fn: 'largestRectangleArea',
    cases: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { args: [[2, 4]], expected: 4 },
      { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 },
    ],
  },
  'Evaluate an infix arithmetic expression': {
    fn: 'evalInfix',
    cases: [
      { args: ['3+2*2'], expected: 7 },
      { args: [' 3/2 '], expected: 1 },
      { args: ['(1+(4+5+2)-3)+(6+8)'], expected: 23 },
      { args: ['2*(5+5*2)/3+(6/2+8)'], expected: 21 },
    ],
  },

  // ================================================================ Monotonic deque
  'Maximum of all subarrays of size k (sliding window maximum)': {
    fn: 'maxSlidingWindow',
    cases: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
    ],
  },
  'First negative integer in every window of size k': {
    fn: 'firstNegativeEachWindow',
    cases: [
      { args: [[-8, 2, 3, -6, 10], 2], expected: [-8, 0, -6, -6] },
      { args: [[12, -1, -7, 8, -15, 30, 16, 28], 3], expected: [-1, -1, -7, -15, -15, 0] },
      { args: [[1, 2, 3], 1], expected: [0, 0, 0] },
    ],
  },
  'Shortest Subarray with Sum at Least K': {
    fn: 'shortestSubarray',
    cases: [
      { args: [[1], 1], expected: 1 },
      { args: [[1, 2], 4], expected: -1 },
      { args: [[2, -1, 2], 3], expected: 3 },
      { args: [[84, -37, 32, 40, 95], 167], expected: 3 },
    ],
  },

  // ================================================================ Linked list
  'Merge 2 sorted Linked Lists': {
    fn: 'mergeTwoLists',
    input: ['list', 'list'],
    output: 'list',
    cases: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { args: [[], []], expected: [] },
      { args: [[], [0]], expected: [0] },
    ],
  },
  'Detect Loop in linked list': {
    fn: 'hasCycle',
    input: ['cycle-list'],
    cases: [
      { args: [[[3, 2, 0, -4], 1]], expected: true },
      { args: [[[1, 2], 0]], expected: true },
      { args: [[[1], -1]], expected: false },
      { args: [[[], -1]], expected: false },
    ],
  },
  'Delete the loop in a linked list': {
    fn: 'detectAndRemoveLoop',
    input: ['cycle-list'],
    output: 'list',
    cases: [
      { args: [[[1, 3, 4], 1]], expected: [1, 3, 4] },
      { args: [[[1, 2, 3, 4], 0]], expected: [1, 2, 3, 4] },
      { args: [[[1, 2], -1]], expected: [1, 2] },
    ],
  },
  'Find the middle element of a linked list': {
    fn: 'middleNode',
    input: ['list'],
    output: 'list',
    cases: [
      { args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
      { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
      { args: [[1]], expected: [1] },
    ],
  },
  'Remove Nth node from end of Linked List': {
    fn: 'removeNthFromEnd',
    input: ['list'],
    output: 'list',
    cases: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { args: [[1], 1], expected: [] },
      { args: [[1, 2], 1], expected: [1] },
      { args: [[1, 2], 2], expected: [2] },
    ],
  },
  'Check whether a singly linked list is a palindrome': {
    fn: 'isPalindrome',
    input: ['list'],
    cases: [
      { args: [[1, 2, 2, 1]], expected: true },
      { args: [[1, 2]], expected: false },
      { args: [[1, 2, 3, 2, 1]], expected: true },
    ],
  },
  'Reorder List': {
    fn: 'reorderList',
    input: ['list'],
    check: 'arg0',
    cases: [
      { args: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
      { args: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
      { args: [[1, 2]], expected: [1, 2] },
    ],
  },
  'Add two numbers represented by linked lists': {
    fn: 'addTwoNumbers',
    input: ['list', 'list'],
    output: 'list',
    cases: [
      { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
      { args: [[0], [0]], expected: [0] },
      { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
    ],
  },
  'Intersection point of two linked lists (shared node)': {
    fn: 'getIntersectionNode',
    input: ['y-lists'],
    output: 'node-val',
    cases: [
      { args: [[[4, 1], [5, 6, 1], [8, 4, 5]]], expected: 8 },
      { args: [[[1, 9, 1], [3], [2, 4]]], expected: 2 },
      { args: [[[2, 6, 4], [1, 5], []]], expected: null },
    ],
  },
  'Clone a linked list with next and random pointers': {
    fn: 'copyRandomList',
    input: ['random-list'],
    output: 'random-list',
    cases: [
      { args: [[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]], expected: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] },
      { args: [[[1, 1], [2, 1]]], expected: [[1, 1], [2, 1]] },
      { args: [[]], expected: [] },
    ],
  },
  'Reverse a linked list in groups of size k': {
    fn: 'reverseKGroup',
    input: ['list'],
    output: 'list',
    cases: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
      { args: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
      { args: [[1, 2, 3, 4, 5, 6], 3], expected: [3, 2, 1, 6, 5, 4] },
    ],
  },

  // ================================================================ Trees
  'Height, balance check, and mirror of a tree': [
    {
      fn: 'isBalanced',
      approaches: [0],
      input: ['tree'],
      cases: [
        { args: [[3, 9, 20, null, null, 15, 7]], expected: true },
        { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
        { args: [[]], expected: true },
      ],
    },
    {
      fn: 'mirror',
      approaches: [1],
      input: ['tree'],
      output: 'tree',
      cases: [
        { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
        { args: [[2, 1, 3]], expected: [2, 3, 1] },
        { args: [[]], expected: [] },
      ],
    },
  ],
  'Same Tree': {
    fn: 'isSameTree',
    input: ['tree', 'tree'],
    cases: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true },
      { args: [[1, 2], [1, null, 2]], expected: false },
      { args: [[1, 2, 1], [1, 1, 2]], expected: false },
      { args: [[], []], expected: true },
    ],
  },
  'Diameter of a Binary Tree': {
    fn: 'diameterOfBinaryTree',
    input: ['tree'],
    cases: [
      { args: [[1, 2, 3, 4, 5]], expected: 3 },
      { args: [[1, 2]], expected: 1 },
      { args: [[1]], expected: 0 },
    ],
  },
  'Tree views — left, right, top, bottom, diagonal, boundary': [
    {
      fn: 'rightView',
      approaches: [0],
      input: ['tree'],
      cases: [
        { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] },
        { args: [[1, null, 3]], expected: [1, 3] },
        { args: [[]], expected: [] },
      ],
    },
    {
      fn: 'bottomView',
      approaches: [1],
      input: ['tree'],
      cases: [
        { args: [[20, 8, 22, 5, 3, null, 25, null, null, 10, 14]], expected: [5, 10, 3, 14, 25] },
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [4, 2, 6, 3, 7] },
        { args: [[1]], expected: [1] },
      ],
    },
    {
      fn: 'diagonal',
      approaches: [2],
      input: ['tree'],
      cases: [{ args: [[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13]], expected: [8, 10, 14, 3, 6, 7, 13, 1, 4] }, { args: [[1, 2, 3]], expected: [1, 3, 2] }, { args: [[1]], expected: [1] }],
    },
  ],
  'All tree traversals — inorder, preorder, postorder (recursive & iterative), level order, zig-zag': [
    {
      fn: 'inorder',
      approaches: [0],
      input: ['tree'],
      cases: [
        { args: [[1, null, 2, 3]], expected: [1, 3, 2] },
        { args: [[1, 2, 3, 4, 5]], expected: [4, 2, 5, 1, 3] },
        { args: [[]], expected: [] },
      ],
    },
    {
      fn: 'inorderIter',
      approaches: [1],
      input: ['tree'],
      cases: [
        { args: [[1, null, 2, 3]], expected: [1, 3, 2] },
        { args: [[1, 2, 3, 4, 5]], expected: [4, 2, 5, 1, 3] },
        { args: [[]], expected: [] },
      ],
    },
    {
      fn: 'zigzag',
      approaches: [2],
      input: ['tree'],
      cases: [
        { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [20, 9], [15, 7]] },
        { args: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [3, 2], [4, 5]] },
        { args: [[1]], expected: [[1]] },
      ],
    },
  ],
  'Find the Lowest Common Ancestor in a Binary Tree': [
    {
      fn: 'lca',
      input: ['tree', 'tree-ref', 'tree-ref'],
      output: 'node-val',
      cases: [
        { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 },
        { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5 },
        { args: [[1, 2], 1, 2], expected: 1 },
      ],
    },
    {
      fn: 'lcaBST',
      input: ['tree', 'tree-ref', 'tree-ref'],
      output: 'node-val',
      cases: [
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expected: 4 },
      ],
    },
  ],
  'Path Sum II': {
    fn: 'pathSum',
    input: ['tree'],
    compare: 'unordered',
    cases: [
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22], expected: [[5, 4, 11, 2], [5, 8, 4, 5]] },
      { args: [[1, 2, 3], 5], expected: [] },
      { args: [[1], 1], expected: [[1]] },
    ],
  },
  'Path sums — longest root-to-leaf sum, largest subtree sum, max non-adjacent sum, K-sum paths': [
    {
      fn: 'longestPathSum',
      input: ['tree'],
      cases: [
        { args: [[4, 2, 5, 7, 1, 2, 3, null, null, 6]], expected: 13 },
        { args: [[1]], expected: 1 },
        { args: [[1, 2, 3]], expected: 4 },
      ],
    },
    {
      fn: 'largestSubtreeSum',
      input: ['tree'],
      cases: [
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 28 },
        { args: [[1, -2, 3, 4, 5, -6, 2]], expected: 7 },
        { args: [[-5]], expected: -5 },
      ],
    },
    {
      fn: 'maxNonAdjacent',
      input: ['tree'],
      cases: [
        { args: [[3, 2, 3, null, 3, null, 1]], expected: 7 },
        { args: [[3, 4, 5, 1, 3, null, 1]], expected: 9 },
        { args: [[5]], expected: 5 },
      ],
    },
    {
      fn: 'kSumPaths',
      input: ['tree'],
      compare: 'unordered',
      cases: [{ args: [[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8], expected: [[5, 3], [5, 2, 1], [-3, 11]] }, { args: [[1, 2, 3], 7], expected: [] }, { args: [[1], 1], expected: [[1]] }],
    },
  ],
  'Construct a binary tree from inorder + preorder': {
    fn: 'buildTree',
    output: 'tree',
    cases: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
      { args: [[-1], [-1]], expected: [-1] },
      { args: [[1, 2, 3], [2, 1, 3]], expected: [1, 2, 3] },
    ],
  },
  'Count Good Nodes in Binary Tree': {
    fn: 'goodNodes',
    input: ['tree'],
    cases: [
      { args: [[3, 1, 4, 3, null, 1, 5]], expected: 4 },
      { args: [[3, 3, null, 4, 2]], expected: 3 },
      { args: [[1]], expected: 1 },
    ],
  },
  'Binary Tree Maximum Path Sum': {
    fn: 'maxPathSum',
    input: ['tree'],
    cases: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
      { args: [[-3]], expected: -3 },
    ],
  },
  'Serialize and Deserialize Binary Tree': {
    fn: 'serialize',
    after: 'deserialize',
    input: ['tree'],
    output: 'tree',
    cases: [
      { args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[-1, 0, 1]], expected: [-1, 0, 1] },
    ],
  },

  // ================================================================ Binary search trees
  'Check whether a binary tree is a BST or not': {
    fn: 'isValidBST',
    input: ['tree'],
    cases: [
      { args: [[2, 1, 3]], expected: true },
      { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
      { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
      { args: [[2, 2, 2]], expected: false },
    ],
  },
  'Kth smallest / Kth largest element in a BST': {
    fn: 'kthSmallest',
    input: ['tree'],
    cases: [
      { args: [[3, 1, 4, null, 2], 1], expected: 1 },
      { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      { args: [[2, 1, 3], 3], expected: 3 },
    ],
  },
  'Lowest Common Ancestor of a BST': {
    fn: 'lowestCommonAncestor',
    input: ['tree', 'tree-ref', 'tree-ref'],
    output: 'node-val',
    cases: [
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
      { args: [[2, 1], 2, 1], expected: 2 },
    ],
  },
  'Delete a node from a BST': {
    fn: 'deleteNode',
    input: ['tree'],
    output: 'tree',
    compare: 'any-of',
    cases: [
      { args: [[5, 3, 6, 2, 4, null, 7], 3], expected: [[5, 4, 6, 2, null, null, 7], [5, 2, 6, null, 4, null, 7]] },
      { args: [[5, 3, 6, 2, 4, null, 7], 0], expected: [[5, 3, 6, 2, 4, null, 7]] },
      { args: [[], 0], expected: [[]] },
    ],
  },
  'Convert Sorted Array to BST': {
    fn: 'sortedArrayToBST',
    output: 'tree',
    compare: 'any-of',
    cases: [
      { args: [[-10, -3, 0, 5, 9]], expected: [[0, -10, 5, null, -3, null, 9], [0, -3, 9, -10, null, 5]] },
      { args: [[1, 3]], expected: [[1, null, 3], [3, 1]] },
      { args: [[1]], expected: [[1]] },
    ],
  },

  // ================================================================ Heap
  'Kth largest element in an array': {
    fn: 'findKthLargest',
    cases: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
    ],
  },
  'K Closest Points to Origin': {
    fn: 'kClosest',
    compare: 'unordered',
    cases: [
      { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]] },
      { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]] },
      { args: [[[0, 1], [1, 0]], 2], expected: [[0, 1], [1, 0]] },
    ],
  },
  'Last Stone Weight': {
    fn: 'lastStoneWeight',
    cases: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1 },
      { args: [[1]], expected: 1 },
      { args: [[2, 2]], expected: 0 },
    ],
  },
  'Task Scheduler': {
    fn: 'leastInterval',
    cases: [
      { args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8 },
      { args: [['A', 'A', 'A', 'B', 'B', 'B'], 0], expected: 6 },
      { args: [['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2], expected: 16 },
    ],
  },
  'Rearrange a string so no two adjacent characters are the same': {
    fn: 'reorganize',
    compare: 'any-of',
    cases: [
      { args: ['aab'], expected: ['aba'] },
      { args: ['aaab'], expected: [''] },
      { args: ['aaabb'], expected: ['ababa'] },
    ],
  },
  'Merge K sorted linked lists': {
    fn: 'mergeKLists',
    input: ['list-array'],
    output: 'list',
    cases: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expected: [] },
      { args: [[[]]], expected: [] },
    ],
  },
  'Kth smallest element in a row- and column-sorted matrix': {
    fn: 'kthSmallest',
    cases: [
      { args: [[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8], expected: 13 },
      { args: [[[-5]], 1], expected: -5 },
      { args: [[[1, 2], [1, 3]], 2], expected: 1 },
    ],
  },
  'Median in a stream of integers': {
    fn: 'MedianFinder',
    kind: 'design',
    cases: [
      { args: [[], [['addNum', 1], ['addNum', 2], ['findMedian'], ['addNum', 3], ['findMedian']]], expected: [null, null, 1.5, null, 2] },
      { args: [[], [['addNum', 5], ['findMedian'], ['addNum', 15], ['findMedian'], ['addNum', 1], ['findMedian'], ['addNum', 3], ['findMedian']]], expected: [null, 5, null, 10, null, 5, null, 4] },
      { args: [[], [['addNum', 2], ['addNum', 2], ['findMedian']]], expected: [null, null, 2] },
    ],
  },
  'Smallest range covering elements from K lists': {
    fn: 'smallestRange',
    cases: [
      { args: [[[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]], expected: [20, 24] },
      { args: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]], expected: [1, 1] },
      { args: [[[1], [2], [3]]], expected: [1, 3] },
    ],
  },

  // ================================================================ Graphs
  'Number of islands': {
    fn: 'numIslands',
    cases: [
      { args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
      { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 },
      { args: [[['0']]], expected: 0 },
    ],
  },
  'Flood fill': {
    fn: 'floodFill',
    cases: [
      { args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expected: [[0, 0, 0], [0, 0, 0]] },
      { args: [[[1]], 0, 0, 5], expected: [[5]] },
    ],
  },
  'Max Area of Island': {
    fn: 'maxAreaOfIsland',
    cases: [
      { args: [[[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [1, 1, 0, 0, 0]]], expected: 5 },
      { args: [[[0, 0, 0]]], expected: 0 },
      { args: [[[1, 1], [1, 1]]], expected: 4 },
    ],
  },
  'Clone a graph': {
    fn: 'cloneGraph',
    input: ['graph'],
    output: 'graph',
    cases: [
      { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
      { args: [[[]]], expected: [[]] },
      { args: [[]], expected: [] },
    ],
  },
  'Rotten oranges (minimum time to rot all)': {
    fn: 'orangesRotting',
    cases: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
      { args: [[[0, 2]]], expected: 0 },
    ],
  },
  'Pacific Atlantic Water Flow': {
    fn: 'pacificAtlantic',
    compare: 'unordered',
    cases: [
      {
        args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]],
        expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
      },
      { args: [[[1]]], expected: [[0, 0]] },
      { args: [[[1, 1], [1, 1]]], expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    ],
  },
  'Surrounded Regions': {
    fn: 'solve',
    check: 'arg0',
    cases: [
      {
        args: [[['X', 'X', 'X', 'X'], ['X', 'O', 'O', 'X'], ['X', 'X', 'O', 'X'], ['X', 'O', 'X', 'X']]],
        expected: [['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'O', 'X', 'X']],
      },
      { args: [[['X']]], expected: [['X']] },
      { args: [[['O', 'O'], ['O', 'O']]], expected: [['O', 'O'], ['O', 'O']] },
    ],
  },
  'Distance of the nearest 1 in a binary matrix': {
    fn: 'nearestOne',
    cases: [
      { args: [[[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1]]], expected: [[1, 0, 0, 1], [0, 0, 1, 1], [1, 1, 0, 0]] },
      { args: [[[1, 0, 0], [0, 0, 0]]], expected: [[0, 1, 2], [1, 2, 3]] },
      { args: [[[1]]], expected: [[0]] },
    ],
  },
  'Check whether a graph is bipartite / the Two-Clique problem': {
    fn: 'isBipartite',
    cases: [
      { args: [[[1, 3], [0, 2], [1, 3], [0, 2]]], expected: true },
      { args: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]], expected: false },
      { args: [[[]]], expected: true },
    ],
  },
  'Word Ladder (shortest transformation sequence)': {
    fn: 'ladderLength',
    cases: [
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
      { args: ['a', 'c', ['a', 'b', 'c']], expected: 2 },
    ],
  },

  // ================================================================ Topological sort
  'Topological sort of a DAG': {
    fn: 'topoSort',
    compare: 'any-of',
    cases: [
      { args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], expected: [[0, 1, 2, 3], [0, 2, 1, 3]] },
      { args: [2, [[0, 1], [1, 0]]], expected: [null, []] },
      { args: [1, []], expected: [[0]] },
    ],
  },
  'Alien dictionary — order of letters': {
    fn: 'alienOrder',
    cases: [
      { args: [['wrt', 'wrf', 'er', 'ett', 'rftt']], expected: 'wertf' },
      { args: [['z', 'x']], expected: 'zx' },
      { args: [['z', 'x', 'z']], expected: '' },
      { args: [['abc', 'ab']], expected: '' },
    ],
  },
  'Minimum Height Trees': {
    fn: 'findMinHeightTrees',
    compare: 'unordered',
    cases: [
      { args: [4, [[1, 0], [1, 2], [1, 3]]], expected: [1] },
      { args: [6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]], expected: [3, 4] },
      { args: [1, []], expected: [0] },
    ],
  },

  // ================================================================ Union-Find
  'Number of Connected Components in an Undirected Graph': {
    fn: 'countComponents',
    cases: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
      { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
      { args: [3, []], expected: 3 },
    ],
  },
  'Making wired connections / redundant connection (components)': {
    fn: 'makeConnected',
    cases: [
      { args: [4, [[0, 1], [0, 2], [1, 2]]], expected: 1 },
      { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]], expected: 2 },
      { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2]]], expected: -1 },
    ],
  },
  'Graph Valid Tree': {
    fn: 'validTree',
    cases: [
      { args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true },
      { args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expected: false },
      { args: [4, [[0, 1], [2, 3]]], expected: false },
    ],
  },
  'Accounts Merge': {
    fn: 'accountsMerge',
    compare: 'unordered',
    cases: [
      {
        args: [[
          ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
          ['John', 'johnsmith@mail.com', 'john00@mail.com'],
          ['Mary', 'mary@mail.com'],
          ['John', 'johnnybravo@mail.com'],
        ]],
        expected: [
          ['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com'],
          ['Mary', 'mary@mail.com'],
          ['John', 'johnnybravo@mail.com'],
        ],
      },
      { args: [[['A', 'a@x.com', 'b@x.com'], ['B', 'c@x.com'], ['A', 'b@x.com', 'd@x.com']]], expected: [['A', 'a@x.com', 'b@x.com', 'd@x.com'], ['B', 'c@x.com']] },
      { args: [[['A', 'a@x.com']]], expected: [['A', 'a@x.com']] },
    ],
  },
  'Number of Provinces': {
    fn: 'findCircleNum',
    cases: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 },
      { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3 },
      { args: [[[1]]], expected: 1 },
    ],
  },

  // ================================================================ Shortest paths / MST
  "Dijkstra's shortest paths": {
    fn: 'dijkstra',
    cases: [
      { args: [[[[1, 4], [2, 1]], [[3, 1]], [[1, 2], [3, 5]], []], 0], expected: [0, 3, 1, 4] },
      { args: [[[[1, 7]], [[0, 7]]], 1], expected: [7, 0] },
      { args: [[[]], 0], expected: [0] },
    ],
  },
  'Cheapest flights within K stops': {
    fn: 'findCheapestPrice',
    cases: [
      { args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1], expected: 700 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], expected: 200 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], expected: 500 },
      { args: [3, [[0, 1, 100]], 0, 2, 1], expected: -1 },
    ],
  },
  'Path With Minimum Effort': {
    fn: 'minimumEffortPath',
    cases: [
      { args: [[[1, 2, 2], [3, 8, 2], [5, 3, 5]]], expected: 2 },
      { args: [[[1, 2, 3], [3, 8, 4], [5, 3, 5]]], expected: 1 },
      { args: [[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]], expected: 0 },
    ],
  },
  'Minimum spanning tree — Kruskal and Prim': [
    {
      fn: 'kruskal',
      cases: [
        { args: [4, [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]], expected: 19 },
        { args: [3, [[0, 1, 1]]], expected: -1 },
        { args: [1, []], expected: 0 },
      ],
    },
    {
      fn: 'prim',
      cases: [
        { args: [[[[1, 10], [2, 6], [3, 5]], [[0, 10], [3, 15]], [[0, 6], [3, 4]], [[0, 5], [1, 15], [2, 4]]]], expected: 19 },
        { args: [[[[1, 3]], [[0, 3]]]], expected: 3 },
        { args: [[[]]], expected: 0 },
      ],
    },
  ],

  // ================================================================ Trie
  'Construct a trie (insert / search / startsWith)': {
    fn: 'Trie',
    kind: 'design',
    cases: [
      {
        args: [[], [['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app'], ['insert', 'app'], ['search', 'app']]],
        expected: [null, true, false, true, null, true],
      },
      { args: [[], [['insert', 'car'], ['insert', 'card'], ['search', 'car'], ['search', 'ca'], ['startsWith', 'card'], ['startsWith', 'cards']]], expected: [null, null, true, false, true, false] },
      { args: [[], [['search', 'a'], ['startsWith', 'a'], ['insert', 'a'], ['search', 'a'], ['startsWith', 'a']]], expected: [false, false, null, true, true] },
    ],
  },
  'Design Add and Search Words Data Structure': {
    fn: 'WordDictionary',
    kind: 'design',
    cases: [
      {
        args: [[], [['addWord', 'bad'], ['addWord', 'dad'], ['addWord', 'mad'], ['search', 'pad'], ['search', 'bad'], ['search', '.ad'], ['search', 'b..'], ['search', 'b...']]],
        expected: [null, null, null, false, true, true, true, false],
      },
      { args: [[], [['addWord', 'at'], ['addWord', 'an'], ['search', 'a.'], ['search', '.t'], ['search', '...']]], expected: [null, null, true, true, false] },
      { args: [[], [['search', 'a'], ['addWord', 'a'], ['search', '.'], ['search', '..']]], expected: [false, null, true, false] },
    ],
  },
  'Word Search II': {
    fn: 'findWords',
    compare: 'unordered',
    cases: [
      {
        args: [[['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']], ['oath', 'pea', 'eat', 'rain']],
        expected: ['eat', 'oath'],
      },
      { args: [[['a', 'b'], ['c', 'd']], ['abcb']], expected: [] },
      { args: [[['a']], ['a', 'b']], expected: ['a'] },
    ],
  },
  'Longest Word in Dictionary': {
    fn: 'longestWord',
    cases: [
      { args: [['w', 'wo', 'wor', 'worl', 'world']], expected: 'world' },
      { args: [['a', 'banana', 'app', 'appl', 'ap', 'apply', 'apple']], expected: 'apple' },
      { args: [['b', 'a']], expected: 'a' },
    ],
  },

  // ================================================================ Backtracking
  'Print all Subsequences of a string': {
    fn: 'subsets',
    compare: 'unordered',
    cases: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [['a', 'b']], expected: [[], ['a'], ['b'], ['a', 'b']] },
      { args: [[]], expected: [[]] },
    ],
  },
  'Subsets II': {
    fn: 'subsetsWithDup',
    compare: 'unordered',
    cases: [
      { args: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] },
      { args: [[0]], expected: [[], [0]] },
      { args: [[2, 2]], expected: [[], [2], [2, 2]] },
    ],
  },
  'Print all the permutations of the given string': {
    fn: 'permutations',
    compare: 'unordered',
    cases: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [['a', 'b']], expected: [['a', 'b'], ['b', 'a']] },
      { args: [[1]], expected: [[1]] },
    ],
  },
  'Combination Sum': {
    fn: 'combinationSum',
    compare: 'unordered-deep',
    cases: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expected: [] },
    ],
  },
  'Combination Sum II': {
    fn: 'combinationSum2',
    compare: 'unordered-deep',
    cases: [
      { args: [[10, 1, 2, 7, 6, 1, 5], 8], expected: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]] },
      { args: [[2, 5, 2, 1, 2], 5], expected: [[1, 2, 2], [5]] },
      { args: [[1], 2], expected: [] },
    ],
  },
  'Letter Combinations of a Phone Number': {
    fn: 'letterCombinations',
    compare: 'unordered',
    cases: [
      { args: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { args: [''], expected: [] },
      { args: ['2'], expected: ['a', 'b', 'c'] },
    ],
  },
  'Generate Parentheses': {
    fn: 'generateParenthesis',
    compare: 'unordered',
    cases: [
      { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { args: [1], expected: ['()'] },
      { args: [2], expected: ['(())', '()()'] },
    ],
  },
  'Word Search': {
    fn: 'exist',
    cases: [
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expected: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expected: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expected: false },
    ],
  },
  'Print all palindromic partitions of a string': {
    fn: 'partitionPalindromes',
    compare: 'unordered',
    cases: [
      { args: ['aab'], expected: [['a', 'a', 'b'], ['aa', 'b']] },
      { args: ['a'], expected: [['a']] },
      { args: ['aba'], expected: [['a', 'b', 'a'], ['aba']] },
    ],
  },
  'N-Queens — all solutions': {
    fn: 'solveNQueens',
    compare: 'unordered',
    cases: [
      { args: [4], expected: [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']] },
      { args: [1], expected: [['Q']] },
      { args: [3], expected: [] },
    ],
  },
  'Sudoku solver': {
    fn: 'solveSudoku',
    check: 'arg0',
    cases: [
      {
        args: [[
          ['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
          ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
          ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
          ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
          ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ]],
        expected: [
          ['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'],
          ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'],
          ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
          ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'],
          ['3', '4', '5', '2', '8', '6', '1', '7', '9'],
        ],
      },
      { args: [[['.', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '.', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '.']]], expected: [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']] },
      { args: [[['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['.', '.', '.', '.', '.', '.', '.', '.', '.'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']]], expected: [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']] },
    ],
  },

  // ================================================================ 1-D dynamic programming
  'Climbing Stairs': {
    fn: 'climbStairs',
    cases: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [5], expected: 8 },
    ],
  },
  'Maximum sum such that no two elements are adjacent (House Robber)': {
    fn: 'maxNonAdjacentSum',
    cases: [
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[5]], expected: 5 },
    ],
  },
  'House Robber II': {
    fn: 'rob',
    cases: [
      { args: [[2, 3, 2]], expected: 3 },
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[1, 2, 3]], expected: 3 },
      { args: [[5]], expected: 5 },
    ],
  },
  'Coin Change Problem': [
    {
      fn: 'coinChange',
      cases: [
        { args: [[1, 2, 5], 11], expected: 3 },
        { args: [[2], 3], expected: -1 },
        { args: [[1], 0], expected: 0 },
      ],
    },
    {
      fn: 'changeWays',
      cases: [
        { args: [[1, 2, 5], 5], expected: 4 },
        { args: [[2], 3], expected: 0 },
        { args: [[1], 0], expected: 1 },
      ],
    },
  ],
  'Coin Change II': {
    fn: 'change',
    cases: [
      { args: [5, [1, 2, 5]], expected: 4 },
      { args: [3, [2]], expected: 0 },
      { args: [10, [10]], expected: 1 },
    ],
  },
  'Decode Ways': {
    fn: 'numDecodings',
    cases: [
      { args: ['12'], expected: 2 },
      { args: ['226'], expected: 3 },
      { args: ['06'], expected: 0 },
      { args: ['10'], expected: 1 },
    ],
  },
  'Word Break': {
    fn: 'wordBreak',
    cases: [
      { args: ['leetcode', ['leet', 'code']], expected: true },
      { args: ['applepenapple', ['apple', 'pen']], expected: true },
      { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
    ],
  },
  'Longest Increasing Subsequence': {
    fn: 'lengthOfLIS',
    cases: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { args: [[7, 7, 7, 7]], expected: 1 },
    ],
  },
  'find maximum product subarray': {
    fn: 'maxProduct',
    cases: [
      { args: [[2, 3, -2, 4]], expected: 6 },
      { args: [[-2, 0, -1]], expected: 0 },
      { args: [[-2, 3, -4]], expected: 24 },
    ],
  },
  'Knapsack family — 0/1 partition, unbounded, min cost to fill a bag, min removals for range': [
    {
      fn: 'canPartition',
      cases: [
        { args: [[1, 5, 11, 5]], expected: true },
        { args: [[1, 2, 3, 5]], expected: false },
        { args: [[2, 2]], expected: true },
      ],
    },
    {
      fn: 'unboundedKnapsack',
      cases: [
        { args: [[1, 3, 4, 5], [10, 40, 50, 70], 8], expected: 110 },
        { args: [[5], [10], 4], expected: 0 },
        { args: [[2], [3], 7], expected: 9 },
      ],
    },
  ],
  'Best Time to Buy and Sell Stock with Cooldown': {
    fn: 'maxProfit',
    cases: [
      { args: [[1, 2, 3, 0, 2]], expected: 3 },
      { args: [[1]], expected: 0 },
      { args: [[1, 2, 4]], expected: 3 },
    ],
  },

  // ================================================================ 2-D dynamic programming
  'Unique Paths': {
    fn: 'uniquePaths',
    cases: [
      { args: [3, 7], expected: 28 },
      { args: [3, 2], expected: 3 },
      { args: [1, 1], expected: 1 },
    ],
  },
  'Grid path DP — Gold Mine, Min Cost Path, max square submatrix of 1s, maximum sum rectangle': [
    {
      fn: 'goldMine',
      cases: [
        { args: [[[1, 3, 3], [2, 1, 4], [0, 6, 4]]], expected: 12 },
        { args: [[[1, 3, 1, 5], [2, 2, 4, 1], [5, 0, 2, 3], [0, 6, 1, 2]]], expected: 16 },
        { args: [[[7]]], expected: 7 },
      ],
    },
    {
      fn: 'maximalSquare',
      cases: [
        { args: [[[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]], expected: 4 },
        { args: [[[0, 1], [1, 0]]], expected: 1 },
        { args: [[[0]]], expected: 0 },
      ],
    },
    {
      fn: 'maxSumRectangle',
      cases: [
        { args: [[[1, 2, -1, -4, -20], [-8, -3, 4, 2, 1], [3, 8, 10, 1, 3], [-4, -1, 1, 7, -6]]], expected: 29 },
        { args: [[[-1, -2], [-3, -4]]], expected: -1 },
        { args: [[[5]]], expected: 5 },
      ],
    },
  ],
  'Longest Common Subsequence': {
    fn: 'lcs',
    cases: [
      { args: ['abcde', 'ace'], expected: 3 },
      { args: ['abc', 'def'], expected: 0 },
      { args: ['abc', 'abc'], expected: 3 },
    ],
  },
  'Write a program to find the longest Palindrome in a string': {
    fn: 'longestPalindrome',
    compare: 'any-of',
    cases: [
      { args: ['babad'], expected: ['bab', 'aba'] },
      { args: ['cbbd'], expected: ['bb'] },
      { args: ['a'], expected: ['a'] },
    ],
  },
  'Palindromic Substrings': {
    fn: 'countSubstrings',
    cases: [
      { args: ['abc'], expected: 3 },
      { args: ['aaa'], expected: 6 },
      { args: ['a'], expected: 1 },
    ],
  },
  'Edit Distance': {
    fn: 'editDistance',
    cases: [
      { args: ['horse', 'ros'], expected: 3 },
      { args: ['intention', 'execution'], expected: 5 },
      { args: ['', 'a'], expected: 1 },
    ],
  },
  'Target Sum': {
    fn: 'findTargetSumWays',
    cases: [
      { args: [[1, 1, 1, 1, 1], 3], expected: 5 },
      { args: [[1], 1], expected: 1 },
      { args: [[1], 2], expected: 0 },
    ],
  },
  'String DP — longest common substring, LCS of three strings, space-optimised LCS, interleaving, boolean parenthesization': [
    {
      fn: 'longestCommonSubstring',
      cases: [
        { args: ['ABCDGH', 'ACDGHR'], expected: 4 },
        { args: ['abc', 'xyz'], expected: 0 },
        { args: ['abc', 'abc'], expected: 3 },
      ],
    },
    {
      fn: 'isInterleave',
      cases: [
        { args: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true },
        { args: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false },
        { args: ['', '', ''], expected: true },
      ],
    },
  ],
  '0-1 Knapsack Problem': {
    fn: 'knapsack',
    cases: [
      { args: [[10, 20, 30], [60, 100, 120], 50], expected: 220 },
      { args: [[1, 2, 3], [10, 15, 40], 6], expected: 65 },
      { args: [[4], [10], 3], expected: 0 },
    ],
  },
  'Burst Balloons': {
    fn: 'maxCoins',
    cases: [
      { args: [[3, 1, 5, 8]], expected: 167 },
      { args: [[1, 5]], expected: 10 },
      { args: [[7]], expected: 7 },
    ],
  },
  'Regular Expression Matching': {
    fn: 'isMatch',
    cases: [
      { args: ['aa', 'a'], expected: false },
      { args: ['aa', 'a*'], expected: true },
      { args: ['ab', '.*'], expected: true },
      { args: ['aab', 'c*a*b'], expected: true },
      { args: ['mississippi', 'mis*is*p*.'], expected: false },
    ],
  },

  // ================================================================ Greedy
  "Kadane's Algo": {
    fn: 'maxSubArray',
    cases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-3, -1, -2]], expected: -1 },
    ],
  },
  'Jump Game': {
    fn: 'canJump',
    cases: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false },
      { args: [[0]], expected: true },
    ],
  },
  'Minimum number of jumps to reach the end': {
    fn: 'minJumps',
    cases: [
      { args: [[2, 3, 1, 1, 4]], expected: 2 },
      { args: [[1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]], expected: 3 },
      { args: [[1, 0, 3]], expected: -1 },
      { args: [[0]], expected: 0 },
    ],
  },
  'First circular tour that visits all petrol pumps': {
    fn: 'firstTour',
    cases: [
      { args: [[[4, 6], [6, 5], [7, 3], [4, 5]]], expected: 1 },
      { args: [[[6, 4], [3, 6], [7, 3]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: -1 },
    ],
  },
  'Partition Labels': {
    fn: 'partitionLabels',
    cases: [
      { args: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8] },
      { args: ['eccbbbbdec'], expected: [10] },
      { args: ['abc'], expected: [1, 1, 1] },
    ],
  },
  'Hand of Straights': {
    fn: 'isNStraightHand',
    cases: [
      { args: [[1, 2, 3, 6, 2, 3, 4, 7, 8], 3], expected: true },
      { args: [[1, 2, 3, 4, 5], 4], expected: false },
      { args: [[1, 2], 1], expected: true },
    ],
  },
  'Minimum number of platforms': {
    fn: 'minPlatforms',
    cases: [
      { args: [[900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]], expected: 3 },
      { args: [[900, 1100, 1235], [1000, 1200, 1240]], expected: 1 },
      { args: [[100], [200]], expected: 1 },
    ],
  },
  'Candy': {
    fn: 'candy',
    cases: [
      { args: [[1, 0, 2]], expected: 5 },
      { args: [[1, 2, 2]], expected: 4 },
      { args: [[1, 3, 2, 2, 1]], expected: 7 },
    ],
  },

  // ================================================================ Intervals
  'Merge Intervals': {
    fn: 'merge',
    cases: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    ],
  },
  'Insert Interval': {
    fn: 'insert',
    cases: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
      { args: [[], [5, 7]], expected: [[5, 7]] },
    ],
  },
  'Non-overlapping Intervals': {
    fn: 'eraseOverlapIntervals',
    cases: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
      { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: 0 },
    ],
  },
  'Meeting Rooms': {
    fn: 'canAttendMeetings',
    cases: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: false },
      { args: [[[7, 10], [2, 4]]], expected: true },
      { args: [[]], expected: true },
    ],
  },
  'Meeting Rooms II': {
    fn: 'minMeetingRooms',
    cases: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
      { args: [[[7, 10], [2, 4]]], expected: 1 },
      { args: [[[1, 5], [5, 10]]], expected: 1 },
    ],
  },
  'Minimum Number of Arrows to Burst Balloons': {
    fn: 'findMinArrowShots',
    cases: [
      { args: [[[10, 16], [2, 8], [1, 6], [7, 12]]], expected: 2 },
      { args: [[[1, 2], [3, 4], [5, 6], [7, 8]]], expected: 4 },
      { args: [[[1, 2], [2, 3], [3, 4], [4, 5]]], expected: 2 },
    ],
  },

  // ================================================================ Bit manipulation
  'Single Number': {
    fn: 'singleNumber',
    cases: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[7]], expected: 7 },
    ],
  },
  'Count set bits in an integer': {
    fn: 'countSetBits',
    cases: [
      { args: [11], expected: 3 },
      { args: [128], expected: 1 },
      { args: [0], expected: 0 },
    ],
  },
  'Counting Bits': {
    fn: 'countBits',
    cases: [
      { args: [2], expected: [0, 1, 1] },
      { args: [5], expected: [0, 1, 1, 2, 1, 2] },
      { args: [0], expected: [0] },
    ],
  },
  'Reverse Bits': {
    fn: 'reverseBits',
    cases: [
      { args: [43261596], expected: 964176192 },
      { args: [4294967293], expected: 3221225471 },
      { args: [0], expected: 0 },
    ],
  },
  'Sum of Two Integers (no + or -)': {
    fn: 'getSum',
    cases: [
      { args: [1, 2], expected: 3 },
      { args: [-2, 3], expected: 1 },
      { args: [-5, -7], expected: -12 },
    ],
  },
  'Find the two non-repeating elements (all others appear twice)': {
    fn: 'twoNonRepeating',
    compare: 'unordered',
    cases: [
      { args: [[1, 2, 1, 3, 2, 5]], expected: [3, 5] },
      { args: [[2, 1, 3, 2]], expected: [1, 3] },
      { args: [[7, 9]], expected: [7, 9] },
    ],
  },

  // ================================================================ Matrix
  'Spiral traversal of a matrix': {
    fn: 'spiralOrder',
    cases: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
    ],
  },
  'Rotate a matrix by 90 degrees': {
    fn: 'rotate',
    check: 'arg0',
    cases: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
      { args: [[[1]]], expected: [[1]] },
      { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
    ],
  },
  'Set Matrix Zeroes': {
    fn: 'setZeroes',
    check: 'arg0',
    cases: [
      { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
      { args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
    ],
  },
  'Game of Life': {
    fn: 'gameOfLife',
    check: 'arg0',
    cases: [
      { args: [[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]], expected: [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]] },
      { args: [[[1, 1], [1, 0]]], expected: [[1, 1], [1, 1]] },
      { args: [[[1]]], expected: [[0]] },
    ],
  },

  // ================================================================ Design
  'Implement Queue using Stack': {
    fn: 'MyQueue',
    kind: 'design',
    cases: [
      { args: [[], [['push', 1], ['push', 2], ['peek'], ['pop'], ['empty'], ['pop'], ['empty']]], expected: [null, null, 1, 1, false, 2, true] },
      { args: [[], [['push', 1], ['pop'], ['push', 2], ['push', 3], ['pop'], ['peek']]], expected: [null, 1, null, null, 2, 3] },
      { args: [[], [['empty'], ['push', 9], ['peek'], ['empty']]], expected: [true, null, 9, false] },
    ],
  },
  'Design Hit Counter': {
    fn: 'HitCounter',
    kind: 'design',
    cases: [
      { args: [[], [['hit', 1], ['hit', 2], ['hit', 3], ['getHits', 4], ['hit', 300], ['getHits', 300], ['getHits', 301]]], expected: [null, null, null, 3, null, 4, 3] },
      { args: [[], [['hit', 1], ['hit', 1], ['getHits', 1], ['getHits', 300], ['getHits', 301]]], expected: [null, null, 2, 2, 0] },
      { args: [[], [['getHits', 1]]], expected: [0] },
    ],
  },
  'Insert Delete GetRandom O(1)': {
    fn: 'RandomizedSet',
    kind: 'design',
    cases: [
      {
        // getRandom only called when one element remains, so the result is deterministic
        args: [[], [['insert', 1], ['remove', 2], ['insert', 2], ['remove', 1], ['insert', 2], ['getRandom']]],
        expected: [true, false, true, true, false, 2],
      },
      { args: [[], [['insert', 3], ['getRandom'], ['remove', 3], ['insert', 4], ['getRandom']]], expected: [true, 3, true, true, 4] },
      { args: [[], [['insert', 5], ['insert', 5], ['remove', 5], ['remove', 5]]], expected: [true, false, true, false] },
    ],
  },
  'LFU Cache': {
    fn: 'LFUCache',
    kind: 'design',
    cases: [
      {
        args: [[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['get', 3], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]],
        expected: [null, null, 1, null, -1, 3, null, -1, 3, 4],
      },
      { args: [[0], [['put', 0, 0], ['get', 0]]], expected: [null, -1] },
      { args: [[2], [['put', 1, 1], ['put', 2, 2], ['put', 3, 3], ['get', 1], ['get', 2], ['get', 3]]], expected: [null, null, null, -1, 2, 3] },
    ],
  },
  // ---------------------------------------------------------------- Array
  'Reverse the array': { fn: 'reverse', cases: [
    { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[7]], expected: [7] },
    { args: [[]], expected: [] },
  ] },
  'Find the maximum and minimum element in an array': { fn: 'minMax', cases: [
    { args: [[3, 5, 4, 1, 9]], expected: { min: 1, max: 9 } },
    { args: [[4, 4, 2, 9]], expected: { min: 2, max: 9 } },
    { args: [[-2, -8, -1]], expected: { min: -8, max: -1 } },
    { args: [[7]], expected: { min: 7, max: 7 } },
  ] },
  'Union and Intersection of two sorted arrays': { fn: 'unionIntersection', cases: [
    { args: [[1, 3, 4, 5, 7], [2, 3, 5, 6]], expected: { union: [1, 2, 3, 4, 5, 6, 7], intersection: [3, 5] } },
    { args: [[1, 2, 2, 3], [2, 2, 4]], expected: { union: [1, 2, 3, 4], intersection: [2] } },
    { args: [[1, 2], [3, 4]], expected: { union: [1, 2, 3, 4], intersection: [] } },
    { args: [[], [1, 2]], expected: { union: [1, 2], intersection: [] } },
  ] },
  'Cyclically rotate an array': [
    { fn: 'rotateByOne', approaches: [0], cases: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 1, 2, 3, 4] },
      { args: [[1, 2]], expected: [2, 1] },
      { args: [[1]], expected: [1] },
    ] },
    { fn: 'rotate', approaches: [1], cases: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] },
      { args: [[1, 2, 3], 3], expected: [1, 2, 3] },
      { args: [[1, 2, 3], 4], expected: [3, 1, 2] },
      { args: [[1], 0], expected: [1] },
    ] },
  ],
  'Minimise the maximum difference between heights': { fn: 'getMinDiff', cases: [
    { args: [[1, 5, 8, 10], 2], expected: 5 },
    { args: [[3, 9, 12, 16, 20], 3], expected: 11 },
    { args: [[1, 15, 10], 6], expected: 5 },
    { args: [[4], 3], expected: 0 },
  ] },
  'Merge two sorted arrays without extra space': { fn: 'mergeInPlace', check: 'arg0', cases: [
    { args: [[1, 4, 7, 8, 10], [2, 3, 9]], expected: [1, 2, 3, 4, 7] },
    { args: [[10, 12], [5, 18, 20]], expected: [5, 10] },
    { args: [[1, 2, 3], [4, 5]], expected: [1, 2, 3] },
    { args: [[5], [1]], expected: [1] },
  ] },
  'Next Permutation': { fn: 'nextPermutation', cases: [
    { args: [[1, 2, 3]], expected: [1, 3, 2] },
    { args: [[3, 2, 1]], expected: [1, 2, 3] },
    { args: [[1, 3, 2]], expected: [2, 1, 3] },
    { args: [[1, 1, 5]], expected: [1, 5, 1] },
    { args: [[1]], expected: [1] },
  ] },
  'Count Inversions': { fn: 'countInversions', cases: [
    { args: [[2, 4, 1, 3, 5]], expected: 3 },
    { args: [[5, 4, 3, 2, 1]], expected: 10 },
    { args: [[1, 2, 3]], expected: 0 },
    { args: [[1]], expected: 0 },
  ] },
  'Common elements in three sorted arrays': { fn: 'commonElements', cases: [
    { args: [[1, 5, 10, 20, 40, 80], [6, 7, 20, 80, 100], [3, 4, 15, 20, 30, 70, 80, 120]], expected: [20, 80] },
    { args: [[1, 1, 2, 2], [1, 2, 2], [1, 2, 2, 3]], expected: [1, 2] },
    { args: [[1, 2], [3, 4], [5, 6]], expected: [] },
    { args: [[], [1], [1]], expected: [] },
  ] },
  'Rearrange array in alternating positive and negative items': { fn: 'rearrange', cases: [
    { args: [[1, 2, 3, -4, -1, 4]], expected: [1, -4, 2, -1, 3, 4] },
    { args: [[-5, -2, 5, 2, 4, 7, 1, 8, 0, -8]], expected: [5, -5, 2, -2, 4, -8, 7, 1, 8, 0] },
    { args: [[-1, 2, -3, 4]], expected: [2, -1, 4, -3] },
    { args: [[1, 2, 3]], expected: [1, 2, 3] },
  ] },
  'Subarray with sum equal to 0': { fn: 'hasZeroSumSubarray', cases: [
    { args: [[4, 2, -3, 1, 6]], expected: true },
    { args: [[4, 2, 0, 1, 6]], expected: true },
    { args: [[-3, 2, 3, 1, 6]], expected: false },
    { args: [[]], expected: false },
  ] },
  'Factorial of a large number': { fn: 'factorial', cases: [
    { args: [5], expected: '120' },
    { args: [25], expected: '15511210043330985984000000' },
    { args: [10], expected: '3628800' },
    { args: [0], expected: '1' },
  ] },
  'Elements appearing more than n/k times': { fn: 'moreThanNK', compare: 'unordered', cases: [
    { args: [[3, 1, 2, 2, 1, 2, 3, 3], 4], expected: [2, 3] },
    { args: [[1, 1, 2, 2, 3], 3], expected: [1, 2] },
    { args: [[5, 5, 5, 5], 2], expected: [5] },
    { args: [[1, 2, 3, 4], 2], expected: [] },
  ] },
  'Maximum profit by buying and selling a share at most twice': { fn: 'maxProfitTwice', cases: [
    { args: [[3, 3, 5, 0, 0, 3, 1, 4]], expected: 6 },
    { args: [[1, 2, 3, 4, 5]], expected: 4 },
    { args: [[7, 6, 4, 3, 1]], expected: 0 },
    { args: [[5]], expected: 0 },
  ] },
  'Check whether an array is a subset of another array': { fn: 'isSubset', cases: [
    { args: [[11, 1, 13, 21, 3, 7], [11, 3, 7, 1]], expected: true },
    { args: [[10, 5, 2, 23, 19], [19, 5, 3]], expected: false },
    { args: [[1, 2, 3], []], expected: true },
  ] },
  'Chocolate Distribution Problem': { fn: 'minDiff', cases: [
    { args: [[7, 3, 2, 4, 9, 12, 56], 3], expected: 2 },
    { args: [[3, 4, 1, 9, 56, 7, 9, 12], 5], expected: 6 },
    { args: [[1, 2, 3], 3], expected: 2 },
    { args: [[5], 1], expected: 0 },
  ] },
  'Minimum swaps to bring elements ≤ K together': { fn: 'minSwaps', cases: [
    { args: [[2, 1, 5, 6, 3], 3], expected: 1 },
    { args: [[2, 7, 9, 5, 8, 7, 4], 5], expected: 2 },
    { args: [[1, 2, 3], 5], expected: 0 },
    { args: [[6, 7, 8], 5], expected: 0 },
  ] },
  'Minimum operations to make an array palindrome': { fn: 'minOpsPalindrome', cases: [
    { args: [[15, 4, 15]], expected: 0 },
    { args: [[1, 4, 5, 1]], expected: 1 },
    { args: [[11, 14, 15, 99]], expected: 3 },
    { args: [[5]], expected: 0 },
  ] },

  // ---------------------------------------------------------------- String
  'Check whether a String is Palindrome or not': { fn: 'isPalindrome', cases: [
    { args: ['level'], expected: true },
    { args: ['hello'], expected: false },
    { args: ['abba'], expected: true },
    { args: ['a'], expected: true },
    { args: [''], expected: true },
  ] },
  'Longest Common Prefix': { fn: 'longestCommonPrefix', cases: [
    { args: [['flower', 'flow', 'flight']], expected: 'fl' },
    { args: [['dog', 'racecar', 'car']], expected: '' },
    { args: [['ab', 'ab']], expected: 'ab' },
    { args: [['alone']], expected: 'alone' },
    { args: [['', 'b']], expected: '' },
  ] },
  'Reverse a String': { fn: 'reverseString', cases: [
    { args: ['hello'], expected: 'olleh' },
    { args: ['ab cd'], expected: 'dc ba' },
    { args: ['a'], expected: 'a' },
    { args: [''], expected: '' },
  ] },
  'Find duplicate characters in a string': { fn: 'duplicates', cases: [
    { args: ['programming'], expected: [{ char: 'r', count: 2 }, { char: 'g', count: 2 }, { char: 'm', count: 2 }] },
    { args: ['aabbb'], expected: [{ char: 'a', count: 2 }, { char: 'b', count: 3 }] },
    { args: ['abc'], expected: [] },
    { args: [''], expected: [] },
  ] },
  'Check whether one string is a rotation of another': { fn: 'isRotation', cases: [
    { args: ['ABCD', 'CDAB'], expected: true },
    { args: ['ABCD', 'ACBD'], expected: false },
    { args: ['abc', 'abcd'], expected: false },
    { args: ['aa', 'aa'], expected: true },
  ] },
  'Check whether a string is a valid shuffle of two strings': { fn: 'isValidShuffle', cases: [
    { args: ['XY', '12', '1XY2'], expected: true },
    { args: ['XY', '12', 'Y1X2'], expected: false },
    { args: ['AB', 'CD', 'ACBD'], expected: true },
    { args: ['AB', 'CD', 'ABC'], expected: false },
    { args: ['', 'XY', 'XY'], expected: true },
    { args: ['AB', 'AC', 'ACAB'], expected: true },
    { args: ['AB', 'AC', 'AACB'], expected: true },
    { args: ['AB', 'AC', 'ABCA'], expected: false },
  ] },
  'Count and Say': { fn: 'countAndSay', cases: [
    { args: [4], expected: '1211' },
    { args: [5], expected: '111221' },
    { args: [6], expected: '312211' },
    { args: [1], expected: '1' },
  ] },
  'Longest Repeating Subsequence': { fn: 'longestRepeatingSubseq', cases: [
    { args: ['axxxy'], expected: 2 },
    { args: ['aabb'], expected: 2 },
    { args: ['aab'], expected: 1 },
    { args: ['abc'], expected: 0 },
  ] },
  'Split a binary string into two substrings with equal 0s and 1s': { fn: 'maxSplits', cases: [
    { args: ['0100110101'], expected: 4 },
    { args: ['0111100010'], expected: 3 },
    { args: ['01'], expected: 1 },
    { args: ['0000000000'], expected: -1 },
  ] },
  'Word Wrap Problem': { fn: 'wordWrap', cases: [
    { args: [[3, 2, 2, 5], 6], expected: 10 },
    { args: [[3, 2, 2], 4], expected: 5 },
    { args: [[1, 1, 1], 5], expected: 0 },
    { args: [[4], 4], expected: 0 },
  ] },
  'Next greater number with the same set of digits': { fn: 'nextGreater', cases: [
    { args: ['218765'], expected: '251678' },
    { args: ['534976'], expected: '536479' },
    { args: ['1234'], expected: '1243' },
    { args: ['4321'], expected: 'no greater number' },
    { args: ['7'], expected: 'no greater number' },
  ] },
  'Rabin–Karp substring search': { fn: 'rabinKarp', cases: [
    { args: ['AABAACAADAABAABA', 'AABA'], expected: [0, 9, 12] },
    { args: ['aaaa', 'aa'], expected: [0, 1, 2] },
    { args: ['abc', 'd'], expected: [] },
    { args: ['ab', 'abc'], expected: [] },
  ] },
  'KMP substring search': { fn: 'kmp', cases: [
    { args: ['ABABDABACDABABCABAB', 'ABABCABAB'], expected: [10] },
    { args: ['aaaa', 'aa'], expected: [0, 1, 2] },
    { args: ['abc', 'd'], expected: [] },
    { args: ['ab', 'abc'], expected: [] },
  ] },
  'Convert a sentence into its mobile numeric keypad sequence': { fn: 'keypadSequence', cases: [
    { args: ['GEEKS'], expected: '43333557777' },
    { args: ['HELLO WORLD'], expected: '4433555555666096667775553' },
    { args: ['A'], expected: '2' },
    { args: [''], expected: '' },
  ] },
  'Minimum bracket reversals to balance an expression': { fn: 'minReversals', cases: [
    { args: ['}{{}}{{{'], expected: 3 },
    { args: ['}{'], expected: 2 },
    { args: ['{{}}'], expected: 0 },
    { args: ['{{{'], expected: -1 },
  ] },
  'Minimum swaps for bracket balancing': { fn: 'minSwaps', cases: [
    { args: ['[]][]['], expected: 2 },
    { args: ['[[][]]'], expected: 0 },
    { args: [']['], expected: 1 },
    { args: [']]][[['], expected: 6 },
  ] },
  'Count all palindromic subsequences': { fn: 'countPalindromicSubseq', cases: [
    { args: ['abcd'], expected: 4 },
    { args: ['aab'], expected: 4 },
    { args: ['aaa'], expected: 7 },
    { args: ['a'], expected: 1 },
  ] },
  'Boyer–Moore pattern searching (bad-character rule)': { fn: 'boyerMoore', cases: [
    { args: ['ABAAABCD', 'ABC'], expected: [4] },
    { args: ['aaaa', 'aa'], expected: [0, 1, 2] },
    { args: ['abc', 'd'], expected: [] },
    { args: ['ab', 'abc'], expected: [] },
  ] },
  'Convert Roman numerals to decimal': { fn: 'romanToInt', cases: [
    { args: ['MCMXCIV'], expected: 1994 },
    { args: ['LVIII'], expected: 58 },
    { args: ['IX'], expected: 9 },
    { args: ['III'], expected: 3 },
  ] },
  'Minimum flips to make a binary string alternate': { fn: 'minFlips', cases: [
    { args: ['0001010111'], expected: 2 },
    { args: ['1111'], expected: 2 },
    { args: ['0101'], expected: 0 },
    { args: ['1'], expected: 0 },
  ] },
  'Find the first repeated word in a string': { fn: 'firstRepeatedWord', cases: [
    { args: ['he had had quite enough of this nonsense'], expected: 'had' },
    { args: ['a b c b a'], expected: 'b' },
    { args: ['the cat the dog cat'], expected: 'the' },
  ] },
  'Smallest window containing all distinct characters of itself': { fn: 'smallestDistinctWindow', cases: [
    { args: ['aabcbcdbca'], expected: 4 },
    { args: ['aaab'], expected: 2 },
    { args: ['abc'], expected: 3 },
    { args: ['aaaa'], expected: 1 },
  ] },
  'Minimum characters to add at front to make a string palindrome': { fn: 'minCharsFront', cases: [
    { args: ['AACECAAAA'], expected: 2 },
    { args: ['ABC'], expected: 2 },
    { args: ['ab'], expected: 1 },
    { args: ['aba'], expected: 0 },
  ] },
  'Generate all valid IP addresses from a string': { fn: 'restoreIps', compare: 'unordered', cases: [
    { args: ['25525511135'], expected: ['255.255.11.135', '255.255.111.35'] },
    { args: ['101023'], expected: ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3'] },
    { args: ['0000'], expected: ['0.0.0.0'] },
    { args: ['123'], expected: [] },
  ] },
  'Recursively remove all adjacent duplicates': { fn: 'removeAdjacentDuplicates', cases: [
    { args: ['azxxzy'], expected: 'ay' },
    { args: ['geeksforgeeg'], expected: 'gksfor' },
    { args: ['caaabbbaacdddd'], expected: '' },
    { args: ['aaa'], expected: '' },
    { args: ['abc'], expected: 'abc' },
  ] },
  'Wildcard string matching (? and *)': { fn: 'isMatch', cases: [
    { args: ['adceb', '*a*b'], expected: true },
    { args: ['acdcb', 'a*c?b'], expected: false },
    { args: ['cb', '?a'], expected: false },
    { args: ['aa', 'a'], expected: false },
    { args: ['', '*'], expected: true },
  ] },
  'Number of customers who could not get a computer': { fn: 'turnedAway', cases: [
    { args: ['ABBAJJKZKZ', 2], expected: 0 },
    { args: ['GACCBDDBAGEE', 3], expected: 1 },
    { args: ['GACCBGDDBAEE', 3], expected: 0 },
    { args: ['GACCBDDBAGEE', 1], expected: 4 },
    { args: ['ABCBCA', 1], expected: 2 },
  ] },
  'Print all sentences from a list of word lists': { fn: 'allSentences', compare: 'unordered', cases: [
    { args: [[['you', 'we'], ['have', 'are']]], expected: ['you have', 'you are', 'we have', 'we are'] },
    { args: [[['hi'], ['there', 'you']]], expected: ['hi there', 'hi you'] },
    { args: [[['a']]], expected: ['a'] },
  ] },

  // ---------------------------------------------------------------- Matrix
  'Median in a row-wise sorted matrix': { fn: 'matrixMedian', cases: [
    { args: [[[1, 3, 5], [2, 6, 9], [3, 6, 9]]], expected: 5 },
    { args: [[[1, 3, 8], [2, 3, 4], [1, 2, 5]]], expected: 3 },
    { args: [[[1], [2], [3]]], expected: 2 },
    { args: [[[5]]], expected: 5 },
  ] },
  'Row with the maximum number of 1s': { fn: 'rowWithMostOnes', cases: [
    { args: [[[0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]]], expected: 2 },
    { args: [[[0, 1], [0, 1]]], expected: 0 },
    { args: [[[1, 1, 1]]], expected: 0 },
    { args: [[[0, 0], [0, 0]]], expected: -1 },
  ] },
  'Print elements in sorted order (row- and column-sorted matrix)': { fn: 'sortedOrder', cases: [
    { args: [[[10, 20, 30, 40], [15, 25, 35, 45], [27, 29, 37, 48], [32, 33, 39, 50]]], expected: [10, 15, 20, 25, 27, 29, 30, 32, 33, 35, 37, 39, 40, 45, 48, 50] },
    { args: [[[1, 3], [2, 4]]], expected: [1, 2, 3, 4] },
    { args: [[[1, 1], [1, 2]]], expected: [1, 1, 1, 2] },
    { args: [[[7]]], expected: [7] },
  ] },
  'Maximum size rectangle of 1s in a binary matrix': { fn: 'maximalRectangle', cases: [
    { args: [[[0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 0]]], expected: 8 },
    { args: [[[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]], expected: 6 },
    { args: [[[1]]], expected: 1 },
    { args: [[[0, 0], [0, 0]]], expected: 0 },
  ] },
  'Maximum value of a[c][d] − a[a][b] with c > a and d > b': { fn: 'maxDiff', cases: [
    { args: [[[1, 2, -1, -4, -20], [-8, -3, 4, 2, 1], [3, 8, 6, 1, 3], [-4, -1, 1, 7, -6], [0, -4, 10, -5, 1]]], expected: 18 },
    { args: [[[1, 2], [3, 4]]], expected: 3 },
    { args: [[[4, 3], [2, 1]]], expected: -3 },
  ] },
  'Common elements in all rows of a matrix': { fn: 'commonInAllRows', compare: 'unordered', cases: [
    { args: [[[1, 2, 1, 4, 8], [3, 7, 8, 5, 1], [8, 7, 7, 3, 1], [8, 1, 2, 7, 9]]], expected: [1, 8] },
    { args: [[[2, 2], [2, 3]]], expected: [2] },
    { args: [[[1, 2, 3]]], expected: [1, 2, 3] },
    { args: [[[1, 2], [3, 4]]], expected: [] },
  ] },

  // ---------------------------------------------------------------- Searching & Sorting
  'Kth smallest number': { fn: 'kthSmallest', cases: [
    { args: [[7, 10, 4, 3, 20, 15], 3], expected: 7 },
    { args: [[7, 10, 4, 3, 20, 15], 4], expected: 10 },
    { args: [[2, 2, 1], 2], expected: 2 },
    { args: [[3, 1, 2], 3], expected: 3 },
    { args: [[5], 1], expected: 5 },
  ] },
  'Find a fixed point (value equal to index)': { fn: 'fixedPoint', cases: [
    { args: [[-10, -5, 0, 3, 7]], expected: 3 },
    { args: [[-10, -5, 3, 4, 7, 9]], expected: -1 },
    { args: [[0]], expected: 0 },
    { args: [[1, 2, 3]], expected: -1 },
  ] },
  'Integer square root': { fn: 'isqrt', cases: [
    { args: [8], expected: 2 },
    { args: [16], expected: 4 },
    { args: [2147395599], expected: 46339 },
    { args: [1], expected: 1 },
    { args: [0], expected: 0 },
  ] },
  'Majority element (> n/2 times)': { fn: 'majorityElement', cases: [
    { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
    { args: [[3, 1, 3, 3, 2]], expected: 3 },
    { args: [[1, 1, 2, 2]], expected: -1 },
    { args: [[1, 2, 3]], expected: -1 },
    { args: [[1]], expected: 1 },
  ] },
  'Search in an array where adjacent elements differ by at most k': { fn: 'search', cases: [
    { args: [[4, 5, 6, 7, 6], 1, 6], expected: 2 },
    { args: [[20, 40, 50, 70, 70, 60], 20, 60], expected: 5 },
    { args: [[5], 3, 5], expected: 0 },
    { args: [[1, 2, 3], 1, 9], expected: -1 },
  ] },
  'Find four elements that sum to a given value (4-sum)': { fn: 'fourSum', compare: 'unordered-deep', cases: [
    { args: [[1, 0, -1, 0, -2, 2], 0], expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]] },
    { args: [[2, 2, 2, 2, 2], 8], expected: [[2, 2, 2, 2]] },
    { args: [[0, 0, 0, 0], 0], expected: [[0, 0, 0, 0]] },
    { args: [[1, 2, 3], 6], expected: [] },
  ] },
  'Count triplets with sum smaller than a given value': { fn: 'countTriplets', cases: [
    { args: [[-2, 0, 1, 3], 2], expected: 2 },
    { args: [[5, 1, 3, 4, 7], 12], expected: 4 },
    { args: [[1, 2, 3], 100], expected: 1 },
    { args: [[1, 2], 5], expected: 0 },
  ] },
  'Merge two sorted arrays into a new array': { fn: 'merge', cases: [
    { args: [[1, 3, 5], [2, 4, 6, 8]], expected: [1, 2, 3, 4, 5, 6, 8] },
    { args: [[1, 1], [1]], expected: [1, 1, 1] },
    { args: [[], [1]], expected: [1] },
    { args: [[], []], expected: [] },
  ] },
  'Print all subarrays with sum 0': { fn: 'zeroSumSubarrays', compare: 'unordered', cases: [
    { args: [[6, 3, -1, -3, 4, -2, 2, 4, 6, -12, -7]], expected: [[2, 4], [2, 6], [5, 6], [6, 9], [0, 10]] },
    { args: [[1, -1, 1, -1]], expected: [[0, 1], [1, 2], [2, 3], [0, 3]] },
    { args: [[0]], expected: [[0, 0]] },
    { args: [[1, 2, 3]], expected: [] },
  ] },
  'Sort an array by the number of set bits': { fn: 'sortBySetBits', cases: [
    { args: [[5, 2, 3, 9, 4, 6, 7, 15, 32]], expected: [15, 7, 5, 3, 9, 6, 2, 4, 32] },
    { args: [[1, 2, 3, 4, 5, 6]], expected: [3, 5, 6, 1, 2, 4] },
    { args: [[8]], expected: [8] },
    { args: [[]], expected: [] },
  ] },
  'Minimum number of swaps to sort an array': { fn: 'minSwaps', cases: [
    { args: [[2, 8, 5, 4]], expected: 1 },
    { args: [[10, 19, 6, 3, 5]], expected: 2 },
    { args: [[4, 3, 2, 1]], expected: 2 },
    { args: [[1, 2, 3]], expected: 0 },
  ] },
  'Bishu and Soldiers': { fn: 'bishu', cases: [
    { args: [[1, 2, 3, 4, 5, 6, 7], [3, 10, 2]], expected: [{ killed: 3, powerGained: 6 }, { killed: 7, powerGained: 28 }, { killed: 2, powerGained: 3 }] },
    { args: [[5, 5], [4, 5]], expected: [{ killed: 0, powerGained: 0 }, { killed: 2, powerGained: 10 }] },
    { args: [[3, 1, 2], [2]], expected: [{ killed: 2, powerGained: 3 }] },
  ] },
  'Kth element of two sorted arrays': { fn: 'kthElement', cases: [
    { args: [[2, 3, 6, 7, 9], [1, 4, 8, 10], 5], expected: 6 },
    { args: [[100, 112, 256, 349, 770], [72, 86, 113, 119, 265, 445, 892], 7], expected: 256 },
    { args: [[1], [2], 2], expected: 2 },
    { args: [[], [3, 4], 2], expected: 4 },
  ] },
  'Missing number in an arithmetic progression': { fn: 'missingInAP', cases: [
    { args: [[2, 4, 8, 10, 12, 14]], expected: 6 },
    { args: [[1, 6, 11, 16, 21, 31]], expected: 26 },
    { args: [[10, 7, 1]], expected: 4 },
    { args: [[1, 3, 7]], expected: 5 },
  ] },
  'Smallest number whose factorial has at least n trailing zeros': { fn: 'smallestFactorialWithZeros', cases: [
    { args: [1], expected: 5 },
    { args: [6], expected: 25 },
    { args: [5], expected: 25 },
    { args: [3], expected: 15 },
  ] },
  'DoubleHelix — maximum sum path across two arrays': { fn: 'doubleHelix', cases: [
    { args: [[3, 5, 7, 9, 20, 25, 30, 40, 55, 56, 57, 60, 62], [1, 4, 7, 11, 14, 25, 44, 47, 55, 57, 100]], expected: 450 },
    { args: [[2, 3, 7, 10, 12], [1, 5, 7, 8]], expected: 35 },
    { args: [[1, 2, 3], [4, 5, 6]], expected: 15 },
    { args: [[], []], expected: 0 },
  ] },
  'Subset sums (all possible sums of subsets)': { fn: 'subsetSums', compare: 'unordered', cases: [
    { args: [[2, 3]], expected: [0, 2, 3, 5] },
    { args: [[5, 2, 1]], expected: [0, 1, 2, 3, 5, 6, 7, 8] },
    { args: [[1, 1]], expected: [0, 1, 1, 2] },
    { args: [[]], expected: [0] },
  ] },
  'Implement in-place merge sort': { fn: 'mergeSortInPlace', cases: [
    { args: [[12, 11, 13, 5, 6, 7]], expected: [5, 6, 7, 11, 12, 13] },
    { args: [[3, 1, 2, 3, 1]], expected: [1, 1, 2, 3, 3] },
    { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    { args: [[1]], expected: [1] },
  ] },
  'Sort an array with many repeated entries (3-way quicksort)': { fn: 'quicksort3', cases: [
    { args: [[4, 9, 4, 4, 1, 9, 4, 4, 9, 4, 4, 1, 4]], expected: [1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 9] },
    { args: [[3, 3, 3]], expected: [3, 3, 3] },
    { args: [[2, 1]], expected: [1, 2] },
    { args: [[]], expected: [] },
  ] },
  'Optimum location of a point to minimise total distance': { fn: 'optimumLocation', compare: 'float', cases: [
    { args: [[[-3, -2], [-1, 0], [-1, 2], [1, 2], [3, 4]], [1, -1, -3]], expected: 20.765235034641616 },
    { args: [[[0, 0]], [1, -1, -3]], expected: 2.1213203435596424 },
    { args: [[[0, 3], [0, -3]], [0, 1, 0]], expected: 6 },
    { args: [[[1, 1]], [1, -1, 0]], expected: 0 },
  ] },
  // ---------------------------------------------------------------- LinkedList
  'Remove duplicates from a sorted linked list': { fn: 'dedupeSorted', input: ['list'], output: 'list', cases: [
    { args: [[1, 1, 2, 3, 3]], expected: [1, 2, 3] },
    { args: [[1, 1, 1]], expected: [1] },
    { args: [[1, 2, 3]], expected: [1, 2, 3] },
    { args: [[]], expected: [] },
  ] },
  'Remove duplicates from an unsorted linked list': { fn: 'dedupeUnsorted', input: ['list'], output: 'list', cases: [
    { args: [[5, 2, 2, 4, 5]], expected: [5, 2, 4] },
    { args: [[1, 1, 1]], expected: [1] },
    { args: [[3, 1, 2]], expected: [3, 1, 2] },
    { args: [[]], expected: [] },
  ] },
  'Move the last element to the front': { fn: 'moveLastToFront', input: ['list'], output: 'list', cases: [
    { args: [[1, 2, 3, 4, 5]], expected: [5, 1, 2, 3, 4] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[7]], expected: [7] },
    { args: [[]], expected: [] },
  ] },
  'Add 1 to a number represented as a linked list': { fn: 'addOne', input: ['list'], output: 'list', cases: [
    { args: [[4, 5, 6]], expected: [4, 5, 7] },
    { args: [[9, 9, 9]], expected: [1, 0, 0, 0] },
    { args: [[1, 2, 9]], expected: [1, 3, 0] },
    { args: [[0]], expected: [1] },
  ] },
  'Intersection of two sorted linked lists (by value)': { fn: 'sortedIntersection', input: ['list', 'list'], output: 'list', cases: [
    { args: [[1, 2, 3, 4, 6], [2, 4, 6, 8]], expected: [2, 4, 6] },
    { args: [[1, 2, 3], [1, 2, 3]], expected: [1, 2, 3] },
    { args: [[1, 2], [3, 4]], expected: [] },
    { args: [[], [1]], expected: [] },
  ] },
  'Merge sort for linked lists': { fn: 'sortList', input: ['list'], output: 'list', cases: [
    { args: [[4, 2, 1, 3]], expected: [1, 2, 3, 4] },
    { args: [[-1, 5, 3, 4, 0]], expected: [-1, 0, 3, 4, 5] },
    { args: [[2, 1]], expected: [1, 2] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Quicksort for linked lists': { fn: 'quickSortList', input: ['list'], output: 'list', cases: [
    { args: [[10, 30, 3, 4, 20, 5]], expected: [3, 4, 5, 10, 20, 30] },
    { args: [[3, 3, 1]], expected: [1, 3, 3] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Check if a linked list is circular': { fn: 'isCircular', input: ['cycle-list'], cases: [
    { args: [[[1, 2, 3], 0]], expected: true },
    { args: [[[1, 2, 3], -1]], expected: false },
    { args: [[[1], 0]], expected: true },
    { args: [[[1], -1]], expected: false },
    { args: [[[1, 2, 3], 1]], expected: false },
  ] },
  'Reverse a doubly linked list': { fn: 'reverseDLL', input: ['dll'], output: 'dll', cases: [
    { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[5]], expected: [5] },
    { args: [[]], expected: [] },
  ] },
  'Find pairs with a given sum in a sorted doubly linked list': { fn: 'pairsWithSum', input: ['dll'], compare: 'unordered-deep', cases: [
    { args: [[1, 2, 4, 5, 6, 8, 9], 7], expected: [[1, 6], [2, 5]] },
    { args: [[1, 5, 6], 6], expected: [[1, 5]] },
    { args: [[1, 2, 3], 10], expected: [] },
    { args: [[4], 8], expected: [] },
  ] },
  'Count triplets in a sorted DLL with a given sum': { fn: 'countTriplets', input: ['dll'], cases: [
    { args: [[1, 2, 4, 5, 6, 8, 9], 17], expected: 2 },
    { args: [[1, 2, 4, 5, 6, 8, 9], 15], expected: 5 },
    { args: [[1, 2, 3], 6], expected: 1 },
    { args: [[1, 2], 3], expected: 0 },
  ] },
  'Sort a k-sorted doubly linked list': { fn: 'sortKSortedDLL', input: ['dll'], output: 'dll', cases: [
    { args: [[3, 6, 2, 12, 56, 8], 2], expected: [2, 3, 6, 8, 12, 56] },
    { args: [[2, 1, 4, 3], 1], expected: [1, 2, 3, 4] },
    { args: [[1, 2, 3], 0], expected: [1, 2, 3] },
    { args: [[5], 3], expected: [5] },
  ] },
  'Rotate a doubly linked list by N nodes': { fn: 'rotateDLL', input: ['dll'], output: 'dll', cases: [
    { args: [['a', 'b', 'c', 'd', 'e'], 2], expected: ['c', 'd', 'e', 'a', 'b'] },
    { args: [[1, 2, 3], 1], expected: [2, 3, 1] },
    { args: [[1, 2, 3], 3], expected: [1, 2, 3] },
    { args: [[1, 2, 3], 0], expected: [1, 2, 3] },
  ] },
  'Delete nodes that have a greater value on the right side': { fn: 'deleteSmallerOnRight', input: ['list'], output: 'list', cases: [
    { args: [[12, 15, 10, 11, 5, 6, 2, 3]], expected: [15, 11, 6, 3] },
    { args: [[10, 20, 30, 40, 50, 60]], expected: [60] },
    { args: [[60, 50, 40]], expected: [60, 50, 40] },
    { args: [[5]], expected: [5] },
  ] },
  'Segregate even and odd nodes in a linked list': { fn: 'segregateEvenOdd', input: ['list'], output: 'list', cases: [
    { args: [[17, 15, 8, 12, 10, 5, 4]], expected: [8, 12, 10, 4, 17, 15, 5] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[1, 3, 5]], expected: [1, 3, 5] },
    { args: [[2, 4]], expected: [2, 4] },
  ] },
  'Sort a linked list of 0s, 1s and 2s': { fn: 'sort012List', input: ['list'], output: 'list', cases: [
    { args: [[1, 2, 2, 1, 2, 0, 2, 2]], expected: [0, 1, 1, 2, 2, 2, 2, 2] },
    { args: [[2, 1, 0]], expected: [0, 1, 2] },
    { args: [[2, 2]], expected: [2, 2] },
    { args: [[0]], expected: [0] },
  ] },
  'Multiply two numbers represented by linked lists': { fn: 'multiplyLists', input: ['list', 'list'], cases: [
    { args: [[3, 2], [2]], expected: 64 },
    { args: [[9, 9, 9], [9, 9, 9]], expected: 998001 },
    { args: [[1, 0, 0], [1, 0]], expected: 1000 },
    { args: [[0], [9, 9]], expected: 0 },
  ] },
  "Program for n'th node from the end of a linked list": { fn: 'nthFromEnd', input: ['list'], output: 'node-val', cases: [
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9], 2], expected: 8 },
    { args: [[1, 2, 3], 1], expected: 3 },
    { args: [[1, 2, 3], 3], expected: 1 },
    { args: [[1, 2], 5], expected: null },
  ] },
  'First non-repeating character in a stream': { fn: 'firstNonRepeatingStream', cases: [
    { args: ['aabc'], expected: 'a#bb' },
    { args: ['abcabc'], expected: 'aaabc#' },
    { args: ['zz'], expected: 'z#' },
    { args: ['a'], expected: 'a' },
  ] },
  'Deletion from a circular linked list': { fn: 'deleteFromCircular', input: ['circular-list'], output: 'circular-list', cases: [
    { args: [[2, 5, 7, 8, 10], 5], expected: [2, 7, 8, 10] },
    { args: [[2, 5, 7], 2], expected: [5, 7] },
    { args: [[1, 2, 3], 9], expected: [1, 2, 3] },
    { args: [[4], 4], expected: [] },
  ] },

  // ---------------------------------------------------------------- Binary Trees
  'Construct a binary tree from its bracket string representation': { fn: 'str2tree', output: 'tree', cases: [
    { args: ['4(2(3)(1))(6(5))'], expected: [4, 2, 6, 3, 1, 5] },
    { args: ['10(20)(30)'], expected: [10, 20, 30] },
    { args: ['1(2)'], expected: [1, 2] },
    { args: ['1'], expected: [1] },
  ] },
  'Convert a binary tree to a doubly linked list (in-order)': { fn: 'treeToDLL', input: ['tree'], output: 'tree-dll', cases: [
    { args: [[10, 12, 15, 25, 30, 36]], expected: [25, 12, 30, 10, 36, 15] },
    { args: [[2, 1, 3]], expected: [1, 2, 3] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Convert a binary tree to a sum tree / check if it is a sum tree': { fn: 'toSumTree', input: ['tree'], check: 'arg0', cases: [
    { args: [[10, -2, 6, 8, -4, 7, 5]], expected: [20, 4, 12, 0, 0, 0, 0] },
    { args: [[1, 2, 3]], expected: [5, 0, 0] },
    { args: [[1]], expected: [0] },
  ] },
  'LCA, distance between two nodes, and Kth ancestor in a binary tree': { fn: 'distance', input: ['tree'], cases: [
    { args: [[1, 2, 3, 4, 5, 6, 7], 4, 5], expected: 2 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 4, 6], expected: 4 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 2, 4], expected: 1 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 3, 3], expected: 0 },
  ] },
  'Checks — leaves at same level, duplicate subtrees, is-a-tree (graph), min swaps to BST': [
    { fn: 'leavesSameLevel', approaches: [0], input: ['tree'], cases: [
      { args: [[1, 2, 3]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 2, null, 3]], expected: true },
      { args: [[1]], expected: true },
    ] },
    { fn: 'isGraphTree', approaches: [2], cases: [
      { args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true },
      { args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expected: false },
      { args: [4, [[0, 1], [2, 3]]], expected: false },
      { args: [1, []], expected: true },
    ] },
  ],
  'Check if all levels of two trees are anagrams': { fn: 'levelsAreAnagrams', input: ['tree', 'tree'], cases: [
    { args: [[1, 3, 2, 5, 4], [1, 2, 3, 4, 5]], expected: true },
    { args: [[1, 2, 3], [1, 2, 4]], expected: false },
    { args: [[1, 2], [1, 2, 3]], expected: false },
    { args: [[1], [1]], expected: true },
  ] },

  // ---------------------------------------------------------------- Binary Search Trees
  'BST basics — search, insert, min/max': { fn: 'insert', input: ['tree'], output: 'tree', cases: [
    { args: [[8, 3, 10, 1, 6, null, 14], 7], expected: [8, 3, 10, 1, 6, null, 14, null, null, null, 7] },
    { args: [[5], 3], expected: [5, 3] },
    { args: [[5], 9], expected: [5, null, 9] },
    { args: [[], 5], expected: [5] },
  ] },
  'Inorder successor and predecessor in a BST': { fn: 'inorderSuccessor', input: ['tree'], output: 'node-val', cases: [
    { args: [[50, 30, 70, 20, 40, 60, 80], 65], expected: 70 },
    { args: [[50, 30, 70, 20, 40, 60, 80], 50], expected: 60 },
    { args: [[50, 30, 70, 20, 40, 60, 80], 10], expected: 20 },
    { args: [[50, 30, 70, 20, 40, 60, 80], 80], expected: null },
  ] },
  'Construct a BST from preorder / validate a preorder sequence': { fn: 'bstFromPreorder', output: 'tree', cases: [
    { args: [[8, 5, 1, 7, 10, 12]], expected: [8, 5, 10, 1, 7, null, 12] },
    { args: [[3, 2, 1]], expected: [3, 2, null, 1] },
    { args: [[1, 2, 3]], expected: [1, null, 2, null, 3] },
    { args: [[1]], expected: [1] },
  ] },
  'Convert a binary tree to a BST / balance a BST / flatten a BST to a sorted list': { fn: 'treeToBST', input: ['tree'], output: 'tree', cases: [
    { args: [[10, 2, 7, 8, 4]], expected: [8, 4, 10, 2, 7] },
    { args: [[3, 2, 1]], expected: [2, 1, 3] },
    { args: [[2, 1, 3]], expected: [2, 1, 3] },
    { args: [[1]], expected: [1] },
  ] },
  'Count pairs from two BSTs whose sum equals X': { fn: 'countPairs', input: ['tree', 'tree'], cases: [
    { args: [[5, 3, 7, 2, 4, 6, 8], [10, 6, 15, 3, 8, 11, 18], 16], expected: 3 },
    { args: [[6, 3, 8, 1, 5, 7, 10], [5, 3, 8, 2, 4, 6, 9, null, null, null, null, null, null, null, 11], 16], expected: 4 },
    { args: [[1], [2], 3], expected: 1 },
    { args: [[1], [2], 5], expected: 0 },
  ] },
  'Median of a BST in O(n) time, O(1) space / count nodes in a range': { fn: 'countInRange', input: ['tree'], cases: [
    { args: [[10, 5, 50, 1, null, 40, 100], 5, 45], expected: 3 },
    { args: [[10, 5, 50, 1, null, 40, 100], 1, 100], expected: 6 },
    { args: [[10, 5, 50, 1, null, 40, 100], 200, 300], expected: 0 },
    { args: [[], 1, 2], expected: 0 },
  ] },
  'Replace each element with the least greater element on its right': { fn: 'replaceWithLeastGreater', cases: [
    { args: [[8, 58, 71, 18, 31, 32, 63, 92, 43, 3, 91, 93, 25, 80, 28]], expected: [18, 63, 80, 25, 32, 43, 80, 93, 80, 25, 93, -1, 28, -1, -1] },
    { args: [[1, 2, 3]], expected: [2, 3, -1] },
    { args: [[3, 2, 1]], expected: [-1, -1, -1] },
    { args: [[2, 2]], expected: [-1, -1] },
  ] },
  'Find conflicting appointments': { fn: 'conflictingAppointments', cases: [
    { args: [[[1, 5], [3, 7], [2, 6], [10, 15], [5, 6], [4, 100]]], expected: [[3, 7], [2, 6], [5, 6], [4, 100]] },
    { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[2, 3], [4, 5]] },
    { args: [[[5, 6], [1, 10]]], expected: [[1, 10]] },
    { args: [[[1, 2], [2, 3]]], expected: [] },
    { args: [[]], expected: [] },
  ] },
  'Check whether a BST contains a dead end': { fn: 'hasDeadEnd', input: ['tree'], cases: [
    { args: [[8, 5, 11, 2, 7, null, null, null, 3, null, null, null, 4]], expected: true },
    { args: [[8, 7, 10, 2, null, 9, 13]], expected: true },
    { args: [[5, 3, 8]], expected: false },
    { args: [[1]], expected: false },
  ] },
  'Largest BST subtree in a binary tree': { fn: 'largestBSTSubtree', input: ['tree'], cases: [
    { args: [[10, 5, 15, 1, 8, null, 7]], expected: 3 },
    { args: [[2, 1, 3]], expected: 3 },
    { args: [[5, 6, 4]], expected: 1 },
    { args: [[]], expected: 0 },
  ] },

  // ---------------------------------------------------------------- Stacks & Queues
  'Next Greater Element': { fn: 'nextGreater', cases: [
    { args: [[4, 5, 2, 25]], expected: [5, 25, 25, -1] },
    { args: [[13, 7, 6, 12]], expected: [-1, 12, 12, -1] },
    { args: [[3, 3]], expected: [-1, -1] },
    { args: [[]], expected: [] },
  ] },
  'Implement a stack from scratch': { fn: 'Stack', kind: 'design', cases: [
    { args: [[], [['push', 1], ['push', 2], ['pop'], ['peek'], ['size'], ['isEmpty']]], expected: [null, null, 2, 1, 1, false] },
    { args: [[], [['push', 5], ['pop'], ['isEmpty']]], expected: [null, 5, true] },
    { args: [[], [['isEmpty'], ['pop'], ['size']]], expected: [true, null, 0] },
  ] },
  'Implement a queue from scratch': { fn: 'Queue', kind: 'design', cases: [
    { args: [[], [['enqueue', 1], ['enqueue', 2], ['dequeue'], ['front'], ['isEmpty']]], expected: [null, null, 1, 2, false] },
    { args: [[], [['enqueue', 7], ['dequeue'], ['isEmpty'], ['enqueue', 8], ['front']]], expected: [null, 7, true, null, 8] },
    { args: [[], [['isEmpty'], ['dequeue'], ['front']]], expected: [true, null, null] },
  ] },
  'Implement two stacks in one array': { fn: 'TwoStacks', kind: 'design', cases: [
    { args: [[5], [['push1', 1], ['push2', 5], ['push2', 4], ['pop1'], ['pop2'], ['pop2'], ['pop2']]], expected: [null, null, null, 1, 4, 5, null] },
    { args: [[2], [['push1', 1], ['push2', 2], ['pop1'], ['pop2']]], expected: [null, null, 1, 2] },
    { args: [[3], [['pop1'], ['pop2']]], expected: [null, null] },
  ] },
  'Find the middle element of a stack in O(1)': { fn: 'MiddleStack', kind: 'design', cases: [
    { args: [[], [['push', 1], ['push', 2], ['push', 3], ['push', 4], ['push', 5], ['findMiddle']]], expected: [null, null, null, null, null, 3] },
    { args: [[], [['push', 1], ['push', 2], ['push', 3], ['findMiddle'], ['pop'], ['pop'], ['findMiddle']]], expected: [null, null, null, 2, 3, 2, 1] },
    { args: [[], [['findMiddle'], ['pop']]], expected: [null, null] },
  ] },
  'Insert an element at the bottom of a stack using recursion': { fn: 'insertAtBottom', check: 'arg0', cases: [
    { args: [[1, 2, 3], 0], expected: [0, 1, 2, 3] },
    { args: [[7], 1], expected: [1, 7] },
    { args: [[], 5], expected: [5] },
  ] },
  'Reverse a stack using recursion': { fn: 'reverseStack', check: 'arg0', cases: [
    { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Sort a stack using recursion': { fn: 'sortStack', check: 'arg0', cases: [
    { args: [[34, 3, 31, 98, 92, 23]], expected: [3, 23, 31, 34, 92, 98] },
    { args: [[2, 2, 1]], expected: [1, 2, 2] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Length of the longest valid parentheses substring': { fn: 'longestValidParentheses', cases: [
    { args: ['(()'], expected: 2 },
    { args: [')()())'], expected: 4 },
    { args: ['()(())'], expected: 6 },
    { args: ['(('], expected: 0 },
    { args: [''], expected: 0 },
  ] },
  'Check if an expression has redundant brackets': { fn: 'hasRedundantBrackets', cases: [
    { args: ['((a+b))'], expected: true },
    { args: ['(a+(b)/c)'], expected: true },
    { args: ['(a+b*(c-d))'], expected: false },
    { args: ['a+b'], expected: false },
  ] },
  'Implement a stack using queues': { fn: 'StackViaQueue', kind: 'design', cases: [
    { args: [[], [['push', 1], ['push', 2], ['top'], ['pop'], ['empty']]], expected: [null, null, 2, 2, false] },
    { args: [[], [['push', 1], ['push', 2], ['push', 3], ['pop'], ['pop'], ['top']]], expected: [null, null, null, 3, 2, 1] },
    { args: [[], [['empty'], ['push', 3], ['pop'], ['empty']]], expected: [true, null, 3, true] },
  ] },
  'Check if an array is a valid stack permutation of another': { fn: 'isStackPermutation', cases: [
    { args: [[1, 2, 3], [2, 1, 3]], expected: true },
    { args: [[1, 2, 3], [3, 1, 2]], expected: false },
    { args: [[1, 2, 3], [3, 2, 1]], expected: true },
    { args: [[], []], expected: true },
  ] },
  'Implement a circular queue': { fn: 'CircularQueue', kind: 'design', cases: [
    { args: [[3], [['enqueue', 1], ['enqueue', 2], ['enqueue', 3], ['enqueue', 4], ['rear'], ['isFull'], ['dequeue'], ['enqueue', 4], ['rear']]], expected: [true, true, true, false, 3, true, true, true, 4] },
    { args: [[2], [['enqueue', 1], ['enqueue', 2], ['dequeue'], ['enqueue', 3], ['front'], ['rear'], ['isFull']]], expected: [true, true, true, true, 2, 3, true] },
    { args: [[1], [['front'], ['dequeue'], ['isEmpty'], ['enqueue', 5], ['enqueue', 6], ['front'], ['rear']]], expected: [-1, false, true, true, false, 5, 5] },
  ] },
  'Reverse the first K elements of a queue': { fn: 'reverseFirstK', cases: [
    { args: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
    { args: [[1, 2, 3], 3], expected: [3, 2, 1] },
    { args: [[1, 2, 3], 1], expected: [1, 2, 3] },
    { args: [[1, 2], 0], expected: [1, 2] },
  ] },
  'Interleave the first half of a queue with the second half': { fn: 'interleaveQueue', cases: [
    { args: [[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]], expected: [11, 16, 12, 17, 13, 18, 14, 19, 15, 20] },
    { args: [[1, 2, 3, 4]], expected: [1, 3, 2, 4] },
    { args: [[1, 2]], expected: [1, 2] },
    { args: [[]], expected: [] },
  ] },
  'Sum of minimum and maximum of all subarrays of size k': { fn: 'sumOfMinMax', cases: [
    { args: [[2, 5, -1, 7, -3, -1, -2], 4], expected: 18 },
    { args: [[1, 2, 3], 1], expected: 12 },
    { args: [[1, 2, 3], 3], expected: 4 },
    { args: [[5, 5], 2], expected: 10 },
  ] },
  'Minimum sum of squares of character counts after removing k characters': { fn: 'minStringValue', cases: [
    { args: ['abccc', 1], expected: 6 },
    { args: ['aaab', 2], expected: 2 },
    { args: ['abc', 0], expected: 3 },
    { args: ['aa', 2], expected: 0 },
  ] },
  'Next Smaller Element': { fn: 'nextSmaller', cases: [
    { args: [[4, 8, 5, 2, 25]], expected: [2, 5, 2, -1, -1] },
    { args: [[3, 2, 1]], expected: [2, 1, -1] },
    { args: [[1, 2, 3]], expected: [-1, -1, -1] },
    { args: [[]], expected: [] },
  ] },
  'Reverse a string / queue using a stack; check balanced parentheses': { fn: 'isBalanced', cases: [
    { args: ['[()]{}'], expected: true },
    { args: ['([)]'], expected: false },
    { args: ['(('], expected: false },
    { args: [')'], expected: false },
    { args: [''], expected: true },
  ] },

  // ---------------------------------------------------------------- Heap
  'Implement a binary heap (min & max) with array + sift up/down': { fn: 'Heap', kind: 'design', cases: [
    { args: [[], [['push', 5], ['push', 3], ['push', 8], ['push', 1], ['pop'], ['peek']]], expected: [null, null, null, null, 1, 3] },
    { args: [[], [['push', 2], ['push', 2], ['push', 1], ['pop'], ['pop'], ['pop'], ['pop']]], expected: [null, null, null, 1, 2, 2, null] },
    { args: [[], [['peek'], ['pop']]], expected: [null, null] },
  ] },
  'Heap sort': { fn: 'heapSort', cases: [
    { args: [[12, 11, 13, 5, 6, 7]], expected: [5, 6, 7, 11, 12, 13] },
    { args: [[3, 1, 2, 3, 1]], expected: [1, 1, 2, 3, 3] },
    { args: [[1]], expected: [1] },
    { args: [[]], expected: [] },
  ] },
  'Kth smallest and largest element in an unsorted array': { fn: 'kthLargest', cases: [
    { args: [[7, 10, 4, 3, 20, 15], 3], expected: 10 },
    { args: [[7, 10, 4, 3, 20, 15], 1], expected: 20 },
    { args: [[7, 10, 4, 3, 20, 15], 6], expected: 3 },
    { args: [[5], 1], expected: 5 },
  ] },
  'Merge K sorted arrays': { fn: 'mergeKArrays', cases: [
    { args: [[[1, 3, 5, 7], [2, 4, 6, 8], [0, 9, 10, 11]]], expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { args: [[[1, 1], [1]]], expected: [1, 1, 1] },
    { args: [[[1], [], [0]]], expected: [0, 1] },
    { args: [[[]]], expected: [] },
  ] },
  'Kth largest sum of contiguous subarrays': { fn: 'kthLargestSubarraySum', cases: [
    { args: [[20, -5, -1], 3], expected: 14 },
    { args: [[10, -10, 20, -40], 6], expected: -10 },
    { args: [[1, 2], 1], expected: 3 },
    { args: [[5], 1], expected: 5 },
  ] },
  'Check whether a binary tree is a heap': { fn: 'isHeap', input: ['tree'], cases: [
    { args: [[97, 46, 37, 12, 3, 7, 31, 6, 9]], expected: true },
    { args: [[1, 2, 3]], expected: false },
    { args: [[10, 9, null, 8]], expected: false },
    { args: [[5]], expected: true },
  ] },
  'Connect n ropes with minimum cost': { fn: 'connectRopes', cases: [
    { args: [[4, 3, 2, 6]], expected: 29 },
    { args: [[1, 2, 3, 4, 5]], expected: 33 },
    { args: [[2, 2]], expected: 4 },
    { args: [[5]], expected: 0 },
  ] },
  'Convert a BST to a min-heap': { fn: 'bstToMinHeap', input: ['tree'], output: 'tree', cases: [
    { args: [[4, 2, 6, 1, 3, 5, 7]], expected: [1, 2, 5, 3, 4, 6, 7] },
    { args: [[2, 1, 3]], expected: [1, 2, 3] },
    { args: [[1]], expected: [1] },
  ] },
  'Minimum sum of two numbers formed from digits of an array': { fn: 'minSum', cases: [
    { args: [[6, 8, 4, 5, 2, 3]], expected: '604' },
    { args: [[5, 3, 0, 7, 4]], expected: '82' },
    { args: [[2, 3]], expected: '5' },
    { args: [[1]], expected: '1' },
  ] },
  // ---------------------------------------------------------------- Graph
  'Represent a graph; BFS and DFS': { fn: 'bfs', cases: [
    { args: [[[1, 2], [0, 3], [0, 4], [1], [2]], 0], expected: [0, 1, 2, 3, 4] },
    { args: [[[1, 2], [0, 3], [0, 4], [1], [2]], 3], expected: [3, 1, 0, 2, 4] },
    { args: [[[1], [0], []], 0], expected: [0, 1] },
    { args: [[[]], 0], expected: [0] },
  ] },
  'Detect a cycle — directed and undirected': [
    { fn: 'hasCycleDirected', approaches: [0], cases: [
      { args: [[[1], [2], [0]]], expected: true },
      { args: [[[1, 2], [2], []]], expected: false },
      { args: [[[0]]], expected: true },
      { args: [[[], []]], expected: false },
    ] },
    { fn: 'hasCycleUndirected', approaches: [1], cases: [
      { args: [[[1], [0, 2], [1]]], expected: false },
      { args: [[[1, 2], [0, 2], [0, 1]]], expected: true },
      { args: [[[1], [0], [3, 4], [2, 4], [2, 3]]], expected: true },
      { args: [[[], []]], expected: false },
    ] },
  ],
  'Shortest path on a grid — rat in a maze, knight moves, snake & ladder': { fn: 'minKnightMoves', cases: [
    { args: [6, [4, 5], [1, 1]], expected: 3 },
    { args: [8, [0, 0], [1, 2]], expected: 1 },
    { args: [8, [0, 0], [7, 7]], expected: 6 },
    { args: [8, [3, 3], [3, 3]], expected: 0 },
    { args: [2, [0, 0], [1, 1]], expected: -1 },
  ] },
  'Topological sort; job completion times & longest path in a DAG': { fn: 'longestPathDAG', cases: [
    { args: [4, [[0, 1, 3], [0, 2, 2], [1, 3, 4], [2, 3, 1]]], expected: 7 },
    { args: [4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 2]]], expected: 3 },
    { args: [2, [[0, 1, 5]]], expected: 5 },
    { args: [3, []], expected: 0 },
  ] },
  'Bellman–Ford and detecting a negative cycle': { fn: 'bellmanFord', cases: [
    { args: [5, [[0, 1, -1], [0, 2, 4], [1, 2, 3], [1, 3, 2], [1, 4, 2], [3, 2, 5], [3, 1, 1], [4, 3, -3]], 0], expected: { dist: [0, -1, 2, -2, 1] } },
    { args: [3, [[0, 1, 1], [1, 2, -1], [2, 0, -1]], 0], expected: { negativeCycle: true } },
    { args: [2, [[0, 1, 4]], 0], expected: { dist: [0, 4] } },
    { args: [1, [], 0], expected: { dist: [0] } },
  ] },
  'Floyd–Warshall (all-pairs shortest paths)': { fn: 'floydWarshall', cases: [
    { args: [[[0, 3, 1000000000, 7], [8, 0, 2, 1000000000], [5, 1000000000, 0, 1], [2, 1000000000, 1000000000, 0]]], expected: [[0, 3, 5, 6], [5, 0, 2, 3], [3, 6, 0, 1], [2, 5, 7, 0]] },
    { args: [[[0, 1, 10], [1, 0, 2], [10, 2, 0]]], expected: [[0, 1, 3], [1, 0, 2], [3, 2, 0]] },
    { args: [[[0, 5], [5, 0]]], expected: [[0, 5], [5, 0]] },
    { args: [[[0]]], expected: [[0]] },
  ] },
  'Bridges and articulation points': { fn: 'findBridges', compare: 'unordered-deep', cases: [
    { args: [5, [[1, 2, 3], [0, 2], [0, 1], [0, 4], [3]]], expected: [[0, 3], [3, 4]] },
    { args: [3, [[1], [0, 2], [1]]], expected: [[0, 1], [1, 2]] },
    { args: [3, [[1, 2], [0, 2], [0, 1]]], expected: [] },
    { args: [1, [[]]], expected: [] },
  ] },
  'Strongly connected components (Kosaraju)': { fn: 'kosaraju', cases: [
    { args: [5, [[2, 3], [0], [1], [4], []]], expected: 3 },
    { args: [3, [[1], [2], [0]]], expected: 1 },
    { args: [2, [[1], []]], expected: 2 },
    { args: [3, [[], [], []]], expected: 3 },
  ] },
  'Graph / m-colouring problem': { fn: 'canColor', cases: [
    { args: [4, [[1, 3, 2], [0, 2], [1, 3, 0], [2, 0]], 3], expected: true },
    { args: [4, [[1, 3, 2], [0, 2], [1, 3, 0], [2, 0]], 2], expected: false },
    { args: [2, [[1], [0]], 1], expected: false },
    { args: [3, [[], [], []], 1], expected: true },
  ] },
  'Travelling Salesman Problem (exact)': { fn: 'tsp', cases: [
    { args: [[[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]], expected: 80 },
    { args: [[[0, 1, 2], [1, 0, 3], [2, 3, 0]]], expected: 6 },
    { args: [[[0, 5], [5, 0]]], expected: 10 },
  ] },
  'Journey to the Moon (count invalid pairs)': { fn: 'journeyToMoon', cases: [
    { args: [5, [[0, 1], [2, 3], [0, 4]]], expected: 6 },
    { args: [4, [[0, 2]]], expected: 5 },
    { args: [3, []], expected: 3 },
    { args: [2, [[0, 1]]], expected: 0 },
  ] },
  'Water jug problem (reach a target amount)': { fn: 'waterJug', cases: [
    { args: [3, 5, 4], expected: 6 },
    { args: [4, 3, 2], expected: 4 },
    { args: [3, 5, 3], expected: 1 },
    { args: [2, 6, 5], expected: -1 },
  ] },
  'Minimum edges to reverse to make a path from source to destination': { fn: 'minReversals', cases: [
    { args: [7, [[0, 1], [2, 1], [2, 3], [5, 1], [4, 5], [6, 4], [6, 3]], 0, 6], expected: 2 },
    { args: [2, [[1, 0]], 0, 1], expected: 1 },
    { args: [2, [[0, 1]], 0, 1], expected: 0 },
    { args: [3, [[0, 1]], 0, 2], expected: -1 },
  ] },
  'Count triangles in a graph': { fn: 'countTriangles', cases: [
    { args: [[[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]]], expected: 2 },
    { args: [[[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 0]]], expected: 4 },
    { args: [[[0, 1, 1], [1, 0, 1], [1, 1, 0]]], expected: 1 },
    { args: [[[0, 1], [1, 0]]], expected: 0 },
  ] },

  // ---------------------------------------------------------------- Dynamic Programming
  'Nth Fibonacci Number': { fn: 'fib', cases: [
    { args: [10], expected: 55 },
    { args: [20], expected: 6765 },
    { args: [2], expected: 1 },
    { args: [1], expected: 1 },
    { args: [0], expected: 0 },
  ] },
  'Combinatorial DP — binomial coefficient, Catalan number, derangements, count balanced BSTs of height h': { fn: 'binomial', cases: [
    { args: [5, 2], expected: 10 },
    { args: [10, 3], expected: 120 },
    { args: [5, 5], expected: 1 },
    { args: [5, 0], expected: 1 },
  ] },
  'Matrix Chain Multiplication': { fn: 'matrixChainOrder', cases: [
    { args: [[40, 20, 30, 10, 30]], expected: 26000 },
    { args: [[10, 20, 30, 40, 30]], expected: 30000 },
    { args: [[10, 20, 30]], expected: 6000 },
    { args: [[5, 10]], expected: 0 },
  ] },
  'Fence / tiling recurrences — painting the fence, friends pairing, cut segments, keypad, coin game, score-ways, ways to reach a score': { fn: 'paintFence', cases: [
    { args: [3, 2], expected: 6 },
    { args: [4, 2], expected: 10 },
    { args: [2, 4], expected: 16 },
    { args: [1, 3], expected: 3 },
    { args: [0, 2], expected: 0 },
  ] },
  'Subsequence DP — max sum increasing, longest with adjacent diff one, no three consecutive, alternating, product < K, chain of pairs': [
    { fn: 'maxSumIS', approaches: [0], cases: [
      { args: [[1, 101, 2, 3, 100, 4, 5]], expected: 106 },
      { args: [[3, 4, 5, 10]], expected: 22 },
      { args: [[10, 5, 4, 3]], expected: 10 },
      { args: [[5]], expected: 5 },
    ] },
    { fn: 'maxSumNoThreeConsecutive', approaches: [1], cases: [
      { args: [[1, 2, 3]], expected: 5 },
      { args: [[3000, 2000, 1000, 3, 10]], expected: 5013 },
      { args: [[100, 1000, 100, 1000, 1]], expected: 2101 },
      { args: [[5]], expected: 5 },
    ] },
    { fn: 'longestAlternating', approaches: [2], cases: [
      { args: [[10, 22, 9, 33, 49, 50, 31, 60]], expected: 6 },
      { args: [[1, 5, 4]], expected: 3 },
      { args: [[1, 2, 3]], expected: 2 },
      { args: [[7]], expected: 1 },
    ] },
  ],
  'Egg dropping': { fn: 'eggDrop', cases: [
    { args: [2, 10], expected: 4 },
    { args: [2, 100], expected: 14 },
    { args: [1, 5], expected: 5 },
    { args: [2, 1], expected: 1 },
    { args: [3, 0], expected: 0 },
  ] },
  'Game DP — optimal strategy for a game, coin game winner': { fn: 'optimalGame', cases: [
    { args: [[5, 3, 7, 10]], expected: 15 },
    { args: [[8, 15, 3, 7]], expected: 22 },
    { args: [[20, 30, 2, 2, 2, 10]], expected: 42 },
    { args: [[2, 2, 2, 2]], expected: 4 },
  ] },
  'Optimal BST': { fn: 'optimalBST', cases: [
    { args: [[34, 8, 50]], expected: 142 },
    { args: [[34, 50]], expected: 118 },
    { args: [[1, 1, 1]], expected: 5 },
    { args: [[5]], expected: 5 },
  ] },
  'Palindrome partitioning — minimum cuts': { fn: 'minCut', cases: [
    { args: ['aab'], expected: 1 },
    { args: ['ababbbabbababa'], expected: 3 },
    { args: ['abc'], expected: 2 },
    { args: ['aba'], expected: 0 },
    { args: ['a'], expected: 0 },
  ] },
  'Best time to buy and sell a stock at most K times': { fn: 'maxProfitK', cases: [
    { args: [2, [3, 2, 6, 5, 0, 3]], expected: 7 },
    { args: [2, [2, 4, 1]], expected: 2 },
    { args: [1, [7, 6, 4]], expected: 0 },
    { args: [0, [1, 5]], expected: 0 },
  ] },
  'Smallest sum contiguous subarray / max difference of zeros and ones in a binary string': { fn: 'smallestSubarraySum', cases: [
    { args: [[3, -4, 2, -3, -1, 7, -5]], expected: -6 },
    { args: [[2, 6, 8, 1, 4]], expected: 1 },
    { args: [[-1, -2]], expected: -3 },
    { args: [[5]], expected: 5 },
  ] },
  'Longest Palindromic Subsequence': { fn: 'longestPalindromeSubseq', cases: [
    { args: ['bbbab'], expected: 4 },
    { args: ['cbbd'], expected: 2 },
    { args: ['abc'], expected: 1 },
    { args: ['a'], expected: 1 },
  ] },

  // ---------------------------------------------------------------- Trie
  'Shortest unique prefix for every word': { fn: 'shortestUniquePrefixes', cases: [
    { args: [['zebra', 'dog', 'duck', 'dove']], expected: ['z', 'dog', 'du', 'dov'] },
    { args: [['apple', 'apricot']], expected: ['app', 'apr'] },
    { args: [['a', 'b']], expected: ['a', 'b'] },
    { args: [['dog']], expected: ['d'] },
  ] },
  'Word Break (trie solution)': { fn: 'wordBreakTrie', cases: [
    { args: ['ilikesamsung', ['i', 'like', 'sam', 'sung', 'samsung']], expected: true },
    { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
    { args: ['aaaa', ['aa']], expected: true },
    { args: ['a', ['b']], expected: false },
  ] },
  'Implement a phone directory (prefix search)': { fn: 'phoneDirectory', cases: [
    { args: [['geeikistest', 'geeksforgeeks', 'geeksfortest'], 'geeips'], expected: [['geeikistest', 'geeksforgeeks', 'geeksfortest'], ['geeikistest', 'geeksforgeeks', 'geeksfortest'], ['geeikistest', 'geeksforgeeks', 'geeksfortest'], ['geeikistest'], [], []] },
    { args: [['bob', 'bobby', 'al'], 'bo'], expected: [['bob', 'bobby'], ['bob', 'bobby']] },
    { args: [['x'], 'y'], expected: [[]] },
  ] },
  'Print unique rows in a boolean matrix': { fn: 'uniqueRows', cases: [
    { args: [[[1, 1, 0, 1], [1, 0, 0, 1], [1, 1, 0, 1]]], expected: [[1, 1, 0, 1], [1, 0, 0, 1]] },
    { args: [[[0, 0], [0, 0], [0, 0]]], expected: [[0, 0]] },
    { args: [[[1, 0], [0, 1]]], expected: [[1, 0], [0, 1]] },
    { args: [[[1]]], expected: [[1]] },
  ] },

  // ---------------------------------------------------------------- Bit Manipulation
  'Count bits to flip to convert A to B': { fn: 'bitsToFlip', cases: [
    { args: [10, 20], expected: 4 },
    { args: [0, 15], expected: 4 },
    { args: [1, 2], expected: 2 },
    { args: [7, 7], expected: 0 },
  ] },
  'Count total set bits in all numbers from 1 to n': { fn: 'countTotalSetBits', cases: [
    { args: [4], expected: 5 },
    { args: [17], expected: 35 },
    { args: [7], expected: 12 },
    { args: [1], expected: 1 },
    { args: [0], expected: 0 },
  ] },
  'Check whether a number is a power of two / find the position of its only set bit': { fn: 'onlySetBitPosition', cases: [
    { args: [16], expected: 5 },
    { args: [12], expected: -1 },
    { args: [1], expected: 1 },
    { args: [0], expected: -1 },
  ] },
  'Copy set bits in a given range from one number to another': { fn: 'copyBitsInRange', cases: [
    { args: [44, 3, 1, 5], expected: 47 },
    { args: [10, 13, 2, 3], expected: 14 },
    { args: [0, 7, 1, 3], expected: 7 },
    { args: [8, 7, 4, 4], expected: 8 },
  ] },
  'Divide two integers without *, / or %': { fn: 'divide', cases: [
    { args: [10, 3], expected: 3 },
    { args: [7, -3], expected: -2 },
    { args: [-7, 2], expected: -3 },
    { args: [0, 5], expected: 0 },
    { args: [-2147483648, -1], expected: 2147483647 },
  ] },
  'Square a number without *, / or pow()': { fn: 'square', cases: [
    { args: [5], expected: 25 },
    { args: [-4], expected: 16 },
    { args: [1], expected: 1 },
    { args: [0], expected: 0 },
  ] },
  'Power set of a set': { fn: 'powerSet', compare: 'unordered-deep', cases: [
    { args: [['a', 'b', 'c']], expected: [[], ['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']] },
    { args: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
    { args: [[1]], expected: [[], [1]] },
    { args: [[]], expected: [[]] },
  ] },

  // ---------------------------------------------------------------- BackTracking
  'Rat in a maze — print all paths': { fn: 'ratMaze', cases: [
    { args: [[[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]], expected: ['DDRDRR', 'DRDDRR'] },
    { args: [[[1, 1], [1, 1]]], expected: ['DR', 'RD'] },
    { args: [[[1, 0], [0, 1]]], expected: [] },
    { args: [[[0, 1], [1, 1]]], expected: [] },
  ] },
  'Remove minimum invalid parentheses': { fn: 'removeInvalidParentheses', compare: 'unordered', cases: [
    { args: ['()())()'], expected: ['(())()', '()()()'] },
    { args: ['(a)())()'], expected: ['(a())()', '(a)()()'] },
    { args: ['()'], expected: ['()'] },
    { args: [')('], expected: [''] },
  ] },
  'Subset sum — does any subset add up to the target?': { fn: 'subsetSum', cases: [
    { args: [[3, 34, 4, 12, 5, 2], 9], expected: true },
    { args: [[3, 34, 4, 12, 5, 2], 30], expected: false },
    { args: [[5], 5], expected: true },
    { args: [[1, 2], 4], expected: false },
    { args: [[], 0], expected: true },
  ] },
  'Maximum number by doing at most K swaps': { fn: 'maxNumberKSwaps', cases: [
    { args: ['1234567', 4], expected: '7654321' },
    { args: ['3435335', 3], expected: '5543333' },
    { args: ['129814999', 4], expected: '999984211' },
    { args: ['21', 1], expected: '21' },
    { args: ['123', 0], expected: '123' },
  ] },
  'Longest route in a matrix with hurdles / all paths top-left to bottom-right': { fn: 'longestRoute', cases: [
    { args: [[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], 0, 0, 1, 7], expected: 24 },
    { args: [[[1, 1], [1, 1]], 0, 0, 1, 1], expected: 2 },
    { args: [[[1, 0], [0, 1]], 0, 0, 1, 1], expected: -1 },
    { args: [[[1]], 0, 0, 0, 0], expected: 0 },
  ] },
  'Kth permutation sequence of 1..N': { fn: 'getPermutation', cases: [
    { args: [3, 3], expected: '213' },
    { args: [4, 9], expected: '2314' },
    { args: [3, 6], expected: '321' },
    { args: [1, 1], expected: '1' },
  ] },

  // ---------------------------------------------------------------- Greedy
  'Activity selection / N meetings in one room / maximum trains': { fn: 'maxActivities', cases: [
    { args: [[[1, 2], [3, 4], [0, 6], [5, 7], [8, 9], [5, 9]]], expected: 4 },
    { args: [[[1, 3], [2, 5], [4, 6]]], expected: 2 },
    { args: [[[1, 2]]], expected: 1 },
    { args: [[]], expected: 0 },
  ] },
  'Job sequencing with deadlines (maximise profit)': { fn: 'jobSequencing', cases: [
    { args: [[{ id: 1, deadline: 4, profit: 20 }, { id: 2, deadline: 1, profit: 10 }, { id: 3, deadline: 1, profit: 40 }, { id: 4, deadline: 1, profit: 30 }]], expected: { count: 2, profit: 60 } },
    { args: [[{ id: 1, deadline: 2, profit: 100 }, { id: 2, deadline: 1, profit: 19 }, { id: 3, deadline: 2, profit: 27 }, { id: 4, deadline: 1, profit: 25 }, { id: 5, deadline: 1, profit: 15 }]], expected: { count: 2, profit: 127 } },
    { args: [[{ id: 1, deadline: 1, profit: 5 }, { id: 2, deadline: 1, profit: 9 }]], expected: { count: 1, profit: 9 } },
    { args: [[{ id: 1, deadline: 3, profit: 7 }]], expected: { count: 1, profit: 7 } },
  ] },
  'Fractional knapsack': { fn: 'fractionalKnapsack', compare: 'float', cases: [
    { args: [[[60, 10], [100, 20], [120, 30]], 50], expected: 240 },
    { args: [[[500, 30]], 10], expected: 166.66666666666666 },
    { args: [[[60, 10], [100, 20]], 50], expected: 160 },
    { args: [[], 10], expected: 0 },
  ] },
  'Minimum number of coins / minimum cost of ropes / connect n ropes': { fn: 'minCoins', cases: [
    { args: [70], expected: [50, 20] },
    { args: [43], expected: [20, 20, 2, 1] },
    { args: [121], expected: [100, 20, 1] },
    { args: [0], expected: [] },
  ] },
  'Array-value greedy tricks — k negations, arr[i]*i, abs-diff sum, three-stack equal sum': [
    { fn: 'maxSumAfterKNegations', approaches: [0], cases: [
      { args: [[-2, 0, 5, -1, 2], 4], expected: 10 },
      { args: [[-1, -2], 2], expected: 3 },
      { args: [[1, 2, 3], 1], expected: 4 },
      { args: [[5], 2], expected: 5 },
    ] },
    { fn: 'maxSumIndexProduct', approaches: [1], cases: [
      { args: [[3, 5, 6, 1]], expected: 31 },
      { args: [[2, 1]], expected: 2 },
      { args: [[1]], expected: 0 },
      { args: [[]], expected: 0 },
    ] },
  ],
  'Smallest number with N digits and digit sum S': { fn: 'smallestNumber', cases: [
    { args: [2, 9], expected: '18' },
    { args: [3, 20], expected: '299' },
    { args: [1, 9], expected: '9' },
    { args: [2, 19], expected: '-1' },
    { args: [2, 0], expected: '-1' },
  ] },
  'Minimum cost to cut a board / chocolate into pieces': { fn: 'minCutCost', cases: [
    { args: [[4, 1, 2], [2, 1, 3, 1, 4]], expected: 42 },
    { args: [[2], [1, 3]], expected: 9 },
    { args: [[1], [1]], expected: 3 },
    { args: [[], [5]], expected: 5 },
  ] },
  'Water connection problem': { fn: 'waterConnection', compare: 'unordered', cases: [
    { args: [9, [[7, 4, 98], [5, 9, 72], [4, 6, 10], [2, 8, 22], [9, 7, 17], [3, 1, 66]]], expected: [[2, 8, 22], [3, 1, 66], [5, 6, 10]] },
    { args: [4, [[1, 2, 10], [2, 3, 4], [3, 4, 7]]], expected: [[1, 4, 4]] },
    { args: [2, [[1, 2, 5]]], expected: [[1, 2, 5]] },
    { args: [3, []], expected: [] },
  ] },
  'Other classic greedy — buy max stocks, candy cost, survive on island, wine trading, amplifiers, K centers, defense of a kingdom': { fn: 'gergovia', cases: [
    { args: [[5, -4, 1, -3, 1]], expected: '9' },
    { args: [[-1000, -1000, -1000, 1000, 1000, 1000]], expected: '9000' },
    { args: [[1, -1]], expected: '1' },
    { args: [[0]], expected: '0' },
  ] },
};

/**
 * Problems that deliberately have no tests, with the reason. The practice page
 * runs the reader's code and shows its console output instead. A problem must
 * be in `tests` or here, never both (checked by npm run check:data).
 * @type {Record<string, string>}
 */
export const untestable = {
  'Move all negative elements to one side': 'any arrangement with the negatives first is correct',
  'Three-way partitioning around a range': 'any arrangement of the three groups is correct',
  'Search a word in a 2D grid of characters': 'the reference returns each hit with its direction, a shape the statement does not define',
  'Find a pair with a given difference': 'the reference returns the pair, while the statement asks for true or false',
  'Rasta and Kheshtak (largest common square submatrix pattern)': 'the reference is a sketch of one helper, not a full solution',
  'Split a circular linked list into two halves': 'the answer is two circular lists, which the harness cannot compare',
  'Flatten a linked list (each node has a bottom sub-list)': 'needs nodes with both next and bottom pointers, which a test case cannot express',
  'Can we reverse a linked list in less than O(n)? / Why quicksort for arrays, merge sort for lists?': 'conceptual question with no code to run',
  'Merge two BSTs': 'any balanced BST of the merged values is correct',
  'The celebrity problem': 'the reference takes a knows(a, b) function, which a test case cannot express',
  'Merge two binary max heaps': 'any valid max-heap of the merged values is correct',
  'Minimise cash flow among friends': 'more than one set of transactions settles the debts',
  'Euler path / circuit — Seven Bridges, Chinese Postman': 'a graph can have many valid Euler circuits',
  'Vertex Cover Problem': 'more than one smallest cover can exist, and the approximation may return a larger one',
  'Oliver and the Game (ancestor check on a rooted tree)': 'the reference returns a function, which the harness cannot compare',
  'Largest Independent Set in a tree': 'the reference returns the include/exclude pair, not the size the statement asks for',
  "The Knight's tour": 'a board has many valid tours',
  'Huffman coding': 'ties between equal frequencies give different, equally valid codes',
};
