---
title: "Data Structures"
part: "DSA"
track: "dsa"
kind: "notes"
updated: "2026-09-06"
source: "JavaScript Notes.docx"
draft: false
order: 2
slug: "data-structures"
description: "Arrays, objects, sets, maps, stacks, queues, linked lists, hash tables, trees and graphs — with clean JavaScript implementations and complexity."
---

A data structure is a way to organise data so the operations you need — insert, delete, search, traverse — are efficient. They're **linear** (arrays, linked lists, stacks, queues) or **non-linear** (trees, graphs), and in JavaScript you build them from arrays, objects, `Map`/`Set`, and classes.

## Built-in collections

### Array

- Ordered, index-based, resizable, can mix types.
- Zero-indexed; insertion order preserved; iterable (`for…of`).
- Access by index O(1); `push`/`pop` O(1); `shift`/`unshift` O(n); `indexOf`/`includes` O(n); `splice` O(n).

### Object

- Unordered collection of string/symbol keys to any value.
- Access/insert/delete by key O(1) average.
- Has a prototype (so default keys like `toString` can collide); not iterable directly — use `Object.keys/values/entries`.

### Set

- Collection of **unique** values, any type, no guaranteed order.
- `add`, `has`, `delete`, `size` — all O(1) average. Iterable.

```js
const s = new Set([1, 2, 3, 3]);   // {1, 2, 3}
s.add(4);
s.has(2);                          // true
s.delete(2);
[...s];                            // [1, 3, 4]
```

### Map

- Ordered key–value pairs; **keys can be any type** (including objects).
- `set`, `get`, `has`, `delete`, `size` — O(1) average. Iterable in insertion order.

```js
const m = new Map();
m.set('name', 'John').set(1, 'one').set(true, 'bool');
m.get(1);        // 'one'
m.has('age');    // false
m.size;          // 3
```

### Object vs Map

| | Object | Map |
|---|---|---|
| Key types | string / symbol | any |
| Order | not guaranteed (roughly insertion for string keys) | insertion order |
| Size | `Object.keys(o).length` | `m.size` |
| Iteration | not directly iterable | iterable |
| Default keys | inherits from prototype | none |
| Use for | records with known shape, JSON | dynamic keyed data, non-string keys, frequent add/remove |

## Stack (LIFO)

Last in, first out. Operations: `push`, `pop`, `peek` — all O(1).

### Backed by an array

```js
class Stack {
  #items = [];
  push(el) { this.#items.push(el); }
  pop() { return this.#items.pop(); }
  peek() { return this.#items[this.#items.length - 1]; }
  isEmpty() { return this.#items.length === 0; }
  size() { return this.#items.length; }
  clear() { this.#items = []; }
}
```

### Backed by an object (avoids array resizing)

```js
class Stack {
  #items = {};
  #count = 0;
  push(el) { this.#items[this.#count++] = el; }
  pop() {
    if (this.isEmpty()) return undefined;
    const el = this.#items[--this.#count];
    delete this.#items[this.#count];
    return el;
  }
  peek() { return this.#items[this.#count - 1]; }
  isEmpty() { return this.#count === 0; }
  size() { return this.#count; }
}
```

**Uses:** undo/redo, expression evaluation, DFS, call-stack simulation, balanced-parentheses checks.

## Queue (FIFO)

First in, first out. Elements enter at the **rear** and leave from the **front**. Operations: `enqueue`, `dequeue`, `front` — all O(1) with the object/index implementation.

### Backed by an array (simple but `shift` is O(n))

```js
class Queue {
  #items = [];
  enqueue(el) { this.#items.push(el); }
  dequeue() { return this.#items.shift(); }   // O(n)
  front() { return this.#items[0]; }
  isEmpty() { return this.#items.length === 0; }
  size() { return this.#items.length; }
}
```

### Backed by an object with head/tail indices — O(1) dequeue

```js
class Queue {
  #items = {};
  #head = 0;
  #tail = 0;
  enqueue(el) { this.#items[this.#tail++] = el; }
  dequeue() {
    if (this.isEmpty()) return undefined;
    const el = this.#items[this.#head];
    delete this.#items[this.#head++];
    return el;
  }
  front() { return this.#items[this.#head]; }
  isEmpty() { return this.#head === this.#tail; }
  size() { return this.#tail - this.#head; }
}
```

### Circular queue (fixed-size ring buffer)

Reuses freed slots with modular indices — O(1) everything, bounded memory.

```js
class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.head = 0;
    this.count = 0;
  }
  enqueue(el) {
    if (this.count === this.capacity) return false;
    this.items[(this.head + this.count) % this.capacity] = el;
    this.count++;
    return true;
  }
  dequeue() {
    if (this.count === 0) return undefined;
    const el = this.items[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return el;
  }
  front() { return this.count ? this.items[this.head] : undefined; }
  isFull() { return this.count === this.capacity; }
  isEmpty() { return this.count === 0; }
}
```

