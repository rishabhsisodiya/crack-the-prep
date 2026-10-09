---
title: "Debugging React"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-10-09"
draft: false
order: 30
description: "React — debugging with React DevTools (Components and Profiler) and the VS Code debugger (launch.json, breakpoints, variables, watch, call stack), taught through one buggy app you fix step by step."
---
### Two tools, two different questions

`console.log` works, but it is slow: you guess, add a log, reload, read, guess again. Two tools replace most of that guessing.

| Tool | The question it answers | Use it when |
|---|---|---|
| **React DevTools → Components** | What are the props, state and hooks of this component **right now**? | The UI shows the wrong thing and you want to know which component holds the wrong data |
| **React DevTools → Profiler** | **Which** components rendered, **why**, and how long did they take? | The app feels slow, or something re-renders more than it should |
| **VS Code Run and Debug** | What does my code do **line by line**? | A handler or function computes the wrong value, or something throws |

React DevTools understands **React** (components, hooks, renders). The VS Code debugger understands **JavaScript** (lines, variables, the call stack). A real bug hunt usually uses both: DevTools to find the component, the debugger to find the line.

This chapter builds one small app with **four deliberate bugs** and fixes each one with the tool that suits it.

### The practice app

Create a Vite project:

```bash
npm create vite@latest debug-cart -- --template react
cd debug-cart
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. Open the `debug-cart` folder itself in VS Code (**File → Open Folder**), so that the folder you opened is the app's root. This matters later for `webRoot`.

Replace `src/App.jsx` with this. **It contains four bugs on purpose.**

```jsx
// src/App.jsx
import { memo, useState } from 'react';

const COUPONS = {
  SAVE10: { percent: 10 },
  SAVE20: { percent: 20 },
};

const INITIAL_CART = [
  { id: 1, name: 'Keyboard', price: 1500, qty: 1 },
  { id: 2, name: 'Mouse', price: 700, qty: 1 },
  { id: 3, name: 'Monitor', price: 9000, qty: 1 },
];

function calculateTotal(cart, discountPercent) {
  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.price * item.qty;
  }
  return subtotal - (subtotal * discountPercent) / 100;
}

const CartRow = memo(function CartRow({ item, onQtyChange, onIncrement }) {
  return (
    <li>
      {item.name} (₹{item.price}){' '}
      <input
        value={item.qty}
        onChange={(e) => onQtyChange(item.id, e.target.value)}
      />
      <button onClick={() => onIncrement(item.id)}>+</button>
    </li>
  );
});

export default function App() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleQtyChange = (id, value) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, qty: value } : item)));
  };

  const handleIncrement = (id) => {
    const next = cart.map((item) => {
      if (item.id !== id) return item;
      return { ...item, qty: item.qty + 1 };
    });
    setCart(next);
  };

  const handleApplyCoupon = () => {
    const coupon = COUPONS[code];
    setDiscount(coupon.percent);
  };

  const handleResetQuantities = () => {
    cart.forEach((item) => {
      item.qty = 1;
    });
    setCart(cart);
  };

  return (
    <main>
      <h1>Cart</h1>
      <ul>
        {cart.map((item) => (
          <CartRow
            key={item.id}
            item={item}
            onQtyChange={handleQtyChange}
            onIncrement={handleIncrement}
          />
        ))}
      </ul>

      <button onClick={handleResetQuantities}>Reset quantities</button>

      <p>
        <input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Apply</button>
      </p>

      <h2>Total: ₹{calculateTotal(cart, discount)}</h2>
    </main>
  );
}
```

The four bugs you will find:

| # | What you see | Tool |
|---|---|---|
| 1 | Type `2` in a quantity box, press **+**, and the quantity becomes `21` | VS Code breakpoints, Variables, Watch, Call Stack |
| 2 | Apply the coupon `SAVE50` and nothing happens | VS Code exception breakpoints |
| 3 | **Reset quantities** does nothing, until you type somewhere else | React DevTools Components tab |
| 4 | Typing in the coupon box re-renders every cart row | React DevTools Profiler |

Try each one in the browser first, so you know what the bug looks like before you chase it.

---

### Part 1: VS Code Run and Debug

VS Code ships with a JavaScript debugger. **No extension is needed** (the old "Debugger for Chrome" extension is deprecated because it is now built in). VS Code starts Chrome, connects to it, and uses **source maps** to map the code the browser runs back to the files you wrote, so a breakpoint in `App.jsx` pauses the real app.

#### Step 1: create launch.json

1.  Open the **Run and Debug** view: the play-with-a-bug icon in the Activity Bar, or `Cmd+Shift+D` (macOS) / `Ctrl+Shift+D` (Windows, Linux).
2.  Click **create a launch.json file** and choose **Web App (Chrome)**.
3.  VS Code creates `.vscode/launch.json`. Change the `url` to your dev server's address:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

What each field means:

| Field | Meaning |
|---|---|
| `type` | Which debugger. `chrome` for Chrome, `msedge` for Edge |
| `request` | `launch` starts a new browser window. `attach` connects to a browser that is already running |
| `name` | The label shown in the dropdown at the top of the Run and Debug view |
| `url` | The page to open. It **must match the dev server's port** |
| `webRoot` | The folder on disk that the URL's root maps to. This is how VS Code matches `http://localhost:5173/src/App.jsx` to `src/App.jsx` on your machine |

