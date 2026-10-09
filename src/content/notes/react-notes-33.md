---
title: "Performance Optimization"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-10-09"
draft: false
order: 31
imp: true
description: "React — how to optimize a React app: reducing re-renders, expensive work, keeping input responsive, rendering long lists with pagination, infinite scroll and virtualization, and shipping less JavaScript."
---
### Measure first

**Never optimize by guessing.** Most components are fast enough, and every optimization adds code that someone has to maintain. Find the slow part, fix that part, and measure again.

| Tool | What it tells you |
|---|---|
| **React DevTools Profiler** | Which components rendered, why, and how long each took |
| **Highlight updates** (React DevTools) | A flash on every component that re-renders |
| **Browser Performance panel** | Where the time goes overall: scripting, layout, paint, long tasks |
| **Lighthouse** | Page load metrics and a list of suggestions |
| **Bundle analyzer** | Which packages make your JavaScript large |

How to use the Profiler is covered step by step in [Debugging React](/react/30-debugging-react/).

> [!NOTE]
> Measure a **production build** for timings. The development build is much slower, and Strict Mode renders every component twice.

### Where the time goes

A slow React app has one or more of these four problems. Each has its own fixes.

| Problem | What the user feels | Fixes |
|---|---|---|
| **Too many re-renders** | Typing or clicking lags | Move state down, `children`, `memo`, stable props, split context |
| **Expensive renders** | One interaction freezes the page | `useMemo`, transitions, debouncing, web workers |
| **Too many DOM nodes** | A long list scrolls or loads slowly | Pagination, infinite scroll, **virtualization** |
| **Too much JavaScript and data** | The first load is slow | Code splitting, smaller dependencies, image optimization, caching |

### What a re-render is

A **render** is React **calling your component function** to find out what the UI should look like. It is not a DOM update. After rendering, React compares the result with the previous one and changes only the DOM nodes that differ.

A component re-renders when:

1.  Its **state** changes.
2.  Its **parent re-renders** (even if the props it receives are the same).
3.  A **context** it reads gets a new value.

Rule 2 is the important one. **A re-render flows down the whole subtree** below the component whose state changed. One state update near the top of the tree can call hundreds of component functions.

Most re-renders are cheap and harmless. They become a problem when the subtree is large, or when one of the components does expensive work.

### Reducing re-renders

Start with the two fixes that need no memoization at all. They change the **structure** so that less of the tree sits below the changing state.

#### Move state down

```jsx
// ❌ Typing re-renders ExpensiveChart, because `query` lives in Dashboard
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ExpensiveChart />
    </>
  );
}
```

```jsx
// ✅ `query` lives in SearchBox. Typing re-renders only SearchBox.
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function Dashboard() {
  return (
    <>
      <SearchBox />
      <ExpensiveChart />
    </>
  );
}
```

**Keep state as close as possible to where it is used.**

#### Pass content as children

Sometimes the state has to wrap the expensive part, so it cannot move down.

```jsx
// ❌ Every scroll event re-renders ExpensiveChart
function ScrollTracker() {
  const [y, setY] = useState(0);
  return (
    <div onScroll={(e) => setY(e.currentTarget.scrollTop)}>
      <p>Scrolled {y}px</p>
      <ExpensiveChart />
    </div>
  );
}
```

```jsx
// ✅ ExpensiveChart is created by App, not by ScrollTracker
function ScrollTracker({ children }) {
  const [y, setY] = useState(0);
  return (
    <div onScroll={(e) => setY(e.currentTarget.scrollTop)}>
      <p>Scrolled {y}px</p>
      {children}
    </div>
  );
}

function App() {
  return (
    <ScrollTracker>
      <ExpensiveChart />
    </ScrollTracker>
  );
}
```

When `ScrollTracker` re-renders, its `children` prop is **the same element object** as last time, because `App` did not re-render. React sees the same element and skips that subtree.

#### Memoize: memo, useMemo, useCallback

When the structure cannot change, tell React to skip the work.

| API | What it caches | Skips |
|---|---|---|
| `React.memo(Component)` | The component's rendered output | Re-rendering when props are shallowly equal |
| `useMemo(fn, deps)` | The **result** of a calculation | Recalculating when deps are unchanged |
| `useCallback(fn, deps)` | The **function itself** | Creating a new function identity |