**Uses:** BFS, task/print/message queues, request buffering, rate limiting (sliding window).

## Linked List

A chain of nodes, each holding a value and a pointer to the next node. No random access (search is O(n)), but O(1) insert/delete once you have the node.

### Singly linked list (head only)

```js
class Node {
  constructor(value) { this.value = value; this.next = null; }
}

class LinkedList {
  constructor() { this.head = null; this.size = 0; }

  prepend(value) {                     // O(1)
    this.head = Object.assign(new Node(value), { next: this.head });
    this.size++;
  }

  append(value) {                      // O(n)
    const node = new Node(value);
    if (!this.head) { this.head = node; }
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this.size++;
  }

  insertAt(index, value) {             // O(n)
    if (index <= 0) return this.prepend(value);
    if (index >= this.size) return this.append(value);
    let prev = this.head;
    for (let i = 0; i < index - 1; i++) prev = prev.next;
    prev.next = Object.assign(new Node(value), { next: prev.next });
    this.size++;
  }

  removeAt(index) {                    // O(n)
    if (index < 0 || index >= this.size || !this.head) return undefined;
    if (index === 0) {
      const v = this.head.value;
      this.head = this.head.next;
      this.size--;
      return v;
    }
    let prev = this.head;
    for (let i = 0; i < index - 1; i++) prev = prev.next;
    const removed = prev.next;
    prev.next = removed.next;
    this.size--;
    return removed.value;
  }

  indexOf(value) {                     // O(n)
    let i = 0;
    for (let cur = this.head; cur; cur = cur.next, i++) if (cur.value === value) return i;
    return -1;
  }

  reverse() {                          // O(n), O(1) space
    let prev = null, cur = this.head;
    while (cur) { const next = cur.next; cur.next = prev; prev = cur; cur = next; }
    this.head = prev;
  }

  toArray() {
    const out = [];
    for (let cur = this.head; cur; cur = cur.next) out.push(cur.value);
    return out;
  }
}
```

### With a tail pointer — O(1) append

Keep a `tail` reference so `append` doesn't walk the list. Update `tail` in `append`, and when removing the last node.

```js
append(value) {
  const node = new Node(value);
  if (!this.head) this.head = this.tail = node;
  else { this.tail.next = node; this.tail = node; }
  this.size++;
}
```

### Stack via linked list

Push/pop at the **head** — both O(1), no resizing.

```js
class LinkedStack {
  #head = null;
  #size = 0;
  push(value) { this.#head = { value, next: this.#head }; this.#size++; }
  pop() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    this.#size--;
    return value;
  }
  peek() { return this.#head?.value; }
  get size() { return this.#size; }
}
```

### Queue via linked list

Enqueue at the **tail**, dequeue from the **head** — both O(1).

```js
class LinkedQueue {
  #head = null;
  #tail = null;
  #size = 0;
  enqueue(value) {
    const node = { value, next: null };
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
  }
  dequeue() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return value;
  }
  get size() { return this.#size; }
}
```

### Doubly linked list

Each node also points to its predecessor, so you can walk backwards and delete a known node in O(1).

```js
class DoublyLinkedList {
  constructor() { this.head = null; this.tail = null; this.size = 0; }

  append(value) {
    const node = { value, prev: this.tail, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.size++;
  }

  prepend(value) {
    const node = { value, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.size++;
  }

  remove(node) {                       // O(1) given the node
    if (node.prev) node.prev.next = node.next; else this.head = node.next;
    if (node.next) node.next.prev = node.prev; else this.tail = node.prev;
    this.size--;
  }

  reverse() {
    let cur = this.head;
    while (cur) { [cur.prev, cur.next] = [cur.next, cur.prev]; cur = cur.prev; }
    [this.head, this.tail] = [this.tail, this.head];
  }
}
```

**Uses:** LRU caches (hash map → DLL node), browser history, music playlists, text editors.

## Hash Table

Maps keys to values by running the key through a **hash function** to get a bucket index. Average O(1) `set`/`get`/`delete`; O(n) worst case when many keys collide. Collisions here are handled by **chaining** (each bucket holds a list of entries).

