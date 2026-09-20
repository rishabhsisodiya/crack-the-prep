---
title: "Pure Component and React.memo"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 18
description: "React — PureComponent, React.memo, shallow comparison, custom comparison functions, and why memoization breaks with new objects and functions."
---
### Why components re-render

By default, **when a parent re-renders, all of its children re-render too** — even if their props didn't change. Usually that's fine, because rendering is fast and React only updates the DOM where something actually changed. But for **expensive** components, you can skip unnecessary renders with:

-   **`React.PureComponent`** — for class components
-   **`React.memo`** — for function components

Both do a **shallow comparison** of props (PureComponent also compares state) and skip rendering when nothing changed.

### Pure Component

`React.PureComponent` is similar to `React.Component`. The difference is that `React.Component` doesn't implement `shouldComponentUpdate()` (it always re-renders), but **`React.PureComponent` implements `shouldComponentUpdate()` with a shallow comparison of props and state.**

If your component's `render()` returns the same result for the same props and state, you can use `React.PureComponent` for a performance boost in some cases.

**App.js**

```jsx
import ParentComp from "./components/PureComps/ParentComp";

function App() {
  return (
    <div className="App">
      <ParentComp />
    </div>
  );
}

export default App;
```

**ParentComp.js** — sets the **same** name every 2 seconds:

```jsx
import { Component } from 'react';
import PureComp from './PureComp';
import RegComp from './RegComp';

class ParentComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Rishabh"
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ name: "Rishabh" });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log("**********Parent Component*********");
    return (
      <div>
        Parent Component
        <RegComp name={this.state.name} />
        <PureComp name={this.state.name} />
      </div>
    );
  }
}

export default ParentComp;
```

**RegComp.js**

```jsx
import { Component } from 'react';

class RegComp extends Component {
  render() {
    console.log("Regular Component");
    return <div>Regular component {this.props.name}</div>;
  }
}

export default RegComp;
```

**PureComp.js**

```jsx
import { PureComponent } from 'react';

class PureComp extends PureComponent {
  render() {
    console.log("Pure Component");
    return <div>Pure Component {this.props.name}</div>;
  }
}

export default PureComp;
```

**Output:**

```
**********Parent Component*********
Regular Component
Pure Component
**********Parent Component*********
Regular Component
**********Parent Component*********
Regular Component
**********Parent Component*********
Regular Component
…continues every 2 seconds
```

**What happened:**

1.  On the first render, all three components render.
2.  Every 2 seconds, `setState({ name: "Rishabh" })` runs. A regular class component **re-renders on every `setState`**, even if the value is the same, so the **parent** re-renders.
3.  `RegComp` is a regular component, so it re-renders along with the parent.
4.  `PureComp` compares the new props with the old ones: `"Rishabh" === "Rishabh"` → nothing changed → **it skips rendering**.

### Shallow comparison (imp)

A shallow comparison compares each prop (and state key) **one level deep** using `===` (technically `Object.is`).

#### Primitive types

**`a (SC) b` returns `true` if `a` and `b` have the same value and the same type.**

```jsx
'Rishabh' === 'Rishabh'; // true
5 === 5;                 // true
5 === '5';               // false — different types
```

#### Complex types (objects, arrays, functions)

**`a (SC) b` returns `true` only if `a` and `b` reference the exact same object.**

```jsx
var a = [1, 2, 3];
var b = [1, 2, 3];
var c = a;

var ab_eq = (a === b); // false — same contents, different arrays
var ac_eq = (a === c); // true  — same reference
```

The same applies to objects and functions: `{ x: 1 } === { x: 1 }` is `false`.

**How PureComponent uses it:**

-   It shallow-compares **prevState with the current state**.
-   It shallow-compares **prevProps with the current props**.
-   If **any** key is different, the component re-renders.

