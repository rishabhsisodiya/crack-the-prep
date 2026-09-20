---
title: "Syntax, Variables & Operators"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
order: 1
slug: "basics-syntax"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
description: "JavaScript basics — Syntax, Variables & Operators."
---
### What is JavaScript?

JavaScript is a cross-platform, multi-paradigm (object-oriented, functional and procedural) programming language. In the browser it is used to make web pages interactive — animations, clickable buttons, popup menus, form validation, etc. With Node.js it also runs on servers.

JavaScript was created at Netscape in 1995 by Brendan Eich. It borrows some syntax and naming conventions from Java, and was renamed from "LiveScript" to "JavaScript" as a marketing move tied to a Netscape–Sun partnership — not because the two languages are otherwise related.

JavaScript is standardized by Ecma International as **ECMAScript** (ES). Ecma was formerly an acronym for the *European Computer Manufacturers Association*. Versions are named ES5, ES6/ES2015, ES2016 … and a new version is released every year.

### What JavaScript can do in the browser

1.  **Change HTML content** — find the element with `id="demo"` and change its content (`innerHTML`):

    ```js
    document.getElementById("demo").innerHTML = "Hello JavaScript";
    ```
2.  **Change HTML styles (CSS)**

    ```js
    document.getElementById("demo").style.fontSize = "35px";
    ```
3.  **Hide HTML elements**

    ```js
    document.getElementById("demo").style.display = "none";
    ```

### Synchronous vs asynchronous JavaScript

JavaScript is a **single-threaded, synchronous** language: it runs one statement at a time, in order, on a single call stack. With the help of the **event loop** (and browser/Node APIs such as timers, `fetch`, Promises and `async/await`), it can start slow work and continue running other code, handling the result later. This is asynchronous programming.

```js
console.log('1');
setTimeout(() => console.log('2'), 0); // async — runs after the current code finishes
console.log('3');

// Output:
// 1
// 3
// 2
```

### Adding JavaScript to HTML

#### The `<script>` tag

In HTML, JavaScript code is placed between `<script>` and `</script>` tags.

```html
<script>
  document.getElementById("demo").innerHTML = "My First JavaScript";
</script>
```

Scripts can be placed in the `<body>`, in the `<head>`, or in both. Placing them at the end of `<body>` (or using `defer`) lets the HTML load before the script runs.

#### External JavaScript

```html
<script src="myScript.js"></script>
```

Advantages of external files:

-   Separates HTML and code
-   Makes HTML and JavaScript easier to read and maintain
-   Cached JavaScript files can speed up page loads

### JavaScript output

JavaScript can display data in different ways:

-   Writing into an HTML element, using **innerHTML**.
-   Writing into the HTML output, using **document.write()** (only for testing — calling it after the page has loaded replaces the whole page).
-   Writing into an alert box, using **window.alert()**.
-   Writing into the browser console, using **console.log()**.

### Variables

#### Identifiers (variable names)

The names of variables are called **identifiers** and must follow these rules:

-   Must start with a letter, underscore (`_`) or dollar sign (`$`).
-   Later characters can also be digits (`0-9`).
-   Names are **case-sensitive** — `name` and `Name` are different variables.
-   Reserved words (`let`, `class`, `return`, …) cannot be used.

```js
let userName = 'A';   // valid
let _count = 1;       // valid
let $price = 10;      // valid
// let 1st = 'x';     // SyntaxError — cannot start with a digit
// let let = 5;       // SyntaxError — reserved word

let age = 20;
let Age = 30;
console.log(age, Age); // 20 30 — different variables
```

#### Declarations: `var`, `let` and `const`

There are three keywords for declaring variables:

-   **var** — function-scoped variable, optionally initialized. Can be redeclared.
-   **let** — block-scoped variable, optionally initialized. Cannot be redeclared in the same scope.
-   **const** — block-scoped constant. Must be initialized, and cannot be reassigned.

```js
var a = 1;
let b = 2;
const c = 3;

a = 10;  // OK
b = 20;  // OK
// c = 30; // TypeError: Assignment to constant variable.

var a = 100;   // OK — var can be redeclared
// let b = 200; // SyntaxError: Identifier 'b' has already been declared

// const d;    // SyntaxError: Missing initializer in const declaration
```

**Block scope vs function scope**

