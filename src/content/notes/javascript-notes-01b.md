---
title: "Data Types, Literals & Control Flow"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
order: 2
slug: "basics-types"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
description: "JavaScript basics — Data Types, Literals & Control Flow."
---
### Data types

The latest ECMAScript standard defines **eight** data types:

-   **Seven primitives:** `Boolean`, `null`, `undefined`, `Number`, `BigInt`, `String`, `Symbol`
-   **One non-primitive:** `Object` (arrays, functions, dates, maps … are all objects)

A **primitive** is a single, immutable value with no methods of its own (JavaScript temporarily wraps it in an object when you call a method like `'hi'.toUpperCase()`). Primitives are copied **by value**; objects are copied **by reference**.

```js
let a = 10;
let b = a;       // copies the value
b = 20;
console.log(a);  // 10 — a is unaffected

let obj1 = { n: 10 };
let obj2 = obj1; // copies the reference
obj2.n = 20;
console.log(obj1.n); // 20 — both point to the same object
```

#### 1. Boolean

[Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean) has two values: `true` and `false`. To convert other values to a boolean, use `Boolean()` (or `!!value`).

```js
console.log(Boolean('Hi'));          // true
console.log(Boolean(''));            // false — empty string
console.log(Boolean(20));            // true
console.log(Boolean(Infinity));      // true
console.log(Boolean(0));             // false
console.log(Boolean({ foo: 100 }));  // true — any object
console.log(Boolean({}));            // true — even an empty object
console.log(Boolean([]));            // true — even an empty array is an object
console.log(Boolean(NaN));           // false
console.log(Boolean(undefined));     // false
console.log(Boolean('0'));           // true — non-empty string
console.log(Boolean(' '));           // true — a space is still a character
console.log(Boolean('false'));       // true — non-empty string
console.log(Boolean(-1));            // true — any non-zero number
console.log(Boolean(function () {}));// true — functions are objects
console.log(Boolean(null));          // false
```

#### 2. null

