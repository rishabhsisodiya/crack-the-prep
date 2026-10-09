/**
 * Browser side of the code runner, shared by CodeRunner (run a reference
 * approach) and PracticeEditor (run the reader's own code). Execution happens
 * in public/runner/worker.js; this module starts the worker, enforces the time
 * limits and renders the outcome.
 */

export type Spec = { fn: string; kind?: string; cases: { args: unknown[] }[] };
export type Result = { i: number; pass: boolean; error?: string; got?: string; expected: string; ms: number };
export type Done = { type: 'done'; error?: string; results: Result[]; logs: string[] };
export type Outcome = Done | { timeout: number };

const CASE_LIMIT_MS = 2000;
const TOTAL_LIMIT_MS = 5000;

/** localStorage under a key prefix; every call is safe when storage is blocked. */
export const codeStore = (prefix: string) => ({
  get: (k: string) => { try { return localStorage.getItem(prefix + k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(prefix + k, v); } catch { /* storage blocked */ } },
  del: (k: string) => { try { localStorage.removeItem(prefix + k); } catch { /* storage blocked */ } },
});

export const show = (v: unknown) => {
  let s: string;
  try { s = JSON.stringify(v) ?? String(v); } catch { s = String(v); }
  return s.length > 600 ? s.slice(0, 600) + '…' : s;
};

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

/** Ctrl/⌘ + Enter runs; Tab inserts two spaces instead of leaving the textarea. */
export function runOnCtrlEnter(editor: HTMLTextAreaElement, run: () => void) {
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); return; }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
      editor.dispatchEvent(new Event('input'));
    }
  });
}

/**
 * Run code in a fresh worker; kill it if a case exceeds its time limit.
 * With `spec` null the code is only executed, and the outcome carries its
 * console output and any error.
 */
export function execute(workerUrl: string, code: string, spec: Spec | null): Promise<Outcome> {
  return new Promise((resolve) => {
    const w = new Worker(workerUrl);
    let current = 0;
    let caseTimer = 0;
    const finish = (v: Outcome) => {
      clearTimeout(caseTimer);
      clearTimeout(totalTimer);
      w.terminate();
      resolve(v);
    };
    const armCase = () => {
      clearTimeout(caseTimer);
      caseTimer = window.setTimeout(() => finish({ timeout: current }), CASE_LIMIT_MS);
    };
    const totalTimer = window.setTimeout(() => finish({ timeout: current }), TOTAL_LIMIT_MS);
    w.onmessage = (e) => {
      if (e.data.type === 'case') { current = e.data.result.i + 1; armCase(); }
      else if (e.data.type === 'done') finish(e.data);
    };
    w.onerror = (e) => {
      e.preventDefault();
      finish({ type: 'done', error: e.message || 'the runner failed to start', results: [], logs: [] });
    };
    armCase();
    w.postMessage({ code, spec });
  });
}

/** Render an outcome into `out`. Returns true when every test case passed. */
export function renderResults(out: HTMLElement, spec: Spec | null, res: Outcome): boolean {
  out.replaceChildren();
  out.hidden = false;
  if ('timeout' in res) {
    const where = spec ? ` on case ${res.timeout + 1}` : '';
    out.append(el('div', 'ro-sum bad', `⏱ Time limit exceeded${where} — infinite loop, or too slow?`));
    return false;
  }
  let allPassed = false;
  if (res.error) {
    out.append(el('div', 'ro-sum bad', `✗ ${res.error}`));
  } else if (!spec) {
    out.append(el('div', 'ro-sum ok', '✓ Ran without errors'));
  } else {
    const passed = res.results.filter((r) => r.pass).length;
    const ms = res.results.reduce((t, r) => t + r.ms, 0);
    allPassed = passed === res.results.length;
    out.append(el('div', `ro-sum ${allPassed ? 'ok' : 'bad'}`, `${allPassed ? '✓' : '✗'} ${passed}/${res.results.length} passed · ${ms.toFixed(1)} ms`));
    let openedFailure = false;
    for (const r of res.results) {
      const d = el('details', `ro-case ${r.pass ? 'ok' : 'bad'}`);
      if (!r.pass && !openedFailure) { d.open = true; openedFailure = true; }
      d.append(el('summary', undefined, `${r.pass ? '✓' : '✗'} Case ${r.i + 1}`));
      const args = spec.kind === 'design'
        ? `constructor ${show((spec.cases[r.i].args as unknown[])[0])}\ncalls ${show((spec.cases[r.i].args as unknown[])[1])}`
        : spec.cases[r.i].args.map(show).join(', ');
      const lines = [`Input:    ${args}`, `Expected: ${r.expected}`];
      lines.push(r.error ? `Error:    ${r.error}` : `Got:      ${r.got}`);
      d.append(el('pre', undefined, lines.join('\n')));
      out.append(d);
    }
  }
  if (res.logs.length) {
    const box = el('div', 'ro-logs');
    box.append(el('p', undefined, 'Console'), el('pre', undefined, res.logs.join('\n')));
    out.append(box);
  }
  return allPassed;
}
