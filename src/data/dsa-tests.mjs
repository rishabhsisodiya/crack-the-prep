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
 *                 'graph' (LeetCode adjacency: entry i lists the neighbour values of node i + 1)
 *                 'tree-ref' (a value → that node in the preceding 'tree' argument)
 *   output      conversion of the return value: 'raw' | 'list' | 'tree' | 'random-list'
 *               | 'graph' (also fails if an original node was returned instead of a copy)
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
    ],
  },

  // ================================================================ Prefix sum
  'Range Sum Query – Immutable': {
    fn: 'NumArray',
    kind: 'design',
    cases: [
      { args: [[[-2, 0, 3, -5, 2, -1]], [['sumRange', 0, 2], ['sumRange', 2, 5], ['sumRange', 0, 5]]], expected: [1, -1, -3] },
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
      ],
    },
    {
      fn: 'searchMatrix',
      approaches: [1], // fully sorted in row-major order → boolean
      cases: [
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
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
      ],
    },
    {
      fn: 'allocateBooks',
      cases: [
        { args: [[12, 34, 67, 90], 2], expected: 113 },
        { args: [[10, 20, 30, 40], 2], expected: 60 },
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
    ],
  },
  'Next Greater Element II': {
    fn: 'nextGreaterElements',
    cases: [
      { args: [[1, 2, 1]], expected: [2, -1, 2] },
      { args: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4] },
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
      ],
    },
    {
      fn: 'diagonal',
      approaches: [2],
      input: ['tree'],
      cases: [{ args: [[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13]], expected: [8, 10, 14, 3, 6, 7, 13, 1, 4] }],
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
    ],
  },
  'Path sums — longest root-to-leaf sum, largest subtree sum, max non-adjacent sum, K-sum paths': [
    {
      fn: 'longestPathSum',
      input: ['tree'],
      cases: [
        { args: [[4, 2, 5, 7, 1, 2, 3, null, null, 6]], expected: 13 },
        { args: [[1]], expected: 1 },
      ],
    },
    {
      fn: 'largestSubtreeSum',
      input: ['tree'],
      cases: [
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 28 },
        { args: [[1, -2, 3, 4, 5, -6, 2]], expected: 7 },
      ],
    },
    {
      fn: 'maxNonAdjacent',
      input: ['tree'],
      cases: [
        { args: [[3, 2, 3, null, 3, null, 1]], expected: 7 },
        { args: [[3, 4, 5, 1, 3, null, 1]], expected: 9 },
      ],
    },
    {
      fn: 'kSumPaths',
      input: ['tree'],
      compare: 'unordered',
      cases: [{ args: [[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8], expected: [[5, 3], [5, 2, 1], [-3, 11]] }],
    },
  ],
  'Construct a binary tree from inorder + preorder': {
    fn: 'buildTree',
    output: 'tree',
    cases: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
      { args: [[-1], [-1]], expected: [-1] },
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
    ],
  },
  'Smallest range covering elements from K lists': {
    fn: 'smallestRange',
    cases: [
      { args: [[[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]], expected: [20, 24] },
      { args: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]], expected: [1, 1] },
    ],
  },

  // ================================================================ Graphs
  'Number of islands': {
    fn: 'numIslands',
    cases: [
      { args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
      { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 },
    ],
  },
  'Flood fill': {
    fn: 'floodFill',
    cases: [
      { args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expected: [[0, 0, 0], [0, 0, 0]] },
    ],
  },
  'Max Area of Island': {
    fn: 'maxAreaOfIsland',
    cases: [
      { args: [[[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [1, 1, 0, 0, 0]]], expected: 5 },
      { args: [[[0, 0, 0]]], expected: 0 },
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
    ],
  },
  'Distance of the nearest 1 in a binary matrix': {
    fn: 'nearestOne',
    cases: [
      { args: [[[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1]]], expected: [[1, 0, 0, 1], [0, 0, 1, 1], [1, 1, 0, 0]] },
      { args: [[[1, 0, 0], [0, 0, 0]]], expected: [[0, 1, 2], [1, 2, 3]] },
    ],
  },
  'Check whether a graph is bipartite / the Two-Clique problem': {
    fn: 'isBipartite',
    cases: [
      { args: [[[1, 3], [0, 2], [1, 3], [0, 2]]], expected: true },
      { args: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]], expected: false },
    ],
  },
  'Word Ladder (shortest transformation sequence)': {
    fn: 'ladderLength',
    cases: [
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
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
    ],
  },
  'Number of Provinces': {
    fn: 'findCircleNum',
    cases: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 },
      { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3 },
    ],
  },

  // ================================================================ Shortest paths / MST
  "Dijkstra's shortest paths": {
    fn: 'dijkstra',
    cases: [
      { args: [[[[1, 4], [2, 1]], [[3, 1]], [[1, 2], [3, 5]], []], 0], expected: [0, 3, 1, 4] },
      { args: [[[[1, 7]], [[0, 7]]], 1], expected: [7, 0] },
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
      ],
    },
    {
      fn: 'prim',
      cases: [
        { args: [[[[1, 10], [2, 6], [3, 5]], [[0, 10], [3, 15]], [[0, 6], [3, 4]], [[0, 5], [1, 15], [2, 4]]]], expected: 19 },
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
    ],
  },
  'Longest Word in Dictionary': {
    fn: 'longestWord',
    cases: [
      { args: [['w', 'wo', 'wor', 'worl', 'world']], expected: 'world' },
      { args: [['a', 'banana', 'app', 'appl', 'ap', 'apply', 'apple']], expected: 'apple' },
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
      ],
    },
    {
      fn: 'unboundedKnapsack',
      cases: [
        { args: [[1, 3, 4, 5], [10, 40, 50, 70], 8], expected: 110 },
        { args: [[5], [10], 4], expected: 0 },
      ],
    },
  ],
  'Best Time to Buy and Sell Stock with Cooldown': {
    fn: 'maxProfit',
    cases: [
      { args: [[1, 2, 3, 0, 2]], expected: 3 },
      { args: [[1]], expected: 0 },
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
    ],
  },
  'Hand of Straights': {
    fn: 'isNStraightHand',
    cases: [
      { args: [[1, 2, 3, 6, 2, 3, 4, 7, 8], 3], expected: true },
      { args: [[1, 2, 3, 4, 5], 4], expected: false },
    ],
  },
  'Minimum number of platforms': {
    fn: 'minPlatforms',
    cases: [
      { args: [[900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]], expected: 3 },
      { args: [[900, 1100, 1235], [1000, 1200, 1240]], expected: 1 },
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
    ],
  },
  'Reverse Bits': {
    fn: 'reverseBits',
    cases: [
      { args: [43261596], expected: 964176192 },
      { args: [4294967293], expected: 3221225471 },
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
    ],
  },
  'Set Matrix Zeroes': {
    fn: 'setZeroes',
    check: 'arg0',
    cases: [
      { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    ],
  },
  'Game of Life': {
    fn: 'gameOfLife',
    check: 'arg0',
    cases: [
      { args: [[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]], expected: [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]] },
      { args: [[[1, 1], [1, 0]]], expected: [[1, 1], [1, 1]] },
    ],
  },

  // ================================================================ Design
  'Implement Queue using Stack': {
    fn: 'MyQueue',
    kind: 'design',
    cases: [
      { args: [[], [['push', 1], ['push', 2], ['peek'], ['pop'], ['empty'], ['pop'], ['empty']]], expected: [null, null, 1, 1, false, 2, true] },
    ],
  },
  'Design Hit Counter': {
    fn: 'HitCounter',
    kind: 'design',
    cases: [
      { args: [[], [['hit', 1], ['hit', 2], ['hit', 3], ['getHits', 4], ['hit', 300], ['getHits', 300], ['getHits', 301]]], expected: [null, null, null, 3, null, 4, 3] },
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
    ],
  },
};
