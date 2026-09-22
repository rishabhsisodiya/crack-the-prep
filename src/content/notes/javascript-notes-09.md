---
title: "call, apply and bind method"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 15
description: "JavaScript — call, apply and bind method."
---
The `call`, `apply` and `bind` methods are available on every function. They let us control the context (`this`) with which a function is invoked.

### call — function borrowing

```js
let name = {
  firstName: "Rishabh",
  lastName: "Sisodiya",
  printFullName: function () {
    console.log(this.firstName + " " + this.lastName);
  }
};

name.printFullName(); // "Rishabh Sisodiya"

let name2 = {
  firstName: "Any",
  lastName: "Random"
};

// function borrowing
name.printFullName.call(name2); // "Any Random"
```

When we use `method.call(obj)`, the method runs with `this` pointing to the new object `obj`. `name2` doesn't have `printFullName`, but it can **borrow** it from `name`.

### Method with arguments

In practice, we keep the function separate from the objects:

```js
let name = {
  firstName: "Rishabh",
  lastName: "Sisodiya"
};

let printFullName = function (hometown, state) {
  console.log(this.firstName + " " + this.lastName + " from " + hometown + ", " + state);
};

printFullName.call(name, "Chittorgarh", "Rajasthan");
// "Rishabh Sisodiya from Chittorgarh, Rajasthan"

let name2 = {
  firstName: "Any",
  lastName: "Random"
};

// function borrowing
printFullName.call(name2, "Udaipur", "Rajasthan");
// "Any Random from Udaipur, Rajasthan"

printFullName.apply(name2, ["Udaipur", "Rajasthan"]);
// "Any Random from Udaipur, Rajasthan"

// bind returns a copy of the function with `this` fixed — it does not call it
let printMyName = printFullName.bind(name2, "Udaipur", "Rajasthan");
console.log(typeof printMyName); // "function"
printMyName();
// "Any Random from Udaipur, Rajasthan"
```

The only difference between `call` and `apply` is how we pass arguments. Both **invoke the function immediately**: `call` takes arguments one by one, `apply` takes them as an **array**. `bind` does **not** invoke the function — it returns a new copy of the function with `this` (and optionally some arguments) bound, which we can call later.

If we do not pass the arguments to `apply` as an array (or array-like), it throws an error:

```js
printFullName.apply(name2, "Udaipur");
// TypeError: CreateListFromArrayLike called on non-object
```

| | `call` | `apply` | `bind` |
| --- | --- | --- | --- |
| Invokes immediately | Yes | Yes | No — returns a new function |
| Arguments | one by one: `fn.call(obj, a, b)` | array: `fn.apply(obj, [a, b])` | one by one: `fn.bind(obj, a)` |
| Returns | result of the function | result of the function | bound function |

### More examples

**Using apply with Math.max**

```js
const numbers = [5, 1, 9, 3];
console.log(Math.max.apply(null, numbers)); // 9
console.log(Math.max(...numbers));          // 9 — modern alternative with spread
```

**Partial application with bind** — pass some arguments now, the rest later:

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2); // a is fixed to 2
console.log(double(5));  // 10
console.log(double(10)); // 20
```

**Fixing lost `this` with bind**

```js
const user = {
  name: "Rishabh",
  greet() {
    console.log("Hi " + this.name);
  }
};

setTimeout(user.greet, 0);            // "Hi undefined" — this is lost
setTimeout(user.greet.bind(user), 0); // "Hi Rishabh"
```

**Borrowing array methods for array-like objects**

```js
function sumAll() {
  return Array.prototype.reduce.call(arguments, (sum, n) => sum + n, 0);
}
console.log(sumAll(1, 2, 3)); // 6
```

### Tricky questions

```js
// Q1: Can a bound function be re-bound?
function show() { return this.x; }
const bound = show.bind({ x: 1 });
console.log(bound.call({ x: 2 }));      // 1 — bind wins; call cannot change it
console.log(bound.bind({ x: 3 })());    // 1 — bind only works the first time
```

```js
// Q2: call/apply/bind with arrow functions
const obj = { x: 10 };
const arrow = () => this?.x;
console.log(arrow.call(obj));           // undefined — arrow functions ignore call/apply/bind for `this`
```

```js
// Q3: new overrides bind
function Person(name) { this.name = name; }
const BoundPerson = Person.bind({ name: "ignored" });
const p = new BoundPerson("Asha");
console.log(p.name);                    // "Asha" — `new` creates a fresh `this`
```

```js
// Q4: What if we pass null as this?
function whoAmI() { return this; }
console.log(whoAmI.call(null) === globalThis); // true in non-strict mode (undefined in strict mode)
```

For how to write your own versions of these methods, see **Polyfill for call, apply and bind method**.

> **Interview practice:** Interview version, built step by step with edge cases: [Machine Coding — call, apply and bind](/machine-coding/call-apply-bind).
