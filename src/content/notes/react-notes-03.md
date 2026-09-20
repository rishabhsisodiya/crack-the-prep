---
title: "Introducing JSX"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 2
description: "React — JSX syntax, rules, expressions, how JSX compiles, and rendering elements."
---
### What is JSX?

Consider this variable declaration:

```jsx
const element = <h1>Hello, world!</h1>;
```

This funny tag syntax is neither a string nor HTML.

It is called **JSX** (JavaScript XML), and it is a **syntax extension to JavaScript**. React recommends it for describing what the UI should look like. JSX may remind you of a template language, but it comes with the **full power of JavaScript**.

Browsers don't understand JSX. A compiler (Babel, SWC, esbuild) turns it into regular JavaScript function calls before the code runs.

### What JSX compiles to

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
```

**React 17+ (automatic runtime):**

```js
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx('h1', { className: 'greeting', children: 'Hello, world!' });
```

**Classic runtime (before React 17):**

```js
const element = React.createElement('h1', { className: 'greeting' }, 'Hello, world!');
```

That's why older code needed `import React from 'react'` in every file that used JSX — the compiled code called `React.createElement`. With the automatic runtime, that import is no longer required.

Both produce a plain **React element** object, roughly:

```js
{
  type: 'h1',
  props: { className: 'greeting', children: 'Hello, world!' },
  key: null
}
```

**Using React without JSX** (works, but is harder to read):

```js
import { createElement as h } from 'react';

function App() {
  return h('div', null,
    h('h1', null, 'Title'),
    h('p', { className: 'intro' }, 'Hello')
  );
}
```

### Embedding expressions in JSX

Put **any JavaScript expression** inside curly braces `{ }`.

```jsx
const name = 'Josh Perez';
const user = { firstName: 'Harper', lastName: 'Perez' };

function formatName(u) {
  return u.firstName + ' ' + u.lastName;
}

const element = (
  <div>
    <h1>Hello, {name}</h1>                {/* variable */}
    <p>2 + 2 = {2 + 2}</p>                {/* expression */}
    <p>{formatName(user)}</p>             {/* function call */}
    <p>{user.age ?? 'Age not set'}</p>    {/* operators */}
    <p>{new Date().getFullYear()}</p>
  </div>
);
```

**Expressions only — not statements.** `if`, `for` and `switch` can't go directly inside `{ }`. Use a ternary, `&&`, `map`, or compute the value before `return`.

```jsx
// ❌ SyntaxError
// <p>{if (isLoggedIn) { 'Welcome' }}</p>

// ✅ Expressions
<p>{isLoggedIn ? 'Welcome' : 'Please log in'}</p>
<ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
```

### JSX attributes

Since JSX is closer to JavaScript than to HTML, React DOM uses **camelCase** property names instead of HTML attribute names.

For example, **`class` becomes `className`, `for` becomes `htmlFor`, `onclick` becomes `onClick`, and `tabindex` becomes `tabIndex`.**

| HTML | JSX |
| --- | --- |
| `class="box"` | `className="box"` |
| `for="email"` | `htmlFor="email"` |
| `onclick="handle()"` | `onClick={handle}` |
| `tabindex="0"` | `tabIndex={0}` |
| `style="color: red; font-size: 12px"` | `style={{ color: 'red', fontSize: 12 }}` |
| `<input checked>` | `<input defaultChecked />` or `checked={true}` |
| `aria-label`, `data-id` | stay the same (`aria-label`, `data-id`) |

```jsx
<label htmlFor="email" className="label">Email</label>
<input id="email" tabIndex={0} disabled={false} />

// Strings use quotes, JavaScript values use braces
<img src={user.avatarUrl} alt="Avatar" width={40} />

// style takes an object — the outer braces are JSX, the inner braces are the object
<div style={{ backgroundColor: 'navy', padding: '8px' }}>Box</div>
```

### JSX rules

**1. Return a single root element.** Wrap siblings in a parent element or a **Fragment** (`<> </>`).

```jsx
// ❌ Adjacent JSX elements must be wrapped in an enclosing tag
// return <h1>Title</h1><p>Text</p>;

// ✅
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

**2. Close every tag.** Self-closing tags need `/>`.

```jsx
<img src="logo.png" alt="Logo" />
<br />
<input type="text" />
```

**3. Component names start with a capital letter.** Lowercase names are treated as HTML tags.

```jsx
function button() { return <button>Click</button>; }
<button />   // renders a plain HTML <button>, NOT your component

function Button() { return <button>Click</button>; }
<Button />   // renders your component
```

