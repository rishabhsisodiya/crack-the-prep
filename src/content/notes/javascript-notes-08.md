---
title: "JavaScript Engine"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 14
description: "JavaScript — JavaScript Engine."
---
![](/notes-img/javascript-notes/img-023.webp)

A **JavaScript engine** is a program that executes JavaScript code by converting it into machine code the computer understands. JavaScript engines in different environments:

-   **V8** — Google Chrome, new Microsoft Edge, and Node.js. Written in C++.
-   **SpiderMonkey** — Firefox. It was the **first** JavaScript engine (created by Brendan Eich at Netscape).
-   **JavaScriptCore** — Safari.
-   **Chakra** — the old (legacy) Microsoft Edge and Internet Explorer.

A JavaScript engine is not a machine — it is just a program written in a high-level language (like C++). JavaScript code goes through 3 major steps inside it:

1.  Parsing
2.  Compilation
3.  Execution

![](/notes-img/javascript-notes/img-024.webp)

### 1. Parsing phase

During parsing, the code we have written is broken down into **tokens**.

```js
let a = 7; // tokens: let, a, =, 7, ;
```

**Syntax parser:** takes the tokens and converts them into an **AST (Abstract Syntax Tree)** — a tree structure representing the code. Syntax errors are found at this stage, which is why a `SyntaxError` stops the whole script before any line runs.

