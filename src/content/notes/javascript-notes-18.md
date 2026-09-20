---
title: "Async vs defer"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 13
description: "JavaScript — Async vs defer."
---
`async` and `defer` are boolean attributes of the `<script>` tag that control **when** an external script is downloaded and executed relative to HTML parsing.

### Normal scenario

```html
<script src="app.js"></script>
```

![](/notes-img/javascript-notes/img-036.webp)

In the normal scenario, when the HTML page loads, the browser parses the HTML line by line. When it reaches a `<script>` tag, it **stops parsing**, fetches the JavaScript file, executes it, and only then continues parsing the HTML. So JavaScript files **block** the rendering of HTML.

This is why a script in `<head>` that accesses elements further down fails:

```html
<head>
  <script>
    console.log(document.getElementById("title")); // null — the h1 isn't parsed yet
  </script>
</head>
<body>
  <h1 id="title">Hello</h1>
</body>
```

### async attribute

```html
<script async src="analytics.js"></script>
```

![](/notes-img/javascript-notes/img-037.webp)

With `async`, the script is **fetched in parallel** with HTML parsing. As soon as it is fully downloaded, it **executes immediately** — HTML parsing is paused during execution, then continues.

-   Execution order of multiple `async` scripts is **not guaranteed** — whichever downloads first runs first.
-   It may run before or after the HTML finishes parsing.

### defer attribute

```html
<script defer src="app.js"></script>
```

![](/notes-img/javascript-notes/img-038.webp)

With `defer`, the script is also **fetched in parallel** with HTML parsing, but it **executes only after HTML parsing is complete** (just before the `DOMContentLoaded` event).

-   Multiple `defer` scripts run **in the order they appear** in the HTML.
-   The DOM is fully available when they run.

### Which one should we use?

-   **Multiple scripts that depend on each other → use `defer`.** `async` doesn't guarantee the order of execution, so a script might run before the library it needs, breaking the code.
-   **Independent scripts with no dependencies → `async` is fine.** For example analytics, ads or tracking scripts.
-   **Scripts that need the DOM → `defer`** (or place the script at the end of `<body>`).

```html
<!-- jQuery must load before plugin.js → defer keeps the order -->
<script defer src="jquery.js"></script>
<script defer src="plugin.js"></script>

<!-- analytics doesn't depend on anything → async -->
<script async src="analytics.js"></script>
```

**Order example:**

```html
<script async src="a.js"></script>  <!-- a.js: 2 MB -->
<script async src="b.js"></script>  <!-- b.js: 10 KB -->
<!-- Likely execution order: b.js, then a.js (smaller file downloads first) -->

<script defer src="c.js"></script>  <!-- c.js: 2 MB -->
<script defer src="d.js"></script>  <!-- d.js: 10 KB -->
<!-- Execution order: always c.js, then d.js -->
```

### Comparison

| | Normal | `async` | `defer` |
| --- | --- | --- | --- |
| Blocks HTML parsing while downloading | Yes | No | No |
| When it executes | immediately when reached | as soon as downloaded | after HTML is parsed |
| Blocks parsing while executing | Yes | Yes | No (parsing already done) |
| Order kept for multiple scripts | Yes | No | Yes |
| DOM ready when running | only elements above it | not guaranteed | Yes |
| Good for | small critical inline code | independent scripts (analytics) | app code, scripts that use the DOM |

### Notes

-   `async` and `defer` only work for **external** scripts (with `src`). They are ignored for inline scripts.
-   **Module scripts** (`<script type="module">`) are **deferred by default**. Adding `async` to a module makes it run as soon as it is ready.
-   If both `async` and `defer` are present, modern browsers use `async`.
-   `DOMContentLoaded` fires after HTML is parsed and all `defer` scripts have run; `load` fires after images, stylesheets and everything else have loaded.

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("HTML parsed and deferred scripts executed");
});

window.addEventListener("load", () => {
  console.log("Everything loaded, including images");
});
```