**4. Use parentheses** for multi-line JSX, to avoid automatic semicolon insertion after `return`.

```jsx
function Bad() {
  return        // JavaScript inserts a semicolon here → returns undefined
    <div>Hi</div>;
}

function Good() {
  return (
    <div>Hi</div>
  );
}
```

**5. Comments** go inside braces: `{/* comment */}`.

### What renders and what doesn't

```jsx
<div>{'text'}</div>        // text
<div>{42}</div>            // 42
<div>{0}</div>             // 0 — careful with && (see below)
<div>{[1, 2, 3]}</div>     // 123 — arrays are rendered item by item
<div>{true}</div>          // nothing
<div>{false}</div>         // nothing
<div>{null}</div>          // nothing
<div>{undefined}</div>     // nothing
// <div>{{ a: 1 }}</div>   // Error: Objects are not valid as a React child
```

**Common bug with `&&`:**

```jsx
const count = 0;
<div>{count && <p>You have messages</p>}</div>   // renders "0"
<div>{count > 0 && <p>You have messages</p>}</div> // renders nothing ✅
```

### JSX prevents injection attacks (XSS)

By default, React **escapes** any value embedded in JSX before rendering it, so text from users can't inject HTML or scripts.

```jsx
const title = '<img src=x onerror="alert(1)">';
const element = <h1>{title}</h1>;
// Shows the text <img src=x onerror="alert(1)"> — no image, no script runs
```

To render real HTML you must opt in with `dangerouslySetInnerHTML`, and only with **sanitized** content:

```jsx
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

**Note:** escaping doesn't protect attributes like `href`. A link with `href="javascript:..."` from user input is still dangerous, so validate URLs.

### JSX represents objects

JSX elements are just JavaScript objects, so you can store them in variables, pass them as props, and return them from functions.

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {user.name}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}

const header = <Header />;
<Layout header={header} footer={<Footer />} />
```

### Rendering elements

**Elements are the smallest building blocks of React apps.** An element describes what you want to see on the screen:

```jsx
const element = <h1>Hello, world</h1>;
```

React elements are **immutable**. Once you create an element, you can't change its children or attributes. It's like a single frame of a movie: it represents the UI at a certain point in time. To update the UI, you create a **new** element (in practice, components re-render with new state).

**Element vs component:** an **element** is the plain object describing what to show (`<Button />`). A **component** is the function (or class) that returns elements (`function Button() {}`).

#### Rendering into the DOM

An HTML page usually has a single "root" DOM node:

```html
<div id="root"></div>
```

Everything inside it is managed by React. To render a React element into the root, create a root with `createRoot` and call `render`:

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
const element = <h1>Hello, world</h1>;
root.render(element);
```

**Older API (React 17 and earlier):**

```jsx
ReactDOM.render(element, document.getElementById('root'));
```

`ReactDOM.render` was deprecated in React 18 and **removed in React 19**. Use `createRoot`.

#### React only updates what's necessary

React DOM compares the element and its children to the previous one, and **only applies the DOM updates necessary** to bring the DOM to the desired state.

```jsx
const root = createRoot(document.getElementById('root'));

function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  root.render(element);
}

setInterval(tick, 1000);
```

Even though a whole new element tree is created every second, if you inspect the page in DevTools, **only the text inside `<h2>` changes**. The `<h1>` is never touched.

### Interview questions on JSX

```jsx
// Q1: What renders?
function App() {
  const items = [];
  return <div>{items.length && <ul>...</ul>}</div>;
}
// Answer: "0" — items.length is 0, and && returns that 0, which React renders.
// Fix: {items.length > 0 && <ul>...</ul>}
```

```jsx
// Q2: Why doesn't this work?
function card() {
  return <div className="card">Card</div>;
}
function App() {
  return <card />;
}
// Answer: <card /> starts with a lowercase letter, so React treats it as an unknown
// HTML tag <card>. Rename the component to Card and use <Card />.
```

```jsx
// Q3: What renders?
function App() {
  return (
    <p>
      {true}{false}{null}{undefined}{'A'}{0}{NaN}
    </p>
  );
}
// Answer: "A0NaN" — booleans, null and undefined render nothing; strings and numbers render.
```

```jsx
// Q4: What's wrong?
function Profile() {
  return
    <div>Profile</div>;
}
// Answer: return with nothing on the same line returns undefined (automatic
// semicolon insertion). Wrap the JSX in parentheses starting on the return line.
```
