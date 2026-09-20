---
title: "Styling React Component"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 9
description: "React — CSS stylesheets, inline styles, CSS Modules, CSS-in-JS and Tailwind, and when to use each."
---
There are several ways to style React components:

1.  CSS stylesheet
2.  Inline styling
3.  CSS Modules
4.  CSS-in-JS libraries (styled-components, Emotion)
5.  Utility-first CSS (Tailwind CSS)

### CSS stylesheet

**App.css**

```css
body {
  background-color: #282c34;
  color: white;
  padding: 40px;
  font-family: Arial;
  text-align: center;
}

.App {
  color: black;
}
```

**App.js**

```jsx
import './App.css';

function MyHeader() {
  return (
    <div className="App">
      <h1>Hello Style!</h1>
      <p>Add a little style!</p>
    </div>
  );
}

export default MyHeader;
```

Use **`className`** (not `class`) in JSX. The bundler (Vite/webpack) adds the imported CSS to the page.

**Important:** importing a CSS file makes it **global**. Its class names apply to the whole app, not only the component that imported it.

**Conditional class names:**

```jsx
function Button({ primary, disabled }) {
  const classes = ['btn', primary && 'btn--primary', disabled && 'btn--disabled']
    .filter(Boolean)
    .join(' ');
  return <button className={classes}>Save</button>;
}
// With the "clsx" package: className={clsx('btn', { 'btn--primary': primary })}
```

### Inline styling

```jsx
function MyHeader() {
  return (
    <div>
      <h1 style={{ color: "red" }}>Hello Style!</h1>
      <p>Add a little style!</p>
    </div>
  );
}
```

The `style` prop takes a **JavaScript object**, which is why there are double braces: the outer braces are JSX, the inner braces are the object.

Inline CSS properties must be written in **camelCase**: use `backgroundColor` instead of `background-color`.

We can also define the style as a **JavaScript object** first:

```jsx
function MyHeader() {
  const mystyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px",
    fontFamily: "Arial",
  };

  return (
    <div>
      <h1 style={mystyle}>Hello Style!</h1>
      <p>Add a little style!</p>
    </div>
  );
}
```

**Details:**

-   Numbers are treated as **pixels** for most properties: `{ padding: 10 }` → `padding: 10px`. Unitless properties stay as numbers (`lineHeight: 1.5`, `zIndex: 2`, `opacity: 0.5`).
-   Vendor prefixes start with a capital letter (`WebkitTransition`), except `ms` (`msTransition`).
-   Great for **dynamic values** calculated at runtime: `style={{ width: `${progress}%` }}`.

**Limitations of inline styles:** no pseudo-classes (`:hover`, `:focus`), no media queries, no animations/keyframes, and they're hard to reuse and override.

### CSS Modules

CSS Modules are a good fit for components in separate files. Every class name is **scoped locally** to the component by default, so there are no naming conflicts.

Create the CSS module with the **`.module.css`** extension, for example `mystyle.module.css`.

**mystyle.module.css**

```css
.bigblue {
  color: DodgerBlue;
  padding: 40px;
  font-family: Arial;
  text-align: center;
}
```

**Car.js**

```jsx
import styles from './mystyle.module.css';

function Car() {
  return <h1 className={styles.bigblue}>Hello Car!</h1>;
}

export default Car;
```

The bundler turns `.bigblue` into a **unique class name** like `mystyle_bigblue__a1b2c`, and `styles.bigblue` holds that generated name.

```jsx
// Multiple classes
<div className={`${styles.card} ${isActive ? styles.active : ''}`} />

// Class names with dashes
<div className={styles['error-text']} />
```

#### Why CSS Modules are better in some scenarios

Say both the parent and the child define an `.error` class:

```css
/* Parent.css */
.error { color: red; }

/* Child.css */
.error { color: orange; font-size: 12px; }
```

With **normal stylesheets**, both files are global. Whichever CSS loads last wins, so the parent's `.error` can change the child's `.error` (and vice versa). There's a **name conflict**.

With **CSS Modules**, each file gets its own unique generated class names (`Parent_error__x1` and `Child_error__y2`), so the parent and child can both use `.error` safely.

### CSS-in-JS (styled-components, Emotion)

Write CSS inside JavaScript. Styles are scoped to the component and can use **props** directly.

```jsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  background: ${props => (props.primary ? 'royalblue' : 'gray')};

  &:hover {
    opacity: 0.9;
  }
`;

function App() {
  return (
    <>
      <Button primary>Save</Button>
      <Button>Cancel</Button>
    </>
  );
}
```

**Pros:** scoped styles, dynamic styles from props, pseudo-classes and media queries, colocated with the component.
**Cons:** extra runtime cost (styles generated in the browser), larger bundle, and runtime CSS-in-JS doesn't work well with **React Server Components**. Many teams now prefer zero-runtime options (CSS Modules, Tailwind, vanilla-extract).

### Tailwind CSS (utility-first)

Use small predefined utility classes directly in `className`.

```jsx
function Card({ title }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow hover:shadow-lg md:p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  );
}
```

**Pros:** fast to build, consistent design system, only used classes end up in the CSS, responsive and hover variants built in.
**Cons:** long class lists in JSX, and a learning curve for the class names.

### Which one to choose?

| Approach | Scoped | Dynamic styles | Pseudo-classes / media queries | Runtime cost | Good for |
| --- | --- | --- | --- | --- | --- |
| Global CSS stylesheet | No | via class names | Yes | None | small apps, global base styles |
| Inline styles | Yes (per element) | Yes | **No** | Small | truly dynamic values (width, position) |
| CSS Modules | Yes | via class names | Yes | None | component styles in most apps |
| CSS-in-JS (styled-components) | Yes | Yes (props) | Yes | Yes | design systems, theme-heavy apps |
| Tailwind CSS | Utility classes | via class names | Yes | None | fast UI building, consistent design |

### Interview questions

```jsx
// Q1: Why doesn't this work?
<div style="color: red; font-size: 14px">Hi</div>
// Answer: style must be an object in React: style={{ color: 'red', fontSize: 14 }}.
// A string throws "The style prop expects a mapping from style properties to values".
```

```jsx
// Q2: What padding does this produce?
<div style={{ padding: 10, lineHeight: 2, margin: '1rem' }} />
// Answer: padding: 10px, line-height: 2 (unitless), margin: 1rem.
```

```jsx
// Q3: You import Button.css in Button.js. Does .title in that file affect other components?
// Answer: Yes — regular CSS imports are global. Use Button.module.css to scope it.
```

```jsx
// Q4: How do you apply a :hover style with inline styles?
// Answer: you can't. Use CSS (stylesheet/CSS Module), a CSS-in-JS library,
// or track hover state with onMouseEnter/onMouseLeave (not recommended).
```
