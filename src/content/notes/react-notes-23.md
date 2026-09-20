---
title: "Strict Mode"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 23
description: "React — what StrictMode checks, why components and effects run twice in development, and how to fix the bugs it reveals."
---
### What is StrictMode?

**`StrictMode` is a tool for highlighting potential problems in an application.** Like `Fragment`, it **doesn't render any visible UI**. It activates **additional checks and warnings** for its descendants.

**Note:** Strict Mode checks run **in development only**. They don't affect the production build.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

You can also wrap only part of the app:

```jsx
function App() {
  return (
    <>
      <Header />                   {/* not checked */}
      <StrictMode>
        <Dashboard />              {/* checked */}
      </StrictMode>
    </>
  );
}
```

Vite and Next.js templates enable Strict Mode by default.

### What StrictMode checks

1.  **Identifying components with unsafe lifecycles** — warns about `componentWillMount`, `componentWillReceiveProps` and `componentWillUpdate`.
2.  **Warning about legacy string ref API usage** — `ref="myInput"` (removed in React 19).
3.  **Warning about deprecated `findDOMNode` usage** (removed in React 19).
4.  **Detecting unexpected side effects** — by **rendering components twice** (see below).
5.  **Detecting the legacy context API** (`childContextTypes`, `getChildContext`).
6.  **Ensuring reusable state (React 18+)** — by **mounting, unmounting and re-mounting** every component once, to check that effects clean up properly.

### 1. Double rendering: detecting impure components

React expects rendering to be **pure**: the same props and state should always produce the same output, with no side effects. To catch impure code, Strict Mode **calls these functions twice** in development:

-   function component bodies
-   `useState`, `useMemo` and `useReducer` initializer/updater functions
-   class `constructor`, `render`, `shouldComponentUpdate`, `getDerivedStateFromProps`
-   `setState` updater functions

**Example of a bug it reveals:**

```jsx
const guests = [];          // module-level variable

function Guest({ name }) {
  guests.push(name);        // ❌ side effect during render
  return <li>{name} (guest #{guests.length})</li>;
}

// In Strict Mode, each Guest renders twice, so guest numbers skip: #2, #4, #6…
// Without Strict Mode it looks correct, but it would still break with concurrent rendering.
```

**Fix:** don't mutate anything outside the component during render. Compute from props, or store data in state.

**Console logs:** React DevTools shows the second render's logs dimmed (in older React 17 they were hidden completely), which is why you might see a `console.log` in a component **twice**.

### 2. Double effects: detecting missing cleanup (React 18+)

In development, Strict Mode **mounts each component, immediately unmounts it, and mounts it again**. So effects run: **setup → cleanup → setup**.

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log('✅ Connecting to', roomId);
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      console.log('❌ Disconnecting from', roomId);
      connection.disconnect();
    };
  }, [roomId]);

  return <h1>Welcome to {roomId}</h1>;
}
```

**Development console:**

```
✅ Connecting to general
❌ Disconnecting from general
✅ Connecting to general
```

**Production:** only one `✅ Connecting to general`.

**Why?** React may unmount and restore components in the future (for example, when switching tabs or with Activity/Offscreen features). If your effect has **no cleanup**, you'd get **two connections** here — Strict Mode makes that bug visible immediately.

**Common questions:**

-   **"My API call runs twice in development!"** — that's Strict Mode. Don't remove it; make the effect safe:

    ```jsx
    useEffect(() => {
      let ignore = false;
      fetch(`/api/todos`)
        .then(r => r.json())
        .then(data => { if (!ignore) setTodos(data); });
      return () => { ignore = true; };   // the first request's result is ignored
    }, []);
    ```

    (Or use a data-fetching library that deduplicates requests.)

-   **Analytics or "run once" logic:** two events in development are fine — production sends one. For truly app-wide one-time setup, run it **outside** components (at module level), or guard with a module variable.

-   **Refs:** Strict Mode also runs ref callbacks twice (React 19), to check they clean up.

### 3. Warnings about deprecated APIs

```jsx
class OldComponent extends React.Component {
  componentWillMount() {}                // ⚠️ unsafe lifecycle warning
  render() {
    return <input ref="myInput" />;      // ⚠️ string refs warning (error in React 19)
  }
}
```

### StrictMode vs JavaScript "use strict"

They're unrelated: JavaScript's `"use strict"` changes how the **language** behaves (e.g. no accidental globals). React's `<StrictMode>` adds **React development checks**.

### Interview questions

```jsx
// Q1: Why is "render" logged twice?
function App() {
  console.log('render');
  return <h1>Hi</h1>;
}
// Answer: In development with <StrictMode>, React renders components twice to detect impure
// rendering. Production logs it once.
```

```jsx
// Q2: This effect shows two alerts in development. Is it a bug in React?
useEffect(() => {
  alert('mounted');
}, []);
// Answer: No. Strict Mode (React 18+) mounts, unmounts and re-mounts components in development
// to check effects clean up. It runs once in production.
```

```jsx
// Q3: Does StrictMode slow down the production app?
// Answer: No. Its checks only run in development builds.
```

```jsx
// Q4: A counter increments by 2 in development. Why?
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(c => c + 1);
  }, []);
  return <p>{count}</p>;
}
// Answer: the effect runs twice in Strict Mode (mount → unmount → mount), so it adds 1 twice.
// It shows 1 in production. Usually this means the logic shouldn't be in an effect.
```
