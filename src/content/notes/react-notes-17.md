---
title: "Refs"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 12
description: "React — refs with createRef and useRef, callback refs, refs to class components, forwarding refs, useImperativeHandle, and React 19 ref as a prop."
---
### What are refs?

Refs **provide a way to access DOM nodes or React elements** created during render. Common uses:

-   **Managing focus**, text selection or media playback (`input.focus()`, `video.play()`).
-   **Measuring** an element (size, scroll position).
-   **Integrating** with non-React libraries (charts, maps).
-   **Storing a mutable value** that shouldn't trigger a re-render (timer IDs, previous values) — with `useRef`.

**Don't overuse refs.** If something can be done declaratively with props and state, do that instead (e.g. show/hide a modal with an `isOpen` prop rather than calling `modal.open()`).

### createRef in class components

Refs are created with **`React.createRef()`** and attached to React elements with the **`ref`** attribute. They're usually assigned to an instance property when the component is constructed, so they can be used throughout the component.

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input type="text" ref={this.textInput} />
        <input type="button" value="Focus the text input" onClick={this.focusTextInput} />
      </div>
    );
  }
}
```

React **sets the `current` property to the DOM element when the component mounts, and back to `null` when it unmounts**. Ref updates happen **before** `componentDidMount` and `componentDidUpdate` run, so the DOM node is available in those methods.

```jsx
render() {
  console.log(this.textInput.current); // null on the first render — the DOM doesn't exist yet
  return <input ref={this.textInput} />;
}

componentDidMount() {
  console.log(this.textInput.current); // <input> element
}
```

### useRef in function components

In function components, use the **`useRef`** hook. It returns an object `{ current: initialValue }` that **stays the same across renders**.

```jsx
import { useRef } from 'react';

function CustomTextInput() {
  const inputRef = useRef(null);

  function focusTextInput() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={focusTextInput}>Focus the text input</button>
    </div>
  );
}
```

**`useRef` also stores values without re-rendering:**

```jsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);     // interval ID — changing it doesn't need a re-render
  const renderCount = useRef(0);

  renderCount.current++;

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <>
      <p>{seconds}s (rendered {renderCount.current} times)</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

| | `useState` | `useRef` |
| --- | --- | --- |
| Changing it re-renders | Yes | No |
| Value updates | on the next render | immediately (`ref.current = x`) |
| Use for | data shown in the UI | DOM nodes, timer IDs, previous values, instance variables |
| Read during render | Yes | Avoid (except initialization) — the value may be out of date |

**`createRef` vs `useRef`:** `createRef` creates a **new** ref object every time it's called, so in a function component it would reset on each render. Use `createRef` in classes and `useRef` in functions.

### Refs and function components

A function component has **no instance**, so before React 19 you **couldn't put a `ref` on a function component** (`<MyFunctionComponent ref={ref} />` gave a warning and `ref.current` stayed `null`).

However, you **can use refs inside a function component** as long as they point to a **DOM element** or a **class component**. To pass a ref *to* a function component, use **`forwardRef`** (React 18 and earlier) or pass `ref` as a prop (React 19) — see below.

### Callback refs (imp)

React also supports **callback refs**, which give more fine-grained control over when refs are set and unset.

Instead of passing a ref object, you pass a **function**. React calls it with the **DOM element** (or component instance) when it mounts, and with **`null`** when it unmounts. You can store the element anywhere.

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input type="text" ref={this.setTextInputRef} />
        <input type="button" value="Focus the text input" onClick={this.focusTextInput} />
      </div>
    );
  }
}
```

**Callback refs are useful for:**

-   **Measuring** an element as soon as it appears:

    ```jsx
    function MeasureExample() {
      const [height, setHeight] = useState(0);

      const measuredRef = useCallback(node => {
        if (node !== null) setHeight(node.getBoundingClientRect().height);
      }, []);

      return (
        <>
          <h1 ref={measuredRef}>Hello, world</h1>
          <p>The header is {Math.round(height)}px tall</p>
        </>
      );
    }
    ```

-   **Refs for a list of items** (you can't call `useRef` in a loop):

    ```jsx
    function Gallery({ images }) {
      const itemsRef = useRef(new Map());

      function scrollTo(id) {
        itemsRef.current.get(id)?.scrollIntoView({ behavior: 'smooth' });
      }

      return (
        <ul>
          {images.map(img => (
            <li
              key={img.id}
              ref={node => {
                if (node) itemsRef.current.set(img.id, node);
                else itemsRef.current.delete(img.id);
              }}
            >
              <img src={img.src} alt="" />
            </li>
          ))}
        </ul>
      );
    }
    ```

#### Caveats with callback refs

If the ref callback is written as an **inline function**, it's **called twice during updates** — first with `null`, then with the DOM element. That's because a **new function** is created on each render, so React clears the old ref and sets the new one. You can avoid this by defining the callback as a class method / instance property (or with `useCallback`), but it usually doesn't matter.

**React 19:** a ref callback can **return a cleanup function**. React calls the cleanup when the element is removed, instead of calling the callback with `null`.

```jsx
<input
  ref={node => {
    node.focus();
    return () => console.log('input removed'); // React 19 cleanup
  }}
