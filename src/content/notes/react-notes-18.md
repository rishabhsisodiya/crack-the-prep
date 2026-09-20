---
title: "Portals"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 15
description: "React — createPortal, rendering modals and tooltips outside the parent DOM, and event bubbling through portals."
---
### What are portals?

Portals provide a **first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component** (for example, outside the `#root` div).

```jsx
import { createPortal } from 'react-dom';

createPortal(child, container)
```

-   **`child`** — any renderable React child: an element, string, or fragment.
-   **`container`** — a DOM element to render into.

Normally, when you return an element from a component, it's mounted into the DOM **as a child of the nearest parent node**. A portal lets you put it somewhere else in the DOM, while it still stays in the **same place in the React tree** (it keeps receiving props, context and state from its React parent).

### Basic example

**index.html**

```html
<html>
  <body>
    <div id="root"></div>
    <div id="portal-root"></div>
  </body>
</html>
```

**App.js**

```jsx
import PortalDemo from "./components/Portals/PortalDemo";

function App() {
  return (
    <div className="App">
      <PortalDemo />
    </div>
  );
}

export default App;
```

**PortalDemo.js**

```jsx
import { createPortal } from 'react-dom';

const PortalDemo = () => {
  return createPortal(
    <h1>Portals Demo</h1>,
    document.getElementById("portal-root")
  );
};

export default PortalDemo;
```

**Resulting DOM:**

```html
<div id="root">
  <div class="App"></div>        <!-- PortalDemo renders nothing here -->
</div>
<div id="portal-root">
  <h1>Portals Demo</h1>          <!-- rendered here instead -->
</div>
```

(Older code uses `ReactDOM.createPortal` from `import ReactDOM from 'react-dom'` — it's the same function.)

### Use cases

#### 1. Escaping the parent's CSS (modals, tooltips, dropdowns, toasts)

If a parent has **`overflow: hidden`**, a **`z-index`** stacking context, or **`transform`**, a modal or tooltip rendered inside it can get **clipped or hidden behind** other content. The parent's CSS "messes up" the child. Rendering the modal into a container at the end of `<body>` avoids that.

```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

function Card() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ overflow: 'hidden', height: 100 }}>   {/* would clip a normal child */}
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <p>I'm not clipped by the card, because I'm rendered into document.body.</p>
      </Modal>
    </div>
  );
}
```

#### 2. Event bubbling through portals

**An event fired inside a portal propagates to its ancestors in the React tree, even if those elements aren't its ancestors in the DOM tree.**

Assume this HTML structure:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

```jsx
function Parent() {
  const [clicks, setClicks] = useState(0);

  return (
    <div onClick={() => setClicks(c => c + 1)}>
      <p>Number of clicks: {clicks}</p>
      <p>Open DevTools to see that the button is NOT a child of this div in the DOM.</p>
      {createPortal(
        <button>Click</button>,
        document.getElementById('modal-root')
      )}
    </div>
  );
}
// Clicking the button increases the count: the click bubbles to Parent's onClick
// through the React tree, even though in the DOM the button lives in #modal-root.
```

This is useful because a parent can handle events from a portal without special code. But it can also surprise you — a click inside a modal can trigger a parent's `onClick`. Call `e.stopPropagation()` inside the portal if you don't want that.

#### 3. Context and state still work

A portal keeps the React context of where it's rendered:

```jsx
const ThemeContext = createContext('light');

function Tooltip() {
  const theme = useContext(ThemeContext);    // "dark" — from the React parent
  return createPortal(<div className={`tooltip ${theme}`}>Hi</div>, document.body);
}

<ThemeContext.Provider value="dark">
  <Tooltip />
</ThemeContext.Provider>
```

#### 4. Rendering into non-React parts of a page

If only part of a page uses React (e.g. a server-rendered page or a widget in a third-party layout), portals can render React content into other existing DOM containers.

### Creating the container dynamically

```jsx
function Portal({ children }) {
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(container);
    return () => document.body.removeChild(container); // clean up on unmount
  }, [container]);

  return createPortal(children, container);
}
```

**Server rendering:** `document` doesn't exist on the server, so create or look up portal containers inside `useEffect` (or render the portal only after the component has mounted).

### Accessibility for modals

When you build a modal with a portal:

-   Move **focus** into the modal when it opens, and back to the trigger button when it closes.
-   **Trap focus** inside the modal while it's open.
-   Close it with the **Escape** key.
-   Use `role="dialog"`, `aria-modal="true"` and a label (`aria-labelledby`).

The native HTML `<dialog>` element (with `showModal()`) handles many of these, and the browser renders it in the **top layer**, which also avoids clipping.

### Interview questions

```jsx
// Q1: Where does the <span> appear in the DOM, and does the click reach the div's handler?
function App() {
  return (
    <div id="wrapper" onClick={() => console.log('wrapper clicked')}>
      {createPortal(<span>Hi</span>, document.body)}
    </div>
  );
}
// Answer: the <span> is a direct child of <body>, not inside #wrapper. Clicking it still logs
// "wrapper clicked", because events bubble through the React tree.
```

```jsx
// Q2: Does the portal content receive context from its React parent?
// Answer: Yes. A portal is still part of the React tree, so props, state and context work normally.
```

```jsx
// Q3: Why use a portal for a modal instead of rendering it inside the component?
// Answer: parent styles like overflow: hidden, z-index stacking contexts or transform can clip or
// hide the modal. Rendering it into document.body avoids that.
```
