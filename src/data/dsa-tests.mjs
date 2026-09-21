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
};
