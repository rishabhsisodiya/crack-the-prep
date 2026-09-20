---
title: "Render Props"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 17
description: "React — the render props pattern with a render prop and with children as a function, caveats, and how hooks replaced it."
---
### What are render props?

Just like HOCs share functionality between components without repeating code, **render props** is another pattern for the same goal.

**The term "render prop" refers to a technique for sharing code between React components using a prop whose value is a function.** The component with the logic **calls that function** to find out what to render, passing its data as arguments.

```jsx
<DataProvider render={data => <h1>Hello {data.target}</h1>} />
```

We'll use the same **counter problem** from the HOC chapter.

### Using a render prop

**App.js**

```jsx
import ClickCounter from "./components/RenderProps/ClickCounter";
import Counter from "./components/RenderProps/Counter";
import HoverCounter from "./components/RenderProps/HoverCounter";

function App() {
  return (
    <div className="App">
      <Counter
        render={(count, incrementCounter) => (
          <ClickCounter count={count} incrementCounter={incrementCounter} />
        )}
      />
      <Counter
        render={(count, incrementCounter) => (
          <HoverCounter count={count} incrementCounter={incrementCounter} />
        )}
      />
    </div>
  );
}

export default App;
```

**Counter.js** — holds the shared logic and calls `this.props.render`:

```jsx
import { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  incrementCounter = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        {this.props.render(this.state.count, this.incrementCounter)}
      </div>
    );
  }
}

export default Counter;
```

**ClickCounter.js**

```jsx
import { Component } from 'react';

class ClickCounter extends Component {
  render() {
    const { count, incrementCounter } = this.props;
    return (
      <div>
        <button onClick={incrementCounter}>Clicked {count} times</button>
      </div>
    );
  }
}

export default ClickCounter;
```

**HoverCounter.js**

```jsx
import { Component } from 'react';

class HoverCounter extends Component {
  render() {
    const { count, incrementCounter } = this.props;
    return (
      <div>
        <h1 onMouseOver={incrementCounter}>Hovered {count} times</h1>
      </div>
    );
  }
}

export default HoverCounter;
```

**Output:** two independent counters — a button that counts clicks and a heading that counts hovers. `Counter` owns the state; the **caller decides what to render**.

**The same Counter as a function component:**

```jsx
function Counter({ render }) {
  const [count, setCount] = useState(0);
  const incrementCounter = () => setCount(c => c + 1);
  return <div>{render(count, incrementCounter)}</div>;
}
```

Just because the pattern is called "render props", **you don't have to use a prop named `render`**. In fact, **any prop that is a function a component uses to know what to render is technically a "render prop".**

### Using the children prop (function as children)

A popular variation passes the function as **`children`**:

**App.js**

```jsx
import ClickCounter from "./components/RenderProps/ClickCounter";
import Counter from "./components/RenderProps/Counter";
import HoverCounter from "./components/RenderProps/HoverCounter";

function App() {
  return (
    <div className="App">
      <Counter>
        {(count, incrementCounter) => (
          <ClickCounter count={count} incrementCounter={incrementCounter} />
        )}
      </Counter>
      <Counter>
        {(count, incrementCounter) => (
          <HoverCounter count={count} incrementCounter={incrementCounter} />
        )}
      </Counter>
    </div>
  );
}

export default App;
```

**Counter.js** — calls `this.props.children` instead of `this.props.render`:

```jsx
import { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  incrementCounter = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        {this.props.children(this.state.count, this.incrementCounter)}
      </div>
    );
  }
}

export default Counter;
```

**ClickCounter.js and HoverCounter.js stay the same.**

Well-known examples of this style: `<Formik>{formikProps => ...}</Formik>`, `<Downshift>`, and older `<Context.Consumer>{value => ...}</Context.Consumer>`.

### Another example: mouse position

