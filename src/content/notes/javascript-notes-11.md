---
title: "Polyfill Reduce"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 17
description: "JavaScript — Polyfill Reduce."
---
A **polyfill for `reduce`** is another common interview question. First, recall how the real `reduce` works:

```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 10
```

`reduce(callback, initialValue)` calls `callback(accumulator, currentValue, currentIndex, array)` for each element and returns the final accumulator.

-   If `initialValue` is given → the accumulator starts with it, and the loop starts at index 0.
-   If not → the accumulator starts with the **first element**, and the loop starts at index 1.
-   Empty array with no `initialValue` → `TypeError`.

### myReduce polyfill

```js
Array.prototype.myReduce = function (callback, initialValue) {
  const originalArray = this;

  // Check if 'this' is an array and callback is a function
  if (!Array.isArray(originalArray)) {
    throw new TypeError("myReduce called on non-array");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // Initialize accumulator
  let acc;
  let startIndex;

  if (arguments.length >= 2) {
    acc = initialValue;
    startIndex = 0; // start from the first element
  } else {
    if (originalArray.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = originalArray[0];
    startIndex = 1; // skip the first element
  }

  // Iterate over the array
  for (let i = startIndex; i < originalArray.length; i++) {
    acc = callback(acc, originalArray[i], i, originalArray);
  }

  return acc;
};

const sum1 = numbers.myReduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum1); // 10
console.log([1, 2, 3].myReduce((a, b) => a * b)); // 6 — no initial value
// [].myReduce((a, b) => a + b); // TypeError: Reduce of empty array with no initial value
```

**Why `arguments.length >= 2` instead of `initialValue !== undefined`?** Someone may intentionally pass `undefined` as the initial value. The real `reduce` treats `reduce(fn, undefined)` as "initial value given", so checking the number of arguments matches it exactly.

```js
console.log([1, 2].reduce((acc, n) => String(acc) + n, undefined)); // "undefined12"
console.log([1, 2].myReduce((acc, n) => String(acc) + n, undefined)); // "undefined12"
```

### Check the first duplicate using reduce

```js
const nums = [2, 5, 3, 5, 6, 3, 2];

const firstDuplicate = nums.reduce((acc, currentValue, currentIndex, array) => {
  if (acc !== null) return acc; // if a duplicate is already found, skip further checks

  // if this value appeared earlier in the array, it is a duplicate
  const isDuplicate = array.indexOf(currentValue) !== currentIndex;
  return isDuplicate ? currentValue : acc;
}, null);

console.log(firstDuplicate); // 5
```

**How:** at index 3, the value is `5`, but `indexOf(5)` is `1` (its first position), so `1 !== 3` → duplicate. `5` is the first value whose second occurrence appears, so the answer is `5`.

A faster version for large arrays uses a `Set` (`indexOf` makes the reduce version O(n²)):

```js
function findFirstDuplicate(arr) {
  const seen = new Set();
  for (const n of arr) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return null;
}
console.log(findFirstDuplicate([2, 5, 3, 5, 6, 3, 2])); // 5
```

### Understand reduce step by step

```js
const values = [10, 20, 30, 40];

const sumWithDebug = values.reduce((acc, currentValue, currentIndex, array) => {
  console.log(`Index: ${currentIndex}, Value: ${currentValue}, Accumulator: ${acc}, Array: ${array}`);
  return acc + currentValue;
}, 0);

console.log(sumWithDebug);
```

**Output:**

```
Index: 0, Value: 10, Accumulator: 0, Array: 10,20,30,40
Index: 1, Value: 20, Accumulator: 10, Array: 10,20,30,40
Index: 2, Value: 30, Accumulator: 30, Array: 10,20,30,40
Index: 3, Value: 40, Accumulator: 60, Array: 10,20,30,40
100
```

### Bonus: polyfills for map and filter

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

console.log([1, 2, 3].myMap(n => n * 2));          // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter(n => n % 2 === 0)); // [2, 4]
```

### Useful reduce patterns

```js
// Count occurrences
const fruits = ['apple', 'banana', 'apple'];
console.log(fruits.reduce((acc, f) => ({ ...acc, [f]: (acc[f] || 0) + 1 }), {}));
// { apple: 2, banana: 1 }

// Flatten one level
console.log([[1, 2], [3], [4, 5]].reduce((acc, arr) => acc.concat(arr), []));
// [1, 2, 3, 4, 5]

// Max value
console.log([3, 9, 2].reduce((max, n) => (n > max ? n : max)));
// 9

// Run functions in sequence (pipe)
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);
console.log(pipe(n => n + 1, n => n * 2)(5));
// 12
```

> **Interview practice:** Interview version with sparse arrays, `thisArg` and the empty-array rule: [Machine Coding — map, filter and reduce](/machine-coding/map-filter-reduce).
