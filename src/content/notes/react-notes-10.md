---
title: "Form Handling"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 8
description: "React — controlled and uncontrolled components, inputs, select, checkboxes, multiple inputs, file inputs, and validation."
---
### Controlled components

In HTML, **form elements such as `<input>`, `<textarea>` and `<select>` keep their own state and update it based on user input. In React, changing data is kept in component state and only updated with `setState()` (or a `useState` setter).**

We combine the two by making React state the **"single source of truth"**. The component that renders the form also controls what happens in the form as the user types. **An input whose value is controlled by React this way is called a "controlled component".**

The pattern is always: **`value` comes from state + `onChange` updates state.**

#### Input tag

**Function component:**

```jsx
function NameForm() {
  const [value, setValue] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={e => setValue(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Class component:**

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Because every keystroke goes through state, you can **transform or validate** input as the user types:

```jsx
<input
  value={value}
  onChange={e => setValue(e.target.value.toUpperCase())} // always uppercase
/>
```

#### The textarea tag

In HTML, `<textarea>` sets its text as children. In React, it uses a **`value`** attribute, just like `<input>`.

```jsx
function EssayForm() {
  const [essay, setEssay] = useState('Please write an essay about your favorite DOM element.');
  return <textarea value={essay} onChange={e => setEssay(e.target.value)} />;
}
```

#### The select tag

In HTML, the selected option uses the `selected` attribute. In React, set **`value` on the `<select>`** instead.

```jsx
function FlavorForm() {
  const [flavor, setFlavor] = useState('coconut');

  function handleSubmit(event) {
    event.preventDefault();
    alert('Your favorite flavor is: ' + flavor);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pick your favorite flavor:
        <select value={flavor} onChange={e => setFlavor(e.target.value)}>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option value="coconut">Coconut</option>
          <option value="mango">Mango</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Multiple selection:** pass an array to `value` and add `multiple`:

```jsx
<select
  multiple
  value={selected}
  onChange={e => setSelected([...e.target.selectedOptions].map(o => o.value))}
>
  <option value="react">React</option>
  <option value="vue">Vue</option>
</select>
```

#### Checkbox and radio buttons

Checkboxes and radios use **`checked`** instead of `value`.

```jsx
function Preferences() {
  const [subscribed, setSubscribed] = useState(false);
  const [plan, setPlan] = useState('free');

  return (
    <form>
      <label>
        <input type="checkbox" checked={subscribed} onChange={e => setSubscribed(e.target.checked)} />
        Subscribe
      </label>

      <label>
        <input type="radio" name="plan" value="free" checked={plan === 'free'} onChange={e => setPlan(e.target.value)} />
        Free
      </label>
      <label>
        <input type="radio" name="plan" value="pro" checked={plan === 'pro'} onChange={e => setPlan(e.target.value)} />
        Pro
      </label>
    </form>
  );
}
```

### Handling multiple inputs (imp)

When you have many inputs, give each one a **`name`** attribute and use **one** handler that updates the matching state key.

**Function component:**

```jsx
function Reservation() {
  const [form, setForm] = useState({
    isGoing: true,
    numberOfGuests: 2,
    note: ''
  });

  function handleInputChange(event) {
    const { name, type, checked, value } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value   // computed property name
    }));
  }

  return (
    <form>
      <label>
        Is going:
        <input name="isGoing" type="checkbox" checked={form.isGoing} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Number of guests:
        <input name="numberOfGuests" type="number" value={form.numberOfGuests} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Note:
        <input name="note" value={form.note} onChange={handleInputChange} />
      </label>
      <pre>{JSON.stringify(form)}</pre>
    </form>
  );
}
```

**Class component:**

```jsx
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value   // setState merges, so other fields are kept
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input name="isGoing" type="checkbox" checked={this.state.isGoing} onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input name="numberOfGuests" type="number" value={this.state.numberOfGuests} onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

**Note:** `e.target.value` is always a **string**, even for `type="number"`. Convert it when you need a number: `Number(value)` or `e.target.valueAsNumber`.

#### Computed property names (ES2015) — imp

`[name]: value` uses a **computed property name**: the expression inside `[ ]` is evaluated and used as the key.

```jsx
let i = 0;
let a = {
  ['foo' + ++i]: i,
  ['foo' + ++i]: i,
  ['foo' + ++i]: i
};

console.log(a.foo1); // 1
console.log(a.foo2); // 2
console.log(a.foo3); // 3
```

```jsx
const items = ["A", "B", "C"];
const obj = {
  [items]: "Hello"   // the array is converted to the string "A,B,C"
};

console.log(obj);          // { "A,B,C": "Hello" }
console.log(obj["A,B,C"]); // "Hello"
```

```jsx
let param = 'size';
let config = {
  [param]: 12,
  ['mobile' + param.charAt(0).toUpperCase() + param.slice(1)]: 4
};

console.log(config); // { size: 12, mobileSize: 4 }
```

(See the JavaScript chapter **Data Types, Literals & Control Flow → Computed keys** for more.)

### Controlled input with null or undefined value

Setting `value` on a controlled input stops the user from changing it unless your `onChange` updates the state. If you set a `value` but the input is **still editable**, you may have accidentally set `value` to `undefined` or `null`, which React treats as **uncontrolled**.

The code below shows this: the input is locked at first, then becomes editable after a second.

```jsx
function Demo() {
  const [value, setValue] = useState('hi');

  useEffect(() => {
    setTimeout(() => setValue(null), 1000);
  }, []);

  return <input value={value} />; // no onChange
}
// 0–1 s: input shows "hi" and typing does nothing (controlled, value never changes)
// after 1 s: value is null → React treats it as uncontrolled → the user can type
```

It also causes this warning:

```
Warning: A component is changing a controlled input to be uncontrolled.
```

The reverse (starting with `undefined`, e.g. `useState()`, then setting a string) gives **"changing an uncontrolled input to be controlled"**. **Fix:** always initialize with an empty string: `useState('')`, and use `value={value ?? ''}` for data that may be missing.

**A `value` without `onChange`** makes a read-only field and triggers a warning: *"You provided a `value` prop to a form field without an `onChange` handler."* Add `onChange`, use `readOnly`, or use `defaultValue`.

### Uncontrolled components

In a **controlled** component, form data is handled by React state. The alternative is **uncontrolled** components, where form data is **handled by the DOM itself**. Instead of writing an event handler for every update, you read the value from the DOM when you need it, using a **ref**.

Use **`defaultValue`** (or `defaultChecked`) to set the initial value without controlling it.

```jsx
import { useRef } from 'react';

function NameForm() {
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" defaultValue="Bob" ref={inputRef} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Reading form values without refs (FormData):**

```jsx
function SignupForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data); // { email: "a@b.com", plan: "pro" }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <select name="plan" defaultValue="free">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <button>Sign up</button>
    </form>
  );
}
```

In **React 19**, a `<form>` can take a function as its `action`, which receives the `FormData` directly (see the **React 19** chapter).

#### The file input tag

In React, `<input type="file" />` is **always an uncontrolled component**, because its value can only be set by the user, not programmatically.

Use the **File API** to work with the files. The example below uses a ref to read the selected file in the submit handler.

**Function component:**

```jsx
function FileInput() {
  const fileInput = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const file = fileInput.current.files[0];
    alert(file ? `Selected file - ${file.name}` : 'No file selected');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" ref={fileInput} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Class component:**

```jsx
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

(You can also read files in `onChange`: `onChange={e => setFile(e.target.files[0])}`.)

### Controlled vs uncontrolled

| | Controlled | Uncontrolled |
| --- | --- | --- |
| Source of truth | React state | the DOM |
| Initial value | `value` / `checked` | `defaultValue` / `defaultChecked` |
| Reading the value | from state, any time | from a ref or `FormData`, when needed |
| Re-render on every keystroke | Yes | No |
| Instant validation / formatting | Easy | Harder |
| Disable submit until valid, dependent fields | Easy | Harder |
| Code | more (a handler per field or a shared handler) | less |
| Good for | most forms, dynamic UI | simple forms, file inputs, integrating non-React code, very large forms |

Form libraries like **React Hook Form** use uncontrolled inputs with refs for performance, while **Formik** uses controlled inputs.

### Simple validation example

```jsx
function LoginForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});

  const errors = {};                                   // derived — not state
  if (!values.email.includes('@')) errors.email = 'Enter a valid email';
  if (values.password.length < 8) errors.password = 'At least 8 characters';
  const isValid = Object.keys(errors).length === 0;

  const handleChange = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));

  return (
    <form onSubmit={e => { e.preventDefault(); console.log('submit', values); }}>
      <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
      {touched.email && errors.email && <p className="error">{errors.email}</p>}

      <input name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
      {touched.password && errors.password && <p className="error">{errors.password}</p>}

      <button disabled={!isValid}>Log in</button>
    </form>
  );
}
```

### Interview questions

```jsx
// Q1: Why can't the user type in this input?
function App() {
  const [name, setName] = useState('');
  return <input value={name} />;
}
// Answer: it's controlled (value comes from state) but there's no onChange, so state never
// changes and React keeps resetting the input to ''. Add onChange={e => setName(e.target.value)}.
```

```jsx
// Q2: What warning appears when typing, and why?
function App() {
  const [name, setName] = useState();
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
// Answer: "A component is changing an uncontrolled input to be controlled." The initial value is
// undefined (uncontrolled), then becomes a string. Initialize with useState('').
```

```jsx
// Q3: What is logged when the user types 5 in this input?
<input type="number" onChange={e => console.log(typeof e.target.value)} />
// Answer: "string" — input values are always strings. Use Number() or e.target.valueAsNumber.
```

```jsx
// Q4: Using one handler for many inputs, why is the other field lost?
const [form, setForm] = useState({ email: '', name: '' });
const onChange = e => setForm({ [e.target.name]: e.target.value });
// Answer: the useState setter replaces the object (unlike class setState, which merges).
// Use setForm(prev => ({ ...prev, [e.target.name]: e.target.value })).
```

```jsx
// Q5: Can you set the value of a file input from React?
// Answer: No. <input type="file" /> is always uncontrolled for security reasons — only the user
// can choose files. You can only clear it (e.g. inputRef.current.value = '').
```
