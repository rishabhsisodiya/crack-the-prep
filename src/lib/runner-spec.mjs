/**
 * Build-time helpers for runnable solutions, shared by the solutions pages and
 * scripts/check-data.mjs. (Execution itself lives in public/runner/harness.js.)
 */

/**
 * True when `code` defines `fn` as a function, class or const/let/var — i.e.
 * the approach can be run against the problem's tests.
 * @param {string} code
 * @param {string} fn
 */
export function defines(code, fn) {
  const n = fn.replace(/[$]/g, '\\$');
  return new RegExp('\\b(function\\*?|class)\\s+' + n + '\\b|\\b(const|let|var)\\s+' + n + '\\s*=').test(code);
}

/**
 * The test spec that applies to one approach, or null. A problem's entry in
 * dsa-tests.mjs is a spec or an array of specs; a spec with `approaches`
 * applies only to those approach indices. The approach must define the spec's
 * function(s).
 * @param {object | object[] | undefined} entry
 * @param {number} index approach index
 * @param {string} code approach code
 */
export function specFor(entry, index, code) {
  if (!entry) return null;
  for (const spec of Array.isArray(entry) ? entry : [entry]) {
    if (spec.approaches && !spec.approaches.includes(index)) continue;
    if (defines(code, spec.fn) && (!spec.after || defines(code, spec.after))) return spec;
  }
  return null;
}

/**
 * The spec the reader's own code is tested against, with the reference code it
 * was written for: the first spec in the entry that some approach satisfies.
 * @param {object | object[] | undefined} entry
 * @param {{ code: string }[]} approaches
 * @returns {{ spec: object, code: string } | null}
 */
export function primarySpec(entry, approaches) {
  if (!entry) return null;
  for (const spec of Array.isArray(entry) ? entry : [entry]) {
    const i = approaches.findIndex((a, idx) => specFor(spec, idx, a.code));
    if (i >= 0) return { spec, code: approaches[i].code };
  }
  return null;
}

const BODY = '// Write your code here';

/** Index of the bracket closing the one at `open`, skipping strings and comments. −1 if unbalanced. */
function closingIndex(code, open) {
  const pairs = { '(': ')', '{': '}', '[': ']' };
  const stack = [];
  for (let i = open; i < code.length; i++) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      for (i++; i < code.length && code[i] !== ch; i++) if (code[i] === '\\') i++;
    } else if (ch === '/' && code[i + 1] === '/') {
      i = code.indexOf('\n', i);
      if (i < 0) return -1;
    } else if (ch === '/' && code[i + 1] === '*') {
      i = code.indexOf('*/', i) + 1;
      if (i < 1) return -1;
    } else if (pairs[ch]) {
      stack.push(pairs[ch]);
    } else if (ch === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return i;
    }
  }
  return -1;
}

/** The first `count` parameters of a parameter list, default values removed. */
function firstParams(src, count) {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of src) {
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  const stripDefault = (p) => {
    let d = 0;
    for (let i = 0; i < p.length; i++) {
      if ('([{'.includes(p[i])) d++;
      else if (')]}'.includes(p[i])) d--;
      else if (p[i] === '=' && d === 0 && p[i + 1] !== '>') return p.slice(0, i);
    }
    return p;
  };
  return parts.map((p) => stripDefault(p).trim()).filter(Boolean).slice(0, count).join(', ');
}

/** Parameter list of the parenthesis opening at the end of `match`, or null. */
function paramsAt(code, match) {
  const open = match.index + match[0].length - 1;
  const close = closingIndex(code, open);
  return close < 0 ? null : code.slice(open + 1, close);
}

/** Parameter source of function `name` in `code`, or null when it is not a plain function. */
function functionParams(code, name) {
  const n = name.replace(/[$]/g, '\\$');
  const decl =
    new RegExp('\\bfunction\\*?\\s+' + n + '\\s*\\(').exec(code) ||
    new RegExp('\\b(?:const|let|var)\\s+' + n + '\\s*=\\s*(?:async\\s+)?(?:function\\s*\\*?\\s*[\\w$]*\\s*)?\\(').exec(code);
  if (decl) return paramsAt(code, decl);
  const single = new RegExp('\\b(?:const|let|var)\\s+' + n + '\\s*=\\s*(?:async\\s+)?([\\w$]+)\\s*=>').exec(code);
  return single ? single[1] : null;
}

