---
title: "Node.js Interview Questions"
part: "Node.js"
track: "nodejs"
kind: "questions"
order: 1
updated: 2026-09-06
description: "Node.js interview questions with concise answers and code — runtime model, event loop, modules, streams, clustering, Express, async, error handling, security, performance and testing."
---

Self-test drill. Read the question, answer it in your head, then reveal.

## What is Node.js?

A runtime that runs JavaScript outside the browser, built on Chrome's **V8** engine plus **libuv** for asynchronous I/O. It is single-threaded for your JS code, event-driven, and non-blocking — ideal for I/O-heavy servers (APIs, real-time apps), poor for CPU-heavy work.

## How does Node.js work / what is its process model?

One thread runs the event loop and your JavaScript. I/O operations (network, disk, DNS) are handed to the OS or to libuv's thread pool and their completions are queued back as callbacks. When the call stack is empty, the event loop pulls the next callback. So thousands of connections are handled concurrently on one thread without one blocking another.

## Difference between a process and a thread; how does Node use each?

A **process** has its own memory space; a **thread** shares memory with other threads in the same process. Node runs your JS on a single thread but uses:
- **libuv's thread pool** (default 4, `UV_THREADPOOL_SIZE`) for file I/O, DNS, crypto, compression.
- **`worker_threads`** — real threads sharing memory via `SharedArrayBuffer`, for CPU-bound work.
- **`cluster` / `child_process`** — separate processes, no shared memory, to use multiple cores.

## What is V8, and what is libuv, and why is libuv needed?

**V8** compiles and runs JavaScript (parse → bytecode → JIT-optimised machine code for hot paths). It has no concept of files, sockets or timers. **libuv** is the C library that provides the event loop, the async file system, networking, timers and the thread pool — it's what makes non-blocking I/O possible and abstracts OS differences (epoll/kqueue/IOCP).

## What are the core (built-in) modules?

`fs`, `path`, `os`, `http`/`https`/`http2`, `net`, `events`, `stream`, `buffer`, `crypto`, `url`, `querystring`, `util`, `child_process`, `worker_threads`, `cluster`, `zlib`, `dns`, `assert`, `process`, `timers`, `readline`, `vm`. Import with the `node:` prefix (`import fs from 'node:fs'`) to be explicit and future-proof.

## What are the global objects in Node.js?

`process`, `console`, `Buffer`, `global` (`globalThis`), `setTimeout`/`setInterval`/`setImmediate`/`queueMicrotask`, `__dirname`/`__filename` (CommonJS only), `require`/`module`/`exports` (CommonJS only), `URL`, `TextEncoder`/`TextDecoder`, `fetch` (stable since Node 21), `structuredClone`.

## What is the Reactor pattern?

An event-handling pattern: a single event loop waits (demultiplexes) on many I/O sources; when one is ready it dispatches the associated handler. Node's event loop + libuv is an implementation of it — you register callbacks, the reactor invokes them when the resource is ready, nothing polls or blocks.

## How does V8 compile JavaScript?

