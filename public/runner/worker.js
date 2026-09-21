/**
 * Runs one solution against its test cases, off the main thread.
 * Started fresh for every run by CodeRunner, and terminated on timeout, so an
 * infinite loop never freezes the page.
 *
 * page → worker   { code, spec }
 * worker → page   { type: 'case', result }                 after each case
 *                 { type: 'done', results, error?, logs }  when finished
 */
/* global CTPHarness */
importScripts('harness.js' + self.location.search); // same ?v= cache-buster as this file

const MAX_LOG_LINES = 50;
const logs = [];

function capture(prefix) {
  return (...args) => {
    if (logs.length >= MAX_LOG_LINES) return;
    const line = args.map((a) => (typeof a === 'string' ? a : CTPHarness.show(a))).join(' ');
    logs.push(prefix + line);
    if (logs.length === MAX_LOG_LINES) logs.push('… more output truncated');
  };
}
console.log = console.info = console.debug = capture('');
console.warn = capture('warn: ');
console.error = capture('error: ');

self.onmessage = (e) => {
  const { code, spec } = e.data;
  const out = CTPHarness.runAll(code, spec, () => performance.now(), (result) =>
    self.postMessage({ type: 'case', result: { i: result.i } }),
  );
  // Results cross the thread boundary via structured clone; stringify values
  // the page only displays so exotic objects (functions, cycles) cannot throw.
  const results = out.results.map((r) => ({
    i: r.i,
    pass: r.pass,
    error: r.error,
    ms: r.ms,
    got: 'got' in r ? CTPHarness.show(r.got) : undefined,
    expected: CTPHarness.show(r.expected),
  }));
  self.postMessage({ type: 'done', error: out.error, results, logs });
};