Common dev server ports:

| Tool | Default URL |
|---|---|
| Vite | `http://localhost:5173` |
| Create React App | `http://localhost:3000` |
| Next.js | `http://localhost:3000` |

> [!WARNING]
> `webRoot` must point at the folder that contains the app's `src` and `index.html`. `${workspaceFolder}` is the folder you opened in VS Code. If you opened a **parent** folder and the app lives in a subfolder, set `"webRoot": "${workspaceFolder}/debug-cart"`. A wrong `webRoot` is the most common reason breakpoints do not work.

#### Step 2: start debugging

The debugger does **not** start your dev server. You need both running:

1.  In a terminal: `npm run dev`. Leave it running.
2.  In VS Code: press `F5` (or the green play button in Run and Debug).

A new Chrome window opens with the app, and a floating **debug toolbar** appears in VS Code. The status bar turns a different colour while a debug session is active.

#### Step 3: your first breakpoint (bug 1)

**The bug:** type `2` in the Keyboard quantity box, press **+**, and the box shows `21` instead of `3`.

In `App.jsx`, find this line inside `handleIncrement` and click in the **gutter** (the space to the left of the line number). A red dot appears. `F9` toggles a breakpoint on the current line too.

```jsx
      return { ...item, qty: item.qty + 1 };
```

Now, in the debug Chrome window, type `2` in the Keyboard box and press **+**. The page freezes, VS Code comes to the front, and the line is highlighted. **Execution is paused before this line runs.**

Look at the left side of the Run and Debug view. Each section tells you something different.

#### The Variables section

Variables are grouped by **scope**, closest first:

| Scope | What it holds here |
|---|---|
| **Local** | Variables of the function you are paused in: `item`, plus `this` |
| **Closure** | Variables this function captured from the functions around it: `id` from `handleIncrement`, and `cart` from `App` |
| **Module** | Top-level variables of the file: `COUPONS`, `INITIAL_CART` |
| **Global** | `window` and everything on it |

Expand **Local → item**:

```
item: {id: 1, name: 'Keyboard', price: 1500, qty: '2'}
  id: 1
  name: 'Keyboard'
  price: 1500
  qty: '2'
```

Look closely at `qty`. It has **quotes around it**. `price` is the number `1500`, but `qty` is the string `'2'`. That is the whole bug: `'2' + 1` is string concatenation, which gives `'21'`.

Other things you can do in Variables:

-   **Hover** over any variable in the editor to see its value in a popup.
-   **Double-click a value** (or right-click → **Set Value**) to change it while paused. Set `qty` to `2` without quotes, continue, and the app behaves correctly for this one run. This is a quick way to test a theory before writing a fix.
-   Right-click → **Copy Value**, or **Add to Watch**.

