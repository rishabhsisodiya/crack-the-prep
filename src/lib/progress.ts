/**
 * Which DSA problems the reader has solved, kept in localStorage as a map of
 * problem id ("<topic>/<problem>", the practice page's URL tail) → true.
 *
 * Pages mark up what should reflect it and call initProgress():
 *   [data-solved-id="<id>"]            gets the class `is-solved`
 *   [data-solved-count]                "solved/total" over the ids inside the
 *                                      closest [data-solved-scope] (or the page)
 *   [data-solved-prefix="<topic>/"]    number of solved ids with that prefix
 *                                      ("" = all), capped at data-solved-max
 *   [data-solved-reset]                button that clears all progress
 */
const KEY = 'crack-the-prep:practice:solved';
type Solved = Record<string, true>;

export function loadSolved(): Solved {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

function save(solved: Solved) {
  try { localStorage.setItem(KEY, JSON.stringify(solved)); } catch { /* storage blocked */ }
}

export function setSolved(id: string, solved: boolean) {
  const all = loadSolved();
  if (solved) all[id] = true;
  else delete all[id];
  save(all);
  paintSolved();
}

export function paintSolved() {
  const solved = loadSolved();
  document.querySelectorAll<HTMLElement>('[data-solved-id]').forEach((el) => {
    el.classList.toggle('is-solved', !!solved[el.dataset.solvedId!]);
  });
  document.querySelectorAll<HTMLElement>('[data-solved-count]').forEach((el) => {
    const scope: ParentNode = el.closest('[data-solved-scope]') ?? document;
    const rows = [...scope.querySelectorAll<HTMLElement>('[data-solved-id]')];
    el.textContent = `${rows.filter((r) => solved[r.dataset.solvedId!]).length}/${rows.length}`;
  });
  document.querySelectorAll<HTMLElement>('[data-solved-prefix]').forEach((el) => {
    const n = Object.keys(solved).filter((id) => id.startsWith(el.dataset.solvedPrefix!)).length;
    // ids of renamed or removed problems may linger in storage
    el.textContent = String(Math.min(n, Number(el.dataset.solvedMax ?? n)));
  });
}

export function initProgress() {
  paintSolved();
  // another tab solved something
  window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) paintSolved(); });
  document.querySelectorAll<HTMLButtonElement>('[data-solved-reset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!confirm('Clear your solved marks for every problem? Your saved code is kept.')) return;
      save({});
      paintSolved();
    }),
  );
}
