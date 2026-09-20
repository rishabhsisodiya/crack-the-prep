---
title: "Components, Props and State"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 3
description: "React — function and class components, props, state, lifting state up, and props vs state."
---
### Components

Components let you split the UI into **independent, reusable pieces**, and think about each piece in isolation.

There are two types of components: **function components** and **class components**.

### Function and class components

The simplest way to define a component is to write a JavaScript function:

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

This **function** is a valid React component because it accepts a single **"props"** (short for properties) object argument with data, and returns a React element. We call these **function components** because they are literally JavaScript functions.

You can also use an ES6 **class** to define a component:

```jsx
import { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

The two components above are **equivalent** from React's point of view.

**Modern React uses function components with hooks.** Class components still work and you'll see them in older code (and error boundaries still need a class), but new code should use functions.

Previously, we only saw React elements that represent DOM tags:

```jsx
const element = <div />;
```

**Elements can also represent user-defined components:**

```jsx
const element = <Welcome name="Sara" />;
```

When React sees an element representing a user-defined component, it passes the JSX attributes and children to that component as a **single object**. We call this object **"props"**.

```jsx
function Welcome(props) {
  console.log(props); // { name: "Sara" }
  return <h1>Hello, {props.name}</h1>;
}

<Welcome name="Sara" />; // renders <h1>Hello, Sara</h1>
```

**Note: always start component names with a capital letter.**

React treats components starting with lowercase letters as DOM tags. For example, `<div />` is an HTML div tag, but `<Welcome />` is a component and requires `Welcome` to be in scope.

### Composing components

Components can use other components in their output.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

### Function vs class components

| Function component | Class component |
| --- | --- |
| A plain JavaScript function that accepts props and returns JSX | Extends `React.Component` and must have a `render()` method that returns JSX |
| No `render` method — the function body **is** the render | `render()` is required |
| State with the `useState` hook | State with `this.state` and `this.setState()` |
| Side effects with `useEffect` (and other hooks) | Lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`…) |
| No `this` keyword | Uses `this` (`this.props`, `this.state`), and event handlers may need binding |
| Runs from top to bottom on **every render**; values are "remembered" between renders by hooks | React creates **one instance** of the class and keeps it alive; `render` and lifecycle methods are called on that instance |
| Less code, logic reused through **custom hooks** | Logic reused through HOCs and render props |
| Recommended for new code | Legacy style; still required for **error boundaries** |

**Older terminology:** before hooks (React 16.8, 2019), function components couldn't have state, so they were called **"stateless", "dumb" or "presentational"** components, and class components were **"stateful", "smart" or "container"** components. Today function components can have state and effects, so these labels describe a component's **role**, not whether it's a function or a class.

**The same counter in both styles:**

```jsx
// Function component
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

```jsx
// Class component
import { Component } from 'react';

class Counter extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return <button onClick={this.increment}>Count: {this.state.count}</button>;
  }
}
```

### Props

**Props** let you **pass data from a parent** (wrapping) component **to a child** (embedded) component. Props can be any JavaScript value: strings, numbers, arrays, objects, functions, and even JSX.

```jsx
function Avatar({ person, size = 100 }) {       // destructuring + default value
  return <img src={person.imageUrl} alt={person.name} width={size} height={size} />;
}

function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageUrl: '/lin.jpg' }}   // object
      size={80}                                                // number
    />
  );
}
```

#### The children prop

Content between a component's opening and closing tags is passed as **`props.children`**.

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

<Card title="Profile">
  <p>Name: Asha</p>
  <button>Edit</button>
</Card>
```

#### Passing functions as props (child → parent communication)

Data flows down through props. To let a child **tell the parent** something, the parent passes a function, and the child calls it.

```jsx
function SearchBox({ onSearch }) {
  return <input onChange={e => onSearch(e.target.value)} placeholder="Search" />;
}

function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox onSearch={setQuery} />
      <p>Searching for: {query}</p>
    </>
  );
}
```

#### Spreading props

```jsx
function Button(props) {
  return <button className="btn" {...props} />; // forwards onClick, disabled, type…
}

<Button onClick={save} disabled={saving}>Save</Button>
```

### Props are read-only

Whether you declare a component as a function or a class, **it must never modify its own props.**

```jsx
function Welcome(props) {
  props.name = 'Changed'; // ❌ never do this
  return <h1>{props.name}</h1>;
}
// In development, React freezes the props object, so this throws:
// TypeError: Cannot assign to read only property 'name' of object '#<Object>'
```

Consider this `sum` function:

```jsx
function sum(a, b) {
  return a + b;
}
```

**Such functions are called "pure" because they don't change their inputs, and always return the same result for the same inputs.**

In contrast, this function is **impure** because it changes its own input:

```jsx
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible, but it has a single strict rule:

**All React components must act like pure functions with respect to their props.**

If a component needs a value that changes, it should use **state** (its own, or the parent's through a callback prop) instead of changing props.

### State

**The state of a component is data that can change over the component's lifetime.** Props let you pass data down the component tree; **state lets a component remember and change its own data. Changing state triggers a re-render**, which updates the UI.

**Function component (modern):**

```jsx
import { useState, useEffect } from 'react';

function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(id); // clean up when the component is removed
  }, []);

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```

**Class component:**

```jsx
import { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

**Rendering it (React 18+):**

```jsx
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) in TypeScript
root.render(<Clock />);
```

(Before React 18 this was `ReactDOM.render(<Clock />, document.getElementById('root'))`, which is removed in React 19.)

**Why not a normal variable?**

```jsx
function Counter() {
  let count = 0;                         // reset to 0 on every render
  return <button onClick={() => { count++; console.log(count); }}>{count}</button>;
}
// Clicking logs 1, 2, 3… but the button always shows 0:
// changing a local variable doesn't trigger a re-render, and the value is lost on the next render.
```

Each component instance has its **own** state:

```jsx
<Counter />  {/* clicking this one doesn't change the other */}
<Counter />
```

### Lifting state up

When several components need to **share** the same changing data, move the state up to their **closest common ancestor** and pass it down as props. This is called **"lifting state up"**.

```jsx
function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}: <input value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');           // single source of truth
  const fahrenheit = celsius === '' ? '' : (celsius * 9) / 5 + 32;

  return (
    <>
      <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
      <p>Fahrenheit: {fahrenheit}</p>
    </>
  );
}
```

Both the input and the result read from the same `celsius` state in `Calculator`, so they always stay in sync.

**When lifting state becomes painful** (passing props through many levels — "prop drilling"), use **Context** or a state library (see those chapters).

### Destructuring props and state

Suppose you render `<FullName fname="Rishabh" lname="Sisodiya" />`:

| Without destructuring | With destructuring |
| --- | --- |
| `function FullName(props) {`<br>`  return <p>{props.fname} {props.lname}</p>;`<br>`}` | `function FullName({ fname, lname }) {`<br>`  return <p>{fname} {lname}</p>;`<br>`}` |

The same works for state and in class components:

```jsx
function Profile({ user: { name, age }, role = 'guest', ...rest }) {
  return <p {...rest}>{name} ({age}) — {role}</p>;
}

class FullName extends Component {
  render() {
    const { fname, lname } = this.props;
    const { isEditing } = this.state;
    return <p>{fname} {lname}{isEditing && ' (editing)'}</p>;
  }
}
```

### State vs props

| Props | State |
| --- | --- |
| Passed **into** the component by its parent (like function parameters) | Managed **inside** the component (like variables that survive re-renders) |
| **Read-only** — the component can't change them | **Can be changed** with `setState` / the `useState` setter |
| Used to configure a component and pass data/callbacks down | Used for data that changes over time (input values, toggles, fetched data) |
| `props` in function components, `this.props` in class components | `useState` in function components, `this.state` in class components |
| A change comes from the parent re-rendering with new props | A change comes from calling the setter |
| Both trigger a re-render when they change | Both trigger a re-render when they change |

**Rule of thumb:** if a value is passed in and never changes inside the component → prop. If the component changes it over time → state. If it can be **calculated** from props or state → neither; compute it during render.

```jsx
function Cart({ items }) {                  // items: prop
  const [coupon, setCoupon] = useState(''); // coupon: state
  const total = items.reduce((sum, i) => sum + i.price, 0); // derived — not state
  return <p>Total: {total} {coupon && `(coupon: ${coupon})`}</p>;
}
```

### Interview questions

```jsx
// Q1: What does this render after clicking the button 3 times?
function Counter() {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>;
}
// Answer: always "0". count is a local variable — changing it doesn't re-render,
// and it's reset to 0 on every render. Use useState.
```

```jsx
// Q2: Is this allowed?
function Child(props) {
  props.items.push('new');
  return <ul>{props.items.map(i => <li key={i}>{i}</li>)}</ul>;
}
// Answer: No. It mutates the parent's array (props must be treated as read-only).
// It won't throw (only the props object is frozen, not nested arrays), but it causes bugs:
// the parent's data changes without a re-render. Ask the parent to update its state instead.
```

```jsx
// Q3: What is logged?
function Parent() {
  return <Child>Hello</Child>;
}
function Child(props) {
  console.log(props.children);
  return null;
}
// Answer: "Hello" — content between the tags is passed as props.children.
```

```jsx
// Q4: Two <Counter /> components are rendered side by side. You click the first one twice.
// What do they show?
// Answer: "2" and "0" — each component instance has its own independent state.
```
