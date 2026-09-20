---
title: "Functions & Expressions"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
order: 3
slug: "basics-functions"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
description: "JavaScript basics — Functions & Expressions."
---
### Defining functions

A function is a reusable block of code that performs a task or calculates a value. It usually takes some input (parameters) and returns an output. To use a function, it must be defined in a scope from which you call it.

#### Function declarations

```js
function square(number) {
  return number * number;
}

console.log(square(4)); // 16
```

#### Passing primitives vs objects

**Primitives** (numbers, strings, …) are passed **by value** — the function gets a copy, so changing the parameter does not affect the caller.

```js
function addTen(num) {
  num = num + 10;
  return num;
}

let value = 5;
console.log(addTen(value)); // 15
console.log(value);         // 5 — unchanged
```

**Objects** (including arrays) are passed as a **copy of the reference**. Changing a property is visible outside, but reassigning the parameter is not.

```js
function myFunc(theObject) {
  theObject.make = 'Toyota';          // changes the shared object
}

const mycar = { make: 'Honda', model: 'Accord', year: 1998 };
const x = mycar.make;                 // "Honda"
myFunc(mycar);
const y = mycar.make;                 // "Toyota" — changed by the function
console.log(x, y);                    // "Honda" "Toyota"

function replace(theObject) {
  theObject = { make: 'Ford' };       // points the local parameter to a new object
}
replace(mycar);
console.log(mycar.make);              // "Toyota" — the caller's object is unchanged
```

#### Function expressions

A function can also be created inside an expression and stored in a variable. Such a function can be **anonymous** (no name):

```js
const square = function (number) {
  return number * number;
};

console.log(square(4)); // 16
```

A **method** is simply a function stored as a property of an object:

```js
const calculator = {
  square(n) { return n * n; }
};
console.log(calculator.square(5)); // 25
```

#### Function declaration vs function expression

The main difference is **hoisting**. A function declaration is hoisted with its body, so it can be called before it appears in the code. A function expression is just a value assigned to a variable, so it is not available until that line runs.

```js
a(); // "a called"
b(); // TypeError: b is not a function

// Function declaration (function statement)
function a() {
  console.log("a called");
}

// Function expression
var b = function () {
  console.log("b called");
};
```

**Why the different errors?**

-   `var b` is hoisted and set to `undefined`, so calling `b()` gives **TypeError: b is not a function**.
-   With `let` or `const`, the variable is in the temporal dead zone, so you get **ReferenceError: Cannot access 'b' before initialization**.

```js
c(); // ReferenceError: Cannot access 'c' before initialization
const c = function () {};
```

| | Declaration | Expression |
| --- | --- | --- |
| Syntax | `function a() {}` | `const a = function () {}` |
| Hoisted with body | Yes | No |
| Can be anonymous | No | Yes |
| Can be called before definition | Yes | No |

#### Anonymous functions

An anonymous function is a function **without a name**. It cannot be written as a standalone statement:

```js
function () {
}
// SyntaxError: Function statements require a function name
```

**If that throws an error, what is the use of an anonymous function?**
Anonymous functions are used where a function is used **as a value** — assigned to a variable, passed as an argument, or returned from another function.

```js
const greet = function () { return 'hi'; };        // assigned to a variable
setTimeout(function () { console.log('done'); }, 0); // passed as an argument
[1, 2, 3].map(function (n) { return n * 2; });       // callback
(function () { console.log('IIFE runs immediately'); })(); // IIFE
```

#### Named function expressions

A function expression can also have a name:

```js
var b = function xyz() {
  console.log("b called");
};
```

**What happens when we call it by that name?**

```js
var b = function xyz() {
  console.log("xyz called");
  console.log(typeof xyz); // "function" — xyz is visible inside
};

b();   // "xyz called", "function"
xyz(); // ReferenceError: xyz is not defined
```

`xyz` is **not** created in the outer scope. It exists only inside the function's own body, which is useful for recursion and for clearer stack traces. From outside, you must use `b`.