(You can explore the AST at [astexplorer.net](https://astexplorer.net).)

![](/notes-img/javascript-notes/img-025.webp)

### 2. Compilation and 3. Execution phase

-   **Interpreter:** reads the code and executes it **line by line**, without compiling first. It starts running quickly, but the code runs slower.
-   **Compiler:** compiles the **whole** code before executing it, generating optimized machine code. It takes time up front, but the resulting code runs much faster.

So interpreted code **starts faster**, while compiled code **runs faster and more efficiently**.

**JavaScript can behave like both a compiled and an interpreted language** — it depends on the JS engine. When JavaScript was first created it was meant to be interpreted, but modern engines use a **JIT (Just-In-Time) compiler**, which combines an interpreter and a compiler. That's why the compilation and execution phases go hand in hand.

After parsing, the AST goes to the **interpreter**, which converts the high-level code into **bytecode** and starts executing it. While the code runs, the engine watches for "hot" code (functions called many times) and sends it to the **optimizing compiler**, which generates highly optimized machine code at runtime. That's why it is called **Just-In-Time** compilation. If an assumption turns out wrong (e.g. a function suddenly receives a string instead of a number), the engine **de-optimizes** back to bytecode.

In V8, the interpreter is called **Ignition** and the optimizing compiler is called **TurboFan**.

Execution uses 2 main components: the **call stack** and the **memory heap**.

-   **Call stack** — keeps track of execution contexts (which function is running).
-   **Memory heap** — where objects, arrays and functions are stored. The **garbage collector** frees memory in the heap that is no longer reachable, using the **Mark and Sweep** algorithm.

![](/notes-img/javascript-notes/img-026.webp)

From a high-level view, V8 execution consists of 5 steps:

1.  Initialize the environment in the host (browser or Node.js)
2.  Parse and compile the JavaScript code
3.  Generate bytecode
4.  Interpret and execute the bytecode
5.  Optimize frequently used code into machine code for better performance

**Write optimization-friendly code:**

```js
function add(a, b) {
  return a + b;
}

for (let i = 0; i < 100000; i++) add(i, i); // always numbers → V8 optimizes add

add('x', 'y'); // different types → may cause de-optimization
```

### Mark and Sweep algorithm

Any garbage collection algorithm must do 2 basic things:

1.  **Detect** all unreachable objects.
2.  **Reclaim** the heap memory used by those objects, making it available to the program again.

Mark and Sweep does this in two phases:

1.  Mark phase
2.  Sweep phase

#### Mark phase

When an object is created, its mark bit is set to `0` (false). In the mark phase, the mark bit of every **reachable** object (objects the program can still refer to) is set to `1` (true). This is a graph traversal — for example depth-first search. Each object is a node, and from each node we visit all objects it references, until every reachable node has been visited.

A **root** is a variable that refers to an object and is directly accessible — e.g. global variables and local variables on the current call stack. Here we assume there is only one root.

We access the mark bit of an object with `markedBit(obj)`.

**Algorithm — Mark phase:**

```
Mark(root)
  If markedBit(root) = false then
    markedBit(root) = true
    For each v referenced by root
      Mark(v)
```

**Note:** if there is more than one root, call `Mark()` for every root.

#### Sweep phase

As the name suggests, it "sweeps" (clears) the unreachable objects: every object whose mark bit is still `false` is removed from the heap. For reachable objects (mark bit `true`), the mark bit is reset to `false`, so that the next time the garbage collector runs, it can mark reachable objects again from scratch.

**Algorithm — Sweep phase:**

```
Sweep()
  For each object p in heap
    If markedBit(p) = true then
      markedBit(p) = false
    else
      heap.release(p)
```

The mark-and-sweep algorithm is called a **tracing garbage collector**, because it traces the entire collection of objects that are directly or indirectly reachable by the program.

```js
let user = { name: 'Asha' }; // object reachable through `user`
let admin = user;             // two references

user = null;                  // still reachable through admin
admin = null;                 // no references left → unreachable → collected in the next GC

// Cyclic references are handled too
function makeCycle() {
  const a = {};
  const b = {};
  a.ref = b;
  b.ref = a;                  // a and b point to each other
}
makeCycle();                  // after it returns, neither is reachable from a root → both collected
```

#### Advantages of Mark and Sweep

-   It handles **cyclic references**. Even with a cycle, the algorithm never ends up in an infinite loop (already-marked objects are skipped), and unreachable cycles are collected.
-   There is no extra cost while the program runs normally (e.g. no reference counters to update on every assignment).

#### Disadvantages of Mark and Sweep

-   Normal program execution is **paused** while the garbage collector runs ("stop-the-world"). Modern engines reduce this with incremental and concurrent GC.
-   After running many times, reachable objects end up separated by many small unused memory gaps (**fragmentation**). Engines use compaction to fix this.

### Copy elision

Copy elision is a **compiler optimization** (mainly a C++ concept) that avoids making unnecessary copies of objects, for example when returning an object from a function by value. It is not something you control in JavaScript — objects are already passed by reference — but engines written in C++ (like V8) benefit from it internally.

### Inline caching

Let's look at this code:

```js
function printUserName(user) {
  return `Hello ${user.firstName} ${user.lastName}`;
}

const userName = {
  firstName: 'John',
  lastName: 'Doe'
};

for (let i = 0; i < 10000; i++) {
  printUserName(userName);
}
```

We create a function that takes an object and returns a template string, then call it many times with objects that have the same structure.

Reading a property like `user.firstName` normally requires the engine to **look up** where `firstName` is stored inside the object. V8 gives every object a hidden **shape** (also called a hidden class) based on its properties and their order. The first time `printUserName` runs, V8 looks up `firstName` and `lastName` normally and **caches where they are located** for that shape. On the next calls, if the object has the **same shape**, V8 skips the lookup and reads the value directly from the cached location. This is called **inline caching**, and it makes repeated property access much faster.

**Note:** inline caching caches *where the property is*, **not** the result of the function. If `userName.firstName` changes, the function still returns the new value.

**How to write inline-cache-friendly code:**

```js
// Good — same properties, same order → same shape
const u1 = { firstName: 'John', lastName: 'Doe' };
const u2 = { firstName: 'Jane', lastName: 'Roe' };

// Bad — different order or added later → different shapes, slower lookups
const u3 = { lastName: 'Roe', firstName: 'Jane' };
const u4 = { firstName: 'Max' };
u4.lastName = 'Moe';
```

-   Create objects with the same properties in the same order (constructors or classes help).
-   Avoid adding or deleting properties after creation (`delete` changes the shape).
