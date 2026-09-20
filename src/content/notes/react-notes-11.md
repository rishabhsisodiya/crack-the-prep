---
title: "Component Lifecycle Methods"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 10
description: "React — class component lifecycle (mounting, updating, unmounting, error handling), call order with children, error boundaries, and hook equivalents."
---
Lifecycle methods belong to **class components**. Function components use **hooks** (`useEffect`, `useLayoutEffect`) for the same jobs — see the mapping table at the end.

A class component goes through four phases:

-   **Mounting:** an instance of the component is being created and inserted into the DOM. Methods: **`constructor`, `static getDerivedStateFromProps`, `render`, `componentDidMount`**.
-   **Updating:** the component re-renders because its props or state changed. Methods: **`static getDerivedStateFromProps`, `shouldComponentUpdate`, `render`, `getSnapshotBeforeUpdate`, `componentDidUpdate`**.
-   **Unmounting:** the component is being removed from the DOM. Method: **`componentWillUnmount`**.
-   **Error handling:** there's an error during rendering, in a lifecycle method, or in the constructor of any **child** component. Methods: **`static getDerivedStateFromError`, `componentDidCatch`**.

React work happens in two phases:

-   **Render phase** (`constructor`, `getDerivedStateFromProps`, `shouldComponentUpdate`, `render`) — must be **pure**, no side effects. React may call these more than once (e.g. in Strict Mode or with concurrent rendering).
-   **Commit phase** (`getSnapshotBeforeUpdate`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) — the DOM is updated; **side effects are allowed** here.

### Mounting lifecycle methods

#### constructor(props)

A special function that is **called when a new component instance is created**. Use it for **initializing state and binding event handlers**. **Don't cause side effects** here (e.g. HTTP requests or subscriptions).

**Call `super(props)` as the first line**, and assign `this.state` directly (don't call `setState` in the constructor).

```jsx
constructor(props) {
  super(props);                       // otherwise this.props is undefined in the constructor
  this.state = { count: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

(With class fields — `state = { count: 0 }` and arrow-function methods — you often don't need a constructor at all.)

#### static getDerivedStateFromProps(props, state)

Called **right before `render`**, on the initial mount **and on every update**. Use it in the rare case where **state depends on changes in props over time**. It's `static`, so it **has no access to `this`** — you can't call `this.setState`. Instead, **return an object** to update state, or **`null`** for no change. **No side effects.**

```jsx
static getDerivedStateFromProps(props, state) {
  if (props.initialValue !== state.prevInitialValue) {
    return {
      value: props.initialValue,          // reset value when the prop changes
      prevInitialValue: props.initialValue
    };
  }
  return null; // no state update needed
}
```

**You probably don't need it.** Usually you can compute the value during render, make the component fully controlled, or reset it with a `key`.

#### render()

The **only required method**. It **reads props and state and returns JSX** (or `null`, strings, numbers, arrays, fragments, portals). **Don't change state, touch the DOM, or make AJAX calls** here — `render` must be pure. The child components' lifecycle methods run as part of rendering.

#### componentDidMount()

Called **immediately after the component and all its children have been rendered to the DOM**. **The right place for side effects**: fetching data, subscriptions, timers, reading DOM size, or integrating non-React libraries.

```jsx
componentDidMount() {
  fetch(`/api/users/${this.props.userId}`)
    .then(res => res.json())
    .then(user => this.setState({ user }));
}
```

(Calling `setState` here triggers an extra render before the browser paints, so the user won't see the intermediate state — but avoid it when you could set the state in the constructor.)

#### Example: mounting order

**App.js**

```jsx
import LifecycleA from "./components/Lifecycle/LifecycleA";

function App() {
  return (
    <div className="App">
      <LifecycleA />
    </div>
  );
}

export default App;
```

**components/Lifecycle/LifecycleA.js**

```jsx
import { Component } from 'react';

class LifecycleA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Rishabh"
    };
    console.log('LifecycleA constructor called');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('LifecycleA getDerivedStateFromProps called');
    return null;
  }

  componentDidMount() {
    console.log('LifecycleA componentDidMount called');
  }

  render() {
    console.log('LifecycleA render called');
    return <div>Lifecycle A</div>;
  }
}

