---
title: "Currying"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 18
description: "JavaScript — Currying."
---
**Currying** is a technique from functional programming where a function with multiple arguments is transformed into a sequence of nested functions, each taking **one** argument. It returns a new function that expects the next argument.

`f(a, b, c)` → `f(a)(b)(c)`

It keeps returning a new function (expecting the next argument) until all arguments are received. The earlier arguments are kept "alive" **via closures**, and all of them are used when the final function in the chain runs.

Two ways to implement currying:

### 1. Currying using the bind method

```js
let multiply = function (x, y) {
  console.log(x * y);
};

// currying — fix x = 2
let multiplyByTwo = multiply.bind(this, 2);
multiplyByTwo(5);

// fix both x = 3 and y = 2
let multiplyByThree = multiply.bind(this, 3, 2);
// the extra argument 5 is ignored, as both required arguments are already passed
multiplyByThree(5);
```

**Output:**

```
10
6
```

(Here `this` is not used inside `multiply`, so we can also pass `null` instead of `this`.)

### 2. Currying using closures

```js
let multiply = function (x) {
  return function (y) {
    console.log(x * y);
  };
};

let multiplyByTwo = multiply(2);
multiplyByTwo(5);

let multiplyByThree = multiply(3);
multiplyByThree(2);
```

**Output:**

```
10
6
```

`multiply(2)` returns the inner function, which forms a closure with `x = 2`.

With arrow functions this is often written in one line:

```js
const add = a => b => c => a + b + c;
console.log(add(1)(2)(3)); // 6
```

### Write a function that handles sum(1)(2)(3)(4)…(n)()

```js
let sum = function (a) {
  return function (b) {
    if (b !== undefined) {
      return sum(a + b); // keep collecting
    }
    return a;            // empty call () → return the total
  };
};

console.log(sum(1)(2)(3)());    // 6
console.log(sum(1)(2)(3)(4)()); // 10
console.log(sum(5)(0)(5)());    // 10
```

**How it works:** `sum(1)` returns a function. `(2)` calls it with `b = 2`, which returns `sum(3)`. `(3)` returns `sum(6)`. Finally `()` is called with no argument, so `b` is `undefined` and it returns `6`.

**Note:** a common version uses `if (b)`, but that breaks for `0`, because `0` is falsy — `sum(5)(0)(5)()` would stop early and return `5`. Checking `b !== undefined` fixes it.

Shorter version:

```js
const sum2 = a => b => (b !== undefined ? sum2(a + b) : a);
console.log(sum2(1)(2)(3)()); // 6
```

### Generic curry function (interview favourite)

Convert **any** function into a curried function:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // enough arguments → call the original
    }
    return function (...next) {
      return curried.apply(this, [...args, ...next]); // collect more arguments
    };
  };
}

function volume(l, w, h) {
  return l * w * h;
}

const curriedVolume = curry(volume);

console.log(curriedVolume(2)(3)(4)); // 24
console.log(curriedVolume(2, 3)(4)); // 24
console.log(curriedVolume(2)(3, 4)); // 24
console.log(curriedVolume(2, 3, 4)); // 24
```

`fn.length` is the number of parameters the function declares (3 for `volume`).

### Why use currying?

-   **Reusability** — create specialized functions from a general one.
-   **Avoid repeating the same argument.**
-   **Function composition** — small one-argument functions are easy to combine.

```js
const log = level => message => console.log(`[${level}] ${message}`);

const info = log('INFO');
const error = log('ERROR');

info('Server started');   // [INFO] Server started
error('Disk full');       // [ERROR] Disk full
```

```js
const discount = rate => price => price - price * rate;

const tenPercentOff = discount(0.1);
console.log(tenPercentOff(500));  // 450
console.log(tenPercentOff(1000)); // 900
```

**Currying vs partial application:** currying always takes **one argument at a time** (`f(a)(b)(c)`). Partial application fixes **some** arguments and returns a function for the rest (`bind(null, a)` then `f(b, c)`). The `bind` example above is technically partial application.