```jsx
// Roughly what PureComponent does
function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => Object.is(objA[key], objB[key]));
}

shallowEqual({ name: 'A', age: 1 }, { name: 'A', age: 1 });           // true
shallowEqual({ user: { name: 'A' } }, { user: { name: 'A' } });       // false — different objects
```

### Points to remember

1.  **Never mutate state or props.** If you mutate an object/array and pass the same reference, the shallow comparison sees "no change" and the Pure component **won't update** — a bug.

    ```jsx
    // ❌ PureComp never shows the new item
    this.state.items.push('new');
    this.setState({ items: this.state.items });

    // ✅ new array → new reference → re-render
    this.setState(prev => ({ items: [...prev.items, 'new'] }));
    ```

2.  **A PureComponent skips its whole subtree.** When it doesn't re-render, its children aren't re-rendered by that update either. So the children should also depend only on props (be "pure"), or they may show stale data.
3.  **Don't pass new objects or functions on every render** to a Pure component — they're never equal, so it re-renders anyway (see below).
4.  **It's an optimization, not a guarantee.** Don't use it to prevent renders for correctness.

### React.memo

**`PureComponent` only works with class components, which is why `React.memo` exists.**

**`React.memo` is a higher-order component** added in **React 16.6**. If your function component renders the same result for the same props, wrap it in `React.memo` for a performance boost in some cases. **React will skip rendering the component and reuse the last rendered result** when the props are shallowly equal.

Using the Pure Component example above, create **MemoComp.js** in the same folder:

**MemoComp.js**

```jsx
import React from 'react';

const MemoComp = ({ name }) => {
  console.log('Rendering Memo Component');
  return <div>{name}</div>;
};

export default React.memo(MemoComp);
```

**ParentComp.js**

```jsx
import { Component } from 'react';
import MemoComp from './MemoComp';

class ParentComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Rishabh"
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ name: "Rishabh" });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log("**********Parent Component*********");
    return (
      <div>
        Parent Component
        <MemoComp name={this.state.name} />
      </div>
    );
  }
}

export default ParentComp;
```

**Output:**

```
**********Parent Component*********
Rendering Memo Component
**********Parent Component*********
**********Parent Component*********
…
```

`MemoComp` renders once; after that its `name` prop never changes, so React skips it.

**Note:** if the parent were a **function component** using `useState`, setting the **same** value would usually not re-render the parent at all (React bails out when `Object.is(old, new)`).

**React.memo only checks props.** If a component wrapped in `React.memo` uses `useState`, `useReducer` or `useContext`, **it still re-renders when its own state or that context changes.**

```jsx
const Greeting = React.memo(function Greeting({ name }) {
  const theme = useContext(ThemeContext); // re-renders when the theme changes, even with the same name
  return <h1 className={theme}>Hello, {name}</h1>;
});
```

#### Custom comparison function

By default, `React.memo` does a **shallow** comparison of props. For more control, pass a comparison function as the **second argument**:

```jsx
function MyComponent(props) {
  /* render using props */
}

function areEqual(prevProps, nextProps) {
  /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
  */
}

export default React.memo(MyComponent, areEqual);
```

**Careful — it's the opposite of `shouldComponentUpdate`:**

-   `shouldComponentUpdate` returns **`true` to re-render**.
-   `areEqual` returns **`true` to skip** re-rendering (props are "equal").

```jsx
const Chart = React.memo(
  function Chart({ data, onPointClick }) { /* expensive rendering */ },
  (prev, next) => prev.data.version === next.data.version // skip if the data version is the same
);
```

If you ignore a prop (like a callback) in `areEqual`, the component may call an **old** version of it. Compare every prop that affects rendering or behavior.

This method only exists as a **performance optimization**. **Don't rely on it to "prevent" a render**, as that can lead to bugs.

### Why memoization often doesn't work: new objects and functions

Objects, arrays and functions created during render are **new references every time**, so the shallow comparison always fails.