export default LifecycleA;
```

**Output:**

```
LifecycleA constructor called
LifecycleA getDerivedStateFromProps called
LifecycleA render called
LifecycleA componentDidMount called
```

(In development with `<StrictMode>`, React intentionally calls `constructor`, `getDerivedStateFromProps` and `render` twice to help find impure code, so you may see duplicate logs. Production runs them once.)

#### What if LifecycleA has a child component LifecycleB?

**LifecycleA.js** — renders `LifecycleB`:

```jsx
import { Component } from 'react';
import LifecycleB from './LifecycleB';

class LifecycleA extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "Rishabh" };
    console.log('LifecycleA constructor called');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('LifecycleA getDerivedStateFromProps called');
    return null;
  }

  componentDidMount() {
    console.log('LifecycleA componentDidMount called');
  }

  render() {
    console.log('LifecycleA render called');
    return (
      <div>
        Lifecycle A
        <LifecycleB />
      </div>
    );
  }
}

export default LifecycleA;
```

**LifecycleB.js**

```jsx
import { Component } from 'react';

class LifecycleB extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "Rishabh" };
    console.log('LifecycleB constructor called');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('LifecycleB getDerivedStateFromProps called');
    return null;
  }

  componentDidMount() {
    console.log('LifecycleB componentDidMount called');
  }

  render() {
    console.log('LifecycleB render called');
    return <div>Lifecycle B</div>;
  }
}

export default LifecycleB;
```

**Output:**

```
LifecycleA constructor called
LifecycleA getDerivedStateFromProps called
LifecycleA render called
LifecycleB constructor called
LifecycleB getDerivedStateFromProps called
LifecycleB render called
LifecycleB componentDidMount called
LifecycleA componentDidMount called
```

**Why is `componentDidMount` child-first?** The parent's `render` runs first and creates the children. But the parent is only "mounted" once its whole subtree is in the DOM — so the **child's `componentDidMount` runs before the parent's**.

### Updating lifecycle methods

#### static getDerivedStateFromProps(props, state)

**Called on every render** (mount and update), whether the update came from new props, `setState` or `forceUpdate`. Use it only to derive state from props; **no side effects**.

#### shouldComponentUpdate(nextProps, nextState)

Decides **whether the component should re-render**. **By default it returns `true`** (always re-render). Return `false` to skip `render`, `getSnapshotBeforeUpdate` and `componentDidUpdate` for this update. It's used for **performance optimization**.

```jsx
shouldComponentUpdate(nextProps, nextState) {
  if (
    nextProps.position.x === this.props.position.x &&
    nextProps.position.y === this.props.position.y &&
    nextProps.size.width === this.props.size.width &&
    nextProps.size.height === this.props.size.height &&
    nextState.isHovered === this.state.isHovered
  ) {
    // Nothing has changed, so a re-render is unnecessary
    return false;
  }
  return true;
}
```

Instead of writing it by hand, you can extend **`PureComponent`**, which does a shallow comparison of props and state for you. Don't use it to "block" renders for correctness — only as an optimization.

#### render()

Same as in mounting: the only required method, reads props and state and returns JSX. **No state changes, DOM access or AJAX calls.** Children re-render as part of it.

#### getSnapshotBeforeUpdate(prevProps, prevState)

Called **right after `render`, just before the changes are applied to the real DOM**. Use it to **capture information from the DOM** (like scroll position) before it changes. It **returns a value or `null`**, and that value is passed as the **third argument** to `componentDidUpdate`.

```jsx
getSnapshotBeforeUpdate(prevProps, prevState) {
  // Are we adding new items to the list?
  // Capture the scroll position so we can adjust the scroll later.
  if (prevProps.list.length < this.props.list.length) {
    const list = this.listRef.current;
    return list.scrollHeight - list.scrollTop;
  }
  return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  // If we have a snapshot value, we've just added new items.
  // Adjust scroll so these new items don't push the old ones out of view.
  if (snapshot !== null) {
    const list = this.listRef.current;
    list.scrollTop = list.scrollHeight - snapshot;
  }
}
```

In the example above, it's important to read `scrollHeight` in `getSnapshotBeforeUpdate`. It isn't safe to read it in `render` (or the legacy `UNSAFE_componentWillReceiveProps` / `UNSAFE_componentWillUpdate`), because there can be a time gap between those methods and React actually updating the DOM.

#### componentDidUpdate(prevProps, prevState, snapshot)

Called **after the re-render is committed to the DOM**. It runs **once per update** (not on the initial mount). **Side effects are allowed**, but compare the previous and current props/state first — otherwise you can create an infinite loop.

```jsx
componentDidUpdate(prevProps, prevState) {
  if (
    this.props.roomId !== prevProps.roomId ||
    this.state.serverUrl !== prevState.serverUrl
  ) {
    this.destroyConnection();
    this.setupConnection();
  }
}
```

```jsx
// ❌ Infinite loop — setState on every update without a condition
componentDidUpdate() {
  this.setState({ updated: true });
}
```

#### Example: updating order

We add the update methods and a button that changes state in `LifecycleA`.

**LifecycleA.js**

```jsx
import { Component } from 'react';
import LifecycleB from './LifecycleB';