#### The Watch section

Watch evaluates **expressions you choose** every time the debugger pauses. Click the **+** in the Watch header and add these one at a time:

```
typeof item.qty
item.qty + 1
Number(item.qty) + 1
```

You will see:

```
typeof item.qty: 'string'
item.qty + 1: '21'
Number(item.qty) + 1: 3
```

Watch has confirmed the cause and tested the fix, and you have not edited any code yet.

#### The Debug Console

Open it with `Cmd+Shift+Y` / `Ctrl+Shift+Y`. While paused, it is a REPL that runs **inside the paused function**, so it can see every variable in scope:

```
> item.qty
'2'
> cart.map(i => typeof i.qty)
(3) ['string', 'number', 'number']
```

Only the row you typed in has a string quantity. So the string is coming from the `<input>`.

#### The Call Stack section

The call stack answers **"how did the code get here?"** The top frame is where you are paused. Each frame below it is the function that called the one above.

```
(anonymous)            App.jsx    ← the map callback, paused here
handleIncrement        App.jsx
onClick                App.jsx    ← the arrow function in CartRow
...                               ← React's event system (react-dom)
```

**Click a frame** to jump to it. The editor moves to that line and the Variables section switches to **that frame's** variables. Click `handleIncrement` and you see `id: 1` under Local. Click `onClick` and you see the `item` that the row was rendered with.

This is how you trace a bad value back to where it came from, one caller at a time. Here the stack only shows the click. The string was stored earlier, by `handleQtyChange`, so that is where the fix belongs.

The frames below yours belong to React. They are greyed out or collapsed if you skip library code (see **skipFiles** below).

#### The debug toolbar: stepping

| Button | Key | What it does |
|---|---|---|
| **Continue** | `F5` | Run until the next breakpoint |
| **Step Over** | `F10` | Run the current line and stop on the next one. Does not go inside function calls |
| **Step Into** | `F11` | If the line calls a function, go inside it |
| **Step Out** | `Shift+F11` | Finish the current function and stop in its caller |
| **Restart** | `Cmd+Shift+F5` / `Ctrl+Shift+F5` | Restart the debug session |
| **Stop** | `Shift+F5` | End the debug session |

Try it: press **Step Out** (`Shift+F11`) until you are back in `handleIncrement`, then **Step Over** (`F10`) until the highlight is on `setCart(next)`. Now hover over `next` and expand it. The first item has `qty: '21'`. You watched the wrong value get created.

Two more useful moves:

-   **Run to Cursor:** right-click a line → **Run to Cursor**. It is a one-time breakpoint.
-   **Restart Frame:** right-click a frame in the Call Stack → **Restart Frame** to run that function again from its first line.

**The fix for bug 1:** an `<input>` always gives you a string. Convert it where it enters your state.

```jsx
  const handleQtyChange = (id, value) => {
    const qty = Number(value) || 0;
    setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
  };
```

Save the file. Vite hot-reloads it and the debug session keeps running. Press `F5` to continue, then test again.

#### Other kinds of breakpoint

A plain breakpoint pauses every time. In a loop or a list that gets tiring fast. **Right-click the gutter** to see the other kinds.

**Conditional breakpoint** pauses only when an expression is true. Right-click the gutter → **Add Conditional Breakpoint**, and enter:

```
item.id === 3
```

Now clicking **+** on Keyboard or Mouse does not pause. Only Monitor does. You can also choose **Hit Count** from the same dropdown to pause on, say, the 5th hit only.

**Logpoint** prints a message to the Debug Console and **does not pause**. It is `console.log` without editing your code, and without the risk of committing it. Right-click the gutter on the `subtotal += ...` line in `calculateTotal` → **Add Logpoint**, and enter:

```
after {item.name}: subtotal = {subtotal}
```

Anything inside `{}` is evaluated. Every render now prints a line per item. A logpoint shows as a red diamond.

