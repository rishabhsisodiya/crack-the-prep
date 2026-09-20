---
title: "Algorithms & Big-O"
part: "DSA"
track: "dsa"
kind: "notes"
updated: "2026-09-06"
source: "JavaScript Notes.docx"
draft: false
order: 1
slug: "algorithms"
description: "Big-O notation, search and sorting algorithms, recursion, and classic algorithm problems."
---

## What is an algorithm?

An algorithm is a set of well-defined instructions to solve a particular problem. We judge one on two axes:

- **Time complexity** — how the running time grows as the input grows.
- **Space complexity** — how the extra memory grows as the input grows.

Both are expressed with **asymptotic notation**, which ignores constant factors and lower-order terms and focuses on the growth rate for large `n`.

### Asymptotic notations

| Notation | Bound | Describes |
| --- | --- | --- |
| **Big-O** — `O(f(n))` | Upper bound | Worst case: the algorithm is *no slower* than this |
| **Omega** — `Ω(f(n))` | Lower bound | Best case: the algorithm is *no faster* than this |
| **Theta** — `Θ(f(n))` | Tight bound | Both bounds match — growth is exactly this order |

**Example:** if `f(n) = 5n² + 3n + 2`, then `f(n)` is `O(n²)` — lower-order terms (`3n`, `2`) and the constant factor (`5`) are dropped.

## Big-O notation

To find the Big-O of a piece of code, count how many times a statement runs as a function of the input size, then keep only the dominant term.

```js
// O(1) — constant: work does not depend on n
function first(arr) {
  return arr[0];
}

// O(n) — linear: one pass over the input
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
}

// O(n²) — quadratic: a loop inside a loop
function pairs(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) out.push([arr[i], arr[j]]);
  }
  return out;
}

// O(log n) — logarithmic: the problem halves each step
function countHalvings(n) {
  let steps = 0;
  while (n > 1) { n = Math.floor(n / 2); steps++; }
  return steps;
}
```

Common growth rates, slowest-growing first: `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`.

### Big-O of common Object operations

| Operation | Big-O |
| --- | --- |
| Access / insert / update / delete by key | O(1) |
| Check if a key exists (`in`, `hasOwnProperty`) | O(1) |
| Search for a value | O(n) |
| Iterate — `Object.keys` / `entries` / `values` | O(n) |

### Big-O of common Array operations

| Method | Big-O |
| --- | --- |
| `push` / `pop` (end) | O(1) amortized |
| `shift` / `unshift` (start) | O(n) — every element reindexes |
| `splice` | O(n) |
| `slice`, `concat`, `indexOf`, `includes`, `forEach`, `map`, `filter`, `reduce`, `find`, `reverse` | O(n) |
| `sort` | O(n log n) |

## Classic number problems

### Fibonacci series (iterative)

```js
function fibonacci(n) {
  const series = n === 0 ? [0] : [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

console.log(fibonacci(7)); // [0, 1, 1, 2, 3, 5, 8]
```

Time `O(n)` · Space `O(n)`.

### Factorial (iterative)

```js
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

console.log(factorial(5)); // 120
```

Time `O(n)` · Space `O(1)`.

### Prime check

```js
function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

console.log(isPrime(7)); // true
```

Looping to `n / 2` is `O(n)`. Stopping at `√n` is `O(√n)` — if `n` has a divisor larger than `√n`, it must also have one smaller than `√n`. Space `O(1)`.

### Power of two

```js
// Loop: divide by 2 until we reach 1
function isPowerOfTwoLoop(n) {
  if (n < 1) return false;
  while (n > 1) {
    if (n % 2 !== 0) return false;
    n /= 2;
  }
  return true;
}

// Bit trick: a power of two has exactly one set bit,
// so n & (n - 1) clears it and leaves 0
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(18)); // false
```

Loop version: Time `O(log n)`. Bit version: Time `O(1)`. Both Space `O(1)`.

## Recursion

Recursion is when a function calls itself. Every recursive solution needs a **base case** that stops the recursion and a **recursive case** that moves toward it.

### Fibonacci (recursive)

```js
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(7)); // 13
```

Time `O(2ⁿ)` — the call tree branches twice at every level and recomputes the same values. Space `O(n)` for the deepest call stack. Memoization brings this down to `O(n)` time.

### Factorial (recursive)