The parser builds an AST, **Ignition** generates bytecode and runs it, and the **TurboFan** optimising compiler recompiles frequently-run ("hot") functions to fast machine code using type feedback. If assumptions break (e.g. a variable's type changes), it **deoptimises** back to bytecode. Keeping object shapes and argument types stable helps the optimiser.

## What is JIT and how does it relate to Node?

Just-In-Time compilation: instead of purely interpreting or purely ahead-of-time compiling, V8 compiles code to machine code *while the program runs*, focusing effort on hot paths. That's why a Node process is slow for the first few requests and then speeds up.

## Create a simple "Hello World" HTTP server

```js
import { createServer } from 'node:http';

createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
}).listen(3000, () => console.log('http://localhost:3000'));
```

## What is the REPL?

Read–Eval–Print Loop — the interactive shell you get by running `node` with no file. It reads an expression, evaluates it, prints the result, and loops. Useful for quick experiments; `.help`, `.load`, `.save`, `.editor` are its dot-commands.

## What is the difference between npm and npx?

**npm** installs and manages packages and runs `package.json` scripts. **npx** executes a package binary — from `node_modules/.bin` if present, otherwise it downloads it temporarily — so you can run a CLI (`npx create-vite`, `npx eslint .`) without a global install.

## What is `package.json` and what is `package-lock.json`?

`package.json` declares your project's metadata, dependencies (with semver ranges), and scripts. `package-lock.json` records the **exact** resolved version and integrity hash of every package in the tree, so `npm ci` reproduces an identical `node_modules` on every machine and in CI. Commit both.

## Explain semantic versioning (semver)

`MAJOR.MINOR.PATCH`. Bump **PATCH** for backwards-compatible bug fixes, **MINOR** for backwards-compatible features, **MAJOR** for breaking changes. Ranges: `^1.2.3` allows `<2.0.0`, `~1.2.3` allows `<1.3.0`, `1.2.3` is exact.

## What are environment variables and how do you use them?

OS-level key/value config read via `process.env.NAME`. Keep secrets and per-environment settings (DB URLs, API keys, ports) out of code. In development, load them from a `.env` file; in production, set them in the host/orchestrator. Node 20.6+ can load a file directly with `node --env-file=.env app.js`.

## What is `NODE_ENV` used for?

A convention (`development` / `production` / `test`) that libraries and your code branch on — e.g. Express disables verbose error pages and enables view caching when `NODE_ENV === 'production'`; bundlers strip dev-only code. Set it explicitly in production.

## How do you manage config for multiple environments?

A single config module that reads `process.env` with sensible defaults and validates required keys at startup (e.g. with `zod` or `envalid`), failing fast if something is missing. Load `.env.<NODE_ENV>` in dev; never commit real secrets.

## CommonJS vs ES Modules in Node

| | CommonJS | ES Modules |
|---|---|---|
| Import | `require()` (synchronous) | `import` (static) / `import()` (dynamic) |
| Export | `module.exports` | `export` |
| Loading | runtime, can be conditional | resolved statically, hoisted |
| `__dirname` | available | use `import.meta.dirname` (Node 20.11+) |
| File | `.cjs` or `"type":"commonjs"` | `.mjs` or `"type":"module"` |

ESM enables tree-shaking and top-level `await`; it's the modern default.

## How does module caching work?

The first `require`/`import` of a module runs it once and caches the resulting `exports` object keyed by resolved path. Subsequent imports get the **same** object — so a module can hold singleton state (a DB pool, a config). `require.cache` exposes it; deleting an entry forces a re-load (used by some hot-reload tools).

## How do you work with Buffers?

`Buffer` is a fixed-size chunk of raw binary memory outside the V8 heap, used for file/network bytes.

```js
const b = Buffer.from('héllo', 'utf8');
b.length;                    // byte length (6), not char length
b.toString('base64');
Buffer.alloc(16);            // zero-filled
Buffer.concat([b1, b2]);
```

Use `Buffer.alloc` (safe, zeroed), not `Buffer.allocUnsafe` unless you immediately overwrite it.

## What is EventEmitter and how does it work?

The pub/sub primitive most of Node's async API is built on. An object emits named events; listeners registered with `.on(name, fn)` are called **synchronously** in registration order when `.emit(name, ...args)` fires.

```js
import { EventEmitter } from 'node:events';
class Bus extends EventEmitter {}
const bus = new Bus();
bus.on('order', (id) => console.log('got', id));
bus.emit('order', 42);
```

Key methods: `on`/`addListener`, `once`, `off`/`removeListener`, `emit`, `listenerCount`, `removeAllListeners`. An unhandled `'error'` event throws — always add an error listener. Raise `setMaxListeners` if you legitimately need more than 10.

## How does the event loop work — what are its phases?

Each iteration ("tick") runs these libuv phases in order:
1. **timers** — `setTimeout` / `setInterval` callbacks whose time has elapsed
2. **pending callbacks** — some deferred system callbacks (e.g. TCP errors)
3. **poll** — retrieve new I/O events; execute I/O callbacks; may block here waiting for I/O
4. **check** — `setImmediate` callbacks
5. **close** — `'close'` events (e.g. `socket.on('close')`)

**Between every phase** (and between individual callbacks), Node drains the **microtask queues**: `process.nextTick` first, then resolved Promises.

## `process.nextTick()` vs `setImmediate()` vs `setTimeout(fn, 0)`

- **`process.nextTick`** — runs before the event loop continues, after the current operation, ahead of promises. Highest priority; can starve the loop if it recurses.
- **`Promise.then` / `queueMicrotask`** — after `nextTick`, still before the loop moves on.
- **`setImmediate`** — runs in the **check** phase, i.e. after the current poll phase.
- **`setTimeout(fn, 0)`** — runs in the **timers** phase of a later tick; minimum delay is ~1ms.

Inside an I/O callback, `setImmediate` always fires before `setTimeout(fn, 0)`.

## Microtasks vs macrotasks in Node

**Microtasks** — `process.nextTick` and Promise reactions; the whole queue is drained after each callback and between event-loop phases. **Macrotasks** — timers, I/O callbacks, `setImmediate`; one is taken per phase. Microtasks always run to completion before the next macrotask.

## What is a callback and what is an error-first callback?

A function passed to an async operation to be invoked when it completes. Node's convention is **error-first**: `(err, result) => { if (err) ... }` — the first argument is an `Error` or `null`, the result follows. This makes error handling uniform and composable (`callbackify`, `promisify`).

## What is callback hell and how do you avoid it?

Deeply nested callbacks ("pyramid of doom") from sequential async steps — hard to read, hard to handle errors. Fixes: named functions, Promises with `.then` chaining, and especially **`async/await`** with `try/catch`. For parallel work, `Promise.all`.

## Events vs callbacks — when to use which?

A **callback** is for a single, one-time result of one operation. An **EventEmitter** is for a stream of recurring events over time (many `'data'` events, `'connection'` events) and lets multiple independent listeners react. Callbacks are consumed once; events can fire repeatedly.

## What are the timing features / how do you implement `sleep`?

Timers: `setTimeout`, `setInterval`, `setImmediate`, plus `timers/promises`.

```js
import { setTimeout as sleep } from 'node:timers/promises';
await sleep(1000);           // non-blocking delay
```

Never busy-wait with a `while` loop — it blocks the event loop.

## How does Node read and write files?

```js
import { readFile, writeFile, appendFile } from 'node:fs/promises';

const text = await readFile('data.txt', 'utf8');   // whole file into memory
await writeFile('out.txt', 'hello');               // overwrite
await appendFile('log.txt', 'line\n');
```

For large files use **streams** so you don't load everything into memory. Sync variants (`readFileSync`) exist but block the event loop — only for startup/CLI code.

## How do you delete, rename, stat, and check existence of a file?

```js
import { rm, rename, stat, access } from 'node:fs/promises';
import { constants } from 'node:fs';

await rm('tmp.txt', { force: true });
await rename('a.txt', 'b.txt');                     // also moves
const s = await stat('file.txt');                  // s.size, s.mtime, s.isDirectory()
try { await access('file.txt', constants.F_OK); /* exists */ } catch { /* missing */ }
```

Prefer "try the operation and handle the error" over `access`-then-act (avoids a TOCTOU race).

## How do you work with directories and watch for changes?

```js
import { mkdir, readdir } from 'node:fs/promises';
import { watch } from 'node:fs';

await mkdir('a/b/c', { recursive: true });
const entries = await readdir('.', { withFileTypes: true }); // Dirent[] with .isDirectory()
watch('src', { recursive: true }, (event, filename) => console.log(event, filename));
```

`fs.watch` is efficient but can fire duplicate events and behaves differently per OS; libraries like `chokidar` smooth this over.

## What types of streams are there?

- **Readable** — source you read from (`fs.createReadStream`, HTTP request).
- **Writable** — sink you write to (`fs.createWriteStream`, HTTP response).
- **Duplex** — both, independent (TCP socket).
- **Transform** — Duplex where output is a function of input (`zlib.createGzip`, hashing).

## How do you handle large data efficiently?

Stream it. Read a chunk, process it, write it, repeat — so memory stays constant regardless of file size.

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

await pipeline(createReadStream('big.log'), createGzip(), createWriteStream('big.log.gz'));
```

## What is backpressure and how is it handled?

When a fast producer overwhelms a slow consumer. `writable.write()` returns `false` when its internal buffer is full; a well-behaved producer then pauses until the `'drain'` event. `pipe()` and `pipeline()` handle this automatically — which is why you should prefer them over manual `.on('data')` + `.write()`.

## `pipe()` vs `pipeline()`

`pipe()` connects streams but does **not** forward errors or clean up the other streams on failure — you can leak file descriptors. `pipeline()` (and `stream/promises` `pipeline`) propagates errors, destroys all streams on failure, and gives you a completion callback/promise. Always use `pipeline` in production.

## Flowing vs paused mode; what is `highWaterMark`?

A Readable starts **paused**; attaching a `'data'` listener or calling `.pipe()` switches it to **flowing** (data is pushed at you). In paused mode you pull with `.read()`. **`highWaterMark`** is the internal buffer size (default 64 KB for streams, 16 for object mode) — the threshold at which `write()` returns `false` / the reader stops pulling. Tuning it trades memory for fewer syscalls.

## Is Node.js entirely single-threaded?

Your JavaScript runs on one thread, but Node is **not** single-threaded overall: libuv maintains a thread pool for file I/O, DNS and crypto, and you can spawn `worker_threads` and child processes. Network I/O uses the OS's async primitives, not the pool.

## How does the `cluster` module work?

The primary process forks N worker processes (usually one per CPU core) that **share the same listening port** — the OS/primary load-balances incoming connections across them (round-robin by default on non-Windows). Workers don't share memory, so shared state must go to Redis/DB. `cluster.isPrimary`, `cluster.fork()`, `worker.on('exit')` to respawn crashed workers.

```js
import cluster from 'node:cluster';
import { cpus } from 'node:os';

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());
} else {
  startServer();
}
```

In practice PM2 or a container orchestrator does this for you.

## `spawn()` vs `fork()` vs `exec()`

- **`spawn`** — launches any command, streams stdout/stderr; no shell, good for large output.
- **`exec`** — runs a command **in a shell**, buffers the whole output into a callback; convenient but vulnerable to shell injection and output-size limits.
- **`fork`** — special case of `spawn` for a new **Node** process, with a built-in IPC channel (`child.send()` / `process.on('message')`).

## What are Worker Threads and when do you use them?

Real OS threads inside one process, each with its own V8 isolate and event loop, able to share memory via `SharedArrayBuffer` and pass messages via `MessagePort`. Use them for **CPU-bound** work (image processing, encryption, big JSON transforms) that would otherwise block the main event loop. Not for scaling I/O — that's what the async model already does.

## How does Node handle concurrency if it's single-threaded?

By never blocking on I/O. Instead of waiting for a database or file, it registers a callback and moves on; libuv/OS signal completion later and the event loop runs the callback. Concurrency comes from many operations being *in flight* at once, not from parallel JS execution.

## How do you use all CPU cores?

Run one Node process per core — via `cluster`, PM2 cluster mode (`pm2 start app.js -i max`), or multiple containers behind a load balancer. For CPU-bound work within one process, offload to `worker_threads`.

## How do you gracefully shut down a Node server?

```js
const server = app.listen(3000);
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    server.close(() => console.log('stopped accepting connections'));
    await pool.end();          // close DB
    await queue.close();
    setTimeout(() => process.exit(1), 10_000).unref(); // force-exit safety net
  });
}
```

Stop accepting new connections, let in-flight requests finish, close resources, then exit. Without this, rolling deploys drop requests.

## How do you kill child processes that spawn their own children?

Spawn the child in its own **process group** (`{ detached: true }`) and kill the whole group with a negative PID: `process.kill(-child.pid, 'SIGTERM')`. Otherwise killing only the direct child orphans its descendants.

## What is a daemon process?

A long-running background process with no controlling terminal, typically started at boot and managed by an init system (systemd) or a process manager (PM2). A production Node service runs as a daemon so it survives logout and restarts on crash.

## What is a load balancer and how does it work?

A component that distributes incoming requests across multiple server instances to spread load and provide failover. Strategies: round-robin, least-connections, IP-hash, weighted. It also terminates TLS, does health checks, and removes unhealthy instances. Examples: Nginx, HAProxy, AWS ALB; `cluster` is a per-machine mini load balancer.

## Why use Express, and why separate `app` and `server`?

Express is a thin, unopinionated HTTP framework giving you routing, middleware, and request/response helpers without boilerplate. Keeping `app` (the Express instance, exported) separate from `server` (`http.createServer(app).listen(...)`) lets tests import `app` and hit it with Supertest without binding a port, and lets you reuse the app under HTTP/2 or serverless.

## What is middleware and what does `next` do?

A function `(req, res, next)` that runs in order on every matching request. It can read/modify `req`/`res`, end the response, or call **`next()`** to pass control to the next middleware. `next(err)` skips ahead to error-handling middleware (the 4-arg `(err, req, res, next)` form). Order matters — body parsers and auth must come before route handlers.

## How does routing work in Express?

`app.METHOD(path, ...handlers)` matches an HTTP method + path (with `:params`, wildcards, regex) to one or more handler functions. `express.Router()` groups related routes into a mountable mini-app (`app.use('/api/users', usersRouter)`). The first matching route wins unless a handler calls `next()`.

## `req.params` vs `req.query` vs `req.body`

- **`req.params`** — named segments from the path: `/users/:id` → `req.params.id`.
- **`req.query`** — parsed query string: `/search?q=x&page=2` → `req.query`.
- **`req.body`** — parsed request body; needs a body parser (`express.json()`, `express.urlencoded()`) and is only present for POST/PUT/PATCH.

## What is a RESTful web service?

An API style using HTTP verbs on resource URLs: `GET` (read, safe), `POST` (create), `PUT` (replace), `PATCH` (partial update), `DELETE`. Stateless requests, standard status codes, and representations (usually JSON). Idempotency: `GET`/`PUT`/`DELETE` are idempotent, `POST` is not.

## `PUT` vs `PATCH`

`PUT` replaces the entire resource with the request body (and is idempotent). `PATCH` applies a partial modification — send only the fields that change. Repeating the same `PATCH` (e.g. `{"$inc": {"views": 1}}`) may not be idempotent.

## How do you create an HTTPS server?

```js
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