**Inline breakpoint** targets one call on a line that has several. Put the cursor on the part you want and press `Shift+F9`. Useful on one-liners such as `cart.map((item) => ...)`, where a normal breakpoint stops on the outer statement and not inside the callback.

**The `debugger` statement** is a breakpoint written in code. It pauses whenever a debugger is attached, in VS Code or in Chrome DevTools.

```jsx
const handleApplyCoupon = () => {
  debugger; // pauses here
  const coupon = COUPONS[code];
};
```

Remove it before you commit.

The **Breakpoints** section at the bottom of the Run and Debug view lists every breakpoint. Untick one to disable it without deleting it.

#### Exception breakpoints (bug 2)

**The bug:** type `SAVE50` in the coupon box and press **Apply**. Nothing happens. The total does not change and no message appears.

You do not know which line is failing, so there is nowhere to put a breakpoint. Let the debugger find the line for you. In the **Breakpoints** section, tick **Uncaught Exceptions**.

Press **Apply** again. VS Code pauses on the exact line that throws, with the error shown inline:

```jsx
    setDiscount(coupon.percent);
// TypeError: Cannot read properties of undefined (reading 'percent')
```

Variables shows `coupon: undefined`, and under Closure, `code: 'SAVE50'`. There is no `SAVE50` in `COUPONS`, so the lookup returned `undefined`. Try `save10` in lower case and you hit the same error for a second reason.

| Checkbox | Pauses on |
|---|---|
| **Uncaught Exceptions** | Errors that nothing catches. Start with this one |
| **Caught Exceptions** | Errors inside a `try/catch` too. Noisy, because libraries throw and catch internally, but it is what you need when an error is being swallowed |

> [!NOTE]
> An error thrown **while rendering** is caught by React itself, so it can reach an error boundary. If **Uncaught Exceptions** does not stop on a render error, tick **Caught Exceptions** as well.

**The fix for bug 2:** normalise the input and handle the missing case.

```jsx
  const handleApplyCoupon = () => {
    const coupon = COUPONS[code.trim().toUpperCase()];
    setDiscount(coupon ? coupon.percent : 0);
  };
```

#### skipFiles: stay out of React's internals

Press **Step Into** on a `setCart(...)` call and you land inside `react-dom`, which is rarely what you want. Tell the debugger to skip library code:

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome against localhost",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}",
  "skipFiles": ["**/node_modules/**"]
}
```

Stepping now passes over anything in `node_modules`, and those frames are greyed out in the Call Stack.

#### When breakpoints do not work

A breakpoint that turns into a **hollow grey circle** is **unbound**: VS Code could not match the file to anything the browser loaded.

| Symptom | Cause | Fix |
|---|---|---|
| Chrome opens a "site can't be reached" page | The dev server is not running, or the port in `url` is wrong | Run `npm run dev` and copy the URL it prints |
| Breakpoints are grey and hollow | `webRoot` does not point at the app folder | Point `webRoot` at the folder containing `src` |
| Breakpoints are grey until the page loads | The file has not been loaded yet | Normal. They bind once the browser loads the file |
| The breakpoint stops on the wrong line | You edited the file and the browser has an older version | Save, let hot reload finish, or reload the page |
| A breakpoint in a component body hits twice | `<StrictMode>` renders components twice in development | Expected. See [Strict Mode](/react/23-strict-mode/) |

If it still does not bind, open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **Debug: Diagnose Breakpoint Problems**. It lists the source maps the debugger found and how it tried to match your file.

#### One key press for the server and the browser

To start the dev server and the debugger together, add a second configuration. It runs `npm run dev` in a debug terminal, waits for Vite to print its `Local:` line, then opens Chrome with the debugger attached.

```json
{
  "type": "node-terminal",
  "request": "launch",
  "name": "Dev server + Chrome",
  "command": "npm run dev",
  "serverReadyAction": {
    "pattern": "Local:",
    "uriFormat": "http://localhost:5173",
    "action": "debugWithChrome",
    "webRoot": "${workspaceFolder}"
  }
}
```

Pick **Dev server + Chrome** in the dropdown and press `F5`.

#### React DevTools inside the debug browser

The Chrome window that VS Code launches uses **its own separate profile**, so your extensions are missing, including React DevTools. Install React DevTools once in that window from the Chrome Web Store. VS Code reuses the same profile on later runs, so it stays installed.

The alternative is to **attach** to a Chrome you started yourself:

```bash
# macOS. Chrome requires a separate --user-data-dir when remote debugging is on.
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

