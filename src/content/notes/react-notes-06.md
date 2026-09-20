---
title: "Event Handling"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 5
description: "React — handling events, passing arguments, synthetic events, and binding this in class components."
---
### Handling events

Handling events in React is similar to handling events on DOM elements, with a few differences:

-   React event names use **camelCase** (`onClick`, not `onclick`).
-   You pass a **function**, not a string (`onClick={handleClick}`, not `onclick="handleClick()"`).
-   To stop the default browser behavior you must call **`e.preventDefault()`** — returning `false` doesn't work.

```html
<!-- HTML -->
<button onclick="activateLasers()">Activate Lasers</button>
```

```jsx
// React
<button onClick={activateLasers}>Activate Lasers</button>
```

**Function component:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      Count: {count}
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

**Class component** (from the setState chapter):

```jsx
import { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
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

### Pass the function, don't call it

If we write `<button onClick={this.increment()}>` (with parentheses), the method is **called immediately during render**, not on click. Its return value (`undefined`) becomes the click handler, so clicking does nothing.

```jsx
<button onClick={handleClick}>Click</button>     // ✅ passes the function
<button onClick={handleClick()}>Click</button>   // ❌ calls it on every render

// With setState inside, calling it during render can even cause an infinite loop:
// "Too many re-renders. React limits the number of renders to prevent an infinite loop."
```

### Passing arguments to event handlers

Wrap the call in an **arrow function**:

```jsx
function TodoList({ todos, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

To get both your argument and the event:

```jsx
<button onClick={(e) => handleDelete(todo.id, e)}>Delete</button>

// class component with bind: the event is passed as the last argument
<button onClick={this.handleDelete.bind(this, todo.id)}>Delete</button>
// handleDelete(id, e) { ... }
```

### The event object (SyntheticEvent)

React passes a **SyntheticEvent** to your handler — a cross-browser wrapper around the native event with the same interface (`target`, `currentTarget`, `preventDefault()`, `stopPropagation()`). The original is available as `e.nativeEvent`.

```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();                   // stop the page reload
    console.log('Submitted');
  }

  function handleChange(e) {
    console.log(e.target.name, e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
}
```

**Notes:**

-   **Event pooling was removed in React 17.** In older React, the event object was reused, so reading `e.target` inside a `setTimeout` or after `await` failed unless you called `e.persist()`. That's no longer needed.
-   Since React 17, React attaches listeners to the **root container** (not `document`), which makes it safer to use multiple React versions on one page.
-   `onChange` in React fires on **every keystroke** for inputs (like the native `input` event), not only on blur.

### Event propagation

React events bubble just like DOM events. Use `e.stopPropagation()` to stop bubbling, and the `Capture` suffix to listen in the capture phase.

```jsx
function Toolbar() {
  return (
    <div onClick={() => console.log('toolbar')}>
      <button onClick={e => { e.stopPropagation(); console.log('play'); }}>Play</button>
      <button onClick={() => console.log('upload')}>Upload</button>
    </div>
  );
}
// Click "Play"   → play
// Click "Upload" → upload, toolbar

<div onClickCapture={() => console.log('runs first, in the capture phase')}>...</div>
```

### Binding event handlers in class components

Let's take an example:

**Counter.js**

```jsx
import { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

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

**The code above throws an error when you click the button:**
`Uncaught TypeError: Cannot read properties of undefined (reading 'setState')`

To fix it, bind the method:

```jsx
<button onClick={this.increment.bind(this)}>Increment</button>
```

### Why do we need to bind event handlers? (imp)

`onClick={this.increment}` passes **only the function** to React, not the object it belongs to. Later, React calls it as a plain function — `increment()` — without the component instance. Class bodies always run in **strict mode**, so `this` inside `increment` is **`undefined`**, and `this.setState` throws.

**In JavaScript, these two snippets are not equivalent:**

```jsx
// first snippet — called as a method: `this` is obj
obj.method();

// second snippet — called as a plain function: `this` is lost
const method = obj.method;
method();
```

Passing `this.increment` to `onClick` is like the second snippet. **Binding** makes the second snippet behave like the first, by permanently fixing `this` to the component instance.

Refer to the code below for more understanding of `bind` (skip if you already know it — see the JavaScript chapter **call, apply and bind**):

```jsx
let name = {
  firstName: "Rishabh",
  lastName: "Sisodiya",
};

let printFullName = function (hometown, state) {
  console.log(this.firstName + " " + this.lastName + " from " + hometown + ", " + state);
};

printFullName.call(name, "Chittorgarh", "Rajasthan");
// "Rishabh Sisodiya from Chittorgarh, Rajasthan"

let name2 = {
  firstName: "Any",
  lastName: "Random",
};

// bind returns a new function with `this` fixed to name2
let printMyName = printFullName.bind(name2, "Udaipur", "Rajasthan");
printMyName();
// "Any Random from Udaipur, Rajasthan"
```

From this we can see that we pass an object (here `name2`) that `this.firstName` should refer to inside `printFullName`. In the component, we pass the component instance (`this`) so that `this.setState` works inside `increment`.

**Function components don't have this problem** — they don't use `this` at all.

### Types of binding (very imp)

#### 1. Bind in render

`bind` creates a new function whose `this` is fixed to the object you pass — here the component instance.

```jsx
increment() {
  this.setState({ count: this.state.count + 1 });
}

<button onClick={this.increment.bind(this)}>Increment</button>
```

**Downsides:**

-   **A new function on every render**, because `.bind(this)` returns a new bound function each time.
-   **Can cause extra re-renders** of child components that receive it as a prop (their props change every time), which defeats `PureComponent`/`React.memo`.
-   **Readability:** makes JSX less clean.

(For a simple button, creating a function per render is cheap — the child re-render issue matters more than memory.)

#### 2. Arrow function in render

An arrow function doesn't have its own `this`, so it uses `this` from `render`, which is the component instance.

```jsx
increment() {
  this.setState({ count: this.state.count + 1 });
}

<button onClick={() => this.increment()}>Increment</button>
```

**Downsides:**

-   Same as method 1: **a new function on every render**, which can re-render memoized children.
-   **Readability:** slightly cleaner than `.bind(this)`.
-   **Useful when you need to pass arguments:** `onClick={() => this.remove(id)}`.

#### 3. Bind in the constructor

```jsx
constructor(props) {
  super(props);
  this.state = { count: 0 };
  this.increment = this.increment.bind(this);
}

increment() {
  this.setState({ count: this.state.count + 1 });
}

<button onClick={this.increment}>Increment</button>
```

**Better than methods 1 and 2:**

-   **Binds once** when the component is created — no new function on each render.
-   The same function reference is passed every time, so memoized children don't re-render unnecessarily.
-   **Readability:** clean JSX, but the constructor gets cluttered if many methods need binding.

#### 4. Class property (arrow function field) — recommended for classes

```jsx
increment = () => {
  this.setState({ count: this.state.count + 1 });
};

<button onClick={this.increment}>Increment</button>
```

**Best approach for class components:**

-   **Created once per instance**, and `this` always refers to the instance (the arrow function captures it when the field is initialized).
-   No manual binding and no new function per render.
-   **Modern, concise syntax** — no constructor boilerplate.

### Class property approach vs constructor binding

| Aspect | Class property (arrow field) | Constructor binding (`bind`) |
| --- | --- | --- |
| Where the method lives | a function stored **on each instance** | original method on the **prototype**, plus a bound copy on each instance |
| Memory | one function per instance | one small bound function per instance (plus the shared prototype method) |
| Performance | negligible difference in real apps | negligible difference in real apps |
| Syntax/readability | cleaner, modern | more boilerplate |
| Testing with prototype spies | `jest.spyOn(MyComponent.prototype, 'clickHandler')` **doesn't work** (method isn't on the prototype) | works |
| Inheritance | subclasses can't call it with `super.clickHandler()` | works with `super` |

1.  **Memory and performance:** with a class field, the whole function is created on **each instance**, not on the prototype. With `bind` in the constructor, the method stays on the prototype and each instance stores a small bound wrapper. In practice the difference is negligible.
2.  **Unit tests:** you can't spy on the prototype for arrow field methods:

    ```jsx
    const spy = jest.spyOn(MyComponent.prototype, 'clickHandler');
    // ...
    expect(spy).toHaveBeenCalled(); // doesn't work for class field methods
    ```

    Instead, test the **behavior** (the state or rendered output changes after a click), or spy on the instance after it's created.

**If the callback is passed as a prop to child components**, avoid creating a new function in `render` (methods 1 and 2) when those children are memoized — use constructor binding or class fields so the reference stays the same.

### Passing methods as props

We can pass methods **by reference in props**, just like variables. This is how a child communicates with its parent.

```jsx
// Parent (class)
<ChildCounter incrementCounter={this.increment} />

// Child
function ChildCounter(props) {
  return <button onClick={props.incrementCounter}>Increment</button>;
}
```

**Function component version:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);

  return (
    <>
      <p>Count: {count}</p>
      <ChildCounter incrementCounter={increment} />
    </>
  );
}

function ChildCounter({ incrementCounter }) {
  return <button onClick={incrementCounter}>Increment</button>;
}
```

In function components, a new `increment` function is created on every render. If `ChildCounter` is wrapped in `React.memo`, wrap the function in **`useCallback`** so the reference stays stable (see the Hooks chapter).

### Interview questions

```jsx
// Q1: What happens?
function App() {
  const [count, setCount] = useState(0);
  return <button onClick={setCount(count + 1)}>{count}</button>;
}
// Answer: Error — "Too many re-renders". setCount is called during render, which triggers
// another render, which calls it again… Use onClick={() => setCount(count + 1)}.
```

```jsx
// Q2: What is logged when the button is clicked?
class App extends React.Component {
  handleClick() {
    console.log(this);
  }
  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
// Answer: undefined — the method is called without its instance, and class code is strict mode.
```

```jsx
// Q3: Clicking the inner button — what is logged?
<div onClick={() => console.log('div')}>
  <button onClick={() => console.log('button')}>Go</button>
</div>
// Answer: "button" then "div" — the event bubbles up.
```

```jsx
// Q4: Why does the page reload on submit?
<form onSubmit={() => { save(); return false; }}>...</form>
// Answer: returning false doesn't prevent the default in React. Call e.preventDefault():
// onSubmit={(e) => { e.preventDefault(); save(); }}
```