```jsx
const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  // Without useCallback this is a new function every render, and memo(Row) never skips
  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <ul>
      {items.map((item) => (
        <Row key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

`memo` compares props with a **shallow** check. An object, array or function created during render is a new reference every time, so it defeats `memo`. That is why `memo` on a child usually needs `useMemo` or `useCallback` in the parent.

Details and pitfalls are in [Pure Component and React.memo](/react/18-pure-component-and-react-memo/) and [React Hooks](/react/11-react-hooks/).

> [!TIP]
> The **React Compiler** adds this memoization automatically at build time. In a project that uses it, most hand-written `useMemo`, `useCallback` and `memo` calls are unnecessary. See [React 19](/react/29-react-19/).

#### Keep context values stable

Every component that reads a context re-renders when the context **value** changes. A new object on every render means every consumer re-renders every time.

```jsx
// ❌ A new object every render: every consumer re-renders
<AuthContext.Provider value={{ user, login, logout }}>
```

```jsx
// ✅ Same object until `user` changes
const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
<AuthContext.Provider value={value}>
```

If one part of a context changes often and another rarely, **split it into two contexts** (for example one for the state, one for the functions that update it). Components that only need the functions stop re-rendering when the state changes. See [Context](/react/13-context/).

#### Use stable keys

A key tells React which list item is which between renders.

-   `key={Math.random()}` gives every item a new key on every render, so React **destroys and recreates every row**, and loses its state and focus.
-   `key={index}` breaks when items are inserted, removed or reordered, because rows shift onto each other's keys.

Use a stable ID from the data. See [Lists and Keys](/react/07-lists-and-keys/).

### Expensive calculations

If a render is slow because of a calculation, cache the calculation.

```jsx
function ProductList({ products, filter }) {
  // Runs only when products or filter change, not on every render
  const visible = useMemo(
    () => products.filter((p) => p.category === filter).sort(byPrice),
    [products, filter]
  );
  return visible.map((p) => <Product key={p.id} product={p} />);
}
```

For expensive **initial state**, pass a function. React calls it once, on mount.

```jsx
const [rows, setRows] = useState(buildRows());        // ❌ buildRows runs on every render
const [rows, setRows] = useState(() => buildRows());  // ✅ runs only on the first render
```

Do not wrap every calculation in `useMemo`. Filtering a few hundred items takes well under a millisecond. Use it when the Profiler shows the render is slow, or when the result is passed to a memoized child.

For work that takes hundreds of milliseconds even once (parsing a large file, heavy maths), move it off the main thread with a **Web Worker**.

### Keeping input responsive

A common case: typing in a search box filters a large list, and the typing lags because every keystroke re-renders the list.

| Technique | What it does | Use it for |
|---|---|---|
| **Debounce** | Waits until the user stops typing for N ms, then runs once | Reducing **network requests** |
| **Throttle** | Runs at most once every N ms | Scroll, resize, mouse-move handlers |
| **`useTransition`** | Marks a state update as low priority. React can interrupt it to handle typing | Slow **rendering** that you trigger with `setState` |
| **`useDeferredValue`** | Gives you a copy of a value that lags behind during urgent updates | Slow rendering driven by a value you receive (a prop, or state you do not control) |

```jsx
function Search({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // The input updates immediately. The list re-renders at lower priority.
  const results = useMemo(
    () => items.filter((i) => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultList results={results} />
    </>
  );
}
```

`ResultList` should be wrapped in `memo`, so it re-renders only when `results` changes and not on the urgent render for each keystroke.

Transitions make slow rendering **interruptible**. They do not make it faster, and they do not reduce network calls. For an API call per keystroke, debounce. See [Debounce](/machine-coding/debounce/) and [React 18 updates](/react/28-react-18-updates/).

---

### Rendering long lists

**The interview question:** "How would you render a list of 10,000 items?"

#### Why a long list is slow

```jsx
// ❌ 10,000 rows: 10,000 component calls and 10,000+ DOM nodes
<ul>
  {items.map((item) => (
    <Row key={item.id} item={item} />
  ))}
</ul>
```

Three costs add up:

1.  **Render:** React calls `Row` 10,000 times and builds 10,000 elements.
2.  **DOM:** the browser creates, styles, lays out and paints every node, including the 9,980 that are off screen. This is usually the largest cost.
3.  **Memory and updates:** every later re-render of the list repeats step 1, and the large DOM makes every layout slower.

The user can see about 20 rows at a time. The fix is always some form of **render fewer rows**.

#### The three options

| | Pagination | Infinite scroll | Virtualization (windowing) |
|---|---|---|---|
| **Idea** | Show one page of N rows | Append the next page when the user nears the bottom | Render only the rows inside the visible window |
| **DOM size** | Small and constant | **Grows** as the user scrolls | Small and constant |
| **Data loaded** | One page at a time | One page at a time | All in memory, or loaded in pages |
| **Good for** | Tables, search results, admin screens, anything users jump around in | Feeds and timelines | Very large lists and grids, chat history, logs, dropdowns with thousands of options |
| **Weakness** | Extra clicks | Hard to reach the footer or return to a position. DOM still gets large | More complex. Browser find (`Ctrl+F`) misses unrendered rows |

They combine well. A feed is often **infinite scroll for the data** plus **virtualization for the DOM**: fetch 50 rows at a time, but only render the 20 on screen.

If the data comes from a server, the first answer is **do not send 10,000 rows**. Paginate, filter and sort on the server. Virtualization is for when the client really does hold a large list.

Infinite scroll is built step by step in [Infinite Scroll](/machine-coding/infinite-scroll/).

#### How virtualization works

The trick has three parts:

1.  A **scroll container** with a fixed height and `overflow: auto`.
2.  Inside it, a **spacer** as tall as the whole list would be (`rowCount × rowHeight`). This gives the scrollbar the correct size.
3.  Only the **visible rows** are rendered, positioned at the offset where they belong.

```
scroll container (400px tall)
┌──────────────────────────┐
│                          │  ← rows 0 to 94: not rendered, only empty space
│  row 95  ┐               │
│  ...     │ overscan      │
│  row 100 ┘ ┐             │
│  ...       │ visible     │  ← about 22 rows exist in the DOM
│  row 111   ┘ ┐           │
│  ...         │ overscan  │
│  row 116     ┘           │
│                          │  ← rows 117 to 9,999: not rendered
└──────────────────────────┘
spacer height = 10,000 × 36px = 360,000px
```

With a fixed row height, the visible range is simple arithmetic:

```
firstVisible = floor(scrollTop / rowHeight)
visibleCount = ceil(viewportHeight / rowHeight)
```

**Overscan** means rendering a few extra rows above and below the window, so a fast scroll does not show a blank gap before React catches up.

#### A virtual list from scratch

Interviewers often ask you to build this without a library. With a fixed row height it is about 30 lines.

```jsx
import { useState } from 'react';

const ROW_HEIGHT = 36;
const VIEWPORT_HEIGHT = 400;
const OVERSCAN = 5;

function VirtualList({ items }) {
  const [scrollTop, setScrollTop] = useState(0);

  const firstVisible = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);

  const start = Math.max(0, firstVisible - OVERSCAN);
  const end = Math.min(items.length, firstVisible + visibleCount + OVERSCAN);
  const visibleItems = items.slice(start, end);

  return (
    <div
      style={{ height: VIEWPORT_HEIGHT, overflowY: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Spacer: as tall as the full list, so the scrollbar is correct */}
      <div style={{ height: items.length * ROW_HEIGHT, position: 'relative' }}>
        {/* The rendered window, moved down to where its first row belongs */}
        <ul
          style={{
            position: 'absolute',
            top: start * ROW_HEIGHT,
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {visibleItems.map((item) => (
            <li key={item.id} style={{ height: ROW_HEIGHT }}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Usage
const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

export default function App() {
  return <VirtualList items={items} />;
}
```

Walk through it with `scrollTop = 3600`:

```
firstVisible = floor(3600 / 36) = 100
visibleCount = ceil(400 / 36)   = 12
start        = 100 - 5          = 95
end          = 100 + 12 + 5     = 117
```

React renders rows 95 to 116. That is **22 `<li>` elements in place of 10,000**, and the number stays the same wherever the user scrolls.

Open the Elements panel and scroll: the `<li>` nodes are replaced as you go, and the count never grows.

What this simple version leaves out:

-   **Variable row heights.** The arithmetic above needs every row to be the same height. With varying heights you must measure rows and keep a running total of offsets.
-   **Scroll to a row**, sticky headers, horizontal lists, grids.
-   **Resizing** of the container.

That is why production code uses a library.

#### Using a library

The two common choices are **`@tanstack/react-virtual`** (a hook, you write the markup) and **`react-window`** (ready-made list and grid components). The idea is the same as the hand-written version.

```bash
npm install @tanstack/react-virtual
```

```jsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,   // row height in px (an estimate, if rows are measured)
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflowY: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: row.size,
              transform: `translateY(${row.start}px)`,
            }}
          >
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

The same three parts are there: the scroll container (`parentRef`), the spacer (`getTotalSize()`), and the visible rows (`getVirtualItems()`), each placed at its own offset (`row.start`).

For **rows of different heights**, let the library measure each row after it renders:

```jsx
<div
  key={row.key}
  data-index={row.index}
  ref={virtualizer.measureElement}
  style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${row.start}px)` }}
>
  {items[row.index].text}
</div>
```

Here `estimateSize` is only a first guess, used until the real height is known.

#### Trade-offs of virtualization

Mention these in an interview. They show you have used it, not only read about it.

-   **Browser find (`Ctrl+F`)** only searches rows that exist in the DOM. Provide your own search box.
-   **Accessibility:** a screen reader sees only the rendered rows. Add `aria-rowcount` and `aria-rowindex` (or `aria-setsize` and `aria-posinset`) so it knows the real size and position.
-   **Row state is lost** when a row scrolls out, because the component unmounts. Keep state such as "expanded" or "checked" in the parent, keyed by item ID.
-   **Fast scrolling** can show blank space briefly. Increase overscan, and keep rows cheap to render.
-   **Do not use it for short lists.** Under a few hundred simple rows, plain rendering is fine, and simpler.

#### Other list techniques

-   **Memoize the row** with `memo`, and pass stable props, so that updating one row does not re-render the others.
-   **Keep rows light.** A row with 30 DOM nodes costs 30 times as much as a row with one. Render heavy parts (menus, tooltips) only when they open.
-   **`content-visibility: auto`** is a CSS property that lets the browser skip layout and paint for off-screen elements. The DOM nodes still exist, so it helps less than virtualization, but it is one line of CSS:

    ```css
    .row {
      content-visibility: auto;
      contain-intrinsic-size: auto 36px;   /* placeholder height while not rendered */
    }
    ```

-   **Lazy-load images** in rows with `loading="lazy"`.

---

### Shipping less JavaScript

The fastest code is code the browser never downloads.

-   **Code splitting:** load each route, and heavy components such as charts and editors, only when needed, with `React.lazy` and `Suspense`. See [Code-Splitting](/react/20-code-splitting/).

    ```jsx
    const Reports = lazy(() => import('./pages/Reports'));
    ```

-   **Analyze the bundle** to see what is in it (for example `rollup-plugin-visualizer` for Vite, `webpack-bundle-analyzer` for webpack). One careless import is often the largest item.
-   **Import only what you use,** so the bundler can drop the rest (tree shaking):

    ```jsx
    import _ from 'lodash';              // ❌ the whole library
    import debounce from 'lodash/debounce'; // ✅ one function
    ```

-   **Replace heavy dependencies** with lighter ones or with platform features (`Intl.DateTimeFormat` for dates, for example).
-   **Server rendering** (Next.js, React Router framework mode) sends HTML first, so the user sees content before the JavaScript loads. Server Components go further and keep some components out of the client bundle.

### Images and assets

Images are often the largest part of a page.

```jsx
<img
  src="/photo-800.webp"
  srcSet="/photo-400.webp 400w, /photo-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  width="800"
  height="450"
  loading="lazy"
  alt="Team photo"
/>
```

-   Serve **modern formats** (WebP, AVIF) at the **size they are displayed**.
-   **`loading="lazy"`** for images below the fold. Do **not** lazy-load the main image at the top of the page.
-   Always set **`width` and `height`**, so the page does not jump when the image arrives.
-   Serve static files from a **CDN** with long cache lifetimes.

### Data fetching

-   **Cache and deduplicate** requests with a data library (TanStack Query, SWR, RTK Query). Two components asking for the same data should cause one request.
-   **Avoid waterfalls.** Start independent requests together (`Promise.all`), not one after another.
-   **Cancel or ignore stale requests** so an old response cannot overwrite a newer one.
-   **Paginate on the server.** Do not fetch what you will not show.

See [React and HTTP](/react/19-react-and-http/).

### Core Web Vitals

These are the metrics Google uses for page experience. Interviewers expect you to know the names.

| Metric | Measures | Improve it by |
|---|---|---|
| **LCP** (Largest Contentful Paint) | How fast the main content appears | Smaller bundles, server rendering, optimized main image |
| **INP** (Interaction to Next Paint) | How fast the page responds to clicks and typing | Fewer and cheaper re-renders, transitions, virtualization |
| **CLS** (Cumulative Layout Shift) | How much the layout jumps while loading | Fixed image dimensions, reserved space for late content |

### Common mistakes

-   **Memoizing everything.** `useMemo` and `useCallback` cost memory and a comparison on every render. They only pay off when they let something expensive be skipped.
-   **`memo` with unstable props.** `memo(Row)` does nothing if the parent passes `style={{...}}` or `onClick={() => ...}` inline.
-   **Defining a component inside another component.** It is a new component type on every render, so React unmounts and remounts it each time, losing state and focus.

    ```jsx
    function Parent() {
      const Child = () => <input />;   // ❌ new type every render
      return <Child />;
    }
    ```

-   **Copying props into state** and syncing with an effect. It causes an extra render every time. Calculate the value during render.
-   **Optimizing in development mode** and trusting the timings.

### Checklist

1.  **Measure** with the Profiler and find the slow interaction.
2.  **Fix the structure:** move state down, pass content as `children`.
3.  **Memoize** what is still slow: `memo`, `useMemo`, `useCallback`, stable context values.
4.  **Long lists:** paginate on the server, virtualize on the client.
5.  **Responsive input:** debounce requests, use transitions for slow rendering.
6.  **Load less:** code split, trim dependencies, optimize images.
7.  **Measure again** on a production build.

### Interview questions

```jsx
// Q1: How do you optimize a React application?
// Answer: Measure first with the Profiler. Then reduce re-renders (move state down, pass
// children, memo/useMemo/useCallback, stable context values and keys), cache expensive
// calculations, virtualize long lists, keep input responsive with debouncing or transitions,
// and reduce load time with code splitting, smaller bundles and optimized images.
```

```jsx
// Q2: How would you render a list of 10,000 items?
// Answer: Do not render them all. If the data is on a server, paginate or use infinite
// scroll. If the client holds the full list, virtualize it: render only the rows in the
// visible window (plus a small overscan) inside a spacer that is as tall as the whole list.
// Use @tanstack/react-virtual or react-window. Also give rows stable keys and memoize them.
```

```jsx
// Q3: What is the difference between infinite scroll and virtualization?
// Answer: Infinite scroll controls how much DATA is loaded: it fetches the next page when the
// user nears the bottom, but every loaded row stays in the DOM. Virtualization controls how
// much DOM exists: only visible rows are rendered. They are often used together.
```

```jsx
// Q4: Does this memo work?
const Row = memo(function Row({ item, style, onSelect }) { /* ... */ });

<Row item={item} style={{ padding: 8 }} onSelect={() => select(item.id)} />
// Answer: No. `style` and `onSelect` are new references on every render, so the shallow
// comparison always fails. Hoist the style object out of the component and wrap the handler
// in useCallback.
```

```jsx
// Q5: A parent re-renders. The child's props did not change. Does the child re-render?
// Answer: Yes, by default. A re-render flows down the whole subtree. Wrap the child in memo
// to skip it when its props are shallowly equal, or pass it as `children` from higher up.
```

```jsx
// Q6: When should you NOT use useMemo?
// Answer: For cheap calculations, and for values that change on every render anyway.
// It adds memory and a dependency comparison, and makes the code harder to read.
// Use it for measurably slow calculations, or to keep a reference stable for a memoized child.
```

```jsx
// Q7: The search input lags while a large list filters. What do you do?
// Answer: Keep the input state urgent and make the list update low priority with
// useDeferredValue or useTransition, and memoize the list. If each keystroke also calls an
// API, debounce the request. If the list itself is huge, virtualize it.
```