createServer({
  key: readFileSync('key.pem'),
  cert: readFileSync('cert.pem'),
}, app).listen(443);
```

In production you usually terminate TLS at a reverse proxy / load balancer and run plain HTTP behind it.

## How do you handle file uploads?

`multipart/form-data` bodies need a dedicated parser — **`multer`** for Express. Configure storage (disk or memory), file-size limits, and a `fileFilter` for allowed MIME types. Stream large uploads straight to object storage (S3) rather than buffering them.

```js
import multer from 'multer';
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/avatar', upload.single('file'), (req, res) => res.json({ name: req.file.originalname }));
```

## How do you implement rate limiting?

A counter per client key (IP, API key, user id) in a fast store (Redis) with a time window; reject with `429` when the limit is exceeded. Algorithms: fixed window (simple, edge bursts), sliding window, token bucket (smooth, allows bursts). `express-rate-limit` with a Redis store is the common choice.

## How do you implement pagination in a REST API?

- **Offset/limit**: `?page=2&limit=20` → `OFFSET 20 LIMIT 20`. Simple, but slow on deep pages and can skip/repeat rows under concurrent writes.
- **Cursor/keyset**: `?after=<lastId>` → `WHERE id > :after ORDER BY id LIMIT 20`. Stable and fast at any depth; can't jump to an arbitrary page.

Return `nextCursor` / total count in the response.

## What is JWT and how do you use it for auth?

A signed token carrying claims (`sub`, `exp`, roles) in `header.payload.signature` form. On login the server signs a short-lived **access token**; the client sends it as `Authorization: Bearer <token>`; middleware verifies the signature and expiry and attaches `req.user`. Pair with a long-lived, rotating **refresh token** stored in an httpOnly cookie. Don't put secrets in the payload — it's only base64, not encrypted.

## How do microservices communicate?

- **Synchronous**: HTTP/REST or gRPC request/response — simple, but couples availability.
- **Asynchronous**: a message broker (RabbitMQ, Kafka, SQS) with events — decoupled, resilient, but eventually consistent.

Cross-cutting concerns: service discovery, an API gateway, correlation IDs for tracing, retries with backoff, circuit breakers, and the saga pattern for multi-service transactions.

## What is the difference between asynchronous and non-blocking?

**Non-blocking** describes an operation that returns immediately instead of waiting (the call doesn't block the thread). **Asynchronous** describes the completion model — the result arrives later via a callback/promise/event. Node's I/O is both: the call is non-blocking and its result is delivered asynchronously.

## Promises vs async/await

`async/await` is syntax over Promises — it lets you write asynchronous code that reads sequentially and use `try/catch`. Under the hood an `async` function returns a Promise and `await` suspends until it settles. Prefer `await` for readability; drop to `.then`/`Promise.all` for concurrency.

## `Promise.all` vs `allSettled` vs `race` vs `any`

- **`all`** — resolves with all results; rejects on the **first** rejection.
- **`allSettled`** — always resolves with `{status, value|reason}` for each; nothing short-circuits.
- **`race`** — settles as soon as **any** promise settles (fulfilled *or* rejected).
- **`any`** — resolves on the first **fulfilment**; rejects with an `AggregateError` only if all reject.

## How do you make an HTTP request from Node?

Built-in `fetch` (stable since Node 21), or `axios`/`undici` for more features.

```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada' }),
  signal: AbortSignal.timeout(5000),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