#### Parameters vs arguments

-   **Parameters** are the names listed in the function definition. They act as local variables.
-   **Arguments** are the actual values passed when the function is called.

```js
function add(a, b) {   // a, b → parameters
  return a + b;
}
add(2, 3);             // 2, 3 → arguments

function show(a, b) {
  console.log(a, b);
}
show(1);        // 1 undefined — missing arguments are undefined
show(1, 2, 3);  // 1 2 — extra arguments are ignored (but available in `arguments`)
console.log(add.length); // 2 — number of declared parameters
```

### Recursion

A function can refer to and call itself. There are three ways for a function to refer to itself:

1.  The function's name
2.  arguments.callee
3.  An in-scope variable that refers to the function

For example, consider the following function definition:

```js
var foo = function bar() {
  // statements go here
};
```

Within the function body, the following are all equivalent:

1.  bar()
2.  arguments.callee()
3.  foo()

#### 1. Using the function's name

The name of a named function is always available **inside** its own body.

```js
function factorial(n) {
  if (n <= 1) return 1;          // base case — stops the recursion
  return n * factorial(n - 1);   // calls itself by name
}

console.log(factorial(5)); // 120 → 5 * 4 * 3 * 2 * 1
```

For a named function expression, the name (`bar`) exists only inside the function:

```js
const foo = function bar(n) {
  if (n <= 0) return 'done';
  return bar(n - 1);             // works — bar is visible inside
};

console.log(foo(3)); // "done"
// console.log(bar(3)); // ReferenceError: bar is not defined — not visible outside
```

#### 2. Using `arguments.callee`

`arguments.callee` points to the function that is currently running. Useful for anonymous functions in old code.

```js
const countdown = function (n) {
  if (n < 0) return;
  console.log(n);
  arguments.callee(n - 1);       // calls the current function
};

countdown(2); // 2, 1, 0
```

> **Deprecated:** `arguments.callee` throws a `TypeError` in strict mode (and in ES modules / classes). It also does not exist in arrow functions. Prefer a named function expression instead.

```js
'use strict';
const fn = function () { return arguments.callee; };
// fn(); // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed in strict mode
```

#### 3. Using an in-scope variable that refers to the function

An anonymous function can call itself through the variable it was assigned to.

```js
const sum = function (arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1)); // calls itself through the variable "sum"
};

console.log(sum([1, 2, 3, 4])); // 10
```

**Trap:** this breaks if the variable is reassigned. A named function expression does not have this problem.

```js
let fact = function (n) {
  return n <= 1 ? 1 : n * fact(n - 1);   // depends on the variable "fact"
};
const saved = fact;
fact = null;
// saved(5); // TypeError: fact is not a function

let fact2 = function inner(n) {
  return n <= 1 ? 1 : n * inner(n - 1);  // depends on its own name
};
const saved2 = fact2;
fact2 = null;
console.log(saved2(5)); // 120 — still works
```

| Way | Works in strict mode | Survives variable reassignment | Recommended |
| --- | --- | --- | --- |
| Function's name | Yes | Yes | Yes |
| `arguments.callee` | No | Yes | No (deprecated) |
| In-scope variable | Yes | No | Only when safe |

#### Recursion and the call stack

It is possible to convert any recursive algorithm to a non-recursive one, but the logic is often much more complex, and doing so requires the use of a stack.

In fact, recursion itself uses a stack: the function stack. The stack-like behavior can be seen in the following example:

```js
function foo(i) {
  if (i < 0) return;
  console.log('begin: ' + i);
  foo(i - 1);
  console.log('end: ' + i);
}

foo(3);

// Output:
// begin: 3
// begin: 2
// begin: 1
// begin: 0
// end: 0
// end: 1
// end: 2
// end: 3
```

Each call waits on the stack until the call it made returns, so the `end` lines print in reverse order. Without a base case (`if (i < 0) return;`) the stack keeps growing until `RangeError: Maximum call stack size exceeded`.

### Nested functions and closures

