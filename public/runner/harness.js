/**
 * CrackThePrep test harness — shared by the in-browser runner (Web Worker,
 * via importScripts) and CI (scripts/check-data.mjs, via node:vm). Keeping one
 * copy guarantees the Run button and the build can never disagree.
 *
 * Plain ES2020 script, no imports/exports: it attaches `CTPHarness` to the
 * global object.
 *
 * Test spec shape — documented in full in src/data/dsa-tests.mjs:
 *   { fn, after?, kind?, input?, output?, check?, compare?, cases: [{ args, expected }] }
 */
(function (root) {
  'use strict';

  const MAX_NODES = 10000;
  const MAX_SHOWN = 2000;

  // ---------------------------------------------------------------- prelude
  // Helpers that solution snippets assume exist. User code may redefine them.

  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  class TreeNode {
    constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
  }

  class MinHeap {
    constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
    get size() { return this.a.length; }
    peek() { return this.a[0]; }
    push(x) {
      const a = this.a; a.push(x);
      for (let i = a.length - 1, p; i > 0 && this.cmp(a[i], a[(p = (i - 1) >> 1)]) < 0; i = p)
        [a[i], a[p]] = [a[p], a[i]];
    }
    pop() {
      const a = this.a, top = a[0], last = a.pop();
      if (a.length) {
        a[0] = last;
        for (let i = 0; ;) {
          const l = 2 * i + 1, r = l + 1; let m = i;
          if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
          if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
          if (m === i) break;
          [a[i], a[m]] = [a[m], a[i]]; i = m;
        }
      }
      return top;
    }
  }

  const prelude = { ListNode, TreeNode, MinHeap };

  // ---------------------------------------------------------------- converters

  function toList(arr) {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of arr) cur = cur.next = new ListNode(v);
    return dummy.next;
  }

  function fromList(head) {
    const out = [];
    for (let n = head; n; n = n.next) {
      if (out.length >= MAX_NODES) throw new Error('list has more than ' + MAX_NODES + ' nodes — possible cycle');
      out.push(n.val);
    }
    return out;
  }

  /** LeetCode level-order array (null = missing child) → tree. */
  function toTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const rootNode = new TreeNode(arr[0]);
    const q = [rootNode];
    let i = 1;
    for (let h = 0; h < q.length && i < arr.length; h++) {
      const node = q[h];
      if (i < arr.length && arr[i] !== null) q.push((node.left = new TreeNode(arr[i])));
      i++;
      if (i < arr.length && arr[i] !== null) q.push((node.right = new TreeNode(arr[i])));
      i++;
    }
    return rootNode;
  }

  /** Tree → LeetCode level-order array, trailing nulls trimmed. */
  function fromTree(rootNode) {
    const out = [], q = [rootNode];
    for (let h = 0; h < q.length; h++) {
      if (q.length > MAX_NODES) throw new Error('tree has more than ' + MAX_NODES + ' nodes — possible cycle');
      const n = q[h];
      if (n) { out.push(n.val); q.push(n.left, n.right); } else out.push(null);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  }

  /** [values, pos] → list whose tail links back to index pos (−1 = no cycle). */
  function toCycleList([values, pos]) {
    const head = toList(values);
    if (pos >= 0) {
      let tail = head, target = null;
      for (let i = 0; tail; i++) {
        if (i === pos) target = tail;
        if (!tail.next) break;
        tail = tail.next;
      }
      tail.next = target;
    }
    return head;
  }

  /** [aOnly, bOnly, shared] → two heads that merge into the same shared nodes. */
  function toYLists([aOnly, bOnly, shared]) {
    const common = toList(shared);
    const join = (vals) => {
      if (!vals.length) return common;
      const h = toList(vals);
      let t = h;
      while (t.next) t = t.next;
      t.next = common;
      return h;
    };
    return [join(aOnly), join(bOnly)];
  }

  /** [[val, randomIndex | null], …] → nodes with next + random pointers. */
  function toRandomList(pairs) {
    const nodes = pairs.map(([val]) => ({ val, next: null, random: null }));
    nodes.forEach((n, i) => {
      n.next = nodes[i + 1] || null;
      const r = pairs[i][1];
      n.random = r === null ? null : nodes[r];
    });
    return nodes[0] || null;
  }

  function fromRandomList(head) {
    const nodes = [];
    for (let n = head; n; n = n.next) {
      if (nodes.length >= MAX_NODES) throw new Error('list has more than ' + MAX_NODES + ' nodes — possible cycle');
      nodes.push(n);
    }
    const index = new Map(nodes.map((n, i) => [n, i]));
    return nodes.map((n) => [n.val, n.random ? (index.has(n.random) ? index.get(n.random) : 'foreign node') : null]);
  }

  // LeetCode graph: adjacency[i] lists the neighbour values of node i + 1.
  // Input nodes carry a hidden marker so the output check can spot a node that
  // was reused instead of cloned.
  const ORIGINAL = typeof Symbol === 'function' ? Symbol('original') : '__original';

  function toGraph(adjacency) {
    if (!adjacency.length) return null;
    const nodes = adjacency.map((_, i) => {
      const n = { val: i + 1, neighbors: [] };
      Object.defineProperty(n, ORIGINAL, { value: true });
      return n;
    });
    adjacency.forEach((nbs, i) => { nodes[i].neighbors = nbs.map((v) => nodes[v - 1]); });
    return nodes[0];
  }

  function fromGraph(start) {
    if (!start) return [];
    const seen = new Map([[start.val, start]]), q = [start];
    for (let h = 0; h < q.length; h++) {
      if (q[h][ORIGINAL]) throw new Error('node ' + q[h].val + ' is an original node, not a copy');
      for (const nb of q[h].neighbors) if (!seen.has(nb.val)) { seen.set(nb.val, nb); q.push(nb); }
      if (q.length > MAX_NODES) throw new Error('graph has more than ' + MAX_NODES + ' nodes');
    }
    const out = [];
    for (let v = 1; v <= seen.size; v++) {
      if (!seen.has(v)) throw new Error('node values are not 1..' + seen.size);
      out.push(seen.get(v).neighbors.map((nb) => nb.val));
    }
    return out;
  }

  function findTreeNode(rootNode, val) {
    const st = rootNode ? [rootNode] : [];
    while (st.length) {
      const n = st.pop();
      if (n.val === val) return n;
      if (n.left) st.push(n.left);
      if (n.right) st.push(n.right);
    }
    throw new Error('test setup: value ' + val + ' is not in the tree');
  }

  // Nodes are recognised by shape, not class: solutions may build plain objects.
  const isList = (v) => v === null || (typeof v === 'object' && 'val' in v && 'next' in v);
  const isTree = (v) => v === null || (typeof v === 'object' && 'val' in v && ('left' in v || 'right' in v));

  // Input kinds convert one test argument; 'y-lists' expands into two call arguments.
  const TO = {
    raw: (v) => [v],
    list: (v) => [toList(v)],
    tree: (v) => [toTree(v)],
    'cycle-list': (v) => [toCycleList(v)],
    'y-lists': (v) => toYLists(v),
    'random-list': (v) => [toRandomList(v)],
    'list-array': (v) => [v.map(toList)],
    graph: (v) => [toGraph(v)],
    // 'tree-ref' is resolved in runCase: it needs the preceding tree argument.
    'tree-ref': (v) => [v],
  };
  const FROM = {
    raw: (v) => v,
    list: (v) => (isList(v) ? fromList(v) : v),
    'cycle-list': (v) => (isList(v) ? fromList(v) : v),
    tree: (v) => (isTree(v) ? fromTree(v) : v),
    'random-list': (v) => (isList(v) ? fromRandomList(v) : v),
    'node-val': (v) => (v && typeof v === 'object' && 'val' in v ? v.val : v),
    graph: (v) => (v === null || (typeof v === 'object' && 'neighbors' in v) ? fromGraph(v) : v),
  };

  // ---------------------------------------------------------------- comparison

  function clone(v) {
    return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  }

  function normalise(v) {
    // Sets/Maps → arrays so results compare and display sensibly.
    if (v instanceof Set) return [...v].map(normalise);
    if (v instanceof Map) return [...v].map(normalise);
    if (Array.isArray(v)) return v.map(normalise);
    return v;
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);
    if (Array.isArray(a) && Array.isArray(b))
      return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]));
    }
    return false;
  }

  const key = (v) => JSON.stringify(v);
  const sortedBy = (arr) => [...arr].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));

  function compare(got, expected, mode) {
    switch (mode || 'exact') {
      case 'exact':
        return deepEqual(got, expected);
      case 'unordered':
        return Array.isArray(got) && deepEqual(sortedBy(got), sortedBy(expected));
      case 'unordered-deep': {
        if (!Array.isArray(got)) return false;
        const inner = (a) => a.map((x) => (Array.isArray(x) ? sortedBy(x) : x));
        return deepEqual(sortedBy(inner(got)), sortedBy(inner(expected)));
      }
      case 'float':
        return typeof got === 'number' && Math.abs(got - expected) < 1e-5;
      case 'any-of':
        return expected.some((e) => deepEqual(got, e));
      default:
        throw new Error('unknown compare mode: ' + mode);
    }
  }

  // ---------------------------------------------------------------- execution

  /** Evaluate a snippet and return the named entry point. Prelude names are in
   *  an outer scope, so a snippet's own `class MinHeap` simply shadows them. */
  function compile(code, fns) {
    const names = Object.keys(prelude);
    const pick = fns.map((f) => f + ": typeof " + f + " === 'undefined' ? undefined : " + f).join(', ');
    const body =
      'const {' + names.join(',') + '} = __prelude;\n' +
      'return (function () {\n' + code + '\n;return { ' + pick + ' };\n})();';
    // eslint-disable-next-line no-new-func
    const found = new Function('__prelude', body)(prelude);
    for (const f of fns)
      if (typeof found[f] !== 'function') throw new Error('"' + f + '" is not defined as a function or class in this code');
    return found;
  }

  function runDesign(Cls, args) {
    const [ctorArgs, ops] = args;
    const inst = new Cls(...ctorArgs);
    return ops.map(([method, ...a]) => {
      if (typeof inst[method] !== 'function') throw new Error('method "' + method + '" is not defined');
      const r = normalise(inst[method](...a));
      return r === undefined ? null : r;
    });
  }

  function runCase(fns, spec, c) {
    const args = clone(c.args);
    if (spec.kind === 'design') return runDesign(fns[spec.fn], args);
    const input = spec.input || [];
    const callArgs = [];
    let lastTree = null;
    args.forEach((a, i) => {
      const kind = input[i] || 'raw';
      if (kind === 'tree-ref') { callArgs.push(findTreeNode(lastTree, a)); return; }
      const converted = TO[kind](a);
      if (kind === 'tree') lastTree = converted[0];
      callArgs.push(...converted);
    });
    let ret = fns[spec.fn](...callArgs);
    if (spec.check === 'arg0') return normalise(FROM[input[0] || 'raw'](callArgs[0]));
    if (spec.after) ret = fns[spec.after](ret); // e.g. decode(encode(x))
    if (ret === undefined) throw new Error('returned nothing — did you forget `return`?');
    return normalise(FROM[spec.output || 'raw'](ret));
  }

  /** Run every case. Never throws: compile errors come back as { error }.
   *  `onResult(result)` fires after each case (the worker streams progress so
   *  the page can tell which case hit the time limit). */
  function runAll(code, spec, now, onResult) {
    const clock = now || (() => Date.now());
    let fns;
    try {
      fns = compile(code, spec.after ? [spec.fn, spec.after] : [spec.fn]);
    } catch (e) {
      return { error: String(e && e.message ? e.message : e), results: [] };
    }
    const results = spec.cases.map((c, i) => {
      const r = runOne(fns, spec, c, i, clock);
      if (onResult) onResult(r);
      return r;
    });
    return { results };
  }

  function runOne(fns, spec, c, i, clock) {
    const t0 = clock();
    try {
      const got = runCase(fns, spec, c);
      return { i, pass: compare(got, c.expected, spec.compare), got, expected: c.expected, ms: clock() - t0 };
    } catch (e) {
      return { i, pass: false, error: String(e && e.message ? e.message : e), expected: c.expected, ms: clock() - t0 };
    }
  }

  function show(v) {
    let s;
    try { s = JSON.stringify(v); } catch { s = String(v); }
    if (s === undefined) s = String(v);
    return s.length > MAX_SHOWN ? s.slice(0, MAX_SHOWN) + '…' : s;
  }

  const COMPARE_MODES = ['exact', 'unordered', 'unordered-deep', 'float', 'any-of'];
  const INPUT_KINDS = Object.keys(TO);
  const OUTPUT_KINDS = Object.keys(FROM);

  root.CTPHarness = {
    prelude, toList, fromList, toTree, fromTree,
    compare, compile, runAll, show,
    COMPARE_MODES, INPUT_KINDS, OUTPUT_KINDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : self);
