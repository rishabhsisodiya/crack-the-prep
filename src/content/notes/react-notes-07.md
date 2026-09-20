---
title: "Conditional Rendering"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 6
description: "React — if/else, element variables, &&, ternary, returning null, and conditional rendering pitfalls."
---
Conditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like **`if`** or the **conditional (ternary) operator** to create elements representing the current state, and let React update the UI to match.

### if / else with element variables

You can store elements in a variable and decide which one to render.

**Function component:**

```jsx
function LoginButton({ onClick }) {
  return <button onClick={onClick}>Login</button>;
}

function LogoutButton({ onClick }) {
  return <button onClick={onClick}>Logout</button>;
}

function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign up.</h1>;
}

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let button;
  if (isLoggedIn) {
    button = <LogoutButton onClick={() => setIsLoggedIn(false)} />;
  } else {
    button = <LoginButton onClick={() => setIsLoggedIn(true)} />;
  }

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </div>
  );
}
```

**Class component version:**

```jsx
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}
```

**Rendering it:**

```jsx
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(<LoginControl />);
```

### Inline if with the logical && operator

```jsx
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
root.render(<Mailbox unreadMessages={messages} />);
// Hello!
// You have 3 unread messages.
```

This works because in JavaScript, `true && expression` evaluates to `expression`, and `false && expression` evaluates to `false`.

So if the condition is true, the element after `&&` is rendered. If it's false, React ignores it (`false`, `null` and `undefined` render nothing).

**Note: a falsy value that isn't a boolean is still rendered.** If the left side is `0` or `NaN`, `&&` returns that value, and React renders it.

```jsx
function Inbox({ count }) {
  return (
    <div>
      {count && <h1>Messages: {count}</h1>}
    </div>
  );
}

<Inbox count={0} />   // renders <div>0</div> — not empty!
```

**Fixes:** compare explicitly, convert to a boolean, or use a ternary.

```jsx
{count > 0 && <h1>Messages: {count}</h1>}
{!!count && <h1>Messages: {count}</h1>}
{count ? <h1>Messages: {count}</h1> : null}
```

### Inline if-else with the conditional operator

Another way to render conditionally inline is the ternary operator `condition ? valueIfTrue : valueIfFalse`.

A small block of text:

```jsx
function Status({ isLoggedIn }) {
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Whole elements:

```jsx
function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={() => setIsLoggedIn(false)} />
        : <LoginButton onClick={() => setIsLoggedIn(true)} />}
    </div>
  );
}
```

Avoid deeply nested ternaries — they get hard to read. Extract a variable, a helper function, or a separate component instead.

### Preventing a component from rendering (return null)

A component can hide itself by returning **`null`**. Its hooks and lifecycle still run as normal.

```jsx
function WarningBanner({ warn }) {
  if (!warn) {
    return null;
  }
  return <div className="warning">Warning!</div>;
}

function Page() {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div>
      <WarningBanner warn={showWarning} />
      <button onClick={() => setShowWarning(s => !s)}>
        {showWarning ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
```

### Early returns for loading and error states

A very common real-world pattern:

```jsx
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Spinner />;
  if (error) return <p className="error">Failed to load: {error.message}</p>;
  if (!user) return <p>No user found.</p>;

  return <h1>{user.name}</h1>;
}
```

**Careful:** hooks must be called **before** any early return, and in the same order on every render.

```jsx
function Bad({ user }) {
  if (!user) return null;
  const [open, setOpen] = useState(false); // ❌ hook after an early return — breaks the Rules of Hooks
}
```

### Object lookup instead of switch

For many cases, map values to components:

```jsx
const icons = {
  success: <CheckIcon />,
  warning: <AlertIcon />,
  error: <XIcon />
};

function StatusIcon({ status }) {
  return icons[status] ?? <InfoIcon />;
}

// or with switch
function StatusText({ status }) {
  switch (status) {
    case 'success': return <p>Done!</p>;
    case 'error':   return <p>Something went wrong.</p>;
    default:        return <p>Working…</p>;
  }
}
```

### Showing/hiding vs mounting/unmounting

```jsx
{isOpen && <Modal />}                       // unmounts: Modal's state is reset when hidden
<Modal style={{ display: isOpen ? 'block' : 'none' }} /> // stays mounted: state is kept
```

Conditional rendering **removes** the component from the tree, so its state is lost and effects clean up. Hiding it with CSS keeps it mounted.

**Same position, different condition — state is kept:**

```jsx
{isAdmin ? <Counter label="admin" /> : <Counter label="user" />}
// Both branches render <Counter> in the same position, so React keeps the SAME state.
// Add different keys to reset it:
{isAdmin ? <Counter key="admin" /> : <Counter key="user" />}
```

### Interview questions

```jsx
// Q1: What renders when items is []?
function List({ items }) {
  return <div>{items.length && <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>}</div>;
}
// Answer: <div>0</div>. Use items.length > 0 &&.
```

```jsx
// Q2: What renders?
function App() {
  const user = null;
  return <p>{user && user.name}</p>;
}
// Answer: <p></p> — user && ... returns null, which renders nothing. (Or use user?.name.)
```

```jsx
// Q3: Does returning null unmount the component?
// Answer: No. The component is still mounted — its state is kept and its effects still run.
// It just renders nothing. The PARENT not rendering it ({show && <X />}) is what unmounts it.
```

```jsx
// Q4: You toggle between these. Does the input keep its typed text?
{isEditing ? <input placeholder="Edit name" /> : <input placeholder="Search" />}
// Answer: Yes. Same element type in the same position → React reuses the same DOM input.
// Give them different keys if the text should reset.
```