[null](https://developer.mozilla.org/en-US/docs/Glossary/null) means **"intentionally no value"**. You assign it yourself to say a variable is empty. Because JavaScript is case-sensitive, `null` is not the same as `Null` or `NULL`.

```js
let user = null;

console.log(user);               // null
console.log(typeof null);        // "object" — a long-standing JS quirk
console.log(null === undefined); // false, different types
console.log(null == undefined);  // true, loose equality treats them as equal
console.log(Boolean(null));      // false
console.log(null + 1);           // 1 — null converts to 0 in arithmetic
```

**Q: If `typeof null` is `"object"`, and objects are truthy, why is `Boolean(null)` false?**

Because `null` is **not** an object — it is a primitive. `typeof null === "object"` is a bug from the first version of JavaScript that was never fixed, since changing it would break existing websites.

- In the original engine, values were stored with a type tag; objects had tag `0`. `null` was represented as the NULL pointer (all zeros), so its tag also read as `0` → `typeof` reported `"object"`.
- `Boolean()` does not use `typeof`. It follows the spec's `ToBoolean` rules, which list the falsy values explicitly: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else (including every real object, `[]`, `{}` and functions) is truthy.

```js
console.log(typeof null);            // "object" — historical bug
console.log(null instanceof Object); // false — not actually an object
console.log(Object.getPrototypeOf(Object.prototype) === null); // true — null means "no object"
console.log(Boolean(null));          // false — listed as falsy in ToBoolean
console.log(Boolean({}));            // true — real objects are always truthy

// Safe null check (don't rely on typeof)
const value = null;
console.log(value === null);                              // true
console.log(typeof value === "object" && value !== null); // false — correct "is object" check
```

#### 3. undefined

[undefined](https://developer.mozilla.org/en-US/docs/Glossary/undefined) means **"a value has not been assigned yet"**. JavaScript gives it automatically. The `undefined` type has only one value: `undefined`.

```js
let x;
console.log(x); // undefined — declared but not assigned

function greet(name) {
  console.log(name);
}
greet(); // undefined — missing argument

function noReturn() {}
console.log(noReturn()); // undefined — function without return

let obj = { a: 1 };
console.log(obj.b); // undefined — missing property

console.log(typeof undefined);   // "undefined"
console.log(null == undefined);  // true
console.log(undefined + 1);      // NaN — undefined converts to NaN in arithmetic
```

**`null` vs `undefined`**

| | `null` | `undefined` |
| --- | --- | --- |
| Meaning | intentionally empty | not assigned yet |
| Set by | the developer | JavaScript |
| `typeof` | `"object"` (bug) | `"undefined"` |
| In arithmetic | `0` (`null + 1 → 1`) | `NaN` (`undefined + 1 → NaN`) |
| In JSON | kept (`{"a":null}`) | property is removed |

#### 4. Number

[Number](https://developer.mozilla.org/en-US/docs/Glossary/Number) is used for both integers and decimals (64-bit floating point). For example: `42` or `3.14159`.

```js
console.log(42);                       // 42, integer
console.log(3.14159);                  // 3.14159, floating point
console.log(0.1 + 0.2);                // 0.30000000000000004, floating point precision
console.log(0.1 + 0.2 === 0.3);        // false
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true — safe way to compare decimals
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
console.log(9007199254740992 === 9007199254740993); // true — precision lost beyond the safe range
console.log(typeof 42);                // "number"
console.log(1 / 0);                    // Infinity
console.log(-1 / 0);                   // -Infinity
```

**NaN**

`NaN` stands for "Not a Number". It is a special **number** value that represents an invalid numeric result — for example, dividing a string by a number:

```js
console.log('a' / 2);      // NaN
console.log(typeof NaN);   // "number" — NaN is still of type number
```

`NaN` has two special characteristics:

-   Any arithmetic operation with `NaN` returns `NaN`.
-   `NaN` is not equal to any value, including itself.

```js
console.log(NaN / 2);            // NaN
console.log(NaN == NaN);         // false
console.log(NaN === NaN);        // false

// How to check for NaN
console.log(Number.isNaN(NaN));  // true
console.log(Number.isNaN('abc'));// false — 'abc' is not the NaN value
console.log(isNaN('abc'));       // true — global isNaN converts to number first
console.log(Object.is(NaN, NaN));// true
```

#### 5. BigInt

[BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt) is an integer of any size (arbitrary precision). Create one by adding `n` to the end of an integer or by calling `BigInt()`. For example: `9007199254740993n`.

```js
console.log(9007199254740993n);        // 9007199254740993n — exact, no precision loss
console.log(typeof 10n);               // "bigint"
console.log(BigInt(9007199254740991)); // 9007199254740991n
console.log(10n + 20n);                // 30n
console.log(7n / 2n);                  // 3n — decimals are cut off
console.log(10n === 10);               // false, different types
console.log(10n == 10);                // true, loose equality compares the value

// console.log(Number.MAX_SAFE_INTEGER + 1n); // TypeError: Cannot mix BigInt and other types, use explicit conversions
console.log(BigInt(Number.MAX_SAFE_INTEGER) + 1n); // 9007199254740992n
```

#### 6. String

[String](https://developer.mozilla.org/en-US/docs/Glossary/String) is a sequence of characters that represents text. For example: `"Howdy"`. Strings are **immutable** — string methods return a new string.

```js
console.log('Howdy');               // "Howdy"
console.log("Howdy" + " partner");  // "Howdy partner"
console.log(typeof 'Howdy');        // "string"
console.log('Howdy'.length);        // 5
console.log('Howdy'[0]);            // "H"
console.log(`Total: ${2 + 2}`);     // "Total: 4", template literal
console.log(String(42));            // "42"

let word = 'cat';
word[0] = 'b';                      // ignored — strings cannot be changed in place
console.log(word);                  // "cat"
console.log(word.toUpperCase());    // "CAT" — returns a new string
```

#### 7. Symbol

[Symbol](https://developer.mozilla.org/en-US/docs/Glossary/Symbol) (added in ES2015) is a primitive whose values are **unique** and immutable. Every call to `Symbol()` creates a new, unique value. Symbols are mainly used as object keys that cannot clash with other keys.

```js
console.log(Symbol() == Symbol()); // false

// Same description does NOT mean same symbol
const a = Symbol('id');
const b = Symbol('id');
console.log(a === b);          // false — two separate calls, two unique values
console.log(a.toString());     // "Symbol(id)" — description is only a label
console.log(a === a);          // true — Symbol() ran once; `a` just holds that same value

// Compare with strings: same content = equal
console.log('id' === 'id');    // true

// Practical effect: symbol keys never collide
const user = {};
user[a] = 'from library A';
user[b] = 'from library B';
console.log(user[a]);          // "from library A"
console.log(user[b]);          // "from library B" — both kept, no overwrite

// Need a shared symbol? Use the global registry
console.log(Symbol.for('id') === Symbol.for('id')); // true

// Using symbols as enum-like constants
const statuses = {
  OPEN: Symbol('Open'),
  COMPLETED: Symbol('Completed'),
  CANCELED: Symbol('Canceled')
};

let taskStatus = statuses.COMPLETED;
console.log(taskStatus === statuses.COMPLETED); // true
console.log(taskStatus === 'Completed');        // false — cannot be faked with a string
```

#### 8. Object

[Object](https://developer.mozilla.org/en-US/docs/Glossary/Object) is a collection of key/value pairs — the only non-primitive type. Arrays, functions, dates, `Map` and `Set` are all objects.

```js
let obj = {
  key: 'value'
};
console.log(obj);                    // { key: "value" }
console.log(typeof obj);             // "object"
console.log(typeof []);              // "object", arrays are objects too
console.log(typeof function () {});  // "function", but still an object under the hood

let obj2 = { key: 'value' };
console.log(obj === obj2);           // false, objects compare by reference, not value
```

### Type conversion

JavaScript is a **dynamically typed** language. You don't specify the type of a variable when you declare it, the same variable can hold different types over time, and values are converted automatically when needed.

```js
let answer = 42;
answer = 'Thanks for all the fish...'; // no error — the type can change
console.log(typeof answer);            // "string"
```

#### Implicit conversion (coercion)

With the `+` operator, if one operand is a string, JavaScript converts the other to a string:

```js
console.log('The answer is ' + 42); // "The answer is 42"
console.log(42 + ' is the answer'); // "42 is the answer"
```

With other arithmetic operators (`-`, `*`, `/`, `%`), JavaScript converts strings **to numbers**:

```js
console.log('37' - 7);   // 30  — "-" converts the string to a number
console.log('37' + 7);   // "377" — "+" with a string converts the number to a string
console.log('6' * '2');  // 12
console.log('abc' * 2);  // NaN
console.log(true + 1);   // 2 — true → 1
console.log([] + 1);     // "1" — [] → ""
console.log(+'');        // 0
```

#### Converting strings to numbers

When a number is stored as a string, convert it explicitly:

| Method | `'42px'` | `'3.14'` | `''` | `'abc'` |
| --- | --- | --- | --- | --- |
| [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) | `42` | `3` | `NaN` | `NaN` |
| [`parseFloat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) | `42` | `3.14` | `NaN` | `NaN` |
| `Number()` | `NaN` | `3.14` | `0` | `NaN` |
| Unary `+` | `NaN` | `3.14` | `0` | `NaN` |

```js
console.log(parseInt('42px'));      // 42 — reads digits until the first invalid character
console.log(parseInt('px42'));      // NaN — must start with a number
console.log(parseInt('101', 2));    // 5 — always pass the radix (base) for clarity
console.log(parseFloat('3.14abc')); // 3.14
console.log(Number('42px'));        // NaN — the whole string must be valid
console.log(Number(''));            // 0
console.log(Number(null));          // 0
console.log(Number(undefined));     // NaN
console.log(+'7');                  // 7 — unary plus is a shortcut for Number()

// Classic interview trap
console.log(['1', '2', '3'].map(parseInt)); // [1, NaN, NaN]
// map passes (value, index): parseInt('1', 0) → 1, parseInt('2', 1) → NaN, parseInt('3', 2) → NaN
console.log(['1', '2', '3'].map(Number));   // [1, 2, 3]
```

#### Converting to strings and booleans

```js
console.log(String(123));       // "123"
console.log((123).toString());  // "123"
console.log(String(null));      // "null"
// null.toString();             // TypeError — use String() for null/undefined
console.log(String([1, 2]));    // "1,2"
console.log(String({}));        // "[object Object]"

console.log(Boolean('text'));   // true
console.log(!!0);               // false
```

### Literals

Literals are fixed values that you write directly in your code (not variables). JavaScript has these kinds of literals:

-   Array literals — `[1, 2, 3]`
-   Boolean literals — `true`, `false`
-   Numeric literals — `42`, `0xff`, `3.14`
-   Object literals — `{ a: 1 }`
-   RegExp literals — `/ab+c/`
-   String literals — `'hello'`, `` `hi ${name}` ``

#### Array literals

An array literal is a list of zero or more expressions, each of which represents an array element, enclosed in square brackets (\[\]). When you create an array using an array literal, it is initialized with the specified values as its elements, and its length is set to the number of arguments specified.

The following example creates the coffees array with three elements and a length of three:

```js
var coffees = ['French Roast', 'Colombian', 'Kona'];
```
##### Extra commas in array literals

You do not have to specify all elements in an array literal. If you put two commas in a row, the array is created with undefined for the unspecified elements. The following example creates the fish array:

```js
var fish = ['Lion', , 'Angel'];
```
This array has two elements with values and one empty element (fish\[0\] is "Lion", **fish\[1\] is an empty slot (reads as undefined)**, and fish\[2\] is "Angel").

If you include a trailing comma at the end of the list of elements, the comma is ignored. In the following example, the length of the array is three. There is no myList\[3\]. All other commas in the list indicate a new element.

**Note :** Trailing commas can create errors in older browser versions and it is a best practice to remove them.

```js
var myList = ['home', , 'school', ];
```
In the following example, the length of the array is four, and myList\[0\] and myList\[2\] are missing.

```js
var myList = [ ,'home', , 'school'];
```
In the following example, the length of the array is four, and myList\[1\] and myList\[3\] are missing. **Only the last comma is ignored.**

```js
var myList = ['home', , 'school', , ];
```

##### Tricky array literal questions

**Q1: Is an empty slot the same as `undefined`?**
No. `[ , ]` creates a *hole* (the index does not exist). `[undefined]` creates a real element whose value is `undefined`. Reading either gives `undefined`, but they behave differently.

```js
const holes = [ , ];
const undef = [undefined];

console.log(holes.length, undef.length); // 1 1
console.log(holes[0], undef[0]);         // undefined undefined
console.log(0 in holes);                 // false — index 0 does not exist
console.log(0 in undef);                 // true  — index 0 exists
```

**Q2: What do array methods do with holes?**
`forEach`, `map`, `filter` and `reduce` skip holes. `for...of`, spread and `Array.from` treat them as `undefined`.

```js
const arr = [1, , 3];

arr.forEach(v => console.log(v));  // 1, 3 — hole skipped
console.log(arr.map(v => v * 2));  // [2, empty, 6] — hole kept as a hole
console.log([...arr]);             // [1, undefined, 3] — hole becomes undefined
console.log(arr.filter(() => true)); // [1, 3] — hole removed
console.log(Object.keys(arr));     // ["0", "2"]
```

**Q3: What is the length?**

```js
console.log([,].length);      // 1 — the only comma is a trailing comma
console.log([,,].length);     // 2 — last comma ignored
console.log([1, 2, ,].length); // 3
console.log([].length);       // 0
```

**Q4: `[3]` vs `new Array(3)`?**

```js
console.log([3]);          // [3] — one element, the number 3
console.log(new Array(3)); // [empty × 3] — length 3, no elements
console.log(Array.of(3));  // [3] — use this to avoid the confusion
```

**Q5: Why is `[] == []` false but `[] == ![]` true?**

```js
console.log([] == []);  // false — two different objects (compared by reference)
console.log([] == ![]); // true
// ![] → false (arrays are truthy) → [] == false
// → "" == 0 → 0 == 0 → true
```

**Q6: What happens when you set a far index or change `length`?**

```js
const a = [1, 2];
a[5] = 6;
console.log(a);        // [1, 2, empty × 3, 6]
console.log(a.length); // 6

a.length = 1;
console.log(a);        // [1] — shrinking length deletes elements
```

**Q7: Array to string conversions**

```js
console.log(String([1, [2, [3]]])); // "1,2,3" — nested arrays are flattened by join
console.log([] + []);               // "" — both become empty strings
console.log([] + {});               // "[object Object]"
console.log([1, 2] + [3]);          // "1,23"
console.log([null, undefined] + ''); // "," — null/undefined become empty strings
```

**Q8: Does `indexOf` find `NaN`?**

```js
const nums = [NaN];
console.log(nums.indexOf(NaN));  // -1 — uses ===, and NaN !== NaN
console.log(nums.includes(NaN)); // true — uses SameValueZero
```

**Q9: What does `typeof` say, and how do you check for an array?**

```js
console.log(typeof []);         // "object"
console.log(Array.isArray([])); // true — the reliable check
```

**Q10: Does `const` make an array immutable?**

```js
const list = [1, 2];
list.push(3);        // allowed — contents can change
console.log(list);   // [1, 2, 3]
// list = [];        // TypeError — the variable cannot be reassigned
Object.freeze(list); // makes the contents read-only (shallow)
```
#### Boolean literals

The Boolean type has two literal values: **`true` and `false`**.

Do not confuse the primitive values `true` and `false` with the `Boolean` **object**. `new Boolean(false)` creates a wrapper object, and every object is truthy.

```js
const primitive = false;
const wrapper = new Boolean(false);

console.log(typeof primitive); // "boolean"
console.log(typeof wrapper);   // "object"

if (wrapper) {
  console.log('runs!');        // runs! — an object is always truthy
}
console.log(wrapper == false); // true — == unwraps the value
console.log(wrapper === false);// false — object vs primitive
```

#### Numeric literals

Integers can be written in decimal (base 10), hexadecimal (base 16), octal (base 8) and binary (base 2).

```js
console.log(255);        // 255 — decimal
console.log(0xff);       // 255 — hexadecimal, starts with 0x
console.log(0o377);      // 255 — octal, starts with 0o
console.log(0b11111111); // 255 — binary, starts with 0b
console.log(1_000_000);  // 1000000 — underscores improve readability
console.log(10n);        // 10n — BigInt literal
```

#### Floating-point literals

A floating-point literal can have these parts:

-   An integer part, optionally signed (`+` or `-`)
-   A decimal point (`.`)
-   A fraction (digits after the point)
-   An exponent — `e` or `E` followed by an integer, optionally signed

It must have at least one digit and either a decimal point or an exponent.

```js
console.log(3.1415926);    // 3.1415926
console.log(-.123456789);  // -0.123456789 — leading 0 is optional
console.log(-3.1E+12);     // -3100000000000 — -3.1 × 10¹²
console.log(.1e-23);       // 1e-24 — 0.1 × 10⁻²³
console.log(5e3);          // 5000
// console.log(5.toFixed(2)); // SyntaxError — the dot is read as a decimal point
console.log(5..toFixed(2));  // "5.00" — first dot is the decimal point
console.log((5).toFixed(2)); // "5.00" — clearer
```

#### Object literals

An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces ({}). Do not use an object literal at the beginning of a statement. This will lead to an error or not behave as you expect, because the { will be interpreted as the beginning of a block.

Example

```js
var car = { manyCars: {a: 'Saab', b: 'Jeep'}, 7: 'Mazda' };

console.log(car.manyCars.b); // Jeep

console.log(car[7]); // Mazda
```
Object property names can be any string, including the empty string. If the property name would not be a valid JavaScript [identifier](https://developer.mozilla.org/en-US/docs/Glossary/Identifier) or number, it must be enclosed in quotes. Property names that are not valid identifiers also cannot be accessed as a dot (.) property, but can be accessed and set with the array-like notation("\[\]").

```js
var unusualPropertyNames = {
  '': 'An empty string',
  '!': 'Bang!'
};

console.log(unusualPropertyNames.''); // SyntaxError: Unexpected string

console.log(unusualPropertyNames['']); // An empty string

console.log(unusualPropertyNames.!); // SyntaxError: Unexpected token !

console.log(unusualPropertyNames['!']); // Bang!
```

##### Tricky object literal questions

**Q1: Is a missing property the same as a property set to `undefined`?**
No. Reading either gives `undefined`, but only one of them exists.

```js
const missing = {};
const undef = { a: undefined };

console.log(missing.a, undef.a);  // undefined undefined
console.log('a' in missing);      // false — property does not exist
console.log('a' in undef);        // true  — property exists
console.log(Object.keys(undef));  // ["a"]
console.log(JSON.stringify(undef)); // "{}" — JSON drops undefined values
```

**Q2: Are object keys really numbers?**
No. Every key (except symbols) is converted to a string.

```js
const obj = { 1: 'one', true: 'yes' };
console.log(obj['1']);          // "one" — 1 was stored as "1"
console.log(obj[1] === obj['1']); // true
console.log(Object.keys(obj));  // ["1", "true"]
```

**Q3: What happens when an object is used as a key?**

```js
const a = { id: 1 };
const b = { id: 2 };
const store = {};

store[a] = 'first';
store[b] = 'second';

console.log(store[a]);         // "second" — both keys became "[object Object]"
console.log(Object.keys(store)); // ["[object Object]"]
// Use a Map when you need objects as keys
```

**How we got that output — step by step:**

1. Object keys can only be strings (or symbols). When you write `store[a]`, JavaScript must first turn `a` into a string.
2. It calls `String(a)`, which uses `a.toString()`. Plain objects inherit `Object.prototype.toString`, which always returns `"[object Object]"` — it ignores the contents (`id: 1`).
3. `store[a] = 'first'` therefore becomes `store["[object Object]"] = 'first'`.
4. `b` is converted the same way, so `store[b] = 'second'` becomes `store["[object Object]"] = 'second'` — the **same key**, so `'first'` is overwritten.
5. `store[a]` is converted again to `store["[object Object]"]`, which now holds `'second'`.
6. Only one key was ever created, so `Object.keys(store)` is `["[object Object]"]`.

```js
console.log(String(a));              // "[object Object]"
console.log(String(b));              // "[object Object]"
console.log(String(a) === String(b)); // true — that's why they collide
console.log(store['[object Object]']); // "second" — same as store[a] and store[b]
```

**Q4: Duplicate keys?**
No error — the last one wins.

```js
const user = { name: 'A', name: 'B' };
console.log(user); // { name: "B" }
```

**Q5: In what order are keys listed?**
Integer-like keys first (ascending), then string keys in insertion order, then symbols.

```js
const o = { b: 1, 2: 'x', a: 2, 1: 'y' };
console.log(Object.keys(o)); // ["1", "2", "b", "a"]
```

**Q6: Why is `{} == {}` false?**

```js
console.log({} == {});   // false — two different objects
const x = {};
const y = x;
console.log(x === y);    // true — same reference
y.value = 10;
console.log(x.value);    // 10 — both variables point to one object
```

**Q7: Why does `{}` at the start of a statement behave strangely?**
`{` at the start is read as a block, not an object.

```js
// {} + []   → 0 in the console: {} is an empty block, then +[] → 0
console.log({} + []);  // "[object Object]" — inside an expression it is an object

// Arrow functions returning an object need parentheses
const bad  = () => { a: 1 };   // returns undefined — { } is a function body, "a:" is a label
const good = () => ({ a: 1 }); // returns { a: 1 }
console.log(bad(), good());    // undefined { a: 1 }
```

**Q8: Computed keys and shorthand**

```js
const field = 'email';
const name = 'Rishabh';

const profile = {
  name,                 // shorthand for name: name
  [field]: 'a@b.com',   // computed key → email
  [`${field}Verified`]: true,
  greet() { return 'hi'; } // method shorthand
};

console.log(profile); // { name: "Rishabh", email: "a@b.com", emailVerified: true, greet: ƒ }
```

More computed key and shorthand examples:

```js
// 1. Expression inside [] is evaluated first
let i = 0;
const seq = { [`item${++i}`]: 'a', [`item${++i}`]: 'b' };
console.log(seq); // { item1: "a", item2: "b" }

// 2. Computed key is still converted to a string
const calc = { [1 + 2]: 'three', [[1, 2]]: 'array', [{}]: 'object' };
console.log(Object.keys(calc)); // ["3", "1,2", "[object Object]"]

// 3. Dynamic update in a form handler (common in React)
const form = { name: '', email: '' };
function onChange(field, value) {
  return { ...form, [field]: value }; // only the changed field is replaced
}
console.log(onChange('email', 'x@y.com')); // { name: "", email: "x@y.com" }

// 4. Building an object from an array
const roles = ['admin', 'editor'];
const flags = roles.reduce((acc, role) => ({ ...acc, [role]: true }), {});
console.log(flags); // { admin: true, editor: true }

// 5. Computed key with a symbol
const secret = Symbol('secret');
const vault = { [secret]: 42 };
console.log(vault[secret]);    // 42
console.log(Object.keys(vault)); // [] — symbol keys are hidden

// 6. Shorthand needs a variable with that name
const age = 30;
const person = { age };        // { age: 30 }
// const bad = { height };     // ReferenceError: height is not defined

// 7. Shorthand captures the value at creation time
let count = 1;
const snapshot = { count };
count = 99;
console.log(snapshot.count);   // 1 — later changes to the variable don't affect it

// 8. Computed method names and getters
const action = 'save';
const api = {
  [action]() { return 'saved'; },         // method named "save"
  [`${action}All`]() { return 'all saved'; },
  get [`${action}Count`]() { return 3; }  // computed getter
};
console.log(api.save(), api.saveAll(), api.saveCount); // "saved" "all saved" 3

// 9. Method shorthand vs arrow — `this` differs
const counter = {
  value: 10,
  short() { return this.value; },  // `this` is counter
  arrow: () => this?.value         // `this` from outer scope
};
console.log(counter.short(), counter.arrow()); // 10 undefined

// 10. Shorthand method cannot be used with `new`
const factory = {
  normal: function () {},
  short() {}
};
new factory.normal();   // works
// new factory.short(); // TypeError: factory.short is not a constructor

// 11. Duplicate computed keys — last one wins
const k = 'x';
const dup = { x: 1, [k]: 2 };
console.log(dup); // { x: 2 }
```

##### Getters and setters — a function that behaves like a property

A **getter** (`get`) is a function that runs automatically when you *read* a property. A **setter** (`set`) runs when you *assign* to it. You use them without `()`.

```js
const user = {
  firstName: 'Rishabh',
  lastName: 'Sisodiya',

  // normal method — must be called
  getFullName() { return `${this.firstName} ${this.lastName}`; },

  // getter — read like a property
  get fullName() { return `${this.firstName} ${this.lastName}`; },

  // setter — runs on assignment
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
};

console.log(user.getFullName()); // "Rishabh Sisodiya" — method needs ()
console.log(user.fullName);      // "Rishabh Sisodiya" — getter, no ()
// user.fullName();              // TypeError: user.fullName is not a function

user.fullName = 'John Doe';      // calls the setter with "John Doe"
console.log(user.firstName);     // "John"
```

**Why use a getter instead of a normal property?**
The value is computed *every time* it is read, so it is always up to date.

```js
const cart = {
  items: [100, 250],
  total: 350,                          // plain property — stored once
  get liveTotal() {                    // getter — recalculated on each read
    return this.items.reduce((sum, p) => sum + p, 0);
  }
};

cart.items.push(50);
console.log(cart.total);     // 350 — stale
console.log(cart.liveTotal); // 400 — always correct
```

**Getter with no setter is read-only**

```js
const circle = {
  radius: 2,
  get area() { return Math.PI * this.radius ** 2; }
};

circle.area = 100;           // ignored (TypeError in strict mode)
console.log(circle.area);    // 12.566... — still computed from radius
circle.radius = 3;
console.log(circle.area);    // 28.274... — updates automatically
```

**Setter for validation**

```js
const account = {
  _balance: 0,                          // "_" = convention for internal value
  get balance() { return this._balance; },
  set balance(amount) {
    if (amount < 0) throw new Error('Balance cannot be negative');
    this._balance = amount;
  }
};

account.balance = 500;
console.log(account.balance); // 500
// account.balance = -10;     // Error: Balance cannot be negative
```

**Common mistake — infinite recursion**
Inside a getter/setter, don't use the same property name, or it calls itself forever.

```js
const bad = {
  get value() { return this.value; }   // reads itself → RangeError: Maximum call stack size exceeded
};
const good = {
  _value: 1,
  get value() { return this._value; }  // reads a different key
};
```

**Now the computed getter from the example above**
`get [expression]()` is the same getter — only the *name* is computed.

```js
const action = 'save';
const api = {
  get [`${action}Count`]() { return 3; }
};
// Step 1: `${action}Count` → "saveCount"
// Step 2: becomes  get saveCount() { return 3; }
console.log(api.saveCount);   // 3 — read like a property, the function runs behind the scenes
// api.saveCount();           // TypeError: api.saveCount is not a function
```

**How to tell a getter from a normal value**

```js
console.log(Object.getOwnPropertyDescriptor(api, 'saveCount'));
// { get: ƒ, set: undefined, enumerable: true, configurable: true }  — no "value", has "get"

console.log(Object.getOwnPropertyDescriptor({ a: 1 }, 'a'));
// { value: 1, writable: true, enumerable: true, configurable: true }
```

**Things to remember**
- A getter takes no parameters; a setter takes exactly one.
- `JSON.stringify` and spread (`{...obj}`) call the getter and copy the *result*, not the getter itself.
- Use getters for derived values (full name, totals, area); avoid heavy work inside them since they run on every read.

**Q9: Does spread copy nested objects?**
No — it is a shallow copy.

```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };

copy.a = 100;
copy.nested.b = 200;

console.log(original.a);        // 1   — top level copied
console.log(original.nested.b); // 200 — nested object is shared
// Use structuredClone(original) for a deep copy

console.log({ ...{ a: 1 }, ...{ a: 2 } }); // { a: 2 } — later spread wins
```

**Q10: Does `const` make an object immutable?**

```js
const config = { debug: false };
config.debug = true;        // allowed
// config = {};             // TypeError — cannot reassign

Object.freeze(config);
config.debug = false;       // silently ignored (TypeError in strict mode)
console.log(config.debug); // true
```

**Q11: What does `this` refer to in an object literal?**

```js
const counter = {
  count: 5,
  normal() { return this.count; },
  arrow: () => this.count
};

console.log(counter.normal()); // 5 — `this` is counter
console.log(counter.arrow());  // undefined — arrow functions do not get their own `this`

const fn = counter.normal;
console.log(fn());             // undefined (TypeError in strict mode) — `this` is lost when the method is detached
```

**Q12: What happens when an array is used as a key?**
The array is converted with `join(',')`, so different arrays can land on the same key.

```js
const map = {};
map[[1, 2]] = 'array';
console.log(map['1,2']);    // "array" — key is the string "1,2"
console.log(map[[1, 2]]);   // "array" — a new array, but same string
map[['1,2']] = 'string in array';
console.log(map[[1, 2]]);   // "string in array" — overwritten
map[[]] = 'empty';
console.log(Object.keys(map)); // ["1,2", ""] — [] becomes ""
```

**Q13: What if the object used as a key has its own `toString`?**
JavaScript calls it to build the key.

```js
const userA = { id: 1, toString() { return 'user-1'; } };
const userB = { id: 2, toString() { return 'user-2'; } };
const cache = {};

cache[userA] = 'A';
cache[userB] = 'B';

console.log(cache[userA]);      // "A" — no collision now
console.log(Object.keys(cache)); // ["user-1", "user-2"]
console.log(cache['user-1']);   // "A" — any value turning into "user-1" matches
```

**Q14: What about `null`, `undefined` and booleans as keys?**

```js
const o = {};
o[null] = 'n';
o[undefined] = 'u';
o[true] = 't';

console.log(o.null);      // "n" — key is the string "null"
console.log(o['undefined']); // "u"
console.log(o.true);      // "t"

let key;                  // forgot to assign
o[key] = 'oops';
console.log(o.undefined); // "oops" — silently overwrote the "undefined" key
```

**Q15: Which number keys collide?**
The key is `String(number)`, so values that print the same collide and values that print differently do not.

```js
const n = {};
n[1] = 'a';
n[1.0] = 'b';   // String(1.0) → "1"
n['1.0'] = 'c'; // stays "1.0"
n[-0] = 'd';    // String(-0) → "0"
n[1e3] = 'e';   // String(1e3) → "1000"

console.log(Object.keys(n)); // ["0", "1", "1000", "1.0"]
console.log(n[1]);           // "b" — 1.0 overwrote 1
console.log(n[0]);           // "d"
```

**Q16: Are symbol keys converted to strings too?**
No. Symbols stay symbols, so they never collide — but most key listings skip them.

```js
const id = Symbol('id');
const item = { [id]: 123, name: 'pen' };

console.log(item[id]);                   // 123
console.log(item['id']);                 // undefined — not the string "id"
console.log(Object.keys(item));          // ["name"] — symbol hidden
console.log(JSON.stringify(item));       // '{"name":"pen"}' — symbol dropped
console.log(Object.getOwnPropertySymbols(item)); // [Symbol(id)]
```

**Q17: Why does `obj['a.b']` not read a nested property?**
Brackets take the whole string as one key; dots are not parsed.

```js
const settings = { a: { b: 1 }, 'a.b': 2 };
console.log(settings.a.b);    // 1 — nested access
console.log(settings['a.b']); // 2 — a single key named "a.b"
```

**Q18: Why can't I store a key called `__proto__`?**
In an object literal, `__proto__: value` sets the prototype instead of creating a property.

```js
const safe = { __proto__: { isAdmin: true } };

console.log(Object.keys(safe)); // [] — no own property, prototype was changed
console.log(safe.isAdmin);      // true — inherited from the prototype

const dict = Object.create(null); // object with no prototype
dict['__proto__'] = 'value';
console.log(Object.keys(dict));  // ["__proto__"] — stored as a normal key
// Or simply use a Map for user-supplied keys
```

**Q19: The same idea with `Map` — does it fix all of the above?**
Yes. `Map` keeps keys as they are, using reference/SameValueZero comparison.

```js
const a = { id: 1 };
const b = { id: 1 };
const m = new Map();

m.set(a, 'A');
m.set(b, 'B');
m.set(1, 'number');
m.set('1', 'string');

console.log(m.get(a), m.get(b)); // "A" "B" — different objects, different keys
console.log(m.get({ id: 1 }));   // undefined — new object, new reference
console.log(m.get(1), m.get('1')); // "number" "string" — no string conversion
console.log(m.size);             // 4
```

#### RegExp literals

A regular expression literal is a pattern enclosed between slashes, optionally followed by flags. It is covered in detail in [Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

```js
const re = /ab+c/;           // "a", one or more "b", then "c"
console.log(re.test('abbc')); // true
console.log(re.test('ac'));   // false

const email = /^\S+@\S+\.\S+$/i; // i = case-insensitive flag
console.log(email.test('A@B.COM')); // true

console.log('a-b-c'.replace(/-/g, '+')); // "a+b+c" — g = replace all matches
```

#### String literals

A string literal is zero or more characters enclosed in double (`"`) or single (`'`) quotes. Both quotes must be of the same type.

```js
const s1 = 'foo';
const s2 = "bar";
const s3 = '1234';                     // a string, not a number
const s4 = 'one line \n another line'; // \n is a line break
const s5 = "John's cat";               // single quote inside double quotes
// const bad = 'John's cat';           // SyntaxError — quote ends the string early
```

##### Template literals

ES2015 added **template literals**, enclosed in back-ticks (`` ` ``). They support:

-   **String interpolation** — insert any expression with `${...}`
-   **Multiline strings** — line breaks are kept as written
-   **Tagged templates** — a function processes the string parts and values

```js
// Basic
console.log(`In JavaScript '\n' is a line-feed.`);

// Multiline
const poem = `Roses are red,
Violets are blue.`;
console.log(poem);
// Roses are red,
// Violets are blue.

// Interpolation
const name = 'Bob', time = 'today';
console.log(`Hello ${name}, how are you ${time}?`); // "Hello Bob, how are you today?"
console.log(`2 + 3 = ${2 + 3}`);                     // "2 + 3 = 5" — any expression works
console.log(`Status: ${name ? 'known' : 'guest'}`);  // "Status: known"
```

**Tagged templates** — the tag function receives the string pieces and the values separately, so it can escape or format them (e.g. to avoid injection attacks).

```js
function highlight(strings, ...values) {
  // strings: ["Hello ", ", you are ", " years old"]
  // values:  ["Bob", 30]
  return strings.reduce((out, str, i) =>
    out + str + (i < values.length ? `[${values[i]}]` : ''), '');
}

const age = 30;
console.log(highlight`Hello ${name}, you are ${age} years old`);
// "Hello [Bob], you are [30] years old"
```

##### Escaping characters

A backslash (`\`) before a character gives it a special meaning or lets you use a quote inside a string. This is called **escaping**.

| Code | Meaning |
| --- | --- |
| `\n` | new line |
| `\t` | tab |
| `\\` | backslash |
| `\'` | single quote |
| `\"` | double quote |
| `` \` `` | back-tick |
| `\u00A9` | Unicode character (©) |

```js
const quote = "He read \"The Cremation of Sam McGee\" by R.W. Service.";
console.log(quote); // He read "The Cremation of Sam McGee" by R.W. Service.

const home = 'c:\\temp';
console.log(home);  // c:\temp — "\\" becomes one backslash

console.log('Tab:\tEnd');   // Tab:    End
console.log('\u00A9 2026'); // © 2026
console.log('\d');          // "d" — unknown escapes just drop the backslash (avoid this)
```

A backslash at the end of a line continues the string on the next line. The backslash and line break are **not** part of the value:

```js
const str = 'this string \
is broken \
across multiple \
lines.';
console.log(str); // "this string is broken across multiple lines."
```

Before template literals, multiline text needed `\n` plus a line continuation:

```js
const oldPoem = 'Roses are red,\n\
Violets are blue.';

const newPoem = `Roses are red,
Violets are blue.`;

console.log(oldPoem === newPoem); // true
```

### Control flow

#### Block statement

A block statement groups statements together. It is delimited by a pair of curly brackets:

```js
{
  statement_1;
  statement_2;
  // ...
  statement_n;
}
```

`let` and `const` are scoped to the block; `var` is not.

```js
var x = 1;
{
  var x = 2;   // same variable
}
console.log(x); // 2

let y = 1;
{
  let y = 2;   // new variable, only inside the block
}
console.log(y); // 1
```

#### Conditional statements

A conditional statement runs code only if a condition is true. JavaScript has two: `if...else` and `switch`.

##### if...else

```js
function grade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 75) {
    return 'B';
  } else {
    return 'C';
  }
}

console.log(grade(95)); // "A"
console.log(grade(80)); // "B"
console.log(grade(40)); // "C"
```

**Common mistake — `=` instead of `===`**

```js
let role = 'user';
if (role = 'admin') {       // assigns 'admin', which is truthy
  console.log('Welcome admin'); // always runs!
}
console.log(role);          // "admin" — the variable was changed
```

##### switch

`switch` compares a value against each `case` using **strict equality (`===`)**. Without `break`, execution "falls through" into the next case.

```js
function dayType(day) {
  switch (day) {
    case 'Sat':
    case 'Sun':            // grouped cases
      return 'Weekend';
    case 'Mon':
      return 'Start of week';
    default:
      return 'Weekday';
  }
}

console.log(dayType('Sun')); // "Weekend"
console.log(dayType('Tue')); // "Weekday"
```

```js
// Fall-through when break is missing
const n = 1;
switch (n) {
  case 1:
    console.log('one');
  case 2:
    console.log('two');
    break;
  case 3:
    console.log('three');
}
// Output:
// one
// two

// switch uses ===
switch ('1') {
  case 1:
    console.log('number');
    break;
  default:
    console.log('no match'); // "no match" — '1' !== 1
}
```

#### Falsy values

These values are treated as `false` in a condition (**falsy**):

-   `false`
-   `0`, `-0` and `0n` (BigInt zero)
-   `""` (empty string)
-   `null`
-   `undefined`
-   `NaN`

**Every other value is truthy**, including all objects, `[]`, `{}`, `"0"`, `"false"` and `" "`.

```js
const values = [false, 0, -0, 0n, '', null, undefined, NaN, '0', 'false', ' ', [], {}];
values.forEach(v => console.log(v, '→', v ? 'truthy' : 'falsy'));
// false → falsy, 0 → falsy, -0 → falsy, 0n → falsy, '' → falsy,
// null → falsy, undefined → falsy, NaN → falsy,
// '0' → truthy, 'false' → truthy, ' ' → truthy, [] → truthy, {} → truthy
```

**Caution:** do not confuse the primitive booleans with the `Boolean` object:

```js
const b = new Boolean(false);
if (b) console.log('truthy');  // "truthy" — b is an object
console.log(b == true);        // false — b's value is false

// Another trap: [] is truthy, but [] == false is true
if ([]) console.log('[] is truthy'); // runs
console.log([] == false);            // true — [] → "" → 0, false → 0
```

### Exception handling

You throw an exception with `throw` and handle it with `try...catch...finally`.

#### throw statement

You can throw any value, but throwing an `Error` object is best because it includes a `message` and a stack trace.

```js
// throw 'Error2';   // String
// throw 42;         // Number
// throw true;       // Boolean
// throw { toString() { return "I'm an object!"; } }; // Object

try {
  throw new Error('Something went wrong');
} catch (e) {
  console.log(e.name);    // "Error"
  console.log(e.message); // "Something went wrong"
}
```

Built-in error types include `Error`, `TypeError`, `ReferenceError`, `SyntaxError` and `RangeError`.

```js
try { null.x; }           catch (e) { console.log(e.name); } // "TypeError"
try { notDefined; }       catch (e) { console.log(e.name); } // "ReferenceError"
try { new Array(-1); }    catch (e) { console.log(e.name); } // "RangeError"
try { JSON.parse('{'); }  catch (e) { console.log(e.name); } // "SyntaxError"
```

#### Custom error types

The old way uses a constructor function:

```js
function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

// Make the exception print nicely when converted to a string
UserException.prototype.toString = function () {
  return `${this.name}: "${this.message}"`;
};

try {
  throw new UserException('Value too high');
} catch (e) {
  console.log(String(e)); // UserException: "Value too high"
}
```

The modern way extends `Error` with a class (this also gives a stack trace and makes `instanceof Error` true):

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

try {
  throw new ValidationError('Email is required', 'email');
} catch (e) {
  console.log(e instanceof ValidationError); // true
  console.log(e instanceof Error);           // true
  console.log(`${e.name} on ${e.field}: ${e.message}`);
  // "ValidationError on email: Email is required"
}
```

#### try...catch statement

Code in `try` runs first. If it throws, control jumps straight to `catch` with the thrown value; the rest of `try` is skipped.

```js
function getMonthName(mo) {
  mo = mo - 1; // adjust for array index (1 = Jan, 12 = Dec)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (months[mo]) {
    return months[mo];
  } else {
    throw new Error('InvalidMonthNo');
  }
}

let monthName;
try {
  monthName = getMonthName(15); // throws
  console.log('never printed');  // skipped
} catch (e) {
  monthName = 'unknown';
  console.log(e.message);        // "InvalidMonthNo"
}
console.log(monthName);          // "unknown"
```

`try...catch` only catches errors thrown **synchronously** inside it:

```js
try {
  setTimeout(() => { throw new Error('late'); }, 0);
} catch (e) {
  console.log('caught');  // never runs — the callback runs after try...catch has finished
}

// For async code, catch inside the async function
async function load() {
  try {
    await Promise.reject(new Error('failed'));
  } catch (e) {
    console.log(e.message); // "failed"
  }
}
load();
```

#### finally block

The `finally` block runs after `try` and `catch`, **whether or not** an exception was thrown — even if there is a `return` in `try` or `catch`. It is used for cleanup (closing files, hiding loaders, etc.).

```js
function readFile() {
  try {
    console.log('open');
    return 'data';
  } finally {
    console.log('close');  // still runs before the function returns
  }
}
console.log(readFile());
// Output:
// open
// close
// data
```

If `finally` itself returns a value, it **overrides** any `return` or `throw` from `try`/`catch`:

```js
function f() {
  try {
    throw 'bogus';
  } catch (e) {
    console.log('caught inner "bogus"');
    throw e; // paused until finally finishes
  } finally {
    return false; // overrides the throw above
  }
}

try {
  console.log(f());
} catch (e) {
  // never reached — finally returned false, so the throw was discarded
  console.log('caught outer "bogus"');
}

// Output:
// caught inner "bogus"
// false
```

**Avoid `return` inside `finally`** — it silently swallows errors.

### Loops and iteration

#### for statement

A `for` loop repeats until its condition becomes false.

```js
for (initialization; condition; afterthought) {
  // statements
}
```

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// 0
// 1
// 2
```

**Interview trap — `var` vs `let` in loops with callbacks**

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0);
}
// var 3, var 3, var 3 — one shared i, already 3 when callbacks run

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0);
}
// let 0, let 1, let 2 — a new j for each iteration
```

#### while statement

A `while` loop runs **as long as** the condition is true. The condition is checked **before** each iteration, so the body may run zero times.

```js
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
// 0
// 1
// 2

let n = 10;
while (n < 3) {
  console.log('never runs');
}
```

#### do...while statement

A `do...while` loop checks the condition **after** each iteration, so the body always runs **at least once**.

```js
let k = 10;
do {
  console.log(k); // 10 — runs once even though 10 < 3 is false
  k++;
} while (k < 3);
```

#### break statement

`break` exits a loop or `switch` immediately.

-   Without a label, it exits the innermost `while`, `do...while`, `for` or `switch`.
-   With a label, it exits the labeled statement (useful for nested loops).

```js
for (let i = 0; i < 10; i++) {
  if (i === 3) break;
  console.log(i);
}
// 0
// 1
// 2
```

```js
// Labeled break — exit both loops at once
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer;
    console.log(i, j);
  }
}
// 0 0
// 0 1
// 0 2
// 1 0
```

#### continue statement

`continue` skips the rest of the current iteration and moves to the next one (it does not end the loop).

-   In a `while` loop, it jumps back to the condition.
-   In a `for` loop, it jumps to the afterthought (`i++`).
-   With a label, it continues the labeled loop.

```js
for (let i = 0; i < 5; i++) {
  if (i % 2 === 0) continue; // skip even numbers
  console.log(i);
}
// 1
// 3
```

```js
// Trap — continue in a while loop can skip the increment
let i = 0;
while (i < 3) {
  // if (i === 1) continue; // infinite loop! i++ below is never reached
  i++;
}
```

```js
// Labeled continue
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer; // go to the next i
    console.log(i, j);
  }
}
// 0 0
// 1 0
// 2 0
```

#### for...in statement

`for...in` loops over the **enumerable property names (keys)** of an object, including inherited ones.

```js
const car = { make: 'Honda', model: 'Accord' };
for (const key in car) {
  console.log(key, car[key]);
}
// make Honda
// model Accord

// Inherited properties are included
const base = { inherited: true };
const child = Object.create(base);
child.own = 1;
for (const key in child) console.log(key); // "own", "inherited"
console.log(Object.keys(child));            // ["own"] — only own keys
```

Avoid `for...in` on arrays — keys are strings and extra properties are included.

#### for...of statement

`for...of` loops over the **values** of an iterable (Array, String, Map, Set, `arguments`, NodeList, …). Plain objects are not iterable.

```js
const arr = [3, 5, 7];
arr.foo = 'hello';

for (const i in arr) {
  console.log(i); // "0", "1", "2", "foo" — keys (as strings)
}

for (const v of arr) {
  console.log(v); // 3, 5, 7 — values only
}
```

```js
for (const ch of 'hi') console.log(ch);       // "h", "i"

const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) console.log(key, value); // a 1, b 2

for (const [index, value] of ['x', 'y'].entries()) {
  console.log(index, value);                  // 0 "x", 1 "y"
}

// for (const v of { a: 1 }) {}  // TypeError: {a: 1} is not iterable
for (const v of Object.values({ a: 1 })) console.log(v); // 1
```

| | `for...in` | `for...of` |
| --- | --- | --- |
| Gives you | keys (strings) | values |
| Works on | any object | iterables only |
| Includes inherited keys | yes | no |
| Best for | plain objects | arrays, strings, Map, Set |