```js
if (true) {
  var x = 'var';
  let y = 'let';
  const z = 'const';
}
console.log(x); // "var" — var ignores the block
// console.log(y); // ReferenceError: y is not defined
// console.log(z); // ReferenceError: z is not defined
```

**`const` does not make objects immutable** — only the variable binding is fixed.

```js
const user = { name: 'A' };
user.name = 'B';          // allowed — changing a property
console.log(user.name);   // "B"
// user = {};             // TypeError — reassigning the variable
```

#### Assigning without a keyword (avoid)

Assigning to an undeclared name (`x = 42`) creates a **global variable** in non-strict mode. In strict mode it throws an error, so never use it.

```js
function test() {
  leak = 42;           // no var/let/const
}
test();
console.log(leak);     // 42 — accidentally became global
```

```js
'use strict';          // must be the first statement of the file or function
undeclaredVar = 1;     // ReferenceError: undeclaredVar is not defined
```

**Which one to use?** Use `const` by default, `let` when the value must change, and avoid `var` in modern code.

### Operators

#### Arithmetic operators

| Operator | Description | Example | Result |
| --- | --- | --- | --- |
| `+` | Addition | `5 + 2` | `7` |
| `-` | Subtraction | `5 - 2` | `3` |
| `*` | Multiplication | `5 * 2` | `10` |
| `/` | Division | `5 / 2` | `2.5` |
| `%` | Remainder | `5 % 2` | `1` |
| `**` | Exponentiation | `5 ** 2` | `25` |
| `++` | Increment | `x++` | adds 1 |
| `--` | Decrement | `x--` | subtracts 1 |

**Prefix vs postfix increment**

```js
let i = 5;
console.log(i++); // 5 — returns the old value, then increments
console.log(i);   // 6

let j = 5;
console.log(++j); // 6 — increments first, then returns the new value
```

#### Assignment operators

Assignment operators assign values to variables.

| Operator | Example | Same as |
| --- | --- | --- |
| `=` | `x = y` | `x = y` |
| `+=` | `x += y` | `x = x + y` |
| `-=` | `x -= y` | `x = x - y` |
| `*=` | `x *= y` | `x = x * y` |
| `/=` | `x /= y` | `x = x / y` |
| `%=` | `x %= y` | `x = x % y` |
| `**=` | `x **= y` | `x = x ** y` |
| `&&=` | `x &&= y` | `x && (x = y)` |
| `\|\|=` | `x \|\|= y` | `x \|\| (x = y)` |
| `??=` | `x ??= y` | `x ?? (x = y)` |

```js
let score = 10;
score += 5;   // 15
score *= 2;   // 30

let title = '';
title ||= 'Untitled';  // '' is falsy → "Untitled"

let count = 0;
count ??= 100;         // 0 is not null/undefined → stays 0
console.log(score, title, count); // 30 "Untitled" 0
```

#### String operators

The `+` operator also joins (concatenates) strings.

```js
const txt1 = "John";
const txt2 = "Doe";
const txt3 = txt1 + " " + txt2;
console.log(txt3); // "John Doe"

// Template literals are usually cleaner
console.log(`${txt1} ${txt2}`); // "John Doe"
```

#### Adding strings and numbers

Adding two numbers returns the sum, but if either operand is a string, `+` converts the other one to a string and joins them.

```js
const x = 5 + 5;        // 10
const y = "5" + 5;      // "55"
const z = "Hello" + 5;  // "Hello5"

// Evaluated left to right
console.log(1 + 2 + "3"); // "33" — 1 + 2 = 3, then 3 + "3"
console.log("1" + 2 + 3); // "123" — "1" + 2 = "12", then "12" + 3

// Other arithmetic operators convert strings to numbers
console.log("10" - 2);    // 8
console.log("10" * "2");  // 20
console.log("abc" - 1);   // NaN
```

#### Comparison operators

| Operator | Description |
| --- | --- |
| `==` | equal value (converts types first) |
| `===` | equal value **and** equal type (strict) |
| `!=` | not equal value |
| `!==` | not equal value or not equal type |
| `>` | greater than |
| `<` | less than |
| `>=` | greater than or equal to |
| `<=` | less than or equal to |

```js
console.log(5 == "5");          // true  — "5" converted to 5
console.log(5 === "5");         // false — number vs string
console.log(0 == false);        // true
console.log(0 === false);       // false
console.log(null == undefined); // true
console.log(null === undefined);// false
console.log(NaN == NaN);        // false — NaN is not equal to anything

console.log("10" > 9);          // true  — "10" converted to number
console.log("10" > "9");        // false — both strings, compared character by character ("1" < "9")
```