```jsx
class Mouse extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({ x: event.clientX, y: event.clientY });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

function Cat({ mouse }) {
  return <img src="/cat.png" alt="cat" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />;
}

function MouseTracker() {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Mouse render={mouse => <Cat mouse={mouse} />} />
      <Mouse render={({ x, y }) => <p>The mouse is at ({x}, {y})</p>} />
    </div>
  );
}
```

The same `Mouse` logic renders a moving cat in one place and text coordinates in another.

### Caveats and limitations

#### Be careful when using render props with React.PureComponent

Using a render prop can **cancel out the benefit of `React.PureComponent`** (or `React.memo`) if you create the function inside a `render` method. `PureComponent` does a **shallow prop comparison**, and **every render creates a new arrow function**, which is never equal to the previous one — so the comparison always fails and the component re-renders anyway.

For example, if `Mouse` extended `React.PureComponent` instead of `React.Component`:

```jsx
class Mouse extends React.PureComponent {
  // same implementation as above
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        {/* This is bad! The render prop is a new function on every MouseTracker render,
            so Mouse re-renders every time anyway. */}
        <Mouse render={mouse => <Cat mouse={mouse} />} />
      </div>
    );
  }
}
```

To get around this, you can **define the prop as an instance method**, so the same function is passed each time:

```jsx
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to the *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

In cases where you can't define the prop statically (for example, because the function needs to use the component's **props or state**), `<Mouse>` should extend `React.Component` instead. In function components, `useCallback` can keep the function stable.

#### Other drawbacks

-   **"Callback hell" in JSX** when several render-prop components are nested:

    ```jsx
    <Auth>
      {user => (
        <Theme>
          {theme => (
            <Counter>
              {(count, inc) => <Dashboard user={user} theme={theme} count={count} onInc={inc} />}
            </Counter>
          )}
        </Theme>
      )}
    </Auth>
    ```

-   The logic can only be used **inside JSX**, not in other logic (e.g. inside an effect).

### Render props vs HOC vs custom hooks

The same counter logic as a **custom hook** — the modern way to share stateful logic:

```jsx
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, incrementCounter: () => setCount(c => c + 1) };
}

function ClickCounter() {
  const { count, incrementCounter } = useCounter();
  return <button onClick={incrementCounter}>Clicked {count} times</button>;
}
```

| | HOC | Render props | Custom hook |
| --- | --- | --- | --- |
| How it works | function wraps a component | component calls a function prop | function called inside a component |
| Who decides what to render | the wrapped component | the **caller** (inline) | the component itself |
| Extra components in the tree | Yes | Yes | No |
| Nesting problem | wrapper hell | callback nesting in JSX | none |
| Prop name collisions | possible | no (you name the arguments) | no |
| Dynamic composition at render time | No (applied at definition) | Yes | Yes |
| Still used for | wrappers, `connect`, `memo` | components that render UI you customize (lists, virtualizers, form libraries) | most logic reuse |

**Render props are still useful** when a component renders UI and lets the caller customize parts of it — for example `renderItem` in a virtualized list:

```jsx
<VirtualList items={users} renderItem={user => <UserRow user={user} />} />
```

### Interview questions

```jsx
// Q1: What is rendered?
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return children(on, () => setOn(o => !o));
}

<Toggle>
  {(on, toggle) => <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>}
</Toggle>
// Answer: a button showing "OFF"; clicking toggles "ON"/"OFF".
```

```jsx
// Q2: What error appears?
function List({ renderItem }) {
  return <ul>{[1, 2].map(renderItem)}</ul>;
}
<List />
// Answer: TypeError — renderItem is not a function (it's undefined).
// Provide a default: function List({ renderItem = i => <li key={i}>{i}</li> }).
```

```jsx
// Q3: Does <Mouse> (a PureComponent) skip re-renders here?
<Mouse render={pos => <Cat pos={pos} />} />
// Answer: No — a new arrow function is passed on every render, so the shallow comparison fails.
```

```jsx
// Q4: Is a prop called "renderRow" a render prop?
// Answer: Yes. Any function prop that a component calls to decide what to render is a render prop.
```
