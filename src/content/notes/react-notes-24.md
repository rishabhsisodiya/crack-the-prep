---
title: "Typechecking With PropTypes"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 22
description: "React — prop-types validators, required props, defaultProps, and typing props with TypeScript."
---
### PropTypes

**React 19 note:** `propTypes` checks were **removed from React 19** — React no longer validates them (they're silently ignored). They still work in React 18 and earlier, and you'll see them in many codebases. **For new projects, use TypeScript**, shown at the end of this chapter.

`React.PropTypes` moved into a separate package in **React v15.5**. Use the **`prop-types`** library instead (a codemod script was provided to convert old code).

```bash
npm i prop-types
```

As your app grows, you can catch many bugs with **typechecking**. For some apps you can use JavaScript extensions like **Flow** or **TypeScript** to typecheck the whole app. But even without those, React (before v19) had built-in typechecking for props. To typecheck a component's props, assign the special **`propTypes`** property:

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

**Function component:**

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` exports a range of **validators** that check the data you receive. Here we use `PropTypes.string`. When an invalid value is passed, **a warning is shown in the JavaScript console** — it doesn't throw or stop rendering.

```jsx
<Greeting name={42} />
// Warning: Failed prop type: Invalid prop `name` of type `number` supplied to `Greeting`, expected `string`.
```

For performance reasons, **`propTypes` are only checked in development mode**.

### Available validators

```jsx
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // A React element type (i.e. MyComponent).
  optionalElementType: PropTypes.elementType,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A required value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function (props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

**`shape` vs `exact`:** `shape` allows extra properties; `exact` warns if the object has properties not listed.

**`element` vs `node` vs `elementType`:**

| Validator | Accepts | Example |
| --- | --- | --- |
| `PropTypes.node` | anything renderable (string, number, element, array, fragment, null) | `children` of a layout |
| `PropTypes.element` | a single React **element** | `icon={<StarIcon />}` |
| `PropTypes.elementType` | a component **type** (not rendered) | `as={Link}` or `as="button"` |

### A real example

```jsx
import PropTypes from 'prop-types';

function UserCard({ user, size, onSelect, children }) {
  return (
    <div className={`card card--${size}`} onClick={() => onSelect(user.id)}>
      <h2>{user.name}</h2>
      {user.email && <p>{user.email}</p>}
      {children}
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.node
};

<UserCard user={{ id: 1, name: 'Asha' }} size="xl" />
// Warnings:
// Invalid prop `size` of value `xl` supplied to `UserCard`, expected one of ["sm","md","lg"].
// The prop `onSelect` is marked as required in `UserCard`, but its value is `undefined`.
```

### Requiring a single child

With `PropTypes.element`, you can require that **exactly one element** is passed as children:

```jsx
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return <div>{children}</div>;
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};

<MyComponent><span>One</span></MyComponent>            // ✅
<MyComponent><span>One</span><span>Two</span></MyComponent> // ⚠️ warning — two children
```

### Default prop values

You can set default values for props by assigning the special **`defaultProps`** property:

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
createRoot(document.getElementById('example')).render(<Greeting />);
```

You can also declare `defaultProps` as a **static class field**. (This used to need a Babel plugin like `transform-class-properties`; class fields are now standard JavaScript.)

```jsx
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  };

  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}
```

`defaultProps` makes sure `this.props.name` has a value if the parent didn't pass one. **`propTypes` checking happens after `defaultProps` are applied**, so default values are typechecked too.

**Defaults are used only for `undefined`**, not `null`:

```jsx
<Greeting />             // Hello, Stranger
<Greeting name={undefined} /> // Hello, Stranger
<Greeting name={null} /> // Hello,   — null is kept
```

**Function components:** use **default parameters** instead. `defaultProps` for function components was deprecated in React 18.3 and **removed in React 19**:

```jsx
function Greeting({ name = 'Stranger' }) {
  return <h1>Hello, {name}</h1>;
}
```

### TypeScript (the modern way)

TypeScript checks props **at compile time** in your editor and build — errors appear **before** the code runs, not as console warnings.

```tsx
type UserCardProps = {
  user: { id: number; name: string; email?: string };
  size?: 'sm' | 'md' | 'lg';
  onSelect: (id: number) => void;
  children?: React.ReactNode;
};

function UserCard({ user, size = 'md', onSelect, children }: UserCardProps) {
  return (
    <div className={`card card--${size}`} onClick={() => onSelect(user.id)}>
      <h2>{user.name}</h2>
      {children}
    </div>
  );
}

<UserCard user={{ id: 1, name: 'Asha' }} size="xl" />
// ❌ Type '"xl"' is not assignable to type '"sm" | "md" | "lg"'.
// ❌ Property 'onSelect' is missing.
```

| | PropTypes | TypeScript |
| --- | --- | --- |
| When it checks | runtime, development only | compile time (editor, build) |
| Output on error | console warning | type error, build fails |
| Checks data from APIs at runtime | Yes (props only) | No (use Zod or similar) |
| Editor autocomplete | No | Yes |
| React 19 support | not checked by React | fully supported |

### Interview questions

```jsx
// Q1: What happens?
Greeting.propTypes = { age: PropTypes.number.isRequired };
<Greeting age="25" />
// Answer (React ≤ 18, development): the component still renders, and the console warns
// "Invalid prop `age` of type `string` supplied to `Greeting`, expected `number`".
// Production: no check.
```

```jsx
// Q2: Is propTypes checked in production?
// Answer: No — only in development builds.
```

```jsx
// Q3: What renders?
function Hello({ name = 'Guest' }) { return <p>Hi {name}</p>; }
<Hello name={null} />
// Answer: "Hi " — defaults apply only when the value is undefined.
```

```jsx
// Q4: Which validator for a prop like as={Link}?
// Answer: PropTypes.elementType — it's a component type, not a rendered element.
```