class LifecycleA extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "Rishabh" };
    console.log('LifecycleA constructor called');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('LifecycleA getDerivedStateFromProps called');
    return null;
  }

  componentDidMount() {
    console.log('LifecycleA componentDidMount called');
  }

  shouldComponentUpdate() {
    console.log('LifecycleA shouldComponentUpdate called');
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('LifecycleA getSnapshotBeforeUpdate called');
    return null;
  }

  componentDidUpdate() {
    console.log('LifecycleA componentDidUpdate called');
  }

  changeState = () => {
    this.setState({ name: "Rishabh Sisodiya" });
  };

  render() {
    console.log('LifecycleA render called');
    return (
      <div>
        Lifecycle A
        <button onClick={this.changeState}>Change state</button>
        <LifecycleB />
      </div>
    );
  }
}

export default LifecycleA;
```

**LifecycleB.js** — same methods, logging "LifecycleB":

```jsx
import { Component } from 'react';

class LifecycleB extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "Rishabh" };
    console.log('LifecycleB constructor called');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('LifecycleB getDerivedStateFromProps called');
    return null;
  }

  componentDidMount() {
    console.log('LifecycleB componentDidMount called');
  }

  shouldComponentUpdate() {
    console.log('LifecycleB shouldComponentUpdate called');
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('LifecycleB getSnapshotBeforeUpdate called');
    return null;
  }

  componentDidUpdate() {
    console.log('LifecycleB componentDidUpdate called');
  }

  render() {
    console.log('LifecycleB render called');
    return <div>Lifecycle B</div>;
  }
}

export default LifecycleB;
```

**Output:**

```
LifecycleA constructor called
LifecycleA getDerivedStateFromProps called
LifecycleA render called
LifecycleB constructor called
LifecycleB getDerivedStateFromProps called
LifecycleB render called
LifecycleB componentDidMount called
LifecycleA componentDidMount called

