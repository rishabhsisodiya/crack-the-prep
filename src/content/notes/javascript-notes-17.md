---
title: "Promise"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 12
description: "JavaScript — Promise."
---
A **Promise** is an object representing a value that is not necessarily known when the promise is created — the **eventual completion (or failure) of an asynchronous operation**. It lets you attach handlers for the operation's eventual success value or failure reason. This lets asynchronous functions return something like synchronous functions do: instead of immediately returning the final value, they return a promise to supply the value at some point in the future.

**Once a promise is settled (fulfilled or rejected), its state and value cannot change** — it is immutable after settling. That's why a promise can resolve only once.

A Promise is in one of these states:

1.  **pending:** initial state, neither fulfilled nor rejected.
2.  **fulfilled:** the operation completed successfully.
3.  **rejected:** the operation failed.

A promise that is fulfilled or rejected is called **settled**.

![](/notes-img/javascript-notes/img-035.webp)

If you log a promise, it may initially show `pending`. When you expand it later in Chrome DevTools, Chrome shows the **current** state, so it can show `fulfilled` — the console updates the object when you expand it.

### Creating and consuming a promise

```js
function myDisplayer(some) {
  document.getElementById("demo").innerHTML = some;
}

let myPromise = new Promise(function (myResolve, myReject) {
  let x = 0;

  // some code (try changing x to 5)
  if (x == 0) {
    myResolve("OK");
  } else {
    myReject("Error");
  }
});

myPromise.then(
  function (value) { myDisplayer(value); }, // runs on resolve
  function (error) { myDisplayer(error); }  // runs on reject
);
```

The function passed to `new Promise` is called the **executor**. It runs **immediately** (synchronously) and receives two functions: `resolve` (call on success) and `reject` (call on failure).

A more common style uses `.then` for success and `.catch` for errors:

```js
const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(`Waited ${ms}ms`), ms));

wait(1000)
  .then(result => console.log(result))       // "Waited 1000ms"
  .catch(error => console.error(error))
  .finally(() => console.log("Always runs")); // "Always runs"
```

### Promise execution order

```js
console.log("1");

const p = new Promise((resolve) => {
  console.log("2");   // executor runs synchronously
  resolve("3");
});

p.then(value => console.log(value)); // .then callbacks go to the microtask queue

console.log("4");

// Output:
// 1
// 2
// 4
// 3
```

### A promise settles only once

```js
const once = new Promise((resolve, reject) => {
  resolve("first");
  resolve("second"); // ignored
  reject("error");   // ignored
});

once.then(v => console.log(v)); // "first"
```

### Promise chaining

Each `.then()` returns a **new promise**. Whatever you return from `.then` is passed to the next `.then`. If you return a promise, the chain waits for it.

```js
new Promise(resolve => resolve(2))
  .then(n => n * 2)                     // 4
  .then(n => new Promise(r => setTimeout(() => r(n * 2), 500))) // waits → 8
  .then(n => {
    console.log(n);                      // 8
  });
```

**Common mistake — forgetting to return:**

```js
Promise.resolve(1)
  .then(n => { n * 2; })     // no return
  .then(n => console.log(n)); // undefined
```

### Error handling

An error thrown (or a rejection) anywhere in the chain skips to the nearest `.catch`:

```js
Promise.resolve()
  .then(() => {
    throw new Error("Step 1 failed");
  })
  .then(() => console.log("never runs"))
  .catch(err => {
    console.log("Caught:", err.message); // "Caught: Step 1 failed"
    return "recovered";
  })
  .then(v => console.log(v));           // "recovered" — the chain continues after catch
```

### Real example: fetch

`fetch` returns a promise:

```js
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();   // also returns a promise
  })
  .then(user => console.log(user.name)) // "Leanne Graham"
  .catch(err => console.error("Request failed:", err.message));
```

### async / await

`async/await` is a cleaner syntax for working with promises. An `async` function **always returns a promise**. `await` pauses the function until the promise settles.

```js
async function getUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const user = await response.json();
    console.log(user.name);
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

getUser();

async function getNumber() {
  return 42;
}
console.log(getNumber());               // Promise { 42 }
getNumber().then(n => console.log(n));  // 42
```

### Promise combinators

```js
const fast = new Promise(r => setTimeout(() => r("fast"), 100));
const slow = new Promise(r => setTimeout(() => r("slow"), 500));
const fail = new Promise((_, reject) => setTimeout(() => reject("failed"), 300));
```

| Method | Resolves when | Rejects when |
| --- | --- | --- |
| `Promise.all` | **all** fulfill → array of values | **any** rejects (fails fast) |
| `Promise.allSettled` | **all** settle → array of `{status, value/reason}` | never |
| `Promise.race` | the **first** to settle fulfills | the first to settle rejects |
| `Promise.any` | the **first** to fulfill | **all** reject (`AggregateError`) |

```js
Promise.all([fast, slow]).then(console.log);        // ["fast", "slow"] (after 500 ms, order kept)
Promise.all([fast, fail, slow]).catch(console.log); // "failed" (after 300 ms)

Promise.allSettled([fast, fail]).then(console.log);
// [{ status: "fulfilled", value: "fast" }, { status: "rejected", reason: "failed" }]

Promise.race([slow, fail]).catch(console.log);      // "failed" — settled first
Promise.any([fail, slow]).then(console.log);        // "slow" — first to fulfill
```

**Sequential vs parallel with await:**

```js
const delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));

async function sequential() {
  const a = await delay(1000, "a"); // waits 1 s
  const b = await delay(1000, "b"); // waits another 1 s
  return [a, b];                    // total ~2 s
}

async function parallel() {
  const [a, b] = await Promise.all([delay(1000, "a"), delay(1000, "b")]);
  return [a, b];                    // total ~1 s
}
```

### Interview questions

```js
// Q1: Output?
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A, D, C, B — sync first, then microtasks (promises), then tasks (setTimeout)
```

```js
// Q2: Output?
const p1 = new Promise((resolve) => {
  console.log("inside executor");
});
console.log(p1); // Promise { <pending> } — resolve was never called
```

```js
// Q3: Promisify a callback-style function
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

function oldApi(x, cb) { setTimeout(() => cb(null, x * 2), 100); }
promisify(oldApi)(21).then(console.log); // 42
```

```js
// Q4: Polyfill for Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = value;              // keep the original order
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);                    // reject on the first failure
    });
  });
}

promiseAll([1, Promise.resolve(2), new Promise(r => setTimeout(() => r(3), 100))])
  .then(console.log); // [1, 2, 3]
```
