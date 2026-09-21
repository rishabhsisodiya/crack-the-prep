// Statements: Interview Core problems (dsa-solutions-core.mjs).
export const part4 = {
  // ---------------------------------------------------------------- Hashing
  'Contains Duplicate': {
    text: `Return true if any value appears at least twice in the array, and false if every element is distinct.`,
    ex: [{ in: '[1, 2, 3, 1]', out: 'true' }, { in: '[1, 2, 3, 4]', out: 'false' }],
  },
  'Valid Anagram': {
    text: `Return true if t is an anagram of s — the same characters with the same counts, possibly in a different order.`,
    ex: [{ in: 's = "anagram", t = "nagaram"', out: 'true' }, { in: 's = "rat", t = "car"', out: 'false' }],
  },
  'Top K Frequent Elements': {
    text: `Return the k most frequent elements, in any order. The answer is guaranteed to be unique. Aim for better than O(n log n).`,
    ex: [{ in: 'nums = [1, 1, 1, 2, 2, 3], k = 2', out: '[1, 2]' }],
  },
  'First Unique Character in a String': {
    text: `Return the index of the first character that appears exactly once in the string, or −1 if there is none.`,
    ex: [{ in: '"leetcode"', out: '0' }, { in: '"loveleetcode"', out: '2' }, { in: '"aabb"', out: '-1' }],
  },
  'Encode and Decode Strings': {
    text: `Design encode(list of strings) → one string, and decode(that string) → the original list. The strings may contain any character, including whatever you might choose as a delimiter.`,
    ex: [{ in: '["neet", "co#de", ""]', out: 'decode(encode(input)) returns ["neet", "co#de", ""]' }],
  },
  'Valid Sudoku': {
    text: `Given a partially filled 9 × 9 board ("." for empty), return true if the filled cells break no rule: no repeated digit in any row, any column, or any of the nine 3 × 3 boxes. The board does not need to be solvable.`,
    ex: [{ in: 'a board where one row contains two 8s', out: 'false' }],
  },

  // ---------------------------------------------------------------- Prefix sum
  'Range Sum Query – Immutable': {
    text: `Given an array that never changes, answer many queries sumRange(l, r) — the sum of elements from index l to r inclusive — each in O(1).`,
    ex: [{ in: 'nums = [-2, 0, 3, -5, 2, -1]; sumRange(0,2), sumRange(2,5), sumRange(0,5)', out: '1, -1, -3' }],
  },
  'Subarray Sum Equals K': {
    text: `Return the number of contiguous subarrays whose sum equals k. The array can contain negative numbers.`,
    ex: [{ in: 'nums = [1, 1, 1], k = 2', out: '2' }, { in: 'nums = [1, 2, 3], k = 3', out: '2', why: '[1, 2] and [3].' }],
  },
  'Continuous Subarray Sum': {
    text: `Return true if the array has a contiguous subarray of length at least 2 whose sum is a multiple of k (0 counts as a multiple).`,
    ex: [{ in: 'nums = [23, 2, 4, 6, 7], k = 6', out: 'true', why: '[2, 4] sums to 6.' }, { in: 'nums = [23, 2, 6, 4, 7], k = 13', out: 'false' }],
  },
  'Contiguous Array (equal 0s and 1s)': {
    text: `Given a binary array, return the length of the longest contiguous subarray with an equal number of 0s and 1s.`,
    ex: [{ in: '[0, 1, 0]', out: '2' }, { in: '[0, 0, 1, 0, 0, 0, 1, 1]', out: '6' }],
  },
  'Subarray Sums Divisible by K': {
    text: `Return the number of non-empty contiguous subarrays whose sum is divisible by k. Values can be negative.`,
    ex: [{ in: 'nums = [4, 5, 0, -2, -3, 1], k = 5', out: '7' }],
  },
  'Range Sum Query 2D – Immutable': {
    text: `Given a fixed matrix, answer many queries sumRegion(r1, c1, r2, c2) — the sum of the rectangle with top-left (r1, c1) and bottom-right (r2, c2) — each in O(1).`,
    ex: [{ in: 'matrix = [[3,0,1,4,2], [5,6,3,2,1], [1,2,0,1,5], [4,1,0,1,7], [1,0,3,0,5]]; sumRegion(2,1,4,3)', out: '8' }],
  },

  // ---------------------------------------------------------------- Two pointers
  'Valid Palindrome': {
    text: `Return true if the string reads the same forwards and backwards after lowercasing it and removing every character that is not a letter or digit.`,
    ex: [{ in: '"A man, a plan, a canal: Panama"', out: 'true' }, { in: '"race a car"', out: 'false' }],
  },
  'Two Sum II – Input Array Is Sorted': {
    text: `The array is sorted in ascending order. Return the 1-based indices of the two numbers that add up to target (exactly one solution exists), using O(1) extra space.`,
    ex: [{ in: 'numbers = [2, 7, 11, 15], target = 9', out: '[1, 2]' }],
  },
  'Container With Most Water': {
    text: `height[i] is a vertical line at position i. Choose two lines that, together with the x-axis, hold the most water. The water level is set by the shorter line. Return the maximum amount.`,
    ex: [{ in: '[1, 8, 6, 2, 5, 4, 8, 3, 7]', out: '49', why: 'Lines at indices 1 and 8: min(8, 7) × 7.' }],
  },
  'Remove Duplicates from Sorted Array': {
    text: `Remove duplicates from a sorted array in place so that each value appears once, keeping the order. Return k, the number of unique values. The first k slots must hold them; what comes after does not matter.`,
    ex: [{ in: '[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', out: 'k = 5, array starts [0, 1, 2, 3, 4, …]' }],
  },
  'Move Zeroes': {
    text: `Move every 0 to the end of the array in place, keeping the relative order of the non-zero elements.`,
    ex: [{ in: '[0, 1, 0, 3, 12]', out: '[1, 3, 12, 0, 0]' }],
  },

  // ---------------------------------------------------------------- Cyclic sort
  'Missing Number': {
    text: `The array holds n distinct numbers from the range 0..n, so exactly one is missing. Return it, in O(n) time and O(1) space.`,
    ex: [{ in: '[3, 0, 1]', out: '2' }, { in: '[9, 6, 4, 2, 3, 5, 7, 0, 1]', out: '8' }],
  },
  'Find All Numbers Disappeared in an Array': {
    text: `An array of n integers has every value in 1..n, but some values repeat, so others are missing. Return every value in 1..n that does not appear, using O(1) extra space besides the output.`,
    ex: [{ in: '[4, 3, 2, 7, 8, 2, 3, 1]', out: '[5, 6]' }],
  },
  'Find All Duplicates in an Array': {
    text: `An array of n integers has every value in 1..n, and each value appears once or twice. Return every value that appears twice, in O(n) time and O(1) extra space.`,
    ex: [{ in: '[4, 3, 2, 7, 8, 2, 3, 1]', out: '[2, 3]' }],
  },
  'First Missing Positive': {
    text: `Given an unsorted integer array, return the smallest positive integer that does not appear in it. It must run in O(n) time and O(1) extra space.`,
    ex: [{ in: '[1, 2, 0]', out: '3' }, { in: '[3, 4, -1, 1]', out: '2' }, { in: '[7, 8, 9, 11, 12]', out: '1' }],
  },

  // ---------------------------------------------------------------- Sliding window
  'Longest Substring Without Repeating Characters': {
    text: `Return the length of the longest substring (contiguous) that contains no repeated character.`,
    ex: [{ in: '"abcabcbb"', out: '3', why: '"abc".' }, { in: '"pwwkew"', out: '3', why: '"wke" — "pwke" is a subsequence, not a substring.' }],
  },
  'Longest Repeating Character Replacement': {
    text: `The string contains uppercase letters. You may replace at most k characters with any letter. Return the length of the longest substring you can make that consists of a single repeated letter.`,
    ex: [{ in: 's = "ABAB", k = 2', out: '4' }, { in: 's = "AABABBA", k = 1', out: '4', why: 'Replace the A at index 3: "AABBBBA" contains "BBBB".' }],
  },
  'Permutation in String': {
    text: `Return true if s2 contains some permutation of s1 as a substring — a window of s2 with exactly the same character counts as s1.`,
    ex: [{ in: 's1 = "ab", s2 = "eidbaooo"', out: 'true', why: '"ba".' }, { in: 's1 = "ab", s2 = "eidboaoo"', out: 'false' }],
  },
  'Max Consecutive Ones III': {
    text: `Given a binary array and k, return the length of the longest run of 1s you can get by flipping at most k 0s.`,
    ex: [{ in: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', out: '6' }],
  },
  'Fruit Into Baskets (at most k distinct)': {
    text: `fruits[i] is the type of the ith tree in a row. You have two baskets, each holding one type (the general version allows k types). Start anywhere and pick one fruit from each tree moving right, stopping when a fruit fits no basket. Return the most fruit you can pick — the longest subarray with at most 2 distinct values.`,
    ex: [{ in: '[1, 2, 1]', out: '3' }, { in: '[1, 2, 3, 2, 2]', out: '4', why: '[2, 3, 2, 2].' }],
  },

  // ---------------------------------------------------------------- Binary search
  'Binary Search': {
    text: `Given a sorted array of distinct integers and a target, return the target's index, or −1 if it is absent, in O(log n) time.`,
    ex: [{ in: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', out: '4' }, { in: 'target = 2', out: '-1' }],
  },
  'Find Peak Element': {
    text: `A peak is an element strictly greater than its neighbours. Imagine nums[−1] = nums[n] = −∞, and no two adjacent elements are equal. Return the index of any peak, in O(log n) time.`,
    ex: [{ in: '[1, 2, 3, 1]', out: '2' }, { in: '[1, 2, 1, 3, 5, 6, 4]', out: '1 or 5' }],
  },
  'Time Based Key-Value Store': {
    text: `Design a store with set(key, value, timestamp) and get(key, timestamp). get returns the value from the latest set for that key whose timestamp is ≤ the given timestamp, or "" if there is none. Timestamps for set arrive in strictly increasing order.`,
    ex: [{ in: 'set("foo","bar",1), get("foo",1), get("foo",3), set("foo","bar2",4), get("foo",4), get("foo",5)', out: '"bar", "bar", "bar2", "bar2"' }],
  },
  'Koko Eating Bananas': {
    text: `There are piles of bananas and h hours. Each hour Koko picks one pile and eats k bananas from it (or the whole pile if it has fewer). Return the minimum integer speed k that lets her finish every pile within h hours.`,
    ex: [{ in: 'piles = [3, 6, 7, 11], h = 8', out: '4' }, { in: 'piles = [30, 11, 23, 4, 20], h = 5', out: '30' }],
  },
  'Capacity To Ship Packages Within D Days': {
    text: `Packages must be shipped in the given order. Each day the ship carries a prefix of the remaining packages, with total weight at most its capacity. Return the minimum capacity that ships everything within days days.`,
    ex: [{ in: 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5', out: '15', why: '[1–5], [6, 7], [8], [9], [10].' }],
  },
  'Minimum Number of Days to Make m Bouquets': {
    text: `Flower i blooms on day bloomDay[i]. A bouquet needs k adjacent bloomed flowers, and each flower can be used once. Return the minimum day by which you can make m bouquets, or −1 if it is impossible.`,
    ex: [{ in: 'bloomDay = [1, 10, 3, 10, 2], m = 3, k = 1', out: '3' }, { in: 'bloomDay = [1, 10, 3, 10, 2], m = 3, k = 2', out: '-1', why: 'That needs 6 flowers, but there are only 5.' }],
  },

  // ---------------------------------------------------------------- Stack / deque
  'Daily Temperatures': {
    text: `For each day, return how many days you must wait until a warmer temperature, or 0 if no warmer day follows.`,
    ex: [{ in: '[73, 74, 75, 71, 69, 72, 76, 73]', out: '[1, 1, 4, 2, 1, 1, 0, 0]' }],
  },
  'Next Greater Element II': {
    text: `The array is circular: the element after the last one is the first. For each element, return the first greater element found by moving forward (wrapping around), or −1 if there is none.`,
    ex: [{ in: '[1, 2, 1]', out: '[2, -1, 2]', why: 'The last 1 wraps around to find 2.' }],
  },
  'Decode String': {
    text: `Decode a string encoded as k[encoded], meaning the part inside the brackets repeated k times. Brackets can be nested, and the input is always valid.`,
    ex: [{ in: '"3[a]2[bc]"', out: '"aaabcbc"' }, { in: '"3[a2[c]]"', out: '"accaccacc"' }],
  },
  'Asteroid Collision': {
    text: `Asteroids move along a line: the absolute value is the size and the sign is the direction (+ right, − left). When two meet, the smaller one explodes, and if they are the same size both explode. Asteroids moving the same way never meet. Return the state after all collisions.`,
    ex: [{ in: '[5, 10, -5]', out: '[5, 10]' }, { in: '[8, -8]', out: '[]' }, { in: '[10, 2, -5]', out: '[10]' }],
  },
  'Online Stock Span': {
    text: `Prices arrive one per day. For each new price, return its span: the number of consecutive days, ending today and going backwards, on which the price was ≤ today's price.`,
    ex: [{ in: '100, 80, 60, 70, 60, 75, 85', out: '1, 1, 1, 2, 1, 4, 6' }],
  },
  'Shortest Subarray with Sum at Least K': {
    text: `Return the length of the shortest non-empty contiguous subarray whose sum is at least k, or −1 if none exists. The array can contain negative numbers.`,
    ex: [{ in: 'nums = [2, -1, 2], k = 3', out: '3' }, { in: 'nums = [1, 2], k = 4', out: '-1' }],
  },

  // ---------------------------------------------------------------- Linked list
  'Reorder List': {
    text: `Reorder L0 → L1 → … → Ln−1 → Ln into L0 → Ln → L1 → Ln−1 → L2 → … in place, by relinking the nodes (do not just change their values).`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5', out: '1 → 5 → 2 → 4 → 3' }],
  },

  // ---------------------------------------------------------------- Trees
  'Same Tree': {
    text: `Return true if two binary trees have the same structure and the same value at every node.`,
    ex: [{ in: 'p = [1, 2, 3], q = [1, 2, 3]', out: 'true' }, { in: 'p = [1, 2], q = [1, null, 2]', out: 'false' }],
  },
  'Path Sum II': {
    text: `Return every root-to-leaf path whose node values sum to targetSum, each as a list of values.`,
    ex: [{ in: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], target = 22', out: '[[5,4,11,2], [5,8,4,5]]' }],
  },
  'Count Good Nodes in Binary Tree': {
    text: `A node is good if no node on the path from the root to it has a greater value. Return the number of good nodes.`,
    ex: [{ in: '[3, 1, 4, 3, null, 1, 5]', out: '4', why: 'Nodes 3 (root), 4, 5 and the lower 3.' }],
  },
  'Binary Tree Maximum Path Sum': {
    text: `A path is any sequence of connected nodes (going up and then down at most once), with no node repeated; it need not pass through the root. Return the largest sum of any non-empty path. Values can be negative.`,
    ex: [{ in: '[1, 2, 3]', out: '6' }, { in: '[-10, 9, 20, null, null, 15, 7]', out: '42', why: '15 → 20 → 7.' }],
  },
  'Serialize and Deserialize Binary Tree': {
    text: `Design serialize(root) → string and deserialize(string) → root so that any binary tree survives the round trip unchanged. You choose the format.`,
    ex: [{ in: '[1, 2, 3, null, null, 4, 5]', out: 'deserialize(serialize(root)) gives the same tree' }],
  },
  'Lowest Common Ancestor of a BST': {
    text: `Given a BST and two nodes p and q in it, return their lowest common ancestor (a node counts as its own descendant). Use the BST ordering instead of searching the whole tree.`,
    ex: [{ in: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', out: '6' }, { in: 'same tree, p = 2, q = 4', out: '2' }],
  },
  'Convert Sorted Array to BST': {
    text: `Given a sorted array, build a height-balanced BST from it (the depths of the two subtrees of every node differ by at most 1).`,
    ex: [{ in: '[-10, -3, 0, 5, 9]', out: '[0, -3, 9, -10, null, 5] (any balanced BST is accepted)' }],
  },

  // ---------------------------------------------------------------- Heap
  'K Closest Points to Origin': {
    text: `Given points [x, y], return the k points closest to the origin by Euclidean distance, in any order.`,
    ex: [{ in: 'points = [[3,3], [5,-1], [-2,4]], k = 2', out: '[[3,3], [-2,4]]' }],
  },
  'Last Stone Weight': {
    text: `Each turn, smash the two heaviest stones, x ≤ y. If x == y both are destroyed; otherwise a stone of weight y − x remains. Return the weight of the last stone, or 0 if none is left.`,
    ex: [{ in: '[2, 7, 4, 1, 8, 1]', out: '1' }],
  },
  'Task Scheduler': {
    text: `Tasks are letters, and each takes one unit of time. Two runs of the same task must be at least n units apart; the CPU can idle in between. Return the minimum total time to finish all tasks.`,
    ex: [{ in: 'tasks = ["A","A","A","B","B","B"], n = 2', out: '8', why: 'A B idle A B idle A B.' }, { in: 'same tasks, n = 0', out: '6' }],
  },

  // ---------------------------------------------------------------- Graphs
  'Max Area of Island': {
    text: `In a binary grid, an island is a group of 1s connected up, down, left or right. Return the area (cell count) of the largest island, or 0 if there is none.`,
    ex: [{ in: '[[0,0,1,0,0], [0,1,1,1,0], [0,0,1,0,0], [1,1,0,0,0]]', out: '5' }],
  },
  'Pacific Atlantic Water Flow': {
    text: `heights is an island grid. The Pacific touches the top and left edges; the Atlantic touches the bottom and right edges. Water flows from a cell to a neighbour of equal or lower height. Return every cell from which water can reach both oceans.`,
    ex: [{ in: '[[1,2,2,3,5], [3,2,3,4,4], [2,4,5,3,1], [6,7,1,4,5], [5,1,1,2,4]]', out: '[[0,4], [1,3], [1,4], [2,2], [3,0], [3,1], [4,0]]' }],
  },
  'Surrounded Regions': {
    text: `The board contains "X" and "O". Capture every region of "O"s that is completely surrounded by "X" by flipping it to "X". A region touching the border is never captured. Modify the board in place.`,
    ex: [{ in: '[["X","X","X","X"], ["X","O","O","X"], ["X","X","O","X"], ["X","O","X","X"]]', out: '[["X","X","X","X"], ["X","X","X","X"], ["X","X","X","X"], ["X","O","X","X"]]', why: 'The bottom O touches the border, so it survives.' }],
  },
  'Minimum Height Trees': {
    text: `A tree has n nodes and n − 1 edges. Rooting it at different nodes gives different heights. Return every node that gives the minimum height.`,
    ex: [{ in: 'n = 4, edges = [[1,0], [1,2], [1,3]]', out: '[1]' }, { in: 'n = 6, edges = [[3,0], [3,1], [3,2], [3,4], [5,4]]', out: '[3, 4]' }],
  },

  // ---------------------------------------------------------------- Union-Find
  'Number of Connected Components in an Undirected Graph': {
    text: `Given n nodes labelled 0..n−1 and a list of undirected edges, return the number of connected components.`,
    ex: [{ in: 'n = 5, edges = [[0,1], [1,2], [3,4]]', out: '2' }],
  },
  'Graph Valid Tree': {
    text: `Given n nodes and a list of undirected edges, return true if they form a valid tree: connected, with no cycle.`,
    ex: [{ in: 'n = 5, edges = [[0,1], [0,2], [0,3], [1,4]]', out: 'true' }, { in: 'n = 5, edges = [[0,1], [1,2], [2,3], [1,3], [1,4]]', out: 'false' }],
  },
  'Accounts Merge': {
    text: `Each account is [name, email1, email2, …]. Two accounts belong to the same person if they share any email (names alone prove nothing). Merge them and return each person as [name, …their emails sorted].`,
    ex: [{ in: '[["John","a@x","b@x"], ["John","c@x"], ["John","b@x","d@x"], ["Mary","m@x"]]', out: '[["John","a@x","b@x","d@x"], ["John","c@x"], ["Mary","m@x"]]' }],
  },
  'Number of Provinces': {
    text: `isConnected[i][j] = 1 means cities i and j are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces.`,
    ex: [{ in: '[[1,1,0], [1,1,0], [0,0,1]]', out: '2' }],
  },
  'Path With Minimum Effort': {
    text: `Move up, down, left or right from the top-left cell to the bottom-right cell of a height grid. A route's effort is its largest absolute height difference between two consecutive cells. Return the minimum possible effort.`,
    ex: [{ in: '[[1,2,2], [3,8,2], [5,3,5]]', out: '2', why: 'The route 1→3→5→3→5 never steps by more than 2.' }],
  },

  // ---------------------------------------------------------------- Trie
  'Design Add and Search Words Data Structure': {
    text: `Design addWord(word) and search(word), where search's pattern may contain "." to match any single letter.`,
    ex: [{ in: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad"), search("bad"), search(".ad"), search("b..")', out: 'false, true, true, true' }],
  },
  'Word Search II': {
    text: `Given a letter grid and a list of words, return every word that can be spelled by a path of adjacent cells (up, down, left or right) without reusing a cell within one word.`,
    ex: [{ in: 'board = [["o","a","a","n"], ["e","t","a","e"], ["i","h","k","r"], ["i","f","l","v"]], words = ["oath","pea","eat","rain"]', out: '["eat", "oath"]' }],
  },
  'Longest Word in Dictionary': {
    text: `Return the longest word in the list that can be built one letter at a time, where every prefix (its first 1, 2, … letters) is also in the list. Break ties by the lexicographically smallest word.`,
    ex: [{ in: '["a", "banana", "app", "appl", "ap", "apply", "apple"]', out: '"apple"', why: '"apply" is also buildable, but "apple" comes first alphabetically.' }],
  },

  // ---------------------------------------------------------------- Backtracking
  'Subsets II': {
    text: `The array may contain duplicates. Return every possible subset, with no duplicate subsets in the result.`,
    ex: [{ in: '[1, 2, 2]', out: '[[], [1], [1,2], [1,2,2], [2], [2,2]]' }],
  },
  'Combination Sum II': {
    text: `Return every unique combination of candidates that sums to target. Each candidate may be used at most once, and the candidates may contain duplicates, but the result must not contain duplicate combinations.`,
    ex: [{ in: 'candidates = [10, 1, 2, 7, 6, 1, 5], target = 8', out: '[[1,1,6], [1,2,5], [1,7], [2,6]]' }],
  },
  'Letter Combinations of a Phone Number': {
    text: `Given a string of digits 2–9, return every letter combination they could represent on a phone keypad (2 = abc, 3 = def, …, 9 = wxyz).`,
    ex: [{ in: '"23"', out: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }],
  },
  'Generate Parentheses': {
    text: `Return every well-formed string made of n pairs of parentheses.`,
    ex: [{ in: 'n = 3', out: '["((()))", "(()())", "(())()", "()(())", "()()()"]' }],
  },
  'Word Search': {
    text: `Return true if the word can be spelled in the grid by a path of adjacent cells (up, down, left or right), using each cell at most once.`,
    ex: [{ in: 'board = [["A","B","C","E"], ["S","F","C","S"], ["A","D","E","E"]], word = "ABCCED"', out: 'true' }, { in: 'same board, word = "ABCB"', out: 'false' }],
  },

  // ---------------------------------------------------------------- 1-D DP
  'Climbing Stairs': {
    text: `You climb a staircase of n steps, taking 1 or 2 steps at a time. Return the number of distinct ways to reach the top.`,
    ex: [{ in: 'n = 3', out: '3', why: '1+1+1, 1+2, 2+1.' }],
  },
  'House Robber II': {
    text: `Houses stand in a circle, so the first and last are neighbours. You cannot rob two adjacent houses. Return the maximum amount you can rob.`,
    ex: [{ in: '[2, 3, 2]', out: '3', why: 'Houses 0 and 2 are adjacent in the circle.' }, { in: '[1, 2, 3, 1]', out: '4' }],
  },
  'Coin Change II': {
    text: `Given coin denominations (unlimited supply) and an amount, return the number of combinations that make up the amount. Order does not matter: 1+2 and 2+1 are the same combination.`,
    ex: [{ in: 'amount = 5, coins = [1, 2, 5]', out: '4', why: '5; 2+2+1; 2+1+1+1; 1+1+1+1+1.' }],
  },
  'Decode Ways': {
    text: `Letters are encoded as numbers: A = 1, …, Z = 26. Given a digit string, return how many ways it can be decoded. "06" is not a valid code, so a 0 can only appear as part of 10 or 20.`,
    ex: [{ in: '"12"', out: '2', why: '"AB" (1, 2) or "L" (12).' }, { in: '"226"', out: '3' }, { in: '"06"', out: '0' }],
  },
  'Best Time to Buy and Sell Stock with Cooldown': {
    text: `You may make as many transactions as you like, holding at most one share at a time. After selling, you cannot buy on the next day (a one-day cooldown). Return the maximum profit.`,
    ex: [{ in: '[1, 2, 3, 0, 2]', out: '3', why: 'Buy, sell, cooldown, buy, sell.' }],
  },

  // ---------------------------------------------------------------- 2-D DP
  'Unique Paths': {
    text: `A robot starts at the top-left of an m × n grid and moves only right or down. Return the number of distinct paths to the bottom-right corner.`,
    ex: [{ in: 'm = 3, n = 7', out: '28' }, { in: 'm = 3, n = 2', out: '3' }],
  },
  'Palindromic Substrings': {
    text: `Return the number of palindromic substrings. Substrings at different positions count separately, even when their text is the same.`,
    ex: [{ in: '"abc"', out: '3' }, { in: '"aaa"', out: '6', why: 'a, a, a, aa, aa, aaa.' }],
  },
  'Target Sum': {
    text: `Put either + or − in front of every number, then add them all up. Return how many sign assignments give exactly target.`,
    ex: [{ in: 'nums = [1, 1, 1, 1, 1], target = 3', out: '5', why: 'Exactly one of the five numbers is negative.' }],
  },
  'Burst Balloons': {
    text: `Bursting balloon i earns nums[left] × nums[i] × nums[right], where left and right are its current neighbours (out-of-range neighbours count as 1). Burst every balloon in the best order and return the maximum coins.`,
    ex: [{ in: '[3, 1, 5, 8]', out: '167', why: 'Burst 1, 5, 3, 8: 15 + 120 + 24 + 8.' }],
  },
  'Regular Expression Matching': {
    text: `Implement pattern matching where "." matches any single character and "*" matches zero or more of the element just before it. The pattern must match the entire string.`,
    ex: [{ in: 's = "aa", p = "a"', out: 'false' }, { in: 's = "aa", p = "a*"', out: 'true' }, { in: 's = "aab", p = "c*a*b"', out: 'true' }],
  },

  // ---------------------------------------------------------------- Greedy
  'Jump Game': {
    text: `You start at index 0. nums[i] is the maximum jump length from index i. Return true if you can reach the last index.`,
    ex: [{ in: '[2, 3, 1, 1, 4]', out: 'true' }, { in: '[3, 2, 1, 0, 4]', out: 'false', why: 'Every route lands on index 3, which has jump length 0.' }],
  },
  'Partition Labels': {
    text: `Split the string into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts.`,
    ex: [{ in: '"ababcbacadefegdehijhklij"', out: '[9, 7, 8]', why: '"ababcbaca", "defegde", "hijhklij".' }],
  },
  'Hand of Straights': {
    text: `Return true if the cards can be split into groups of size groupSize, where each group is groupSize consecutive values.`,
    ex: [{ in: 'hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3', out: 'true', why: '[1,2,3], [2,3,4], [6,7,8].' }, { in: 'hand = [1, 2, 3, 4, 5], groupSize = 4', out: 'false' }],
  },
  'Candy': {
    text: `Children stand in a line with ratings. Every child gets at least one candy, and a child with a higher rating than a neighbour must get more candies than that neighbour. Return the minimum total number of candies.`,
    ex: [{ in: '[1, 0, 2]', out: '5', why: '2, 1, 2.' }, { in: '[1, 2, 2]', out: '4', why: '1, 2, 1 — equal ratings have no constraint.' }],
  },

  // ---------------------------------------------------------------- Intervals
  'Insert Interval': {
    text: `Given non-overlapping intervals sorted by start and a new interval, insert the new interval and merge wherever needed, so that the result is still sorted and non-overlapping.`,
    ex: [{ in: 'intervals = [[1,3], [6,9]], new = [2,5]', out: '[[1,5], [6,9]]' }, { in: '[[1,2],[3,5],[6,7],[8,10],[12,16]], new = [4,8]', out: '[[1,2], [3,10], [12,16]]' }],
  },
  'Non-overlapping Intervals': {
    text: `Return the minimum number of intervals to remove so that the rest do not overlap. Intervals that only touch, like [1,2] and [2,3], do not overlap.`,
    ex: [{ in: '[[1,2], [2,3], [3,4], [1,3]]', out: '1', why: 'Remove [1,3].' }, { in: '[[1,2], [1,2], [1,2]]', out: '2' }],
  },
  'Meeting Rooms': {
    text: `Given meeting time intervals, return true if one person can attend all of them — that is, no two meetings overlap.`,
    ex: [{ in: '[[0,30], [5,10], [15,20]]', out: 'false' }, { in: '[[7,10], [2,4]]', out: 'true' }],
  },
  'Meeting Rooms II': {
    text: `Given meeting time intervals, return the minimum number of conference rooms needed to hold them all. A meeting ending at t frees its room for one starting at t.`,
    ex: [{ in: '[[0,30], [5,10], [15,20]]', out: '2' }, { in: '[[7,10], [2,4]]', out: '1' }],
  },
  'Minimum Number of Arrows to Burst Balloons': {
    text: `Each balloon spans [xstart, xend] on the x-axis. An arrow shot straight up at x bursts every balloon with xstart ≤ x ≤ xend. Return the minimum number of arrows needed to burst them all.`,
    ex: [{ in: '[[10,16], [2,8], [1,6], [7,12]]', out: '2', why: 'Shoot at x = 6 and x = 11.' }],
  },

  // ---------------------------------------------------------------- Bits
  'Single Number': {
    text: `Every element appears twice except one. Return that one, in O(n) time and O(1) space.`,
    ex: [{ in: '[4, 1, 2, 1, 2]', out: '4' }],
  },
  'Counting Bits': {
    text: `For every i from 0 to n, return the number of 1 bits in i's binary form. Aim for O(n) overall.`,
    ex: [{ in: 'n = 5', out: '[0, 1, 1, 2, 1, 2]' }],
  },
  'Reverse Bits': {
    text: `Reverse the order of the bits of a 32-bit unsigned integer and return the result as an unsigned integer.`,
    ex: [{ in: '43261596 (00000010100101000001111010011100)', out: '964176192 (00111001011110000010100101000000)' }],
  },
  'Sum of Two Integers (no + or -)': {
    text: `Return a + b without using the + or − operators.`,
    ex: [{ in: 'a = 1, b = 2', out: '3' }, { in: 'a = -2, b = 3', out: '1' }],
  },

  // ---------------------------------------------------------------- Matrix
  'Set Matrix Zeroes': {
    text: `If a cell is 0, set its entire row and column to 0. Do it in place; the follow-up asks for O(1) extra space.`,
    ex: [{ in: '[[1,1,1], [1,0,1], [1,1,1]]', out: '[[1,0,1], [0,0,0], [1,0,1]]' }],
  },
  'Game of Life': {
    text: `Each cell is live (1) or dead (0). All cells update at the same time: a live cell with 2 or 3 live neighbours (out of 8) survives, otherwise it dies; a dead cell with exactly 3 live neighbours becomes live. Compute the next state in place.`,
    ex: [{ in: '[[0,1,0], [0,0,1], [1,1,1], [0,0,0]]', out: '[[0,0,0], [1,0,1], [0,1,1], [0,1,0]]' }],
  },

  // ---------------------------------------------------------------- Design
  'Design Hit Counter': {
    text: `Design a counter with hit(timestamp) and getHits(timestamp), which returns the number of hits in the past 300 seconds (timestamps in (t − 300, t]). Timestamps are in seconds and arrive in non-decreasing order.`,
    ex: [{ in: 'hit(1), hit(2), hit(3), getHits(4), hit(300), getHits(300), getHits(301)', out: '3, 4, 3' }],
  },
  'Insert Delete GetRandom O(1)': {
    text: `Design a set with insert(val), remove(val) (each returns whether it changed the set) and getRandom() (returns each current element with equal probability). Every operation must be O(1) on average.`,
    ex: [{ in: 'insert(1), remove(2), insert(2), getRandom(), remove(1), insert(2), getRandom()', out: 'true, false, true, 1 or 2, true, false, 2' }],
  },
  'LFU Cache': {
    text: `Design a Least Frequently Used cache with a fixed capacity. get(key) returns the value, or −1 if absent. put(key, value) inserts or updates a key. When the cache is full, evict the key with the lowest use count; break ties by evicting the least recently used of them. Every get or put on a key increases its count. Both operations must be O(1).`,
    ex: [{ in: 'capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2), get(3), put(4,4), get(1), get(3), get(4)', out: '1, -1, 3, -1, 3, 4' }],
  },
};