You can define a function inside another function. The inner (nested) function is private to the outer function.

The inner function also forms a **closure**: it remembers and can use the variables and parameters of the outer function, even after the outer function has finished running. (Closures are covered in detail in the Closure chapter.)

To summarize:

-   The inner function can be accessed only from code inside the outer function (unless the outer function returns it).
-   The inner function can use the arguments and variables of the outer function, but the outer function **cannot** use the variables of the inner function.

```js
function addSquares(a, b) {
  function square(x) {
    return x * x;
  }
  return square(a) + square(b);
}

console.log(addSquares(2, 3)); // 13
console.log(addSquares(3, 4)); // 25
// square(2);                  // ReferenceError: square is not defined — private to addSquares
```

Because the inner function is a closure, you can call the outer function with one argument and the returned inner function with another:

```js
function outside(x) {
  function inside(y) {
    return x + y;
  }
  return inside;
}

const addThree = outside(3); // a function that adds 3 to whatever you give it
console.log(addThree(5));    // 8
console.log(outside(3)(5));  // 8 — same thing in one line
```

#### Preservation of variables

In the example above, `x` is **preserved** after `outside` returns. A closure keeps the variables of every scope it uses. Each call to `outside` creates a **new** closure with its own `x`. That memory is freed only when the returned function is no longer reachable.

```js
const addTwo = outside(2);
const addTen = outside(10);

console.log(addTwo(1)); // 3  — its own x = 2
console.log(addTen(1)); // 11 — its own x = 10
```

#### Multiply-nested functions (scope chain)

Functions can be nested several levels deep. If function `A` contains `B`, and `B` contains `C`, then `C` can access variables of both `B` and `A`. This lookup through enclosing scopes is called the **scope chain**.

```js
function A(x) {
  function B(y) {
    function C(z) {
      console.log(x + y + z);
    }
    C(3);
  }
  B(2);
}

A(1); // 6 (1 + 2 + 3)
```

-   `C` uses `z` (its own), `y` (from `B`) and `x` (from `A`).
-   The reverse is not true: `A` cannot access `y` or `z`, and cannot call `C`, because `C` is private to `B`.

#### Name conflicts (shadowing)

If an inner scope declares a variable with the same name as an outer one, the **innermost** one wins. This is called **shadowing**.

```js
function outside() {
  const x = 5;
  function inside(x) {  // parameter x shadows the outer x
    return x * 2;
  }
  return inside;
}

console.log(outside()(10)); // 20 — uses the inner x (10), not 5
```

#### Encapsulation with closures

The outer function's variables cannot be reached from outside — only through the inner functions. This gives a form of **private data**.

```js
const pet = function (name) {       // outer function has a "name" variable
  const getName = function () {
    return name;                    // inner function can read it
  };
  return getName;                   // expose only the inner function
};

const myPet = pet('Vivie');
console.log(myPet());   // "Vivie"
console.log(myPet.name);// "getName" — the function's own name, not the pet's name
```

An outer function can return an object with several methods that read and change its private variables:

```js
const createPet = function (name) {
  let sex;

  return {
    setName(newName) {
      name = newName;
    },
    getName() {
      return name;
    },
    getSex() {
      return sex;
    },
    setSex(newSex) {
      if (typeof newSex === 'string' &&
          (newSex.toLowerCase() === 'male' || newSex.toLowerCase() === 'female')) {
        sex = newSex;
      }
    }
  };
};

const pet1 = createPet('Vivie');
console.log(pet1.getName()); // "Vivie"

pet1.setName('Oliver');
pet1.setSex('male');
pet1.setSex('robot');        // ignored — fails validation
console.log(pet1.getSex());  // "male"
console.log(pet1.getName()); // "Oliver"
console.log(pet1.name);      // undefined — no direct access to the private variable
```

The functions do not even need a name or a variable. An **IIFE** (Immediately Invoked Function Expression) can hide a value completely:

```js
const getCode = (function () {
  const apiCode = '0]Eal(eh&2'; // cannot be changed from outside
  return function () {
    return apiCode;
  };
})();

console.log(getCode()); // "0]Eal(eh&2"
```

**Pitfall — shadowing hides the outer variable**

If the inner function uses the same name as the outer variable, there is no way to reach the outer one from inside:

```js
const createPet2 = function (name) {   // outer "name"
  return {
    setName(name) {                    // parameter also called "name"
      name = name;                     // assigns the parameter to itself — outer name never changes
    },
    getName() {
      return name;
    }
  };
};

const p = createPet2('Vivie');
p.setName('Oliver');
console.log(p.getName()); // "Vivie" — not updated!

// Fix: use a different parameter name, e.g. setName(newName) { name = newName; }
```

### The arguments object

Inside a regular function, `arguments` is an **array-like** object holding every value passed in. `arguments[0]` is the first argument, and `arguments.length` is the number of arguments actually passed.

This lets a function accept more arguments than it declares:

```js
function myConcat(separator) {
  let result = '';
  for (let i = 1; i < arguments.length; i++) { // start at 1 to skip separator
    result += arguments[i] + separator;
  }
  return result;
}

console.log(myConcat(', ', 'red', 'orange', 'blue'));
// "red, orange, blue, "
console.log(myConcat('; ', 'elephant', 'giraffe', 'lion', 'cheetah'));
// "elephant; giraffe; lion; cheetah; "
console.log(myConcat('. ', 'sage', 'basil', 'oregano', 'pepper', 'parsley'));
// "sage. basil. oregano. pepper. parsley. "
```

**Note:** `arguments` is array-like, **not** an array. It has indexes and `length`, but no array methods like `map` or `join`.

```js
function test() {
  console.log(arguments.length);          // 3
  console.log(Array.isArray(arguments));  // false
  // arguments.map(x => x);               // TypeError: arguments.map is not a function
  console.log(Array.from(arguments));     // [1, 2, 3] — convert to a real array
}
test(1, 2, 3);

const arrow = () => {
  // console.log(arguments); // ReferenceError in modules — arrow functions have no own `arguments`
};
```

In modern code, prefer **rest parameters** (below) over `arguments`.

### Function parameters

ES2015 added two new kinds of parameters: **default parameters** and **rest parameters**.

#### Default parameters

Without default parameters (before ES2015), you had to check for `undefined` yourself:

```js
function multiply(a, b) {
  b = typeof b !== 'undefined' ? b : 1;
  return a * b;
}

console.log(multiply(5)); // 5
```

With default parameters (ES2015+):

```js
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5));            // 5 — b uses the default 1
console.log(multiply(5, 2));         // 10
console.log(multiply(5, undefined)); // 5 — undefined triggers the default
console.log(multiply(5, null));      // 0 — null does NOT trigger the default (5 * null → 0)
```

Defaults can use earlier parameters or call functions, and are evaluated on every call:

```js
function greet(name, message = `Hello ${name}`) {
  return message;
}
console.log(greet('Sam')); // "Hello Sam"

function addItem(item, list = []) {
  list.push(item);
  return list;
}
console.log(addItem('a')); // ["a"]
console.log(addItem('b')); // ["b"] — a new [] is created on each call
```

#### Rest parameters

The rest parameter (`...name`) collects any remaining arguments into a **real array**. It must be the last parameter.

```js
function multiply(multiplier, ...theArgs) {
  return theArgs.map(x => multiplier * x);
}

console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]

function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
console.log(sum());        // 0
console.log(sum(1, 2, 3)); // 6

// function wrong(...a, b) {} // SyntaxError: Rest parameter must be last formal parameter
```

**Rest vs spread** — same `...` syntax, opposite jobs:

```js
function max(...nums) {          // rest: collects arguments into an array
  return Math.max(...nums);      // spread: expands an array into arguments
}
console.log(max(3, 9, 4)); // 9
```

### First-class functions

A language has **first-class functions** when functions are treated like any other value. In JavaScript a function can be:

