---
title: "Use setState() correctly"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 4
imp: true
description: "React — updating state correctly with setState and useState: re-renders, batching, updater functions, and immutability."
---
These rules apply to both **`this.setState()`** in class components and the **`useState` setter** in function components.

### 1. Update state only with setState (never assign directly)

**If you don't use `setState` to update the state, the UI won't update.**

You can technically assign a value directly to `this.state`, but React won't know it changed, so it **won't re-render** the component. Always use `setState` (or the `useState` setter).

```jsx
// ❌ Wrong — no re-render
this.state.count = 5;

// ✅ Correct — schedules a re-render
this.setState({ count: 5 });
```

```jsx
// Function component
const [count, setCount] = useState(0);

count = 5;     // ❌ TypeError: Assignment to constant variable (and wouldn't re-render anyway)
setCount(5);   // ✅
```

The only place you assign `this.state` directly is when **initializing** it:

| In the constructor | Class field (modern) |
| --- | --- |
| `constructor(props) {`<br>`  super(props);`<br>`  this.state = { count: 0 };`<br>`}` | `state = { count: 0 };` |

(Class fields like `state = {}` were a proposal for years — often called "ES7" syntax — and became standard in ES2022.)

### 2. State updates are not applied immediately

`setState` doesn't change `this.state` right away. React **schedules** an update and re-renders later (after your event handler finishes). So reading the state right after calling `setState` gives the **old** value.

To use the updated value, pass a **callback** as the second argument to `setState`. It runs after the update is applied.

**App.js**

```jsx
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
```

**src/components/Counter.js**

```jsx
import { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState(
      { count: this.state.count + 1 },
      () => console.log('callback in setState — updated value:', this.state.count)
    );

    // this log will NOT print the updated value
    console.log('right after setState:', this.state.count);
  };

  render() {
    return (
      <div>
        Count: {this.state.count}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
```

**Output after the first click:**

```
right after setState: 0
callback in setState — updated value: 1
```

**In function components**, the setter has no callback. The variable keeps its value for the current render. Use the new value directly, or react to the change with `useEffect`:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    console.log(count); // 0 — still the value from this render
    console.log(next);  // 1 — use a local variable if you need it now
  };

  useEffect(() => {
    console.log('count changed to', count); // runs after the re-render
  }, [count]);

  return <button onClick={increment}>Count: {count}</button>;
}
```

### 3. Update state based on the previous state (updater function)

**Problem: React batches multiple `setState` calls into a single update for better performance.**

In the code below, `incrementFive()` calls `increment()` five times, but they are **batched** into one update. Each call reads the same old `this.state.count`, so the updated value doesn't carry over between calls.

**Counter.js**

```jsx
import { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  incrementFive = () => {
    this.increment();
    this.increment();
    this.increment();
    this.increment();
    this.increment();
  };

  render() {
    return (
      <div>
        Count: {this.state.count}
        <button onClick={this.incrementFive}>Increment</button>
      </div>
    );
  }
}

export default Counter;
```

**Result after one click:** `Count: 1` (not 5).

All five calls are effectively `this.setState({ count: 0 + 1 })`, and the last one wins.

**Solution: pass an updater function.** React calls it with the **latest pending state**, so each update builds on the previous one.

```jsx
increment = () => {
  this.setState((prevState) => ({ count: prevState.count + 1 }));

  // You can use props as well, along with prevState:
  // this.setState((prevState, props) => ({ count: prevState.count + props.addValue }));
};

incrementFive = () => {
  this.increment();
  this.increment();
  this.increment();
  this.increment();
  this.increment();
};
```

**Result after one click:** `Count: 5`.

**Same problem and fix with `useState`:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const addFiveWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // all use count = 0 → result is 1
  };

  const addFiveRight = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1); // each uses the latest value → result is 3
  };

  return (
    <>
      <p>{count}</p>
      <button onClick={addFiveWrong}>+1 (wrong)</button>
      <button onClick={addFiveRight}>+3 (right)</button>
    </>
  );
}
```

**Rule:** whenever the new state depends on the old state, use the updater function form.

### 4. Batching (React 18 automatic batching)

React groups multiple state updates into **one re-render**.

-   **Before React 18:** batching happened only inside React event handlers. Updates inside `setTimeout`, promises or native event listeners caused **one re-render per update**.
-   **React 18+ (with `createRoot`):** **automatic batching** everywhere — events, timeouts, promises, native listeners.

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  console.log('render');

  const handleClick = () => {
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
      // React 18+: one "render" log. React 17: two.
    }, 0);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

To force an update to apply immediately (rarely needed), use `flushSync` from `react-dom`.

### 5. setState merges objects; useState replaces them

**Class `setState` shallowly merges** the object you pass into the current state:

```jsx
state = { name: 'Asha', age: 25 };

this.setState({ age: 26 });
// state is now { name: 'Asha', age: 26 } — name is kept
```

**The `useState` setter replaces** the whole value:

```jsx
const [user, setUser] = useState({ name: 'Asha', age: 25 });

setUser({ age: 26 });
// user is now { age: 26 } — name is lost!

setUser(prev => ({ ...prev, age: 26 }));
// ✅ { name: 'Asha', age: 26 }
```

Merging is only **one level deep** even in classes — nested objects must be copied yourself.

### 6. Never mutate state — create new objects and arrays

React decides whether to re-render by checking if the state value changed (`Object.is`). If you **mutate** an object or array and pass the **same reference**, React may skip the re-render.

```jsx
const [items, setItems] = useState(['a', 'b']);

// ❌ Mutation — same array reference, no re-render
items.push('c');
setItems(items);

// ✅ New array
setItems([...items, 'c']);
```

**Immutable update patterns:**

```jsx
// Arrays
setItems(prev => [...prev, newItem]);                       // add
setItems(prev => prev.filter(item => item.id !== id));      // remove
setItems(prev => prev.map(item =>                           // update one
  item.id === id ? { ...item, done: !item.done } : item
));

// Objects
setUser(prev => ({ ...prev, name: 'Rishabh' }));            // update a field
setUser(prev => ({                                          // nested field
  ...prev,
  address: { ...prev.address, city: 'Pune' }
}));
```

### 7. Don't store what you can calculate

```jsx
// ❌ Extra state that must be kept in sync
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

// ✅ Derive it during render
const count = items.length;
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### Interview questions

```jsx
// Q1: What is logged, and what is shown after one click?
function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };
  return <button onClick={handleClick}>{count}</button>;
}
// Answer: logs 0; the button shows 1. Both calls use count = 0 from this render.
```

```jsx
// Q2: What is shown after one click?
const handleClick = () => {
  setCount(c => c + 1);
  setCount(count + 5);
  setCount(c => c + 1);
};
// (starting from count = 0)
// Answer: 6. Updates are processed in order: 0 → 1, then replace with 0 + 5 = 5, then 5 → 6.
```

```jsx
// Q3: Why doesn't the list update?
const addTodo = (text) => {
  todos.push({ id: Date.now(), text });
  setTodos(todos);
};
// Answer: todos is mutated and the same array reference is passed, so React sees no change
// and skips the re-render. Use setTodos([...todos, { id: Date.now(), text }]).
```

```jsx
// Q4: How many times does the component render per click in React 18?
const handleClick = async () => {
  const data = await fetchData();
  setLoading(false);
  setData(data);
  setError(null);
};
// Answer: once — React 18 batches updates even after await. (React 17 would render three times.)
```