/** Parameter source of a method defined at the start of a line in `body`, or '' if absent. */
function methodParams(body, name) {
  const m = new RegExp('(?:^|\\n)[ \\t]*(?:async\\s+)?' + name.replace(/[$]/g, '\\$') + '\\s*\\(').exec(body);
  return (m && paramsAt(body, m)) || '';
}

// Hints for argument shapes the reader cannot guess from the signature.
const LIST = '// Linked list nodes are { val, next }. new ListNode(val, next) is available.';
const TREE = '// Tree nodes are { val, left, right }. new TreeNode(val, left, right) is available.';
const SHAPE_HINT = {
  list: LIST, 'cycle-list': LIST, 'y-lists': LIST, 'list-array': LIST,
  tree: TREE, 'tree-ref': TREE,
  dll: '// Doubly linked list nodes are { val, prev, next }.',
  'circular-list': LIST + '\n// The list is circular: the last node points back to the head.',
  'tree-dll': '// Return the head of the list: left is the previous node, right is the next.',
  'random-list': '// Nodes are { val, next, random }.',
  graph: '// Graph nodes are { val, neighbors }.',
};

/**
 * Empty starting code for the reader: the entry point(s) of `spec` with the
 * reference solution's parameter names and no body. Null when the signature
 * cannot be read from `code` (check-data.mjs treats that as an error).
 * @param {string} code reference solution the spec applies to
 * @param {{ fn: string, after?: string, kind?: string, input?: string[], output?: string, check?: string, cases: { args: any[] }[] }} spec
 * @returns {string | null}
 */
export function starterFor(code, spec) {
  const hints = new Set();
  for (const k of [...(spec.input ?? []), spec.output]) if (SHAPE_HINT[k]) hints.add(SHAPE_HINT[k]);
  if (spec.check === 'arg0') hints.add('// Change the first argument in place; the return value is ignored.');
  const head = hints.size ? [...hints].join('\n') + '\n' : '';

  if (spec.kind === 'design') {
    const cls = new RegExp('\\bclass\\s+' + spec.fn.replace(/[$]/g, '\\$') + '\\b[^{]*\\{').exec(code);
    if (!cls) return null;
    const open = cls.index + cls[0].length - 1;
    const close = closingIndex(code, open);
    if (close < 0) return null;
    const body = code.slice(open + 1, close);
    const arity = new Map(); // method → most arguments any test passes
    let ctorArity = 0;
    for (const c of spec.cases) {
      ctorArity = Math.max(ctorArity, c.args[0].length);
      for (const [method, ...a] of c.args[1]) arity.set(method, Math.max(arity.get(method) ?? 0, a.length));
    }
    const member = (name, params) => `  ${name}(${params}) {\n    ${BODY}\n  }`;
    const members = [];
    if (ctorArity || /(?:^|\n)[ \t]*constructor\s*\(/.test(body)) {
      members.push(member('constructor', firstParams(methodParams(body, 'constructor'), ctorArity)));
    }
    for (const [name, n] of arity) members.push(member(name, firstParams(methodParams(body, name), n)));
    return `${head}class ${spec.fn} {\n${members.join('\n\n')}\n}\n`;
  }

  // 'y-lists' is one test argument that becomes two call arguments
  const argCount = Math.max(...spec.cases.map((c) => c.args.reduce((n, _, i) => n + (spec.input?.[i] === 'y-lists' ? 2 : 1), 0)));
  const fn = (name, count) => {
    const params = functionParams(code, name);
    return params === null ? null : `function ${name}(${firstParams(params, count)}) {\n  ${BODY}\n}`;
  };
  const parts = [fn(spec.fn, argCount)];
  if (spec.after) parts.push(fn(spec.after, 1));
  return parts.includes(null) ? null : head + parts.join('\n\n') + '\n';
}

/**
 * Starting code for a problem that has no tests: the first function of the
 * reference solution with an empty body, and a reminder to print the result.
 * @param {string} code
 */
export function untestedStarter(code) {
  const hint = '// No automated tests for this problem: call your function and console.log the result.\n';
  const m = /^function\*?\s+([\w$]+)\s*\(/m.exec(code);
  const params = m && paramsAt(code, m);
  if (params == null) return `${hint}${BODY}\n`;
  return `${hint}function ${m[1]}(${firstParams(params, Infinity)}) {\n  ${BODY}\n}\n`;
}