```jsx
const List = React.memo(function List({ items, style, onSelect }) {
  console.log('List render');
  return <ul style={style}>{items.map(i => <li key={i} onClick={() => onSelect(i)}>{i}</li>)}</ul>;
});

function App() {
  const [count, setCount] = useState(0);
  const items = ['a', 'b'];

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <List
        items={items}                   // ❌ new array every render
        style={{ color: 'red' }}        // ❌ new object every render
        onSelect={i => console.log(i)}  // ❌ new function every render
      />
    </>
  );
}
// Clicking the button logs "List render" every time — memo does nothing.
```

**Fix with stable references:**

```jsx
const listStyle = { color: 'red' };           // defined outside: never changes

function App() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => ['a', 'b'], []);                 // same array across renders
  const handleSelect = useCallback(i => console.log(i), []);   // same function across renders

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <List items={items} style={listStyle} onSelect={handleSelect} />
    </>
  );
}
// Now "List render" is logged only once.
```

**`children` is also a prop.** `<Memoized><span /></Memoized>` passes a new JSX element each render, so memo won't help there either.

### PureComponent vs React.memo vs shouldComponentUpdate

| | `PureComponent` | `React.memo` | `shouldComponentUpdate` |
| --- | --- | --- | --- |
| Works with | class components | function components | class components |
| Compares | props **and** state (shallow) | props only (shallow, or custom) | whatever you write |
| Custom logic | No | `areEqual(prev, next)` → `true` = skip | return `false` = skip |
| Own state changes | re-renders if state changed (shallow) | always re-renders | you decide |

### When to use memoization

**Use it when:**

-   A component renders **often with the same props** (e.g. a list row when the parent's unrelated state changes).
-   Rendering is **noticeably expensive** (large lists, charts, complex trees).
-   You can pass **stable** props (primitives, or memoized objects/functions).

**Skip it when:**

-   The component is cheap to render — the comparison itself has a cost.
-   Props change on almost every render anyway.
-   You haven't measured a problem — use the **React DevTools Profiler** first.

**Alternatives that often work better:**

-   **Move state down** into the component that needs it, so fewer components re-render.
-   **Pass JSX as `children`** — a component that owns state doesn't re-render elements it received as children.
-   **React Compiler** (React 19 era) automatically memoizes components and values, so manual `memo`/`useMemo`/`useCallback` becomes much less necessary.

### Interview questions

```jsx
// Q1: Does Child re-render when Parent's count changes?
const Child = React.memo(({ user }) => <p>{user.name}</p>);

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child user={{ name: 'Asha' }} />
    </>
  );
}
// Answer: Yes — { name: 'Asha' } is a new object every render, so the shallow check fails.
// Define the object outside the component or wrap it in useMemo.
```

```jsx
// Q2: A PureComponent's list doesn't update after adding an item. Why?
addItem = () => {
  const items = this.state.items;
  items.push('new');
  this.setState({ items });
};
// Answer: the same array is mutated and passed back, so prevState.items === nextState.items
// and PureComponent skips the render. Create a new array: [...this.state.items, 'new'].
```

```jsx
// Q3: What does this comparison function do?
export default React.memo(Row, (prev, next) => prev.id === next.id);
// Answer: Row re-renders only when id changes. Changes to other props (like label or onClick)
// are ignored — which can show stale data or call old callbacks.
```

```jsx
// Q4: Will this memoized component re-render when the theme changes?
const Title = React.memo(() => {
  const theme = useContext(ThemeContext);
  return <h1 className={theme}>Title</h1>;
});
// Answer: Yes. React.memo only compares props; context and state changes still re-render it.
```

```jsx
// Q5: Parent is a class component that calls this.setState({ name: 'A' }) with the same value.
// Does the parent re-render? Does a React.memo child with name="A" re-render?
// Answer: The parent re-renders (class setState always re-renders unless shouldComponentUpdate
// says no). The memo child does not — its props are shallowly equal.
```