```js
class HashTable {
  constructor(size = 53) {
    this.buckets = new Array(size);
    this.size = size;
  }

  #hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      total = (total * PRIME + key.charCodeAt(i)) % this.size;
    }
    return total;
  }

  set(key, value) {
    const idx = this.#hash(key);
    this.buckets[idx] ??= [];
    const pair = this.buckets[idx].find(([k]) => k === key);
    if (pair) pair[1] = value;
    else this.buckets[idx].push([key, value]);
  }

  get(key) {
    const bucket = this.buckets[this.#hash(key)];
    return bucket?.find(([k]) => k === key)?.[1];
  }

  delete(key) {
    const bucket = this.buckets[this.#hash(key)];
    if (!bucket) return false;
    const i = bucket.findIndex(([k]) => k === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    return true;
  }

  keys() {
    return this.buckets.flat().map(([k]) => k);
  }
}
```

A production hash table also **resizes** (rehashes into a bigger array) when the load factor — entries ÷ buckets — exceeds ~0.7, to keep chains short. In real code just use `Map` — this is for understanding.

## Tree

A hierarchy of nodes: one **root**, each node has zero or more **children**, no cycles.

**Terminology:** *root* (top node), *parent*/*child*, *leaf* (no children), *sibling* (same parent), *edge* (parent→child link), *depth* (edges from the root to a node), *height* (edges on the longest path from a node to a leaf), *subtree* (a node plus its descendants), *degree* (number of children).

### Binary tree

Each node has at most two children (`left`, `right`).

```js
class TreeNode {
  constructor(value) { this.value = value; this.left = null; this.right = null; }
}

// Depth-first traversals
const preOrder = (n, out = []) => { if (n) { out.push(n.value); preOrder(n.left, out); preOrder(n.right, out); } return out; };
const inOrder  = (n, out = []) => { if (n) { inOrder(n.left, out); out.push(n.value); inOrder(n.right, out); } return out; };
const postOrder = (n, out = []) => { if (n) { postOrder(n.left, out); postOrder(n.right, out); out.push(n.value); } return out; };

// Breadth-first (level order)
function levelOrder(root) {
  const out = [], q = root ? [root] : [];
  while (q.length) {
    const n = q.shift();
    out.push(n.value);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return out;
}

const height = (n) => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);
```

### Binary Search Tree

A binary tree with the ordering invariant: **every left descendant < node < every right descendant**. Search / insert / delete are O(h) — O(log n) if balanced, O(n) if it degenerates into a list.

```js
class BST {
  constructor() { this.root = null; }

  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (value === cur.value) return;                 // no duplicates
      const dir = value < cur.value ? 'left' : 'right';
      if (!cur[dir]) { cur[dir] = node; return; }
      cur = cur[dir];
    }
  }

  has(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }

  min(node = this.root) { while (node.left) node = node.left; return node.value; }
  max(node = this.root) { while (node.right) node = node.right; return node.value; }
}
```

**Uses:** file systems, the DOM, decision trees, database indexes (B-trees), autocomplete (tries), heaps (priority queues).

## Graph

A set of **vertices** connected by **edges**. Edges may be **directed** or **undirected**, and **weighted** or not. Two common representations:

- **Adjacency list** — `Map<vertex, neighbours[]>`. Space O(V + E); good for sparse graphs (most real graphs).
- **Adjacency matrix** — `V × V` grid of 0/1 (or weights). Space O(V²); O(1) edge lookup; good for dense graphs.

```js
class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.adj = new Map();
  }

  addVertex(v) { if (!this.adj.has(v)) this.adj.set(v, []); }

  addEdge(u, v, weight = 1) {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u).push({ node: v, weight });
    if (!this.directed) this.adj.get(v).push({ node: u, weight });
  }

  bfs(start) {
    const seen = new Set([start]);
    const q = [start];
    const order = [];
    while (q.length) {
      const u = q.shift();
      order.push(u);
      for (const { node } of this.adj.get(u) ?? []) {
        if (!seen.has(node)) { seen.add(node); q.push(node); }
      }
    }
    return order;
  }

  dfs(start, seen = new Set(), order = []) {
    seen.add(start);
    order.push(start);
    for (const { node } of this.adj.get(start) ?? []) {
      if (!seen.has(node)) this.dfs(node, seen, order);
    }
    return order;
  }
}
```

**Uses:** social networks, maps/routing, dependency resolution, recommendation systems, web crawling, network topology.

## Complexity cheat-sheet

| Structure | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array (by index) | O(1) | O(n) | O(n) | O(n) |
| Array (push/pop) | — | — | O(1) | O(1) |
| Object / Map / Hash table | O(1)\* | O(1)\* | O(1)\* | O(1)\* |
| Set | — | O(1)\* | O(1)\* | O(1)\* |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) |
| Singly linked list | O(n) | O(n) | O(1)† | O(1)† |
| Doubly linked list | O(n) | O(n) | O(1)† | O(1)† |
| Binary search tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |
| Binary search tree (worst) | O(n) | O(n) | O(n) | O(n) |

\* average case; worst case O(n) on heavy collisions. † once you hold a reference to the node/position; finding it is O(n).
