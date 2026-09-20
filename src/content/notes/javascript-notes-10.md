---
title: "Polyfill for call, apply and bind method"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 16
description: "JavaScript — Polyfill for call, apply and bind method."
---
**A polyfill is a piece of code that adds a feature to environments (usually older browsers) that don't support it natively.** It acts like a fallback: if the browser doesn't have a method, we write our own version.

Writing polyfills for `call`, `apply` and `bind` is a very common interview question, because it tests your understanding of `this`, prototypes and closures. (See **call, apply and bind method** for how the real methods work.)

**The core trick:** when a function is called as a method — `obj.fn()` — `this` inside it is `obj`. So to run a function with a chosen `this`, we temporarily attach the function to that object, call it as a method, then remove it.

Common setup for all examples:

```js
let name = {
  firstName: "Rishabh",
  lastName: "Sisodiya"
};

let printName = function (hometown, state) {
  console.log(this.firstName + " " + this.lastName + ", " + hometown + ", " + state);
  return "done";
};
```

### Create a user-defined call method

**Simple version**

```js
// Real method
printName.call(name, "Chittorgarh", "Rajasthan");

Function.prototype.mycall = function (obj, ...args) {
  // this = printName (the function mycall was called on)
  obj.fnRef = this;           // attach the function to obj
  const result = obj.fnRef(...args); // call it as a method → `this` is obj
  delete obj.fnRef;           // clean up
  return result;
};

printName.mycall(name, "Chittorgarh", "Rajasthan");
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"
```

**Problem with the simple version:** if `obj` already has a property called `fnRef`, we overwrite it. And if we forget `delete`, `fnRef` stays on the object.

**Advanced version**

```js
Function.prototype.myCall = function (obj, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall must be called on a function");
  }

  // null/undefined → global object; primitives (e.g. 5, "a") → wrapped in an object
  obj = obj === null || obj === undefined ? globalThis : Object(obj);

  const uniqueKey = Symbol();   // unique key, so no existing property is overwritten
  obj[uniqueKey] = this;        // temporarily store the function on obj
  const result = obj[uniqueKey](...args); // call the function with the arguments
  delete obj[uniqueKey];        // remove the temporary property
  return result;                // return the function's result
};

console.log(printName.myCall(name, "Chittorgarh", "Rajasthan"));
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"
// "done"
console.log(Object.getOwnPropertySymbols(name).length); // 0 — nothing left behind
```

**Why `Object(obj)` instead of `obj || globalThis`?** `obj || globalThis` would also replace valid falsy values like `0` or `""` with the global object, and you cannot add properties to primitives.

### Create a user-defined apply method

`apply` is the same as `call`, except the arguments come as an **array**.

**Simple version**

```js
// Real method
printName.apply(name, ["Chittorgarh", "Rajasthan"]);

Function.prototype.myapply = function (obj, args) {
  if (!Array.isArray(args)) {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }
  // this = printName
  obj.fnRef = this;
  const result = obj.fnRef(...args);
  delete obj.fnRef;
  return result;
};

printName.myapply(name, ["Chittorgarh", "Rajasthan"]);
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"

// printName.myapply(name, "Chittorgarh", "Rajasthan");
// TypeError: CreateListFromArrayLike called on non-object — arguments must be in an array
```

**Advanced version**

```js
Function.prototype.myApply = function (obj, args) {
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }
  if (args !== null && args !== undefined && typeof args !== "object") {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }

  obj = obj === null || obj === undefined ? globalThis : Object(obj);

  const uniqueKey = Symbol();
  obj[uniqueKey] = this;
  const result = obj[uniqueKey](...Array.from(args || [])); // supports arrays and array-likes
  delete obj[uniqueKey];
  return result;
};

printName.myApply(name, ["Udaipur", "Rajasthan"]);
// "Rishabh Sisodiya, Udaipur, Rajasthan"

console.log(Math.max.myApply(null, [3, 9, 2])); // 9
```

Once `myCall` exists, `myApply` can also be written in one line:

```js
Function.prototype.myApply2 = function (obj, args = []) {
  return this.myCall(obj, ...args);
};
```

### Create a user-defined bind method

`bind` does **not** call the function. It returns a **new function** that remembers `obj` and any arguments passed so far (using a **closure**), and calls the original function later.

```js
// Real method
let printMyName = printName.bind(name, "Chittorgarh");
printMyName("Rajasthan");
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"
```

**Simple version**

```js
Function.prototype.mybind = function (obj, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }
  const func = this; // save the original function (closure)

  return function (...innerArgs) {
    // combine arguments from mybind with arguments from the returned function
    return func.apply(obj, [...args, ...innerArgs]);
  };
};

let printMyName2 = printName.mybind(name, "Chittorgarh");
printMyName2("Rajasthan");
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"
```

**Why do we need `const func = this`?** Inside the returned `function`, `this` would be different (it depends on how the returned function is called). Saving it in `func` lets the closure remember the original function.

**Without using apply/call (advanced)**

```js
Function.prototype.myBind = function (obj, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }
  const func = this;
  const context = obj === null || obj === undefined ? globalThis : Object(obj);

  return function (...innerArgs) {
    const uniqueKey = Symbol();
    context[uniqueKey] = func;                      // attach at call time
    const result = context[uniqueKey](...args, ...innerArgs);
    delete context[uniqueKey];                      // clean up after each call
    return result;
  };
};

let printMyName3 = printName.myBind(name, "Chittorgarh");
printMyName3("Rajasthan");
// "Rishabh Sisodiya, Chittorgarh, Rajasthan"
```

(The key is attached **inside** the returned function, at call time, so the object is not left with an extra property between calls.)

**Supporting `new` (bonus)**

The real `bind` lets you use `new` on a bound function; in that case the bound `this` is ignored. A polyfill that supports this:

```js
Function.prototype.myBindWithNew = function (obj, ...args) {
  const func = this;

  function bound(...innerArgs) {
    const isNew = this instanceof bound;             // called with new?
    return func.apply(isNew ? this : obj, [...args, ...innerArgs]);
  }

  bound.prototype = Object.create(func.prototype);   // keep the prototype chain
  return bound;
};

function Person(first, last) {
  this.full = first + " " + last;
}

const BoundPerson = Person.myBindWithNew({ ignored: true }, "Rishabh");
const p = new BoundPerson("Sisodiya");
console.log(p.full);              // "Rishabh Sisodiya"
console.log(p instanceof Person); // true
```

### Checking if a native method exists (real polyfill style)

Real polyfills only add the method if the browser doesn't already have it:

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function (obj, ...args) {
    const func = this;
    return function (...innerArgs) {
      return func.apply(obj, [...args, ...innerArgs]);
    };
  };
}
```