-   assigned to a variable,
-   passed as an argument to another function,
-   returned from another function,
-   stored in objects and arrays.

```js
// 1. Assign to a variable
const sayHi = function () { return 'Hi'; };

// 2. Pass as an argument
function run(fn) {
  return fn();
}
console.log(run(sayHi)); // "Hi"

// 3. Return from a function
function makeMultiplier(factor) {
  return function (n) {
    return n * factor;
  };
}
const double = makeMultiplier(2);
console.log(double(5)); // 10

// 4. Store in a data structure
const actions = { greet: sayHi };
console.log(actions.greet()); // "Hi"
```

A function that takes or returns another function is called a **higher-order function** (e.g. `map`, `filter`, `makeMultiplier`).

### Callback functions

A **callback** is a function passed into another function as an argument, which the outer function calls later to complete its work.

```js
function greeting(name) {
  console.log('Hello ' + name);
}

function processUserInput(callback) {
  const name = 'Rishabh'; // e.g. from a form or prompt()
  callback(name);
}

processUserInput(greeting); // "Hello Rishabh"
```

#### Why callbacks matter for async code

```js
setTimeout(() => {
  console.log("timer");
}, 5000);

function x(y) {
  console.log("x");
  y();
}

x(function y() {
  console.log("y");
});

// Output:
// x
// y
// timer   (after about 5 seconds)
```

`setTimeout` registers the callback and returns immediately, so `x` and `y` run first. The timer callback runs only after 5 seconds **and** once the call stack is empty.

JavaScript has one call stack (the main thread). If `x()` did heavy synchronous work taking longer than 5 seconds, it would **block** the main thread — the timer, clicks and rendering would all wait. That is why slow work (network, timers, file I/O) is done asynchronously with callbacks, Promises or `async/await`.

```js
setTimeout(() => console.log('timer'), 0);
const start = Date.now();
while (Date.now() - start < 2000) {} // blocks the thread for 2 seconds
console.log('loop done');
// Output:
// loop done
// timer — even with 0 ms, it had to wait for the blocking loop
```

### Arrow functions

An arrow function has a shorter syntax than a function expression. It does **not** have its own `this`, `arguments`, `super` or `new.target`, and cannot be used as a constructor. Arrow functions are always anonymous (but get a name when assigned to a variable).

Two reasons they were introduced: **shorter functions** and **no separate `this`**.

#### Shorter functions

```js
const elements = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'];

const a2 = elements.map(function (s) { return s.length; });
console.log(a2); // [8, 6, 7, 9]

const a3 = elements.map(s => s.length);
console.log(a3); // [8, 6, 7, 9]
```

**Syntax variations**

```js
const noParams = () => 'hi';
const oneParam = x => x * 2;           // parentheses optional for one parameter
const twoParams = (a, b) => a + b;
const withBody = (a, b) => {           // braces need an explicit return
  const sum = a + b;
  return sum;
};
const returnObject = () => ({ id: 1 }); // wrap an object in ()

console.log(noParams(), oneParam(4), twoParams(1, 2), withBody(2, 3), returnObject());
// "hi" 8 3 5 { id: 1 }

const forgotReturn = (a, b) => { a + b };
console.log(forgotReturn(1, 2)); // undefined — braces without return
```

#### No separate `this`

Before arrow functions, every regular function got its own `this`, decided by **how it was called**. This caused bugs in callbacks:

```js
function Person() {
  this.age = 0;   // `this` is the new Person object

  setInterval(function growUp() {
    // A plain function call: `this` is the global object (or undefined in strict mode),
    // NOT the Person instance
    this.age++;   // NaN on window.age, or TypeError in strict mode
  }, 1000);
}

const p = new Person();
```

In ES3/ES5 this was fixed by saving `this` in a variable the callback could close over:

```js
function Person() {
  const self = this; // some use `that` instead of `self`
  self.age = 0;

  setInterval(function growUp() {
    self.age++;      // refers to the Person instance
  }, 1000);
}
```