// After clicking the "Change state" button — updating phase
LifecycleA getDerivedStateFromProps called
LifecycleA shouldComponentUpdate called
LifecycleA render called
LifecycleB getDerivedStateFromProps called
LifecycleB shouldComponentUpdate called
LifecycleB render called
LifecycleB getSnapshotBeforeUpdate called
LifecycleA getSnapshotBeforeUpdate called
LifecycleB componentDidUpdate called
LifecycleA componentDidUpdate called
```

**Why does `LifecycleB` re-render when only A's state changed?** When a parent re-renders, its children re-render by default — even if their props didn't change. `PureComponent`, `shouldComponentUpdate` or `React.memo` can skip that.

**Why is the order parent-first for render, but child-first for snapshot and didUpdate?** Rendering goes top-down (the parent's render produces the children). The commit phase then processes the tree **children before parents**.

### Unmounting lifecycle method

#### componentWillUnmount()

Called **immediately before a component is unmounted and destroyed**. Use it for cleanup: **cancel network requests, remove event listeners, cancel subscriptions and clear timers**. **Don't call `setState`** here — the component will never re-render. It should not return anything.

```jsx
componentDidMount() {
  this.timerID = setInterval(() => this.tick(), 1000);
  window.addEventListener('resize', this.handleResize);
}

componentWillUnmount() {
  clearInterval(this.timerID);
  window.removeEventListener('resize', this.handleResize);
  this.destroyConnection();
}
```

Without this cleanup, timers and listeners keep running after the component is gone (memory leaks, and warnings in older React about updating an unmounted component).

### Error handling lifecycle methods

#### static getDerivedStateFromError(error) and componentDidCatch(error, info)

These are called when an error is thrown **during rendering, in a lifecycle method, or in the constructor of any child component**.

-   **`static getDerivedStateFromError(error)`** — runs during the render phase; **return new state** to show a **fallback UI**. No side effects.
-   **`componentDidCatch(error, info)`** — runs during the commit phase; used to **log the error** (e.g. to Sentry). `info.componentStack` shows which components the error came from.

#### Error boundary

**A class component that implements `getDerivedStateFromError` and/or `componentDidCatch` becomes an error boundary.** It catches errors in the components **below** it and shows a fallback instead of crashing the whole app.

(In React 16+, an uncaught rendering error **unmounts the whole React tree** — a blank page. Error boundaries prevent that.)

**App.js**

```jsx
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Hero from "./components/ErrorBoundary/Hero";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Hero heroName="Superman" />
      </ErrorBoundary>
      <ErrorBoundary>
        <Hero heroName="Batman" />
      </ErrorBoundary>
      <ErrorBoundary>
        <Hero heroName="Joker" />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

**Hero.js**

```jsx
const Hero = ({ heroName }) => {
  if (heroName === 'Joker') {
    throw new Error('not a hero');
  }
  return <div>{heroName}</div>;
};

export default Hero;
```

**ErrorBoundary.js**

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    console.log(error);                // Error: not a hero
    console.log(info.componentStack);  // where the error happened
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Output on screen:**

```
Superman
Batman
Something went wrong
```

Because each `Hero` has its **own** boundary, only the Joker section shows the fallback. If a single `ErrorBoundary` wrapped all three, the **whole group** would be replaced by "Something went wrong".

(In development, React also shows an error overlay on top of the page; close it to see the fallback. Production shows only the fallback.)

**Error boundaries do NOT catch errors in:**

-   **Event handlers** (use `try...catch` inside the handler),
-   **Asynchronous code** (`setTimeout`, promises, `fetch` callbacks),
-   **Server-side rendering**,
-   errors thrown **in the error boundary itself** (only in its children).

```jsx
function SaveButton() {
  const [error, setError] = useState(null);

  async function handleClick() {
    try {
      await save();
    } catch (e) {
      setError(e);           // handle event/async errors yourself
    }
  }

  if (error) throw error;    // optional: re-throw during render so the nearest boundary catches it
  return <button onClick={handleClick}>Save</button>;
}
```

**There is no hook for error boundaries** — they still require a class component. Many apps use the **`react-error-boundary`** package, which provides a ready-made `<ErrorBoundary FallbackComponent={...}>` and a `resetErrorBoundary` function.

### Legacy methods (deprecated)

