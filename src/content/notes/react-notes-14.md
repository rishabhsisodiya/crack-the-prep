---
title: "Fragments"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 14
description: "React — Fragments."
---

A component often needs to return several elements. **Fragments let you group children without adding an extra DOM node.**

## Why we need Fragments

A component that returns multiple elements has to wrap them in a single parent. If that wrapper is a `<div>`, it ends up in the DOM — which can break layouts or produce invalid HTML.

```jsx
function Table() {
  return (
    <table>
      <tbody>
        <tr>
          <Columns />
        </tr>
      </tbody>
    </table>
  );
}
```

`<Columns />` must render several `<td>` elements. If it wraps them in a `<div>`:

```jsx
function Columns() {
  return (
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  );
}
```

…the output is invalid HTML — a `<div>` can't be a direct child of `<tr>`:

```html
<table>
  <tbody>
    <tr>
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    </tr>
  </tbody>
</table>
```

## Fragments solve it

```jsx
function Columns() {
  return (
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  );
}
```

Now the render output is correct — no extra node:

```html
<table>
  <tbody>
    <tr>
      <td>Hello</td>
      <td>World</td>
    </tr>
  </tbody>
</table>
```

## Shorter syntax `<>…</>`

`<>…</>` is shorthand for `<React.Fragment>…</React.Fragment>`. Use it whenever you don't need a `key` or any props.

## Keyed Fragments

The shorthand can't take attributes, so when you map a collection to fragments and need a `key`, use the explicit form:

```jsx
function Glossary({ items }) {
  return (
    <dl>
      {items.map((item) => (
        // Without a key here, React logs a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` is the only attribute a `<React.Fragment>` accepts.

## Fragments vs div

| | `<>...</>` / `<React.Fragment>` | `<div>` |
| --- | --- | --- |
| Adds a DOM node | No | Yes |
| Can be styled or get a `className` | No | Yes |
| Can take a `ref` or event handlers | No | Yes |
| Accepts `key` | Only `<React.Fragment key>` | Yes |
| Good for | returning siblings, table cells, list items, flex/grid children | when you need a styled wrapper |

An extra `<div>` can also break **CSS layouts** — for example, children of a flex or grid container stop being direct children:

```jsx
function Row() {
  return (
    <div className="grid">          {/* display: grid; grid-template-columns: repeat(3, 1fr) */}
      <Cells />
    </div>
  );
}

function Cells() {
  return (
    <>                              {/* with a <div> here, all three cells would squeeze into one grid column */}
      <div>A</div>
      <div>B</div>
      <div>C</div>
    </>
  );
}
```

## Interview questions

```jsx
// Q1: What is the DOM output?
function App() {
  return (
    <ul>
      <Items />
    </ul>
  );
}
function Items() {
  return (
    <>
      <li>One</li>
      <li>Two</li>
    </>
  );
}
// Answer: <ul><li>One</li><li>Two</li></ul> — no wrapper element.
```

```jsx
// Q2: Why is this a syntax error?
{items.map(item => (
  <key={item.id}>
    <dt>{item.term}</dt>
  </>
))}
// Answer: the <>...</> shorthand can't take attributes. Use <React.Fragment key={item.id}>.
```

```jsx
// Q3: Can you return an array instead of a fragment?
function Columns() {
  return [<td key="a">Hello</td>, <td key="b">World</td>];
}
// Answer: Yes, arrays work, but each item needs a key and the syntax is noisier.
// Fragments are the cleaner option.
```