Or with a **bound function**:

```js
function Person() {
  this.age = 0;
  setInterval(function growUp() {
    this.age++;
  }.bind(this), 1000); // lock `this` to the Person instance
}
```

An arrow function uses the `this` of the surrounding code, so no workaround is needed:

```js
function Person() {
  this.age = 0;
  setInterval(() => {
    this.age++;      // `this` is the Person instance
  }, 1000);
}
```

**When NOT to use an arrow function**

```js
const counter = {
  count: 0,
  incArrow: () => { this.count++; },   // `this` is NOT counter
  incNormal() { this.count++; }        // `this` is counter
};

counter.incNormal();
counter.incArrow();
console.log(counter.count); // 1 — only incNormal worked

const Car = () => {};
// new Car(); // TypeError: Car is not a constructor
```

| | Regular function | Arrow function |
| --- | --- | --- |
| Own `this` | Yes — depends on how it is called | No — uses surrounding `this` |
| `arguments` object | Yes | No |
| Can be used with `new` | Yes | No |
| Hoisted (as declaration) | Yes | No (always an expression) |
| Good for object methods | Yes | No |
| Good for callbacks | Needs `bind`/`self` for `this` | Yes |

### Predefined (global) functions

JavaScript has several built-in top-level functions:

| Function | What it does | Example |
| --- | --- | --- |
| `eval()` | Runs JavaScript code from a string (avoid — slow and a security risk) | `eval('2 + 2')` → `4` |
| `isFinite()` | `true` if the value (converted to a number) is a finite number | `isFinite('12')` → `true` |
| `isNaN()` | `true` if the value (converted to a number) is `NaN`. Prefer `Number.isNaN()` | `isNaN('abc')` → `true` |
| `parseFloat()` | Parses a string and returns a decimal number | `parseFloat('3.5kg')` → `3.5` |
| `parseInt()` | Parses a string and returns an integer in the given radix (base) | `parseInt('ff', 16)` → `255` |
| `encodeURI()` | Encodes a full URI, keeping characters like `/ ? & =` | `encodeURI('a b')` → `"a%20b"` |
| `encodeURIComponent()` | Encodes a URI part, including `/ ? & =` | `encodeURIComponent('a&b')` → `"a%26b"` |
| `decodeURI()` | Reverses `encodeURI()` | `decodeURI('a%20b')` → `"a b"` |
| `decodeURIComponent()` | Reverses `encodeURIComponent()` | `decodeURIComponent('a%26b')` → `"a&b"` |

(`uneval()` was a non-standard Firefox-only function and has been removed.)

```js
console.log(isNaN('abc'), Number.isNaN('abc')); // true false
console.log(isFinite('12'), Number.isFinite('12')); // true false — Number.* does not convert

const query = 'rock & roll';
console.log(`/search?q=${encodeURI(query)}`);          // "/search?q=rock%20&%20roll" — & breaks the query
console.log(`/search?q=${encodeURIComponent(query)}`); // "/search?q=rock%20%26%20roll" — correct
```

### More operators

The basic arithmetic, assignment, comparison, logical, bitwise and ternary operators are covered in **Syntax, Variables & Operators**. This section covers the rest.

#### Destructuring assignment

Destructuring extracts values from arrays or objects into variables, using a syntax that mirrors array and object literals.

```js
const foo = ['one', 'two', 'three'];

// without destructuring
const one1 = foo[0];
const two1 = foo[1];

// with destructuring
const [one, two, three] = foo;
console.log(one, two, three); // "one" "two" "three"

// skip items, rest, defaults
const [first, , third] = foo;          // "one", "three"
const [head, ...tail] = foo;           // "one", ["two", "three"]
const [x = 10, y = 20] = [1];          // x = 1, y = 20

// swap without a temp variable
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1
```