```json
{
  "type": "chrome",
  "request": "attach",
  "name": "Attach to Chrome",
  "port": 9222,
  "urlFilter": "http://localhost:5173/*",
  "webRoot": "${workspaceFolder}"
}
```

#### The same debugger in the browser

Chrome DevTools has the same debugger in its **Sources** panel: press `Cmd+P` / `Ctrl+P` to open `App.jsx`, click a line number to add a breakpoint, and use the **Scope**, **Watch** and **Call Stack** panes on the right. Everything in this part applies there too. VS Code's advantage is that you debug in the editor where you will write the fix.

---

### Part 2: React DevTools

#### Install and check

Install **React Developer Tools** from the Chrome Web Store (it is also available for Firefox and Edge). For Safari, or any browser without the extension, run the standalone app with `npx react-devtools` and follow the instructions it prints.

Open your app, then open the browser's DevTools (`Cmd+Option+I` / `F12`). There are two new tabs: **Components** and **Profiler**. If they are missing, the page is not running React, or the tabs are hidden behind the `»` overflow menu.

The extension's toolbar icon tells you which build of React the page is running: a development build or a production build. Component names and most of the features below need the **development** build, which is what `npm run dev` gives you.

#### The Components tab: the tree

The left pane is the **component tree**. It is the React equivalent of the Elements panel, and it shows **components** in place of DOM nodes:

```
App
  CartRow key="1"   Memo
  CartRow key="2"   Memo
  CartRow key="3"   Memo
```

Things to notice:

-   **`key`** is shown next to each list item. This is the fastest way to check for missing or duplicate keys.
-   **Badges** such as `Memo` and `ForwardRef` show how a component is wrapped. A component optimised by the React Compiler shows `Memo ✨`.
-   Plain DOM elements (`<li>`, `<input>`) are hidden by default.

Finding a component:

| How | What to do |
|---|---|
| **Element picker** | Click the arrow icon at the top left of the Components tab, then click anything on the page. DevTools selects the component that rendered it |
| **Search** | Type `CartRow` in the search box and press `Enter` to step through matches |
| **From the Elements panel** | Select a DOM node in Elements, then switch to Components. The matching component is selected |

#### The Components tab: the inspector

Select a `CartRow`. The right pane shows everything React knows about it:

```
props
  item: {id: 1, name: "Keyboard", price: 1500, qty: 1}
  onIncrement: ƒ handleIncrement() {}
  onQtyChange: ƒ handleQtyChange() {}

rendered by
  App
  createRoot()

source
  App.jsx:22
```

Now select `App`. It has no props, and its state lives in hooks:

```
hooks
  1 State: [{…}, {…}, {…}]
  2 State: ""
  3 State: 0
```

Hooks are listed **in the order they are called**, which is the same order React relies on (the reason for the [rules of hooks](/react/11-react-hooks/)). Click the **magic wand** icon next to the hooks heading to parse hook names. The list becomes `State(cart)`, `State(code)`, `State(discount)`.

Other hooks appear with their own labels: `Effect`, `Ref`, `Memo`, `Callback`, `Context`. A custom hook appears as a collapsible group named after the hook, with the hooks it uses nested inside. `useDebugValue` adds a label to that group.

#### Editing props and state live

Any value in the inspector can be edited, and React re-renders with it straight away.

1.  Select `App`.
2.  Double-click the value of the third State (`0`), type `50`, and press `Enter`.

The total on the page halves. You tested a 50% discount with no coupon and no code change. Use this to reach states that are awkward to reach by hand: an error state, an empty list, a long name that breaks the layout, a logged-in user.