## What is error handling in Node — the main approaches?

- **Sync code**: `try/catch`.
- **Callbacks**: error-first — always check the first arg.
- **Promises / async-await**: `try/catch` around `await`, and a `.catch` on every promise chain.
- **EventEmitters / streams**: listen for the `'error'` event (unhandled `'error'` throws).
- **Last resort**: `process.on('uncaughtException')` and `process.on('unhandledRejection')` — log, then let the process exit and be restarted (state is unknown; don't try to resume).

## How do you handle errors in async Express routes?

`throw` inside an `async` handler rejects the promise, which Express 4 does **not** catch — you get a hung request. Fixes:
- Express **5** forwards rejected promises to error middleware automatically.
- On Express 4, wrap handlers: `const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);`
- Always end with an error-handling middleware `(err, req, res, next)` that logs and sends a clean response.

## How do you create custom errors?

```js
class AppError extends Error {
  constructor(message, statusCode = 500, code) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
class NotFoundError extends AppError { constructor(m = 'Not found') { super(m, 404, 'NOT_FOUND'); } }
```

Central error middleware then maps `err.statusCode` / `err.code` to a response.

## What causes "Process out of memory" / memory leaks, and how do you fix them?

Common leaks: unbounded caches or arrays, event listeners added per request and never removed, closures holding large objects, timers not cleared, global maps. Diagnose by watching `process.memoryUsage().heapUsed` trend upward, then diffing two heap snapshots (`--inspect` + Chrome DevTools, or `heapdump`) to see which constructor grew. Fixes: bound caches (LRU + TTL), remove listeners, reuse clients, stream instead of buffer. You can raise the limit with `--max-old-space-size` but that only delays the crash.

## How does garbage collection work in Node?

V8 uses a **generational** collector: new objects go in a small "young generation" collected frequently and cheaply (scavenge); survivors are promoted to the "old generation" collected less often with a mark-sweep-compact. GC pauses your JS ("stop the world"), so allocation churn and huge live sets hurt latency. You can't force GC unless you start with `--expose-gc`.

## How do you debug a Node application?

- `node --inspect app.js` (or `--inspect-brk` to pause on start) → open `chrome://inspect` or attach VS Code.
- `console.log` / `util.debuglog('mytag')` — the latter only prints when `NODE_DEBUG=mytag`.
- `node --prof` then `--prof-process` for a CPU profile; `--cpu-prof` writes a `.cpuprofile` for DevTools.
- `debugger;` statements, breakpoints, and the built-in `node inspect` CLI debugger.

## How do you profile CPU performance?

Generate a profile (`node --cpu-prof app.js`, or `clinic flame`, or the `v8-profiler` / `0x` tools), load it in Chrome DevTools' Performance tab or view the flame graph, and look for the widest frames — the functions where wall time is actually spent. Then optimise or offload those (e.g. to a worker thread).

## How do you measure a function's execution time?

```js
console.time('work'); doWork(); console.timeEnd('work');
// or, high-resolution:
import { performance } from 'node:perf_hooks';
const t = performance.now(); doWork(); console.log(performance.now() - t, 'ms');
```

`perf_hooks` also has `PerformanceObserver` and marks/measures for structured timing.

## What is a stub, and what is the test pyramid?

A **stub** replaces a function/dependency with a canned implementation so a unit test runs in isolation and deterministically (e.g. stub a DB call to return fixed rows). The **test pyramid**: many fast **unit** tests at the base, fewer **integration** tests in the middle, very few slow **end-to-end** tests at the top — because higher-level tests are slower and more brittle.

## How do you write unit tests / test Express routes?

- **Node's built-in test runner** (`node --test`) or Jest/Vitest for `describe`/`it`/`expect` and mocking.
- **Supertest** drives the exported `app` without opening a port:

```js
import request from 'supertest';
import app from '../app.js';

test('GET /health', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
});
```

- **Joi / Zod** for schema validation, tested independently of routes.

## How do you validate request input?

Define a schema (`zod` or `joi`) per endpoint and validate `req.body` / `req.query` / `req.params` in a middleware, returning `400` with the errors on failure. This keeps handlers clean and prevents malformed data reaching your logic or database.

## How do you secure a Node.js application?

- **`helmet`** for security headers (CSP, HSTS, `X-Content-Type-Options`, frame options).
- Validate and sanitise **all** input; use parameterised queries / an ORM to stop **SQL injection**.
- `express-rate-limit` + slow-down against brute force and basic DDoS; put a real WAF/CDN in front for volumetric attacks.
- Hash passwords with **bcrypt/argon2** (never SHA/MD5), per-user salt.
- httpOnly + Secure + SameSite cookies; CSRF tokens for cookie-auth; short-lived JWTs.
- Keep dependencies patched (`npm audit`, Dependabot); run as a non-root user; don't leak stack traces in production.

## How do you hash passwords securely?

```js
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);      // cost factor 12
const ok = await bcrypt.compare(password, hash);
```

`bcrypt`/`argon2` are deliberately slow and salted, which resists brute-force and rainbow-table attacks. Never store plaintext or a fast hash.

## How do you protect HTTP cookies against XSS?

Set **`httpOnly`** (JS can't read the cookie), **`Secure`** (HTTPS only), and **`SameSite=Lax`/`Strict`** (limits CSRF). Also send a strict Content-Security-Policy so injected scripts can't run in the first place. Don't keep session tokens in `localStorage` — any XSS can exfiltrate them.

## What is Helmet.js?

Express middleware that sets a bundle of protective HTTP response headers with sensible defaults — CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and removes `X-Powered-By`. One `app.use(helmet())` covers most header hygiene.

## How do you protect a REST API from DDoS?

Application code can't stop a volumetric attack — you need a CDN/WAF (Cloudflare, AWS Shield) and autoscaling. In the app: rate-limit and slow-down per client, cap request body size, set aggressive timeouts, use connection limits, cache aggressively, and fail fast. Keep expensive endpoints behind auth.

## What is `crypto` used for?

Node's cryptography module: hashing (`createHash`), HMAC, random bytes (`randomBytes`, `randomUUID`), symmetric encryption (`createCipheriv`), key derivation (`scrypt`, `pbkdf2`), and asymmetric keys/signing. Use `randomUUID()` for ids and `timingSafeEqual` when comparing secrets.

## How do you generate and verify a checksum?

```js
import { createHash } from 'node:crypto';
const checksum = createHash('sha256').update(data).digest('hex');
const valid = checksum === expected;
```

Used for file integrity, cache keys, deduplication, ETags.

## How do you access / implement caching in Node?

- **In-process**: a `Map` or an LRU (`lru-cache`) with TTL — fastest, but per-instance and lost on restart.
- **Distributed**: **Redis** (or Memcached) — shared across instances, survives restarts, supports TTL and eviction.

Pattern (cache-aside): check cache → on miss, load from DB → write to cache with TTL → return. Invalidate on write. Guard against a **cache stampede** (many misses on a hot key expiring at once) with a short lock or staggered TTLs.

```js
async function getUser(id) {
  const key = `user:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const user = await db.users.findById(id);
  await redis.set(key, JSON.stringify(user), 'EX', 300);
  return user;
}
```

## How do you improve Node.js application performance?

- Cache (Redis, HTTP `Cache-Control`, CDN for static assets).
- **`compression`** middleware (gzip/brotli) for responses.
- **Connection pooling** for the database (reuse connections instead of opening one per request).
- Run all cores (`cluster`/PM2), offload CPU work to worker threads.
- Avoid sync APIs on the request path; stream large payloads.
- Use a reverse proxy (Nginx) for TLS and static files; enable HTTP keep-alive.
- Profile before optimising — fix the widest flame-graph frame, not a guess.

## How does connection pooling improve database performance?

Opening a DB connection (TCP + auth handshake) costs tens of milliseconds. A pool keeps a fixed set of open connections and hands them out per query, returning them afterwards — so requests reuse warm connections and the DB isn't overwhelmed by thousands of concurrent opens. Configure `min`, `max`, and idle timeout.

## What is `compression` middleware?

`app.use(compression())` gzips/brotli-compresses responses above a size threshold, cutting bandwidth and transfer time for text (JSON, HTML, CSS, JS) at a small CPU cost. Skip it for already-compressed content (images, video) and when a CDN/proxy already compresses.

## How do you use PM2 in production?

A process manager that keeps Node apps alive: `pm2 start app.js -i max` (cluster mode across cores), auto-restart on crash, `pm2 reload` for zero-downtime deploys, log aggregation, memory-limit restarts (`--max-memory-restart 300M`), and `pm2 startup` to run on boot. An `ecosystem.config.js` file holds the config.

## What is logging and how should you do it in Node?

Structured, level-based logging (`error`/`warn`/`info`/`debug`) with a library like **pino** or **winston** — JSON output so logs are machine-parseable, with request/correlation IDs to trace a request across services. Don't `console.log` in production (unbuffered, unstructured, slow). Ship logs to a central system (ELK, Loki, Datadog).

## What is the `path` module?

Cross-platform path manipulation: `path.join`, `path.resolve` (to an absolute path), `path.basename`, `path.extname`, `path.dirname`, `path.sep`. Always build paths with it instead of string concatenation so code works on Windows and POSIX.

## What is the `os` module?

Info about the host: `os.cpus()`, `os.totalmem()`/`os.freemem()`, `os.platform()`, `os.hostname()`, `os.networkInterfaces()`, `os.loadavg()`, `os.tmpdir()`. Useful for sizing worker pools and health metrics.

## What is the `vm` module used for?

Runs JavaScript in a separate V8 context — used for templating engines, config evaluation, and lightweight sandboxes. It is **not** a security boundary on its own (context ≠ isolate); for untrusted code use `worker_threads` with limits, a real sandbox (`isolated-vm`), or a separate process/container.

## What is the DNS module?

Name resolution: `dns.lookup` (uses the OS resolver, goes through the libuv thread pool) vs `dns.resolve*` (queries DNS servers directly, async, no thread pool). `lookup` is what `http`/`net` use under the hood; heavy `lookup` traffic can saturate the thread pool.

## How does `assert` work?

`node:assert` throws an `AssertionError` when a condition is false: `assert.strictEqual(a, b)`, `assert.deepStrictEqual(obj1, obj2)`, `assert.throws(fn)`, `assert.rejects(promise)`. It's the basis of the built-in test runner; in app code prefer explicit error handling.

## How do you execute an external program from Node?

`child_process` — `execFile`/`spawn` for a specific binary with an args array (safe from shell injection), `exec` only when you genuinely need shell features (and never with unsanitised input). `spawn` streams output; `execFile` buffers it.

## What is internationalization (i18n) in Node, and how do you do it?

Serving content adapted to a user's language and region. Use the built-in **`Intl`** API for locale-aware date/number/currency formatting (`new Intl.DateTimeFormat('de-DE').format(date)`), and a library like **i18next** for translation catalogues, pluralisation, and language detection (from `Accept-Language` header, a cookie, or a URL segment).

## What kinds of apps is Node good and bad for?

**Good**: REST/GraphQL APIs, real-time apps (chat, collaboration, live dashboards) via WebSockets, streaming/proxying, microservices, CLIs, SSR front-ends, glue/automation. **Bad**: CPU-bound workloads — heavy computation, video encoding, large data crunching, ML inference — which block the single event loop; use a worker thread, a queue + worker service, or a different runtime for those.

## What are SOLID principles and how do they apply in Node?

- **S**ingle Responsibility — a module/class does one thing (a route handler shouldn't also talk to the DB).
- **O**pen/Closed — extend behaviour without editing existing code (plugins, middleware).
- **L**iskov Substitution — subtypes must be usable wherever the base type is.
- **I**nterface Segregation — small focused interfaces over fat ones.
- **D**ependency Inversion — depend on abstractions; inject the DB client / logger rather than `require`-ing a concrete one, which also makes testing easy.

In Node this usually means a layered structure: routes → controllers → services → repositories, with dependencies passed in.