/>
```

### Adding a ref to a class component

If we want to wrap `CustomTextInput` above and focus it immediately after mounting, we can put a ref on the **custom component** and call its `focusTextInput` method:

```jsx
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput(); // calls a method on the CustomTextInput instance
  }

  render() {
    return <CustomTextInput ref={this.textInput} />;
  }
}
```

**Note:** this only works if `CustomTextInput` is declared as a **class** — the ref points to the class **instance**:

```jsx
class CustomTextInput extends React.Component {
  // ...
}
```

### Forwarding refs

Ref forwarding is a technique for **automatically passing a ref through a component to one of its children**, using **`React.forwardRef((props, ref) => ...)`**. It's how a parent can get the DOM node inside a **function** component (for example, a reusable `Input` or `Button` in a design system).

**App.js**

```jsx
import ParentInputRef from "./components/RefsConcept/ParentInputRef";

function App() {
  return (
    <div className="App">
      <ParentInputRef />
    </div>
  );
}

export default App;
```

**ParentInputRef.js**

```jsx
import { Component, createRef } from 'react';
import FRInputRef from './FRInputRef';

class ParentInputRef extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  componentDidMount() {
    // For autofocus
    this.inputRef.current.focus();
  }

  clickHandler = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <FRInputRef ref={this.inputRef} />
        <button onClick={this.clickHandler}>Focus Input</button>
      </div>
    );
  }
}

export default ParentInputRef;
```

**FRInputRef.js**

```jsx
import React from 'react';

const FRInputRef = React.forwardRef((props, ref) => {
  return (
    <div>
      <input type="text" ref={ref} />
    </div>
  );
});

export default FRInputRef;
```

`forwardRef` gives the component a **second argument** (`ref`) and attaches it to the inner `<input>`. So `this.inputRef.current` in the parent is the **`<input>` DOM element**.

**The same with hooks:**

```jsx
const FancyInput = React.forwardRef((props, ref) => <input ref={ref} className="fancy" {...props} />);

function Form() {
  const inputRef = useRef(null);
  return (
    <>
      <FancyInput ref={inputRef} placeholder="Name" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

**This technique is also used in higher-order components**, where `React.forwardRef` wraps the returned component so the ref reaches the wrapped component (see the HOC chapter).

### React 19: ref as a prop

In **React 19**, function components can receive **`ref` as a regular prop**, so `forwardRef` is no longer needed (it will be deprecated in a future version).

```jsx
// React 19
function FancyInput({ placeholder, ref }) {
  return <input ref={ref} placeholder={placeholder} />;
}

<FancyInput ref={inputRef} placeholder="Name" />
```

### useImperativeHandle — expose a custom API

Sometimes you don't want to expose the whole DOM node, only a few methods. **`useImperativeHandle`** customizes what the parent gets in `ref.current`.

```jsx
const VideoPlayer = React.forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause()
  }), []);

  return <video ref={videoRef} src={src} />;
});

function App() {
  const playerRef = useRef(null);
  return (
    <>
      <VideoPlayer ref={playerRef} src="/intro.mp4" />
      <button onClick={() => playerRef.current.play()}>Play</button>
      {/* playerRef.current.style is undefined — only play/pause are exposed */}
    </>
  );
}
```

### When to use refs vs state

```jsx
// ❌ Using a ref for something the UI shows — it won't update on screen
function Counter() {
  const count = useRef(0);
  return <button onClick={() => count.current++}>{count.current}</button>; // always shows 0
}

// ✅ State for UI data
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Rules of thumb:**

-   If changing the value should **update what's on screen** → state.
-   If it's a DOM node or a value you only need **in event handlers or effects** → ref.
-   **Don't read or write `ref.current` during render** (except lazy initialization) — it makes components unpredictable.
-   **Don't manipulate DOM that React manages** (e.g. removing children React rendered) — only non-destructive things like focus, scroll and measuring.

### Interview questions

```jsx
// Q1: What is logged?
function App() {
  const ref = useRef(null);
  console.log(ref.current);
  useEffect(() => console.log(ref.current), []);
  return <input ref={ref} />;
}
// Answer: null (during the first render), then the <input> element (after mount).
```

```jsx
// Q2: Clicking the button 3 times — what is displayed?
function App() {
  const clicks = useRef(0);
  return <button onClick={() => { clicks.current += 1; console.log(clicks.current); }}>{clicks.current}</button>;
}
// Answer: the button still shows 0 (no re-render), while the console logs 1, 2, 3.
```

```jsx
// Q3: Why is ref.current null here (React 18)?
function MyInput(props) {
  return <input {...props} />;
}
function App() {
  const ref = useRef(null);
  useEffect(() => console.log(ref.current), []);
  return <MyInput ref={ref} />;
}
// Answer: in React 18, ref isn't passed to function components as a prop. Wrap MyInput in
// forwardRef and attach ref to <input>. (In React 19, ref is a normal prop and this works.)
```

```jsx
// Q4: How many times is the inline ref callback called when the component re-renders?
<input ref={el => console.log('ref', el)} />
// Answer: twice per update — once with null (old callback), once with the element (new callback).
```
