/**
 * Worked solutions for the DSA checklist — multiple approaches per problem.
 *
 * To add one: append an entry. `problem` should match the checklist name closely
 * (matching is fuzzy — lowercased, non-alphanumerics stripped). Each approach:
 *   { name, idea, time, space, code, note? }
 * `code` is JavaScript. Keep approaches ordered brute-force → optimal.
 *
 * Seeded with the highest-frequency interview problems; grow over time.
 */

/** @type {{topic:string, problem:string, also?:string[], difficulty?:string, approaches:{name:string,idea:string,time:string,space:string,code:string,note?:string}[]}[]} */
export const solutions = [
  // ---------------------------------------------------------------- Array
  {
    topic: 'Array',
    problem: 'Reverse the array',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers (in place)',
        idea: 'Swap the ends and walk inward until the pointers meet.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reverse(a) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    [a[l], a[r]] = [a[r], a[l]];
    l++; r--;
  }
  return a;
}`,
      },
      {
        name: 'Recursion',
        idea: 'Swap outermost pair, recurse on the inner subarray. Shows recursion but costs stack.',
        time: 'O(n)',
        space: 'O(n) call stack',
        code: `function reverse(a, l = 0, r = a.length - 1) {
  if (l >= r) return a;
  [a[l], a[r]] = [a[r], a[l]];
  return reverse(a, l + 1, r - 1);
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: "Kadane's Algo",
    also: ['find Largest sum contiguous Subarray', 'largest sum contiguous subarray'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Kadane (running sum)',
        idea: 'At each index keep the best subarray sum ending here: either extend the previous one or start fresh.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
        note: 'To also return the indices, record start when cur resets and end when best updates.',
      },
      {
        name: 'Prefix sum + running minimum',
        idea: 'max subarray ending at i = prefix[i] − min(prefix[0..i−1]). Same complexity, useful when you already have prefix sums.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxSubArray(nums) {
  let prefix = 0, minPrefix = 0, best = -Infinity;
  for (const x of nums) {
    prefix += x;
    best = Math.max(best, prefix - minPrefix);
    minPrefix = Math.min(minPrefix, prefix);
  }
  return best;
}`,
      },
      {
        name: 'Divide and conquer',
        idea: 'Best subarray is entirely left, entirely right, or crosses the midpoint. Asked to test recursion/merge thinking.',
        time: 'O(n log n)',
        space: 'O(log n)',
        code: `function maxSubArray(nums, lo = 0, hi = nums.length - 1) {
  if (lo === hi) return nums[lo];
  const mid = (lo + hi) >> 1;
  let leftBest = -Infinity, sum = 0;
  for (let i = mid; i >= lo; i--) { sum += nums[i]; leftBest = Math.max(leftBest, sum); }
  let rightBest = -Infinity; sum = 0;
  for (let i = mid + 1; i <= hi; i++) { sum += nums[i]; rightBest = Math.max(rightBest, sum); }
  return Math.max(
    maxSubArray(nums, lo, mid),
    maxSubArray(nums, mid + 1, hi),
    leftBest + rightBest,
  );
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Best time to buy and Sell stock',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'One pass (track min price)',
        idea: 'Keep the lowest price seen so far; the best profit is the largest (price − minSoFar).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxProfit(prices) {
  let minPrice = Infinity, profit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    profit = Math.max(profit, p - minPrice);
  }
  return profit;
}`,
      },
      {
        name: 'Brute force',
        idea: 'Try every buy/sell pair. Only useful as the baseline you state before optimising.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++)
      profit = Math.max(profit, prices[j] - prices[i]);
  return profit;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'find duplicate in an array of N+1 Integers',
    also: ['find the duplicate number'],
    difficulty: 'Medium',
    approaches: [
      {
        name: "Floyd's cycle detection",
        idea: 'Treat values as next-pointers. A duplicate creates a cycle; the entry to the cycle is the duplicate. No mutation, O(1) space.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`,
      },
      {
        name: 'Marking with sign / index',
        idea: 'Walk the array; negate nums[|x|]. If already negative, |x| is the duplicate. Mutates the input.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function findDuplicate(nums) {
  for (const n of nums) {
    const i = Math.abs(n);
    if (nums[i] < 0) return i;
    nums[i] = -nums[i];
  }
}`,
      },
      {
        name: 'Hash set',
        idea: 'First value already in the set is the answer. Simplest; O(n) extra space.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function findDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Merge Intervals',
    also: ['Merge Overlapping Intervals'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort by start, then sweep',
        idea: 'After sorting, an interval either extends the last merged one (overlap) or starts a new one.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else res.push(intervals[i]);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Trapping Rain water problem',
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Prefix max arrays',
        idea: 'Water above bar i = min(maxLeft[i], maxRight[i]) − height[i]. Precompute both in two passes.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function trap(h) {
  const n = h.length;
  const left = Array(n), right = Array(n);
  left[0] = h[0];
  for (let i = 1; i < n; i++) left[i] = Math.max(left[i - 1], h[i]);
  right[n - 1] = h[n - 1];
  for (let i = n - 2; i >= 0; i--) right[i] = Math.max(right[i + 1], h[i]);
  let water = 0;
  for (let i = 0; i < n; i++) water += Math.min(left[i], right[i]) - h[i];
  return water;
}`,
      },
      {
        name: 'Two pointers',
        idea: 'Move the side with the smaller running max inward; that side bounds the water. Drops space to O(1).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function trap(h) {
  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      lMax = Math.max(lMax, h[l]);
      water += lMax - h[l++];
    } else {
      rMax = Math.max(rMax, h[r]);
      water += rMax - h[r--];
    }
  }
  return water;
}`,
      },
      {
        name: 'Monotonic stack',
        idea: 'Keep a decreasing stack of indices; when a taller bar arrives, pop and add the water trapped in the "valley".',
        time: 'O(n)',
        space: 'O(n)',
        code: `function trap(h) {
  const st = [];
  let water = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length && h[i] > h[st[st.length - 1]]) {
      const bottom = st.pop();
      if (!st.length) break;
      const width = i - st[st.length - 1] - 1;
      const bounded = Math.min(h[i], h[st[st.length - 1]]) - h[bottom];
      water += width * bounded;
    }
    st.push(i);
  }
  return water;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'find all pairs on integer array whose sum is equal to given number',
    also: ['two sum', 'pair with given sum'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Hash set (unsorted)',
        idea: 'For each x check if (target − x) was already seen.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function pairs(a, target) {
  const seen = new Set(), out = [];
  for (const x of a) {
    if (seen.has(target - x)) out.push([target - x, x]);
    seen.add(x);
  }
  return out;
}`,
      },
      {
        name: 'Sort + two pointers',
        idea: 'Sort, then shrink from both ends. O(1) extra space; also lists pairs in order.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function pairs(a, target) {
  a.sort((x, y) => x - y);
  let l = 0, r = a.length - 1;
  const out = [];
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) { out.push([a[l], a[r]]); l++; r--; }
    else if (s < target) l++;
    else r--;
  }
  return out;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'find maximum product subarray',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Track running max and min',
        idea: 'A negative number swaps max and min, so carry both. Best answer is the running max.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxProduct(nums) {
  let maxP = nums[0], minP = nums[0], res = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    if (x < 0) [maxP, minP] = [minP, maxP];
    maxP = Math.max(x, maxP * x);
    minP = Math.min(x, minP * x);
    res = Math.max(res, maxP);
  }
  return res;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- String
  {
    topic: 'String',
    problem: 'Check whether a String is Palindrome or not',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers',
        idea: 'Compare characters from both ends moving inward.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) if (s[l++] !== s[r--]) return false;
  return true;
}`,
      },
      {
        name: 'Reverse and compare',
        idea: 'One-liner; O(n) space for the reversed copy. Fine to mention, not the answer they want.',
        time: 'O(n)',
        space: 'O(n)',
        code: `const isPalindrome = (s) => s === [...s].reverse().join('');`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Write a program to find the longest Palindrome in a string',
    also: ['longest palindromic substring'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Expand around center',
        idea: 'Every palindrome has a center (a char, or a gap between two chars). Expand outward from all 2n−1 centers.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function longestPalindrome(s) {
  let best = '';
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return s.slice(l + 1, r);
  };
  for (let i = 0; i < s.length; i++) {
    for (const p of [expand(i, i), expand(i, i + 1)])
      if (p.length > best.length) best = p;
  }
  return best;
}`,
      },
      {
        name: 'Dynamic programming',
        idea: 'dp[i][j] = s[i]===s[j] && dp[i+1][j-1]. Fill by substring length. Same time, O(n²) space, easier to reason about.',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function longestPalindrome(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(false));
  let start = 0, maxLen = 1;
  for (let i = 0; i < n; i++) dp[i][i] = true;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && (len === 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        if (len > maxLen) { start = i; maxLen = len; }
      }
    }
  }
  return s.slice(start, start + maxLen);
}`,
        note: 'Manacher’s algorithm solves this in O(n) but is rarely expected in interviews — mention it exists.',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Longest Common Prefix',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Vertical scan',
        idea: 'Compare column 0 of every string, then column 1, … Stop at the first mismatch or shortest string end.',
        time: 'O(N·M) chars total',
        space: 'O(1)',
        code: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  for (let i = 0; i < strs[0].length; i++) {
    const c = strs[0][i];
    for (const s of strs) if (i === s.length || s[i] !== c) return strs[0].slice(0, i);
  }
  return strs[0];
}`,
      },
      {
        name: 'Sort, compare first and last',
        idea: 'After sorting, only the lexicographically smallest and largest strings matter.',
        time: 'O(N log N · M)',
        space: 'O(1)',
        code: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  strs.sort();
  const a = strs[0], b = strs[strs.length - 1];
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return a.slice(0, i);
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'find the smallest window in a string containing all characters of another string',
    also: ['minimum window substring', 'smallest window that contains all characters of string itself'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Sliding window with need-count',
        idea: 'Expand right until the window covers all needed chars, then contract left while it still does, tracking the smallest.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let missing = t.length, start = 0, resStart = 0, resLen = Infinity;
  for (let end = 0; end < s.length; end++) {
    const c = s[end];
    if (need.get(c) > 0) missing--;
    need.set(c, (need.get(c) || 0) - 1);
    while (missing === 0) {
      if (end - start + 1 < resLen) { resLen = end - start + 1; resStart = start; }
      const lc = s[start++];
      need.set(lc, need.get(lc) + 1);
      if (need.get(lc) > 0) missing++;
    }
  }
  return resLen === Infinity ? '' : s.slice(resStart, resStart + resLen);
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Balanced Parenthesis problem',
    also: ['valid parentheses'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Stack',
        idea: 'Push openers; on a closer, the stack top must be its matching opener.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function isValid(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Linked List
  {
    topic: 'LinkedList',
    problem: 'Reverse a linked list',
    also: ['Write a Program to reverse the Linked List. (Both Iterative and recursive)'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Iterative (three pointers)',
        idea: 'Walk the list re-pointing each node’s next to the previous node.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reverse(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      },
      {
        name: 'Recursive',
        idea: 'Reverse the rest, then make the next node point back to the current one.',
        time: 'O(n)',
        space: 'O(n) call stack',
        code: `function reverse(head) {
  if (!head || !head.next) return head;
  const newHead = reverse(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Detect Loop in linked list',
    also: ['detect and remove loop in a linked list', 'Write a program to Detect loop in a linked list'],
    difficulty: 'Easy',
    approaches: [
      {
        name: "Floyd's tortoise and hare",
        idea: 'A fast pointer (2×) and slow pointer (1×) meet inside a cycle. O(1) space.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        note: 'To find the loop start: after meeting, move one pointer to head and advance both 1× — they meet at the entry.',
      },
      {
        name: 'Hash set of visited nodes',
        idea: 'First node seen twice is on the loop. Simple, O(n) space.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hasCycle(head) {
  const seen = new Set();
  for (let n = head; n; n = n.next) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Merge 2 sorted Linked Lists',
    also: ['merge two sorted lists', 'merge k sorted linked lists'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Iterative with dummy head',
        idea: 'Splice the smaller current node onto a result list; attach the leftover tail at the end.',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function mergeTwoLists(a, b) {
  const dummy = { next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`,
      },
      {
        name: 'Recursive',
        idea: 'Pick the smaller head, then recurse on the rest.',
        time: 'O(n + m)',
        space: 'O(n + m) call stack',
        code: `function mergeTwoLists(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.val <= b.val) { a.next = mergeTwoLists(a.next, b); return a; }
  b.next = mergeTwoLists(a, b.next);
  return b;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Remove Nth node from end of Linked List',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two pointers, one pass',
        idea: 'Advance a lead pointer n steps, then move both until lead hits the end; trail sits just before the target.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let lead = dummy, trail = dummy;
  for (let i = 0; i < n; i++) lead = lead.next;
  while (lead.next) { lead = lead.next; trail = trail.next; }
  trail.next = trail.next.next;
  return dummy.next;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Searching & Sorting
  {
    topic: 'Searching & Sorting',
    problem: 'Find first and last positions of an element in a sorted array',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two binary searches (lower / upper bound)',
        idea: 'One search for the leftmost index ≥ target, another for the leftmost index > target.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function searchRange(nums, target) {
  const bound = (isLower) => {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] > target || (isLower && nums[mid] === target)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  const first = bound(true);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  return [first, bound(false) - 1];
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Search in a rotated sorted array',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Modified binary search',
        idea: 'One half [lo..mid] or [mid..hi] is always sorted. Check whether target lies in the sorted half and recurse there.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) { // left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                     // right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Kth smallest number',
    also: ['kth smallest element', 'Find the Kth max and min element of an array', 'Kth smallest number again', 'Kth smallest number'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Max-heap of size k',
        idea: 'Keep the k smallest seen so far in a max-heap; its root is the answer.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `// uses the MinHeap/MaxHeap idea; here with a sorted array for brevity
function kthSmallest(a, k) {
  const heap = []; // acts as a max-heap of size k (kept sorted desc)
  for (const x of a) {
    if (heap.length < k) heap.push(x), heap.sort((p, q) => q - p);
    else if (x < heap[0]) { heap[0] = x; heap.sort((p, q) => q - p); }
  }
  return heap[0];
}`,
        note: 'With a real binary max-heap the per-element work is O(log k) instead of O(k log k).',
      },
      {
        name: 'Quickselect',
        idea: 'Partition like quicksort but only recurse into the side containing index k−1. Average linear.',
        time: 'O(n) avg, O(n²) worst',
        space: 'O(1)',
        code: `function kthSmallest(a, k) {
  let lo = 0, hi = a.length - 1;
  const target = k - 1;
  while (lo < hi) {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) if (a[j] < pivot) [a[i], a[j]] = [a[j], a[i]], i++;
    [a[i], a[hi]] = [a[hi], a[i]];
    if (i === target) return a[i];
    if (i < target) lo = i + 1; else hi = i - 1;
  }
  return a[lo];
}`,
      },
      {
        name: 'Sort',
        idea: 'Sort and index. Simplest; the baseline you state first.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `const kthSmallest = (a, k) => [...a].sort((x, y) => x - y)[k - 1];`,
      },
    ],
  },

  // ---------------------------------------------------------------- Stacks & Queues
  {
    topic: 'Stacks & Queues',
    problem: 'Next Greater Element',
    also: ['Find the next Greater element'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic decreasing stack',
        idea: 'Push indices; when the current value beats the stack top, it is that index’s next-greater. Each index is pushed/popped once.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function nextGreater(nums) {
  const res = Array(nums.length).fill(-1);
  const st = [];
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[i] > nums[st[st.length - 1]]) res[st.pop()] = nums[i];
    st.push(i);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Implement Queue using Stack',
    also: ['implement queue using stacks'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two stacks, lazy transfer',
        idea: 'Push onto `inbox`. To dequeue, if `outbox` is empty pour `inbox` into it (reversing order), then pop. Amortised O(1).',
        time: 'O(1) amortised',
        space: 'O(n)',
        code: `class MyQueue {
  constructor() { this.inbox = []; this.outbox = []; }
  push(x) { this.inbox.push(x); }
  pop() { this.peek(); return this.outbox.pop(); }
  peek() {
    if (!this.outbox.length) while (this.inbox.length) this.outbox.push(this.inbox.pop());
    return this.outbox[this.outbox.length - 1];
  }
  empty() { return !this.inbox.length && !this.outbox.length; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Design a stack that supports getMin in O(1)',
    also: ['min stack', 'Design a Stack that supports getMin() in O(1) time and O(1) extra space'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Parallel min-stack',
        idea: 'Each entry also stores the minimum of the stack up to that point.',
        time: 'O(1) per op',
        space: 'O(n)',
        code: `class MinStack {
  constructor() { this.s = []; }
  push(x) { this.s.push([x, this.s.length ? Math.min(x, this.getMin()) : x]); }
  pop() { this.s.pop(); }
  top() { return this.s[this.s.length - 1][0]; }
  getMin() { return this.s[this.s.length - 1][1]; }
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Binary Trees / BST
  {
    topic: 'Binary Trees',
    problem: 'Level order traversal',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'BFS with a queue',
        idea: 'Process the tree one level at a time; the queue length at the start of each round is the level size.',
        time: 'O(n)',
        space: 'O(width)',
        code: `function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length) {
    const level = [];
    for (let k = q.length; k > 0; k--) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Check whether a binary tree is a BST or not',
    also: ['validate bst', 'check for BST', 'Check if a tree is a BST or not'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Recurse with min/max bounds',
        idea: 'Every node must lie strictly between the bounds inherited from its ancestors.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isValidBST(node, lo = -Infinity, hi = Infinity) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return isValidBST(node.left, lo, node.val) && isValidBST(node.right, node.val, hi);
}`,
      },
      {
        name: 'In-order traversal must be strictly increasing',
        idea: 'An in-order walk of a BST visits values in sorted order; check each value is larger than the previous.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isValidBST(root) {
  let prev = -Infinity, ok = true;
  const dfs = (n) => {
    if (!n || !ok) return;
    dfs(n.left);
    if (n.val <= prev) ok = false;
    prev = n.val;
    dfs(n.right);
  };
  dfs(root);
  return ok;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Find the Lowest Common Ancestor in a Binary Tree',
    also: ['lca', 'lowest common ancestor in a BST', 'Find LCA  of 2 nodes in a BST', 'Find LCA of 2 nodes in a BST', 'Find LCA in a Binary tree'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Post-order recursion (general binary tree)',
        idea: 'Return the node where p is found on one side and q on the other; that split point is the LCA.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function lca(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lca(root.left, p, q);
  const right = lca(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
      },
      {
        name: 'BST short-cut',
        idea: 'In a BST, walk down: go left if both targets are smaller, right if both larger, else you are at the LCA.',
        time: 'O(h)',
        space: 'O(1)',
        code: `function lcaBST(root, p, q) {
  let n = root;
  while (n) {
    if (p.val < n.val && q.val < n.val) n = n.left;
    else if (p.val > n.val && q.val > n.val) n = n.right;
    else return n;
  }
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Diameter of a Binary Tree',
    also: ['Diameter of a tree'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'DFS returning height, update diameter as a side effect',
        idea: 'At each node, the longest path through it is leftHeight + rightHeight; track the max.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function diameterOfBinaryTree(root) {
  let best = 0;
  const height = (n) => {
    if (!n) return 0;
    const l = height(n.left), r = height(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  height(root);
  return best;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Heap
  {
    topic: 'Heap',
    problem: 'Kth largest element in an array',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-heap of size k',
        idea: 'Keep the k largest so far; the heap root is the kth largest. Great for a stream.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1;
    while (i && a[(i - 1) >> 1] > a[i]) { [a[(i - 1) >> 1], a[i]] = [a[i], a[(i - 1) >> 1]]; i = (i - 1) >> 1; } }
  pop() { const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0;
      for (;;) { let s = i, l = 2*i+1, r = 2*i+2;
        if (l < a.length && a[l] < a[s]) s = l;
        if (r < a.length && a[r] < a[s]) s = r;
        if (s === i) break; [a[s], a[i]] = [a[i], a[s]]; i = s; } }
    return top; }
}
function findKthLargest(nums, k) {
  const h = new MinHeap();
  for (const x of nums) { h.push(x); if (h.size > k) h.pop(); }
  return h.peek();
}`,
      },
      {
        name: 'Quickselect',
        idea: 'Partition for the (n−k)th smallest index. Average O(n), no extra structure.',
        time: 'O(n) avg',
        space: 'O(1)',
        code: `function findKthLargest(nums, k) {
  const target = nums.length - k;
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) if (nums[j] < pivot) [nums[i], nums[j]] = [nums[j], nums[i]], i++;
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    if (i === target) return nums[i];
    i < target ? (lo = i + 1) : (hi = i - 1);
  }
  return nums[lo];
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Graph
  {
    topic: 'Graph',
    problem: 'Number of islands',
    also: ['Find the no. of Isalnds', 'Find the no. of Islands'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS flood fill',
        idea: 'Scan the grid; each unvisited land cell starts a new island — sink its whole component.',
        time: 'O(R·C)',
        space: 'O(R·C) recursion worst case',
        code: `function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}`,
      },
      {
        name: 'BFS flood fill',
        idea: 'Same idea, queue instead of recursion — avoids deep stacks on huge grids.',
        time: 'O(R·C)',
        space: 'O(min(R,C))',
        code: `function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  let count = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === '1') {
        count++;
        const q = [[r, c]]; grid[r][c] = '0';
        while (q.length) {
          const [x, y] = q.shift();
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < R && ny < C && grid[nx][ny] === '1') {
              grid[nx][ny] = '0'; q.push([nx, ny]);
            }
          }
        }
      }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Topological sort of a DAG',
    also: ['topological sort', 'course schedule'],
    difficulty: 'Medium',
    approaches: [
      {
        name: "Kahn's algorithm (BFS on in-degrees)",
        idea: 'Repeatedly remove a node with in-degree 0 and decrement its neighbours. If you can’t process all nodes, there is a cycle.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function topoSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const indeg = Array(numNodes).fill(0);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  const q = [];
  for (let i = 0; i < numNodes; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === numNodes ? order : null; // null ⇒ cycle
}`,
      },
      {
        name: 'DFS with colours',
        idea: 'DFS; push a node to the front of the order after its subtree is done. A back-edge to a "grey" node means a cycle.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function topoSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const state = Array(numNodes).fill(0); // 0=unseen 1=in-progress 2=done
  const order = [];
  let ok = true;
  const dfs = (u) => {
    state[u] = 1;
    for (const v of adj[u]) {
      if (state[v] === 1) { ok = false; return; }
      if (state[v] === 0) dfs(v);
    }
    state[u] = 2;
    order.push(u);
  };
  for (let i = 0; i < numNodes && ok; i++) if (state[i] === 0) dfs(i);
  return ok ? order.reverse() : null;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Dynamic Programming
  {
    topic: 'Dynamic Programming',
    problem: 'Nth Fibonacci Number',
    also: ['fibonacci'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Naive recursion',
        idea: 'Direct definition. Recomputes the same subproblems — exponential. State this only as the starting point.',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        code: `const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));`,
      },
      {
        name: 'Top-down memoisation',
        idea: 'Cache each fib(k) the first time it is computed.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, v);
  return v;
}`,
      },
      {
        name: 'Bottom-up table',
        idea: 'Fill dp[0..n] iteratively — no recursion, no stack.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
      },
      {
        name: 'Two rolling variables',
        idea: 'Only the last two values matter — O(1) space.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function fib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Coin Change Problem',
    also: ['coin change', 'minimum number of coins'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Bottom-up (min coins for each amount)',
        idea: 'dp[a] = 1 + min over coins c≤a of dp[a−c]. Unbounded knapsack shape.',
        time: 'O(amount · coins)',
        space: 'O(amount)',
        code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      },
      {
        name: 'Count the number of ways',
        idea: 'Different question, same table: iterate coins in the outer loop so combinations aren’t double-counted.',
        time: 'O(amount · coins)',
        space: 'O(amount)',
        code: `function changeWays(coins, amount) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins)
    for (let a = c; a <= amount; a++)
      dp[a] += dp[a - c];
  return dp[amount];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: '0-1 Knapsack Problem',
    also: ['0/1 knapsack', 'Knapsack Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '2-D table',
        idea: 'dp[i][w] = best value using the first i items within weight w: skip item i, or take it if it fits.',
        time: 'O(n · W)',
        space: 'O(n · W)',
        code: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w)
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
    }
  return dp[n][W];
}`,
      },
      {
        name: '1-D rolling array',
        idea: 'Only the previous row is needed. Iterate w downward so each item is used at most once.',
        time: 'O(n · W)',
        space: 'O(W)',
        code: `function knapsack(weights, values, W) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let w = W; w >= weights[i]; w--)
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Longest Common Subsequence',
    also: ['Find the longest common subsequence between two strings'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '2-D table',
        idea: 'If the last chars match, +1 on the diagonal; else take the best of dropping one char from either string.',
        time: 'O(n · m)',
        space: 'O(n · m)',
        code: `function lcs(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[n][m];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DP O(n²)',
        idea: 'dp[i] = longest increasing subsequence ending at i = 1 + max(dp[j]) for j<i with nums[j]<nums[i].',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function lengthOfLIS(nums) {
  const dp = Array(nums.length).fill(1);
  let best = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
      },
      {
        name: 'Patience sorting + binary search',
        idea: 'Maintain `tails`, where tails[k] is the smallest possible tail of an increasing subsequence of length k+1. Binary-search the insert point.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Backtracking
  {
    topic: 'BackTracking',
    problem: 'Print all Subsequences of a string',
    also: ['subsets', 'print all subsets'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking (choose / un-choose)',
        idea: 'At each index, branch: include the element, recurse, then remove it and recurse again.',
        time: 'O(2ⁿ · n)',
        space: 'O(n) recursion',
        code: `function subsets(arr) {
  const res = [], path = [];
  const bt = (start) => {
    res.push([...path]);
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      bt(i + 1);
      path.pop();
    }
  };
  bt(0);
  return res;
}`,
      },
      {
        name: 'Bitmask enumeration',
        idea: 'Each subset maps to a number 0..2ⁿ−1; bit j set ⇒ include element j. No recursion.',
        time: 'O(2ⁿ · n)',
        space: 'O(1) extra',
        code: `function subsets(arr) {
  const n = arr.length, res = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const sub = [];
    for (let j = 0; j < n; j++) if (mask & (1 << j)) sub.push(arr[j]);
    res.push(sub);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Print all the permutations of the given string',
    also: ['permutations', 'Print all permutations of a string'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking with a used[] array',
        idea: 'Pick an unused element for the current position, recurse, then release it.',
        time: 'O(n! · n)',
        space: 'O(n)',
        code: `function permutations(arr) {
  const res = [], path = [], used = Array(arr.length).fill(false);
  const bt = () => {
    if (path.length === arr.length) { res.push([...path]); return; }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(arr[i]);
      bt();
      path.pop(); used[i] = false;
    }
  };
  bt();
  return res;
}`,
      },
      {
        name: 'In-place swap',
        idea: 'Fix each element into the first position by swapping, recurse on the rest, swap back.',
        time: 'O(n! · n)',
        space: 'O(n)',
        code: `function permutations(arr) {
  const res = [];
  const bt = (k) => {
    if (k === arr.length) { res.push([...arr]); return; }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      bt(k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  bt(0);
  return res;
}`,
      },
    ],
  },

  // ---------------------------------------------------------------- Bit Manipulation
  {
    topic: 'Bit Manipulation',
    problem: 'Count set bits in an integer',
    also: ['number of 1 bits', 'count total set bits'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Kernighan’s trick',
        idea: '`n & (n - 1)` clears the lowest set bit; count how many times you can do it.',
        time: 'O(set bits)',
        space: 'O(1)',
        code: `function countSetBits(n) {
  let count = 0;
  while (n) { n &= n - 1; count++; }
  return count;
}`,
      },
      {
        name: 'Shift and mask',
        idea: 'Check the last bit, shift right, repeat 32 times.',
        time: 'O(32)',
        space: 'O(1)',
        code: `function countSetBits(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) count += (n >>> i) & 1;
  return count;
}`,
      },
    ],
  },

  // ================================================================ Array (rest)
  {
    topic: 'Array',
    problem: 'Find the maximum and minimum element in an array',
    also: ['Maximum and minimum of an array using minimum number of comparisons'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Single pass',
        idea: 'Track the running min and max in one sweep.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minMax(a) {
  let mn = a[0], mx = a[0];
  for (const x of a) { if (x < mn) mn = x; if (x > mx) mx = x; }
  return { min: mn, max: mx };
}`,
      },
      {
        name: 'Pairwise comparison (fewer comparisons)',
        idea: 'Compare elements in pairs first, then each to min/max — ~3n/2 comparisons instead of 2n.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minMax(a) {
  let i = 0, mn, mx;
  if (a.length % 2) { mn = mx = a[0]; i = 1; }
  else { [mn, mx] = a[0] < a[1] ? [a[0], a[1]] : [a[1], a[0]]; i = 2; }
  for (; i < a.length; i += 2) {
    const [lo, hi] = a[i] < a[i + 1] ? [a[i], a[i + 1]] : [a[i + 1], a[i]];
    if (lo < mn) mn = lo;
    if (hi > mx) mx = hi;
  }
  return { min: mn, max: mx };
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Sort an array of 0s, 1s and 2s',
    also: ['Given an array which consists of only 0, 1 and 2. Sort the array without using any sorting algo'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Dutch National Flag (one pass)',
        idea: 'Three pointers: everything before `low` is 0, after `high` is 2, `mid` scans the unknown middle.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function sort012(a) {
  let low = 0, mid = 0, high = a.length - 1;
  while (mid <= high) {
    if (a[mid] === 0) { [a[low], a[mid]] = [a[mid], a[low]]; low++; mid++; }
    else if (a[mid] === 1) mid++;
    else { [a[mid], a[high]] = [a[high], a[mid]]; high--; }
  }
  return a;
}`,
      },
      {
        name: 'Counting sort',
        idea: 'Count 0s/1s/2s, then overwrite. Two passes, trivial to reason about.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function sort012(a) {
  const c = [0, 0, 0];
  for (const x of a) c[x]++;
  let i = 0;
  for (let v = 0; v < 3; v++) while (c[v]-- > 0) a[i++] = v;
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Move all negative elements to one side',
    also: ['Move all the negative elements to one side of the array'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers (order not preserved)',
        idea: 'Partition like quicksort: `j` tracks the boundary; swap each negative to the front.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function moveNegatives(a) {
  let j = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] < 0) { [a[i], a[j]] = [a[j], a[i]]; j++; }
  }
  return a;
}`,
        note: 'Preserving relative order in O(1) space needs the rotation trick and is O(n²); with O(n) space it is a stable two-bucket pass.',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Union and Intersection of two sorted arrays',
    also: ['Find the Union and Intersection of the two sorted arrays'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Merge-style two pointers',
        idea: 'Advance the pointer at the smaller value; equal values go to the intersection (and once to the union).',
        time: 'O(n + m)',
        space: 'O(n + m) output',
        code: `function unionIntersection(a, b) {
  let i = 0, j = 0;
  const uni = [], inter = [];
  const pushUni = (x) => { if (uni[uni.length - 1] !== x) uni.push(x); };
  while (i < a.length && j < b.length) {
    if (a[i] < b[j]) pushUni(a[i++]);
    else if (a[i] > b[j]) pushUni(b[j++]);
    else { pushUni(a[i]); inter.push(a[i]); i++; j++; }
  }
  while (i < a.length) pushUni(a[i++]);
  while (j < b.length) pushUni(b[j++]);
  return { union: uni, intersection: inter };
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Cyclically rotate an array',
    also: ['Write a program to cyclically rotate an array by one'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Rotate by one (shift)',
        idea: 'Save the last element, shift everyone right by one, put it in front.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function rotateByOne(a) {
  const last = a[a.length - 1];
  for (let i = a.length - 1; i > 0; i--) a[i] = a[i - 1];
  a[0] = last;
  return a;
}`,
      },
      {
        name: 'Rotate by k — reversal algorithm',
        idea: 'Reverse the whole array, then reverse the first k and the rest.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function rotate(a, k) {
  k %= a.length;
  const rev = (l, r) => { while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; } };
  rev(0, a.length - 1);
  rev(0, k - 1);
  rev(k, a.length - 1);
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Minimise the maximum difference between heights',
    also: ['Minimise the maximum difference between heights'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort, then try every split point',
        idea: 'Sorted, add k to a prefix and subtract k from the suffix. For each split, the new range is max(a[i-1]+k, a[n-1]-k) − min(a[0]+k, a[i]-k).',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function getMinDiff(a, k) {
  a.sort((x, y) => x - y);
  const n = a.length;
  let ans = a[n - 1] - a[0];
  for (let i = 1; i < n; i++) {
    if (a[i] - k < 0) continue;
    const high = Math.max(a[i - 1] + k, a[n - 1] - k);
    const low = Math.min(a[0] + k, a[i] - k);
    ans = Math.min(ans, high - low);
  }
  return ans;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Minimum number of jumps to reach the end',
    also: ['Minimum no. of Jumps to reach end of an array', 'Minimum number of jumps to reach end'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Greedy (BFS levels)',
        idea: 'Each "jump" covers a range; extend `farthest` while scanning it, and when you reach the current range end, take a jump.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minJumps(a) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < a.length - 1; i++) {
    farthest = Math.max(farthest, i + a[i]);
    if (i === curEnd) {
      if (farthest <= i) return -1; // stuck
      jumps++;
      curEnd = farthest;
    }
  }
  return jumps;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Merge two sorted arrays without extra space',
    also: ['Merge 2 sorted arrays without using Extra space'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Gap method (Shell-sort style)',
        idea: 'Start with gap = ceil((n+m)/2); compare and swap elements `gap` apart across both arrays; halve the gap until 1.',
        time: 'O((n+m) log(n+m))',
        space: 'O(1)',
        code: `function mergeInPlace(a, b) {
  const n = a.length, m = b.length, total = n + m;
  const at = (i) => (i < n ? a[i] : b[i - n]);
  const set = (i, v) => { if (i < n) a[i] = v; else b[i - n] = v; };
  let gap = Math.ceil(total / 2);
  while (gap > 0) {
    for (let i = 0; i + gap < total; i++) {
      if (at(i) > at(i + gap)) {
        const t = at(i); set(i, at(i + gap)); set(i + gap, t);
      }
    }
    gap = gap === 1 ? 0 : Math.ceil(gap / 2);
  }
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Next Permutation',
    also: ['Next Permutation'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Pivot, swap, reverse suffix',
        idea: 'Find the rightmost `i` with a[i] < a[i+1]. Swap a[i] with the rightmost element greater than it, then reverse the suffix after i.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function nextPermutation(a) {
  let i = a.length - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i >= 0) {
    let j = a.length - 1;
    while (a[j] <= a[i]) j--;
    [a[i], a[j]] = [a[j], a[i]];
  }
  // reverse suffix
  let l = i + 1, r = a.length - 1;
  while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Count Inversions',
    also: ['Count Inversion', 'Findthe inversion count'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Merge sort',
        idea: 'While merging two sorted halves, every time an element from the right half is picked before elements remain in the left, those remaining left elements are all inversions.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function countInversions(a) {
  let count = 0;
  const sort = (arr) => {
    if (arr.length < 2) return arr;
    const mid = arr.length >> 1;
    const L = sort(arr.slice(0, mid));
    const R = sort(arr.slice(mid));
    const merged = [];
    let i = 0, j = 0;
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) merged.push(L[i++]);
      else { merged.push(R[j++]); count += L.length - i; }
    }
    return merged.concat(L.slice(i), R.slice(j));
  };
  sort(a.slice());
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Common elements in three sorted arrays',
    also: ['find common elements In 3 sorted arrays'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Three pointers',
        idea: 'If all three current values are equal, record it; otherwise advance the pointer with the smallest value.',
        time: 'O(n1 + n2 + n3)',
        space: 'O(1)',
        code: `function commonElements(a, b, c) {
  let i = 0, j = 0, k = 0;
  const res = [];
  while (i < a.length && j < b.length && k < c.length) {
    if (a[i] === b[j] && b[j] === c[k]) {
      if (res[res.length - 1] !== a[i]) res.push(a[i]);
      i++; j++; k++;
    } else if (a[i] <= b[j] && a[i] <= c[k]) i++;
    else if (b[j] <= a[i] && b[j] <= c[k]) j++;
    else k++;
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Rearrange array in alternating positive and negative items',
    also: ['Rearrange the array in alternating positive and negative items with O(1) extra space'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'In-place rotation (order preserved)',
        idea: 'Scan for the first out-of-place pair; right-rotate the subarray from that index to the wrong element so it slots in. O(n²) worst but O(1) space and stable.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function rearrange(a) {
  const rotateRight = (arr, lo, hi) => {
    const t = arr[hi];
    for (let k = hi; k > lo; k--) arr[k] = arr[k - 1];
    arr[lo] = t;
  };
  let outOfPlace = -1;
  for (let i = 0; i < a.length; i++) {
    if (outOfPlace >= 0) {
      const wrongSign = (a[i] >= 0 && a[outOfPlace] < 0) || (a[i] < 0 && a[outOfPlace] >= 0);
      if (wrongSign) {
        rotateRight(a, outOfPlace, i);
        outOfPlace = i - outOfPlace >= 2 ? outOfPlace + 2 : -1;
      }
    }
    if (outOfPlace === -1) {
      const misplaced = (a[i] >= 0 && i % 2 === 1) || (a[i] < 0 && i % 2 === 0);
      if (misplaced) outOfPlace = i;
    }
  }
  return a;
}`,
        note: 'If order need not be preserved: two-pointer partition into negatives/positives, then swap alternate elements — O(n), O(1).',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Subarray with sum equal to 0',
    also: ['Find if there is any subarray with sum equal to 0'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Prefix sums in a set',
        idea: 'If the running prefix sum repeats (or is 0), the elements in between sum to 0.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hasZeroSumSubarray(a) {
  const seen = new Set([0]);
  let sum = 0;
  for (const x of a) {
    sum += x;
    if (seen.has(sum)) return true;
    seen.add(sum);
  }
  return false;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Factorial of a large number',
    also: ['Find factorial of a large number'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Digit array multiplication',
        idea: 'Store the result least-significant-digit first; multiply the whole array by each k from 2..n, propagating carry.',
        time: 'O(n · digits)',
        space: 'O(digits)',
        code: `function factorial(n) {
  let digits = [1];
  for (let k = 2; k <= n; k++) {
    let carry = 0;
    for (let i = 0; i < digits.length; i++) {
      const prod = digits[i] * k + carry;
      digits[i] = prod % 10;
      carry = Math.floor(prod / 10);
    }
    while (carry) { digits.push(carry % 10); carry = Math.floor(carry / 10); }
  }
  return digits.reverse().join('');
}`,
        note: 'In modern JS you can also just use BigInt: let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i;',
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Longest consecutive subsequence',
    also: ['Find longest coinsecutive subsequence'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Hash set, count from sequence starts',
        idea: 'Put all values in a set. A value begins a run only if value−1 is absent; from there count upward.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue;
    let len = 1;
    while (set.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Elements appearing more than n/k times',
    also: ['Given an array of size n and a number k, fin all elements that appear more than " n/k " times'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Generalised Boyer–Moore (k−1 counters)',
        idea: 'At most k−1 elements can exceed n/k. Keep k−1 candidate/count slots; a final pass verifies the true counts.',
        time: 'O(n · k)',
        space: 'O(k)',
        code: `function moreThanNK(a, k) {
  const cnt = new Map(); // up to k-1 entries
  for (const x of a) {
    if (cnt.has(x)) cnt.set(x, cnt.get(x) + 1);
    else if (cnt.size < k - 1) cnt.set(x, 1);
    else {
      for (const key of [...cnt.keys()]) {
        cnt.set(key, cnt.get(key) - 1);
        if (cnt.get(key) === 0) cnt.delete(key);
      }
    }
  }
  const res = [];
  for (const key of cnt.keys()) {
    if (a.filter((v) => v === key).length > a.length / k) res.push(key);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Maximum profit by buying and selling a share at most twice',
    also: ['Maximum profit by buying and selling a share atmost twice'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Four running states',
        idea: 'Track best value after buy1, sell1, buy2, sell2 as you scan prices once.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxProfitTwice(prices) {
  let buy1 = -Infinity, sell1 = 0, buy2 = -Infinity, sell2 = 0;
  for (const p of prices) {
    buy1 = Math.max(buy1, -p);
    sell1 = Math.max(sell1, buy1 + p);
    buy2 = Math.max(buy2, sell1 - p);
    sell2 = Math.max(sell2, buy2 + p);
  }
  return sell2;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Check whether an array is a subset of another array',
    also: ['Find whether an array is a subset of another array'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Hash set',
        idea: 'Put the bigger array in a set; every element of the smaller must be present.',
        time: 'O(n + m)',
        space: 'O(n)',
        code: `function isSubset(big, small) {
  const set = new Set(big);
  return small.every((x) => set.has(x));
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Find a triplet that sums to a given value',
    also: ['Find the triplet that sum to a given value', '3 sum'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + fix one + two pointers',
        idea: 'Sort. Fix index i, then two-pointer the rest for (target − a[i]).',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function findTriplet(a, target) {
  a.sort((x, y) => x - y);
  for (let i = 0; i < a.length - 2; i++) {
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (s === target) return [a[i], a[l], a[r]];
      s < target ? l++ : r--;
    }
  }
  return null;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Chocolate Distribution Problem',
    also: ['Chocolate Distribution problem'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort + sliding window of size m',
        idea: 'After sorting, the fairest set of m packets is a contiguous window; minimise (window max − window min).',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function minDiff(a, m) {
  a.sort((x, y) => x - y);
  let best = Infinity;
  for (let i = 0; i + m - 1 < a.length; i++) {
    best = Math.min(best, a[i + m - 1] - a[i]);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Smallest subarray with sum greater than a given value',
    also: ['Smallest Subarray with sum greater than a given value'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sliding window (positive numbers)',
        idea: 'Grow the window on the right; whenever the sum exceeds x, shrink from the left while it still does, recording the length.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function smallestSubWithSum(a, x) {
  let sum = 0, start = 0, best = Infinity;
  for (let end = 0; end < a.length; end++) {
    sum += a[end];
    while (sum > x) {
      best = Math.min(best, end - start + 1);
      sum -= a[start++];
    }
  }
  return best === Infinity ? 0 : best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Three-way partitioning around a range',
    also: ['Three way partitioning of an array around a given value'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Dutch-flag variant',
        idea: 'Elements < lowVal go left of `low`, elements > highVal go right of `high`, the rest stay in the middle.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function threeWayPartition(a, lowVal, highVal) {
  let low = 0, mid = 0, high = a.length - 1;
  while (mid <= high) {
    if (a[mid] < lowVal) { [a[low], a[mid]] = [a[mid], a[low]]; low++; mid++; }
    else if (a[mid] > highVal) { [a[mid], a[high]] = [a[high], a[mid]]; high--; }
    else mid++;
  }
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Minimum swaps to bring elements ≤ K together',
    also: ['Minimum swaps required bring elements less equal K together'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sliding window of "good" count',
        idea: 'Let `good` = count of elements ≤ K. Slide a window of size `good`; the answer is the minimum number of elements > K inside any such window.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minSwaps(a, k) {
  const good = a.filter((x) => x <= k).length;
  let bad = 0;
  for (let i = 0; i < good; i++) if (a[i] > k) bad++;
  let best = bad;
  for (let i = good; i < a.length; i++) {
    if (a[i] > k) bad++;
    if (a[i - good] > k) bad--;
    best = Math.min(best, bad);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Minimum operations to make an array palindrome',
    also: ['Minimum no. of operations required to make an array palindrome'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two pointers, merge the smaller side',
        idea: 'Compare ends. If equal, move both in. If left < right, merge a[l] into a[l+1] (one op). If left > right, merge a[r] into a[r−1].',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minOpsPalindrome(a) {
  let l = 0, r = a.length - 1, ops = 0;
  while (l < r) {
    if (a[l] === a[r]) { l++; r--; }
    else if (a[l] < a[r]) { a[l + 1] += a[l]; l++; ops++; }
    else { a[r - 1] += a[r]; r--; ops++; }
  }
  return ops;
}`,
      },
    ],
  },
  {
    topic: 'Array',
    problem: 'Median of two sorted arrays',
    also: ['Median of 2 sorted arrays of equal size', 'Median of 2 sorted arrays of different size'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Binary search on the partition of the smaller array',
        idea: 'Choose how many of the first array go in the left half; derive the count from the second. Slide until maxLeft ≤ minRight on both sides.',
        time: 'O(log min(n, m))',
        space: 'O(1)',
        code: `function findMedianSortedArrays(a, b) {
  if (a.length > b.length) [a, b] = [b, a];
  const n = a.length, m = b.length, half = (n + m + 1) >> 1;
  let lo = 0, hi = n;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;   // from a
    const j = half - i;         // from b
    const aLeft = i > 0 ? a[i - 1] : -Infinity;
    const aRight = i < n ? a[i] : Infinity;
    const bLeft = j > 0 ? b[j - 1] : -Infinity;
    const bRight = j < m ? b[j] : Infinity;
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((n + m) % 2) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    }
    if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  throw new Error('inputs not sorted');
}`,
      },
    ],
  },

  // ================================================================ String (rest)
  {
    topic: 'String',
    problem: 'Reverse a String',
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers (in place on a char array)',
        idea: 'Swap ends inward. JS strings are immutable, so operate on an array.',
        time: 'O(n)',
        space: 'O(n) for the array',
        code: `function reverseString(s) {
  const a = [...s];
  let l = 0, r = a.length - 1;
  while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
  return a.join('');
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Find duplicate characters in a string',
    also: ['Find Duplicate characters in a string'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Frequency map',
        idea: 'Count each character; report those with count > 1.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function duplicates(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  return [...freq].filter(([, n]) => n > 1).map(([c, n]) => ({ char: c, count: n }));
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Check whether one string is a rotation of another',
    also: ['Write a Code to check whether one string is a rotation of another'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Double-and-search',
        idea: 'b is a rotation of a iff b is a substring of a + a (and lengths match).',
        time: 'O(n) with a linear substring search',
        space: 'O(n)',
        code: `function isRotation(a, b) {
  return a.length === b.length && (a + a).includes(b);
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Check whether a string is a valid shuffle of two strings',
    also: ['Write a Program to check whether a string is a valid shuffle of two strings or not'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two-pointer merge check',
        idea: 'Walk the result; each character must match the front of a or b (preserving each source’s order).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isValidShuffle(a, b, result) {
  if (a.length + b.length !== result.length) return false;
  let i = 0, j = 0;
  for (const c of result) {
    if (i < a.length && a[i] === c) i++;
    else if (j < b.length && b[j] === c) j++;
    else return false;
  }
  return i === a.length && j === b.length;
}`,
        note: 'This greedy check can miss cases when a and b share a prefix; a fully correct solution uses interleaving DP: dp[i][j] = whether a[..i] + b[..j] forms result[..i+j].',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Count and Say',
    also: ['Count and Say problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Iterative run-length encoding',
        idea: 'Start from "1"; each next term describes the previous as "<count><digit>" runs.',
        time: 'O(n · length)',
        space: 'O(length)',
        code: `function countAndSay(n) {
  let s = '1';
  for (let k = 1; k < n; k++) {
    let next = '', i = 0;
    while (i < s.length) {
      let j = i;
      while (j < s.length && s[j] === s[i]) j++;
      next += (j - i) + s[i];
      i = j;
    }
    s = next;
  }
  return s;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Longest Repeating Subsequence',
    also: ['Find Longest Recurring Subsequence in String', 'Longest Repeated Subsequence'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'LCS of the string with itself (excluding equal indices)',
        idea: 'Run the LCS DP on (s, s) but only count a match when the two indices differ.',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function longestRepeatingSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = s[i - 1] === s[j - 1] && i !== j
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[n][n];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Split a binary string into two substrings with equal 0s and 1s',
    also: ['Split the Binary string into two substring with equal 0’s and 1’s'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Running counts',
        idea: 'Scan; every time zeros equals ones so far, you can cut. Count such cut points.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxSplits(s) {
  let zeros = 0, ones = 0, cuts = 0;
  for (const c of s) {
    c === '0' ? zeros++ : ones++;
    if (zeros === ones) cuts++;
  }
  return zeros === ones ? cuts : -1; // -1 if the whole string can't be balanced
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Word Wrap Problem',
    also: ['Word Wrap Problem', 'Word Wrap Problem [VERY IMP]'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'DP over line breaks',
        idea: 'dp[i] = min total cost to arrange words i..n. Try every valid end word for the current line; cost = (trailing spaces)² summed over lines (last line free).',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function wordWrap(words, width) {
  const n = words.length;
  const dp = Array(n + 1).fill(Infinity);
  dp[n] = 0;
  for (let i = n - 1; i >= 0; i--) {
    let lineLen = -1;
    for (let j = i; j < n; j++) {
      lineLen += words[j].length + 1;
      if (lineLen > width) break;
      const extra = j === n - 1 ? 0 : (width - lineLen) ** 2;
      dp[i] = Math.min(dp[i], extra + dp[j + 1]);
    }
  }
  return dp[0];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Edit Distance',
    also: ['EDIT Distance', 'Transform One String to Another using Minimum Number of Given Operation'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '2-D DP (Levenshtein)',
        idea: 'dp[i][j] = edits to turn a[..i] into b[..j]: 0 if chars match on the diagonal, else 1 + min(insert, delete, replace).',
        time: 'O(n · m)',
        space: 'O(n · m)',
        code: `function editDistance(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, (_, i) => Array(m + 1).fill(0).map((_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[n][m];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Next greater number with the same set of digits',
    also: ['Find next greater number with same set of digits'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Next permutation on the digit array',
        idea: 'Identical to "next permutation": find the rightmost ascending pair, swap with the next-larger digit to its right, reverse the suffix.',
        time: 'O(d)',
        space: 'O(d)',
        code: `function nextGreater(numStr) {
  const a = [...numStr];
  let i = a.length - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i < 0) return 'no greater number';
  let j = a.length - 1;
  while (a[j] <= a[i]) j--;
  [a[i], a[j]] = [a[j], a[i]];
  return a.slice(0, i + 1).join('') + a.slice(i + 1).reverse().join('');
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Word Break',
    also: ['Word break Problem', 'Word Break Problem using Backtracking'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DP over prefixes',
        idea: 'dp[i] = can s[0..i) be segmented. dp[i] is true if some j<i has dp[j] true and s[j..i) is in the dictionary.',
        time: 'O(n² · L)',
        space: 'O(n)',
        code: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (dp[j] && dict.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Rabin–Karp substring search',
    also: ['Rabin Karp Algo'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Rolling hash',
        idea: 'Hash the pattern and each length-m window of the text; roll the hash in O(1) per shift. On a hash match, verify char-by-char.',
        time: 'O(n + m) average, O(n·m) worst',
        space: 'O(1)',
        code: `function rabinKarp(text, pat) {
  const n = text.length, m = pat.length;
  if (m > n) return [];
  const B = 256, MOD = 1_000_000_007;
  let pHash = 0, tHash = 0, pow = 1;
  for (let i = 0; i < m - 1; i++) pow = (pow * B) % MOD;
  for (let i = 0; i < m; i++) {
    pHash = (pHash * B + pat.charCodeAt(i)) % MOD;
    tHash = (tHash * B + text.charCodeAt(i)) % MOD;
  }
  const res = [];
  for (let i = 0; i + m <= n; i++) {
    if (pHash === tHash && text.slice(i, i + m) === pat) res.push(i);
    if (i + m < n) {
      tHash = ((tHash - text.charCodeAt(i) * pow) % MOD + MOD) % MOD;
      tHash = (tHash * B + text.charCodeAt(i + m)) % MOD;
    }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'KMP substring search',
    also: ['KMP Algo'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Prefix-function (failure table)',
        idea: 'Precompute, for each pattern prefix, the longest proper prefix that is also a suffix. On a mismatch, jump the pattern pointer back using that table instead of restarting.',
        time: 'O(n + m)',
        space: 'O(m)',
        code: `function kmp(text, pat) {
  const m = pat.length;
  const lps = Array(m).fill(0);
  for (let i = 1, len = 0; i < m; ) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  const res = [];
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pat[j]) { i++; j++; if (j === m) { res.push(i - m); j = lps[j - 1]; } }
    else if (j) j = lps[j - 1];
    else i++;
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Convert a sentence into its mobile numeric keypad sequence',
    also: ['Convert a Sentence into its equivalent mobile numeric keypad sequence'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Lookup table',
        idea: 'Map each letter to its key presses (a→2, b→22, …); concatenate.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function keypadSequence(sentence) {
  const keys = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const map = {};
  for (let d = 2; d <= 9; d++)
    [...keys[d]].forEach((ch, i) => (map[ch] = String(d).repeat(i + 1)));
  return [...sentence.toLowerCase()].map((c) => (c === ' ' ? '0' : map[c] || '')).join('');
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Minimum bracket reversals to balance an expression',
    also: ['Minimum number of bracket reversals needed to make an expression balanced'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Reduce, then count leftover open/close',
        idea: 'Cancel every matched "()". From the leftover "}}}...{{{" with c closers and o openers, the answer is ceil(c/2) + ceil(o/2).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minReversals(s) {
  if (s.length % 2) return -1;
  let open = 0, close = 0;
  for (const c of s) {
    if (c === '{') open++;
    else if (open > 0) open--;   // matched a pair
    else close++;                // an unmatched '}'
  }
  return Math.ceil(open / 2) + Math.ceil(close / 2);
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Minimum swaps for bracket balancing',
    also: ['Minimum number of swaps for bracket balancing'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Track imbalance; each unmatched close costs its distance',
        idea: 'Scan; keep the running balance. On each unmatched "]", the number of swaps needed equals the count of "[" still waiting minus already-fixed — accumulate `imbalance` and add it when balance goes negative.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minSwaps(s) {
  let balance = 0, swaps = 0, imbalance = 0;
  for (const c of s) {
    if (c === '[') {
      balance++;
      if (imbalance > 0) { swaps += imbalance; imbalance--; }
    } else {
      balance--;
      if (balance < 0) imbalance++;
    }
  }
  return swaps;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Count all palindromic subsequences',
    also: ['Count All Palindromic Subsequence in a given String'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Interval DP',
        idea: 'dp[i][j] = count in s[i..j]. dp[i][j] = dp[i+1][j] + dp[i][j-1] − dp[i+1][j-1], and +dp[i+1][j-1]+1 when s[i]===s[j].',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function countPalindromicSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = dp[i + 1][j] + dp[i][j - 1] - (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
      if (s[i] === s[j]) dp[i][j] += 1 + (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
    }
  }
  return dp[0][n - 1];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Search a word in a 2D grid of characters',
    also: ['Search a Word in a 2D Grid of characters', 'Count of number of given string in 2D character array'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS from every cell in 8 directions',
        idea: 'From each cell that matches word[0], walk in a fixed direction matching subsequent characters.',
        time: 'O(R·C·8·L)',
        space: 'O(1)',
        code: `function findWord(grid, word) {
  const R = grid.length, C = grid[0].length;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const hits = [];
  const ok = (r, c, dr, dc) => {
    for (let k = 0; k < word.length; k++) {
      const nr = r + dr * k, nc = c + dc * k;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C || grid[nr][nc] !== word[k]) return false;
    }
    return true;
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === word[0])
        for (const [dr, dc] of dirs)
          if (ok(r, c, dr, dc)) hits.push([r, c, dr, dc]);
  return hits;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Boyer–Moore pattern searching (bad-character rule)',
    also: ['Boyer Moore Algorithm for Pattern Searching'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Bad-character heuristic',
        idea: 'Align the pattern; compare right-to-left. On a mismatch, shift so the mismatched text char lines up with its last occurrence in the pattern (or past it).',
        time: 'O(n/m) best, O(n·m) worst',
        space: 'O(alphabet)',
        code: `function boyerMoore(text, pat) {
  const n = text.length, m = pat.length;
  const last = new Map();
  for (let i = 0; i < m; i++) last.set(pat[i], i);
  const res = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pat[j] === text[s + j]) j--;
    if (j < 0) { res.push(s); s += m; }
    else {
      const lo = last.has(text[s + j]) ? last.get(text[s + j]) : -1;
      s += Math.max(1, j - lo);
    }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Convert Roman numerals to decimal',
    also: ['Converting Roman Numerals to Decimal'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Subtract when a smaller value precedes a larger',
        idea: 'Add each symbol’s value, but if it is smaller than the next symbol, subtract it instead.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function romanToInt(s) {
  const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && v[s[i]] < v[s[i + 1]]) total -= v[s[i]];
    else total += v[s[i]];
  }
  return total;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Minimum flips to make a binary string alternate',
    also: ['Number of flips to make binary string alternate'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Compare against both alternating patterns',
        idea: 'Count mismatches versus "0101…"; mismatches versus "1010…" is n minus that. Answer is the smaller.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minFlips(s) {
  let diff = 0;
  for (let i = 0; i < s.length; i++) {
    const expected = i % 2 === 0 ? '0' : '1';
    if (s[i] !== expected) diff++;
  }
  return Math.min(diff, s.length - diff);
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Find the first repeated word in a string',
    also: ['Find the first repeated word in string'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Set of seen words',
        idea: 'Split on whitespace; the first word already in the set is the answer.',
        time: 'O(n)',
        space: 'O(w)',
        code: `function firstRepeatedWord(s) {
  const seen = new Set();
  for (const w of s.toLowerCase().split(/\\s+/)) {
    if (seen.has(w)) return w;
    seen.add(w);
  }
  return null;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Smallest window containing all distinct characters of itself',
    also: ['Write a program tofind the smallest window that contains all characters of string itself'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sliding window over the distinct-count target',
        idea: 'Target = number of distinct characters in the whole string. Expand right until the window has them all, then contract left.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function smallestDistinctWindow(s) {
  const target = new Set(s).size;
  const count = new Map();
  let have = 0, start = 0, best = s;
  for (let end = 0; end < s.length; end++) {
    const c = s[end];
    count.set(c, (count.get(c) || 0) + 1);
    if (count.get(c) === 1) have++;
    while (have === target) {
      if (end - start + 1 < best.length) best = s.slice(start, end + 1);
      const lc = s[start++];
      count.set(lc, count.get(lc) - 1);
      if (count.get(lc) === 0) have--;
    }
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Rearrange a string so no two adjacent characters are the same',
    also: ['Rearrange characters in a string such that no two adjacent are same', 'Leetcode- reorganize strings', 'reorganize strings'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Greedy — always place the most frequent remaining char',
        idea: 'Repeatedly append the highest-count character that is not the one just placed. Impossible iff some char’s count exceeds ceil(n/2).',
        time: 'O(n · k)',
        space: 'O(k)',
        code: `function reorganize(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  let res = '', prev = '';
  for (let i = 0; i < s.length; i++) {
    let best = '';
    for (const [c, n] of freq) if (n > 0 && c !== prev && (best === '' || n > freq.get(best))) best = c;
    if (best === '') return '';
    res += best;
    freq.set(best, freq.get(best) - 1);
    prev = best;
  }
  return res;
}`,
        note: 'With a real max-heap keyed by frequency this is O(n log k).',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Minimum characters to add at front to make a string palindrome',
    also: ['Minimum characters to be added at front to make string palindrome'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'KMP failure function on s + "#" + reverse(s)',
        idea: 'The longest prefix of s that is also a suffix of reverse(s) is the longest palindromic prefix. Characters to add = n − that length.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function minCharsFront(s) {
  const combined = s + '#' + [...s].reverse().join('');
  const lps = Array(combined.length).fill(0);
  for (let i = 1, len = 0; i < combined.length; ) {
    if (combined[i] === combined[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return s.length - lps[lps.length - 1];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Group all anagrams together',
    also: ['Given a sequence of words, print all anagrams together'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Bucket by sorted characters',
        idea: 'Two words are anagrams iff their sorted-letter strings match; use that as a map key.',
        time: 'O(n · k log k)',
        space: 'O(n · k)',
        code: `function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
        note: 'Use a 26-length count vector as the key to drop the sort → O(n·k).',
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Generate all valid IP addresses from a string',
    also: ['Program to generate all possible valid IP addresses from given  string'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking with 4 segments',
        idea: 'Place 3 dots. Each of the 4 parts is 1–3 digits, ≤ 255, and has no leading zero (unless it is "0").',
        time: 'O(1) — at most 3⁴ splits',
        space: 'O(1)',
        code: `function restoreIps(s) {
  const res = [];
  const valid = (seg) => seg.length >= 1 && seg.length <= 3 &&
    (seg === '0' || (seg[0] !== '0' && +seg <= 255));
  const bt = (start, parts) => {
    if (parts.length === 4) { if (start === s.length) res.push(parts.join('.')); return; }
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const seg = s.slice(start, start + len);
      if (valid(seg)) bt(start + len, [...parts, seg]);
    }
  };
  bt(0, []);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Recursively remove all adjacent duplicates',
    also: ['Recursively remove all adjacent duplicates'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Stack',
        idea: 'Push chars; if the incoming char equals the stack top, pop the whole run instead of pushing (and skip the rest of that run).',
        time: 'O(n)',
        space: 'O(n)',
        code: `function removeAdjacentDuplicates(s) {
  const st = [];
  let i = 0;
  while (i < s.length) {
    if (st.length && st[st.length - 1] === s[i]) {
      const dup = s[i];
      while (i < s.length && s[i] === dup) i++;
      st.pop();
    } else {
      st.push(s[i++]);
    }
  }
  return st.join('');
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Wildcard string matching (? and *)',
    also: ['String matching where one string contains wildcard characters'],
    difficulty: 'Hard',
    approaches: [
      {
        name: '2-D DP',
        idea: 'dp[i][j] = does pattern[..j] match text[..i]. "?" matches any single char; "*" matches empty (dp[i][j-1]) or one-more (dp[i-1][j]).',
        time: 'O(n · m)',
        space: 'O(n · m)',
        code: `function isMatch(text, pattern) {
  const n = text.length, m = pattern.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++) if (pattern[j - 1] === '*') dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
      if (pattern[j - 1] === '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      else if (pattern[j - 1] === '?' || pattern[j - 1] === text[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  return dp[n][m];
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Number of customers who could not get a computer',
    also: ['Function to find Number of customers who could not get a computer'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Simulate seats with a set',
        idea: 'First time a customer id appears they take a seat (if one is free, else they walk away). Second appearance frees the seat.',
        time: 'O(n)',
        space: 'O(seats)',
        code: `function turnedAway(seq, k) {
  const seated = new Set();
  const walkedAway = new Set();
  let turned = 0;
  for (const id of seq) {
    if (seated.has(id)) seated.delete(id);           // leaving
    else if (walkedAway.has(id)) walkedAway.delete(id); // second visit after being turned away
    else if (seated.size < k) seated.add(id);        // gets a seat
    else { turned++; walkedAway.add(id); }           // no seat
  }
  return turned;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Check if two strings are isomorphic',
    also: ['Check if two given strings are isomorphic to each other'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two consistency maps',
        idea: 'Each char of a must map to exactly one char of b and vice-versa.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isIsomorphic(a, b) {
  if (a.length !== b.length) return false;
  const ab = new Map(), ba = new Map();
  for (let i = 0; i < a.length; i++) {
    if (ab.has(a[i]) && ab.get(a[i]) !== b[i]) return false;
    if (ba.has(b[i]) && ba.get(b[i]) !== a[i]) return false;
    ab.set(a[i], b[i]);
    ba.set(b[i], a[i]);
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'String',
    problem: 'Print all sentences from a list of word lists',
    also: ['Recursively print all sentences that can be formed from list of word lists'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking across rows',
        idea: 'Pick one word from row i, recurse to row i+1; a complete sentence is one word from every row.',
        time: 'O(product of row sizes)',
        space: 'O(rows)',
        code: `function allSentences(lists) {
  const res = [];
  const bt = (row, acc) => {
    if (row === lists.length) { res.push(acc.join(' ')); return; }
    for (const w of lists[row]) bt(row + 1, [...acc, w]);
  };
  bt(0, []);
  return res;
}`,
      },
    ],
  },

  // ================================================================ Matrix
  {
    topic: 'Matrix',
    problem: 'Spiral traversal of a matrix',
    also: ['Spiral traversal on a Matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Shrinking boundaries',
        idea: 'Keep top/bottom/left/right walls; walk right, down, left, up, moving the wall in after each pass.',
        time: 'O(R·C)',
        space: 'O(1) extra',
        code: `function spiralOrder(m) {
  const res = [];
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(m[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(m[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) res.push(m[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) res.push(m[r][left]); left++; }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Search an element in a matrix',
    also: ['Search an element in a matriix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Staircase search (rows & columns sorted)',
        idea: 'Start at the top-right. If it is bigger than target move left, if smaller move down. Each step eliminates a row or column.',
        time: 'O(R + C)',
        space: 'O(1)',
        code: `function searchMatrix(m, target) {
  let r = 0, c = m[0].length - 1;
  while (r < m.length && c >= 0) {
    if (m[r][c] === target) return [r, c];
    m[r][c] > target ? c-- : r++;
  }
  return null;
}`,
      },
      {
        name: 'Binary search (fully sorted, row-major)',
        idea: 'Treat the R·C cells as one sorted array; map index → (row, col).',
        time: 'O(log(R·C))',
        space: 'O(1)',
        code: `function searchMatrix(m, target) {
  const R = m.length, C = m[0].length;
  let lo = 0, hi = R * C - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = m[Math.floor(mid / C)][mid % C];
    if (v === target) return true;
    v < target ? (lo = mid + 1) : (hi = mid - 1);
  }
  return false;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Median in a row-wise sorted matrix',
    also: ['Find median in a row wise sorted matrix'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Binary search on the value',
        idea: 'For a candidate value, count how many cells are ≤ it (binary search per row). The median is the smallest value with count ≥ (R·C+1)/2.',
        time: 'O(R · log C · log(range))',
        space: 'O(1)',
        code: `function matrixMedian(m) {
  const R = m.length, C = m[0].length, need = (R * C + 1) >> 1;
  let lo = Math.min(...m.map((row) => row[0]));
  let hi = Math.max(...m.map((row) => row[C - 1]));
  const countLE = (x) => m.reduce((acc, row) => {
    let l = 0, r = C;
    while (l < r) { const mid = (l + r) >> 1; row[mid] <= x ? (l = mid + 1) : (r = mid); }
    return acc + l;
  }, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    countLE(mid) < need ? (lo = mid + 1) : (hi = mid);
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Row with the maximum number of 1s',
    also: ["Find row with maximum no. of 1's"],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Staircase from top-right',
        idea: 'Each row is sorted (0s then 1s). Move left while the current cell is 1; every time you can, that row has more 1s.',
        time: 'O(R + C)',
        space: 'O(1)',
        code: `function rowWithMostOnes(m) {
  let best = -1, c = m[0].length - 1;
  for (let r = 0; r < m.length; r++) {
    while (c >= 0 && m[r][c] === 1) { c--; best = r; }
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Print elements in sorted order (row- and column-sorted matrix)',
    also: ['Print elements in sorted order using row-column wise sorted matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-heap of row frontiers (merge k sorted lists)',
        idea: 'Each row is sorted; push the first cell of every row into a min-heap, pop the smallest, and push the next cell from that row.',
        time: 'O(R·C · log R)',
        space: 'O(R)',
        code: `function sortedOrder(m) {
  const heap = m.map((row, r) => [row[0], r, 0]);
  heap.sort((a, b) => a[0] - b[0]);
  const out = [];
  while (heap.length) {
    const [val, r, c] = heap.shift();
    out.push(val);
    if (c + 1 < m[r].length) {
      const next = [m[r][c + 1], r, c + 1];
      let i = heap.findIndex((x) => x[0] > next[0]);
      i === -1 ? heap.push(next) : heap.splice(i, 0, next);
    }
  }
  return out;
}`,
        note: 'Shown with a sorted array for brevity; a real binary min-heap makes each push/pop O(log R).',
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Maximum size rectangle of 1s in a binary matrix',
    also: ['Maximum size rectangle'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Row-by-row histogram + largest rectangle in histogram',
        idea: 'For each row, build a histogram of consecutive 1s upward, then run the O(n) stack-based "largest rectangle in histogram" on it.',
        time: 'O(R·C)',
        space: 'O(C)',
        code: `function maximalRectangle(m) {
  const C = m[0].length;
  const heights = Array(C).fill(0);
  let best = 0;
  for (const row of m) {
    for (let c = 0; c < C; c++) heights[c] = row[c] ? heights[c] + 1 : 0;
    best = Math.max(best, largestInHistogram(heights));
  }
  return best;
}
function largestInHistogram(h) {
  const st = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    while (st.length && h[st[st.length - 1]] >= cur) {
      const height = h[st.pop()];
      const width = st.length ? i - st[st.length - 1] - 1 : i;
      best = Math.max(best, height * width);
    }
    st.push(i);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Maximum value of a[c][d] − a[a][b] with c > a and d > b',
    also: ['Find a specific pair in matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Suffix max of the bottom-right submatrix',
        idea: 'maxFromBelowRight[i][j] = max over the submatrix below and right of (i,j). Answer = max(maxFromBelowRight[i+1][j+1] − a[i][j]).',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function maxDiff(a) {
  const n = a.length;
  const suf = Array.from({ length: n + 1 }, () => Array(n + 1).fill(-Infinity));
  let ans = -Infinity;
  for (let i = n - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--) {
      suf[i][j] = Math.max(a[i][j], suf[i + 1][j], suf[i][j + 1]);
      if (i + 1 < n && j + 1 < n) ans = Math.max(ans, suf[i + 1][j + 1] - a[i][j]);
    }
  return ans;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Rotate a matrix by 90 degrees',
    also: ['Rotate matrix by 90 degrees'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Transpose, then reverse each row',
        idea: 'Transposing swaps rows/columns; reversing each row then gives a clockwise 90° rotation. In place.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function rotate(m) {
  const n = m.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
  for (const row of m) row.reverse();
  return m;
}`,
        note: 'Counter-clockwise: reverse each row first, then transpose (or reverse the row order after transpose).',
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Kth smallest element in a row- and column-sorted matrix',
    also: ['Kth smallest element in a row-cpumn wise sorted matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search on the value',
        idea: 'Count cells ≤ mid with a staircase walk (O(n)). The answer is the smallest value whose count ≥ k.',
        time: 'O(n · log(range))',
        space: 'O(1)',
        code: `function kthSmallest(m, k) {
  const n = m.length;
  let lo = m[0][0], hi = m[n - 1][n - 1];
  const countLE = (x) => {
    let cnt = 0, r = n - 1, c = 0;
    while (r >= 0 && c < n) {
      if (m[r][c] <= x) { cnt += r + 1; c++; }
      else r--;
    }
    return cnt;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    countLE(mid) < k ? (lo = mid + 1) : (hi = mid);
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Matrix',
    problem: 'Common elements in all rows of a matrix',
    also: ['Common elements in all rows of a given matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Frequency map seeded by the first row',
        idea: 'Put row 0 in a map (value → 1). For each later row, bump a value only if its stored count equals the current row index. At the end, values with count === R are common to all.',
        time: 'O(R·C)',
        space: 'O(C)',
        code: `function commonInAllRows(m) {
  const R = m.length;
  const cnt = new Map();
  for (const v of m[0]) cnt.set(v, 1);
  for (let r = 1; r < R; r++)
    for (const v of m[r])
      if (cnt.get(v) === r) cnt.set(v, r + 1);
  return [...cnt].filter(([, c]) => c === R).map(([v]) => v);
}`,
      },
    ],
  },

  // ================================================================ Searching & Sorting (rest)
  {
    topic: 'Searching & Sorting',
    problem: 'Find a fixed point (value equal to index)',
    also: ['Find a Fixed Point (Value equal to index) in a given array'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Binary search (distinct sorted array)',
        idea: 'If a[mid] === mid you are done. If a[mid] < mid the fixed point can only be on the right, else on the left.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function fixedPoint(a) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === mid) return mid;
    a[mid] < mid ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Integer square root',
    also: ['square root of an integer'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Binary search on the answer',
        idea: 'Search 0..x for the largest m with m·m ≤ x.',
        time: 'O(log x)',
        space: 'O(1)',
        code: `function isqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (mid <= x / mid) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Find the repeating and the missing number',
    also: ['Find the repeating and the missing'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sum and sum-of-squares',
        idea: 'Let S = Σa − Σ1..n = repeat − missing, and P = Σa² − Σi² = repeat² − missing². Solve the two equations.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function repeatAndMissing(a) {
  const n = a.length;
  let s = 0, p = 0;
  for (let i = 1; i <= n; i++) {
    s += a[i - 1] - i;
    p += a[i - 1] * a[i - 1] - i * i;
  }
  // s = r - m,  p = r^2 - m^2 = (r - m)(r + m)  =>  r + m = p / s
  const sum = p / s;
  const repeat = (s + sum) / 2;
  return { repeat, missing: repeat - s };
}`,
        note: 'XOR method avoids overflow: xor all a and 1..n, isolate a set bit, bucket into two groups.',
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Majority element (> n/2 times)',
    also: ['find majority element'],
    difficulty: 'Easy',
    approaches: [
      {
        name: "Boyer–Moore voting",
        idea: 'Keep a candidate and a count; +1 on a match, −1 otherwise; reset the candidate when count hits 0. A final scan verifies.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function majorityElement(a) {
  let cand = null, count = 0;
  for (const x of a) {
    if (count === 0) cand = x;
    count += x === cand ? 1 : -1;
  }
  return a.filter((x) => x === cand).length > a.length / 2 ? cand : -1;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Search in an array where adjacent elements differ by at most k',
    also: ['Searching in an array where adjacent differ by at most k'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Jump by the guaranteed gap',
        idea: 'Since neighbours differ by ≤ k, the target is at least |a[i] − target| / k positions away — skip that many.',
        time: 'O(n / k) roughly',
        space: 'O(1)',
        code: `function search(a, k, target) {
  let i = 0;
  while (i < a.length) {
    if (a[i] === target) return i;
    i += Math.max(1, Math.floor(Math.abs(a[i] - target) / k));
  }
  return -1;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Find a pair with a given difference',
    also: ['find a pair with a given difference'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort + two pointers',
        idea: 'Sort ascending. Move two pointers so that a[j] − a[i] converges on the target difference.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function pairWithDiff(a, d) {
  a.sort((x, y) => x - y);
  let i = 0, j = 1;
  while (i < a.length && j < a.length) {
    const diff = a[j] - a[i];
    if (i !== j && diff === d) return [a[i], a[j]];
    if (diff < d) j++;
    else i++;
  }
  return null;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Find four elements that sum to a given value (4-sum)',
    also: ['find four elements that sum to a given value'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + fix two + two pointers',
        idea: 'Two nested loops fix a and b; a two-pointer scan finds c, d for the remaining target. Skip duplicates.',
        time: 'O(n³)',
        space: 'O(1)',
        code: `function fourSum(a, target) {
  a.sort((x, y) => x - y);
  const res = [];
  const n = a.length;
  for (let i = 0; i < n - 3; i++) {
    if (i && a[i] === a[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && a[j] === a[j - 1]) continue;
      let l = j + 1, r = n - 1;
      while (l < r) {
        const s = a[i] + a[j] + a[l] + a[r];
        if (s === target) {
          res.push([a[i], a[j], a[l], a[r]]);
          while (l < r && a[l] === a[l + 1]) l++;
          while (l < r && a[r] === a[r - 1]) r--;
          l++; r--;
        } else if (s < target) l++;
        else r--;
      }
    }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Count triplets with sum smaller than a given value',
    also: ['Count triplet with sum smaller than a given value'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + two pointers',
        idea: 'Fix i; with l = i+1 and r = end, if a[i]+a[l]+a[r] < target then all r−l triplets between l and r qualify — advance l; otherwise decrease r.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function countTriplets(a, target) {
  a.sort((x, y) => x - y);
  let count = 0;
  for (let i = 0; i < a.length - 2; i++) {
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      if (a[i] + a[l] + a[r] < target) { count += r - l; l++; }
      else r--;
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Merge two sorted arrays into a new array',
    also: ['merge 2 sorted arrays'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers',
        idea: 'Repeatedly take the smaller head of the two arrays.',
        time: 'O(n + m)',
        space: 'O(n + m)',
        code: `function merge(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Print all subarrays with sum 0',
    also: ['print all subarrays with 0 sum'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Prefix sum → list of indices',
        idea: 'Map each prefix sum to all indices where it occurs. Any two indices with the same prefix sum bound a zero-sum subarray.',
        time: 'O(n) + output',
        space: 'O(n)',
        code: `function zeroSumSubarrays(a) {
  const map = new Map([[0, [-1]]]);
  let sum = 0;
  const res = [];
  for (let i = 0; i < a.length; i++) {
    sum += a[i];
    if (map.has(sum)) for (const start of map.get(sum)) res.push([start + 1, i]);
    if (!map.has(sum)) map.set(sum, []);
    map.get(sum).push(i);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Product array puzzle (product of all except self)',
    also: ['Product array Puzzle'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Prefix and suffix products, no division',
        idea: 'res[i] = (product of everything left of i) · (product of everything right of i). Two passes; reuse the output array.',
        time: 'O(n)',
        space: 'O(1) extra',
        code: `function productExceptSelf(a) {
  const n = a.length, res = Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= a[i]; }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= a[i]; }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Sort an array by the number of set bits',
    also: ['Sort array according to count of set bits'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Stable sort with a popcount comparator',
        idea: 'Sort descending by popcount; ties keep their original order (use a stable sort or a secondary key).',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `const popcount = (x) => { let c = 0; while (x) { x &= x - 1; c++; } return c; };
function sortBySetBits(a) {
  return a
    .map((v, i) => [v, i, popcount(v)])
    .sort((p, q) => q[2] - p[2] || p[1] - q[1])
    .map((t) => t[0]);
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Minimum number of swaps to sort an array',
    also: ['minimum no. of swaps required to sort the array'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Cycle decomposition',
        idea: 'Pair each value with its target index; the permutation splits into cycles. A cycle of length L needs L−1 swaps.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function minSwaps(a) {
  const sorted = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
  const seen = Array(a.length).fill(false);
  let swaps = 0;
  for (let i = 0; i < a.length; i++) {
    if (seen[i] || sorted[i][1] === i) continue;
    let len = 0, j = i;
    while (!seen[j]) { seen[j] = true; j = sorted[j][1]; len++; }
    swaps += len - 1;
  }
  return swaps;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Bishu and Soldiers',
    also: ['Bishu and Soldiers'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort + prefix sums + binary search per query',
        idea: 'Sort soldier powers, precompute prefix sums. For each round power P, binary-search the count of soldiers with power ≤ P and read the matching prefix sum.',
        time: 'O(n log n + q log n)',
        space: 'O(n)',
        code: `function bishu(powers, queries) {
  powers.sort((a, b) => a - b);
  const prefix = [0];
  for (const p of powers) prefix.push(prefix[prefix.length - 1] + p);
  return queries.map((P) => {
    let lo = 0, hi = powers.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; powers[mid] <= P ? (lo = mid + 1) : (hi = mid); }
    return { killed: lo, powerGained: prefix[lo] };
  });
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Kth element of two sorted arrays',
    also: ['K-th Element of Two Sorted Arrays'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Merge until k (simple)',
        idea: 'Two pointers; take k−1 smaller heads, the kth is the answer.',
        time: 'O(k)',
        space: 'O(1)',
        code: `function kthElement(a, b, k) {
  let i = 0, j = 0;
  while (true) {
    if (i === a.length) return b[j + k - 1];
    if (j === b.length) return a[i + k - 1];
    if (k === 1) return Math.min(a[i], b[j]);
    a[i] <= b[j] ? i++ : j++;
    k--;
  }
}`,
      },
      {
        name: 'Binary search on the split (O(log)',
        idea: 'Same partition idea as "median of two sorted arrays": pick how many come from a, derive the rest from b, adjust until the split is valid.',
        time: 'O(log(min(n, m)))',
        space: 'O(1)',
        code: `function kthElement(a, b, k) {
  if (a.length > b.length) [a, b] = [b, a];
  let lo = Math.max(0, k - b.length), hi = Math.min(k, a.length);
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = k - i;
    const aL = i > 0 ? a[i - 1] : -Infinity;
    const aR = i < a.length ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : -Infinity;
    const bR = j < b.length ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) return Math.max(aL, bL);
    if (aL > bR) hi = i - 1; else lo = i + 1;
  }
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Binary search on the answer — Aggressive Cows, Book Allocation, Painter’s Partition, EKO, ROTI-Prata',
    also: ['Aggressive cows', 'Book Allocation Problem', 'Painters Partition Problem', 'EKOSPOJ', 'ROTI-Prata SPOJ', 'Job Scheduling Algo'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'The pattern',
        idea: 'These all ask for the min/max feasible value of some quantity. The feasibility check is monotonic, so binary-search the answer space and test each candidate greedily in O(n).',
        time: 'O(n · log(range))',
        space: 'O(1)',
        code: `// generic driver
function binarySearchAnswer(lo, hi, feasible) {
  // finds the smallest value in [lo, hi] for which feasible() is true
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    feasible(mid) ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}`,
      },
      {
        name: 'Aggressive Cows — maximise the minimum gap',
        idea: 'Sort stalls. For a candidate min distance d, greedily place cows; feasible if you can place all C. Search for the largest feasible d.',
        time: 'O(n log n + n log(range))',
        space: 'O(1)',
        code: `function aggressiveCows(stalls, cows) {
  stalls.sort((a, b) => a - b);
  const canPlace = (d) => {
    let placed = 1, last = stalls[0];
    for (let i = 1; i < stalls.length; i++)
      if (stalls[i] - last >= d) { placed++; last = stalls[i]; }
    return placed >= cows;
  };
  let lo = 1, hi = stalls[stalls.length - 1] - stalls[0], ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canPlace(mid)) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}`,
      },
      {
        name: 'Book Allocation / Painter’s Partition — minimise the maximum load',
        idea: 'For a candidate max load per student/painter, greedily fill; feasible if the number of groups ≤ k. Search for the smallest feasible max.',
        time: 'O(n log(sum))',
        space: 'O(1)',
        code: `function allocateBooks(pages, students) {
  const fits = (limit) => {
    let groups = 1, cur = 0;
    for (const p of pages) {
      if (p > limit) return false;
      if (cur + p > limit) { groups++; cur = p; } else cur += p;
    }
    return groups <= students;
  };
  let lo = Math.max(...pages), hi = pages.reduce((a, b) => a + b, 0), ans = hi;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (fits(mid)) { ans = mid; hi = mid - 1; } else lo = mid + 1;
  }
  return ans;
}`,
        note: 'EKO (cut trees at height h so total wood ≥ M): binary-search h, feasibility = Σ max(0, tree − h) ≥ M. ROTI-Prata (finish P pratas in time T with cooks of rank r): binary-search T, feasibility = Σ (pratas each cook can make in T) ≥ P.',
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Find pivot (minimum) in a rotated sorted array',
    also: ['Find pivot element in a sorted array'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Binary search for the rotation point',
        idea: 'If a[mid] > a[hi] the minimum is to the right of mid; otherwise it is mid or to the left.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function findMin(a) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] > a[hi]) lo = mid + 1;
    else hi = mid;
  }
  return lo; // index of the minimum
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Missing number in an arithmetic progression',
    also: ['Missing Number in AP'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Binary search using the common difference',
        idea: 'd = (last − first) / n (with one term missing there are n terms of an original n+1). The missing element is where a[mid] !== first + mid·d.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function missingInAP(a) {
  const n = a.length;
  const d = (a[n - 1] - a[0]) / n; // n gaps expected across n+1 terms
  let lo = 0, hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === a[0] + mid * d) lo = mid + 1;
    else hi = mid;
  }
  return a[0] + lo * d;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Smallest number whose factorial has at least n trailing zeros',
    also: ['Smallest number with atleastn trailing zeroes infactorial'],
    difficulty: 'Medium',
    approaches: [
      {
        name: "Binary search + Legendre's formula (count factors of 5)",
        idea: 'Trailing zeros in m! = floor(m/5) + floor(m/25) + … Binary-search the smallest m whose count ≥ n.',
        time: 'O(log²(n))',
        space: 'O(1)',
        code: `function smallestFactorialWithZeros(n) {
  const zeros = (m) => { let c = 0; for (let p = 5; p <= m; p *= 5) c += Math.floor(m / p); return c; };
  let lo = 0, hi = 5 * n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    zeros(mid) < n ? (lo = mid + 1) : (hi = mid);
  }
  return lo;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'DoubleHelix — maximum sum path across two arrays',
    also: ['DoubleHelix SPOJ'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Merge with segment sums, switch at common elements',
        idea: 'Walk both sorted arrays with two pointers, accumulating a running sum for each. At a common value, add the larger of the two running sums to the total and reset both.',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function doubleHelix(a, b) {
  let i = 0, j = 0, sumA = 0, sumB = 0, total = 0;
  while (i < a.length && j < b.length) {
    if (a[i] < b[j]) sumA += a[i++];
    else if (a[i] > b[j]) sumB += b[j++];
    else {
      total += Math.max(sumA, sumB) + a[i];
      sumA = sumB = 0; i++; j++;
    }
  }
  while (i < a.length) sumA += a[i++];
  while (j < b.length) sumB += b[j++];
  return total + Math.max(sumA, sumB);
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Subset sums (all possible sums of subsets)',
    also: ['Subset Sums'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Recurse: include / exclude each element',
        idea: 'At each index branch on taking the element into the running sum or not; record the sum at the leaves.',
        time: 'O(2ⁿ)',
        space: 'O(n) recursion',
        code: `function subsetSums(a) {
  const res = [];
  const bt = (i, sum) => {
    if (i === a.length) { res.push(sum); return; }
    bt(i + 1, sum + a[i]);
    bt(i + 1, sum);
  };
  bt(0, 0);
  return res.sort((x, y) => x - y);
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Implement in-place merge sort',
    also: ['Implement Merge-sort in-place'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Merge sort with the gap (Shell) merge',
        idea: 'Standard recursive split, but merge the two halves in place using the decreasing-gap comparison-and-swap instead of a temp buffer.',
        time: 'O(n log² n)',
        space: 'O(log n) recursion',
        code: `function mergeSortInPlace(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const mid = (lo + hi) >> 1;
  mergeSortInPlace(a, lo, mid);
  mergeSortInPlace(a, mid + 1, hi);
  let gap = Math.ceil((hi - lo + 1) / 2);
  while (gap > 0) {
    for (let i = lo; i + gap <= hi; i++)
      if (a[i] > a[i + gap]) [a[i], a[i + gap]] = [a[i + gap], a[i]];
    gap = gap === 1 ? 0 : Math.ceil(gap / 2);
  }
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Sort an array with many repeated entries (3-way quicksort)',
    also: ['Partitioning and Sorting Arrays with Many Repeated Entries'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '3-way (Dutch flag) quicksort',
        idea: 'Partition into < pivot, === pivot, > pivot. The equal band is skipped entirely, so duplicates cost nothing — O(n) when few distinct keys.',
        time: 'O(n log n), O(n·k) for k distinct keys',
        space: 'O(log n)',
        code: `function quicksort3(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[(lo + hi) >> 1];
  let lt = lo, gt = hi, i = lo;
  while (i <= gt) {
    if (a[i] < pivot) [a[lt++], a[i++]] = [a[i], a[lt]];
    else if (a[i] > pivot) [a[i], a[gt--]] = [a[gt], a[i]];
    else i++;
  }
  quicksort3(a, lo, lt - 1);
  quicksort3(a, gt + 1, hi);
  return a;
}`,
      },
    ],
  },

  // ================================================================ LinkedList (rest)
  {
    topic: 'LinkedList',
    problem: 'Reverse a linked list in groups of size k',
    also: ['Reverse a Linked List in group of Given Size'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Recursive per group',
        idea: 'Reverse the first k nodes; recurse on the rest and attach it to the (now) tail of the reversed group.',
        time: 'O(n)',
        space: 'O(n / k) recursion',
        code: `function reverseKGroup(head, k) {
  let node = head, count = 0;
  while (node && count < k) { node = node.next; count++; }
  if (count < k) return head;              // fewer than k left: keep as is
  let prev = reverseKGroup(node, k), cur = head;
  for (let i = 0; i < k; i++) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Delete the loop in a linked list',
    also: ['Write a program to Delete loop in a linked list', 'Find the starting point of the loop'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Floyd — find the entry, then break it',
        idea: 'After tortoise/hare meet, move one pointer to head; advance both by 1 until they meet again — that node is the loop start. Walk to the node whose next is the start and null it.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function detectAndRemoveLoop(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) break;
  }
  if (!fast || !fast.next) return head;     // no loop
  slow = head;
  if (slow === fast) { while (fast.next !== slow) fast = fast.next; }
  else { while (slow.next !== fast.next) { slow = slow.next; fast = fast.next; } }
  fast.next = null;
  return head;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Remove duplicates from a sorted linked list',
    also: ['Remove Duplicates in a sorted Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Single pass — skip equal neighbours',
        idea: 'If the next node has the same value, unlink it.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function dedupeSorted(head) {
  let cur = head;
  while (cur && cur.next) {
    if (cur.next.val === cur.val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Remove duplicates from an unsorted linked list',
    also: ['Remove Duplicates in a Un-sorted Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Hash set of seen values',
        idea: 'Keep a set; unlink any node whose value was already seen.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function dedupeUnsorted(head) {
  const seen = new Set();
  let prev = null, cur = head;
  while (cur) {
    if (seen.has(cur.val)) prev.next = cur.next;
    else { seen.add(cur.val); prev = cur; }
    cur = cur.next;
  }
  return head;
}`,
        note: 'Without extra space: for each node, run an inner loop deleting later matches — O(n²).',
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Move the last element to the front',
    also: ['Write a Program to Move the last element to Front in a Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Walk to the second-last node',
        idea: 'Detach the last node, point it at the old head, make it the new head.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function moveLastToFront(head) {
  if (!head || !head.next) return head;
  let secondLast = head;
  while (secondLast.next.next) secondLast = secondLast.next;
  const last = secondLast.next;
  secondLast.next = null;
  last.next = head;
  return last;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Add 1 to a number represented as a linked list',
    also: ['Add “1” to a number represented as a Linked List'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Reverse, add carry, reverse back',
        idea: 'Reverse so the least-significant digit is first, add 1 propagating carry, reverse again.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function addOne(head) {
  const rev = (h) => { let p = null; while (h) { const n = h.next; h.next = p; p = h; h = n; } return p; };
  head = rev(head);
  let cur = head, carry = 1;
  while (cur && carry) {
    const sum = cur.val + carry;
    cur.val = sum % 10;
    carry = sum >= 10 ? 1 : 0;
    if (carry && !cur.next) { cur.next = { val: 0, next: null }; }
    cur = cur.next;
  }
  return rev(head);
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Add two numbers represented by linked lists',
    also: ['Add two numbers represented by linked lists'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Digit-by-digit with carry (least-significant first)',
        idea: 'If digits are stored LSB-first, walk both lists adding with carry into a new list. (MSB-first: reverse both, or use two stacks.)',
        time: 'O(n + m)',
        space: 'O(max(n, m))',
        code: `function addTwoNumbers(a, b) {
  const dummy = { val: 0, next: null };
  let tail = dummy, carry = 0;
  while (a || b || carry) {
    const sum = (a?.val || 0) + (b?.val || 0) + carry;
    carry = sum >= 10 ? 1 : 0;
    tail.next = { val: sum % 10, next: null };
    tail = tail.next;
    a = a?.next; b = b?.next;
  }
  return dummy.next;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Intersection of two sorted linked lists (by value)',
    also: ['Intersection of two Sorted Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Merge-style two pointers',
        idea: 'Advance the smaller head; equal values go to the result list.',
        time: 'O(n + m)',
        space: 'O(1) besides output',
        code: `function sortedIntersection(a, b) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) a = a.next;
    else if (a.val > b.val) b = b.next;
    else { tail.next = { val: a.val, next: null }; tail = tail.next; a = a.next; b = b.next; }
  }
  return dummy.next;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Intersection point of two linked lists (shared node)',
    also: ['Intersection Point of two Linked Lists'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers, swap heads at the end',
        idea: 'Advance pA and pB one step at a time; when one hits null, redirect it to the other list’s head. They meet at the intersection after at most n+m steps (or both at null).',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function getIntersectionNode(a, b) {
  let pA = a, pB = b;
  while (pA !== pB) {
    pA = pA ? pA.next : b;
    pB = pB ? pB.next : a;
  }
  return pA; // node or null
}`,
      },
      {
        name: 'Length difference',
        idea: 'Measure both lengths, advance the longer list by the difference, then move both together until they match.',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function getIntersectionNode(a, b) {
  const len = (h) => { let n = 0; while (h) { n++; h = h.next; } return n; };
  let la = len(a), lb = len(b);
  while (la > lb) { a = a.next; la--; }
  while (lb > la) { b = b.next; lb--; }
  while (a !== b) { a = a.next; b = b.next; }
  return a;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Merge sort for linked lists',
    also: ['Merge Sort For Linked lists'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Split by slow/fast, sort halves, merge',
        idea: 'Find the middle with a fast/slow walk, cut, recursively sort each half, then merge the two sorted lists. Merge sort is preferred for lists (no random access needed, O(1) extra).',
        time: 'O(n log n)',
        space: 'O(log n) recursion',
        code: `function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  const mid = slow.next;
  slow.next = null;
  const L = sortList(head), R = sortList(mid);
  const dummy = { next: null };
  let t = dummy, a = L, b = R;
  while (a && b) {
    if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; }
    t = t.next;
  }
  t.next = a || b;
  return dummy.next;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Quicksort for linked lists',
    also: ['Quicksort for Linked Lists'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Partition around the head as pivot',
        idea: 'Build two sublists (< pivot, ≥ pivot) in one pass, recursively sort each, then concatenate. Works but merge sort is usually preferred for lists.',
        time: 'O(n log n) avg, O(n²) worst',
        space: 'O(log n)',
        code: `function quickSortList(head) {
  if (!head || !head.next) return head;
  const pivot = head.val;
  let less = { next: null }, ge = { next: null };
  let lt = less, gt = ge;
  for (let n = head.next; n; n = n.next) {
    if (n.val < pivot) { lt.next = n; lt = n; } else { gt.next = n; gt = n; }
  }
  lt.next = gt.next = null;
  const sortedLess = quickSortList(less.next);
  const sortedGe = quickSortList(ge.next);
  head.next = sortedGe;
  if (!sortedLess) return head;
  let tail = sortedLess;
  while (tail.next) tail = tail.next;
  tail.next = head;
  return sortedLess;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Find the middle element of a linked list',
    also: ['Find the middle Element of a linked list'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Fast/slow pointers',
        idea: 'When fast reaches the end, slow is at the middle (second middle for even length).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Check if a linked list is circular',
    also: ['Check if a linked list is a circular linked list'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Walk until you return to head or hit null',
        idea: 'A circular list’s traversal comes back to head; a normal list ends in null.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isCircular(head) {
  if (!head) return true;
  let n = head.next;
  while (n && n !== head) n = n.next;
  return n === head;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Split a circular linked list into two halves',
    also: ['Split a Circular linked list into two halves'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Fast/slow to find the split, then close both loops',
        idea: 'Advance slow by 1 and fast by 2 around the circle; slow ends at the end of the first half. Point each half’s tail back to its own head.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function splitCircular(head) {
  if (!head || head.next === head) return [head, null];
  let slow = head, fast = head;
  while (fast.next !== head && fast.next.next !== head) { slow = slow.next; fast = fast.next.next; }
  if (fast.next.next === head) fast = fast.next;   // even length
  const head2 = slow.next;
  slow.next = head;        // close first half
  fast.next = head2;       // close second half
  return [head, head2];
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Check whether a singly linked list is a palindrome',
    also: ['Write a Program to check whether the Singly Linked list is a palindrome or not'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Reverse the second half, compare, restore',
        idea: 'Find the middle, reverse the second half, walk both halves in lockstep comparing values (optionally re-reverse to restore).',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isPalindrome(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null;
  while (slow) { const n = slow.next; slow.next = prev; prev = slow; slow = n; }
  let a = head, b = prev, ok = true;
  while (b) { if (a.val !== b.val) { ok = false; break; } a = a.next; b = b.next; }
  return ok;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Reverse a doubly linked list',
    also: ['Reverse a Doubly Linked list'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Swap prev/next for every node',
        idea: 'For each node swap its prev and next pointers; the old tail becomes the new head.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reverseDLL(head) {
  let cur = head, newHead = head;
  while (cur) {
    [cur.prev, cur.next] = [cur.next, cur.prev];
    newHead = cur;
    cur = cur.prev; // the old next
  }
  return newHead;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Find pairs with a given sum in a sorted doubly linked list',
    also: ['Find pairs with a given sum in a DLL'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers from both ends',
        idea: 'Start one pointer at head, one at tail. Move them inward based on whether the pair sum is below or above the target.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function pairsWithSum(head, target) {
  let tail = head;
  while (tail && tail.next) tail = tail.next;
  let lo = head, hi = tail;
  const res = [];
  while (lo && hi && lo !== hi && hi.next !== lo) {
    const s = lo.val + hi.val;
    if (s === target) { res.push([lo.val, hi.val]); lo = lo.next; hi = hi.prev; }
    else if (s < target) lo = lo.next;
    else hi = hi.prev;
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Count triplets in a sorted DLL with a given sum',
    also: ['Count triplets in a sorted DLL whose sum is equal to given value “X”'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Fix one node, two-pointer the rest',
        idea: 'For each node as the smallest of the triplet, run the "pair with sum (X − node.val)" two-pointer scan on the remainder.',
        time: 'O(n²)',
        space: 'O(1)',
        code: `function countTriplets(head, x) {
  let tail = head;
  while (tail && tail.next) tail = tail.next;
  let count = 0;
  for (let cur = head; cur; cur = cur.next) {
    let lo = cur.next, hi = tail;
    while (lo && hi && lo !== hi && hi.next !== lo) {
      const s = cur.val + lo.val + hi.val;
      if (s === x) { count++; lo = lo.next; hi = hi.prev; }
      else if (s < x) lo = lo.next;
      else hi = hi.prev;
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Sort a k-sorted doubly linked list',
    also: ['Sort a “k”sorted Doubly Linked list'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-heap of size k+1',
        idea: 'Each element is at most k positions from its sorted spot, so a sliding min-heap of size k+1 yields elements in order.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function sortKSortedDLL(head, k) {
  const heap = [];                    // simple sorted array as a min-heap
  const push = (v) => { let i = heap.findIndex((x) => x > v); i === -1 ? heap.push(v) : heap.splice(i, 0, v); };
  let node = head;
  for (let i = 0; i <= k && node; i++) { push(node.val); node = node.next; }
  let write = head;
  while (heap.length) {
    write.val = heap.shift();
    write = write.next;
    if (node) { push(node.val); node = node.next; }
  }
  return head;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Rotate a doubly linked list by N nodes',
    also: ['Rotate DoublyLinked list by N nodes', 'Rotate a Doubly Linked list in group of Given Size'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Re-link at the Nth boundary',
        idea: 'Walk to node N; the node after it becomes the new head; splice the first N nodes onto the tail.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function rotateDLL(head, n) {
  if (!head || n === 0) return head;
  let cur = head;
  for (let i = 1; i < n && cur; i++) cur = cur.next;
  if (!cur || !cur.next) return head;
  const newHead = cur.next;
  let tail = newHead;
  while (tail.next) tail = tail.next;
  tail.next = head; head.prev = tail;
  newHead.prev = null;
  cur.next = null;
  return newHead;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Delete nodes that have a greater value on the right side',
    also: ['Delete nodes which have a greater value on right side'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Reverse, keep a running max, reverse back',
        idea: 'After reversing, sweep once keeping the max seen so far; drop any node smaller than that max. Reverse again.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function deleteSmallerOnRight(head) {
  const rev = (h) => { let p = null; while (h) { const n = h.next; h.next = p; p = h; h = n; } return p; };
  head = rev(head);
  let maxSoFar = head, cur = head;
  while (cur && cur.next) {
    if (cur.next.val < maxSoFar.val) cur.next = cur.next.next;
    else { cur = cur.next; maxSoFar = cur; }
  }
  return rev(head);
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Segregate even and odd nodes in a linked list',
    also: ['Segregate even and odd nodes in a Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two chains, then join',
        idea: 'Build an even-value chain and an odd-value chain in one pass; append odd after even.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function segregateEvenOdd(head) {
  const evenD = { next: null }, oddD = { next: null };
  let e = evenD, o = oddD;
  for (let n = head; n; n = n.next) {
    if (n.val % 2 === 0) { e.next = n; e = n; } else { o.next = n; o = n; }
  }
  e.next = oddD.next;
  o.next = null;
  return evenD.next;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Sort a linked list of 0s, 1s and 2s',
    also: ["Sort a LL of 0's, 1's and 2's"],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Count and overwrite',
        idea: 'Count 0s/1s/2s in one pass, then rewrite the node values.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function sort012List(head) {
  const c = [0, 0, 0];
  for (let n = head; n; n = n.next) c[n.val]++;
  let n = head;
  for (let v = 0; v < 3; v++) while (c[v]-- > 0) { n.val = v; n = n.next; }
  return head;
}`,
        note: 'To rewire pointers instead of values: build three sublists (0s, 1s, 2s) and concatenate.',
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Flatten a linked list (each node has a bottom sub-list)',
    also: ['Flatten a Linked List'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Merge sub-lists from right to left',
        idea: 'Recursively flatten the rest, then merge the current node’s sorted bottom-list with it.',
        time: 'O(n·m) merges',
        space: 'O(n) recursion',
        code: `function flatten(head) {
  if (!head || !head.next) return head;
  const merge = (a, b) => {
    const d = { bottom: null }; let t = d;
    while (a && b) {
      if (a.val <= b.val) { t.bottom = a; a = a.bottom; } else { t.bottom = b; b = b.bottom; }
      t = t.bottom;
    }
    t.bottom = a || b;
    return d.bottom;
  };
  head.next = flatten(head.next);
  return merge(head, head.next);
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Clone a linked list with next and random pointers',
    also: ['Clone a linked list with next and random pointer'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Interleave copies, wire randoms, split — O(1) space',
        idea: 'Insert each copy right after its original. Then copy.random = original.random.next. Finally unweave the two lists.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function copyRandomList(head) {
  if (!head) return null;
  for (let n = head; n; n = n.next.next) {
    n.next = { val: n.val, next: n.next, random: null };
  }
  for (let n = head; n; n = n.next.next) {
    if (n.random) n.next.random = n.random.next;
  }
  const copyHead = head.next;
  for (let n = head; n; n = n.next) {
    const c = n.next;
    n.next = c.next;
    c.next = c.next ? c.next.next : null;
  }
  return copyHead;
}`,
        note: 'Simpler O(n) space: a Map from original node → copy node, two passes.',
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Merge K sorted linked lists',
    also: ['Merge K sorted Linked list'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Divide and conquer (pairwise merge)',
        idea: 'Merge lists in pairs, halving the count each round — like merge sort over the array of lists.',
        time: 'O(N log k)',
        space: 'O(log k)',
        code: `function mergeKLists(lists) {
  const merge2 = (a, b) => {
    const d = { next: null }; let t = d;
    while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
    t.next = a || b;
    return d.next;
  };
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2)
      merged.push(merge2(lists[i], lists[i + 1] || null));
    lists = merged;
  }
  return lists[0];
}`,
        note: 'A min-heap of the k current heads also gives O(N log k).',
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Multiply two numbers represented by linked lists',
    also: ['Multiply 2 no. represented by LL'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Build each number, multiply, mod for overflow safety',
        idea: 'Fold each list into an integer (num = num*10 + digit), multiply. Use modulo 1e9+7 if the problem wants that.',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function multiplyLists(a, b) {
  const MOD = 1_000_000_007n;
  const toNum = (h) => { let n = 0n; for (; h; h = h.next) n = (n * 10n + BigInt(h.val)) % MOD; return n; };
  return Number((toNum(a) * toNum(b)) % MOD);
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: "Program for n'th node from the end of a linked list",
    also: ["Program for n’th node from the end of a Linked List"],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Two pointers, n apart',
        idea: 'Advance a lead pointer n nodes, then move lead and trail together until lead falls off the end.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function nthFromEnd(head, n) {
  let lead = head;
  for (let i = 0; i < n; i++) { if (!lead) return null; lead = lead.next; }
  let trail = head;
  while (lead) { lead = lead.next; trail = trail.next; }
  return trail;
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'First non-repeating character in a stream',
    also: ['Find the first non-repeating character from a stream of characters', 'Queue based approach or first non-repeating character in a stream'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Queue of candidates + frequency count',
        idea: 'Push each new char to a queue and bump its count. Before answering, pop from the front while its count > 1. The front (if any) is the current first non-repeating char.',
        time: 'O(1) amortised per char',
        space: 'O(k)',
        code: `function firstNonRepeatingStream(chars) {
  const count = new Map(), queue = [];
  const out = [];
  for (const c of chars) {
    count.set(c, (count.get(c) || 0) + 1);
    queue.push(c);
    while (queue.length && count.get(queue[0]) > 1) queue.shift();
    out.push(queue.length ? queue[0] : '#');
  }
  return out.join('');
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Can we reverse a linked list in less than O(n)? / Why quicksort for arrays, merge sort for lists?',
    also: ['Can we reverse a linked list in less than O(n) ?', 'Why Quicksort is preferred for. Arrays and Merge Sort for LinkedLists ?'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Conceptual answers',
        idea: 'No — reversing requires visiting every node to flip its pointer, so it is Θ(n). For sorting: arrays give O(1) random access and cache locality, which quicksort exploits and merge sort wastes (its O(n) auxiliary array + copying hurt). Linked lists have no random access, so quicksort’s partition is awkward and pivots are hard to pick; merge sort splits and merges with only pointer rewiring and O(1) extra space, and is stable — hence the default for lists.',
        time: '—',
        space: '—',
        code: `// Reversal is O(n): every node's next pointer must change.
// Merge sort on a list needs no random access and O(1) extra space;
// quicksort on a list can't pick a good pivot cheaply and loses locality.`,
      },
    ],
  },

  // ================================================================ Stacks & Queues (rest)
  {
    topic: 'Stacks & Queues',
    problem: 'Implement a stack from scratch',
    also: ['Implement Stack from Scratch'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Backed by an array',
        idea: 'push/pop/peek at the array end are O(1); track size explicitly if you avoid `length`.',
        time: 'O(1) per op',
        space: 'O(n)',
        code: `class Stack {
  #a = [];
  push(x) { this.#a.push(x); }
  pop() { return this.#a.pop(); }
  peek() { return this.#a[this.#a.length - 1]; }
  isEmpty() { return this.#a.length === 0; }
  size() { return this.#a.length; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Implement a queue from scratch',
    also: ['Implement Queue from Scratch'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Circular buffer',
        idea: 'Fixed array with head/tail indices modulo capacity; O(1) enqueue/dequeue with no shifting.',
        time: 'O(1) per op',
        space: 'O(capacity)',
        code: `class Queue {
  constructor(cap = 1024) { this.a = new Array(cap); this.head = 0; this.tail = 0; this.count = 0; this.cap = cap; }
  enqueue(x) { if (this.count === this.cap) throw new Error('full'); this.a[this.tail] = x; this.tail = (this.tail + 1) % this.cap; this.count++; }
  dequeue() { if (!this.count) return undefined; const x = this.a[this.head]; this.head = (this.head + 1) % this.cap; this.count--; return x; }
  front() { return this.count ? this.a[this.head] : undefined; }
  isEmpty() { return this.count === 0; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Implement two stacks in one array',
    also: ['Implement 2 stack in an array', 'Implement "N" stacks in an Array', 'Implement "n" queue in an array'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Grow from both ends',
        idea: 'Stack 1 grows from index 0 upward, stack 2 grows from the last index downward; they collide only when the array is full.',
        time: 'O(1) per op',
        space: 'O(n)',
        code: `class TwoStacks {
  constructor(n) { this.a = new Array(n); this.top1 = -1; this.top2 = n; }
  push1(x) { if (this.top1 + 1 === this.top2) throw new Error('full'); this.a[++this.top1] = x; }
  push2(x) { if (this.top2 - 1 === this.top1) throw new Error('full'); this.a[--this.top2] = x; }
  pop1() { return this.top1 >= 0 ? this.a[this.top1--] : undefined; }
  pop2() { return this.top2 < this.a.length ? this.a[this.top2++] : undefined; }
}`,
        note: 'For N stacks in one array: keep a `next[]` free-list and a `top[]` per stack; each cell stores the index of the previous element of its stack.',
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Find the middle element of a stack in O(1)',
    also: ['find the middle element of a stack'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Doubly linked list + middle pointer',
        idea: 'Back the stack with a DLL. Keep a pointer to the middle node and a count; on push/pop, move the middle pointer at most one step.',
        time: 'O(1) push / pop / findMiddle',
        space: 'O(n)',
        code: `class MiddleStack {
  constructor() { this.head = null; this.mid = null; this.count = 0; }
  push(x) {
    const node = { val: x, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    this.head = node;
    this.count++;
    if (this.count === 1) this.mid = node;
    else if (this.count % 2 === 1) this.mid = this.mid.prev;
  }
  pop() {
    if (!this.count) return undefined;
    const x = this.head.val;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    this.count--;
    if (this.count % 2 === 0) this.mid = this.mid ? this.mid.next : null;
    return x;
  }
  findMiddle() { return this.mid ? this.mid.val : undefined; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'The celebrity problem',
    also: ['The celebrity Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Elimination with a stack / two pointers',
        idea: 'Push everyone; repeatedly pop two — if a knows b, a is not the celebrity (keep b), else keep a. One candidate remains; verify they know nobody and everybody knows them.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function findCelebrity(n, knows) {
  let cand = 0;
  for (let i = 1; i < n; i++) if (knows(cand, i)) cand = i;
  for (let i = 0; i < n; i++) {
    if (i === cand) continue;
    if (knows(cand, i) || !knows(i, cand)) return -1;
  }
  return cand;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Evaluate a postfix expression',
    also: ['Evaluation of Postfix expression'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Operand stack',
        idea: 'Push numbers; on an operator, pop two, apply, push the result.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function evalPostfix(tokens) {
  const st = [];
  const ops = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b, '/': (a, b) => Math.trunc(a / b) };
  for (const t of tokens) {
    if (t in ops) { const b = st.pop(), a = st.pop(); st.push(ops[t](a, b)); }
    else st.push(Number(t));
  }
  return st.pop();
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Evaluate an infix arithmetic expression',
    also: ['Arithmetic Expression evaluation'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two stacks (values + operators) with precedence',
        idea: 'Scan tokens; push numbers; on an operator, first resolve any stacked operator of higher/equal precedence; handle parentheses by resolving until "(".',
        time: 'O(n)',
        space: 'O(n)',
        code: `function evalInfix(expr) {
  const nums = [], ops = [];
  const prec = (o) => (o === '+' || o === '-' ? 1 : o === '*' || o === '/' ? 2 : 0);
  const apply = () => {
    const b = nums.pop(), a = nums.pop(), o = ops.pop();
    nums.push(o === '+' ? a + b : o === '-' ? a - b : o === '*' ? a * b : Math.trunc(a / b));
  };
  const tokens = expr.match(/\\d+|[()+\\-*/]/g) || [];
  for (const t of tokens) {
    if (/\\d/.test(t)) nums.push(Number(t));
    else if (t === '(') ops.push(t);
    else if (t === ')') { while (ops[ops.length - 1] !== '(') apply(); ops.pop(); }
    else { while (ops.length && prec(ops[ops.length - 1]) >= prec(t)) apply(); ops.push(t); }
  }
  while (ops.length) apply();
  return nums[0];
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Insert an element at the bottom of a stack using recursion',
    also: ['Implement a method to insert an element at its bottom without using any other data structure'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Recursively pop to the bottom, place, unwind',
        idea: 'If the stack is empty, push x. Otherwise pop the top, recurse, then push the top back.',
        time: 'O(n)',
        space: 'O(n) call stack',
        code: `function insertAtBottom(stack, x) {
  if (stack.length === 0) { stack.push(x); return; }
  const top = stack.pop();
  insertAtBottom(stack, x);
  stack.push(top);
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Reverse a stack using recursion',
    also: ['Reverse a stack using recursion'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Pop all, then insert each at the bottom',
        idea: 'Recursively empty the stack; as the recursion unwinds, insert each popped value at the bottom.',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function reverseStack(stack) {
  if (stack.length === 0) return;
  const top = stack.pop();
  reverseStack(stack);
  insertAtBottom(stack, top);
}
function insertAtBottom(stack, x) {
  if (!stack.length) { stack.push(x); return; }
  const t = stack.pop();
  insertAtBottom(stack, x);
  stack.push(t);
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Sort a stack using recursion',
    also: ['Sort a Stack using recursion'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Recursively sort, then insert in order',
        idea: 'Pop the top, sort the rest, then insert the top back into its sorted position (another recursive helper).',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function sortStack(s) {
  if (s.length === 0) return;
  const top = s.pop();
  sortStack(s);
  sortedInsert(s, top);
}
function sortedInsert(s, x) {
  if (!s.length || s[s.length - 1] <= x) { s.push(x); return; }
  const t = s.pop();
  sortedInsert(s, x);
  s.push(t);
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Largest rectangular area in a histogram',
    also: ['Largest rectangular Area in Histogram'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Monotonic increasing stack of indices',
        idea: 'When a shorter bar appears, pop taller bars; each popped bar’s max rectangle uses it as the height, bounded by the new bar and the stack’s new top.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function largestRectangleArea(h) {
  const st = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    while (st.length && h[st[st.length - 1]] >= cur) {
      const height = h[st.pop()];
      const width = st.length ? i - st[st.length - 1] - 1 : i;
      best = Math.max(best, height * width);
    }
    st.push(i);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Length of the longest valid parentheses substring',
    also: ['Length of the Longest Valid Substring'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Stack of indices with a base marker',
        idea: 'Push −1 as a base. On "(", push its index. On ")", pop; if the stack is now empty push this index as the new base, else the current valid length is i − stack top.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function longestValidParentheses(s) {
  const st = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') st.push(i);
    else {
      st.pop();
      if (st.length === 0) st.push(i);
      else best = Math.max(best, i - st[st.length - 1]);
    }
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Check if an expression has redundant brackets',
    also: ['Expression contains redundant bracket or not'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Stack — a ")" with no operator since its "(" is redundant',
        idea: 'Push everything except ")". On ")", pop until "("; if you saw no operator in between, the brackets were redundant.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hasRedundantBrackets(expr) {
  const st = [];
  for (const c of expr) {
    if (c === ')') {
      let hasOp = false;
      while (st.length && st[st.length - 1] !== '(') {
        if ('+-*/'.includes(st.pop())) hasOp = true;
      }
      st.pop(); // '('
      if (!hasOp) return true;
    } else st.push(c);
  }
  return false;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Implement a stack using queues',
    also: ['Implement Stack using Queue', 'Implement Stack using Deque'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Single queue, rotate on push',
        idea: 'After enqueueing x, rotate the queue so x is at the front (dequeue and re-enqueue the previous elements). push O(n), pop/top O(1).',
        time: 'push O(n), pop O(1)',
        space: 'O(n)',
        code: `class StackViaQueue {
  #q = [];
  push(x) { this.#q.push(x); for (let i = 0; i < this.#q.length - 1; i++) this.#q.push(this.#q.shift()); }
  pop() { return this.#q.shift(); }
  top() { return this.#q[0]; }
  empty() { return this.#q.length === 0; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Check if an array is a valid stack permutation of another',
    also: ['Stack Permutations (Check if an array is stack permutation of other)'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Simulate with an auxiliary stack',
        idea: 'Push input elements one by one; whenever the stack top equals the next expected output element, pop. If the stack empties out matching the whole output, it is a valid permutation.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function isStackPermutation(input, output) {
  const st = [];
  let j = 0;
  for (const x of input) {
    st.push(x);
    while (st.length && st[st.length - 1] === output[j]) { st.pop(); j++; }
  }
  return st.length === 0 && j === output.length;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Implement a circular queue',
    also: ['Implement a Circular queue'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Fixed array with modular head/tail',
        idea: 'Wrap indices with `% capacity`; track a count to distinguish full from empty.',
        time: 'O(1) per op',
        space: 'O(capacity)',
        code: `class CircularQueue {
  constructor(k) { this.a = new Array(k); this.k = k; this.head = 0; this.count = 0; }
  enqueue(x) { if (this.count === this.k) return false; this.a[(this.head + this.count) % this.k] = x; this.count++; return true; }
  dequeue() { if (!this.count) return false; this.head = (this.head + 1) % this.k; this.count--; return true; }
  front() { return this.count ? this.a[this.head] : -1; }
  rear() { return this.count ? this.a[(this.head + this.count - 1) % this.k] : -1; }
  isFull() { return this.count === this.k; }
  isEmpty() { return this.count === 0; }
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'LRU Cache',
    also: ['LRU Cache Implementationa', 'Program for Least Recently Used (LRU) Page Replacement algorithm'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Hash map + JS Map insertion order',
        idea: 'A Map keeps insertion order. On get, delete and re-set the key to mark it most-recent. On put past capacity, delete the first key (least-recent).',
        time: 'O(1) per op',
        space: 'O(capacity)',
        code: `class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size === this.cap) this.map.delete(this.map.keys().next().value);
    this.map.set(key, value);
  }
}`,
        note: 'The "proper" version uses a hash map to nodes of a doubly linked list; same O(1), no reliance on Map ordering.',
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Reverse the first K elements of a queue',
    also: ['Reverse the first “K” elements of a queue'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Stack for the first K, then rotate the rest',
        idea: 'Dequeue K into a stack, enqueue them back (reversed), then move the remaining n−K elements from front to back.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function reverseFirstK(queue, k) {
  const st = [];
  for (let i = 0; i < k; i++) st.push(queue.shift());
  while (st.length) queue.push(st.pop());
  for (let i = 0; i < queue.length - k; i++) queue.push(queue.shift());
  return queue;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Interleave the first half of a queue with the second half',
    also: ['Interleave the first half of the queue with second half'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Move first half to a stack, re-queue, then interleave',
        idea: 'Push the first n/2 to a stack, enqueue back (now the front half is reversed and rotated), rotate n/2, then alternately pull from stack-equivalent and queue.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function interleaveQueue(q) {
  const half = q.length / 2;
  const st = [];
  for (let i = 0; i < half; i++) st.push(q.shift());
  while (st.length) q.push(st.pop());
  for (let i = 0; i < half; i++) q.push(q.shift());
  for (let i = 0; i < half; i++) { st.push(q.shift()); }
  const res = [];
  for (let i = 0; i < half; i++) { res.push(st.shift()); res.push(q.shift()); }
  q.push(...res);
  return q;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'First circular tour that visits all petrol pumps',
    also: ['Find the first circular tour that visits all Petrol Pumps'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Single pass — reset start on deficit',
        idea: 'Track a running tank. If it ever goes negative, no start up to here works; set start to the next pump and reset the tank. Feasible overall iff total petrol ≥ total distance.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function firstTour(pumps) { // pumps[i] = [petrol, distance]
  let start = 0, tank = 0, total = 0;
  for (let i = 0; i < pumps.length; i++) {
    const diff = pumps[i][0] - pumps[i][1];
    tank += diff;
    total += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start : -1;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Rotten oranges (minimum time to rot all)',
    also: ['Minimum time required to rot all oranges'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Multi-source BFS',
        idea: 'Seed the queue with every rotten orange at time 0; BFS outward, rotting fresh neighbours. The answer is the last time stamp; return −1 if any fresh orange remains.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  let fresh = 0;
  const q = [];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) q.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  let time = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (q.length) {
    const [r, c, t] = q.shift();
    time = Math.max(time, t);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 1) {
        grid[nr][nc] = 2; fresh--; q.push([nr, nc, t + 1]);
      }
    }
  }
  return fresh === 0 ? time : -1;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Distance of the nearest 1 in a binary matrix',
    also: ['Distance of nearest cell having 1 in a binary matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Multi-source BFS from all 1s',
        idea: 'Push every cell containing 1 with distance 0; BFS outward filling each 0 with its shortest distance.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function nearestOne(grid) {
  const R = grid.length, C = grid[0].length;
  const dist = Array.from({ length: R }, () => Array(C).fill(-1));
  const q = [];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === 1) { dist[r][c] = 0; q.push([r, c]); }
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  let head = 0;
  while (head < q.length) {
    const [r, c] = q[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push([nr, nc]);
      }
    }
  }
  return dist;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'First negative integer in every window of size k',
    also: ['First negative integer in every window of size “k”'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Deque of indices of negatives',
        idea: 'Maintain a queue of indices of negative numbers in the current window; the front is the answer, and it is popped when it slides out.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function firstNegativeEachWindow(a, k) {
  const dq = [], res = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] < 0) dq.push(i);
    if (i >= k - 1) {
      while (dq.length && dq[0] <= i - k) dq.shift();
      res.push(dq.length ? a[dq[0]] : 0);
    }
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Sum of minimum and maximum of all subarrays of size k',
    also: ['Sum of minimum and maximum elements of all subarrays of size “k”'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Two monotonic deques (max and min)',
        idea: 'A decreasing deque gives the window max at its front; an increasing deque gives the window min. Slide and add both.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function sumOfMinMax(a, k) {
  const maxDq = [], minDq = [];
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    while (maxDq.length && a[maxDq[maxDq.length - 1]] <= a[i]) maxDq.pop();
    while (minDq.length && a[minDq[minDq.length - 1]] >= a[i]) minDq.pop();
    maxDq.push(i); minDq.push(i);
    if (maxDq[0] <= i - k) maxDq.shift();
    if (minDq[0] <= i - k) minDq.shift();
    if (i >= k - 1) sum += a[maxDq[0]] + a[minDq[0]];
  }
  return sum;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Minimum sum of squares of character counts after removing k characters',
    also: ['Minimum sum of squares of character counts in a given string after removing “k” characters'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Greedy — always decrement the current max frequency',
        idea: 'Removing a character helps most when taken from the most frequent one (n² − (n−1)² = 2n−1 is largest for large n). Use a max-heap of frequencies, k times.',
        time: 'O(k log 26 + n)',
        space: 'O(1)',
        code: `function minStringValue(s, k) {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  for (let i = 0; i < k; i++) {
    let mx = 0;
    for (let j = 1; j < 26; j++) if (freq[j] > freq[mx]) mx = j;
    if (freq[mx] === 0) break;
    freq[mx]--;
  }
  return freq.reduce((acc, f) => acc + f * f, 0);
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Next Smaller Element',
    also: ['Next Smaller Element'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic increasing stack',
        idea: 'Scan; pop while the stack top is greater than the current value — the current value is those elements’ next smaller.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function nextSmaller(a) {
  const res = Array(a.length).fill(-1);
  const st = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st[st.length - 1]] > a[i]) res[st.pop()] = a[i];
    st.push(i);
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Stacks & Queues',
    problem: 'Reverse a string / queue using a stack; check balanced parentheses',
    also: ['Reverse a String using Stack', 'Reverse a Queue using recursion', 'Check the expression has valid or Balanced parenthesis or not'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Stack fundamentals',
        idea: 'Push all characters/elements and pop them to reverse. For balanced parentheses, push openers and match each closer against the stack top. To reverse a queue recursively: dequeue the front, recurse, then enqueue the saved front at the back.',
        time: 'O(n)',
        space: 'O(n)',
        code: `const reverseWithStack = (s) => { const st = [...s]; let r = ''; while (st.length) r += st.pop(); return r; };

function isBalanced(s) {
  const pair = { ')': '(', ']': '[', '}': '{' }, st = [];
  for (const c of s) {
    if ('([{'.includes(c)) st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}

function reverseQueue(q) {
  if (q.length === 0) return;
  const front = q.shift();
  reverseQueue(q);
  q.push(front);
}`,
      },
    ],
  },

  // ================================================================ Binary Trees (rest)
  {
    topic: 'Binary Trees',
    problem: 'All tree traversals — inorder, preorder, postorder (recursive & iterative), level order, zig-zag',
    also: [
      'Inorder Traversal of a tree both using recursion and Iteration',
      'Preorder Traversal of a tree both using recursion and Iteration',
      'Postorder Traversal of a tree both using recursion and Iteration',
      'Reverse Level Order traversal',
      'Zig-Zag traversal of a binary tree',
    ],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Recursive DFS (the three orders)',
        idea: 'Visit the node before / between / after its children for pre / in / post order.',
        time: 'O(n)',
        space: 'O(h)',
        code: `const inorder = (n, out = []) => { if (n) { inorder(n.left, out); out.push(n.val); inorder(n.right, out); } return out; };
const preorder = (n, out = []) => { if (n) { out.push(n.val); preorder(n.left, out); preorder(n.right, out); } return out; };
const postorder = (n, out = []) => { if (n) { postorder(n.left, out); postorder(n.right, out); out.push(n.val); } return out; };`,
      },
      {
        name: 'Iterative with an explicit stack',
        idea: 'Preorder: push right then left. Inorder: push all lefts, pop-visit-go-right. Postorder: do a reversed "root-right-left" preorder.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function inorderIter(root) {
  const out = [], st = [];
  let cur = root;
  while (cur || st.length) {
    while (cur) { st.push(cur); cur = cur.left; }
    cur = st.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}
function postorderIter(root) {
  const out = [], st = root ? [root] : [];
  while (st.length) {
    const n = st.pop();
    out.push(n.val);
    if (n.left) st.push(n.left);
    if (n.right) st.push(n.right);
  }
  return out.reverse();
}`,
      },
      {
        name: 'Level order, reverse level order, zig-zag (BFS)',
        idea: 'BFS one level at a time. Reverse level order: reverse the collected levels (or unshift). Zig-zag: reverse alternate levels.',
        time: 'O(n)',
        space: 'O(width)',
        code: `function zigzag(root) {
  if (!root) return [];
  const res = [], q = [root];
  let leftToRight = true;
  while (q.length) {
    const level = [];
    for (let k = q.length; k > 0; k--) {
      const n = q.shift();
      level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    res.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
  }
  return res;
}
// reverse level order = build levels normally, then res.reverse()`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Height, balance check, and mirror of a tree',
    also: [
      'Height of a tree',
      'Check if a tree is balanced or not',
      'Mirror of a tree',
      'Check if 2 trees are mirror or not',
      'Tree Isomorphism Problem',
    ],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'One DFS returning height (−1 signals imbalance)',
        idea: 'Height = 1 + max(childHeights). Balanced iff every node’s subtree heights differ by ≤ 1 — propagate −1 upward on the first violation.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function height(n) { return n ? 1 + Math.max(height(n.left), height(n.right)) : 0; }

function isBalanced(root) {
  const check = (n) => {
    if (!n) return 0;
    const l = check(n.left); if (l === -1) return -1;
    const r = check(n.right); if (r === -1) return -1;
    return Math.abs(l - r) > 1 ? -1 : 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}`,
      },
      {
        name: 'Mirror (invert) and "are two trees mirrors?"',
        idea: 'Invert: swap children recursively. Two trees are mirrors iff a.left ≡ mirror of b.right and a.right ≡ mirror of b.left.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function mirror(n) {
  if (!n) return null;
  [n.left, n.right] = [mirror(n.right), mirror(n.left)];
  return n;
}
function areMirror(a, b) {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return areMirror(a.left, b.right) && areMirror(a.right, b.left);
}
// Isomorphic: like areMirror but allow EITHER (same children) OR (swapped children).`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Tree views — left, right, top, bottom, diagonal, boundary',
    also: [
      'Left View of a tree',
      'Right View of Tree',
      'Top View of a tree',
      'Bottom View of a tree',
      'Diagnol Traversal of a Binary tree',
      'Boundary traversal of a Binary tree',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Left / Right view — first node seen per BFS level',
        idea: 'Level-order BFS; the first node dequeued at each level is the left view, the last is the right view.',
        time: 'O(n)',
        space: 'O(width)',
        code: `function rightView(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length) {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const node = q.shift();
      if (i === n - 1) res.push(node.val);        // last of the level = right view
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return res;
}`,
      },
      {
        name: 'Top / Bottom view — by horizontal distance',
        idea: 'BFS carrying a horizontal distance (hd): left child hd−1, right child hd+1. Top view keeps the first node per hd; bottom view keeps the last. Sort by hd.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function bottomView(root) {
  if (!root) return [];
  const map = new Map();
  const q = [[root, 0]];
  while (q.length) {
    const [node, hd] = q.shift();
    map.set(hd, node.val);                        // last write wins ⇒ bottom
    if (node.left) q.push([node.left, hd - 1]);
    if (node.right) q.push([node.right, hd + 1]);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
}
// Top view: same, but only set map if the hd is not already present.`,
      },
      {
        name: 'Diagonal & boundary traversals',
        idea: 'Diagonal: right edges stay on the same diagonal, left edges start the next — use a queue of "diagonal starts". Boundary: left boundary (top-down, no leaves) + all leaves (left-to-right) + right boundary (bottom-up, no leaves).',
        time: 'O(n)',
        space: 'O(n)',
        code: `function diagonal(root) {
  const res = [];
  let queue = root ? [root] : [];
  while (queue.length) {
    const next = [];
    for (let node of queue) {
      while (node) {
        res.push(node.val);
        if (node.left) next.push(node.left);
        node = node.right;
      }
    }
    queue = next;
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Construct a binary tree from inorder + preorder',
    also: ['Construct Binary tree from Inorder and preorder traversal'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Recursion with an index map for inorder',
        idea: 'The next preorder value is the current root; its position in inorder splits the array into left and right subtrees.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function buildTree(preorder, inorder) {
  const pos = new Map(inorder.map((v, i) => [v, i]));
  let p = 0;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const rootVal = preorder[p++];
    const node = { val: rootVal, left: null, right: null };
    const mid = pos.get(rootVal);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorder.length - 1);
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Construct a binary tree from its bracket string representation',
    also: ['Construct Binary Tree from String with Bracket Representation'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Recursive descent parser',
        idea: 'A number is a node; an opening "(" begins its left child, a second "(" its right child; ")" closes.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function str2tree(s) {
  let i = 0;
  const parse = () => {
    let sign = 1;
    if (s[i] === '-') { sign = -1; i++; }
    let num = 0;
    while (i < s.length && /\\d/.test(s[i])) num = num * 10 + +s[i++];
    const node = { val: sign * num, left: null, right: null };
    if (s[i] === '(') { i++; node.left = parse(); i++; }   // skip '(' and ')'
    if (s[i] === '(') { i++; node.right = parse(); i++; }
    return node;
  };
  return s ? parse() : null;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Convert a binary tree to a doubly linked list (in-order)',
    also: ['Convert Binary tree into Doubly Linked List'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In-order traversal, stitch prev ↔ current',
        idea: 'Do an in-order walk keeping a `prev` pointer; set prev.right = cur and cur.left = prev. The first visited node is the DLL head.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function treeToDLL(root) {
  let head = null, prev = null;
  const inorder = (n) => {
    if (!n) return;
    inorder(n.left);
    if (prev) { prev.right = n; n.left = prev; }
    else head = n;
    prev = n;
    inorder(n.right);
  };
  inorder(root);
  return head;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Convert a binary tree to a sum tree / check if it is a sum tree',
    also: ['Convert Binary tree into Sum tree', 'Check if Binary tree is Sum tree or not'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Post-order: replace with children sum / verify equality',
        idea: 'Convert: return oldValue + newLeft + newRight, set node.val to newLeft + newRight. Check: a node is valid iff its value equals the sum of both subtrees (leaves count as valid).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function toSumTree(node) {
  if (!node) return 0;
  const old = node.val;
  node.val = toSumTree(node.left) + toSumTree(node.right);
  return node.val + old;
}
function isSumTree(node) {
  if (!node || (!node.left && !node.right)) return true;
  const treeSum = (n) => (n ? n.val + treeSum(n.left) + treeSum(n.right) : 0);
  return node.val === treeSum(node.left) + treeSum(node.right) &&
    isSumTree(node.left) && isSumTree(node.right);
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'LCA, distance between two nodes, and Kth ancestor in a binary tree',
    also: [
      'Find LCA in a Binary tree',
      'Find distance between 2 nodes in a Binary tree',
      'Kth Ancestor of node in a Binary tree',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'LCA via post-order; distance from depths; ancestor by path',
        idea: 'LCA: the node where the two targets first split. Distance(a,b) = depth(a) + depth(b) − 2·depth(LCA). Kth ancestor: record the root→node path, then step back k.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function lca(root, p, q) {
  if (!root || root.val === p || root.val === q) return root;
  const L = lca(root.left, p, q);
  const R = lca(root.right, p, q);
  return L && R ? root : L || R;
}
function distance(root, a, b) {
  const depth = (n, target, d = 0) => {
    if (!n) return -1;
    if (n.val === target) return d;
    const l = depth(n.left, target, d + 1);
    return l !== -1 ? l : depth(n.right, target, d + 1);
  };
  const anc = lca(root, a, b);
  return depth(anc, a, 0) + depth(anc, b, 0);
}
function kthAncestor(root, node, k) {
  const path = [];
  const find = (n) => {
    if (!n) return false;
    path.push(n);
    if (n.val === node || find(n.left) || find(n.right)) return true;
    path.pop();
    return false;
  };
  find(root);
  return path.length > k ? path[path.length - 1 - k].val : -1;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Path sums — longest root-to-leaf sum, largest subtree sum, max non-adjacent sum, K-sum paths',
    also: [
      'Sum of Nodes on the Longest path from root to leaf node',
      'Find Largest subtree sum in a tree',
      'Maximum Sum of nodes in Binary tree such that no two are adjacent',
      'Print all "K" Sum paths in a Binary tree',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Longest root-to-leaf path sum',
        idea: 'DFS returning (length, sum) of the best path; prefer the longer, break ties by larger sum.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function longestPathSum(root) {
  const dfs = (n) => {
    if (!n) return [0, 0];
    const [ll, ls] = dfs(n.left);
    const [rl, rs] = dfs(n.right);
    if (ll > rl || (ll === rl && ls >= rs)) return [ll + 1, ls + n.val];
    return [rl + 1, rs + n.val];
  };
  return dfs(root)[1];
}`,
      },
      {
        name: 'Largest subtree sum',
        idea: 'Post-order; each node returns its subtree sum, and a running global max is updated.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function largestSubtreeSum(root) {
  let best = -Infinity;
  const sum = (n) => {
    if (!n) return 0;
    const s = n.val + sum(n.left) + sum(n.right);
    best = Math.max(best, s);
    return s;
  };
  sum(root);
  return best;
}`,
      },
      {
        name: 'Max sum with no two adjacent (tree house robber)',
        idea: 'DFS returns [withNode, withoutNode]. withNode = n.val + left.without + right.without; without = max(left) + max(right).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function maxNonAdjacent(root) {
  const dfs = (n) => {
    if (!n) return [0, 0];
    const [lw, lwo] = dfs(n.left);
    const [rw, rwo] = dfs(n.right);
    return [n.val + lwo + rwo, Math.max(lw, lwo) + Math.max(rw, rwo)];
  };
  return Math.max(...dfs(root));
}`,
      },
      {
        name: 'Print all downward paths summing to K',
        idea: 'Carry the path from root; at each node, walk the path backward adding values and print any suffix that sums to K.',
        time: 'O(n·h)',
        space: 'O(h)',
        code: `function kSumPaths(root, k) {
  const path = [], res = [];
  const dfs = (n) => {
    if (!n) return;
    path.push(n.val);
    let sum = 0;
    for (let i = path.length - 1; i >= 0; i--) {
      sum += path[i];
      if (sum === k) res.push(path.slice(i));
    }
    dfs(n.left); dfs(n.right);
    path.pop();
  };
  dfs(root);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Checks — leaves at same level, duplicate subtrees, is-a-tree (graph), min swaps to BST',
    also: [
      'Check if all leaf nodes are at same level or not',
      'Check if a Binary Tree contains duplicate subtrees of size 2 or more',
      'Find all Duplicate subtrees in a Binary tree',
      'Check if given graph is tree or not',
      'Find minimum swaps required to convert a Binary tree into BST',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'All leaves at the same level',
        idea: 'DFS tracking depth; record the first leaf’s depth and require every other leaf to match.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function leavesSameLevel(root) {
  let leafDepth = -1;
  const dfs = (n, d) => {
    if (!n) return true;
    if (!n.left && !n.right) {
      if (leafDepth === -1) leafDepth = d;
      return d === leafDepth;
    }
    return dfs(n.left, d + 1) && dfs(n.right, d + 1);
  };
  return dfs(root, 0);
}`,
      },
      {
        name: 'Duplicate subtrees — serialize and count',
        idea: 'Post-order serialize each subtree to a string; the first time a serialization repeats, that subtree is a duplicate.',
        time: 'O(n²) worst (string sizes), O(n) with ids',
        space: 'O(n)',
        code: `function findDuplicateSubtrees(root) {
  const seen = new Map(), res = [];
  const ser = (n) => {
    if (!n) return '#';
    const s = n.val + ',' + ser(n.left) + ',' + ser(n.right);
    seen.set(s, (seen.get(s) || 0) + 1);
    if (seen.get(s) === 2) res.push(n);
    return s;
  };
  ser(root);
  return res;
}`,
      },
      {
        name: 'Is an undirected graph a tree?',
        idea: 'A graph with n nodes is a tree iff it has exactly n−1 edges and is connected (one DFS/BFS component, no back-edge to a non-parent).',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function isGraphTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Array(n).fill(false);
  const stack = [0];
  seen[0] = true;
  let count = 1;
  while (stack.length) {
    const u = stack.pop();
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; count++; stack.push(v); }
  }
  return count === n;
}`,
        note: 'Min swaps to convert a binary tree to a BST: take the tree’s inorder array, then count minimum swaps to sort it (cycle decomposition — see "Minimum swaps to sort an array").',
      },
    ],
  },

  // ================================================================ Binary Search Trees (rest)
  {
    topic: 'Binary Search Trees',
    problem: 'BST basics — search, insert, min/max',
    also: ['Fina a value in a BST', 'Find min and max value in a BST'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Follow the ordering invariant',
        idea: 'Go left if the target is smaller, right if larger. Min is the leftmost node, max the rightmost.',
        time: 'O(h)',
        space: 'O(1)',
        code: `function search(root, key) {
  let n = root;
  while (n && n.val !== key) n = key < n.val ? n.left : n.right;
  return n;
}
function insert(root, key) {
  if (!root) return { val: key, left: null, right: null };
  if (key < root.val) root.left = insert(root.left, key);
  else if (key > root.val) root.right = insert(root.right, key);
  return root;
}
const findMin = (n) => { while (n.left) n = n.left; return n.val; };
const findMax = (n) => { while (n.right) n = n.right; return n.val; };`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Delete a node from a BST',
    also: ['Deletion of a node in a BST'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Three cases: leaf, one child, two children',
        idea: 'Leaf → remove. One child → splice it in. Two children → replace the value with the in-order successor (leftmost of the right subtree), then delete that successor.',
        time: 'O(h)',
        space: 'O(h)',
        code: `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let succ = root.right;
    while (succ.left) succ = succ.left;
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Inorder successor and predecessor in a BST',
    also: ['Find inorder successor and inorder predecessor in a BST', 'Populate Inorder successor of all nodes'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Descend, remembering the last turn',
        idea: 'Successor: go right and take the leftmost; if no right child, it is the last ancestor you turned left from. Predecessor is the mirror.',
        time: 'O(h)',
        space: 'O(1)',
        code: `function inorderSuccessor(root, key) {
  let succ = null, n = root;
  while (n) {
    if (key < n.val) { succ = n; n = n.left; }
    else n = n.right;
  }
  return succ;
}
// Populate .next for every node: reverse in-order traversal, keeping a running "next".`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Construct a BST from preorder / validate a preorder sequence',
    also: ['Construct BST from preorder traversal', 'Check preorder is valid or not'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Bounds recursion',
        idea: 'Consume preorder values while they fit the current (low, high) bound; the first value becomes the root, then recurse left with an updated upper bound and right with a lower bound.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function bstFromPreorder(preorder) {
  let i = 0;
  const build = (bound) => {
    if (i === preorder.length || preorder[i] > bound) return null;
    const node = { val: preorder[i++], left: null, right: null };
    node.left = build(node.val);
    node.right = build(bound);
    return node;
  };
  return build(Infinity);
}`,
        note: 'Validate a preorder: use a stack; pop while the current value exceeds the stack top (that becomes the new lower bound). If any value is below the current lower bound, it is invalid.',
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Convert a binary tree to a BST / balance a BST / flatten a BST to a sorted list',
    also: ['Convert Binary tree into BST', 'Convert a normal BST into a Balanced BST', 'Flatten BST to sorted list'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In-order array ↔ balanced BST',
        idea: 'Collect the in-order values (sorted for a BST). To convert a plain binary tree: sort the collected values. To balance: recursively pick the middle as the root. To flatten: rebuild as a right-only chain.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function inorderVals(n, out = []) { if (n) { inorderVals(n.left, out); out.push(n.val); inorderVals(n.right, out); } return out; }

function sortedArrayToBST(a, lo = 0, hi = a.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return { val: a[mid], left: sortedArrayToBST(a, lo, mid - 1), right: sortedArrayToBST(a, mid + 1, hi) };
}

function balanceBST(root) { return sortedArrayToBST(inorderVals(root)); }
function treeToBST(root) { return sortedArrayToBST(inorderVals(root).sort((x, y) => x - y)); }

function flattenToSortedList(root) {
  const a = inorderVals(root);
  const dummy = { right: null }; let t = dummy;
  for (const v of a) { t.right = { val: v, left: null, right: null }; t = t.right; }
  return dummy.right;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Merge two BSTs',
    also: ['Merge two BST'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In-order lists → merge → build balanced BST',
        idea: 'In-order traversal of each BST gives two sorted arrays; merge them, then build a height-balanced BST from the merged array.',
        time: 'O(n + m)',
        space: 'O(n + m)',
        code: `function mergeBSTs(a, b) {
  const inorder = (n, out = []) => { if (n) { inorder(n.left, out); out.push(n.val); inorder(n.right, out); } return out; };
  const A = inorder(a), B = inorder(b);
  const merged = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) merged.push(A[i] <= B[j] ? A[i++] : B[j++]);
  while (i < A.length) merged.push(A[i++]);
  while (j < B.length) merged.push(B[j++]);
  const build = (lo, hi) => lo > hi ? null : (() => { const m = (lo + hi) >> 1; return { val: merged[m], left: build(lo, m - 1), right: build(m + 1, hi) }; })();
  return build(0, merged.length - 1);
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Kth smallest / Kth largest element in a BST',
    also: ['Find Kth smallest element in a BST', 'Find Kth largest element in a BST'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Controlled in-order (reverse in-order for largest)',
        idea: 'In-order visits values ascending; stop at the kth. For kth largest, do a reverse in-order (right, node, left).',
        time: 'O(h + k)',
        space: 'O(h)',
        code: `function kthSmallest(root, k) {
  const st = [];
  let cur = root;
  while (cur || st.length) {
    while (cur) { st.push(cur); cur = cur.left; }
    cur = st.pop();
    if (--k === 0) return cur.val;
    cur = cur.right;
  }
}
// kth largest: same loop with left/right swapped.`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Count pairs from two BSTs whose sum equals X',
    also: ['Count pairs from 2 BST whose sum is equal to given value "X"'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In-order of one, reverse in-order of the other, two pointers',
        idea: 'Ascending stream from BST1, descending stream from BST2. Advance the streams like the two-pointer pair-sum on sorted arrays.',
        time: 'O(n + m)',
        space: 'O(h1 + h2)',
        code: `function countPairs(root1, root2, x) {
  const asc = [], desc = [];
  (function inL(n){ if(!n) return; inL(n.left); asc.push(n.val); inL(n.right); })(root1);
  (function inR(n){ if(!n) return; inR(n.right); desc.push(n.val); inR(n.left); })(root2);
  let i = 0, j = 0, count = 0;
  while (i < asc.length && j < desc.length) {
    const s = asc[i] + desc[j];
    if (s === x) { count++; i++; j++; }
    else if (s < x) i++;
    else j++;
  }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Median of a BST in O(n) time, O(1) space / count nodes in a range',
    also: ['Find the median of BST in O(n) time and O(1) space', 'Count BST ndoes that lie in a given range'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Morris in-order traversal (median) + pruned recursion (range count)',
        idea: 'Morris traversal walks in-order with O(1) space by temporarily threading predecessors. First pass counts n; second pass stops at position n/2. Range count: skip a subtree entirely when its root is outside [lo, hi].',
        time: 'O(n)',
        space: 'O(1) for median',
        code: `function countInRange(node, lo, hi) {
  if (!node) return 0;
  if (node.val < lo) return countInRange(node.right, lo, hi);
  if (node.val > hi) return countInRange(node.left, lo, hi);
  return 1 + countInRange(node.left, lo, hi) + countInRange(node.right, lo, hi);
}`,
        note: 'Morris median: do one Morris pass to count nodes, a second Morris pass to read the middle value(s). Threads are removed as you go, so no stack/recursion.',
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Replace each element with the least greater element on its right',
    also: ['Replace every element with the least greater element on its right'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Insert right-to-left into a BST, read the successor',
        idea: 'Process the array from the end. Insert each value into a BST; on the way down, the last node you turned left from is its least greater element.',
        time: 'O(n·h)',
        space: 'O(n)',
        code: `function replaceWithLeastGreater(a) {
  let root = null;
  const res = Array(a.length).fill(-1);
  const insert = (val, i) => {
    let succ = null, node = root, parent = null, dir = '';
    while (node) { parent = node; if (val < node.val) { succ = node; node = node.left; dir = 'left'; } else { node = node.right; dir = 'right'; } }
    const fresh = { val, left: null, right: null };
    if (!parent) root = fresh; else parent[dir] = fresh;
    if (succ) res[i] = succ.val;
  };
  for (let i = a.length - 1; i >= 0; i--) insert(a[i], i);
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Find conflicting appointments',
    also: ['Given "n" appointments, find the conflicting appointments'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Interval-BST (or sort + sweep)',
        idea: 'Insert each [start, end] into an interval tree keyed by start; on insert, any node whose range overlaps the new one is a conflict. Simpler: sort by start, and any appointment whose start < previous max end conflicts.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function conflictingAppointments(appts) {
  const sorted = [...appts].sort((a, b) => a[0] - b[0]);
  const conflicts = [];
  let maxEnd = -Infinity, prev = null;
  for (const [s, e] of sorted) {
    if (s < maxEnd) conflicts.push([[prev[0], prev[1]], [s, e]]);
    if (e > maxEnd) { maxEnd = e; prev = [s, e]; }
  }
  return conflicts;
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Check whether a BST contains a dead end',
    also: ['Check whether BST contains Dead end'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Track the allowed (lo, hi) window; a leaf with hi − lo === 2 is a dead end',
        idea: 'A dead-end leaf value v can’t accept any new node because both v−1 and v+1 are boundaries. That happens exactly when the leaf’s open interval is (v−1, v+1).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function hasDeadEnd(root, lo = 1, hi = Infinity) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val - lo === 1 && hi - root.val === 1;
  return hasDeadEnd(root.left, lo, root.val - 1) || hasDeadEnd(root.right, root.val + 1, hi);
}`,
      },
    ],
  },
  {
    topic: 'Binary Search Trees',
    problem: 'Largest BST subtree in a binary tree',
    also: ['Largest BST in a Binary Tree'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Post-order returning (isBST, size, min, max)',
        idea: 'A node forms a BST iff both children are BSTs and node.val > leftMax and node.val < rightMin. Track the largest size seen.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function largestBSTSubtree(root) {
  let best = 0;
  const dfs = (n) => {
    if (!n) return { isBST: true, size: 0, min: Infinity, max: -Infinity };
    const L = dfs(n.left), R = dfs(n.right);
    if (L.isBST && R.isBST && n.val > L.max && n.val < R.min) {
      const size = L.size + R.size + 1;
      best = Math.max(best, size);
      return { isBST: true, size, min: Math.min(n.val, L.min), max: Math.max(n.val, R.max) };
    }
    return { isBST: false, size: 0, min: 0, max: 0 };
  };
  dfs(root);
  return best;
}`,
      },
    ],
  },

  // ================================================================ Heap (rest)
  {
    topic: 'Heap',
    problem: 'Implement a binary heap (min & max) with array + sift up/down',
    also: ['Implement a Maxheap/MinHeap using arrays and recursion', 'Convert min heap to max heap'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Array-backed heap',
        idea: 'Parent of i is (i−1)>>1; children are 2i+1, 2i+2. push sifts up, pop swaps root with last and sifts down. "Heapify" an arbitrary array by sifting down every non-leaf from the middle back to 0 — that is how you turn a min-heap array into a max-heap.',
        time: 'push/pop O(log n), build O(n)',
        space: 'O(n)',
        code: `class Heap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }   // min-heap by default
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.cmp(a[p], a[i]) <= 0) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; this.#down(0); }
    return top;
  }
  #down(i) {
    const a = this.a;
    for (;;) {
      let s = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < a.length && this.cmp(a[l], a[s]) < 0) s = l;
      if (r < a.length && this.cmp(a[r], a[s]) < 0) s = r;
      if (s === i) break;
      [a[s], a[i]] = [a[i], a[s]]; i = s;
    }
  }
  static heapify(arr, cmp) { const h = new Heap(cmp); h.a = arr; for (let i = (arr.length >> 1) - 1; i >= 0; i--) h.#down(i); return h; }
}
// Max-heap: new Heap((a, b) => b - a).`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Heap sort',
    also: ['Sort an Array using heap. (HeapSort)'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Build max-heap in place, repeatedly extract the max to the end',
        idea: 'Heapify the array into a max-heap; swap the root with the last unsorted element and sift down the reduced heap. In place, O(1) extra.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function heapSort(a) {
  const n = a.length;
  const down = (i, size) => {
    for (;;) {
      let s = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && a[l] > a[s]) s = l;
      if (r < size && a[r] > a[s]) s = r;
      if (s === i) break;
      [a[s], a[i]] = [a[i], a[s]]; i = s;
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) down(i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    down(0, end);
  }
  return a;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Maximum of all subarrays of size k (sliding window maximum)',
    also: ['Maximum of all subarrays of size k'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Monotonic decreasing deque',
        idea: 'Keep indices whose values are decreasing. Pop smaller values from the back on insert; pop the front when it leaves the window. The front is the current window max.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function maxSlidingWindow(a, k) {
  const dq = [], res = [];
  for (let i = 0; i < a.length; i++) {
    while (dq.length && a[dq[dq.length - 1]] <= a[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) res.push(a[dq[0]]);
  }
  return res;
}`,
        note: 'A max-heap of (value, index) also works in O(n log k) — pop stale indices lazily.',
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Kth smallest and largest element in an unsorted array',
    also: ['Kth smallest and largest element in an unsorted array', '“k” largest element in an array'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'One heap of size k',
        idea: 'Kth largest → min-heap of size k (root is the answer). Kth smallest → max-heap of size k. Quickselect gives average O(n).',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function kthLargest(a, k) {
  const h = []; // min-heap as sorted array for brevity
  for (const x of a) {
    let i = h.findIndex((v) => v > x);
    i === -1 ? h.push(x) : h.splice(i, 0, x);
    if (h.length > k) h.shift();
  }
  return h[0];
}
const kthSmallest = (a, k) => kthLargest(a, a.length - k + 1);`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Merge K sorted arrays',
    also: ['Merge “K” sorted arrays'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-heap of (value, arrayIdx, elemIdx)',
        idea: 'Seed with the first element of each array; pop the smallest, output it, push the next element from the same array.',
        time: 'O(N log K)',
        space: 'O(K)',
        code: `function mergeKArrays(arrays) {
  const heap = arrays.map((arr, i) => [arr[0], i, 0]).filter((x) => x[0] !== undefined);
  heap.sort((a, b) => a[0] - b[0]);
  const out = [];
  while (heap.length) {
    const [val, ai, ei] = heap.shift();
    out.push(val);
    if (ei + 1 < arrays[ai].length) {
      const next = [arrays[ai][ei + 1], ai, ei + 1];
      let i = heap.findIndex((x) => x[0] > next[0]);
      i === -1 ? heap.push(next) : heap.splice(i, 0, next);
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Merge two binary max heaps',
    also: ['Merge 2 Binary Max Heaps'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Concatenate the arrays and re-heapify',
        idea: 'A heap is just an array; join both backing arrays and build-heap in O(n).',
        time: 'O(n + m)',
        space: 'O(1) extra',
        code: `function mergeMaxHeaps(a, b) {
  const arr = a.concat(b), n = arr.length;
  const down = (i) => {
    for (;;) {
      let s = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && arr[l] > arr[s]) s = l;
      if (r < n && arr[r] > arr[s]) s = r;
      if (s === i) break;
      [arr[s], arr[i]] = [arr[i], arr[s]]; i = s;
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) down(i);
  return arr;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Kth largest sum of contiguous subarrays',
    also: ['Kth largest sum continuous subarrays'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'All prefix sums + min-heap of size k',
        idea: 'Every subarray sum is prefix[j] − prefix[i]. Generate them and keep the k largest in a size-k min-heap.',
        time: 'O(n² log k)',
        space: 'O(k)',
        code: `function kthLargestSubarraySum(a, k) {
  const prefix = [0];
  for (const x of a) prefix.push(prefix[prefix.length - 1] + x);
  const heap = [];
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j <= a.length; j++) {
      const s = prefix[j] - prefix[i];
      let p = heap.findIndex((v) => v > s);
      p === -1 ? heap.push(s) : heap.splice(p, 0, s);
      if (heap.length > k) heap.shift();
    }
  return heap[0];
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Smallest range covering elements from K lists',
    also: ['Smallest range in “K” Lists'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Min-heap of one element per list, track the running max',
        idea: 'Keep one pointer per list in a min-heap; the range is [heapMin, currentMax]. Pop the min, advance that list, update max. Stop when a list is exhausted.',
        time: 'O(N log K)',
        space: 'O(K)',
        code: `function smallestRange(lists) {
  let heap = lists.map((l, i) => [l[0], i, 0]);
  heap.sort((a, b) => a[0] - b[0]);
  let curMax = Math.max(...heap.map((x) => x[0]));
  let best = [heap[0][0], curMax];
  while (true) {
    const [val, li, ei] = heap.shift();
    if (curMax - val < best[1] - best[0]) best = [val, curMax];
    if (ei + 1 === lists[li].length) break;
    const nxt = [lists[li][ei + 1], li, ei + 1];
    curMax = Math.max(curMax, nxt[0]);
    let p = heap.findIndex((x) => x[0] > nxt[0]);
    p === -1 ? heap.push(nxt) : heap.splice(p, 0, nxt);
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Median in a stream of integers',
    also: ['Median in a stream of Integers'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Two heaps — max-heap for the low half, min-heap for the high half',
        idea: 'Keep the halves balanced (sizes differ by ≤ 1). The median is the top of the larger heap, or the average of both tops.',
        time: 'O(log n) per insert, O(1) query',
        space: 'O(n)',
        code: `class MedianFinder {
  constructor() { this.low = []; this.high = []; } // low is a max-heap, high a min-heap (sorted arrays here)
  addNum(x) {
    const push = (h, v, cmp) => { let i = h.findIndex((e) => cmp(e, v)); i === -1 ? h.push(v) : h.splice(i, 0, v); };
    push(this.low, x, (e, v) => e < v);            // descending
    this.high.push(this.low.shift());
    this.high.sort((a, b) => a - b);
    if (this.high.length > this.low.length) { this.low.unshift(this.high.shift()); this.low.sort((a, b) => b - a); }
  }
  findMedian() {
    if (this.low.length > this.high.length) return this.low[0];
    return (this.low[0] + this.high[0]) / 2;
  }
}`,
        note: 'Use real binary heaps for O(log n); the sorted-array version above is O(n) per insert but shows the idea.',
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Check whether a binary tree is a heap',
    also: ['Check if a Binary Tree is Heap'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Complete-tree check + heap-order check',
        idea: 'Count nodes; a node at index i is valid only if i < count (completeness). Separately verify every node ≥ its children (max-heap).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isHeap(root) {
  const count = (n) => (n ? 1 + count(n.left) + count(n.right) : 0);
  const total = count(root);
  const complete = (n, i) => {
    if (!n) return true;
    if (i >= total) return false;
    return complete(n.left, 2 * i + 1) && complete(n.right, 2 * i + 2);
  };
  const ordered = (n) => {
    if (!n) return true;
    if (n.left && n.left.val > n.val) return false;
    if (n.right && n.right.val > n.val) return false;
    return ordered(n.left) && ordered(n.right);
  };
  return complete(root, 0) && ordered(root);
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Connect n ropes with minimum cost',
    also: ['Connect “n” ropes with minimum cost'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Min-heap greedy (Huffman-style)',
        idea: 'Always join the two shortest ropes; add the combined length to the cost and back to the heap.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function connectRopes(lengths) {
  const heap = [...lengths].sort((a, b) => a - b);
  let cost = 0;
  while (heap.length > 1) {
    const a = heap.shift(), b = heap.shift();
    const sum = a + b;
    cost += sum;
    let i = heap.findIndex((v) => v > sum);
    i === -1 ? heap.push(sum) : heap.splice(i, 0, sum);
  }
  return cost;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Convert a BST to a min-heap',
    also: ['Convert BST to Min Heap'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'In-order values → fill nodes in pre-order',
        idea: 'In-order of a BST is sorted. Traverse the tree in pre-order and assign the sorted values in sequence — every parent then gets a smaller value than its children (a min-heap where the left subtree is entirely smaller than the right).',
        time: 'O(n)',
        space: 'O(n)',
        code: `function bstToMinHeap(root) {
  const vals = [];
  (function inorder(n) { if (n) { inorder(n.left); vals.push(n.val); inorder(n.right); } })(root);
  let i = 0;
  (function preorder(n) { if (n) { n.val = vals[i++]; preorder(n.left); preorder(n.right); } })(root);
  return root;
}`,
      },
    ],
  },
  {
    topic: 'Heap',
    problem: 'Minimum sum of two numbers formed from digits of an array',
    also: ['Minimum sum of two numbers formed from digits of an array'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort ascending, deal digits alternately to two numbers',
        idea: 'Smallest digits belong in the highest place values; alternating them between the two numbers keeps both small and equal in length.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function minSum(digits) {
  digits.sort((a, b) => a - b);
  let n1 = '', n2 = '';
  digits.forEach((d, i) => (i % 2 === 0 ? (n1 += d) : (n2 += d)));
  return (BigInt(n1 || 0) + BigInt(n2 || 0)).toString();
}`,
      },
    ],
  },

  // ================================================================ Trie
  {
    topic: 'Trie',
    problem: 'Construct a trie (insert / search / startsWith)',
    also: ['Construct a trie from scratch'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Nodes with a children map and an end flag',
        idea: 'Each node holds a map char→child and a boolean "is a word end". Insert/search/prefix all walk character by character.',
        time: 'O(L) per op',
        space: 'O(total chars)',
        code: `class Trie {
  constructor() { this.root = { children: new Map(), end: false }; }
  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, { children: new Map(), end: false });
      node = node.children.get(c);
    }
    node.end = true;
  }
  #find(prefix) {
    let node = this.root;
    for (const c of prefix) {
      if (!node.children.has(c)) return null;
      node = node.children.get(c);
    }
    return node;
  }
  search(word) { const n = this.#find(word); return !!n && n.end; }
  startsWith(prefix) { return this.#find(prefix) !== null; }
}`,
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Shortest unique prefix for every word',
    also: ['Find shortest unique prefix for every word in a given list'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Trie with per-node pass-through counts',
        idea: 'Insert all words, storing at each node how many words pass through it. For each word, the shortest unique prefix ends at the first node whose count is 1.',
        time: 'O(total chars)',
        space: 'O(total chars)',
        code: `function shortestUniquePrefixes(words) {
  const root = { children: new Map(), count: 0 };
  for (const w of words) {
    let node = root;
    for (const c of w) {
      if (!node.children.has(c)) node.children.set(c, { children: new Map(), count: 0 });
      node = node.children.get(c);
      node.count++;
    }
  }
  return words.map((w) => {
    let node = root, prefix = '';
    for (const c of w) {
      node = node.children.get(c);
      prefix += c;
      if (node.count === 1) break;
    }
    return prefix;
  });
}`,
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Word Break (trie solution)',
    also: ['Word Break Problem | (Trie solution)'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DP over prefixes, dictionary stored in a trie',
        idea: 'dp[i] = s[0..i) is breakable. From each true dp[j], walk the trie along s[j..] and set dp[k] wherever you hit a word end.',
        time: 'O(n² ) worst, faster in practice',
        space: 'O(dict)',
        code: `function wordBreakTrie(s, dict) {
  const root = { children: new Map(), end: false };
  for (const w of dict) {
    let node = root;
    for (const c of w) { if (!node.children.has(c)) node.children.set(c, { children: new Map(), end: false }); node = node.children.get(c); }
    node.end = true;
  }
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 0; i < s.length; i++) {
    if (!dp[i]) continue;
    let node = root;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (!node.children.has(c)) break;
      node = node.children.get(c);
      if (node.end) dp[j + 1] = true;
    }
  }
  return dp[s.length];
}`,
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Implement a phone directory (prefix search)',
    also: ['Implement a Phone Directory'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Trie; DFS from the prefix node to list matches',
        idea: 'Insert all contacts. For each successive prefix of a query, find its trie node and DFS to collect all words below it.',
        time: 'O(L + matches)',
        space: 'O(total chars)',
        code: `function phoneDirectory(contacts, query) {
  const root = { children: new Map(), end: false };
  for (const name of contacts) {
    let node = root;
    for (const c of name) { if (!node.children.has(c)) node.children.set(c, { children: new Map(), end: false }); node = node.children.get(c); }
    node.end = true;
  }
  const collect = (node, prefix, out) => {
    if (node.end) out.push(prefix);
    for (const [c, child] of node.children) collect(child, prefix + c, out);
  };
  const results = [];
  let node = root, prefix = '';
  for (const c of query) {
    if (!node || !node.children.has(c)) { node = null; results.push([]); continue; }
    node = node.children.get(c);
    prefix += c;
    const out = [];
    collect(node, prefix, out);
    results.push(out.sort());
  }
  return results; // one suggestion list per typed character
}`,
      },
    ],
  },
  {
    topic: 'Trie',
    problem: 'Print unique rows in a boolean matrix',
    also: ['Print unique rows in a given boolean matrix'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Trie of rows (or a set of joined strings)',
        idea: 'Treat each row as a binary string; insert into a trie (or a Set). Print a row only the first time it is inserted.',
        time: 'O(rows · cols)',
        space: 'O(rows · cols)',
        code: `function uniqueRows(matrix) {
  const seen = new Set();
  const out = [];
  for (const row of matrix) {
    const key = row.join('');
    if (!seen.has(key)) { seen.add(key); out.push(row); }
  }
  return out;
}`,
      },
    ],
  },

  // ================================================================ Bit Manipulation (rest)
  {
    topic: 'Bit Manipulation',
    problem: 'Find the two non-repeating elements (all others appear twice)',
    also: ['Find the two non-repeating elements in an array of repeating elements'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'XOR everything, split by a differing bit',
        idea: 'XOR of the whole array = x ^ y. Any set bit in it differs between x and y — partition the array by that bit and XOR each group separately.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function twoNonRepeating(a) {
  const xorAll = a.reduce((acc, v) => acc ^ v, 0);
  const bit = xorAll & -xorAll;         // lowest set bit
  let x = 0, y = 0;
  for (const v of a) (v & bit) ? (x ^= v) : (y ^= v);
  return [x, y];
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Count bits to flip to convert A to B',
    also: ['Count number of bits to be flipped to convert A to B'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Popcount of A XOR B',
        idea: 'A ^ B has a 1 exactly where the bits differ.',
        time: 'O(bits)',
        space: 'O(1)',
        code: `function bitsToFlip(a, b) {
  let x = a ^ b, count = 0;
  while (x) { x &= x - 1; count++; }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Count total set bits in all numbers from 1 to n',
    also: ['Count total set bits in all numbers from 1 to n'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Per-bit contribution',
        idea: 'For bit position b, the bit cycles with period 2^(b+1): 2^b zeros then 2^b ones. Count full cycles × 2^b plus the partial remainder.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function countTotalSetBits(n) {
  let total = 0;
  for (let b = 0; (1 << b) <= n; b++) {
    const period = 1 << (b + 1);
    const full = Math.floor((n + 1) / period) * (1 << b);
    const rem = Math.max(0, ((n + 1) % period) - (1 << b));
    total += full + rem;
  }
  return total;
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Check whether a number is a power of two / find the position of its only set bit',
    also: ['Program to find whether a no is power of two', 'Find position of the only set bit'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'n & (n − 1)',
        idea: 'A power of two has exactly one set bit, so n & (n−1) clears it to 0. The bit position is log2(n), or count right shifts until you reach 1.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

function onlySetBitPosition(n) {
  if (!isPowerOfTwo(n)) return -1;
  let pos = 1;
  while (!(n & 1)) { n >>= 1; pos++; }
  return pos; // 1-indexed
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Copy set bits in a given range from one number to another',
    also: ['Copy set bits in a range'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Build a range mask and OR',
        idea: 'mask = bits [l..r] set. result = x | (y & mask) — copies y’s bits in that range into x.',
        time: 'O(1)',
        space: 'O(1)',
        code: `function copyBitsInRange(x, y, l, r) {
  let mask = 0;
  for (let i = l; i <= r; i++) mask |= (1 << (i - 1)); // 1-indexed positions
  return x | (y & mask);
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Divide two integers without *, / or %',
    also: ['Divide two integers without using multiplication, division and mod operator'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Repeated doubling of the divisor',
        idea: 'Subtract the largest shifted copy of the divisor (divisor << k) that still fits; add 2^k to the quotient. Handle signs and the INT_MIN edge case.',
        time: 'O(log² n)',
        space: 'O(1)',
        code: `function divide(dividend, divisor) {
  const INT_MAX = 2 ** 31 - 1, INT_MIN = -(2 ** 31);
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;
  const neg = (dividend < 0) !== (divisor < 0);
  let a = Math.abs(dividend), b = Math.abs(divisor), q = 0;
  while (a >= b) {
    let temp = b, multiple = 1;
    while (a >= (temp << 1)) { temp <<= 1; multiple <<= 1; }
    a -= temp;
    q += multiple;
  }
  return neg ? -q : q;
}`,
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Square a number without *, / or pow()',
    also: ['Calculate square of a number without using *, / and pow()'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'n² = sum of the first n odd numbers',
        idea: '1 + 3 + 5 + … + (2n−1) = n². Add n odd numbers.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function square(n) {
  n = Math.abs(n);
  let result = 0;
  for (let i = 0; i < n; i++) result += 2 * i + 1;
  return result;
}`,
        note: 'O(log n) via bit shifts: square(n) = (square(n>>1) << 2) + (n odd ? (n<<1) - 1 : 0).',
      },
    ],
  },
  {
    topic: 'Bit Manipulation',
    problem: 'Power set of a set',
    also: ['Power Set'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Bitmask enumeration',
        idea: 'Every subset ↔ a number 0..2ⁿ−1; bit j set means element j is included.',
        time: 'O(2ⁿ · n)',
        space: 'O(1) extra',
        code: `function powerSet(arr) {
  const n = arr.length, res = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let j = 0; j < n; j++) if (mask & (1 << j)) subset.push(arr[j]);
    res.push(subset);
  }
  return res;
}`,
      },
    ],
  },

  // ================================================================ Graph
  {
    topic: 'Graph',
    problem: 'Represent a graph; BFS and DFS',
    also: ['Create a Graph, print it', 'Implement BFS algorithm', 'Implement DFS Algo'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Adjacency list + queue (BFS) / stack or recursion (DFS)',
        idea: 'Store neighbours per node. BFS explores in rings using a queue; DFS goes deep with recursion or an explicit stack.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function buildGraph(n, edges, directed = false) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); if (!directed) adj[v].push(u); }
  return adj;
}
function bfs(adj, src) {
  const seen = new Array(adj.length).fill(false), order = [];
  const q = [src]; seen[src] = true;
  for (let i = 0; i < q.length; i++) {
    const u = q[i]; order.push(u);
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
  }
  return order;
}
function dfs(adj, src, seen = new Array(adj.length).fill(false), order = []) {
  seen[src] = true; order.push(src);
  for (const v of adj[src]) if (!seen[v]) dfs(adj, v, seen, order);
  return order;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Detect a cycle — directed and undirected',
    also: [
      'Detect Cycle in Directed Graph using BFS/DFS Algo',
      'Detect Cycle in UnDirected Graph using BFS/DFS Algo',
      'Find whether it is possible to finish all tasks or not from given dependencies',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Directed — DFS with 3 colours (or Kahn count)',
        idea: 'grey = on the current DFS path. An edge to a grey node is a back-edge ⇒ cycle. "Can finish all tasks" is exactly "the dependency DAG has no cycle".',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function hasCycleDirected(adj) {
  const state = new Array(adj.length).fill(0); // 0 unseen, 1 grey, 2 done
  const dfs = (u) => {
    state[u] = 1;
    for (const v of adj[u]) {
      if (state[v] === 1) return true;
      if (state[v] === 0 && dfs(v)) return true;
    }
    state[u] = 2;
    return false;
  };
  for (let i = 0; i < adj.length; i++) if (state[i] === 0 && dfs(i)) return true;
  return false;
}`,
      },
      {
        name: 'Undirected — DFS tracking the parent (or Union-Find)',
        idea: 'A visited neighbour that is not the node you came from means a cycle. Alternatively, an edge whose endpoints are already in the same DSU set forms a cycle.',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function hasCycleUndirected(adj) {
  const seen = new Array(adj.length).fill(false);
  const dfs = (u, parent) => {
    seen[u] = true;
    for (const v of adj[u]) {
      if (!seen[v]) { if (dfs(v, u)) return true; }
      else if (v !== parent) return true;
    }
    return false;
  };
  for (let i = 0; i < adj.length; i++) if (!seen[i] && dfs(i, -1)) return true;
  return false;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Flood fill',
    also: ['flood fill algo'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'DFS/BFS from the start pixel',
        idea: 'Recolour the start pixel and recurse into 4-connected neighbours that still have the original colour.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function floodFill(image, sr, sc, newColor) {
  const old = image[sr][sc];
  if (old === newColor) return image;
  const fill = (r, c) => {
    if (r < 0 || c < 0 || r >= image.length || c >= image[0].length || image[r][c] !== old) return;
    image[r][c] = newColor;
    fill(r + 1, c); fill(r - 1, c); fill(r, c + 1); fill(r, c - 1);
  };
  fill(sr, sc);
  return image;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Clone a graph',
    also: ['Clone a graph'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS/BFS with an original → copy map',
        idea: 'On first visit, create the copy and store it; for each neighbour, recurse (creating it if needed) and link.',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  const dfs = (n) => {
    if (map.has(n)) return map.get(n);
    const copy = { val: n.val, neighbors: [] };
    map.set(n, copy);
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
    return copy;
  };
  return dfs(node);
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Shortest path on a grid — rat in a maze, knight moves, snake & ladder',
    also: ['Search in a Maze', 'Minimum Step by Knight', 'Snake and Ladders Problem', 'Rat in a maze Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'BFS (unweighted shortest path)',
        idea: 'Every cell/state is a node; edges are legal moves. BFS from the start gives the minimum number of moves. Snake & ladder: nodes are board squares 1..100, edges are dice rolls, jumps rewrite the destination.',
        time: 'O(cells)',
        space: 'O(cells)',
        code: `function minKnightMoves(N, start, target) {
  const moves = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
  const seen = Array.from({ length: N }, () => Array(N).fill(false));
  let q = [[...start, 0]];
  seen[start[0]][start[1]] = true;
  while (q.length) {
    const next = [];
    for (const [r, c, d] of q) {
      if (r === target[0] && c === target[1]) return d;
      for (const [dr, dc] of moves) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < N && nc < N && !seen[nr][nc]) { seen[nr][nc] = true; next.push([nr, nc, d + 1]); }
      }
    }
    q = next;
  }
  return -1;
}`,
        note: 'Rat in a maze wants ALL paths, not the shortest — that is backtracking (record the path, mark/unmark visited cells).',
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Word Ladder (shortest transformation sequence)',
    also: ['word Ladder'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'BFS over words, neighbours = one-letter changes',
        idea: 'From each word, generate all words that differ by one letter; keep those in the dictionary. BFS distance from beginWord to endWord + 1 is the ladder length.',
        time: 'O(N · L · 26)',
        space: 'O(N · L)',
        code: `function ladderLength(begin, end, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(end)) return 0;
  let q = [begin], steps = 1;
  dict.delete(begin);
  while (q.length) {
    const next = [];
    for (const word of q) {
      if (word === end) return steps;
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c < 123; c++) {
          const cand = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (dict.has(cand)) { dict.delete(cand); next.push(cand); }
        }
      }
    }
    q = next; steps++;
  }
  return 0;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: "Dijkstra's shortest paths",
    also: ['Dijkstra algo'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-priority queue by tentative distance',
        idea: 'Repeatedly pop the closest unfinalised node and relax its edges. Needs non-negative weights.',
        time: 'O((V + E) log V)',
        space: 'O(V)',
        code: `function dijkstra(adj, src) { // adj[u] = [[v, w], ...]
  const dist = new Array(adj.length).fill(Infinity);
  dist[src] = 0;
  const pq = [[0, src]]; // [d, node]; simple array used as a min-heap
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }
    }
  }
  return dist;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Topological sort; job completion times & longest path in a DAG',
    also: [
      'Implement Topological Sort',
      'Minimum time taken by each job to be completed given by a Directed Acyclic Graph',
      'Longest path in a Directed Acyclic Graph',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: "Kahn's order, then relax in that order",
        idea: 'Process nodes in topological order. Job time: finish[v] = 1 + max(finish[u]) over predecessors. Longest path: dist[v] = max(dist[u] + w) — a simple DP once the order is fixed.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function longestPathDAG(n, edges) { // edges: [u, v, w]
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); indeg[v]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (!indeg[i]) q.push(i);
  const dist = new Array(n).fill(0);
  for (let i = 0; i < q.length; i++) {
    const u = q[i];
    for (const [v, w] of adj[u]) {
      dist[v] = Math.max(dist[v], dist[u] + w);
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return Math.max(...dist);
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Alien dictionary — order of letters',
    also: ['Given a sorted Dictionary of an Alien Language, find order of characters'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Build a precedence graph from adjacent words, topological sort',
        idea: 'For each adjacent pair of words, the first differing character gives an edge a → b. Topologically sort the letters. A prefix that comes after its extension is invalid.',
        time: 'O(total chars)',
        space: 'O(1) — 26 letters',
        code: `function alienOrder(words) {
  const adj = new Map(), indeg = new Map();
  for (const w of words) for (const c of w) { adj.set(c, adj.get(c) || new Set()); indeg.set(c, 0); }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]).has(b[j])) { adj.get(a[j]).add(b[j]); indeg.set(b[j], indeg.get(b[j]) + 1); }
        break;
      }
    }
  }
  const q = [...indeg].filter(([, d]) => d === 0).map(([c]) => c);
  let order = '';
  for (let i = 0; i < q.length; i++) {
    order += q[i];
    for (const nb of adj.get(q[i])) if (indeg.set(nb, indeg.get(nb) - 1).get(nb) === 0) q.push(nb);
  }
  return order.length === indeg.size ? order : '';
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Minimum spanning tree — Kruskal and Prim',
    also: ["Implement Kruksal’sAlgorithm", "Implement Prim’s Algorithm", 'Total no. of Spanning tree in a graph'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Kruskal — sort edges, Union-Find to avoid cycles',
        idea: 'Add the cheapest edge that connects two different components; stop after V−1 edges.',
        time: 'O(E log E)',
        space: 'O(V)',
        code: `function kruskal(n, edges) { // edges: [u, v, w]
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let cost = 0, used = 0;
  for (const [u, v, w] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { parent[ru] = rv; cost += w; used++; }
  }
  return used === n - 1 ? cost : -1; // -1 ⇒ disconnected
}`,
      },
      {
        name: 'Prim — grow the tree from one node, always take the cheapest crossing edge',
        idea: 'Min-priority queue of edges leaving the current tree; repeatedly add the lightest edge to a new node.',
        time: 'O(E log V)',
        space: 'O(V + E)',
        code: `function prim(adj) { // adj[u] = [[v, w], ...]
  const n = adj.length;
  const inMST = new Array(n).fill(false);
  const pq = [[0, 0]];
  let cost = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, u] = pq.shift();
    if (inMST[u]) continue;
    inMST[u] = true; cost += w;
    for (const [v, w2] of adj[u]) if (!inMST[v]) pq.push([w2, v]);
  }
  return cost;
}`,
        note: 'Counting all spanning trees uses Kirchhoff’s Matrix-Tree Theorem: the determinant of any cofactor of the Laplacian (degree matrix − adjacency matrix).',
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Bellman–Ford and detecting a negative cycle',
    also: ['Implement Bellman Ford Algorithm', 'Detect Negative cycle in a graph'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Relax all edges V−1 times; a further relaxation means a negative cycle',
        idea: 'Handles negative weights. If any edge can still be relaxed after V−1 rounds, a negative cycle is reachable.',
        time: 'O(V·E)',
        space: 'O(V)',
        code: `function bellmanFord(n, edges, src) { // edges: [u, v, w]
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < n - 1; i++)
    for (const [u, v, w] of edges)
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  for (const [u, v, w] of edges)
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return { negativeCycle: true };
  return { dist };
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Floyd–Warshall (all-pairs shortest paths)',
    also: ['Implement Floyd warshallAlgorithm'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DP over intermediate vertices',
        idea: 'dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for every k. Negative cycle iff any dist[i][i] < 0.',
        time: 'O(V³)',
        space: 'O(V²)',
        code: `function floydWarshall(dist) { // dist[i][j] = weight or Infinity, dist[i][i] = 0
  const n = dist.length;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Check whether a graph is bipartite / the Two-Clique problem',
    also: ['Check whether a graph is Bipartite or Not', 'Two Clique Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '2-colour with BFS/DFS',
        idea: 'Colour a node, colour its neighbours the opposite colour. A conflict means an odd cycle ⇒ not bipartite. "Two cliques": a graph’s vertices split into two cliques iff its COMPLEMENT is bipartite.',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function isBipartite(adj) {
  const color = new Array(adj.length).fill(-1);
  for (let s = 0; s < adj.length; s++) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const q = [s];
    for (let i = 0; i < q.length; i++) {
      const u = q[i];
      for (const v of adj[u]) {
        if (color[v] === -1) { color[v] = color[u] ^ 1; q.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Bridges and articulation points',
    also: ['Find bridge in a graph'],
    difficulty: 'Hard',
    approaches: [
      {
        name: "Tarjan's DFS with discovery time & low-link",
        idea: 'low[u] = earliest discovery time reachable from u’s subtree via one back-edge. Edge (u, v) is a bridge iff low[v] > disc[u]; u is an articulation point iff some child has low[v] ≥ disc[u] (root: ≥ 2 DFS children).',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function findBridges(n, adj) {
  const disc = new Array(n).fill(-1), low = new Array(n).fill(0);
  const bridges = [];
  let timer = 0;
  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };
  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
  return bridges;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Strongly connected components (Kosaraju)',
    also: ['Count Strongly connected Components(Kosaraju Algo)'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Two passes: finish-time order, then DFS the transpose',
        idea: '1) DFS the graph pushing nodes on a stack by finish time. 2) DFS the reversed graph in that stack order — each tree is one SCC.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function kosaraju(n, adj) {
  const radj = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) radj[v].push(u);
  const seen = new Array(n).fill(false), order = [];
  const dfs1 = (u) => { seen[u] = true; for (const v of adj[u]) if (!seen[v]) dfs1(v); order.push(u); };
  for (let i = 0; i < n; i++) if (!seen[i]) dfs1(i);
  seen.fill(false);
  let count = 0;
  const dfs2 = (u) => { seen[u] = true; for (const v of radj[u]) if (!seen[v]) dfs2(v); };
  for (let i = order.length - 1; i >= 0; i--) if (!seen[order[i]]) { dfs2(order[i]); count++; }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Graph / m-colouring problem',
    also: ['Graph ColouringProblem', 'M-ColouringProblem', 'm Coloring Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking over vertices',
        idea: 'Try each colour 1..m for the current vertex if no neighbour already has it; recurse; backtrack.',
        time: 'O(mⱽ)',
        space: 'O(V)',
        code: `function canColor(n, adj, m) {
  const color = new Array(n).fill(0);
  const ok = (u, c) => adj[u].every((v) => color[v] !== c);
  const bt = (u) => {
    if (u === n) return true;
    for (let c = 1; c <= m; c++) {
      if (ok(u, c)) { color[u] = c; if (bt(u + 1)) return true; color[u] = 0; }
    }
    return false;
  };
  return bt(0);
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Travelling Salesman Problem (exact)',
    also: ['Travelling Salesman Problem'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Bitmask DP (Held–Karp)',
        idea: 'dp[mask][i] = shortest path that visits exactly the set `mask` and ends at city i. Extend to an unvisited city j.',
        time: 'O(2ⁿ · n²)',
        space: 'O(2ⁿ · n)',
        code: `function tsp(dist) {
  const n = dist.length, FULL = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  dp[1][0] = 0;
  for (let mask = 1; mask <= FULL; mask++)
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i)) || dp[mask][i] === Infinity) continue;
      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue;
        const nm = mask | (1 << j);
        dp[nm][j] = Math.min(dp[nm][j], dp[mask][i] + dist[i][j]);
      }
    }
  let best = Infinity;
  for (let i = 1; i < n; i++) best = Math.min(best, dp[FULL][i] + dist[i][0]);
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Making wired connections / redundant connection (components)',
    also: ['Making wired Connections'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Union-Find — extra cables vs components to join',
        idea: 'Each edge that connects two already-connected nodes is a spare cable. You can connect c components if you have ≥ c−1 spare cables.',
        time: 'O(E α(V))',
        space: 'O(V)',
        code: `function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let components = n;
  for (const [a, b] of connections) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; components--; }
  }
  return components - 1; // moves needed to link all components
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Journey to the Moon (count invalid pairs)',
    also: ['Journey to the Moon'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Union-Find component sizes, complement counting',
        idea: 'Same-country astronauts are one component. Valid pairs = total pairs − Σ (sizeᵢ choose 2).',
        time: 'O(N + P)',
        space: 'O(N)',
        code: `function journeyToMoon(n, pairs) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of pairs) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; size[rb] += size[ra]; }
  }
  let sumC2 = 0, done = new Set();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (done.has(r)) continue;
    done.add(r);
    sumC2 += (size[r] * (size[r] - 1)) / 2;
  }
  return (n * (n - 1)) / 2 - sumC2;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Cheapest flights within K stops',
    also: ['Cheapest Flights Within K Stops'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Bellman–Ford limited to K+1 relaxations',
        idea: 'Relax all edges K+1 times, but each round must read from the previous round’s distances (snapshot) so a path never uses more than K stops.',
        time: 'O(K · E)',
        space: 'O(V)',
        code: `function findCheapestPrice(n, flights, src, dst, K) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i <= K; i++) {
    const snap = dist.slice();
    for (const [u, v, w] of flights)
      if (snap[u] + w < dist[v]) dist[v] = snap[u] + w;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Water jug problem (reach a target amount)',
    also: ['Water Jug problem using BFS'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'BFS over (jug1, jug2) states',
        idea: 'Each state is the pair of current amounts; transitions are fill/empty/pour for either jug. BFS finds the fewest steps to any state containing the target.',
        time: 'O(cap1 · cap2)',
        space: 'O(cap1 · cap2)',
        code: `function waterJug(cap1, cap2, target) {
  const seen = new Set(['0,0']);
  let q = [[0, 0, 0]];
  while (q.length) {
    const next = [];
    for (const [a, b, d] of q) {
      if (a === target || b === target || a + b === target) return d;
      const moves = [
        [cap1, b], [a, cap2], [0, b], [a, 0],
        [Math.min(a + b, cap1), b - (Math.min(a + b, cap1) - a)],
        [a - (Math.min(a + b, cap2) - b), Math.min(a + b, cap2)],
      ];
      for (const [na, nb] of moves) {
        const key = na + ',' + nb;
        if (!seen.has(key)) { seen.add(key); next.push([na, nb, d + 1]); }
      }
    }
    q = next;
  }
  return -1;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Minimum edges to reverse to make a path from source to destination',
    also: ['Minimum edges to reverse o make path from source to destination', 'Find if there is a path of more thank length from a source'],
    difficulty: 'Medium',
    approaches: [
      {
        name: '0-1 BFS on a doubled graph',
        idea: 'Keep every original edge with weight 0 and add its reverse with weight 1. The shortest path (0-1 BFS with a deque) from src to dst is the minimum reversals.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function minReversals(n, edges, src, dst) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push([v, 0]); adj[v].push([u, 1]); }
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const dq = [src];
  while (dq.length) {
    const u = dq.shift();
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        w === 0 ? dq.unshift(v) : dq.push(v);
      }
    }
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
        note: '"Path of length > k from a source" (sum of edge weights, no revisits) is NP-hard in general — solved by backtracking / DFS with a visited set for small graphs.',
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Count triangles in a graph',
    also: ['Number of Triangles in a Directed and Undirected Graph'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Trace of A³ / adjacency-matrix cubing',
        idea: 'The number of closed walks of length 3 is trace(A³). Divide by 6 for an undirected graph, by 3 for a directed one.',
        time: 'O(V³)',
        space: 'O(V²)',
        code: `function countTriangles(A, directed = false) {
  const n = A.length;
  const mul = (X, Y) => {
    const Z = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let k = 0; k < n; k++)
        if (X[i][k]) for (let j = 0; j < n; j++) Z[i][j] += X[i][k] * Y[k][j];
    return Z;
  };
  const A3 = mul(mul(A, A), A);
  let trace = 0;
  for (let i = 0; i < n; i++) trace += A3[i][i];
  return trace / (directed ? 3 : 6);
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Minimise cash flow among friends',
    also: ['Minimise the cashflow among a given set of friends who have borrowed money from each other', 'Minimize Cash Flow among a given set of friends who have borrowed money from each other'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Net balance per person, greedily settle max creditor with max debtor',
        idea: 'Compute each person’s net (received − paid). Repeatedly pick the biggest positive and biggest negative balance; settle min(|a|, |b|); repeat until all are zero.',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function minCashFlow(graph) { // graph[i][j] = amount i owes j
  const n = graph.length;
  const net = new Array(n).fill(0);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) { net[i] += graph[j][i]; net[i] -= graph[i][j]; }
  const txns = [];
  const settle = () => {
    let mxCredit = net.indexOf(Math.max(...net));
    let mxDebit = net.indexOf(Math.min(...net));
    if (net[mxCredit] === 0 && net[mxDebit] === 0) return;
    const amt = Math.min(-net[mxDebit], net[mxCredit]);
    net[mxCredit] -= amt; net[mxDebit] += amt;
    txns.push([mxDebit, mxCredit, amt]);
    settle();
  };
  settle();
  return txns;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Euler path / circuit — Seven Bridges, Chinese Postman',
    also: ['Paths to travel each nodes using each edge(Seven Bridges)', 'Chinese Postman or Route Inspection'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Degree conditions + Hierholzer',
        idea: 'An undirected connected graph has an Euler circuit iff every vertex has even degree; an Euler path iff exactly 0 or 2 vertices have odd degree (the Seven Bridges graph has 4 odd, so no path). Hierholzer’s algorithm builds the trail in O(E). Chinese Postman: pair up odd-degree vertices with minimum-weight matching and duplicate those shortest paths, then take an Euler circuit.',
        time: 'O(E) for Hierholzer',
        space: 'O(E)',
        code: `function hierholzer(n, adj) { // adj[u] = multiset of neighbours; assumes an Euler circuit exists
  const stack = [0], circuit = [];
  const local = adj.map((l) => [...l]);
  while (stack.length) {
    const u = stack[stack.length - 1];
    if (local[u].length) {
      const v = local[u].pop();
      local[v].splice(local[v].indexOf(u), 1);
      stack.push(v);
    } else {
      circuit.push(stack.pop());
    }
  }
  return circuit.reverse();
}`,
      },
    ],
  },

  // ================================================================ BackTracking (rest)
  {
    topic: 'BackTracking',
    problem: 'Rat in a maze — print all paths',
    also: ['Rat in a maze Problem', 'Find shortest safe route in a path with landmines'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS with a visited mark, path string, undo on return',
        idea: 'From (0,0) try moves D,L,R,U (order defines lexical output); mark the cell, recurse, unmark. Record the path when you reach the target.',
        time: 'O(4^(R·C))',
        space: 'O(R·C)',
        code: `function ratMaze(grid) {
  const n = grid.length, res = [];
  const vis = Array.from({ length: n }, () => Array(n).fill(false));
  const dirs = [[1, 0, 'D'], [0, -1, 'L'], [0, 1, 'R'], [-1, 0, 'U']];
  const bt = (r, c, path) => {
    if (r === n - 1 && c === n - 1) { res.push(path); return; }
    for (const [dr, dc, ch] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !vis[nr][nc] && grid[nr][nc] === 1) {
        vis[nr][nc] = true;
        bt(nr, nc, path + ch);
        vis[nr][nc] = false;
      }
    }
  };
  if (grid[0][0] === 1) { vis[0][0] = true; bt(0, 0, ''); }
  return res;
}`,
        note: 'Shortest safe route with landmines: mark every cell adjacent to a mine as unsafe first, then either backtrack tracking the best length, or BFS for the true shortest.',
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'N-Queens — all solutions',
    also: ['Printing all solutions in N-Queen Problem'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Row-by-row with column & diagonal sets',
        idea: 'Place one queen per row. A column is free if it is not in `cols`, and diagonals are tracked by r−c and r+c. Recurse, backtrack.',
        time: 'O(N!)',
        space: 'O(N)',
        code: `function solveNQueens(n) {
  const res = [], pos = [];
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const bt = (r) => {
    if (r === n) { res.push(pos.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1))); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); pos.push(c);
      bt(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); pos.pop();
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
    problem: 'Sudoku solver',
    also: ['Sudoku Solver'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Fill the first empty cell, try 1–9, recurse',
        idea: 'For each empty cell try every digit that is valid in its row, column and 3×3 box; recurse; undo if the branch fails.',
        time: 'exponential (fast in practice)',
        space: 'O(1)',
        code: `function solveSudoku(board) {
  const valid = (r, c, ch) => {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false;
      const br = 3 * ((r / 3) | 0) + ((i / 3) | 0);
      const bc = 3 * ((c / 3) | 0) + (i % 3);
      if (board[br][bc] === ch) return false;
    }
    return true;
  };
  const bt = () => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== '.') continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (valid(r, c, ch)) {
            board[r][c] = ch;
            if (bt()) return true;
            board[r][c] = '.';
          }
        }
        return false;
      }
    return true;
  };
  bt();
  return board;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Remove minimum invalid parentheses',
    also: ['Remove Invalid Parentheses'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'BFS by removal count',
        idea: 'Level 0 = the original string; each level removes one character. Return all valid strings from the first level that contains any — that is the minimum number of removals.',
        time: 'O(2ⁿ) worst',
        space: 'O(2ⁿ)',
        code: `function removeInvalidParentheses(s) {
  const isValid = (str) => {
    let bal = 0;
    for (const c of str) {
      if (c === '(') bal++;
      else if (c === ')' && --bal < 0) return false;
    }
    return bal === 0;
  };
  let level = new Set([s]);
  while (level.size) {
    const valid = [...level].filter(isValid);
    if (valid.length) return valid;
    const next = new Set();
    for (const str of level)
      for (let i = 0; i < str.length; i++)
        if (str[i] === '(' || str[i] === ')') next.add(str.slice(0, i) + str.slice(i + 1));
    level = next;
  }
  return [''];
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Print all palindromic partitions of a string',
    also: ['Print all palindromic partitions of a string'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtrack over cut positions',
        idea: 'For each prefix that is a palindrome, add it to the current partition and recurse on the rest.',
        time: 'O(2ⁿ · n)',
        space: 'O(n)',
        code: `function partitionPalindromes(s) {
  const res = [], path = [];
  const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
  const bt = (start) => {
    if (start === s.length) { res.push([...path]); return; }
    for (let end = start; end < s.length; end++) {
      if (isPal(start, end)) {
        path.push(s.slice(start, end + 1));
        bt(end + 1);
        path.pop();
      }
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
    problem: 'Subset sum — does any subset add up to the target?',
    also: ['Subset Sum Problem', 'Partition of a set intoK subsets with equal sum', 'Tug of War'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Include / exclude with pruning',
        idea: 'At each index either take the number (if it fits) or skip it. Prune when the remaining sum cannot reach the target.',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        code: `function subsetSum(nums, target) {
  const bt = (i, remaining) => {
    if (remaining === 0) return true;
    if (i === nums.length || remaining < 0) return false;
    return bt(i + 1, remaining - nums[i]) || bt(i + 1, remaining);
  };
  return bt(0, target);
}`,
        note: 'Partition into k equal-sum subsets: check total % k === 0, then try to fill k buckets to total/k with backtracking (sort desc, skip duplicate bucket states). Tug of War: split into two halves of size n/2 minimising the sum difference.',
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: "The Knight's tour",
    also: ["The Knight’s tour problem"],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'DFS numbering squares; backtrack on dead ends',
        idea: 'From the current square, try all 8 knight moves to an unvisited in-bounds square; mark it with the move number; recurse; unmark on failure.',
        time: 'exponential (Warnsdorff heuristic makes it fast)',
        space: 'O(N²)',
        code: `function knightTour(N) {
  const board = Array.from({ length: N }, () => Array(N).fill(-1));
  const moves = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
  board[0][0] = 0;
  const bt = (r, c, step) => {
    if (step === N * N) return true;
    for (const [dr, dc] of moves) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < N && nc < N && board[nr][nc] === -1) {
        board[nr][nc] = step;
        if (bt(nr, nc, step + 1)) return true;
        board[nr][nc] = -1;
      }
    }
    return false;
  };
  return bt(0, 0, 1) ? board : null;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Combination Sum',
    also: ['Combinational Sum'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backttrack, allowing reuse (recurse on the same index)',
        idea: 'From `start`, try each candidate; subtract it from the target and recurse on `i` (reuse allowed) or `i+1` (no reuse). Sort to prune once a candidate exceeds the remaining target.',
        time: 'O(2^target)',
        space: 'O(target / min)',
        code: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start, remaining) => {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length && candidates[i] <= remaining; i++) {
      path.push(candidates[i]);
      bt(i, remaining - candidates[i]); // i (not i+1) ⇒ reuse allowed
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
    problem: 'Maximum number by doing at most K swaps',
    also: ['Find Maximum number possible by doing at-most K swaps'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Backtracking — at each position bring the largest reachable digit forward',
        idea: 'For each position, find the max digit to its right; try swapping it in (spending a swap) and recurse. Track the best string seen. Only swap when it actually increases the number.',
        time: 'O(n^k) worst',
        space: 'O(n)',
        code: `function maxNumberKSwaps(numStr, k) {
  const digits = [...numStr];
  let best = numStr;
  const bt = (idx, swaps) => {
    if (swaps === 0 || idx === digits.length) return;
    const maxDigit = Math.max(...digits.slice(idx).map(Number));
    for (let j = digits.length - 1; j > idx; j--) {
      if (Number(digits[j]) === maxDigit && digits[j] !== digits[idx]) {
        [digits[idx], digits[j]] = [digits[j], digits[idx]];
        const cur = digits.join('');
        if (cur > best) best = cur;
        bt(idx + 1, swaps - 1);
        [digits[idx], digits[j]] = [digits[j], digits[idx]];
      }
    }
    bt(idx + 1, swaps); // also allow not swapping at this position
  };
  bt(0, k);
  return best;
}`,
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Longest route in a matrix with hurdles / all paths top-left to bottom-right',
    also: ['Longest Possible Route in a Matrix with Hurdles', 'Print all possible paths from top left to bottom right of a mXn matrix'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'DFS with a visited grid, maximise / collect on reaching the target',
        idea: 'From each cell recurse into the 4 open, unvisited, in-bounds neighbours; mark on entry, unmark on exit. Track the longest length (or push the path) when you hit the destination.',
        time: 'O(4^(R·C))',
        space: 'O(R·C)',
        code: `function longestRoute(grid, sr, sc, dr, dc) {
  const R = grid.length, C = grid[0].length;
  const vis = Array.from({ length: R }, () => Array(C).fill(false));
  let best = -1;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const dfs = (r, c, len) => {
    if (r === dr && c === dc) { best = Math.max(best, len); return; }
    for (const [ddr, ddc] of dirs) {
      const nr = r + ddr, nc = c + ddc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 1 && !vis[nr][nc]) {
        vis[nr][nc] = true;
        dfs(nr, nc, len + 1);
        vis[nr][nc] = false;
      }
    }
  };
  vis[sr][sc] = true;
  dfs(sr, sc, 0);
  return best;
}`,
        note: 'All paths (only moving right/down) is simpler: recurse pushing "R"/"D" until you reach (m−1, n−1).',
      },
    ],
  },
  {
    topic: 'BackTracking',
    problem: 'Kth permutation sequence of 1..N',
    also: ['Find the K-th Permutation Sequence of first N natural numbers'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Factorial number system (no enumeration)',
        idea: 'The first digit is determined by k / (n−1)!; remove it, take k mod (n−1)!, repeat. O(n²) without generating permutations.',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function getPermutation(n, k) {
  const fact = [1];
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  const digits = Array.from({ length: n }, (_, i) => i + 1);
  k--; // 0-indexed
  let res = '';
  for (let i = n; i >= 1; i--) {
    const idx = Math.floor(k / fact[i - 1]);
    res += digits[idx];
    digits.splice(idx, 1);
    k %= fact[i - 1];
  }
  return res;
}`,
      },
    ],
  },

  // ================================================================ Greedy
  {
    topic: 'Greedy',
    problem: 'Activity selection / N meetings in one room / maximum trains',
    also: [
      'Activity Selection Problem',
      'Find maximum meetings in one room',
      'Maximum trains for which stoppage can be provided',
    ],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort by finish time, greedily take non-overlapping',
        idea: 'Always pick the activity that finishes earliest and does not clash with the last chosen one — it leaves the most room for the rest.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function maxActivities(activities) { // [start, end]
  activities.sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of activities) {
    if (s >= lastEnd) { count++; lastEnd = e; }
  }
  return count;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Job sequencing with deadlines (maximise profit)',
    also: ['Job SequencingProblem', 'Weighted Job Scheduling'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort by profit desc, place each job in the latest free slot ≤ its deadline',
        idea: 'High-profit jobs first; give each the last available day before its deadline (a DSU of "next free slot" makes slot-finding near O(1)).',
        time: 'O(n log n + n·maxDeadline)',
        space: 'O(maxDeadline)',
        code: `function jobSequencing(jobs) { // {id, deadline, profit}
  jobs.sort((a, b) => b.profit - a.profit);
  const maxD = Math.max(...jobs.map((j) => j.deadline));
  const slot = new Array(maxD + 1).fill(null);
  let profit = 0, count = 0;
  for (const j of jobs) {
    for (let d = j.deadline; d >= 1; d--) {
      if (!slot[d]) { slot[d] = j.id; profit += j.profit; count++; break; }
    }
  }
  return { count, profit };
}`,
        note: 'Weighted Job Scheduling where jobs may overlap and you want max total profit is DP: sort by end time, dp[i] = max(dp[i-1], profit[i] + dp[last non-conflicting]).',
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Huffman coding',
    also: ['Huffman Coding'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Min-heap merge the two least-frequent nodes',
        idea: 'Repeatedly combine the two lowest-frequency subtrees into a parent whose frequency is their sum. The resulting tree gives prefix codes; left = 0, right = 1.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function huffman(freq) { // freq: { char: count }
  let heap = Object.entries(freq).map(([ch, f]) => ({ ch, f, left: null, right: null }));
  heap.sort((a, b) => a.f - b.f);
  while (heap.length > 1) {
    const a = heap.shift(), b = heap.shift();
    const node = { ch: null, f: a.f + b.f, left: a, right: b };
    let i = heap.findIndex((x) => x.f > node.f);
    i === -1 ? heap.push(node) : heap.splice(i, 0, node);
  }
  const codes = {};
  const walk = (n, code) => {
    if (!n) return;
    if (n.ch !== null) { codes[n.ch] = code || '0'; return; }
    walk(n.left, code + '0');
    walk(n.right, code + '1');
  };
  walk(heap[0], '');
  return codes;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Fractional knapsack',
    also: ['Fractional Knapsack Problem'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Sort by value/weight ratio, take greedily, split the last item',
        idea: 'Unlike 0/1 knapsack, you can take fractions, so always take from the item with the best value density.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function fractionalKnapsack(items, capacity) { // items: [value, weight]
  items.sort((a, b) => b[0] / b[1] - a[0] / a[1]);
  let total = 0;
  for (const [v, w] of items) {
    if (capacity >= w) { capacity -= w; total += v; }
    else { total += v * (capacity / w); break; }
  }
  return total;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Minimum number of coins / minimum cost of ropes / connect n ropes',
    also: ['Greedy Algorithm to find Minimum number of Coins', 'Minimum Cost of ropes'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Coins: take the largest denomination that fits, repeatedly',
        idea: 'For canonical coin systems (1, 2, 5, 10, …), greedily using the biggest coin ≤ the remaining amount is optimal. (For arbitrary systems use DP — see "Coin Change".)',
        time: 'O(amount / minCoin) or O(coins·log)',
        space: 'O(1)',
        code: `function minCoins(amount, coins = [1, 2, 5, 10, 20, 50, 100, 500, 2000]) {
  coins.sort((a, b) => b - a);
  const used = [];
  for (const c of coins) while (amount >= c) { amount -= c; used.push(c); }
  return used;
}`,
        note: 'Connect n ropes with minimum cost: min-heap, always join the two shortest ropes and add the combined length to the cost (Huffman-style) — see the Heap section.',
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Minimum number of platforms',
    also: ['Minimum Platforms Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort arrivals and departures separately, sweep',
        idea: 'Merge the two sorted time streams; +1 platform on an arrival, −1 on a departure. The running maximum is the answer.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function minPlatforms(arr, dep) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let platforms = 0, best = 0, i = 0, j = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) { platforms++; i++; best = Math.max(best, platforms); }
    else { platforms--; j++; }
  }
  return best;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Array-value greedy tricks — k negations, arr[i]*i, abs-diff sum, three-stack equal sum',
    also: [
      'Maximize array sum after K negations',
      'Maximize the sum of arr[i]*i',
      'Maximum sum of absolute difference of an array',
      'Maximize sum of consecutive differences in a circular array',
      'Find maximum sum possible equal sum of three stacks',
      'Maximum product subset of an array',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'K negations — flip the most negative each time',
        idea: 'Sort ascending; flip negatives left to right while k remains. If k is still odd afterwards, flip the current smallest absolute value once.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function maxSumAfterKNegations(a, k) {
  a.sort((x, y) => x - y);
  for (let i = 0; i < a.length && k > 0 && a[i] < 0; i++) { a[i] = -a[i]; k--; }
  if (k % 2 === 1) { const m = Math.min(...a); const idx = a.indexOf(m); a[idx] = -a[idx]; }
  return a.reduce((s, v) => s + v, 0);
}`,
      },
      {
        name: 'Maximise Σ arr[i]·i — sort ascending',
        idea: 'Larger values deserve larger indices, so sorting ascending maximises the weighted sum (rearrangement inequality).',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function maxSumIndexProduct(a) {
  a.sort((x, y) => x - y);
  return a.reduce((s, v, i) => s + v * i, 0);
}`,
        note: 'Max sum of |arr[i]−arr[i+1]| over an arrangement: sort, then interleave the small and large halves (zig-zag). Three stacks equal sum: prefix-sum each stack from the top, pop the largest total until all three match. Max product subset: multiply all non-zero elements; if the count of negatives is odd, divide out the largest (least-magnitude) negative.',
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Smallest number with N digits and digit sum S',
    also: ['Find smallest number with given number of digits and sum of digits'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Fill from the least-significant digit with 9s',
        idea: 'Reserve 1 for the leading digit (no leading zero), then put as much as possible (9s) into the rightmost positions; the leftover goes to the front.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function smallestNumber(digits, sum) {
  if (sum === 0) return digits === 1 ? '0' : '-1';
  if (sum > 9 * digits) return '-1';
  const res = new Array(digits).fill(0);
  sum -= 1; // reserve for the leading digit
  for (let i = digits - 1; i > 0; i--) {
    if (sum > 9) { res[i] = 9; sum -= 9; } else { res[i] = sum; sum = 0; }
  }
  res[0] = sum + 1;
  return res.join('');
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Minimum cost to cut a board / chocolate into pieces',
    also: ['Minimum Cost to cut a board into squares', 'CHOCOLA –Chocolate'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Sort all cut costs descending; a cut’s cost is multiplied by the current number of segments on the other axis',
        idea: 'Make expensive cuts first, while the perpendicular segment count is still low. Track how many horizontal and vertical pieces exist so far.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function minCutCost(horizontal, vertical) {
  horizontal.sort((a, b) => b - a);
  vertical.sort((a, b) => b - a);
  let hi = 0, vi = 0, hPieces = 1, vPieces = 1, cost = 0;
  while (hi < horizontal.length && vi < vertical.length) {
    if (horizontal[hi] >= vertical[vi]) { cost += horizontal[hi++] * vPieces; hPieces++; }
    else { cost += vertical[vi++] * hPieces; vPieces++; }
  }
  while (hi < horizontal.length) cost += horizontal[hi++] * vPieces;
  while (vi < vertical.length) cost += vertical[vi++] * hPieces;
  return cost;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Water connection problem',
    also: ['Water Connection Problem', 'Water Connection Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Follow each pipe chain from a house with no incoming pipe',
        idea: 'Build in/out maps. Every house with an outgoing but no incoming pipe is a tank source; walk the chain to its end (a house with no outgoing pipe), recording the minimum pipe diameter along the way.',
        time: 'O(n + p)',
        space: 'O(n)',
        code: `function waterConnection(n, pipes) { // pipes: [from, to, diameter]
  const out = new Map(), incoming = new Set();
  for (const [a, b, d] of pipes) { out.set(a, [b, d]); incoming.add(b); }
  const res = [];
  for (const [a] of out) {
    if (incoming.has(a)) continue;
    let cur = a, minD = Infinity;
    while (out.has(cur)) { const [nxt, d] = out.get(cur); minD = Math.min(minD, d); cur = nxt; }
    res.push([a, cur, minD]); // [tank house, tap house, max deliverable diameter]
  }
  return res;
}`,
      },
    ],
  },
  {
    topic: 'Greedy',
    problem: 'Other classic greedy — buy max stocks, candy cost, survive on island, wine trading, amplifiers, K centers, defense of a kingdom',
    also: [
      'Buy Maximum Stocks if i stocks can be bought on i-th day',
      'Find the minimum and maximum amount to buy all N candies',
      'Check if it is possible to survive on Island',
      'GERGOVIA -Wine trading in Gergovia',
      'ARRANGE -Arranging Amplifiers',
      'K Centers Problem',
      'DEFKIN -Defense of a Kingdom',
      'DIEHARD -DIE HARD',
      'Picking Up Chicks',
      'Smallest subset with sum greater than all other elements',
      'Minimum sum of absolute difference of pairs of two arrays',
      'Program for Shortest Job First (or SJF) CPU Scheduling',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Common patterns',
        idea: 'Buy max stocks: sort (price, day) ascending by price; on each day buy as many as the day index allows within budget. Candy cost (buy 1 free K): sort; min = sum of the cheapest ceil(n/(k+1)), max = sum of the most expensive ceil(n/(k+1)). Survive on island: feasible iff daily food ≤ what you can buy per allowed shopping day; then greedily buy the maximum on shopping days. Wine trading (Gergovia): scan the street carrying a running surplus/deficit; cost += |carry| each step. Arranging amplifiers: to maximise a tower of exponents, put the largest base at the bottom and sort the rest ascending (compare via logs). K centers: repeatedly place a center at the point farthest from all existing centers (2-approximation). Defense of a kingdom: the largest undefended rectangle = (max gap between adjacent tower columns) × (max gap between adjacent tower rows). Smallest subset with sum > rest: sort descending and take the largest elements until their sum exceeds half the total. Min sum of |a[i]−b[i]|: sort both arrays and pair them index-by-index. SJF: sort by burst time; average waiting time = running prefix of bursts.',
        time: 'mostly O(n log n)',
        space: 'O(n)',
        code: `// Wine trading in Gergovia — total transport cost
function gergovia(demands) { // + = wants to buy, - = wants to sell
  let carry = 0n, cost = 0n;
  for (const d of demands) {
    carry += BigInt(d);
    cost += carry < 0n ? -carry : carry;
  }
  return cost.toString();
}

// Smallest subset whose sum exceeds the rest
function smallestSubsetOverHalf(a) {
  a.sort((x, y) => y - x);
  const total = a.reduce((s, v) => s + v, 0);
  let acc = 0, k = 0;
  for (const v of a) { acc += v; k++; if (acc > total - acc) break; }
  return k;
}`,
      },
    ],
  },

  // ================================================================ Dynamic Programming (rest)
  {
    topic: 'Dynamic Programming',
    problem: 'Combinatorial DP — binomial coefficient, Catalan number, derangements, count balanced BSTs of height h',
    also: [
      'Binomial CoefficientProblem',
      'Permutation CoefficientProblem',
      'Program for nth Catalan Number',
      'Count Derangements (Permutation such that no element appears in its original position)',
      'Count Balanced Binary Trees of Height h',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: "Pascal's triangle / recurrences",
        idea: 'C(n,k) = C(n−1,k−1) + C(n−1,k). Catalan Cₙ = Σ Cᵢ·Cₙ₋₁₋ᵢ (or C(2n,n)/(n+1)). Derangements Dₙ = (n−1)(Dₙ₋₁ + Dₙ₋₂). Balanced BSTs of height h: count(h) = 2·count(h−1)·count(h−2) + count(h−1)².',
        time: 'O(n·k) / O(n²) / O(n)',
        space: 'O(n·k) / O(n)',
        code: `function binomial(n, k) {
  const dp = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1;
    for (let j = 1; j <= Math.min(i, k); j++) dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
  }
  return dp[n][k];
}
function catalan(n) {
  const c = new Array(n + 1).fill(0);
  c[0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 0; j < i; j++) c[i] += c[j] * c[i - 1 - j];
  return c[n];
}
function derangements(n) {
  if (n <= 1) return n === 0 ? 1 : 0;
  let a = 1, b = 0; // D0, D1
  for (let i = 2; i <= n; i++) [a, b] = [b, (i - 1) * (a + b)];
  return b;
}
function countBalancedBST(h, MOD = 1_000_000_007n) {
  let a = 1n, b = 1n; // count(0), count(1)
  if (h === 0 || h === 1) return 1;
  for (let i = 2; i <= h; i++) {
    const cur = (2n * a * b + b * b) % MOD;
    a = b; b = cur;
  }
  return Number(b);
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Matrix Chain Multiplication',
    also: ['Matrix Chain Multiplication'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Interval DP over split points',
        idea: 'dp[i][j] = min scalar multiplications to multiply matrices i..j. Try every split k: dp[i][k] + dp[k+1][j] + p[i-1]·p[k]·p[j].',
        time: 'O(n³)',
        space: 'O(n²)',
        code: `function matrixChainOrder(p) { // p has length n+1 for n matrices
  const n = p.length - 1;
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }
  return dp[1][n];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Fence / tiling recurrences — painting the fence, friends pairing, cut segments, keypad, coin game, score-ways, ways to reach a score',
    also: [
      'Painting the Fenceproblem',
      'Friends Pairing Problem',
      'Maximize The Cut Segments',
      'Mobile Numeric Keypad Problem',
      'Coin game winner where every player has three choices',
      'Count number of ways to reacha given score in a game',
      'Minimum cost to fill given weight in a bag',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Linear recurrences',
        idea: 'Painting the fence (k colours, no 3 adjacent same): total(i) = (same(i) + diff(i)); same(i) = diff(i−1); diff(i) = (total(i−1))·(k−1). Friends pairing: f(n) = f(n−1) + (n−1)·f(n−2). Cut segments (max pieces of size a/b/c from n): dp[i] = 1 + max(dp[i−a], dp[i−b], dp[i−c]). Ways to reach score with moves {3,5,10}: unbounded-coin-change count.',
        time: 'O(n)',
        space: 'O(1)–O(n)',
        code: `function paintFence(n, k) {
  if (n === 0) return 0;
  if (n === 1) return k;
  let same = k, diff = k * (k - 1);
  for (let i = 3; i <= n; i++) {
    const prevDiff = diff;
    diff = (same + diff) * (k - 1);
    same = prevDiff;
  }
  return same + diff;
}
function friendsPairing(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, b + (i - 1) * a];
  return b;
}
function maxCutSegments(n, a, b, c) {
  const dp = new Array(n + 1).fill(-Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++)
    for (const seg of [a, b, c])
      if (i >= seg && dp[i - seg] !== -Infinity) dp[i] = Math.max(dp[i], dp[i - seg] + 1);
  return dp[n] < 0 ? 0 : dp[n];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Grid path DP — Gold Mine, Min Cost Path, max square submatrix of 1s, maximum sum rectangle',
    also: [
      'Gold Mine Problem',
      'Min Cost PathProblem',
      'Maximum size square sub-matrix with all 1s',
      'Maximum sum rectangle in a 2D matrix',
      'Largest rectangular sub-matrix whose sum is 0',
      'Largest area rectangular sub-matrix with equal number of 1’s and 0’s',
      'Assembly Line SchedulingProblem',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Gold mine — DP right-to-left over columns',
        idea: 'From a cell you move right / right-up / right-down. dp[r][c] = grid[r][c] + max of the three reachable cells in column c+1.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function goldMine(grid) {
  const R = grid.length, C = grid[0].length;
  const dp = grid.map((row) => row.slice());
  for (let c = C - 2; c >= 0; c--)
    for (let r = 0; r < R; r++) {
      const right = dp[r][c + 1];
      const up = r > 0 ? dp[r - 1][c + 1] : 0;
      const down = r < R - 1 ? dp[r + 1][c + 1] : 0;
      dp[r][c] = grid[r][c] + Math.max(right, up, down);
    }
  return Math.max(...dp.map((row) => row[0]));
}`,
      },
      {
        name: 'Maximum size square submatrix of 1s',
        idea: 'dp[r][c] = side of the largest all-1s square with its bottom-right corner at (r,c) = 1 + min(top, left, top-left) when grid[r][c] is 1.',
        time: 'O(R·C)',
        space: 'O(R·C)',
        code: `function maximalSquare(m) {
  const R = m.length, C = m[0].length;
  const dp = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  let best = 0;
  for (let r = 1; r <= R; r++)
    for (let c = 1; c <= C; c++)
      if (m[r - 1][c - 1] === 1) {
        dp[r][c] = 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
        best = Math.max(best, dp[r][c]);
      }
  return best * best;
}`,
      },
      {
        name: 'Maximum sum rectangle — Kadane over column ranges',
        idea: 'Fix the left and right column; compress each row between them into a single number (row sum); run 1-D Kadane on that array. O(C²·R).',
        time: 'O(C²·R)',
        space: 'O(R)',
        code: `function maxSumRectangle(mat) {
  const R = mat.length, C = mat[0].length;
  let best = -Infinity;
  for (let left = 0; left < C; left++) {
    const rowSum = new Array(R).fill(0);
    for (let right = left; right < C; right++) {
      for (let r = 0; r < R; r++) rowSum[r] += mat[r][right];
      let cur = 0, localBest = -Infinity;
      for (const x of rowSum) { cur = Math.max(x, cur + x); localBest = Math.max(localBest, cur); }
      best = Math.max(best, localBest);
    }
  }
  return best;
}`,
        note: 'Largest submatrix with sum 0 / equal 0s and 1s: same column-pair trick, but instead of Kadane use a prefix-sum→first-index hashmap on the compressed rows to find the widest zero-sum band (map 0→−1 for the 0s/1s version).',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Subsequence DP — max sum increasing, longest with adjacent diff one, no three consecutive, alternating, product < K, chain of pairs',
    also: [
      'Maximum Sum Increasing Subsequence',
      'Longest subsequence such that difference between adjacent is one',
      'Maximum subsequence sum such that no three are consecutive',
      'Longest alternating subsequence',
      'Count all subsequences having product less than K',
      'Maximum Length Chain of Pairs',
      'Maximum Length of Pair Chain',
      'Maximum sum of pairs with specific difference',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Max Sum Increasing Subsequence',
        idea: 'Like LIS but dp[i] carries the maximum SUM ending at i: dp[i] = a[i] + max(dp[j]) for j<i with a[j]<a[i].',
        time: 'O(n²)',
        space: 'O(n)',
        code: `function maxSumIS(a) {
  const dp = a.slice();
  let best = dp[0] ?? 0;
  for (let i = 1; i < a.length; i++) {
    for (let j = 0; j < i; j++) if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + a[i]);
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
      },
      {
        name: 'No three consecutive — pick-skip DP',
        idea: 'dp[i] = max(dp[i−1], dp[i−2] + a[i], dp[i−3] + a[i−1] + a[i]) — you may take one or two of any three in a row, never three.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxSumNoThreeConsecutive(a) {
  const n = a.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(0);
  dp[0] = a[0];
  dp[1] = n > 1 ? a[0] + a[1] : dp[0];
  for (let i = 2; i < n; i++)
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + a[i], (i >= 3 ? dp[i - 3] : 0) + a[i - 1] + a[i]);
  return dp[n - 1];
}`,
      },
      {
        name: 'Longest alternating subsequence & chain of pairs',
        idea: 'Alternating: track two lengths — one ending on an "up" step, one on a "down" step. Chain of pairs: sort by second element, greedily extend when the next pair’s first exceeds the last chosen second (activity-selection style).',
        time: 'O(n) / O(n log n)',
        space: 'O(1)',
        code: `function longestAlternating(a) {
  let up = 1, down = 1;
  for (let i = 1; i < a.length; i++) {
    if (a[i] > a[i - 1]) up = down + 1;
    else if (a[i] < a[i - 1]) down = up + 1;
  }
  return Math.max(up, down);
}
function maxChainOfPairs(pairs) {
  pairs.sort((x, y) => x[1] - y[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [a, b] of pairs) if (a > lastEnd) { count++; lastEnd = b; }
  return count;
}`,
        note: 'Longest subsequence with adjacent difference one: dp keyed by value — dp[v] = 1 + max(dp[v−1], dp[v+1]) as you scan. Count subsequences with product < K: 2-D DP dp[i][p] over items and product thresholds. Max sum of pairs with difference exactly D: sort, two pointers, greedily pair.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'String DP — longest common substring, LCS of three strings, space-optimised LCS, interleaving, boolean parenthesization',
    also: [
      'Longest Common Substring',
      'LCS (Longest Common Subsequence) of three strings',
      'Space Optimized Solution of LCS',
      'Find if a string is interleaved of two other strings',
      'Boolean Parenthesization Problem',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Longest common SUBSTRING (contiguous)',
        idea: 'dp[i][j] = length of the common suffix of a[..i] and b[..j] = dp[i−1][j−1] + 1 when chars match, else 0. Answer is the max cell.',
        time: 'O(n·m)',
        space: 'O(m) with a rolling row',
        code: `function longestCommonSubstring(a, b) {
  const m = b.length;
  let prev = new Array(m + 1).fill(0), best = 0;
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(m + 1).fill(0);
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) { cur[j] = prev[j - 1] + 1; best = Math.max(best, cur[j]); }
    }
    prev = cur;
  }
  return best;
}`,
      },
      {
        name: 'Is C an interleaving of A and B?',
        idea: 'dp[i][j] = can A[..i] + B[..j] form C[..i+j]. dp[i][j] = (A[i−1]===C[i+j−1] && dp[i−1][j]) || (B[j−1]===C[i+j−1] && dp[i][j−1]).',
        time: 'O(n·m)',
        space: 'O(m)',
        code: `function isInterleave(a, b, c) {
  if (a.length + b.length !== c.length) return false;
  const dp = new Array(b.length + 1).fill(false);
  for (let i = 0; i <= a.length; i++)
    for (let j = 0; j <= b.length; j++) {
      if (i === 0 && j === 0) dp[j] = true;
      else {
        const fromA = i > 0 && a[i - 1] === c[i + j - 1] && dp[j];
        const fromB = j > 0 && b[j - 1] === c[i + j - 1] && dp[j - 1];
        dp[j] = fromA || fromB;
      }
    }
  return dp[b.length];
}`,
        note: 'LCS of 3 strings: a 3-D dp[i][j][k]. Space-optimised LCS: keep only the previous row (two 1-D arrays). Boolean parenthesization: interval DP counting the ways an expression of T/F with & | ^ evaluates to true — track (trueCount, falseCount) per interval and combine at each operator.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Knapsack family — 0/1 partition, unbounded, min cost to fill a bag, min removals for range',
    also: [
      'Partition problem',
      'Unbounded Knapsack (Repetition of items allowed)',
      'Maximize The Cut Segments',
      'Minimum removals from array to make max –min <= K',
    ],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Partition problem (equal-subset-sum) — boolean subset-sum on total/2',
        idea: 'If the total is odd, impossible. Otherwise ask "is there a subset summing to total/2?" with the 1-D subset-sum DP.',
        time: 'O(n·sum)',
        space: 'O(sum)',
        code: `function canPartition(nums) {
  const total = nums.reduce((s, v) => s + v, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums)
    for (let s = target; s >= num; s--) dp[s] = dp[s] || dp[s - num];
  return dp[target];
}`,
      },
      {
        name: 'Unbounded knapsack',
        idea: 'Same table as 0/1 but iterate the weight axis ASCENDING so an item can be reused. dp[w] = max(dp[w], dp[w−weight] + value).',
        time: 'O(n·W)',
        space: 'O(W)',
        code: `function unboundedKnapsack(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let w = 1; w <= W; w++)
    for (let i = 0; i < weights.length; i++)
      if (weights[i] <= w) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}`,
        note: 'Min cost to fill weight W (costs may be −1 = unavailable): unbounded knapsack minimising cost. Min removals so max−min ≤ K: sort, then it becomes "keep the longest window with a[j]−a[i] ≤ K"; removals = n − that window length.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Egg dropping',
    also: ['Egg Dropping Problem'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'DP over (eggs, floors)',
        idea: 'dp[e][f] = min trials to be sure with e eggs and f floors. Drop from floor x: egg breaks → dp[e−1][x−1], survives → dp[e][f−x]; take the worst, minimise over x.',
        time: 'O(e·f²)',
        space: 'O(e·f)',
        code: `function eggDrop(eggs, floors) {
  const dp = Array.from({ length: eggs + 1 }, () => new Array(floors + 1).fill(0));
  for (let f = 1; f <= floors; f++) dp[1][f] = f;
  for (let e = 2; e <= eggs; e++)
    for (let f = 1; f <= floors; f++) {
      dp[e][f] = Infinity;
      for (let x = 1; x <= f; x++)
        dp[e][f] = Math.min(dp[e][f], 1 + Math.max(dp[e - 1][x - 1], dp[e][f - x]));
    }
  return dp[eggs][floors];
}`,
        note: 'O(e·f) version: dp[e][trials] = max floors coverable; increase trials until dp[eggs][trials] ≥ floors.',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Game DP — optimal strategy for a game, coin game winner',
    also: ['Optimal Strategy for a Game', 'Coin game winner where every player has three choices'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Interval DP on (i, j) — you pick an end, opponent plays optimally',
        idea: 'dp[i][j] = max value the current player can guarantee from coins i..j = max( a[i] + min(dp[i+2][j], dp[i+1][j-1]), a[j] + min(dp[i+1][j-1], dp[i][j-2]) ).',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function optimalGame(a) {
  const n = a.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = a[i];
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const takeLeft = a[i] + Math.min(i + 2 <= j ? dp[i + 2][j] : 0, i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
      const takeRight = a[j] + Math.min(i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0, i <= j - 2 ? dp[i][j - 2] : 0);
      dp[i][j] = Math.max(takeLeft, takeRight);
    }
  return dp[0][n - 1];
}`,
        note: 'Coin game with a pile and moves {1, 2, 3}: player loses iff (n mod 4 === 0) for the classic Nim-like variant; in general compute win[i] = OR over moves of !win[i−move].',
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Optimal BST',
    also: ['Optimal Binary Search Tree'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Interval DP with prefix frequency sums',
        idea: 'dp[i][j] = min expected search cost for keys i..j. Try each key r as the root: dp[i][r−1] + dp[r+1][j] + (sum of freq i..j). Every subtree drops one level, so the whole range’s frequency sum is added once per split.',
        time: 'O(n³)',
        space: 'O(n²)',
        code: `function optimalBST(freq) {
  const n = freq.length;
  const prefix = [0];
  for (const f of freq) prefix.push(prefix[prefix.length - 1] + f);
  const rangeSum = (i, j) => prefix[j + 1] - prefix[i];
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = freq[i];
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let r = i; r <= j; r++) {
        const left = r > i ? dp[i][r - 1] : 0;
        const right = r < j ? dp[r + 1][j] : 0;
        dp[i][j] = Math.min(dp[i][j], left + right + rangeSum(i, j));
      }
    }
  return dp[0][n - 1];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Palindrome partitioning — minimum cuts',
    also: ['Palindrome PartitioningProblem'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Precompute isPalindrome, then 1-D cut DP',
        idea: 'pal[i][j] via interval DP. cuts[i] = min cuts for s[0..i]; if s[j..i] is a palindrome, cuts[i] = min(cuts[i], cuts[j−1] + 1), with cuts[−1] = −1.',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function minCut(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--)
    for (let j = i; j < n; j++)
      pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
  const cuts = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (pal[0][i]) { cuts[i] = 0; continue; }
    cuts[i] = i;
    for (let j = 1; j <= i; j++)
      if (pal[j][i]) cuts[i] = Math.min(cuts[i], cuts[j - 1] + 1);
  }
  return cuts[n - 1];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Largest Independent Set in a tree',
    also: ['Largest Independent Set Problem'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Tree DP — include vs exclude each node',
        idea: 'inc(node) = 1 + Σ exc(child); exc(node) = Σ max(inc(child), exc(child)). Answer = max(inc(root), exc(root)).',
        time: 'O(n)',
        space: 'O(h)',
        code: `function largestIndependentSet(node) {
  if (!node) return { inc: 0, exc: 0 };
  const L = largestIndependentSet(node.left);
  const R = largestIndependentSet(node.right);
  return {
    inc: 1 + L.exc + R.exc,
    exc: Math.max(L.inc, L.exc) + Math.max(R.inc, R.exc),
  };
}
// answer: const r = largestIndependentSet(root); return Math.max(r.inc, r.exc);`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Best time to buy and sell a stock at most K times',
    also: ['Maximum profit by buying and selling a share at most k times'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'DP over (transactions, day), O(k·n)',
        idea: 'dp[t][d] = max profit using ≤ t transactions up to day d = max(dp[t][d−1], price[d] + best) where best = max over m<d of (dp[t−1][m] − price[m]) — maintained incrementally.',
        time: 'O(k·n)',
        space: 'O(n)',
        code: `function maxProfitK(k, prices) {
  const n = prices.length;
  if (!n) return 0;
  if (k >= n / 2) { // unlimited transactions
    let profit = 0;
    for (let i = 1; i < n; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    return profit;
  }
  const dp = Array.from({ length: k + 1 }, () => new Array(n).fill(0));
  for (let t = 1; t <= k; t++) {
    let best = -prices[0];
    for (let d = 1; d < n; d++) {
      dp[t][d] = Math.max(dp[t][d - 1], prices[d] + best);
      best = Math.max(best, dp[t - 1][d] - prices[d]);
    }
  }
  return dp[k][n - 1];
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Smallest sum contiguous subarray / max difference of zeros and ones in a binary string',
    also: ['Smallest sum contiguous subarray', 'Maximum difference of zeros and ones in binary string'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Kadane, minimising (or on a transformed array)',
        idea: 'Smallest sum: run Kadane keeping the minimum running sum. Max (#0 − #1) over any substring: map 0→+1, 1→−1 and run standard maximum-subarray Kadane.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function smallestSubarraySum(a) {
  let cur = a[0], best = a[0];
  for (let i = 1; i < a.length; i++) {
    cur = Math.min(a[i], cur + a[i]);
    best = Math.min(best, cur);
  }
  return best;
}
function maxZeroMinusOne(bits) {
  let cur = 0, best = 0, any = false;
  for (const ch of bits) {
    any = true;
    cur = Math.max(ch === '0' ? 1 : -1, cur + (ch === '0' ? 1 : -1));
    best = Math.max(best, cur);
  }
  return any ? Math.max(best, -1) : 0; // -1 if the string is all 1s
}`,
      },
    ],
  },
  {
    topic: 'Dynamic Programming',
    problem: 'Longest Palindromic Subsequence',
    also: ['Longest Palindromic Subsequence'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'LCS of the string and its reverse',
        idea: 'The longest subsequence that reads the same forwards and backwards is exactly the LCS of s and reverse(s).',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `function longestPalindromeSubseq(s) {
  const r = [...s].reverse().join('');
  const n = s.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = s[i - 1] === r[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[n][n];
}`,
        note: 'Direct interval DP also works: dp[i][j] = 2 + dp[i+1][j-1] if s[i]===s[j], else max(dp[i+1][j], dp[i][j-1]).',
      },
    ],
  },
  {
    topic: 'Binary Trees',
    problem: 'Check if all levels of two trees are anagrams',
    also: ['Check if all levels of two trees are anagrams or not'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Level-order both trees, compare sorted level values',
        idea: 'BFS each tree level by level; two levels are anagrams iff their multisets of values match.',
        time: 'O(n log n)',
        space: 'O(width)',
        code: `function levelsAreAnagrams(a, b) {
  let qa = a ? [a] : [], qb = b ? [b] : [];
  while (qa.length && qb.length) {
    if (qa.length !== qb.length) return false;
    const va = qa.map((n) => n.val).sort((x, y) => x - y);
    const vb = qb.map((n) => n.val).sort((x, y) => x - y);
    if (va.join(',') !== vb.join(',')) return false;
    const na = [], nb = [];
    for (const n of qa) { if (n.left) na.push(n.left); if (n.right) na.push(n.right); }
    for (const n of qb) { if (n.left) nb.push(n.left); if (n.right) nb.push(n.right); }
    qa = na; qb = nb;
  }
  return qa.length === 0 && qb.length === 0;
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Vertex Cover Problem',
    also: ['Vertex Cover Problem'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Tree DP (exact) / 2-approximation (general graph)',
        idea: 'On a tree: dp[node][0/1] = min cover of the subtree when node is / is not in the cover; if a node is excluded, all children must be included. General graph: pick any uncovered edge, add BOTH endpoints to the cover — this is a 2-approximation (exact vertex cover is NP-hard).',
        time: 'O(n) tree / O(E) approx',
        space: 'O(n)',
        code: `function vertexCoverTree(node) {
  if (!node) return [0, 0]; // [notInCover, inCover]
  const L = vertexCoverTree(node.left);
  const R = vertexCoverTree(node.right);
  const notIn = L[1] + R[1];                        // children must be covered
  const inCover = 1 + Math.min(L[0], L[1]) + Math.min(R[0], R[1]);
  return [notIn, inCover];
}
// answer: Math.min(...vertexCoverTree(root))

function approxVertexCover(n, edges) {
  const used = new Set();
  const covered = new Set();
  for (const [u, v] of edges) {
    if (covered.has(u) || covered.has(v)) continue;
    used.add(u); used.add(v);
    covered.add(u); covered.add(v);
  }
  return [...used];
}`,
      },
    ],
  },
  {
    topic: 'Graph',
    problem: 'Oliver and the Game (ancestor check on a rooted tree)',
    also: ['Oliver and the Game', 'Oliver and the Game'],
    difficulty: 'Medium',
    approaches: [
      {
        name: 'Euler tour in/out times',
        idea: 'DFS from the king’s node recording in[v] and out[v]. u is an ancestor of v iff in[u] ≤ in[v] and out[v] ≤ out[u]. Each query (who moves toward/away from the king) is then O(1).',
        time: 'O(n + q)',
        space: 'O(n)',
        code: `function eulerTour(n, adj, root = 1) {
  const tin = new Array(n + 1).fill(0), tout = new Array(n + 1).fill(0);
  let timer = 0;
  const dfs = (u, parent) => {
    tin[u] = ++timer;
    for (const v of adj[u]) if (v !== parent) dfs(v, u);
    tout[u] = ++timer;
  };
  dfs(root, 0);
  const isAncestor = (u, v) => tin[u] <= tin[v] && tout[v] <= tout[u];
  return { isAncestor };
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Optimum location of a point to minimise total distance',
    also: ['Optimum location of point to minimize total distance'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Ternary search on the line (convex objective)',
        idea: 'The sum of Euclidean distances from a point on a given line to fixed points is a convex function of the position along the line, so ternary-search the parameter.',
        time: 'O(n · log(1/ε))',
        space: 'O(1)',
        code: `function optimumLocation(points, line) { // line: [a, b, c] for ax + by + c = 0
  const [a, b, c] = line;
  const pointAt = (t) => {
    // parametrise the line; here assume b !== 0: x = t, y = -(a*t + c)/b
    return [t, -(a * t + c) / b];
  };
  const cost = (t) => {
    const [x, y] = pointAt(t);
    return points.reduce((s, [px, py]) => s + Math.hypot(px - x, py - y), 0);
  };
  let lo = -1e6, hi = 1e6;
  for (let iter = 0; iter < 200; iter++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (cost(m1) < cost(m2)) hi = m2; else lo = m1;
  }
  return cost(lo);
}`,
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Rasta and Kheshtak (largest common square submatrix pattern)',
    also: ['Rasta and Kheshtak'],
    difficulty: 'Hard',
    approaches: [
      {
        name: 'Binary search on the square size + hashing',
        idea: 'Binary-search the side length k. For each candidate k, hash every k×k submatrix of both grids (2-D rolling hash / prefix hashing) and check for a common hash. Largest k with an intersection is the answer.',
        time: 'O(R·C·log(min(R,C)))',
        space: 'O(R·C)',
        code: `// sketch — 2D prefix hashing
function has_common_square(A, B, k) {
  const hashesA = new Set();
  const grab = (G, out) => {
    for (let r = 0; r + k <= G.length; r++)
      for (let c = 0; c + k <= G[0].length; c++) {
        let h = '';
        for (let i = 0; i < k; i++) h += G[r + i].slice(c, c + k).join(',') + ';';
        out.add(h);
      }
  };
  grab(A, hashesA);
  const hashesB = new Set();
  grab(B, hashesB);
  for (const h of hashesB) if (hashesA.has(h)) return true;
  return false;
}`,
        note: 'The string concatenation above is O(k²) per window; a real solution uses polynomial 2-D rolling hashes for O(1) per window.',
      },
    ],
  },
  {
    topic: 'Searching & Sorting',
    problem: 'Maximum sum such that no two elements are adjacent (House Robber)',
    also: ['maximum sum such that no 2 elements are adjacent', 'House Robber', 'Maximum sum such that no two are adjacent'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Pick / skip DP, O(1) space',
        idea: 'best[i] = max(best[i-1], best[i-2] + a[i]) — either skip element i or take it and add the best up to i-2.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxNonAdjacentSum(a) {
  let incl = 0, excl = 0;
  for (const x of a) {
    const newExcl = Math.max(incl, excl);
    incl = excl + x;
    excl = newExcl;
  }
  return Math.max(incl, excl);
}`,
      },
    ],
  },
  {
    topic: 'LinkedList',
    problem: 'Deletion from a circular linked list',
    also: ['Deletion from a Circular Linked List'],
    difficulty: 'Easy',
    approaches: [
      {
        name: 'Find the node, relink its predecessor',
        idea: 'Walk from head until the next node holds the target value; point current.next past it. If the deleted node is the head, update head (and the last node\'s next). Handle the single-node case.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function deleteFromCircular(head, key) {
  if (!head) return null;
  if (head.val === key && head.next === head) return null;   // only node
  let last = head;
  while (last.next !== head) last = last.next;               // node before head
  if (head.val === key) { last.next = head.next; return head.next; }
  let cur = head;
  while (cur.next !== head && cur.next.val !== key) cur = cur.next;
  if (cur.next.val === key) cur.next = cur.next.next;
  return head;
}`,
      },
    ],
  },
];