You can edit props the same way. Select a `CartRow`, expand `item`, and change `qty`. The edit lasts until the parent next re-renders and passes the real prop again.

#### The inspector's toolbar

The icons at the top right of the inspector:

| Icon | What it does |
|---|---|
| **Stopwatch** | Force the selected component into its `Suspense` fallback, so you can check the loading UI |
| **Eye** | Jump to the matching DOM node in the Elements panel |
| **Bug** | Log the component's props, hooks and DOM nodes to the Console |
| **`<>`** | Open the component's source code |

A component inside an error boundary also gets a button that forces the boundary to show its fallback UI.

Two console tricks:

-   Select a component, switch to the Console, and type `$r`. It refers to the selected component, so `$r.props.item` prints that row's item.
-   Right-click any value in the inspector → **Store as global variable**. It becomes `$reactTemp0` in the Console, where you can call methods on it or copy it.

Right-click a function prop → **Go to definition** to jump to the handler's source.

#### Finding a mutation with the Components tab (bug 3)

**The bug:** set Keyboard's quantity to `5`, then click **Reset quantities**. Nothing changes on screen.

Did the click handler run at all? Check the state:

1.  Select `App` in the Components tab.
2.  Expand the first State (`cart`) and its first item.
3.  Click **Reset quantities** on the page.

The inspector shows `qty: 1` (reselect `App` if it has not refreshed), but **the page still shows 5**.

**State and screen disagree.** That is the signature of a **mutation**. The data changed, but React was never told, so it did not re-render:

```jsx
  const handleResetQuantities = () => {
    cart.forEach((item) => {
      item.qty = 1;       // ❌ mutates the objects already in state
    });
    setCart(cart);        // ❌ same array reference, so React skips the render
  };
```

`setCart(cart)` passes the **same array** React already has. React compares with `Object.is`, sees no change, and does nothing.

Now type one letter in the coupon box. The quantities suddenly jump to `1`. That keystroke re-rendered `App` for an unrelated reason, and the render picked up the mutated data. **A UI that corrects itself on the next unrelated update is the second sign of a mutation.**

**The fix for bug 3:** create new objects and a new array.

```jsx
  const handleResetQuantities = () => {
    setCart(cart.map((item) => ({ ...item, qty: 1 })));
  };
```

See [Use setState() correctly](/react/04-use-setstate-correctly/) for why state must be treated as immutable.

#### Seeing re-renders: Highlight updates

Open the DevTools settings (the **gear icon** in the Components tab) and turn on **Highlight updates when components render**.

Now type in the coupon box. Every component that re-renders **flashes with a coloured border**. You would expect only the coupon input area to flash. In this app, **all three cart rows flash on every keystroke**, even though `CartRow` is wrapped in `memo`. That is bug 4. The highlight tells you **that** it happens. The Profiler tells you **why**.

Other settings worth knowing:

| Setting | What it does |
|---|---|
| **Component filters** | Hide or show components by type or name, for example to show DOM elements, or to hide a noisy wrapper |
| **Hide logs during additional invocations in Strict Mode** | Silences the second, dimmed `console.log` from the Strict Mode double render |
| **Record why each component rendered while profiling** | Needed for the next section. It is in the Profiler settings |

#### The Profiler tab (bug 4)

The Profiler **records** a session and shows every render that happened during it.

**Before you start:** gear icon → **Profiler** → tick **Record why each component rendered while profiling**.

1.  Open the **Profiler** tab.
2.  Click the **record** button (the circle). It turns red.
3.  Type **one character** in the coupon box.
4.  Click the button again to stop.

React works in **commits**. A commit is one batch of changes applied to the DOM. The bar chart at the top right shows one bar per commit. A taller, more yellow bar took longer. Click a bar, or use the arrows, to move between commits. You typed one character, so you have one commit.

**Flamegraph view** shows the component tree for the selected commit:

```
App                 (rendered)
  CartRow key="1"   (rendered)
  CartRow key="2"   (rendered)
  CartRow key="3"   (rendered)
```

| Bar colour | Meaning |
|---|---|
| **Grey** | The component did **not** render in this commit |
| **Blue-green** | It rendered, and was fast |
| **Yellow** | It rendered, and was slow compared with the others |

The width of a bar is the time the component and its children took. All three `CartRow` bars are coloured, so all three rendered because of a keystroke that has nothing to do with them.

**Ranked view** lists the same commit's components **slowest first**. In a large app, look here first.

Now click a `CartRow` bar. The right pane shows:

```
Why did this render?
  Props changed: (onQtyChange, onIncrement)
```

There is the cause. `memo` skips a render only if **every prop is the same reference** as last time. `handleQtyChange` and `handleIncrement` are created fresh on every `App` render, so they are new functions each time and `memo` never gets to skip.

The reasons the Profiler can report:

| Reason | Meaning |
|---|---|
| **This is the first time the component rendered** | It mounted |
| **Props changed: (names)** | These props are different references from last time |
| **State changed** / **Hooks changed** | Its own state or a hook value changed. Hooks are listed by number, matching the order in the Components tab |
| **Context changed** | A context it reads has a new value |
| **The parent component rendered** | Nothing of its own changed. It rendered only because its parent did. `memo` fixes this case |

**The fix for bug 4:** give the handlers a stable identity with `useCallback`. They must not depend on `cart`, or they would change whenever the cart does, so use the **updater form** of `setCart`.

```jsx
  const handleQtyChange = useCallback((id, value) => {
    const qty = Number(value) || 0;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  }, []);

  const handleIncrement = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  }, []);
```

Record again and type one character. `App` is coloured and **all three `CartRow` bars are grey**. Then record a click on **+** for the Mouse row: only that one `CartRow` renders, because only its `item` prop is a new object.

See [Pure Component and React.memo](/react/18-pure-component-and-react-memo/) for the details of `memo` and `useCallback`.

> [!NOTE]
> Profile in development to find **which** components render and **why**. Do not trust the **timings**: the development build is much slower than production, and Strict Mode renders everything twice. For real timings, profile a production build.

The Profiler also has a **Timeline** view, which shows renders over time along with what scheduled them. And from React 19.2, the browser's own **Performance** panel shows React tracks next to network and paint activity.

---

### The fixed app

```jsx
// src/App.jsx
import { memo, useCallback, useState } from 'react';

const COUPONS = {
  SAVE10: { percent: 10 },
  SAVE20: { percent: 20 },
};

const INITIAL_CART = [
  { id: 1, name: 'Keyboard', price: 1500, qty: 1 },
  { id: 2, name: 'Mouse', price: 700, qty: 1 },
  { id: 3, name: 'Monitor', price: 9000, qty: 1 },
];

function calculateTotal(cart, discountPercent) {
  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.price * item.qty;
  }
  return subtotal - (subtotal * discountPercent) / 100;
}

const CartRow = memo(function CartRow({ item, onQtyChange, onIncrement }) {
  return (
    <li>
      {item.name} (₹{item.price}){' '}
      <input
        value={item.qty}
        onChange={(e) => onQtyChange(item.id, e.target.value)}
      />
      <button onClick={() => onIncrement(item.id)}>+</button>
    </li>
  );
});

export default function App() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Fix 1: an input gives a string, so convert it to a number.
  // Fix 4: useCallback + updater form keeps the function identity stable.
  const handleQtyChange = useCallback((id, value) => {
    const qty = Number(value) || 0;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  }, []);

  const handleIncrement = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  }, []);

  // Fix 2: normalise the code and handle an unknown coupon.
  const handleApplyCoupon = () => {
    const coupon = COUPONS[code.trim().toUpperCase()];
    setDiscount(coupon ? coupon.percent : 0);
  };

  // Fix 3: new objects and a new array, never a mutation.
  const handleResetQuantities = () => {
    setCart((prev) => prev.map((item) => ({ ...item, qty: 1 })));
  };

  return (
    <main>
      <h1>Cart</h1>
      <ul>
        {cart.map((item) => (
          <CartRow
            key={item.id}
            item={item}
            onQtyChange={handleQtyChange}
            onIncrement={handleIncrement}
          />
        ))}
      </ul>

      <button onClick={handleResetQuantities}>Reset quantities</button>

      <p>
        <input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Apply</button>
      </p>

      <h2>Total: ₹{calculateTotal(cart, discount)}</h2>
    </main>
  );
}
```

