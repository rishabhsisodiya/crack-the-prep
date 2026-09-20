---
title: "React Without ES6"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 24
description: "React — legacy createReactClass: default props, initial state and autobinding compared with ES6 classes and function components."
---
**This is legacy knowledge.** Before ES6 classes were widely supported, components were created with `React.createClass`, later moved to the separate **`create-react-class`** package. You may see it in very old codebases. New code should use **function components**.

### JavaScript class vs createReactClass

Normally you define a class component as a plain JavaScript class:

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Without ES6, you could use the **`create-react-class`** module instead:

```jsx
var createReactClass = require('create-react-class');

var Greeting = createReactClass({
  render: function () {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

**Modern equivalent:**

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

### Declaring default props

**Default props:** sometimes a prop isn't passed, and we don't want to show `undefined`. We could use `||` to set a fallback (`this.props.name || 'Mary'`), but adding that everywhere is messy. **`defaultProps`** sets default values for props; the default is used only when the prop is **not passed** (or is `undefined`).

**ES6 classes:** define `defaultProps` as a property on the component:

```jsx
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};

// or as a static class field
class Greeting extends React.Component {
  static defaultProps = { name: 'Mary' };
}
```

**createReactClass:** define `getDefaultProps()` as a function:

```jsx
var Greeting = createReactClass({
  getDefaultProps: function () {
    return {
      name: 'Mary'
    };
  },
  // ...
});
```

**Function components:** use default parameter values. (`defaultProps` on **function** components was deprecated and is **removed in React 19**; it still works for classes.)

```jsx
function Greeting({ name = 'Mary' }) {
  return <h1>Hello, {name}</h1>;
}

<Greeting />               // Hello, Mary
<Greeting name="Asha" />   // Hello, Asha
<Greeting name={null} />   // Hello,  — null is a value, so the default is NOT used
```

### Setting the initial state

**ES6 classes:** assign `this.state` in the constructor:

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }
  // ...
}
```

**createReactClass:** provide a separate `getInitialState` method that returns the initial state:

```jsx
var Counter = createReactClass({
  getInitialState: function () {
    return { count: this.props.initialCount };
  },
  // ...
});
```

**Function components:**

```jsx
function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  // ...
}
```

### Autobinding

In components declared as **ES6 classes**, methods follow normal ES6 class rules: they **don't automatically bind `this`** to the instance. You have to use `.bind(this)` in the constructor (or class-field arrow functions):

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'Hello!' };
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return <button onClick={this.handleClick}>Say hello</button>;
  }
}
```

With **createReactClass**, this isn't necessary, because it **automatically binds all methods**:

```jsx
var SayHello = createReactClass({
  getInitialState: function () {
    return { message: 'Hello!' };
  },

  handleClick: function () {
    alert(this.state.message);   // `this` works without bind
  },

  render: function () {
    return <button onClick={this.handleClick}>Say hello</button>;
  }
});
```

**Function components** don't use `this`, so there's nothing to bind:

```jsx
function SayHello() {
  const [message] = useState('Hello!');
  return <button onClick={() => alert(message)}>Say hello</button>;
}
```

### Mixins

`createReactClass` also supported **mixins** — objects whose methods were merged into several components to share behavior. They caused name clashes and hidden dependencies, so they were replaced by **HOCs and render props**, and today by **custom hooks**.

### Comparison

| Feature | `createReactClass` | ES6 class | Function component |
| --- | --- | --- | --- |
| Default props | `getDefaultProps()` | `static defaultProps` | default parameters |
| Initial state | `getInitialState()` | `this.state = ...` in constructor | `useState(initial)` |
| `this` binding | automatic | manual (`bind` / arrow fields) | not needed |
| Sharing logic | mixins | HOCs, render props | custom hooks |
| Status | legacy | supported, not recommended for new code | recommended |

### React without JSX

JSX is also optional. Each JSX element is just a call to `React.createElement(type, props, ...children)`:

```jsx
// With JSX
const element = <h1 className="greeting">Hello, {name}</h1>;

// Without JSX
const element = React.createElement('h1', { className: 'greeting' }, 'Hello, ', name);
```

See **Introducing JSX** for more.
