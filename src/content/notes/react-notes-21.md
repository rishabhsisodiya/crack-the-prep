---
title: "Code-Splitting"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 20
description: "React — bundling, dynamic import(), React.lazy and Suspense, error boundaries, route-based splitting, and named exports."
---
### Bundling and why we split

Most React apps have their files **"bundled"** by tools like **Vite (Rollup)**, **webpack** or **esbuild**. **Bundling is the process of following imported files and merging them into a single file: a "bundle".** The bundle is then included on a web page to load the entire app at once.

Bundling is great, but **as your app grows, your bundle grows too** — especially with large third-party libraries. A big bundle means a slower first load. To avoid that, start **"splitting"** your bundle. **Code-splitting** is supported by bundlers like Vite/Rollup and webpack: they create **multiple bundles (chunks)** that can be **loaded dynamically at runtime**.

**Code-splitting** helps you **"lazy-load"** only what the user currently needs, which can dramatically improve performance. You haven't reduced the total amount of code in your app, but you've **avoided loading code the user may never need** and reduced the code needed for the **initial load**.

### import()

The best way to introduce code-splitting is the **dynamic `import()`** syntax.

**Before:**

```jsx
import { add } from './math';

console.log(add(16, 26));
```

**After:**

```jsx
import("./math").then(math => {
  console.log(math.add(16, 26));
});

// or with async/await
const math = await import('./math');
console.log(math.add(16, 26)); // 42
```

`import()` returns a **Promise** that resolves to the module. **When the bundler sees this syntax, it automatically puts `./math` into a separate chunk** that's downloaded only when this line runs.

**Vite, webpack 5 and Next.js support it out of the box.** (Old Create React App projects also had it configured.) With Babel, the dynamic import syntax is part of `@babel/preset-env` today; very old setups needed `@babel/plugin-syntax-dynamic-import`.

**Example — load a heavy library only when needed:**

```jsx
async function exportToPdf(data) {
  const { jsPDF } = await import('jspdf'); // downloaded only when the user clicks "Export"
  const doc = new jsPDF();
  doc.text(JSON.stringify(data), 10, 10);
  doc.save('report.pdf');
}

<button onClick={() => exportToPdf(report)}>Export PDF</button>
```

### React.lazy

The **`React.lazy`** function lets you render a dynamic import as a regular component.

**Before:**

```jsx
import OtherComponent from './OtherComponent';
```

**After:**

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

This **automatically loads the chunk containing `OtherComponent` when it's first rendered**.

**`React.lazy` takes a function that must call a dynamic `import()`. It must return a Promise that resolves to a module with a `default` export containing a React component.**

**Declare lazy components at the top level of a module**, not inside another component — otherwise a new lazy component is created on every render and its state resets.

```jsx
// ❌ Inside a component: re-created every render
function App() {
  const Settings = lazy(() => import('./Settings'));
  return <Settings />;
}

// ✅ Module level
const Settings = lazy(() => import('./Settings'));
```

### Suspense

The lazy component should be rendered inside a **`Suspense`** component, which shows **fallback content** (like a loading indicator) while the component's code is loading.

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

The **`fallback`** prop accepts any React elements to render while waiting. You can place `Suspense` **anywhere above** the lazy component, and **one `Suspense` can wrap multiple lazy components**:

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

With one boundary, the fallback shows until **both** have loaded. Use **separate** `Suspense` boundaries if each part should appear as soon as it's ready.

**Load only when needed (e.g. a modal):**

```jsx
const ReportModal = lazy(() => import('./ReportModal'));

function Dashboard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open report</button>
      {open && (
        <Suspense fallback={<Spinner />}>
          <ReportModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
// The ReportModal chunk is downloaded only after the first click.
```

**Preloading** (start downloading before it's needed, e.g. on hover):

```jsx
const loadReport = () => import('./ReportModal');
const ReportModal = lazy(loadReport);

<button onMouseEnter={loadReport} onClick={() => setOpen(true)}>Open report</button>
```

### Error boundaries

If the other module **fails to load** (for example, due to a network failure or a new deployment removing old chunks), it throws an error. Handle it with an **error boundary** to show a nice error state and allow recovery. Place the error boundary **anywhere above** the lazy components.

```jsx
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

(See **Component Lifecycle Methods → Error boundary** for how to write `MyErrorBoundary`.)

### Route-based code splitting

Deciding **where** to split can be tricky. You want to split bundles evenly without disrupting the user experience.

**Routes are a good place to start.** People are used to page transitions taking a moment, and the whole page usually re-renders at once, so users are unlikely to be interacting with other elements at the same time.

**React Router v6+ with `React.lazy`:**

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

**Older React Router v5 syntax** (from the original notes):

```jsx
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
);
```

(React Router's data routers also support a `lazy` property on routes, and frameworks like **Next.js** split every page automatically.)

### Named exports

`React.lazy` **only supports default exports**. If the module you want uses **named exports**, you can create an **intermediate module** that re-exports it as the default. This keeps tree shaking working, so you don't pull in unused components.

```jsx
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```jsx
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```jsx
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```

**Or map the named export inline:**

```jsx
const MyComponent = lazy(() =>
  import('./ManyComponents.js').then(module => ({ default: module.MyComponent }))
);
```

### Checking the result

-   **Network tab** in DevTools: you'll see separate chunk files (e.g. `About-3f2a.js`) downloaded when you visit the route.
-   **Bundle analyzers:** `rollup-plugin-visualizer` (Vite) or `webpack-bundle-analyzer` show what's inside each chunk.

### What to split

-   **Routes / pages**
-   **Heavy components** shown later: modals, charts, rich text editors, maps
-   **Large libraries** used in only one place (PDF export, Excel parsing, syntax highlighting)
-   **Admin-only** or rarely used features

**Don't over-split:** many tiny chunks mean many network requests and more loading spinners. Keep small, always-visible components (header, buttons) in the main bundle.

### Interview questions

```jsx
// Q1: What error happens?
const Settings = lazy(() => import('./Settings'));
function App() {
  return <Settings />;
}
// Answer: in React 18, an error — "A component suspended while responding to synchronous input…",
// because there's no <Suspense> boundary above the lazy component. Wrap it in <Suspense fallback={...}>.
```

```jsx
// Q2: Why doesn't this work?
// Chart.js
export function Chart() { /* ... */ }
// App.js
const Chart = lazy(() => import('./Chart'));
// Answer: React.lazy expects a default export. Use export default, or
// lazy(() => import('./Chart').then(m => ({ default: m.Chart }))).
```

```jsx
// Q3: Does code-splitting reduce the total size of the app?
// Answer: No. It splits the code into chunks and loads them on demand, reducing the initial load.
```

```jsx
// Q4: Two lazy components are inside one Suspense boundary. One loads in 1 s, the other in 3 s.
// When do they appear?
// Answer: both appear together after 3 s — the fallback stays until everything inside the boundary
// is ready. Use separate Suspense boundaries to show them independently.
```