The lifecycle methods below are **legacy**. They still work (with the `UNSAFE_` prefix), but don't use them in new code — they're unsafe with async/concurrent rendering because they can run multiple times before a commit.

**`UNSAFE_componentWillMount()`** is called just **before mounting**, before `render()`. Calling `setState()` here doesn't cause an extra render. Use the **constructor** for initializing state instead, and **`componentDidMount()`** for side effects and subscriptions. It was the only lifecycle method called during server rendering.

**`UNSAFE_componentWillReceiveProps(nextProps)`** is called before a mounted component receives new props. People used it to update state when props changed (e.g. to reset it) by comparing `this.props` with `nextProps`. Note that if the parent re-renders, this method is called **even if the props haven't changed**, so you must compare values yourself. **Use `getDerivedStateFromProps`** (or better, a `key` or derived values) instead.

**`UNSAFE_componentWillUpdate(nextProps, nextState)`** is called just before rendering when new props or state are received (not on the initial render). You can't call `this.setState()` here, or do anything else that triggers an update. It can usually be **replaced by `componentDidUpdate()`**. If you read from the DOM here (e.g. to save a scroll position), move that logic to **`getSnapshotBeforeUpdate()`**.

| Legacy method | Use instead |
| --- | --- |
| `UNSAFE_componentWillMount` | `constructor` (state) / `componentDidMount` (side effects) |
| `UNSAFE_componentWillReceiveProps` | `getDerivedStateFromProps`, a `key`, or compute during render |
| `UNSAFE_componentWillUpdate` | `componentDidUpdate` / `getSnapshotBeforeUpdate` |

### Lifecycle methods vs hooks

| Class component | Function component (hooks) |
| --- | --- |
| `constructor` (initialize state) | `useState(initialValue)` / `useState(() => expensiveInit())` |
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` (when X changes) | `useEffect(() => { ... }, [x])` |
| `componentWillUnmount` | cleanup function: `useEffect(() => { return () => { ... }; }, [])` |
| `shouldComponentUpdate` / `PureComponent` | `React.memo(Component)` |
| `getSnapshotBeforeUpdate` + DOM measurement | `useLayoutEffect` |
| `getDerivedStateFromProps` | update state during render, or compute the value directly |
| `getDerivedStateFromError` / `componentDidCatch` | no hook — still a class (or `react-error-boundary`) |

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);  // didMount + didUpdate(roomId)
    connection.connect();
    return () => connection.disconnect();         // willUnmount + before the next roomId
  }, [roomId]);

  return <h1>Welcome to {roomId}</h1>;
}
```

### Interview questions

```jsx
// Q1: Parent renders Child. What is the order of these logs on mount?
// Parent: constructor, render, componentDidMount
// Child:  constructor, render, componentDidMount
// Answer:
// Parent constructor → Parent render → Child constructor → Child render
// → Child componentDidMount → Parent componentDidMount
```

```jsx
// Q2: What is wrong?
componentDidUpdate(prevProps) {
  fetch(`/api/user/${this.props.id}`).then(r => r.json()).then(user => this.setState({ user }));
}
// Answer: it fetches after EVERY update, and setState causes another update → infinite loop.
// Wrap it: if (this.props.id !== prevProps.id) { ... }
```

```jsx
// Q3: Does an error boundary catch this?
function Button() {
  return <button onClick={() => { throw new Error('boom'); }}>Click</button>;
}
// Answer: No — errors in event handlers aren't caught by error boundaries. Use try...catch.
```

```jsx
// Q4: shouldComponentUpdate returns false. Are the children re-rendered?
// Answer: No — render isn't called, so the children aren't rendered again by this update.
// (A child can still re-render from its own state change or context.)
```

```jsx
// Q5: Why might componentDidMount's log appear twice in development?
// Answer: In React 18+ Strict Mode, React mounts, unmounts and remounts components in
// development to check that effects/cleanup are written correctly.
```
