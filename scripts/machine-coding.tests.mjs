/**
 * Tests for the "Final code" of each Machine Coding page, keyed by page slug.
 * Used by scripts/check-machine-coding.mjs. Each entry:
 *   names  identifiers the final code must define (passed to `run`)
 *   run    async (defs) => void — throws (assert) on failure
 * Polyfill pages that patch prototypes list no names and test the globals.
 */
import assert from 'node:assert/strict';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wait = (ms, value, fail) => new Promise((res, rej) => setTimeout(() => (fail ? rej(value) : res(value)), ms));

export const tests = {
  // ---------------------------------------------------------------- polyfills
  'call-apply-bind': {
    names: [],
    async run() {
      function greet(g, p) { return `${g}, ${this.name}${p}`; }
      const user = { name: 'Asha' };
      assert.equal(greet.myCall(user, 'Hi', '!'), 'Hi, Asha!');
      assert.equal(greet.myApply(user, ['Hello', '.']), 'Hello, Asha.');
      assert.equal(greet.myBind(user, 'Hey')('?'), 'Hey, Asha?');
      assert.deepEqual(Object.getOwnPropertySymbols(user), [], 'temporary key must be removed');
      function P(a, b) { this.s = a + b; }
      const BP = P.myBind({ ignored: true }, 2);
      const inst = new BP(3);
      assert.equal(inst.s, 5);
      assert.ok(inst instanceof P);
      assert.equal(function () { return typeof this; }.myCall(5), 'object');
      assert.throws(() => Function.prototype.myBind.call({}), TypeError);
    },
  },
  'map-filter-reduce': {
    names: [],
    async run() {
      assert.deepEqual([1, 2, 3].myMap((x) => x * 2), [2, 4, 6]);
      assert.deepEqual([1, 2, 3, 4].myFilter((x) => x % 2 === 0), [2, 4]);
      assert.equal([1, 2, 3].myReduce((s, x) => s + x, 0), 6);
      assert.equal([1, 2, 3].myReduce((s, x) => s + x), 6);
      assert.throws(() => [].myReduce((a, b) => a + b), TypeError);
      assert.equal([].myReduce((a, b) => a + b, 7), 7);
      let calls = 0;
      // eslint-disable-next-line no-sparse-arrays
      const mapped = [1, , 3].myMap((x) => (calls++, x));
      assert.equal(calls, 2);
      assert.equal(1 in mapped, false);
      assert.equal([undefined].myReduce((a, x) => a + String(x), 'u:'), 'u:undefined');
    },
  },
  promise: {
    names: ['MyPromise'],
    async run({ MyPromise }) {
      const order = [];
      order.push(1);
      MyPromise.resolve().then(() => order.push(2));
      order.push(3);
      await sleep(0);
      assert.deepEqual(order, [1, 3, 2], 'callbacks must run as microtasks');
      const chained = await new Promise((res) =>
        new MyPromise((r) => setTimeout(() => r(1), 5))
          .then((x) => x + 1)
          .then((x) => { throw new Error('boom ' + x); })
          .catch((e) => e.message)
          .finally(() => {})
          .then(res),
      );
      assert.equal(chained, 'boom 2');
      assert.equal(await new Promise((res) => new MyPromise((r) => r(Promise.resolve(7))).then(res)), 7);
      assert.equal(await new Promise((res) => MyPromise.resolve(3).then().then(res)), 3);
      assert.equal(await new Promise((res) => MyPromise.reject('x').finally(() => 1).catch(res)), 'x');
      assert.equal(await new Promise((res) => new MyPromise((r, j) => { r(1); j(2); r(3); }).then(res)), 1);
      const p = new MyPromise((r) => setTimeout(r, 1));
      const cyc = p.then(() => cyc);
      assert.ok((await new Promise((res) => cyc.catch(res))) instanceof TypeError);
      assert.equal(await new Promise((res) => new MyPromise(() => { throw new Error('ex'); }).catch((e) => res(e.message))), 'ex');
    },
  },
  'promise-combinators': {
    names: ['promiseAll', 'promiseAllSettled', 'promiseRace', 'promiseAny'],
    async run({ promiseAll, promiseAllSettled, promiseRace, promiseAny }) {
      assert.deepEqual(await promiseAll([wait(30, 'a'), 'b', wait(10, 'c')]), ['a', 'b', 'c']);
      assert.deepEqual(await promiseAll([]), []);
      await assert.rejects(promiseAll([wait(20, 1), wait(5, 'bad', true)]), (e) => e === 'bad');
      assert.deepEqual(await promiseAllSettled([wait(10, 1), wait(5, 'x', true)]), [
        { status: 'fulfilled', value: 1 },
        { status: 'rejected', reason: 'x' },
      ]);
      assert.equal(await promiseRace([wait(30, 'slow'), wait(10, 'fast')]), 'fast');
      assert.equal(await promiseAny([wait(5, 'e1', true), wait(20, 'ok')]), 'ok');
      await assert.rejects(promiseAny([wait(5, 'e1', true), wait(6, 'e2', true)]), (e) => e instanceof AggregateError && e.errors.join() === 'e1,e2');
      await assert.rejects(promiseAny([]), AggregateError);
      assert.deepEqual(await promiseAll(new Set([1, 2])), [1, 2]);
    },
  },
  'array-flat': {
    names: ['flat', 'flatIter'],
    async run({ flat, flatIter }) {
      for (const f of [flat, flatIter]) {
        assert.deepEqual(f([1, [2, [3, [4]]]]), [1, 2, [3, [4]]]);
        assert.deepEqual(f([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
        assert.deepEqual(f([1, [2, [3, [4]]]], Infinity), [1, 2, 3, 4]);
        // eslint-disable-next-line no-sparse-arrays
        assert.deepEqual(f([1, , [3, , 5]]), [1, 3, 5]);
        assert.deepEqual(f([1, [2]], 0), [1, [2]]);
        assert.deepEqual(f(['ab', ['c'], undefined]), ['ab', 'c', undefined]);
      }
    },
  },
  'object-assign-create': {
    names: ['assign', 'create'],
    async run({ assign, create }) {
      assert.deepEqual(assign({ a: 1 }, { b: 2 }, null, { a: 3 }), { a: 3, b: 2 });
      const sym = Symbol('s');
      assert.equal(assign({}, { [sym]: 1 })[sym], 1);
      assert.throws(() => assign(null), TypeError);
      assert.deepEqual(assign({}, 'ab'), { 0: 'a', 1: 'b' });
      const animal = { speak() { return `${this.name} makes a sound`; } };
      const dog = create(animal, { name: { value: 'Rex', enumerable: true } });
      assert.equal(dog.speak(), 'Rex makes a sound');
      assert.equal(Object.getPrototypeOf(dog), animal);
      assert.equal(Object.getPrototypeOf(create(null)), null);
      assert.throws(() => create(5), TypeError);
    },
  },
  'new-operator': {
    names: ['myNew', 'myInstanceOf'],
    async run({ myNew, myInstanceOf }) {
      function Person(name) { this.name = name; }
      Person.prototype.hi = function () { return 'hi ' + this.name; };
      const p = myNew(Person, 'Asha');
      assert.equal(p.hi(), 'hi Asha');
      assert.ok(myInstanceOf(p, Person));
      assert.ok(myInstanceOf(p, Object));
      assert.ok(!myInstanceOf(p, Array));
      assert.deepEqual(myNew(function () { this.a = 1; return { b: 2 }; }), { b: 2 });
      assert.deepEqual({ ...myNew(function () { this.a = 1; return 42; }) }, { a: 1 });
      assert.throws(() => myNew(() => {}), TypeError);
      assert.equal(myInstanceOf(1, Number), false);
      assert.equal(myInstanceOf(Object.create(null), Object), false);
    },
  },

  // ---------------------------------------------------------------- utilities
  debounce: {
    names: ['debounce'],
    async run({ debounce }) {
      const got = [];
      const d = debounce(function (x) { got.push([this?.id, x]); }, 20);
      const o = { id: 7, d };
      o.d('h'); o.d('he'); o.d('hel');
      await sleep(40);
      assert.deepEqual(got, [[7, 'hel']], 'one call, latest args, caller this');
      d('x'); d.cancel(); await sleep(30);
      assert.equal(got.length, 1, 'cancel drops the pending call');
      d('y'); d.flush();
      assert.deepEqual(got[1], [undefined, 'y'], 'flush runs it now');
      await sleep(30);
      assert.equal(got.length, 2, 'flush does not run it twice');
      const lead = [];
      const dl = debounce((x) => lead.push(x), 20, { leading: true });
      dl(1); dl(2); dl(3);
      assert.deepEqual(lead, [1]);
      await sleep(40);
      assert.deepEqual(lead, [1, 3]);
      dl(9); await sleep(40);
      assert.deepEqual(lead, [1, 3, 9], 'a single leading call is not repeated as trailing');
      const lo = [];
      const dlo = debounce((x) => lo.push(x), 20, { leading: true, trailing: false });
      dlo(1); dlo(2); await sleep(40);
      assert.deepEqual(lo, [1]);
    },
  },
  throttle: {
    names: ['throttle'],
    async run({ throttle }) {
      const got = [];
      const t = throttle((x) => got.push(x), 50);
      t(1); t(2); t(3);
      assert.deepEqual(got, [1]);
      await sleep(80);
      assert.deepEqual(got, [1, 3], 'trailing call with the latest args');
      await sleep(80);
      t(4);
      assert.deepEqual(got, [1, 3, 4], 'after idle it runs immediately');
      await sleep(80);
      const nl = [];
      const tn = throttle((x) => nl.push(x), 40, { leading: false });
      tn('a');
      assert.deepEqual(nl, []);
      await sleep(70);
      assert.deepEqual(nl, ['a']);
      await sleep(60);
      tn('b');
      assert.deepEqual(nl, ['a'], 'leading:false still holds after a pause');
      await sleep(70);
      assert.deepEqual(nl, ['a', 'b']);
      const nt = [];
      const tt = throttle((x) => nt.push(x), 40, { trailing: false });
      tt(1); tt(2); await sleep(70);
      assert.deepEqual(nt, [1]);
      const c = [];
      const tc = throttle((x) => c.push(x), 40);
      tc(1); tc(2); tc.cancel(); await sleep(60);
      assert.deepEqual(c, [1]);
    },
  },
  'deep-clone': {
    names: ['deepClone'],
    async run({ deepClone }) {
      const s = Symbol('k');
      const a = { n: 1, list: [1, { x: 2 }], when: new Date(0), re: /a+/gi, tags: new Set(['js']), m: new Map([['k', { v: 1 }]]), [s]: 's', fn: Math.max };
      a.self = a;
      a.shared = a.list;
      const b = deepClone(a);
      b.list[1].x = 99;
      assert.equal(a.list[1].x, 2);
      assert.equal(b.self, b);
      assert.equal(b.shared, b.list);
      assert.ok(b.when instanceof Date && b.when !== a.when && +b.when === 0);
      assert.equal(b.re.source, 'a+');
      assert.equal(b.re.flags, 'gi');
      assert.ok(b.tags.has('js') && b.tags !== a.tags);
      assert.equal(b.m.get('k').v, 1);
      assert.notEqual(b.m.get('k'), a.m.get('k'));
      assert.equal(b[s], 's');
      assert.equal(b.fn, Math.max);
      class K { constructor() { this.v = 1; } get2() { return this.v * 2; } }
      assert.equal(deepClone(new K()).get2(), 2);
      // eslint-disable-next-line no-sparse-arrays
      const sp = deepClone([1, , 3]);
      assert.equal(sp.length, 3);
      assert.equal(1 in sp, false);
      assert.equal(deepClone(null), null);
    },
  },
  'deep-equal': {
    names: ['deepEqual'],
    async run({ deepEqual }) {
      assert.ok(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }));
      assert.ok(!deepEqual([1, 2], { 0: 1, 1: 2 }));
      assert.ok(deepEqual(NaN, NaN));
      assert.ok(deepEqual(new Date(0), new Date(0)));
      assert.ok(!deepEqual(new Date(0), new Date(1)));
      assert.ok(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
      assert.ok(!deepEqual({ a: undefined }, {}));
      assert.ok(!deepEqual([1, 2], [2, 1]));
      assert.ok(deepEqual(/x/g, /x/g));
      assert.ok(!deepEqual(/x/g, /x/i));
      assert.ok(deepEqual(new Map([[1, { a: 1 }]]), new Map([[1, { a: 1 }]])));
      assert.ok(!deepEqual(new Set([1]), new Set([2])));
      const x = { v: 1 }; x.me = x;
      const y = { v: 1 }; y.me = y;
      const z = { v: 2 }; z.me = z;
      assert.ok(deepEqual(x, y));
      assert.ok(!deepEqual(x, z));
      assert.ok(!deepEqual(null, {}));
      assert.ok(!deepEqual(1, '1'));
    },
  },
  curry: {
    names: ['curry', 'sum', 'curryWithPlaceholder'],
    async run({ curry, sum, curryWithPlaceholder }) {
      const c = curry((a, b, c3) => a + b + c3);
      assert.equal(c(1)(2)(3), 6);
      assert.equal(c(1, 2)(3), 6);
      assert.equal(c(1)(2, 3), 6);
      assert.equal(c(1, 2, 3), 6);
      const add1 = c(1);
      assert.equal(add1(2)(3), 6);
      assert.equal(add1(10)(20), 31, 'partial applications are independent');
      assert.equal(sum(1)(2)(3)(), 6);
      assert.equal(sum(1, 2)(3)(), 6);
      assert.equal(sum(5)(), 5);
      const _ = curry.placeholder;
      const cp = curryWithPlaceholder((a, b, c3) => [a, b, c3]);
      assert.deepEqual(cp(_, 2)(1, 3), [1, 2, 3]);
      assert.deepEqual(cp(_, _, 3)(1)(2), [1, 2, 3]);
      assert.deepEqual(cp(1)(2)(3), [1, 2, 3]);
      const obj = { k: 10, f: curry(function (a, b) { return this.k + a + b; }) };
      assert.equal(obj.f(1)(2), 13);
    },
  },
  memoize: {
    names: ['memoize'],
    async run({ memoize }) {
      let calls = 0;
      const sq = memoize((n) => (calls++, n * n));
      assert.equal(sq(9), 81);
      assert.equal(sq(9), 81);
      assert.equal(calls, 1);
      let u = 0;
      const und = memoize(() => { u++; return undefined; });
      und(); und();
      assert.equal(u, 1, 'undefined results are cached');
      let k = 0;
      const two = memoize((a, b) => (k++, a + b));
      two(1, 2); two(1, 2); two(2, 1);
      assert.equal(k, 2);
      let l = 0;
      const lru = memoize((x) => (l++, x), { maxSize: 2 });
      lru(1); lru(2); lru(1); lru(3); lru(1);
      assert.equal(l, 3);
      lru(2);
      assert.equal(l, 4, 'least recently used entry was evicted');
      let r = 0;
      const failing = memoize(() => { r++; return Promise.reject(new Error('no')); });
      await failing().catch(() => {});
      await sleep(0);
      await failing().catch(() => {});
      assert.equal(r, 2, 'rejected promises are not cached');
      let s = 0;
      const shared = memoize(() => { s++; return sleep(10).then(() => 'v'); });
      await Promise.all([shared(), shared()]);
      assert.equal(s, 1, 'concurrent calls share one promise');
      sq.cache.clear();
      sq(9);
      assert.equal(calls, 2);
    },
  },
  'event-emitter': {
    names: ['EventEmitter'],
    async run({ EventEmitter }) {
      const bus = new EventEmitter();
      const log = [];
      const greet = (name) => log.push('hi ' + name);
      bus.on('join', greet);
      bus.once('join', (name) => log.push('first ' + name));
      assert.equal(bus.emit('join', 'Asha'), true);
      bus.emit('join', 'Ravi');
      bus.off('join', greet);
      assert.equal(bus.emit('join', 'Mia'), false);
      assert.deepEqual(log, ['hi Asha', 'first Asha', 'hi Ravi']);
      const seq = [];
      const a = () => { seq.push('a'); bus.off('e', a); };
      bus.on('e', a).on('e', () => seq.push('b'));
      bus.emit('e'); bus.emit('e');
      assert.deepEqual(seq, ['a', 'b', 'b'], 'self-removal does not skip the next listener');
      let o = 0;
      bus.once('r', () => { o++; bus.emit('r'); });
      bus.emit('r');
      assert.equal(o, 1);
      const x = () => {};
      bus.once('z', x);
      bus.off('z', x);
      assert.equal(bus.listenerCount('z'), 0, 'off removes a once listener by its original');
      const unsub = bus.subscribe('s', () => log.push('s'));
      bus.emit('s'); unsub(); bus.emit('s');
      assert.equal(log.filter((v) => v === 's').length, 1);
      const d = () => {};
      bus.on('d', d).on('d', d);
      bus.off('d', d);
      assert.equal(bus.listenerCount('d'), 1);
      assert.throws(() => bus.on('q', 5), TypeError);
    },
  },

  // ---------------------------------------------------------------- async
  'retry-backoff': {
    names: ['retry', 'sleep'],
    async run({ retry }) {
      let attempts = 0;
      const waits = [];
      const v = await retry(async () => { if (++attempts < 3) throw new Error('fail ' + attempts); return 'ok'; }, {
        retries: 3, baseDelay: 5, onRetry: (_e, _n, ms) => waits.push(ms),
      });
      assert.equal(v, 'ok');
      assert.equal(attempts, 3);
      assert.deepEqual(waits, [5, 10], 'delay doubles');
      let one = 0;
      await assert.rejects(retry(() => { one++; throw new Error('x'); }, { retries: 0 }), /x/);
      assert.equal(one, 1, 'retries: 0 means a single attempt');
      let last = 0;
      await assert.rejects(retry(async () => { throw new Error('e' + ++last); }, { retries: 2, baseDelay: 1 }), /e3/);
      let skipped = 0;
      await assert.rejects(retry(async () => { skipped++; throw new Error('400'); }, { retries: 5, baseDelay: 1, shouldRetry: () => false }));
      assert.equal(skipped, 1, 'shouldRetry false stops at once');
      const capped = [];
      await retry(async (n) => { if (n < 4) throw new Error(); }, { retries: 4, baseDelay: 1, factor: 10, maxDelay: 5, onRetry: (_e, _n, ms) => capped.push(ms) });
      assert.deepEqual(capped, [1, 5, 5, 5], 'maxDelay caps the wait');
      const ctrl = new AbortController();
      const t0 = Date.now();
      const p = retry(async () => { throw new Error('down'); }, { retries: 5, baseDelay: 1000, signal: ctrl.signal });
      setTimeout(() => ctrl.abort(new Error('aborted')), 10);
      await assert.rejects(p, /aborted/);
      assert.ok(Date.now() - t0 < 500, 'abort interrupts the wait');
    },
  },
  'promise-pool': {
    names: ['promisePool', 'promisePoolSettled', 'createLimiter'],
    async run({ promisePool, promisePoolSettled, createLimiter }) {
      let active = 0, peak = 0;
      const task = (v, ms) => async () => {
        active++; peak = Math.max(peak, active);
        await sleep(ms);
        active--;
        return v;
      };
      const res = await promisePool([task('a', 30), task('b', 5), task('c', 10), task('d', 5), task('e', 1)], 2);
      assert.deepEqual(res, ['a', 'b', 'c', 'd', 'e'], 'results in input order');
      assert.equal(peak, 2, 'never more than the limit in flight');
      assert.deepEqual(await promisePool([], 3), []);
      let started = 0;
      const tasks = [0, 1, 2, 3, 4, 5].map((i) => async () => { started++; await sleep(5); if (i === 1) throw new Error('bad'); return i; });
      await assert.rejects(promisePool(tasks, 2), /bad/);
      await sleep(30);
      assert.ok(started < 6, 'no new tasks start after a failure');
      const settled = await promisePoolSettled([async () => 1, async () => { throw new Error('x'); }], 2);
      assert.equal(settled[0].status, 'fulfilled');
      assert.equal(settled[1].status, 'rejected');
      await assert.rejects(promisePool([], 0), RangeError);
      const limit = createLimiter(2);
      active = 0; peak = 0;
      const out = await Promise.all([1, 2, 3, 4].map((i) => limit(task(i, 5))));
      assert.deepEqual(out, [1, 2, 3, 4]);
      assert.equal(peak, 2);
      assert.equal(limit.activeCount, 0);
      await assert.rejects(limit(() => { throw new Error('sync'); }), /sync/);
      assert.equal(await limit(async () => 'still works'), 'still works', 'a failure frees its slot');
    },
  },
  'async-task-queue': {
    names: ['TaskQueue'],
    async run({ TaskQueue }) {
      const q = new TaskQueue({ concurrency: 2 });
      let active = 0, peak = 0;
      const job = (v, ms) => async () => { active++; peak = Math.max(peak, active); await sleep(ms); active--; return v; };
      const results = await Promise.all([q.add(job(1, 10)), q.add(job(2, 5)), q.add(job(3, 5)), q.add(job(4, 1))]);
      assert.deepEqual(results, [1, 2, 3, 4]);
      assert.equal(peak, 2);
      q.pause();
      let ran = false;
      const later = q.add(async () => { ran = true; return 'late'; });
      await sleep(20);
      assert.equal(ran, false, 'paused queue does not start tasks');
      assert.equal(q.size, 1);
      q.resume();
      assert.equal(await later, 'late');
      const failing = q.add(async () => { throw new Error('boom'); });
      const fine = q.add(async () => 'ok');
      await assert.rejects(failing, /boom/);
      assert.equal(await fine, 'ok', 'one failure does not affect others');
      await q.onIdle();
      assert.equal(q.pending, 0);
      const q2 = new TaskQueue({ concurrency: 1, autoStart: false });
      const dropped = q2.add(async () => 1);
      q2.clear();
      await assert.rejects(dropped, /cleared/);
      await q2.onIdle();
      const q3 = new TaskQueue({ concurrency: 1 });
      q3.add(() => sleep(10));
      let idle = false;
      q3.onIdle().then(() => { idle = true; });
      await sleep(2);
      assert.equal(idle, false, 'onIdle waits for running tasks');
      await sleep(20);
      assert.equal(idle, true);
    },
  },
  'sleep-timeout': {
    names: ['sleep', 'withTimeout', 'TimeoutError'],
    async run({ sleep: sl, withTimeout, TimeoutError }) {
      const t0 = Date.now();
      await sl(15);
      assert.ok(Date.now() - t0 >= 10);
      const ctrl = new AbortController();
      const p = sl(1000, { signal: ctrl.signal });
      ctrl.abort(new Error('stop'));
      await assert.rejects(p, /stop/);
      await assert.rejects(sl(10, { signal: AbortSignal.abort(new Error('pre')) }), /pre/);
      assert.equal(await withTimeout(wait(5, 'fast'), 100), 'fast');
      await assert.rejects(withTimeout(wait(200, 'slow'), 20), (e) => e instanceof TimeoutError && e.name === 'TimeoutError');
      await assert.rejects(withTimeout(wait(5, 'own', true), 100), (e) => e === 'own');
      let aborted = false;
      await assert.rejects(
        withTimeout((signal) => new Promise((_, rej) => signal.addEventListener('abort', () => { aborted = true; rej(signal.reason); })), 15),
        TimeoutError,
      );
      assert.ok(aborted, 'the work receives an abort');
      assert.equal(await withTimeout(async (signal) => (signal.aborted ? 'x' : 'ran'), 50), 'ran');
    },
  },

  // ---------------------------------------------------------------- UI (pure logic only)
  autocomplete: {
    names: ['moveIndex', 'highlight', 'useDebouncedValue', 'Autocomplete'],
    async run({ moveIndex, highlight }) {
      assert.equal(moveIndex(-1, 1, 3), 0);
      assert.equal(moveIndex(-1, -1, 3), 2);
      assert.equal(moveIndex(2, 1, 3), 0, 'wraps forward');
      assert.equal(moveIndex(0, -1, 3), 2, 'wraps backward');
      assert.equal(moveIndex(1, 1, 0), -1, 'empty list');
      assert.deepEqual(highlight('JavaScript', 'script'), [
        { text: 'Java', match: false },
        { text: 'Script', match: true },
      ]);
      assert.deepEqual(highlight('apple', 'ap'), [{ text: 'ap', match: true }, { text: 'ple', match: false }]);
      assert.deepEqual(highlight('abc', ''), [{ text: 'abc', match: false }]);
      assert.deepEqual(highlight('abc', 'x'), [{ text: 'abc', match: false }]);
    },
  },
  'infinite-scroll': {
    names: ['listReducer', 'initialList', 'canLoadMore', 'useInfiniteList', 'InfiniteList'],
    async run({ listReducer, initialList, canLoadMore }) {
      assert.ok(canLoadMore(initialList));
      let s = listReducer(initialList, { type: 'start' });
      assert.equal(s.status, 'loading');
      assert.ok(!canLoadMore(s), 'no second request while loading');
      s = listReducer(s, { type: 'success', items: [{ id: 1 }, { id: 2 }], nextCursor: 'c2' });
      assert.deepEqual(s.items.map((x) => x.id), [1, 2]);
      assert.equal(s.cursor, 'c2');
      assert.ok(canLoadMore(s));
      s = listReducer(listReducer(s, { type: 'start' }), { type: 'success', items: [{ id: 2 }, { id: 3 }], nextCursor: null });
      assert.deepEqual(s.items.map((x) => x.id), [1, 2, 3], 'duplicates dropped');
      assert.equal(s.hasMore, false);
      assert.ok(!canLoadMore(s), 'stops at the end');
      const e = listReducer(listReducer(initialList, { type: 'start' }), { type: 'error', error: 'net' });
      assert.equal(e.status, 'error');
      assert.ok(!canLoadMore(e), 'no automatic retry loop');
      assert.ok(canLoadMore(listReducer(e, { type: 'retry' })));
      assert.equal(initialList.items.length, 0, 'reducer does not mutate state');
    },
  },
  'star-rating': {
    names: ['nextRating', 'ratingAfterClick', 'StarRating'],
    async run({ nextRating, ratingAfterClick }) {
      assert.equal(nextRating(3, 'ArrowRight', 5), 4);
      assert.equal(nextRating(5, 'ArrowRight', 5), 5, 'stops at max');
      assert.equal(nextRating(1, 'ArrowLeft', 5), 1, 'stops at 1');
      assert.equal(nextRating(0, 'ArrowUp', 5), 1);
      assert.equal(nextRating(3, 'Home', 5), 1);
      assert.equal(nextRating(3, 'End', 5), 5);
      assert.equal(nextRating(3, 'a', 5), 3);
      assert.equal(ratingAfterClick(3, 3), 0, 'clicking the current rating clears it');
      assert.equal(ratingAfterClick(3, 4), 4);
    },
  },
  'file-tree': {
    names: ['isFolder', 'toggleId', 'addNode', 'removeNode', 'visibleRows', 'treeKey', 'FileTree'],
    async run({ toggleId, addNode, removeNode, visibleRows, treeKey }) {
      const tree = {
        id: 'root', name: 'src', children: [
          { id: 'c', name: 'components', children: [{ id: 'b', name: 'Button.jsx' }] },
          { id: 'i', name: 'index.js' },
        ],
      };
      const snapshot = JSON.stringify(tree);
      const s1 = new Set(['root']);
      const s2 = toggleId(s1, 'c');
      assert.ok(s2.has('c') && !s1.has('c'), 'toggleId returns a new set');
      const added = addNode(tree, 'c', { id: 'n', name: 'Card.jsx' });
      assert.deepEqual(added.children[0].children.map((x) => x.id), ['b', 'n']);
      assert.equal(addNode(tree, 'i', { id: 'z', name: 'x' }), tree, 'cannot add inside a file');
      assert.deepEqual(removeNode(tree, 'b').children[0].children, []);
      assert.deepEqual(removeNode(tree, 'c').children.map((x) => x.id), ['i']);
      assert.equal(removeNode(tree, 'nope'), tree, 'no match keeps the same object');
      assert.equal(added.children[1], tree.children[1], 'untouched subtrees keep their identity');
      assert.equal(JSON.stringify(tree), snapshot, 'updates never mutate the input');
      assert.deepEqual(visibleRows(tree, s1).map((r) => r.node.id), ['root', 'c', 'i']);
      assert.deepEqual(visibleRows(tree, s2).map((r) => `${r.node.id}:${r.depth}`), ['root:1', 'c:2', 'b:3', 'i:2']);
      let st = { focus: 'root', expanded: s1 };
      const press = (key) => (st = treeKey(tree, st.expanded, st.focus, key));
      press('ArrowDown'); assert.equal(st.focus, 'c');
      press('ArrowRight'); assert.ok(st.expanded.has('c'), '→ expands a closed folder');
      press('ArrowRight'); assert.equal(st.focus, 'b', '→ on an open folder enters it');
      press('ArrowLeft'); assert.equal(st.focus, 'c', '← on a file goes to the parent');
      press('ArrowLeft'); assert.ok(!st.expanded.has('c'), '← collapses an open folder');
      press('End'); assert.equal(st.focus, 'i');
      press('Home'); assert.equal(st.focus, 'root');
      press('ArrowUp'); assert.equal(st.focus, 'root', 'stays at the top');
    },
  },
  'tabs-accordion': {
    names: ['nextTabIndex', 'toggleSection', 'Tabs', 'Accordion'],
    async run({ nextTabIndex, toggleSection }) {
      assert.equal(nextTabIndex(0, 'ArrowRight', 3), 1);
      assert.equal(nextTabIndex(2, 'ArrowRight', 3), 0, 'wraps forward');
      assert.equal(nextTabIndex(0, 'ArrowLeft', 3), 2, 'wraps backward');
      assert.equal(nextTabIndex(1, 'Home', 3), 0);
      assert.equal(nextTabIndex(1, 'End', 3), 2);
      assert.equal(nextTabIndex(1, 'Enter', 3), 1);
      assert.deepEqual(toggleSection([], 'a', false), ['a']);
      assert.deepEqual(toggleSection(['a'], 'b', false), ['b'], 'single mode closes the others');
      assert.deepEqual(toggleSection(['a'], 'b', true), ['a', 'b']);
      assert.deepEqual(toggleSection(['a', 'b'], 'a', true), ['b']);
    },
  },
  toast: {
    names: ['toastReducer', 'visibleToasts', 'useToast', 'ToastProvider'],
    async run({ toastReducer, visibleToasts }) {
      let s = [];
      s = toastReducer(s, { type: 'add', toast: { id: 'a', message: 'Saving…' } });
      s = toastReducer(s, { type: 'add', toast: { id: 'b', message: 'Hi' } });
      s = toastReducer(s, { type: 'add', toast: { id: 'a', message: 'Saved' } });
      assert.deepEqual(s.map((t) => t.message), ['Saved', 'Hi'], 'same id updates in place');
      s = toastReducer(s, { type: 'add', toast: { id: 'c', message: '3' } });
      s = toastReducer(s, { type: 'add', toast: { id: 'd', message: '4' } });
      assert.deepEqual(visibleToasts(s, 3).map((t) => t.id), ['a', 'b', 'c'], 'extra toasts wait');
      s = toastReducer(s, { type: 'remove', id: 'a' });
      assert.deepEqual(visibleToasts(s, 3).map((t) => t.id), ['b', 'c', 'd'], 'queued toast appears');
      assert.deepEqual(toastReducer(s, { type: 'clear' }), []);
      assert.equal(toastReducer(s, { type: 'unknown' }), s);
    },
  },
};