```js
const user = { id: 7, name: 'Asha', address: { city: 'Pune' } };

const { name, id } = user;                     // "Asha", 7
const { name: userName } = user;               // rename → userName = "Asha"
const { role = 'guest' } = user;               // default → "guest"
const { address: { city } } = user;            // nested → "Pune"
const { id: _, ...rest } = user;               // rest → { name, address }

function printUser({ name, age = 18 }) {       // destructuring in parameters
  console.log(name, age);
}
printUser(user); // "Asha" 18

// const { a } = null; // TypeError: Cannot destructure property 'a' of 'null'
```

#### Comma operator

The comma operator evaluates each operand from left to right and returns the **last** one. It is mostly used in `for` loops to update several variables; elsewhere, separate statements are clearer.

```js
for (let i = 0, j = 5; i < j; i++, j--) {
  console.log(i, j);
}
// 0 5
// 1 4
// 2 3

const result = (1, 2, 3);
console.log(result); // 3
```

#### delete

The `delete` operator removes a property from an object. It returns `true` if the property is gone (or never existed), and `false` if it cannot be deleted.

```js
delete object.property;
delete object[propertyKey];
```

```js
const myobj = { h: 4 };
console.log(delete myobj.h);   // true — own, configurable property
console.log(myobj.h);          // undefined

console.log(delete Math.PI);   // false — non-configurable property

var y = 43;
console.log(delete y);         // false — variables declared with var/let/const cannot be deleted
```

In non-strict scripts, an implicit global (`x = 42` without a keyword) *can* be deleted. In strict mode, `delete` on a variable is a `SyntaxError`, and deleting a non-configurable property throws a `TypeError`.

**Deleting array elements**

Arrays are objects, so `delete` works on them — but it leaves an empty slot. The length does not change and elements are not re-indexed. Use `splice` instead.

```js
const trees = ['redwood', 'bay', 'cedar'];
delete trees[1];
console.log(trees);        // ["redwood", empty, "cedar"]
console.log(trees.length); // 3

const trees2 = ['redwood', 'bay', 'cedar'];
trees2.splice(1, 1);
console.log(trees2);       // ["redwood", "cedar"]
console.log(trees2.length);// 2
```

#### typeof

`typeof` returns a string with the type of its operand. It does not throw for undeclared variables.

```js
const myFun = new Function('5 + 2');
const shape = 'round';
const size = 1;
const foo2 = ['Apple', 'Mango', 'Orange'];
const today = new Date();

console.log(typeof myFun);       // "function"
console.log(typeof shape);       // "string"
console.log(typeof size);        // "number"
console.log(typeof foo2);        // "object"
console.log(typeof today);       // "object"
console.log(typeof doesntExist); // "undefined" — no ReferenceError
```

#### void

`void` evaluates an expression and always returns `undefined`.

```js
console.log(void 0);          // undefined
console.log(void (2 + 2));    // undefined — expression runs, result discarded

// Historical use in links: <a href="javascript:void(0)">Click</a>

const logOnly = () => void console.log('side effect'); // arrow that never returns a value
console.log(logOnly());       // "side effect", then undefined
```

#### Relational operators: in and instanceof

**`in`** returns `true` if a property (key) exists in an object or its prototype chain.

```js
propNameOrNumber in objectName
```

```js
// Arrays — checks indexes, not values
const trees = ['redwood', 'bay', 'cedar', 'oak', 'maple'];
console.log(0 in trees);        // true
console.log(3 in trees);        // true
console.log(6 in trees);        // false
console.log('bay' in trees);    // false — use trees.includes('bay')
console.log('length' in trees); // true — length is an array property

// Built-in objects
console.log('PI' in Math);      // true
const myString = new String('coral');
console.log('length' in myString); // true
// console.log('length' in 'coral'); // TypeError — right side must be an object

// Custom objects
const mycar = { make: 'Honda', model: 'Accord', year: 1998 };
console.log('make' in mycar);     // true
console.log('toString' in mycar); // true — inherited
console.log(Object.hasOwn(mycar, 'toString')); // false — only own properties
```

**`instanceof`** returns `true` if the constructor's `prototype` is in the object's prototype chain. Use it to check the kind of object at runtime.

