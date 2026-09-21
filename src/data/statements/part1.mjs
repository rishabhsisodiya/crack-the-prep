// Statements: Array, String, Matrix, Searching & Sorting (450-sheet solutions).
export const part1 = {
  // ---------------------------------------------------------------- Array
  'Reverse the array': {
    text: `Given an array, reverse it in place so the first element becomes the last and so on. Return the same array.`,
    ex: [{ in: '[1, 2, 3, 4, 5]', out: '[5, 4, 3, 2, 1]' }],
  },
  "Kadane's Algo": {
    text: `Given an integer array (it may contain negative numbers), find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element.`,
    ex: [
      { in: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', out: '6', why: 'The subarray [4, -1, 2, 1] has sum 6.' },
      { in: '[-3, -1, -2]', out: '-1', why: 'All negative: the best is the single largest element.' },
    ],
  },
  'Best time to buy and Sell stock': {
    text: `prices[i] is a stock's price on day i. You may buy once and sell once, on a later day. Return the maximum profit you can make, or 0 if no profit is possible.`,
    ex: [
      { in: '[7, 1, 5, 3, 6, 4]', out: '5', why: 'Buy on day 1 (price 1), sell on day 4 (price 6).' },
      { in: '[7, 6, 4, 3, 1]', out: '0', why: 'Prices only fall, so do not trade.' },
    ],
  },
  'find duplicate in an array of N+1 Integers': {
    text: `An array has n + 1 integers, each in the range 1..n, so at least one value repeats. Exactly one value is repeated (possibly several times). Return it without modifying the array, using O(1) extra space.`,
    ex: [{ in: '[1, 3, 4, 2, 2]', out: '2' }, { in: '[3, 1, 3, 4, 2]', out: '3' }],
  },
  'Merge Intervals': {
    text: `Given a list of intervals [start, end], merge every group of overlapping intervals and return the resulting non-overlapping intervals, sorted by start. Intervals that touch (one ends where the next starts) count as overlapping.`,
    ex: [
      { in: '[[1,3], [2,6], [8,10], [15,18]]', out: '[[1,6], [8,10], [15,18]]', why: '[1,3] and [2,6] overlap, so they merge into [1,6].' },
      { in: '[[1,4], [4,5]]', out: '[[1,5]]' },
    ],
  },
  'Trapping Rain water problem': {
    text: `height[i] is the height of a bar of width 1. After it rains, water collects between taller bars. Return the total units of water trapped.`,
    ex: [{ in: '[0,1,0,2,1,0,1,3,2,1,2,1]', out: '6', why: 'Water above each bar = min(tallest bar to its left, tallest to its right) − its own height, if positive.' }],
  },
  'find all pairs on integer array whose sum is equal to given number': {
    text: `Given an array of integers and a target sum k, count (or list) all pairs of indices i < j with arr[i] + arr[j] = k. Equal values at different indices form separate pairs.`,
    ex: [
      { in: 'arr = [1, 5, 7, 1], k = 6', out: '2', why: 'Pairs (1,5) at indices (0,1) and (5,1) at indices (1,3).' },
      { in: 'arr = [1, 1, 1, 1], k = 2', out: '6' },
    ],
  },
  'find maximum product subarray': {
    text: `Given an integer array that may contain negatives and zeros, find the contiguous subarray with the largest product and return that product.`,
    ex: [
      { in: '[2, 3, -2, 4]', out: '6', why: '[2, 3] gives 6. Including -2 makes the product negative.' },
      { in: '[-2, 3, -4]', out: '24', why: 'Two negatives multiply to a positive: the whole array.' },
    ],
  },
  'Find the maximum and minimum element in an array': {
    text: `Given an array of integers, return its minimum and maximum values. The follow-up asks you to use as few comparisons as possible.`,
    ex: [{ in: '[3, 5, 4, 1, 9]', out: 'min = 1, max = 9' }],
  },
  'Sort an array of 0s, 1s and 2s': {
    text: `The array contains only 0, 1 and 2. Sort it in place in a single pass, without a library sort and without counting then rewriting (the Dutch National Flag problem).`,
    ex: [{ in: '[0, 2, 1, 2, 0]', out: '[0, 0, 1, 2, 2]' }],
  },
  'Move all negative elements to one side': {
    text: `Rearrange the array so that all negative numbers come before all non-negative numbers. The relative order within each group does not need to be preserved. Use O(1) extra space.`,
    ex: [{ in: '[-12, 11, -13, -5, 6, -7, 5, -3, -6]', out: '[-12, -13, -5, -7, -3, -6, 11, 6, 5]', why: 'Any order is fine as long as every negative comes first.' }],
  },
  'Union and Intersection of two sorted arrays': {
    text: `Given two sorted arrays, return their union (every distinct value in either array) and their intersection (every distinct value in both), each in sorted order.`,
    ex: [{ in: 'a = [1, 3, 4, 5, 7], b = [2, 3, 5, 6]', out: 'union = [1,2,3,4,5,6,7], intersection = [3, 5]' }],
  },
  'Cyclically rotate an array': {
    text: `Rotate the array to the right by one position: the last element moves to the front and every other element shifts one place right. The follow-up asks you to rotate by k positions in O(n) time and O(1) space.`,
    ex: [{ in: '[1, 2, 3, 4, 5]', out: '[5, 1, 2, 3, 4]' }, { in: '[1, 2, 3, 4, 5], k = 2', out: '[4, 5, 1, 2, 3]' }],
  },
  'Minimise the maximum difference between heights': {
    text: `You are given tower heights and an integer k. You must change every tower exactly once, either adding k or subtracting k. Heights must not become negative. Return the smallest possible difference between the tallest and the shortest tower afterwards.`,
    ex: [{ in: 'heights = [1, 5, 8, 10], k = 2', out: '5', why: 'Becomes [3, 3, 6, 8]: 8 − 3 = 5.' }],
  },
  'Minimum number of jumps to reach the end': {
    text: `You start at index 0. arr[i] is the maximum number of steps you can jump forward from index i. Return the minimum number of jumps needed to reach the last index, or −1 if it cannot be reached.`,
    ex: [
      { in: '[2, 3, 1, 1, 4]', out: '2', why: 'Jump 0 → 1 (1 step), then 1 → 4 (3 steps).' },
      { in: '[1, 0, 3]', out: '-1', why: 'Index 1 has value 0, so you are stuck.' },
    ],
  },
  'Merge two sorted arrays without extra space': {
    text: `Two sorted arrays a (size n) and b (size m) are given. Rearrange their elements in place so that a holds the n smallest values and b holds the rest, both still sorted. Use O(1) extra space.`,
    ex: [{ in: 'a = [1, 4, 7, 8, 10], b = [2, 3, 9]', out: 'a = [1, 2, 3, 4, 7], b = [8, 9, 10]' }],
  },
  'Next Permutation': {
    text: `Rearrange the array into the next lexicographically larger permutation of its values. If it is already the largest permutation, rearrange it into the smallest (sorted ascending). Do it in place with O(1) extra space.`,
    ex: [
      { in: '[1, 2, 3]', out: '[1, 3, 2]' },
      { in: '[3, 2, 1]', out: '[1, 2, 3]', why: 'Already the largest, so wrap around to the smallest.' },
      { in: '[1, 3, 2]', out: '[2, 1, 3]' },
    ],
  },
  'Count Inversions': {
    text: `An inversion is a pair of indices i < j with arr[i] > arr[j]. It measures how far the array is from sorted. Return the number of inversions.`,
    ex: [{ in: '[2, 4, 1, 3, 5]', out: '3', why: 'The inversions are (2,1), (4,1) and (4,3).' }],
  },
  'Common elements in three sorted arrays': {
    text: `Given three arrays sorted in ascending order, return the distinct values that appear in all three, in sorted order.`,
    ex: [{ in: 'a = [1, 5, 10, 20, 40, 80], b = [6, 7, 20, 80, 100], c = [3, 4, 15, 20, 30, 70, 80, 120]', out: '[20, 80]' }],
  },
  'Rearrange array in alternating positive and negative items': {
    text: `Rearrange the array so positive and negative numbers alternate, keeping their original relative order within each sign. If one sign runs out, append the leftovers at the end. Treat 0 as positive. The hard version asks for O(1) extra space.`,
    ex: [{ in: '[1, 2, 3, -4, -1, 4]', out: '[-4, 1, -1, 2, 3, 4]' }],
  },
  'Subarray with sum equal to 0': {
    text: `Given an array of integers (it may contain negatives), return true if some non-empty contiguous subarray sums to 0.`,
    ex: [
      { in: '[4, 2, -3, 1, 6]', out: 'true', why: '[2, -3, 1] sums to 0.' },
      { in: '[4, 2, 0, 1, 6]', out: 'true', why: 'The single element [0].' },
      { in: '[-3, 2, 3, 1, 6]', out: 'false' },
    ],
  },
  'Factorial of a large number': {
    text: `Given n (up to about 1000), return n! as a string or digit array. The result has far more digits than any built-in number type can hold, so you must do the arithmetic digit by digit.`,
    ex: [{ in: 'n = 5', out: '120' }, { in: 'n = 25', out: '15511210043330985984000000' }],
  },
  'Longest consecutive subsequence': {
    text: `Given an unsorted array of integers, return the length of the longest run of consecutive values (x, x+1, x+2, …). The values can appear in any order in the array. Aim for O(n) time.`,
    ex: [{ in: '[100, 4, 200, 1, 3, 2]', out: '4', why: 'The run 1, 2, 3, 4.' }],
  },
  'Elements appearing more than n/k times': {
    text: `Given an array of size n and an integer k, return every element that appears more than n/k times. At most k − 1 elements can qualify.`,
    ex: [{ in: 'arr = [3, 1, 2, 2, 1, 2, 3, 3], k = 4', out: '[2, 3]', why: 'n/k = 2. The values 2 and 3 each appear 3 times.' }],
  },
  'Maximum profit by buying and selling a share at most twice': {
    text: `prices[i] is a stock's price on day i. You may complete at most two transactions (buy then sell), and you must sell before you buy again. Return the maximum total profit.`,
    ex: [{ in: '[3, 3, 5, 0, 0, 3, 1, 4]', out: '6', why: 'Buy at 0 and sell at 3 (+3), then buy at 1 and sell at 4 (+3).' }],
  },
  'Check whether an array is a subset of another array': {
    text: `Given arrays a1 and a2, return true if every element of a2 is present in a1. If a value repeats in a2, a1 must contain it at least as many times.`,
    ex: [
      { in: 'a1 = [11, 1, 13, 21, 3, 7], a2 = [11, 3, 7, 1]', out: 'true' },
      { in: 'a1 = [10, 5, 2, 23, 19], a2 = [19, 5, 3]', out: 'false', why: '3 is missing from a1.' },
    ],
  },
  'Find a triplet that sums to a given value': {
    text: `Given an array and a target x, return true if some three distinct indices hold values that sum to exactly x (or return the triplet).`,
    ex: [{ in: 'arr = [1, 4, 45, 6, 10, 8], x = 13', out: 'true', why: '1 + 4 + 8 = 13.' }],
  },
  'Chocolate Distribution Problem': {
    text: `arr[i] is the number of chocolates in packet i. Give one packet to each of m students so that the difference between the largest and smallest packet handed out is as small as possible. Return that minimum difference.`,
    ex: [{ in: 'arr = [7, 3, 2, 4, 9, 12, 56], m = 3', out: '2', why: 'Choose packets 2, 3 and 4: 4 − 2 = 2.' }],
  },
  'Smallest subarray with sum greater than a given value': {
    text: `Given an array of positive integers and a value x, return the length of the smallest contiguous subarray whose sum is strictly greater than x, or 0 if none exists.`,
    ex: [{ in: 'arr = [1, 4, 45, 6, 0, 19], x = 51', out: '3', why: '[4, 45, 6] sums to 55.' }],
  },
  'Three-way partitioning around a range': {
    text: `Given an array and a range [low, high], rearrange the array in place into three groups: elements smaller than low first, then elements within [low, high], then elements greater than high. Order inside each group does not matter. Use a single pass.`,
    ex: [{ in: 'arr = [1, 14, 5, 20, 4, 2, 54, 20, 87, 98, 3, 1, 32], low = 14, high = 20', out: '[1, 5, 4, 2, 1, 3, 14, 20, 20, 98, 87, 32, 54]' }],
  },
  'Minimum swaps to bring elements ≤ K together': {
    text: `Given an array and a number k, return the minimum number of swaps needed to bring all elements less than or equal to k next to each other. They can end up anywhere in the array, as long as they are contiguous.`,
    ex: [{ in: 'arr = [2, 1, 5, 6, 3], k = 3', out: '1', why: 'Swap 5 and 3 to get [2, 1, 3, 6, 5].' }],
  },
  'Minimum operations to make an array palindrome': {
    text: `In one operation you may replace two adjacent elements with their sum. Return the minimum number of operations needed to turn the array into a palindrome.`,
    ex: [{ in: '[15, 4, 15]', out: '0' }, { in: '[1, 4, 5, 1]', out: '1', why: 'Merge 4 and 5 into 9: [1, 9, 1].' }],
  },
  'Median of two sorted arrays': {
    text: `Given two sorted arrays of sizes m and n, return the median of all m + n values combined. With an even total, the median is the average of the two middle values. The target is O(log(min(m, n))) time.`,
    ex: [
      { in: 'a = [1, 3], b = [2]', out: '2' },
      { in: 'a = [1, 2], b = [3, 4]', out: '2.5', why: 'Merged [1, 2, 3, 4]: (2 + 3) / 2.' },
    ],
  },

  // ---------------------------------------------------------------- String
  'Check whether a String is Palindrome or not': {
    text: `Return true if the string reads the same forwards and backwards.`,
    ex: [{ in: '"level"', out: 'true' }, { in: '"hello"', out: 'false' }],
  },
  'Write a program to find the longest Palindrome in a string': {
    text: `Given a string s, return its longest substring that is a palindrome. If several have the same length, return any one of them (commonly the first).`,
    ex: [{ in: '"babad"', out: '"bab"', why: '"aba" is also correct.' }, { in: '"cbbd"', out: '"bb"' }],
  },
  'Longest Common Prefix': {
    text: `Given an array of strings, return the longest string that is a prefix of every one of them, or "" if there is none.`,
    ex: [{ in: '["flower", "flow", "flight"]', out: '"fl"' }, { in: '["dog", "racecar", "car"]', out: '""' }],
  },
  'find the smallest window in a string containing all characters of another string': {
    text: `Given strings s and t, return the shortest substring of s that contains every character of t, counting duplicates. Return "" if there is no such window.`,
    ex: [{ in: 's = "ADOBECODEBANC", t = "ABC"', out: '"BANC"' }, { in: 's = "a", t = "aa"', out: '""', why: 't needs two a’s, but s has only one.' }],
  },
  'Balanced Parenthesis problem': {
    text: `The string contains only the brackets ( ) { } [ ]. Return true if every opening bracket is closed by the same type of bracket, in the correct order.`,
    ex: [{ in: '"{[()]}"', out: 'true' }, { in: '"([)]"', out: 'false', why: 'The ( is closed by ] before its own ).' }],
  },
  'Reverse a String': {
    text: `Reverse a string, or an array of characters in place with O(1) extra space.`,
    ex: [{ in: '"hello"', out: '"olleh"' }],
  },
  'Find duplicate characters in a string': {
    text: `Print every character that appears more than once in the string, together with how many times it appears.`,
    ex: [{ in: '"programming"', out: 'r: 2, g: 2, m: 2' }],
  },
  'Check whether one string is a rotation of another': {
    text: `Return true if s2 can be obtained by rotating s1, that is, by moving some prefix of s1 to its end.`,
    ex: [{ in: 's1 = "ABCD", s2 = "CDAB"', out: 'true' }, { in: 's1 = "ABCD", s2 = "ACBD"', out: 'false' }],
  },
  'Check whether a string is a valid shuffle of two strings': {
    text: `Given strings s1, s2 and result, return true if result interleaves s1 and s2: it uses all their characters, and the characters of each string keep their original order.`,
    ex: [
      { in: 's1 = "XY", s2 = "12", result = "1XY2"', out: 'true' },
      { in: 's1 = "XY", s2 = "12", result = "Y1X2"', out: 'false', why: 'Y comes before X, which breaks s1’s order.' },
    ],
  },
  'Count and Say': {
    text: `The count-and-say sequence starts with "1". Each next term reads the previous term aloud, group by group: "1" is read as "one 1" → "11", which is read as "two 1s" → "21", and so on. Given n, return the nth term.`,
    ex: [{ in: 'n = 4', out: '"1211"', why: '1 → 11 → 21 → 1211 ("one 2, one 1").' }],
  },
  'Longest Repeating Subsequence': {
    text: `Return the length of the longest subsequence that appears at least twice in the string, where the two occurrences never use the same index at the same position.`,
    ex: [{ in: '"axxxy"', out: '2', why: '"xx" can be formed from indices (1,2) and again from (2,3).' }],
  },
  'Split a binary string into two substrings with equal 0s and 1s': {
    text: `Split a binary string into the maximum number of consecutive pieces so that every piece has equal numbers of 0s and 1s. Return that count, or −1 if the whole string cannot be split this way.`,
    ex: [{ in: '"0100110101"', out: '4', why: '"01" + "0011" + "01" + "01".' }],
  },
  'Word Wrap Problem': {
    text: `Given word lengths and a line width k, split the words into lines in their original order. Words on a line are separated by one space, and a line may not exceed k characters. The cost of a line is (unused spaces at its end)², and the last line costs nothing. Return the minimum total cost.`,
    ex: [{ in: 'lengths = [3, 2, 2, 5], k = 6', out: '10', why: 'Lines: [3] (3 spare → 9), [2, 2] (1 spare → 1), [5] (last line → 0).' }],
  },
  'Edit Distance': {
    text: `Given strings a and b, return the minimum number of single-character operations (insert, delete or replace) needed to turn a into b.`,
    ex: [{ in: 'a = "horse", b = "ros"', out: '3', why: 'Replace h→r, delete r, delete e.' }],
  },
  'Next greater number with the same set of digits': {
    text: `Given a number as a string of digits, return the smallest number greater than it that uses exactly the same digits, or "not possible" if none exists.`,
    ex: [{ in: '"218765"', out: '"251678"' }, { in: '"4321"', out: 'not possible' }],
  },
  'Word Break': {
    text: `Given a string s and a dictionary of words, return true if s can be split into a sequence of one or more dictionary words. Each word can be used any number of times.`,
    ex: [
      { in: 's = "leetcode", dict = ["leet", "code"]', out: 'true' },
      { in: 's = "catsandog", dict = ["cats", "dog", "sand", "and", "cat"]', out: 'false' },
    ],
  },
  'Rabin–Karp substring search': {
    text: `Find every index where the pattern occurs in the text, using a rolling hash: compare hashes first, and check characters only when the hashes match.`,
    ex: [{ in: 'text = "AABAACAADAABAABA", pattern = "AABA"', out: '[0, 9, 12]' }],
  },
  'KMP substring search': {
    text: `Find every index where the pattern occurs in the text in O(n + m) time, using the KMP failure (longest proper prefix that is also a suffix) table.`,
    ex: [{ in: 'text = "ABABDABACDABABCABAB", pattern = "ABABCABAB"', out: '[10]' }],
  },
  'Convert a sentence into its mobile numeric keypad sequence': {
    text: `On an old phone keypad, a letter is typed by pressing its key repeatedly (a = 2, b = 22, c = 222, …, s = 7777, z = 9999), and a space is 0. Convert an uppercase sentence into its key sequence.`,
    ex: [{ in: '"GEEKS"', out: '"4333355777"' }],
  },
  'Minimum bracket reversals to balance an expression': {
    text: `The expression contains only { and }. Reversing a bracket changes { to } or } to {. Return the minimum number of reversals needed to balance it, or −1 if that is impossible (an odd length).`,
    ex: [{ in: '"}{{}}{{{"', out: '3' }, { in: '"{{{"', out: '-1' }],
  },
  'Minimum swaps for bracket balancing': {
    text: `The string has n [ and n ] characters. In one swap you may exchange two adjacent characters. Return the minimum number of swaps needed to balance the string.`,
    ex: [{ in: '"[]][]["', out: '2' }, { in: '"[[][]]"', out: '0' }],
  },
  'Count all palindromic subsequences': {
    text: `Return how many subsequences of the string are palindromes. Subsequences taken from different index sets count separately, even if they spell the same thing.`,
    ex: [{ in: '"abcd"', out: '4' }, { in: '"aab"', out: '4', why: '"a", "a", "b" and "aa".' }],
  },
  'Search a word in a 2D grid of characters': {
    text: `Given a grid of characters and a word, find every cell from which the word can be read in a straight line in any of the 8 directions (horizontal, vertical or diagonal) without changing direction.`,
    ex: [{ in: 'grid = ["GEEKSFORGEEKS", "GEEKSQUIZGEEK", "IDEQAPRACTICE"], word = "GEEKS"', out: '[(0,0), (0,8), (1,0)]' }],
  },
  'Boyer–Moore pattern searching (bad-character rule)': {
    text: `Find every index where the pattern occurs in the text. Use the bad-character rule: on a mismatch, shift the pattern so that the mismatched text character lines up with its last occurrence in the pattern.`,
    ex: [{ in: 'text = "ABAAABCD", pattern = "ABC"', out: '[4]' }],
  },
  'Convert Roman numerals to decimal': {
    text: `Convert a valid Roman numeral (I=1, V=5, X=10, L=50, C=100, D=500, M=1000) to an integer. A smaller symbol placed before a larger one is subtracted: IV = 4, CM = 900.`,
    ex: [{ in: '"MCMXCIV"', out: '1994', why: 'M (1000) + CM (900) + XC (90) + IV (4).' }],
  },
  'Minimum flips to make a binary string alternate': {
    text: `Return the minimum number of characters to flip so that no two adjacent characters of the binary string are equal.`,
    ex: [{ in: '"0001010111"', out: '2', why: 'Flip to "0101010101".' }],
  },
  'Find the first repeated word in a string': {
    text: `Given a sentence, return the first word that appears again later in the sentence (the earliest second occurrence), or report that no word repeats.`,
    ex: [{ in: '"he had had quite enough of this nonsense"', out: '"had"' }],
  },
  'Smallest window containing all distinct characters of itself': {
    text: `Return the length of the smallest substring that contains every distinct character of the whole string.`,
    ex: [{ in: '"aabcbcdbca"', out: '4', why: '"dbca" contains a, b, c and d.' }],
  },
  'Rearrange a string so no two adjacent characters are the same': {
    text: `Rearrange the characters of the string so that no two adjacent characters are equal. Return any valid arrangement, or "" if none exists.`,
    ex: [{ in: '"aab"', out: '"aba"' }, { in: '"aaab"', out: '""', why: 'Three a’s cannot be separated by a single b.' }],
  },
  'Minimum characters to add at front to make a string palindrome': {
    text: `Return the minimum number of characters that must be added to the front of the string to make it a palindrome.`,
    ex: [{ in: '"AACECAAAA"', out: '2', why: 'Add "AA" to get "AAAACECAAAA".' }, { in: '"ABC"', out: '2', why: 'Add "CB" to get "CBABC".' }],
  },
  'Group all anagrams together': {
    text: `Given a list of words, group together the words that are anagrams of each other (same letters, rearranged). Return the groups in any order.`,
    ex: [{ in: '["eat", "tea", "tan", "ate", "nat", "bat"]', out: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]' }],
  },
  'Generate all valid IP addresses from a string': {
    text: `Given a string of digits, return every valid IPv4 address you can form by inserting three dots. Each of the four parts must be between 0 and 255 and must not have a leading zero (so "0" is allowed but "01" is not).`,
    ex: [{ in: '"25525511135"', out: '["255.255.11.135", "255.255.111.35"]' }],
  },
  'Recursively remove all adjacent duplicates': {
    text: `Remove every run of two or more equal adjacent characters. Repeat on the result until no adjacent duplicates remain, then return what is left.`,
    ex: [{ in: '"azxxzy"', out: '"ay"', why: 'Removing "xx" gives "azzy". Removing "zz" gives "ay".' }],
  },
  'Wildcard string matching (? and *)': {
    text: `Return true if the pattern matches the whole string. In the pattern, "?" matches any single character and "*" matches any sequence of characters, including none.`,
    ex: [{ in: 's = "adceb", p = "*a*b"', out: 'true' }, { in: 's = "acdcb", p = "a*c?b"', out: 'false' }],
  },
  'Number of customers who could not get a computer': {
    text: `A café has n computers. The string lists events: the first time a letter appears, that customer arrives; the second time, they leave. An arriving customer takes a free computer, or leaves without one if all are busy (and their later departure changes nothing). Return how many customers could not get a computer.`,
    ex: [{ in: 'n = 2, "ABBAJJKZKZ"', out: '0' }, { in: 'n = 1, "GACCBDDBAGEE"', out: '1', why: 'A arrives while G is still using the only computer.' }],
  },
  'Check if two strings are isomorphic': {
    text: `Two strings are isomorphic if the characters of s can be replaced to get t, using a consistent one-to-one mapping (no two characters map to the same character). Return true if they are.`,
    ex: [{ in: 's = "egg", t = "add"', out: 'true' }, { in: 's = "foo", t = "bar"', out: 'false' }, { in: 's = "badc", t = "baba"', out: 'false' }],
  },
  'Print all sentences from a list of word lists': {
    text: `Given a list of word lists, print every sentence formed by picking exactly one word from each list, in list order.`,
    ex: [{ in: '[["you", "we"], ["have", "are"]]', out: '"you have", "you are", "we have", "we are"' }],
  },

  // ---------------------------------------------------------------- Matrix
  'Spiral traversal of a matrix': {
    text: `Return all elements of an R × C matrix in spiral order: along the top row left to right, down the right column, back along the bottom row, up the left column, then repeat inward.`,
    ex: [{ in: '[[1,2,3], [4,5,6], [7,8,9]]', out: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' }],
  },
  'Search an element in a matrix': {
    text: `Return true if target is in the matrix. There are two common variants: (a) each row is sorted and each row starts after the previous row ends (fully sorted in row-major order); (b) every row and every column is sorted on its own.`,
    ex: [{ in: '[[1,3,5,7], [10,11,16,20], [23,30,34,60]], target = 3', out: 'true' }],
  },
  'Median in a row-wise sorted matrix': {
    text: `Given an R × C matrix where each row is sorted and R × C is odd, return the median of all its elements without flattening and sorting them.`,
    ex: [{ in: '[[1,3,5], [2,6,9], [3,6,9]]', out: '5', why: 'Sorted: 1 2 3 3 5 6 6 9 9. The middle value is 5.' }],
  },
  'Row with the maximum number of 1s': {
    text: `In a binary matrix whose rows are sorted (all 0s, then all 1s), return the index of the first row with the most 1s, or −1 if the matrix has no 1s.`,
    ex: [{ in: '[[0,1,1,1], [0,0,1,1], [1,1,1,1], [0,0,0,0]]', out: '2' }],
  },
  'Print elements in sorted order (row- and column-sorted matrix)': {
    text: `Every row and every column of an n × n matrix is sorted. Print all its elements in sorted order.`,
    ex: [{ in: '[[10,20,30,40], [15,25,35,45], [27,29,37,48], [32,33,39,50]]', out: '10 15 20 25 27 29 30 32 33 35 37 39 40 45 48 50' }],
  },
  'Maximum size rectangle of 1s in a binary matrix': {
    text: `Return the area of the largest rectangle that contains only 1s in a binary matrix.`,
    ex: [{ in: '[[0,1,1,0], [1,1,1,1], [1,1,1,1], [1,1,0,0]]', out: '8', why: 'Rows 1–2, all four columns.' }],
  },
  'Maximum value of a[c][d] − a[a][b] with c > a and d > b': {
    text: `In an n × n matrix, return the maximum of mat[c][d] − mat[a][b] over all index choices where c > a and d > b. The second cell must be strictly below and strictly to the right of the first. Aim for O(n²).`,
    ex: [{ in: '[[1,2,-1,-4,-20], [-8,-3,4,2,1], [3,8,6,1,3], [-4,-1,1,7,-6], [0,-4,10,-5,1]]', out: '18', why: 'mat[4][2] − mat[1][0] = 10 − (−8).' }],
  },
  'Rotate a matrix by 90 degrees': {
    text: `Rotate an n × n matrix by 90 degrees clockwise, in place.`,
    ex: [{ in: '[[1,2,3], [4,5,6], [7,8,9]]', out: '[[7,4,1], [8,5,2], [9,6,3]]' }],
  },
  'Kth smallest element in a row- and column-sorted matrix': {
    text: `Every row and every column of an n × n matrix is sorted in ascending order. Return the kth smallest element overall, counting duplicates.`,
    ex: [{ in: 'matrix = [[1,5,9], [10,11,13], [12,13,15]], k = 8', out: '13' }],
  },
  'Common elements in all rows of a matrix': {
    text: `Return the distinct values that appear in every row of the matrix. The rows are not sorted.`,
    ex: [{ in: '[[1,2,1,4,8], [3,7,8,5,1], [8,7,7,3,1], [8,1,2,7,9]]', out: '[1, 8]' }],
  },

  // ---------------------------------------------------------------- Searching & Sorting
  'Find first and last positions of an element in a sorted array': {
    text: `Given an array sorted in ascending order (it may contain duplicates) and a target, return the first and last indices of the target, or [−1, −1] if it is absent. Use O(log n) time.`,
    ex: [{ in: 'nums = [5, 7, 7, 8, 8, 10], target = 8', out: '[3, 4]' }, { in: 'nums = [5, 7, 7, 8, 8, 10], target = 6', out: '[-1, -1]' }],
  },
  'Search in a rotated sorted array': {
    text: `A sorted array of distinct values was rotated at some unknown pivot (for example [0,1,2,4,5,6,7] became [4,5,6,7,0,1,2]). Return the index of target, or −1 if it is absent, in O(log n) time.`,
    ex: [{ in: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', out: '4' }, { in: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', out: '-1' }],
  },
  'Kth smallest number': {
    text: `Given an unsorted array and k, return the kth smallest element (k = 1 means the minimum). Sorting is O(n log n). Aim for O(n log k), or O(n) on average.`,
    ex: [{ in: 'arr = [7, 10, 4, 3, 20, 15], k = 3', out: '7' }],
  },
  'Find a fixed point (value equal to index)': {
    text: `Given a sorted array of distinct integers, return an index i with arr[i] === i, or −1 if there is none.`,
    ex: [{ in: '[-10, -5, 0, 3, 7]', out: '3' }, { in: '[-10, -5, 3, 4, 7, 9]', out: '-1' }],
  },
  'Integer square root': {
    text: `Given a non-negative integer x, return floor(√x) without using a built-in square-root function.`,
    ex: [{ in: 'x = 8', out: '2', why: '√8 ≈ 2.83.' }, { in: 'x = 16', out: '4' }],
  },
  'Find the repeating and the missing number': {
    text: `An array of size n should contain every number from 1 to n exactly once. Instead, one number appears twice and one is missing. Return both.`,
    ex: [{ in: '[3, 1, 3]', out: 'repeating = 3, missing = 2' }],
  },
  'Majority element (> n/2 times)': {
    text: `Return the element that appears more than n/2 times, or −1 if no such element exists. Aim for O(n) time and O(1) space.`,
    ex: [{ in: '[2, 2, 1, 1, 1, 2, 2]', out: '2' }, { in: '[3, 1, 3, 3, 2]', out: '3' }],
  },
  'Search in an array where adjacent elements differ by at most k': {
    text: `Adjacent elements of the array differ by at most k. Return the first index of x, doing better than checking every element in turn.`,
    ex: [{ in: 'arr = [4, 5, 6, 7, 6], k = 1, x = 6', out: '2' }],
  },
  'Find a pair with a given difference': {
    text: `Return true if there are two elements (at different indices) whose difference is exactly n.`,
    ex: [{ in: 'arr = [5, 20, 3, 2, 50, 80], n = 78', out: 'true', why: '80 − 2 = 78.' }],
  },
  'Find four elements that sum to a given value (4-sum)': {
    text: `Return every unique quadruplet of values (from distinct indices) that sums to target. Do not repeat the same set of values.`,
    ex: [{ in: 'nums = [1, 0, -1, 0, -2, 2], target = 0', out: '[[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]' }],
  },
  'Count triplets with sum smaller than a given value': {
    text: `Return the number of index triplets i < j < k with arr[i] + arr[j] + arr[k] < sum.`,
    ex: [{ in: 'arr = [-2, 0, 1, 3], sum = 2', out: '2', why: '(−2, 0, 1) and (−2, 0, 3).' }],
  },
  'Merge two sorted arrays into a new array': {
    text: `Merge two sorted arrays into a single new sorted array.`,
    ex: [{ in: 'a = [1, 3, 5], b = [2, 4, 6, 8]', out: '[1, 2, 3, 4, 5, 6, 8]' }],
  },
  'Print all subarrays with sum 0': {
    text: `Print the start and end index of every contiguous subarray whose sum is 0.`,
    ex: [{ in: '[6, 3, -1, -3, 4, -2, 2, 4, 6, -12, -7]', out: '(2,4), (2,6), (5,6), (6,9), (0,10)' }],
  },
  'Product array puzzle (product of all except self)': {
    text: `Return an array whose ith element is the product of every element except nums[i]. Do not use division, and aim for O(n) time.`,
    ex: [{ in: '[1, 2, 3, 4]', out: '[24, 12, 8, 6]' }, { in: '[-1, 1, 0, -3, 3]', out: '[0, 0, 9, 0, 0]' }],
  },
  'Sort an array by the number of set bits': {
    text: `Sort the integers in decreasing order of how many 1 bits their binary form has. Numbers with the same count keep their original relative order (a stable sort).`,
    ex: [{ in: '[5, 2, 3, 9, 4, 6, 7, 15, 32]', out: '[15, 7, 5, 3, 9, 6, 2, 4, 32]' }],
  },
  'Minimum number of swaps to sort an array': {
    text: `The array holds distinct values. Return the minimum number of swaps (of any two elements) needed to sort it.`,
    ex: [{ in: '[2, 8, 5, 4]', out: '1', why: 'Swap 8 and 4.' }, { in: '[10, 19, 6, 3, 5]', out: '2' }],
  },
  'Bishu and Soldiers': {
    text: `Bishu has power P. He defeats every soldier whose power is at most P. Given the soldiers' powers and several queries of P, report for each query how many soldiers he defeats and the sum of their powers.`,
    ex: [{ in: 'powers = [1, 2, 3, 4, 5, 6, 7], queries = [3, 10, 2]', out: '(3, 6), (7, 28), (2, 3)' }],
  },
  'Kth element of two sorted arrays': {
    text: `Given two sorted arrays, return the kth smallest element (1-indexed) of their combined sorted order, without merging them. Aim for O(log(min(m, n))).`,
    ex: [{ in: 'a = [2, 3, 6, 7, 9], b = [1, 4, 8, 10], k = 5', out: '6' }],
  },
  'Binary search on the answer — Aggressive Cows, Book Allocation, Painter’s Partition, EKO, ROTI-Prata': {
    text: `A family of problems where you binary-search the answer itself:

Aggressive Cows — place c cows in n stalls (given positions) so that the minimum distance between any two cows is as large as possible. Return that distance.

Book Allocation / Painter's Partition — split an array into k contiguous parts so that the largest part-sum is as small as possible. Return that sum.

EKO — choose the tallest saw height H such that the wood cut from the tree tops above H is at least M.

ROTI-Prata — cooks with given ranks make p pratas together (a rank-r cook needs r, 2r, 3r… minutes for successive pratas). Return the minimum time.`,
    ex: [
      { in: 'Cows: stalls = [1, 2, 4, 8, 9], cows = 3', out: '3', why: 'Place them at 1, 4 and 8 (or 9).' },
      { in: 'Books: pages = [12, 34, 67, 90], students = 2', out: '113', why: '[12, 34, 67] and [90].' },
    ],
  },
  'Find pivot (minimum) in a rotated sorted array': {
    text: `A sorted array of distinct values was rotated at an unknown point. Return its minimum element (the rotation point) in O(log n) time.`,
    ex: [{ in: '[3, 4, 5, 1, 2]', out: '1' }, { in: '[11, 13, 15, 17]', out: '11', why: 'Not rotated.' }],
  },
  'Missing number in an arithmetic progression': {
    text: `The array is an arithmetic progression with exactly one term missing from the middle. Return the missing term in O(log n) time.`,
    ex: [{ in: '[2, 4, 8, 10, 12, 14]', out: '6' }],
  },
  'Smallest number whose factorial has at least n trailing zeros': {
    text: `Return the smallest integer m such that m! ends with at least n zeros.`,
    ex: [{ in: 'n = 1', out: '5', why: '5! = 120.' }, { in: 'n = 6', out: '25', why: '25! has 6 trailing zeros, but 24! has only 4.' }],
  },
  'DoubleHelix — maximum sum path across two arrays': {
    text: `Two sorted arrays share some values ("intersection points"). You walk through one array from left to right, and at any shared value you may switch to the other array and continue from that value. Return the largest possible sum of the values you visit.`,
    ex: [{ in: 'a = [3, 5, 7, 9, 20, 25, 30, 40, 55, 56, 57, 60, 62], b = [1, 4, 7, 11, 14, 25, 44, 47, 55, 57, 100]', out: '450' }],
  },
  'Subset sums (all possible sums of subsets)': {
    text: `Return the sums of all 2^n subsets of the array (including the empty subset, which sums to 0), in any order or sorted.`,
    ex: [{ in: '[2, 3]', out: '[0, 2, 3, 5]' }],
  },
  'Implement in-place merge sort': {
    text: `Sort an array with merge sort, but merge the two halves inside the array itself rather than into an auxiliary array. Explain the time-and-space trade-off this makes.`,
    ex: [{ in: '[12, 11, 13, 5, 6, 7]', out: '[5, 6, 7, 11, 12, 13]' }],
  },
  'Sort an array with many repeated entries (3-way quicksort)': {
    text: `Sort an array that has many duplicate values efficiently. Plain quicksort degrades to O(n²) on many equal keys. Partition into less than, equal to and greater than the pivot instead.`,
    ex: [{ in: '[4, 9, 4, 4, 1, 9, 4, 4, 9, 4, 4, 1, 4]', out: '[1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 9]' }],
  },
};
