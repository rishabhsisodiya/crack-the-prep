---
title: "Web Components"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 25
description: "React — using Web Components (custom elements) in React, React 19 custom element support, and rendering React inside a Web Component."
---
### React and Web Components

React and Web Components solve **different problems**. **Web Components** (custom elements + Shadow DOM) provide **strong encapsulation** for reusable, framework-independent components. **React** is a declarative library that **keeps the DOM in sync with your data**. The two are complementary: you can use React inside Web Components, Web Components inside React, or both.

A **custom element** is an HTML tag you define yourself (the name must contain a dash):

```js
class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<p>Hello, ${this.getAttribute('name')}!</p>`;
  }
}

customElements.define('hello-world', HelloWorld);
// <hello-world name="Asha"></hello-world> → Hello, Asha!
```

### Using Web Components in React

Use a custom element in JSX like any HTML tag (lowercase, with a dash):

```jsx
function HelloMessage({ name }) {
  return <div>Hello <x-search>{name}</x-search>!</div>;
}
```

**Note:** Web Components often expose an **imperative API**. For example, a video Web Component might have `play()` and `pause()` methods. To call them, use a **ref** to reach the DOM node directly. For third-party Web Components, a good approach is to write a **React wrapper component** around the Web Component.

```jsx
function VideoPlayer({ src, playing }) {
  const ref = useRef(null);

  useEffect(() => {
    if (playing) ref.current.play();
    else ref.current.pause();
  }, [playing]);

  return <my-video ref={ref} src={src} />;
}
```

#### Events

**Before React 19**, events emitted by a Web Component (custom events) didn't work with JSX props like `onMyEvent`. You had to **attach event listeners manually** with a ref:

```jsx
function ColorPicker({ onColorChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handler = (e) => onColorChange(e.detail.color);
    el.addEventListener('color-change', handler);
    return () => el.removeEventListener('color-change', handler);
  }, [onColorChange]);

  return <color-picker ref={ref} />;
}
```

#### class vs className

One common confusion: with Web Components you'd write **`class`**, while React elements use **`className`**. React passes `class` through to custom elements (and React 19 also supports `className` on them).

```jsx
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

### React 19: full custom element support

React 19 passes **all tests on Custom Elements Everywhere**:

-   **Properties vs attributes:** if the custom element has a **property** with the prop's name, React sets the property (so objects and arrays work). Otherwise it sets an attribute. Before 19, React always set **attributes**, so non-string data like `items={[1, 2]}` became `"1,2"`.
-   **Custom events:** a prop that starts with `on` and has a function value is attached as an **event listener** on the custom element. The event name is the rest of the prop name, so `oncolor-change={fn}` listens for the `color-change` event. (Check the exact casing your component uses.)

```jsx
// React 19
<my-list
  items={[{ id: 1, label: 'A' }]}                 // set as a property (array kept as-is)
  onitem-selected={e => console.log(e.detail)}    // listens for "item-selected"
/>
```

### Using React inside Web Components

You can render a React tree inside a custom element — for example, to ship a React widget that non-React apps can use as a plain HTML tag.

```jsx
import { createRoot } from 'react-dom/client';

class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);

    this.root = createRoot(mountPoint);
    this.root.render(<a href={url}>{name}</a>);
  }

  disconnectedCallback() {
    this.root.unmount(); // clean up when the element is removed
  }
}

customElements.define('x-search', XSearch);
```

```html
<!-- usable in any page, React or not -->
<x-search name="react hooks"></x-search>
```

(The original notes used `ReactDOM.render(...)`, which is removed in React 19 — use `createRoot`.)

**Note:** custom elements must be **real ES classes**. Very old setups that transpiled classes to ES5 functions broke `customElements.define`, and needed the `custom-elements-es5-adapter` script. Modern build targets don't transpile classes, so this is rarely a problem today.

**Styles and Shadow DOM:** CSS inside the shadow root is isolated, so global stylesheets (and CSS-in-JS libraries that inject into `<head>`) won't style the React content automatically. Add the styles inside the shadow root.

### When to use which

| Use case | Choice |
| --- | --- |
| Design system shared across React, Angular, Vue and plain HTML | Web Components (e.g. built with Lit) |
| App UI with lots of state and data flow | React |
| Embedding a React widget in a non-React site | React inside a custom element |
| Using a third-party Web Component library in React | wrap it in a small React component |

### Interview questions

```jsx
// Q1: (React 18) Why does the custom element receive "[object Object]"?
<user-card user={{ name: 'Asha' }} />
// Answer: React 18 sets props on custom elements as attributes, which are strings.
// Set the property with a ref: ref.current.user = { name: 'Asha' }. React 19 sets properties automatically.
```

```jsx
// Q2: (React 18) Why doesn't onItemSelected fire?
<item-list onItemSelected={handle} />
// Answer: React 18 didn't attach custom events from JSX props on custom elements.
// Use ref.current.addEventListener('item-selected', handle) in an effect.
```

```jsx
// Q3: Can a React component render inside Shadow DOM?
// Answer: Yes — create a root on a node inside the shadow root. Remember that global CSS
// doesn't cross the shadow boundary.
```