### A debugging workflow

1.  **Reproduce it.** Find the exact steps that trigger the bug every time.
2.  **Read the Console.** React's warnings and error stacks often name the component and the line.
3.  **Find the component.** Use the element picker in the Components tab on the part of the page that is wrong.
4.  **Compare data with screen.** Are the props and state what you expect?
    -   Data is wrong → find who set it. Put a breakpoint in the handler or the `setState` call and read the Call Stack.
    -   Data is right but the screen is wrong → the render logic is wrong, or state was mutated.
5.  **Step through the code** with breakpoints, Variables and Watch until you see the value go wrong.
6.  **For slowness, profile.** Record, find the components that should not have rendered, and read **Why did this render?**
7.  **Fix, then repeat the steps from 1** to confirm.

| Symptom | Likely cause | Where to look |
|---|---|---|
| The UI does not update after an action | State mutated, or the same reference passed to the setter | Components tab: state changed, screen did not |
| The UI updates one step late | Reading state straight after `setState` (state is a snapshot) | Breakpoint after the `setState` call |
| A handler uses an old value | Stale closure, or a missing effect dependency | Breakpoint in the handler, then the **Closure** scope |
| An effect runs on every render | A dependency is a new object or function each time | Profiler: **Hooks changed** |
| A `memo` component still renders | An unstable object, array or function prop | Profiler: **Props changed** |
| Everything runs twice in development | Strict Mode | [Strict Mode](/react/23-strict-mode/) |
| A blank page | An error thrown during render | Console, then exception breakpoints |

### Interview questions

```jsx
// Q1: How do you debug a React application?
// Answer: Reproduce the bug, then read the Console. Use React DevTools' Components tab to
// find the component and check its props, state and hooks. If the data is wrong, set
// breakpoints (VS Code or Chrome DevTools) and step through the handler, using the call stack
// to trace where the value came from. For performance problems, record with the Profiler.
```

```jsx
// Q2: How do you find out why a component re-rendered?
// Answer: Enable "Record why each component rendered while profiling" in React DevTools,
// record the interaction in the Profiler, select the component in the flamegraph and read
// "Why did this render?". It reports props changed, state or hooks changed, context changed,
// or that the parent rendered.
```

```jsx
// Q3: The state looks updated in React DevTools but the screen shows the old value. Why?
// Answer: The state was mutated in place. The data changed, but the setter received the same
// reference (or was never called), so React did not re-render. Fix it by creating a new
// object or array.
```

```jsx
// Q4: What do "url" and "webRoot" do in VS Code's launch.json?
// Answer: "url" is the page the debugger opens, so it must match the dev server's port.
// "webRoot" is the local folder that the URL's root maps to. VS Code uses it, with source
// maps, to match the browser's files to the files on disk. If it is wrong, breakpoints
// are unbound.
```

```jsx
// Q5: What is the difference between a conditional breakpoint and a logpoint?
// Answer: A conditional breakpoint pauses only when its expression is true. A logpoint never
// pauses. It prints a message to the Debug Console, like console.log without editing the code.
```

```jsx
// Q6: Step Over, Step Into, Step Out?
// Answer: Step Over runs the current line and stops on the next. Step Into enters the
// function called on the current line. Step Out finishes the current function and stops
// in its caller.
```

```jsx
// Q7: Why are Profiler timings in development not reliable?
// Answer: The development build includes extra checks and warnings, and Strict Mode renders
// components twice. Use development profiling to find what renders and why. Measure real
// timings on a production build.
```
