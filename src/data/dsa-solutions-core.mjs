/**
 * Worked solutions for Interview Core problems (/dsa/core) that have no
 * equivalent in the 450-sheet solutions. Same shape as dsa-solutions.mjs;
 * `problem` matches the core list name exactly. Merged into `solutions` there.
 *
 * Code lives in template literals — never use `${` inside `code`.
 */

/** @type {import('./dsa-solutions.mjs').solutions} */
export const coreSolutions = [
  // ---------------------------------------------------------------- Hashing
  {
    topic: 'Array',
    problem: 'Contains Duplicate',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort, compare neighbours',
        idea: 'After sorting, duplicates sit next to each other.',
        time: 'O(n log n)',
        space: 'O(1) extra (mutates input)',
        code: `function containsDuplicate(nums) {
  nums.sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) if (nums[i] === nums[i - 1]) return true;
  return false;
}`,
      },
      {
        name: 'Hash set',
        idea: 'Return true the first time a value is already in the set.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
        note: 'One-liner: new Set(nums).size !== nums.length — but it cannot exit early.',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Valid Anagram',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort both',
        idea: 'Anagrams have identical sorted forms.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `const isAnagram = (s, t) =>
  s.length === t.length && [...s].sort().join('') === [...t].sort().join('');`,
      },
      {
        name: 'Count array',
        idea: 'Increment for s, decrement for t; every count must end at zero.',
        time: 'O(n)',
        space: 'O(1) — 26 letters (use a Map for Unicode)',
        code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const cnt = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    cnt[s.charCodeAt(i) - 97]++;
    cnt[t.charCodeAt(i) - 97]--;
  }
  return cnt.every((c) => c === 0);
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Top K Frequent Elements',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Count + sort',
        idea: 'Count with a map, sort entries by count descending, take k.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function topKFrequent(nums, k) {
  const cnt = new Map();
  for (const x of nums) cnt.set(x, (cnt.get(x) ?? 0) + 1);
  return [...cnt].sort((a, b) => b[1] - a[1]).slice(0, k).map(([x]) => x);
}`,
      },
      {
        name: 'Bucket sort by frequency',
        idea: 'A count is between 1 and n, so bucket values by count and read buckets from high to low.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function topKFrequent(nums, k) {
  const cnt = new Map();
  for (const x of nums) cnt.set(x, (cnt.get(x) ?? 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [x, c] of cnt) buckets[c].push(x);
  const res = [];
  for (let c = nums.length; c > 0 && res.length < k; c--) res.push(...buckets[c]);
  return res.slice(0, k);
}`,
        note: 'A min-heap of size k is O(n log k) and is the answer interviewers expect if they forbid bucket sort.',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'First Unique Character in a String',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two passes with a count',
        idea: 'Count every character, then return the first index whose count is 1.',
        time: 'O(n)',
        space: 'O(1) — alphabet size',
        code: `function firstUniqChar(s) {
  const cnt = new Map();
  for (const c of s) cnt.set(c, (cnt.get(c) ?? 0) + 1);
  for (let i = 0; i < s.length; i++) if (cnt.get(s[i]) === 1) return i;
  return -1;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Encode and Decode Strings',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Length prefix',
        idea: 'Write each string as "<length>#<string>". The decoder reads digits up to "#", then exactly that many characters — so "#" inside a string is harmless.',
        time: 'O(total length)',
        space: 'O(total length)',
        code: `const encode = (strs) => strs.map((s) => s.length + '#' + s).join('');

function decode(str) {
  const res = [];
  let i = 0;
  while (i < str.length) {
    const hash = str.indexOf('#', i);
    const len = Number(str.slice(i, hash));
    res.push(str.slice(hash + 1, hash + 1 + len));
    i = hash + 1 + len;
  }
  return res;
}`,
        note: 'Joining with a delimiter breaks when a string contains the delimiter — say why you rejected it.',
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Valid Sudoku',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'One pass with sets per row, column and box',
        idea: 'Box index is floor(r/3)*3 + floor(c/3). Reject a digit already seen in any of its three units.',
        time: 'O(81) = O(1)',
        space: 'O(1)',
        code: `function isValidSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) return false;
      rows[r].add(v); cols[c].add(v); boxes[b].add(v);
    }
  }
  return true;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Prefix sum
  {
    topic: 'Array',
    problem: 'Range Sum Query – Immutable',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Prefix sums',
        idea: 'pre[i] = sum of the first i numbers; sum(l..r) = pre[r+1] − pre[l]. The leading zero removes the l = 0 special case.',
        time: 'O(n) build, O(1) per query',
        space: 'O(n)',
        code: `class NumArray {
  constructor(nums) {
    this.pre = [0];
    for (const x of nums) this.pre.push(this.pre[this.pre.length - 1] + x);
  }
  sumRange(l, r) {
    return this.pre[r + 1] - this.pre[l];
  }
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'All start points',
        idea: 'Fix a start, extend the end while keeping a running sum.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function subarraySum(nums, k) {
  let res = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) if ((sum += nums[j]) === k) res++;
  }
  return res;
}`,
      },
      {
        name: 'Prefix sum counts in a map',
        idea: 'A subarray ending here sums to k when some earlier prefix equals sum − k. Count how many earlier prefixes had each value.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let sum = 0, res = 0;
  for (const x of nums) {
    sum += x;
    res += count.get(sum - k) ?? 0;
    count.set(sum, (count.get(sum) ?? 0) + 1);
  }
  return res;
}`,
        note: 'Sliding window fails here because numbers can be negative — interviewers often ask why.',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Continuous Subarray Sum',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Prefix remainders',
        idea: 'Two prefixes with the same remainder mod k bound a subarray whose sum is a multiple of k. Store the first index of each remainder; require length ≥ 2.',
        time: 'O(n)',
        space: 'O(min(n, k))',
        code: `function checkSubarraySum(nums, k) {
  const first = new Map([[0, -1]]); // remainder -> earliest index
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum = (sum + nums[i]) % k;
    if (first.has(sum)) {
      if (i - first.get(sum) >= 2) return true;
    } else first.set(sum, i);
  }
  return false;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Contiguous Array (equal 0s and 1s)',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Treat 0 as −1, earliest prefix index',
        idea: 'With 0 → −1, equal counts mean a zero-sum subarray: the same running sum seen twice. Keep the earliest index for each sum to maximise length.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function findMaxLength(nums) {
  const first = new Map([[0, -1]]);
  let sum = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i] === 1 ? 1 : -1;
    if (first.has(sum)) best = Math.max(best, i - first.get(sum));
    else first.set(sum, i);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Subarray Sums Divisible by K',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Count prefix remainders',
        idea: 'Every pair of equal prefix remainders is one valid subarray. Normalise negative remainders with ((x % k) + k) % k.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function subarraysDivByK(nums, k) {
  const cnt = new Array(k).fill(0);
  cnt[0] = 1;
  let sum = 0, res = 0;
  for (const x of nums) {
    sum = (((sum + x) % k) + k) % k;
    res += cnt[sum]++;
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Range Sum Query 2D – Immutable',
    difficulty: 'Medium',
    approaches: [
      {
        name: '2-D prefix sums (inclusion–exclusion)',
        idea: 'P[r+1][c+1] = sum of the rectangle (0,0)..(r,c). A query adds the big rectangle, subtracts the strips above and left, and adds back the doubly-removed corner.',
        time: 'O(R·C) build, O(1) per query',
        space: 'O(R·C)',
        code: `class NumMatrix {
  constructor(m) {
    const R = m.length, C = m[0].length;
    this.P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++)
        this.P[r + 1][c + 1] = m[r][c] + this.P[r][c + 1] + this.P[r + 1][c] - this.P[r][c];
  }
  sumRegion(r1, c1, r2, c2) {
    const P = this.P;
    return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
  }
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Two pointers
  {
    topic: 'String',
    problem: 'Valid Palindrome',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers, skip non-alphanumerics',
        idea: 'Walk inward from both ends, skipping anything that is not a letter or digit, comparing case-insensitively.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isPalindrome(s) {
  const ok = (c) => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (!ok(s[l])) l++;
    else if (!ok(s[r])) r--;
    else if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    else { l++; r--; }
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Two Sum II – Input Array Is Sorted',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two pointers from both ends',
        idea: 'Sum too small → move left up; too big → move right down. Sorting guarantees nothing is skipped. Answer is 1-indexed.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const s = numbers[l] + numbers[r];
    if (s === target) return [l + 1, r + 1];
    s < target ? l++ : r--;
  }
  return [];
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Container With Most Water',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Every pair',
        idea: 'Area = width × shorter height, for all pairs.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function maxArea(h) {
  let best = 0;
  for (let i = 0; i < h.length; i++)
    for (let j = i + 1; j < h.length; j++)
      best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
  return best;
}`,
      },
      {
        name: 'Two pointers, move the shorter side',
        idea: 'Moving the taller line can only shrink width without raising the limiting height, so always move the shorter one.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, (r - l) * Math.min(h[l], h[r]));
    h[l] < h[r] ? l++ : r--;
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Slow write pointer',
        idea: 'k marks the end of the unique prefix; copy a value forward only when it differs from the last kept value.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeDuplicates(nums) {
  let k = 0;
  for (const x of nums) if (k === 0 || x !== nums[k - 1]) nums[k++] = x;
  return k;
}`,
        note: 'Variant "allow at most two": compare with nums[k - 2] instead.',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Move Zeroes',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Swap non-zeros forward',
        idea: 'Keep a write pointer for the next non-zero slot; swapping preserves the order of non-zeros and pushes zeros back.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function moveZeroes(nums) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[k], nums[i]] = [nums[i], nums[k]];
      k++;
    }
  }
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Cyclic sort
  {
    topic: 'Array',
    problem: 'Missing Number',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sum formula',
        idea: 'Expected sum of 0..n minus the actual sum.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function missingNumber(nums) {
  const n = nums.length;
  return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);
}`,
      },
      {
        name: 'XOR',
        idea: 'XOR every index and every value; pairs cancel, the missing number remains. No overflow risk.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Find All Numbers Disappeared in an Array',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Mark by negating',
        idea: 'For each value v, negate nums[v − 1]. Indices still positive at the end were never visited.',
        time: 'O(n)',
        space: 'O(1) extra',
        code: `function findDisappearedNumbers(nums) {
  for (const x of nums) {
    const i = Math.abs(x) - 1;
    if (nums[i] > 0) nums[i] = -nums[i];
  }
  const res = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) res.push(i + 1);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Find All Duplicates in an Array',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Mark by negating',
        idea: 'Visiting v flips nums[v − 1] negative; if it is already negative, v has been seen before.',
        time: 'O(n)',
        space: 'O(1) extra',
        code: `function findDuplicates(nums) {
  const res = [];
  for (const x of nums) {
    const i = Math.abs(x) - 1;
    if (nums[i] < 0) res.push(i + 1);
    else nums[i] = -nums[i];
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'First Missing Positive',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Hash set',
        idea: 'Put everything in a set, then test 1, 2, 3… — simple but O(n) space.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function firstMissingPositive(nums) {
  const s = new Set(nums);
  let i = 1;
  while (s.has(i)) i++;
  return i;
}`,
      },
      {
        name: 'Cyclic sort',
        idea: 'The answer is in 1..n+1. Swap each value v in range into index v − 1; the first index i with nums[i] ≠ i + 1 gives the answer.',
        time: 'O(n) — each swap fixes one value',
        space: 'O(1)',
        code: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
  return n + 1;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Sliding window
  {
    topic: 'String',
    problem: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Window with a set',
        idea: 'Grow right; while the new char is already in the window, remove from the left.',
        time: 'O(n)',
        space: 'O(alphabet)',
        code: `function lengthOfLongestSubstring(s) {
  const win = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (win.has(s[r])) win.delete(s[l++]);
    win.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      },
      {
        name: 'Jump using last-seen index',
        idea: 'Store each char’s last index; on a repeat inside the window, jump l straight past it.',
        time: 'O(n)',
        space: 'O(alphabet)',
        code: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1;
    last.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Window with max frequency',
        idea: 'A window is valid when length − (count of its most common char) ≤ k. maxFreq never needs to decrease: a smaller one cannot produce a longer answer.',
        time: 'O(n)',
        space: 'O(26)',
        code: `function characterReplacement(s, k) {
  const cnt = new Array(26).fill(0);
  let l = 0, maxFreq = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++cnt[s.charCodeAt(r) - 65]);
    while (r - l + 1 - maxFreq > k) cnt[s.charCodeAt(l++) - 65]--;
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Permutation in String',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Fixed window of counts',
        idea: 'Slide a window of length |s1| over s2 and compare the 26 counts. Track how many letters match to make each step O(1).',
        time: 'O(|s2|)',
        space: 'O(26)',
        code: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0), win = new Array(26).fill(0);
  const idx = (c) => c.charCodeAt(0) - 97;
  for (let i = 0; i < s1.length; i++) { need[idx(s1[i])]++; win[idx(s2[i])]++; }
  let matches = 0;
  for (let i = 0; i < 26; i++) if (need[i] === win[i]) matches++;
  for (let r = s1.length; r < s2.length; r++) {
    if (matches === 26) return true;
    for (const [c, d] of [[idx(s2[r]), 1], [idx(s2[r - s1.length]), -1]]) {
      if (win[c] === need[c]) matches--;
      win[c] += d;
      if (win[c] === need[c]) matches++;
    }
  }
  return matches === 26;
}`,
        note: 'Comparing the two 26-arrays on every step is also O(26·n) and is fine to present first.',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Window with at most k zeros',
        idea: 'Expand right counting zeros; shrink left while more than k zeros are inside.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function longestOnes(nums, k) {
  let l = 0, zeros = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) zeros++;
    while (zeros > k) if (nums[l++] === 0) zeros--;
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Fruit Into Baskets (at most k distinct)',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Window with a count map',
        idea: 'Longest subarray with at most 2 (generally k) distinct values: shrink while the map has more than k keys.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function totalFruit(fruits, k = 2) {
  const cnt = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < fruits.length; r++) {
    cnt.set(fruits[r], (cnt.get(fruits[r]) ?? 0) + 1);
    while (cnt.size > k) {
      const f = fruits[l++];
      cnt.set(f, cnt.get(f) - 1);
      if (cnt.get(f) === 0) cnt.delete(f);
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Binary search
  {
    topic: 'Searching & Sorting',
    problem: 'Binary Search',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Closed interval [lo, hi]',
        idea: 'Halve the range each step; stop when lo passes hi.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        note: 'Pick one interval convention (closed or half-open) and use it everywhere — mixing them causes off-by-one bugs.',
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Find Peak Element',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search on the slope',
        idea: 'If nums[mid] < nums[mid + 1] a peak lies to the right (the sequence must come down eventually); otherwise one lies at mid or to the left.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Per-key list + upper-bound search',
        idea: 'Timestamps arrive increasing, so each key’s list is already sorted. get finds the last entry with timestamp ≤ t.',
        time: 'set O(1), get O(log n)',
        space: 'O(n)',
        code: `class TimeMap {
  constructor() { this.m = new Map(); }
  set(key, value, t) {
    if (!this.m.has(key)) this.m.set(key, []);
    this.m.get(key).push([t, value]);
  }
  get(key, t) {
    const a = this.m.get(key) ?? [];
    let lo = 0, hi = a.length; // first index with time > t
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid][0] <= t) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? '' : a[lo - 1][1];
  }
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Koko Eating Bananas',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search on the speed',
        idea: 'Hours needed falls as speed rises (monotonic). Find the smallest speed in [1, max pile] that finishes within h.',
        time: 'O(n log max)',
        space: 'O(1)',
        code: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = (lo + hi) >> 1;
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) hi = k;
    else lo = k + 1;
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Capacity To Ship Packages Within D Days',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search on capacity + greedy check',
        idea: 'Capacity lies between the heaviest package and the total weight. For a guess, greedily fill each day and count days.',
        time: 'O(n log sum)',
        space: 'O(1)',
        code: `function shipWithinDays(weights, days) {
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  const daysNeeded = (cap) => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  };
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (daysNeeded(mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Minimum Number of Days to Make m Bouquets',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search on the day',
        idea: 'By day d every flower with bloomDay ≤ d is open; count runs of k adjacent open flowers. More days never means fewer bouquets.',
        time: 'O(n log max)',
        space: 'O(1)',
        code: `function minDays(bloomDay, m, k) {
  if (m * k > bloomDay.length) return -1;
  const canMake = (day) => {
    let bouquets = 0, run = 0;
    for (const b of bloomDay) {
      run = b <= day ? run + 1 : 0;
      if (run === k) { bouquets++; run = 0; }
    }
    return bouquets >= m;
  };
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canMake(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Stack / monotonic
  {
    topic: 'Stacks & Queues',
    problem: 'Daily Temperatures',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic decreasing stack of indices',
        idea: 'Keep days still waiting for a warmer one. A warmer day pops and answers every colder day on top.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function dailyTemperatures(t) {
  const res = new Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) {
      const j = st.pop();
      res[j] = i - j;
    }
    st.push(i);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Next Greater Element II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic stack over two passes',
        idea: 'Circular array: iterate 2n times using i % n so elements near the end can see the start. Only push during the first pass.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function nextGreaterElements(nums) {
  const n = nums.length, res = new Array(n).fill(-1), st = [];
  for (let i = 0; i < 2 * n; i++) {
    const x = nums[i % n];
    while (st.length && x > nums[st[st.length - 1]]) res[st.pop()] = x;
    if (i < n) st.push(i);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Decode String',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Stack of (previous string, repeat count)',
        idea: 'On "[" save the current string and number and start fresh; on "]" pop and append the current string repeated.',
        time: 'O(output length)',
        space: 'O(output length)',
        code: `function decodeString(s) {
  const st = [];
  let cur = '', num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + Number(c);
    else if (c === '[') { st.push([cur, num]); cur = ''; num = 0; }
    else if (c === ']') { const [prev, k] = st.pop(); cur = prev + cur.repeat(k); }
    else cur += c;
  }
  return cur;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Asteroid Collision',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Stack of survivors',
        idea: 'Only a left-moving asteroid meeting a right-moving one on the stack collides. Pop smaller ones; destroy both on a tie.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function asteroidCollision(asteroids) {
  const st = [];
  for (const a of asteroids) {
    let alive = true;
    while (alive && a < 0 && st.length && st[st.length - 1] > 0) {
      const top = st[st.length - 1];
      if (top < -a) st.pop();
      else { if (top === -a) st.pop(); alive = false; }
    }
    if (alive) st.push(a);
  }
  return st;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Online Stock Span',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic stack of [price, span]',
        idea: 'Absorb every earlier price ≤ today’s, adding their spans. Each price is pushed and popped once.',
        time: 'O(1) amortised per call',
        space: 'O(n)',
        code: `class StockSpanner {
  constructor() { this.st = []; }
  next(price) {
    let span = 1;
    while (this.st.length && this.st[this.st.length - 1][0] <= price) span += this.st.pop()[1];
    this.st.push([price, span]);
    return span;
  }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Shortest Subarray with Sum at Least K',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Prefix sums + monotonic deque',
        idea: 'Keep candidate start prefixes in increasing order. While the current prefix minus the front is ≥ k, record and drop the front (it cannot do better later). Drop back entries ≥ current prefix — a later, smaller start is always better. Negatives are why a plain sliding window fails.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function shortestSubarray(nums, k) {
  const n = nums.length, pre = [0];
  for (const x of nums) pre.push(pre[pre.length - 1] + x);
  const dq = []; let head = 0, best = Infinity;
  for (let i = 0; i <= n; i++) {
    while (head < dq.length && pre[i] - pre[dq[head]] >= k) best = Math.min(best, i - dq[head++]);
    while (dq.length > head && pre[dq[dq.length - 1]] >= pre[i]) dq.pop();
    dq.push(i);
  }
  return best === Infinity ? -1 : best;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Linked list
  {
    topic: 'LinkedList',
    problem: 'Reorder List',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Middle + reverse + merge',
        idea: 'L0→Ln→L1→Ln−1…: split at the middle (fast/slow), reverse the second half, then weave the two halves together.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reorderList(head) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null, cur = slow.next;
  slow.next = null;
  while (cur) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
  let a = head, b = prev;
  while (b) {
    const an = a.next, bn = b.next;
    a.next = b; b.next = an;
    a = an; b = bn;
  }
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Trees
  {
    topic: 'Binary Trees',
    problem: 'Same Tree',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Parallel recursion',
        idea: 'Both empty → same; one empty or values differ → different; else compare children.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isSameTree(p, q) {
  if (!p || !q) return p === q;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        note: 'Subtree of Another Tree reuses this at every node of the larger tree.',
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Path Sum II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS with a path (backtracking)',
        idea: 'Push the node, subtract its value; at a leaf with remaining 0 record a copy; pop on the way back.',
        time: 'O(n²) worst case — copying paths',
        space: 'O(h)',
        code: `function pathSum(root, target) {
  const res = [], path = [];
  const dfs = (node, rem) => {
    if (!node) return;
    path.push(node.val);
    rem -= node.val;
    if (!node.left && !node.right && rem === 0) res.push([...path]);
    dfs(node.left, rem);
    dfs(node.right, rem);
    path.pop();
  };
  dfs(root, target);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Count Good Nodes in Binary Tree',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS carrying the path maximum',
        idea: 'A node is good if its value ≥ the maximum seen from the root to it.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function goodNodes(root) {
  const dfs = (node, max) => {
    if (!node) return 0;
    const good = node.val >= max ? 1 : 0;
    max = Math.max(max, node.val);
    return good + dfs(node.left, max) + dfs(node.right, max);
  };
  return dfs(root, -Infinity);
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Post-order: return best downward gain, update global best',
        idea: 'At each node, the path that bends here is val + left gain + right gain (gains clipped at 0). Only one side can continue upward, so return val + max(gain).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function maxPathSum(root) {
  let best = -Infinity;
  const gain = (node) => {
    if (!node) return 0;
    const l = Math.max(0, gain(node.left));
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`,
        note: 'Same shape as diameter: "answer through this node" differs from "value returned to parent".',
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Pre-order with null markers',
        idea: 'Write values in pre-order with "#" for null. Reading back in the same order rebuilds the tree uniquely.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function serialize(root) {
  const out = [];
  const dfs = (n) => {
    if (!n) { out.push('#'); return; }
    out.push(n.val);
    dfs(n.left); dfs(n.right);
  };
  dfs(root);
  return out.join(',');
}

function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  const build = () => {
    const v = vals[i++];
    if (v === '#') return null;
    const node = new TreeNode(Number(v));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}`,
        note: 'BFS level order with nulls (LeetCode’s own format) also works; mention the choice.',
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Lowest Common Ancestor of a BST',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Walk down using ordering',
        idea: 'Both values smaller → go left; both larger → go right; otherwise this node splits them and is the LCA.',
        time: 'O(h)',
        space: 'O(1)',
        code: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Convert Sorted Array to BST',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Middle as root, recurse',
        idea: 'Choosing the middle element keeps both halves equal in size, giving a height-balanced tree.',
        time: 'O(n)',
        space: 'O(log n)',
        code: `function sortedArrayToBST(nums, lo = 0, hi = nums.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  const node = new TreeNode(nums[mid]);
  node.left = sortedArrayToBST(nums, lo, mid - 1);
  node.right = sortedArrayToBST(nums, mid + 1, hi);
  return node;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Heap
  {
    topic: 'Heap',
    problem: 'K Closest Points to Origin',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort by distance',
        idea: 'Sort by x² + y² (no square root needed) and take k.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `const kClosest = (points, k) =>
  points.sort((a, b) => a[0] ** 2 + a[1] ** 2 - (b[0] ** 2 + b[1] ** 2)).slice(0, k);`,
      },
      {
        name: 'Max-heap of size k',
        idea: 'Keep the k closest so far; the root is the farthest of them and gets evicted when a closer point arrives. MinHeap is the class from the patterns page with a reversed comparator.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function kClosest(points, k) {
  const d = ([x, y]) => x * x + y * y;
  const heap = new MinHeap((a, b) => d(b) - d(a)); // max-heap by distance
  for (const p of points) {
    heap.push(p);
    if (heap.size > k) heap.pop();
  }
  return heap.a;
}`,
        note: 'Quickselect gives O(n) average if asked for better than n log k.',
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Last Stone Weight',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Max-heap simulation',
        idea: 'Repeatedly smash the two heaviest; push back the difference if non-zero.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function lastStoneWeight(stones) {
  const heap = new MinHeap((a, b) => b - a);
  stones.forEach((s) => heap.push(s));
  while (heap.size > 1) {
    const y = heap.pop(), x = heap.pop();
    if (y !== x) heap.push(y - x);
  }
  return heap.size ? heap.peek() : 0;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Task Scheduler',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Counting formula',
        idea: 'The most frequent task (count f) forces (f − 1) blocks of length n + 1, plus one slot for each task tied at count f. If tasks outnumber that, no idle is needed.',
        time: 'O(n)',
        space: 'O(26)',
        code: `function leastInterval(tasks, n) {
  const cnt = new Array(26).fill(0);
  for (const t of tasks) cnt[t.charCodeAt(0) - 65]++;
  const f = Math.max(...cnt);
  const tied = cnt.filter((c) => c === f).length;
  return Math.max(tasks.length, (f - 1) * (n + 1) + tied);
}`,
        note: 'The simulation (max-heap of counts + cooldown queue) is O(total time) and easier to derive live — present it if the formula does not come to you.',
      },
    ],
  },

  // ---------------------------------------------------------------- Graphs
  {
    topic: 'Graph',
    problem: 'Max Area of Island',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS returning area',
        idea: 'Sink each land cell as you visit it and return 1 + the areas of its four neighbours.',
        time: 'O(R·C)',
        space: 'O(R·C) recursion worst case',
        code: `function maxAreaOfIsland(grid) {
  const R = grid.length, C = grid[0].length;
  const area = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== 1) return 0;
    grid[r][c] = 0;
    return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) best = Math.max(best, area(r, c));
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Reverse flow from each ocean',
        idea: 'Instead of testing every cell, spread uphill from each ocean’s border. Cells reached from both oceans are the answer.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function pacificAtlantic(h) {
  const R = h.length, C = h[0].length;
  const mk = () => Array.from({ length: R }, () => new Array(C).fill(false));
  const pac = mk(), atl = mk();
  const dfs = (r, c, seen) => {
    seen[r][c] = true;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && !seen[nr][nc] && h[nr][nc] >= h[r][c])
        dfs(nr, nc, seen);
    }
  };
  for (let r = 0; r < R; r++) { dfs(r, 0, pac); dfs(r, C - 1, atl); }
  for (let c = 0; c < C; c++) { dfs(0, c, pac); dfs(R - 1, c, atl); }
  const res = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (pac[r][c] && atl[r][c]) res.push([r, c]);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Surrounded Regions',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Protect border-connected cells, flip the rest',
        idea: 'Any "O" connected to the border survives. Mark those from the border as "S", flip remaining "O" to "X", then restore "S" to "O".',
        time: 'O(R·C)',
        space: 'O(R·C) recursion worst case',
        code: `function solve(board) {
  const R = board.length, C = board[0].length;
  const mark = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== 'O') return;
    board[r][c] = 'S';
    mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1);
  };
  for (let r = 0; r < R; r++) { mark(r, 0); mark(r, C - 1); }
  for (let c = 0; c < C; c++) { mark(0, c); mark(R - 1, c); }
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      board[r][c] = board[r][c] === 'S' ? 'O' : 'X';
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Minimum Height Trees',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Peel leaves layer by layer',
        idea: 'Topological-sort style on an undirected tree: repeatedly remove all leaves (degree 1). The last one or two nodes are the centres.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function findMinHeightTrees(n, edges) {
  if (n === 1) return [0];
  const adj = Array.from({ length: n }, () => []);
  const deg = new Array(n).fill(0);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); deg[a]++; deg[b]++; }
  let leaves = [];
  for (let i = 0; i < n; i++) if (deg[i] === 1) leaves.push(i);
  let left = n;
  while (left > 2) {
    left -= leaves.length;
    const next = [];
    for (const u of leaves) for (const v of adj[u]) if (--deg[v] === 1) next.push(v);
    leaves = next;
  }
  return leaves;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Union-Find
  {
    topic: 'Graph',
    problem: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS from each unvisited node',
        idea: 'Each DFS start is a new component.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const seen = new Array(n).fill(false);
  const dfs = (u) => { seen[u] = true; for (const v of adj[u]) if (!seen[v]) dfs(v); };
  let count = 0;
  for (let i = 0; i < n; i++) if (!seen[i]) { count++; dfs(i); }
  return count;
}`,
      },
      {
        name: 'Union-Find',
        idea: 'Start with n components; every successful union merges two, so subtract one.',
        time: 'O(E · α(n))',
        space: 'O(n)',
        code: `function countComponents(n, edges) {
  const parent = [...Array(n).keys()];
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let count = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; count--; }
  }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Graph Valid Tree',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Edge count + Union-Find',
        idea: 'A tree on n nodes has exactly n − 1 edges and no cycle. With the right edge count, any union that finds both ends already joined means a cycle.',
        time: 'O(n · α(n))',
        space: 'O(n)',
        code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = [...Array(n).keys()];
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Accounts Merge',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Union-Find over emails',
        idea: 'Union every email in an account with that account’s first email. Group emails by root, sort each group, prefix the owner’s name.',
        time: 'O(N log N) — N total emails, dominated by sorting',
        space: 'O(N)',
        code: `function accountsMerge(accounts) {
  const parent = new Map(), owner = new Map();
  const find = (x) => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  };
  for (const [name, ...emails] of accounts) {
    for (const e of emails) {
      if (!parent.has(e)) parent.set(e, e);
      owner.set(e, name);
      parent.set(find(e), find(emails[0]));
    }
  }
  const groups = new Map();
  for (const e of parent.keys()) {
    const r = find(e);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(e);
  }
  return [...groups.values()].map((g) => [owner.get(g[0]), ...g.sort()]);
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Number of Provinces',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS on the adjacency matrix',
        idea: 'Count how many DFS starts are needed to visit every city.',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function findCircleNum(M) {
  const n = M.length, seen = new Array(n).fill(false);
  const dfs = (i) => {
    seen[i] = true;
    for (let j = 0; j < n; j++) if (M[i][j] && !seen[j]) dfs(j);
  };
  let count = 0;
  for (let i = 0; i < n; i++) if (!seen[i]) { count++; dfs(i); }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Path With Minimum Effort',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Dijkstra on the maximum step',
        idea: 'Path cost is its largest height difference, not a sum. Dijkstra still works: always expand the cell with the smallest effort so far. MinHeap is the class from the patterns page.',
        time: 'O(R·C log(R·C))',
        space: 'O(R·C)',
        code: `function minimumEffortPath(h) {
  const R = h.length, C = h[0].length;
  const dist = Array.from({ length: R }, () => new Array(C).fill(Infinity));
  dist[0][0] = 0;
  const pq = new MinHeap((a, b) => a[0] - b[0]);
  pq.push([0, 0, 0]);
  while (pq.size) {
    const [d, r, c] = pq.pop();
    if (r === R - 1 && c === C - 1) return d;
    if (d > dist[r][c]) continue; // stale entry
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
      const nd = Math.max(d, Math.abs(h[nr][nc] - h[r][c]));
      if (nd < dist[nr][nc]) { dist[nr][nc] = nd; pq.push([nd, nr, nc]); }
    }
  }
  return 0;
}`,
        note: 'Alternatives: binary search on the effort + BFS, or Union-Find adding edges in increasing weight.',
      },
    ],
  },

  // ---------------------------------------------------------------- Trie
  {
    topic: 'Trie',
    problem: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Trie + DFS on "."',
        idea: 'Insert normally. When searching, a "." branches into every child; a letter follows one edge.',
        time: 'add O(L); search O(L) without dots, up to O(26^L) worst case',
        space: 'O(total characters)',
        code: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) {
    let node = this.root;
    for (const ch of word) node = node[ch] ??= {};
    node.end = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return !!node.end;
      const ch = word[i];
      if (ch !== '.') return !!node[ch] && dfs(node[ch], i + 1);
      for (const k in node) if (k !== 'end' && dfs(node[k], i + 1)) return true;
      return false;
    };
    return dfs(this.root, 0);
  }
}`,
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Word Search II',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Trie of words + one grid DFS',
        idea: 'Running Word Search once per word repeats work. Build a trie, then DFS from each cell following only trie edges. Store the word at its end node, and clear it once found to avoid duplicates.',
        time: 'O(R·C·4·3^(L−1)) worst case',
        space: 'O(total characters)',
        code: `function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) node = node[ch] ??= {};
    node.word = w;
  }
  const R = board.length, C = board[0].length, res = [];
  const dfs = (r, c, parent) => {
    const ch = board[r][c], node = parent[ch];
    if (!node) return;
    if (node.word) { res.push(node.word); node.word = null; }
    board[r][c] = '#';
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && board[nr][nc] !== '#') dfs(nr, nc, node);
    }
    board[r][c] = ch;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, root);
  return res;
}`,
        note: 'Optimisation: delete a trie leaf once its word is found, so dead branches stop being explored.',
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Longest Word in Dictionary',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + set of buildable words',
        idea: 'Sort words (shorter first, then lexicographically). A word is buildable if its prefix without the last char is buildable.',
        time: 'O(n log n · L)',
        space: 'O(n · L)',
        code: `function longestWord(words) {
  words.sort();
  const ok = new Set(['']);
  let best = '';
  for (const w of words) {
    if (ok.has(w.slice(0, -1))) {
      ok.add(w);
      if (w.length > best.length) best = w;
    }
  }
  return best;
}`,
        note: 'Trie version: insert all, then DFS only through nodes that end a word; track the deepest, earliest-lexicographic one.',
      },
    ],
  },

  // ---------------------------------------------------------------- Backtracking
  {
    topic: 'BackTracking',
    problem: 'Subsets II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + skip equal siblings',
        idea: 'Sort so duplicates are adjacent. At one recursion level, use a repeated value only for its first occurrence (i > start && nums[i] === nums[i − 1] → skip).',
        time: 'O(n · 2^n)',
        space: 'O(n)',
        code: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start) => {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      bt(i + 1);
      path.pop();
    }
  };
  bt(0);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Combination Sum II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + skip duplicates + prune',
        idea: 'Each number used at most once (recurse on i + 1). Skip equal siblings like Subsets II, and stop the loop once a candidate exceeds the remaining target.',
        time: 'O(2^n) worst case',
        space: 'O(n)',
        code: `function combinationSum2(cands, target) {
  cands.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start, rem) => {
    if (rem === 0) { res.push([...path]); return; }
    for (let i = start; i < cands.length && cands[i] <= rem; i++) {
      if (i > start && cands[i] === cands[i - 1]) continue;
      path.push(cands[i]);
      bt(i + 1, rem - cands[i]);
      path.pop();
    }
  };
  bt(0, target);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking over digits',
        idea: 'One recursion level per digit, one branch per letter on that key.',
        time: 'O(4^n · n)',
        space: 'O(n)',
        code: `function letterCombinations(digits) {
  if (!digits) return [];
  const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const res = [];
  const bt = (i, cur) => {
    if (i === digits.length) { res.push(cur); return; }
    for (const ch of map[digits[i]]) bt(i + 1, cur + ch);
  };
  bt(0, '');
  return res;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Generate Parentheses',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking with open/close counts',
        idea: 'Add "(" while fewer than n are open; add ")" only while it would not exceed the opens. Every leaf is valid — no filtering needed.',
        time: 'O(4^n / √n) — the nth Catalan number',
        space: 'O(n)',
        code: `function generateParenthesis(n) {
  const res = [];
  const bt = (cur, open, close) => {
    if (cur.length === 2 * n) { res.push(cur); return; }
    if (open < n) bt(cur + '(', open + 1, close);
    if (close < open) bt(cur + ')', open, close + 1);
  };
  bt('', 0, 0);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Word Search',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS with in-place visited marking',
        idea: 'Start from each cell matching word[0]; mark the cell, try four neighbours for the next char, and restore it on return.',
        time: 'O(R·C·3^L)',
        space: 'O(L)',
        code: `function exist(board, word) {
  const R = board.length, C = board[0].length;
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[i]) return false;
    const ch = board[r][c];
    board[r][c] = '#';
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = ch;
    return found;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (dfs(r, c, 0)) return true;
  return false;
}`,
        note: 'Pruning: return false early if the board lacks enough of some letter in the word.',
      },
    ],
  },

  // ---------------------------------------------------------------- 1-D DP
  {
    topic: 'Dynamic Programming',
    problem: 'Climbing Stairs',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two rolling variables',
        idea: 'ways(i) = ways(i − 1) + ways(i − 2): the last step was 1 or 2. It is Fibonacci.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function climbStairs(n) {
  let a = 1, b = 1; // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'House Robber II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two linear runs',
        idea: 'Houses form a circle, so the first and last cannot both be robbed. Answer = max(rob 0..n−2, rob 1..n−1) using the linear House Robber.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function rob(nums) {
  if (nums.length === 1) return nums[0];
  const line = (lo, hi) => {
    let prev = 0, cur = 0;
    for (let i = lo; i <= hi; i++) [prev, cur] = [cur, Math.max(cur, prev + nums[i])];
    return cur;
  };
  return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Coin Change II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Unbounded knapsack, coins in the outer loop',
        idea: 'dp[a] = ways to make a. Looping coins outside counts combinations (each order once); looping amounts outside would count permutations.',
        time: 'O(amount × coins)',
        space: 'O(amount)',
        code: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins)
    for (let a = c; a <= amount; a++) dp[a] += dp[a - c];
  return dp[amount];
}`,
        note: 'The loop order is the whole trick — be ready to explain it.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Decode Ways',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Rolling DP over prefixes',
        idea: 'ways(i) takes ways(i − 1) if s[i−1] is 1–9, plus ways(i − 2) if s[i−2..i−1] is 10–26. A "0" can only be the second digit of 10 or 20.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function numDecodings(s) {
  let prev2 = 1, prev1 = s[0] === '0' ? 0 : 1;
  for (let i = 2; i <= s.length; i++) {
    let cur = 0;
    if (s[i - 1] !== '0') cur += prev1;
    const two = Number(s.slice(i - 2, i));
    if (two >= 10 && two <= 26) cur += prev2;
    [prev2, prev1] = [prev1, cur];
  }
  return prev1;
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'State machine: hold / sold / rest',
        idea: 'hold = max(hold, rest − price); sold = hold + price; rest = max(rest, sold of yesterday). Buying needs yesterday to be rest, which enforces the cooldown.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxProfit(prices) {
  let hold = -Infinity, sold = 0, rest = 0;
  for (const p of prices) {
    const prevSold = sold;
    sold = hold + p;
    hold = Math.max(hold, rest - p);
    rest = Math.max(rest, prevSold);
  }
  return Math.max(sold, rest);
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- 2-D DP
  {
    topic: 'Dynamic Programming',
    problem: 'Unique Paths',
    difficulty: 'Medium',
    approaches: [
      {
        name: '1-D rolling row',
        idea: 'paths(r, c) = paths(r − 1, c) + paths(r, c − 1). One row suffices: row[c] += row[c − 1].',
        time: 'O(m·n)',
        space: 'O(n)',
        code: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  return row[n - 1];
}`,
      },
      {
        name: 'Combinatorics',
        idea: 'Choose which m − 1 of the m + n − 2 moves go down: C(m + n − 2, m − 1).',
        time: 'O(min(m, n))',
        space: 'O(1)',
        code: `function uniquePaths(m, n) {
  let res = 1;
  for (let i = 1; i < m; i++) res = (res * (n - 1 + i)) / i;
  return Math.round(res);
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Palindromic Substrings',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Expand around every centre',
        idea: 'There are 2n − 1 centres (each char and each gap). Expand while the ends match, counting each step.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function countSubstrings(s) {
  let count = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; }
  };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return count;
}`,
        note: 'The DP table (dp[i][j] = s[i] === s[j] && dp[i+1][j−1]) is also O(n²) but uses O(n²) space.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Target Sum',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Reduce to subset-sum counting',
        idea: 'Let P be the "+" set: P − (total − P) = target, so P = (total + target) / 2. Count subsets with that sum (0/1 knapsack, iterate sums downward).',
        time: 'O(n × sum)',
        space: 'O(sum)',
        code: `function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total || (total + target) % 2) return 0;
  const P = (total + target) / 2;
  const dp = new Array(P + 1).fill(0);
  dp[0] = 1;
  for (const x of nums)
    for (let s = P; s >= x; s--) dp[s] += dp[s - x];
  return dp[P];
}`,
        note: 'Start with memoised recursion on (index, running sum) if the algebra does not come to you.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Burst Balloons',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Interval DP on the last balloon burst',
        idea: 'Pad with 1s. dp[l][r] = best coins bursting everything strictly between l and r. Choosing k as the LAST to burst in (l, r) makes its neighbours exactly l and r, so the two sides are independent.',
        time: 'O(n³)',
        space: 'O(n²)',
        code: `function maxCoins(nums) {
  const a = [1, ...nums, 1], n = a.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let l = 0; l + len < n; l++) {
      const r = l + len;
      for (let k = l + 1; k < r; k++)
        dp[l][r] = Math.max(dp[l][r], dp[l][k] + a[l] * a[k] * a[r] + dp[k][r]);
    }
  }
  return dp[0][n - 1];
}`,
        note: 'Thinking "first to burst" fails because neighbours change — "last to burst" is the key insight.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Regular Expression Matching',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Memoised recursion on (i, j)',
        idea: 'first = s[i] matches p[j] (or "."). If p[j+1] is "*", either skip "x*" (j + 2) or consume one char if first matches (i + 1). Otherwise require first and advance both.',
        time: 'O(|s|·|p|)',
        space: 'O(|s|·|p|)',
        code: `function isMatch(s, p) {
  const memo = new Map();
  const dp = (i, j) => {
    const key = i * (p.length + 1) + j;
    if (memo.has(key)) return memo.get(key);
    let ans;
    if (j === p.length) ans = i === s.length;
    else {
      const first = i < s.length && (p[j] === s[i] || p[j] === '.');
      if (p[j + 1] === '*') ans = dp(i, j + 2) || (first && dp(i + 1, j));
      else ans = first && dp(i + 1, j + 1);
    }
    memo.set(key, ans);
    return ans;
  };
  return dp(0, 0);
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Greedy
  {
    topic: 'Greedy',
    problem: 'Jump Game',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Track the furthest reachable index',
        idea: 'If the current index is beyond the furthest reach, you are stuck; otherwise extend the reach.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Partition Labels',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Last occurrence + extend the cut',
        idea: 'Record each char’s last index. Walk the string, extending the current part’s end to the last index of every char seen; cut when i reaches it.',
        time: 'O(n)',
        space: 'O(26)',
        code: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const res = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) { res.push(end - start + 1); start = i + 1; }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Hand of Straights',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Smallest card starts a group',
        idea: 'The smallest remaining card must begin a run. Take it and the next groupSize − 1 values from the counts; fail if any is missing.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function isNStraightHand(hand, size) {
  if (hand.length % size) return false;
  const cnt = new Map();
  for (const x of hand) cnt.set(x, (cnt.get(x) ?? 0) + 1);
  for (const x of [...cnt.keys()].sort((a, b) => a - b)) {
    const need = cnt.get(x);
    if (!need) continue;
    for (let v = x; v < x + size; v++) {
      if ((cnt.get(v) ?? 0) < need) return false;
      cnt.set(v, cnt.get(v) - need);
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Candy',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Two passes',
        idea: 'Left to right: give one more than the left neighbour if rated higher. Right to left: take the max with one more than the right neighbour if rated higher. Each pass satisfies one side’s constraint without breaking the other.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function candy(ratings) {
  const n = ratings.length, c = new Array(n).fill(1);
  for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
  return c.reduce((a, b) => a + b, 0);
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Intervals
  {
    topic: 'Array',
    problem: 'Insert Interval',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Three phases in one pass',
        idea: 'Input is sorted and non-overlapping. Copy intervals ending before the new one, merge every interval that overlaps it, then copy the rest.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function insert(intervals, [s, e]) {
  const res = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < s) res.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= e) {
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i++;
  }
  res.push([s, e]);
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort by end, keep the earliest-finishing',
        idea: 'Activity selection: keeping the interval that ends first leaves the most room. Removals = total − kept.',
        time: 'O(n log n)',
        space: 'O(1) extra',
        code: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let kept = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) { kept++; end = e; }
  }
  return intervals.length - kept;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Meeting Rooms',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort by start, check neighbours',
        idea: 'After sorting, a person can attend all meetings only if each starts no earlier than the previous one ends.',
        time: 'O(n log n)',
        space: 'O(1) extra',
        code: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++)
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Meeting Rooms II',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sorted starts and ends (sweep)',
        idea: 'Walk starts in order. If a meeting has ended by this start, reuse its room (advance the end pointer); otherwise open a new room.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function minMeetingRooms(intervals) {
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  let rooms = 0, j = 0;
  for (const s of starts) {
    if (s < ends[j]) rooms++;
    else j++;
  }
  return rooms;
}`,
        note: 'Equivalent: sort by start and keep a min-heap of end times; the heap size is the answer.',
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Minimum Number of Arrows to Burst Balloons',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort by end, shoot at the end',
        idea: 'Shoot at the end of the earliest-ending balloon; it bursts every balloon starting at or before that point. Shoot again only when a balloon starts after it.',
        time: 'O(n log n)',
        space: 'O(1) extra',
        code: `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 0, pos = -Infinity;
  for (const [s, e] of points) {
    if (s > pos) { arrows++; pos = e; }
  }
  return arrows;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Bits
  {
    topic: 'Bit Manipulation',
    problem: 'Single Number',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'XOR everything',
        idea: 'x ^ x = 0 and x ^ 0 = x, so every pair cancels and the single value remains.',
        time: 'O(n)',
        space: 'O(1)',
        code: `const singleNumber = (nums) => nums.reduce((x, n) => x ^ n, 0);`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Counting Bits',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'DP on i >> 1',
        idea: 'i has the same bits as i >> 1 plus its lowest bit.',
        time: 'O(n)',
        space: 'O(n) output',
        code: `function countBits(n) {
  const res = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) res[i] = res[i >> 1] + (i & 1);
  return res;
}`,
        note: 'Also valid: res[i] = res[i & (i − 1)] + 1 (drop the lowest set bit).',
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Reverse Bits',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Shift out, shift in',
        idea: 'Take the lowest bit of n 32 times, appending it to the result. ">>> 0" keeps the result unsigned in JavaScript.',
        time: 'O(32)',
        space: 'O(1)',
        code: `function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Sum of Two Integers (no + or -)',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'XOR for sum, AND-shift for carry',
        idea: 'a ^ b adds without carrying; (a & b) << 1 is the carry. Repeat until there is no carry. JavaScript 32-bit ints make negatives work too.',
        time: 'O(32)',
        space: 'O(1)',
        code: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Matrix
  {
    topic: 'Matrix',
    problem: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Row and column sets',
        idea: 'Record which rows and columns contain a zero, then zero them.',
        time: 'O(R·C)',
        space: 'O(R + C)',
        code: `function setZeroes(m) {
  const rows = new Set(), cols = new Set();
  m.forEach((row, r) => row.forEach((v, c) => { if (v === 0) { rows.add(r); cols.add(c); } }));
  m.forEach((row, r) => row.forEach((_, c) => { if (rows.has(r) || cols.has(c)) row[c] = 0; }));
}`,
      },
      {
        name: 'First row and column as markers',
        idea: 'Use row 0 and column 0 as the flags. Remember separately whether row 0 / column 0 themselves had a zero, and zero them last.',
        time: 'O(R·C)',
        space: 'O(1)',
        code: `function setZeroes(m) {
  const R = m.length, C = m[0].length;
  const row0 = m[0].includes(0), col0 = m.some((row) => row[0] === 0);
  for (let r = 1; r < R; r++)
    for (let c = 1; c < C; c++)
      if (m[r][c] === 0) { m[r][0] = 0; m[0][c] = 0; }
  for (let r = 1; r < R; r++)
    for (let c = 1; c < C; c++)
      if (m[r][0] === 0 || m[0][c] === 0) m[r][c] = 0;
  if (row0) m[0].fill(0);
  if (col0) for (let r = 0; r < R; r++) m[r][0] = 0;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Game of Life',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In place with bit encoding',
        idea: 'Bit 0 holds the current state, bit 1 the next. Count live neighbours using (v & 1), write the next state into bit 1, then shift every cell right.',
        time: 'O(R·C)',
        space: 'O(1)',
        code: `function gameOfLife(b) {
  const R = b.length, C = b[0].length;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      let live = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < R && nc < C) live += b[nr][nc] & 1;
        }
      if (live === 3 || (live === 2 && (b[r][c] & 1))) b[r][c] |= 2;
    }
  }
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) b[r][c] >>= 1;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Design
  {
    topic: 'Design',
    problem: 'Design Hit Counter',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Queue of timestamps',
        idea: 'Push each hit; on getHits drop timestamps older than 300 s from the front.',
        time: 'O(1) amortised',
        space: 'O(hits in the window)',
        code: `class HitCounter {
  constructor() { this.q = []; this.head = 0; }
  hit(t) { this.q.push(t); }
  getHits(t) {
    while (this.head < this.q.length && this.q[this.head] <= t - 300) this.head++;
    return this.q.length - this.head;
  }
}`,
      },
      {
        name: 'Fixed 300-slot ring buffer',
        idea: 'Bounded memory under heavy traffic: slot t % 300 stores [time, count]; reset a slot when its time is stale.',
        time: 'hit O(1), getHits O(300)',
        space: 'O(300)',
        code: `class HitCounter {
  constructor() { this.times = new Array(300).fill(0); this.counts = new Array(300).fill(0); }
  hit(t) {
    const i = t % 300;
    if (this.times[i] !== t) { this.times[i] = t; this.counts[i] = 0; }
    this.counts[i]++;
  }
  getHits(t) {
    let total = 0;
    for (let i = 0; i < 300; i++) if (t - this.times[i] < 300) total += this.counts[i];
    return total;
  }
}`,
        note: 'The follow-up "what if hits per second are huge?" is asking for this version.',
      },
    ],
  },
  {
    topic: 'Design',
    problem: 'Insert Delete GetRandom O(1)',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Array + value→index map',
        idea: 'The array gives O(1) random access. To delete in O(1), move the last element into the removed slot and update its index.',
        time: 'O(1) average for every operation',
        space: 'O(n)',
        code: `class RandomizedSet {
  constructor() { this.arr = []; this.idx = new Map(); }
  insert(v) {
    if (this.idx.has(v)) return false;
    this.idx.set(v, this.arr.length);
    this.arr.push(v);
    return true;
  }
  remove(v) {
    if (!this.idx.has(v)) return false;
    const i = this.idx.get(v), last = this.arr[this.arr.length - 1];
    this.arr[i] = last;
    this.idx.set(last, i);
    this.arr.pop();
    this.idx.delete(v);
    return true;
  }
  getRandom() {
    return this.arr[Math.floor(Math.random() * this.arr.length)];
  }
}`,
      },
    ],
  },
  {
    topic: 'Design',
    problem: 'LFU Cache',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Frequency buckets of insertion-ordered sets',
        idea: 'key → [value, freq]; freq → Set of keys (JS Sets keep insertion order, so the first key is the least recent). Track minFreq; evict the first key of the minFreq bucket. A new key resets minFreq to 1.',
        time: 'O(1) per operation',
        space: 'O(capacity)',
        code: `class LFUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.vals = new Map();    // key -> [value, freq]
    this.buckets = new Map(); // freq -> Set(keys), oldest first
    this.minFreq = 0;
  }
  #touch(key) {
    const entry = this.vals.get(key), f = entry[1];
    this.buckets.get(f).delete(key);
    if (f === this.minFreq && this.buckets.get(f).size === 0) this.minFreq++;
    entry[1] = f + 1;
    if (!this.buckets.has(f + 1)) this.buckets.set(f + 1, new Set());
    this.buckets.get(f + 1).add(key);
  }
  get(key) {
    if (!this.vals.has(key)) return -1;
    this.#touch(key);
    return this.vals.get(key)[0];
  }
  put(key, value) {
    if (this.cap === 0) return;
    if (this.vals.has(key)) {
      this.vals.get(key)[0] = value;
      this.#touch(key);
      return;
    }
    if (this.vals.size === this.cap) {
      const bucket = this.buckets.get(this.minFreq);
      const evict = bucket.values().next().value;
      bucket.delete(evict);
      this.vals.delete(evict);
    }
    this.vals.set(key, [value, 1]);
    if (!this.buckets.has(1)) this.buckets.set(1, new Set());
    this.buckets.get(1).add(key);
    this.minFreq = 1;
  }
}`,
        note: 'In other languages the buckets are doubly linked lists; JS Set insertion order gives the same O(1) behaviour.',
      },
    ],
  },
];