```js
const theDay = new Date(1995, 11, 17); // months are 0-based: 11 = December
if (theDay instanceof Date) {
  console.log('It is a Date'); // runs
}

console.log([] instanceof Array);  // true
console.log([] instanceof Object); // true
console.log('text' instanceof String); // false — primitive, not an object
```

**typeof vs instanceof**

| | `typeof` | `instanceof` |
| --- | --- | --- |
| Returns | a string (`"string"`, `"object"`, …) | `true` / `false` |
| Works on primitives | Yes | No (always `false`) |
| Distinguishes arrays/dates | No (all `"object"`) | Yes |
| Example | `typeof 'a'` → `"string"` | `new Date() instanceof Date` → `true` |

#### Operator precedence

From highest to lowest (operators higher in the table run first):

| Operator type | Operators |
| --- | --- |
| grouping | `( )` |
| member / call / new | `.` `[]` `()` `new` `?.` |
| postfix | `x++` `x--` |
| prefix / unary | `!` `~` `+` `-` `++x` `--x` `typeof` `void` `delete` `await` |
| exponent | `**` |
| multiply / divide | `*` `/` `%` |
| add / subtract | `+` `-` |
| bitwise shift | `<<` `>>` `>>>` |
| relational | `<` `<=` `>` `>=` `in` `instanceof` |
| equality | `==` `!=` `===` `!==` |
| bitwise AND | `&` |
| bitwise XOR | `^` |
| bitwise OR | `\|` |
| logical AND | `&&` |
| logical OR / nullish | `\|\|` `??` |
| conditional | `? :` |
| assignment / arrow | `=` `+=` `-=` `*=` `&&=` `\|\|=` `??=` `=>` … |
| comma | `,` |

```js
console.log(1 + 2 * 3);         // 7
console.log(typeof 1 + 2);      // "number2" — typeof runs first: "number" + 2
console.log(typeof (1 + 2));    // "number"
console.log(!true === false);   // true — ! runs before ===
```

### Expressions

An **expression** is any valid piece of code that produces a value (`3 + 4`, `x = 7`, `fn()`, `'a'`). A **statement** performs an action (`if`, `for`, `let x;`).

#### this

`this` refers to the object that is running the current code. In a method, it is usually the object the method was called on. Use it with dot or bracket notation:

```js
this.propertyName
this['propertyName']
```

```js
const user = {
  name: 'Asha',
  hello() {
    return `Hi, ${this.name}`;
  }
};
console.log(user.hello()); // "Hi, Asha" — this = user

const hello = user.hello;
console.log(hello());      // "Hi, undefined" (or TypeError in strict mode) — this is lost
```

(`this` is covered in detail in the next chapter.)

#### Grouping operator

The grouping operator `( )` changes the order of evaluation.

```js
const a = 1, b = 2, c = 3;

console.log(a + b * c);   // 7 — multiplication first
console.log((a + b) * c); // 9 — addition first because of ()
```

#### new

`new` creates an instance of a user-defined or built-in object type.

```js
const objectName = new ObjectType(param1, param2 /* , ..., paramN */);
```

```js
function Car(make) {
  this.make = make;
}
const car = new Car('Honda');
console.log(car.make);             // "Honda"
console.log(car instanceof Car);   // true

const date = new Date(2026, 0, 1);
console.log(date.getFullYear());   // 2026
```

What `new` does:

1.  Creates an empty object.
2.  Sets its prototype to `Car.prototype`.
3.  Runs `Car` with `this` pointing to the new object.
4.  Returns the new object (unless the function returns a different object).

#### super

`super` is used in classes to call the parent class's constructor or methods.

```js
super(arguments);             // call the parent constructor
super.functionOnParent(args); // call a parent method
```

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);              // must be called before using `this`
  }
  speak() {
    return `${super.speak()} — woof`;
  }
}

console.log(new Dog('Rex').speak()); // "Rex makes a sound — woof"
```