**Tip:** always prefer `===` and `!==` to avoid surprising type conversion.

#### Conditional (ternary) operator

`condition ? valueIfTrue : valueIfFalse` — a short form of `if...else` that returns a value.

```js
const age = 20;
const status = age >= 18 ? 'adult' : 'minor';
console.log(status); // "adult"
```

#### Logical operators

| Operator | Description |
| --- | --- |
| `&&` | logical AND |
| `\|\|` | logical OR |
| `!` | logical NOT |
| `??` | nullish coalescing |

`&&` and `||` do not always return `true`/`false` — they return **one of the operands** and stop as soon as the result is known (short-circuit).

```js
console.log(true && 'hello');  // "hello" — all truthy → returns the last value
console.log(0 && 'hello');     // 0 — stops at the first falsy value

console.log('' || 'default');  // "default" — returns the first truthy value
console.log('A' || 'default'); // "A"

console.log(!true);            // false
console.log(!!'text');         // true — double NOT converts to boolean

// || vs ?? — ?? only falls back on null/undefined
console.log(0 || 10);          // 10
console.log(0 ?? 10);          // 0
console.log(null ?? 10);       // 10
```

#### Optional chaining (`?.`)

Reads a nested property safely — returns `undefined` instead of throwing when something in the chain is `null` or `undefined`.

```js
const user = { profile: null };
// console.log(user.profile.name); // TypeError: Cannot read properties of null
console.log(user.profile?.name);   // undefined
console.log(user.getName?.());     // undefined — method does not exist
console.log(user.profile?.name ?? 'Guest'); // "Guest"
```

#### Type operators

| Operator | Description |
| --- | --- |
| `typeof` | Returns a string with the type of a value |
| `instanceof` | Returns `true` if the object has the constructor's `prototype` in its prototype chain |

```js
console.log(typeof 42);          // "number"
console.log(typeof 'hi');        // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" — historical bug
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" — use Array.isArray()
console.log(typeof function(){});// "function"

console.log([] instanceof Array);   // true
console.log([] instanceof Object);  // true — Array inherits from Object
console.log('hi' instanceof String);// false — primitives are not instances
```

#### Bitwise operators

Bitwise operators work on **32-bit signed integers**. Each operand is converted to a 32-bit integer, the operation is done bit by bit, and the result is converted back to a JavaScript number.

| Operator | Name | Example | Binary | Result |
| --- | --- | --- | --- | --- |
| `&` | AND | `5 & 1` | `0101 & 0001` = `0001` | `1` |
| `\|` | OR | `5 \| 1` | `0101 \| 0001` = `0101` | `5` |
| `^` | XOR | `5 ^ 1` | `0101 ^ 0001` = `0100` | `4` |
| `~` | NOT | `~5` | flips all 32 bits | `-6` |
| `<<` | Left shift | `5 << 1` | `0101` → `1010` | `10` |
| `>>` | Signed right shift | `5 >> 1` | `0101` → `0010` | `2` |
| `>>>` | Zero-fill right shift | `5 >>> 1` | `0101` → `0010` | `2` |

**Why is `~5` equal to `-6`, not `10`?**
With only 4 bits, `~0101` would be `1010` (10). But JavaScript uses 32-bit **signed** numbers, so all 32 bits are flipped:

```
 5 = 00000000000000000000000000000101
~5 = 11111111111111111111111111111010  → -6 (the leftmost 1 means negative)
```

A quick rule: `~n === -(n + 1)`.

```js
console.log(~5);        // -6
console.log(~-1);       // 0
console.log(-5 >> 1);   // -3 — keeps the sign
console.log(-5 >>> 1);  // 2147483645 — fills with 0, so the result is positive
console.log(6 & 1);     // 0 — even number check: n & 1 is 0 for even, 1 for odd
```

#### Operator precedence (common trap)

```js
console.log(2 + 3 * 4);    // 14 — * runs before +
console.log((2 + 3) * 4);  // 20
console.log(2 ** 3 ** 2);  // 512 — ** is right-to-left: 2 ** 9
console.log(true || false && false); // true — && runs before ||
// console.log(null || undefined ?? 'x'); // SyntaxError — ?? cannot be mixed with || without parentheses
```