```js
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

Time `O(n)` · Space `O(n)` (call stack).

## Search algorithms

### Linear search

Walk the array from start to end; return the index when the target matches, or `-1` if the loop finishes.

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

console.log(linearSearch([5, 3, 8, 4, 2], 8)); // 2
```

Time `O(n)` · Space `O(1)`. Works on unsorted data.

### Binary search

Requires a **sorted** array. Look at the middle element: if it matches, done; if the target is smaller, discard the right half; if larger, discard the left half. Each step halves the search space.

```js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

console.log(binarySearch([2, 4, 6, 8, 10, 12], 8)); // 3
```

Time `O(log n)` · Space `O(1)`.

```js
// Recursive form — same logic, halves passed down as arguments
function recursiveBinarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return recursiveBinarySearch(arr, target, mid + 1, right);
  }
  return recursiveBinarySearch(arr, target, left, mid - 1);
}

console.log(recursiveBinarySearch([2, 4, 6, 8, 10, 12], 8)); // 3
```

Time `O(log n)` · Space `O(log n)` for the call stack.

## Sorting algorithms

### 1. Bubble sort

Repeatedly compare adjacent elements and swap them if they are out of order. After each pass the largest remaining element has "bubbled" to its final position. Stop early if a pass makes no swaps.

```js
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
```

Best `O(n)` (already sorted) · Average / worst `O(n²)` · Space `O(1)`.

### 2. Insertion sort

Grow a sorted region at the front of the array. Take the next element (the *key*), shift every larger element in the sorted region one slot right, then drop the key into the gap.

```js
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

console.log(insertionSort([64, 34, 25, 12, 22, 11, 90]));
```

Best `O(n)` (already sorted) · Average / worst `O(n²)` · Space `O(1)`. Fast for small or nearly-sorted arrays.

### 3. Quick sort

Divide and conquer. Pick a pivot, partition the rest into "less than pivot" and "greater than pivot", recurse on each partition, then concatenate.

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([64, 34, 25, 12, 22, 11, 90]));
```

Best / average `O(n log n)` · Worst `O(n²)` (pivot always the min or max) · Space `O(log n)` for the recursion. In-place partitioning schemes avoid the extra arrays used here.

### 4. Merge sort

Divide the array in half, recursively sort each half, then merge the two sorted halves by repeatedly taking the smaller front element.

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

console.log(mergeSort([64, 34, 25, 12, 22, 11, 90]));
```

Best / average / worst `O(n log n)` · Space `O(n)`. Stable, and the guaranteed `O(n log n)` makes it a safe default.

### Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

## More classic problems

### Cartesian product

Every pairing of one element from each array.

```js
function cartesianProduct(arr1, arr2) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      result.push([arr1[i], arr2[j]]);
    }
  }
  return result;
}

console.log(cartesianProduct([1, 2], [3, 4]));
// [[1, 3], [1, 4], [2, 3], [2, 4]]
```

Time `O(n × m)` · Space `O(n × m)`.

### Climbing stairs

You can take 1 or 2 steps at a time. How many distinct ways to reach step `n`? The count for step `n` is the count for `n - 1` plus the count for `n - 2` — the Fibonacci recurrence — so track the last two values instead of recursing.

```js
function climbStairs(n) {
  if (n <= 1) return 1;

  let prev1 = 1;
  let prev2 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}

console.log(climbStairs(5)); // 8
```

Time `O(n)` · Space `O(1)`.

### Tower of Hanoi

Three rods — source `A`, helper `B`, destination `C` — and `n` disks stacked largest-to-smallest on `A`. Move the whole stack to `C`, moving one disk at a time, never placing a larger disk on a smaller one.

The recursive insight: to move `n` disks from source to destination, move the top `n - 1` to the helper, move the largest disk to the destination, then move the `n - 1` from the helper onto it.

```js
function towerOfHanoi(n, source, destination, helper) {
  if (n === 1) {
    console.log(`Move disk 1 from ${source} to ${destination}`);
    return;
  }
  towerOfHanoi(n - 1, source, helper, destination);
  console.log(`Move disk ${n} from ${source} to ${destination}`);
  towerOfHanoi(n - 1, helper, destination, source);
}

towerOfHanoi(3, "A", "C", "B");
```

Time `O(2ⁿ)` — it takes `2ⁿ − 1` moves to solve `n` disks. Space `O(n)` for the call stack.
