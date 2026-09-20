---
title: "React-Redux"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 27
description: "React-Redux — Provider, connect with mapStateToProps/mapDispatchToProps, useSelector and useDispatch hooks, multiple reducers, middleware, DevTools, and Redux Toolkit."
---
**React-Redux** is the official binding library that connects Redux to React components. This chapter builds the cake shop example from the **Redux (core concepts)** chapter into a real React app.

<div class="callout callout--important" data-label="Modern Redux">

This chapter shows **classic React-Redux** (`createStore`, `connect`). New apps should use **Redux Toolkit** with the **hooks API** (`useSelector`, `useDispatch`) — see the last section. `connect` still works and appears in most existing codebases, which is why it's covered here.

</div>

### Setup a basic Redux app

Create a new React project (with Vite or `create-react-app`), then install Redux and React-Redux:

```bash
npm install redux react-redux
```

Create a `components` folder under `src`, and inside it create **CakeContainer.js**.

#### CakeContainer.js

```jsx
const CakeContainer = () => {
  return (
    <div>
      <h1>Number of cakes</h1>
      <button>Buy Cake</button>
    </div>
  );
};

export default CakeContainer;
```

#### App.js

```jsx
import CakeContainer from './components/CakeContainer';

const App = () => {
  return (
    <div>
      <CakeContainer />
    </div>
  );
};

export default App;
```

### Actions

Create `redux/cakes/cakeTypes.js` and `redux/cakes/cakeActions.js` under `src`.

#### cakeTypes.js

```jsx
export const BUY_CAKE = 'BUY_CAKE';
```

Now import the action type and use it in the action creator.

#### cakeActions.js

```jsx
import { BUY_CAKE } from './cakeTypes';

export const buyCake = () => {
  return {
    type: BUY_CAKE
  };
};
```

**Why a separate types file?** The same constant is used in the action creator and the reducer. Importing it from one place means a typo becomes an import error instead of a silent bug (a misspelled string just falls through to `default`).

### Reducers

#### cakeReducer.js

```jsx
import { BUY_CAKE } from "./cakeTypes";

const initialState = {
  numOfCakes: 10
};

const cakeReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return {
        ...state,
        numOfCakes: state.numOfCakes - 1
      };
    default:
      return state;
  }
};

export default cakeReducer;
```

### Store

Create `store.js` under `src/redux`.

#### store.js

```jsx
import { createStore } from "redux";
import cakeReducer from "./cakes/cakeReducer";

const store = createStore(cakeReducer);

export default store;
```

### Connect Redux and React

Wrap the app in **`<Provider>`** so every component can reach the store.

#### App.js

```jsx
import CakeContainer from "./components/CakeContainer";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CakeContainer />
      </div>
    </Provider>
  );
};

export default App;
```

`Provider` uses React context internally to make the store available to all components below it.

#### CakeContainer.js

```jsx
import { buyCake } from "../redux/cakes/cakeActions";
import { connect } from "react-redux";

const CakeContainer = (props) => {
  return (
    <div>
      <h1>Number of cakes: {props.numOfCakes}</h1>
      <button onClick={props.buyCake}>Buy Cake</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    numOfCakes: state.numOfCakes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buyCake: () => dispatch(buyCake()),
  };
};

// Connect the two functions above to react-redux
export default connect(mapStateToProps, mapDispatchToProps)(CakeContainer);
```

Go to the terminal and run: **`npm start`** (or `npm run dev` with Vite).

**Output:** "Number of cakes: 10" and a button. Each click decreases the number by one.

#### Let's dive into the code above and understand it

The code below is for **selectors**. **Selectors** return state information from Redux. You can create a separate file if your code becomes more complex — here it's simple, so we don't.

```jsx
const mapStateToProps = (state) => {
  return {
    numOfCakes: state.numOfCakes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buyCake: () => dispatch(buyCake()),
  };
};
```

You can use any names, but these are the React-Redux conventions. **`mapStateToProps`** reads the Redux state, and **`mapDispatchToProps`** dispatches actions. Both arrow functions return objects — containing `numOfCakes` and the `buyCake` method — and those become **props** of the component:

```jsx
<h1>Number of cakes: {props.numOfCakes}</h1>
<button onClick={props.buyCake}>Buy Cake</button>
```

`buyCake` here is an arrow function that calls `dispatch` and passes the `buyCake` **action creator**, which returns the action object.

All of this is made possible by **`connect()`**, which connects `mapStateToProps` and `mapDispatchToProps` to Redux:

```jsx
export default connect(mapStateToProps, mapDispatchToProps)(CakeContainer);
```

`connect` is a **higher-order component** — it wraps your component and injects the props (see the **Higher order component** chapter).

**Shorthand for `mapDispatchToProps`:** pass an object of action creators and React-Redux wraps each one in `dispatch` for you:

```jsx
export default connect(mapStateToProps, { buyCake })(CakeContainer);
```

### React-Redux with hooks

Hooks replace `connect` with two simple hooks and no wrapper component.

#### useSelector hook

```jsx
import { useSelector } from "react-redux";

const HooksCakeContainer = () => {
  const numOfCakes = useSelector(state => state.numOfCakes);

  return (
    <div>
      <h1>Number of cakes: {numOfCakes}</h1>
      <button>Buy Cake</button>
    </div>
  );
};

export default HooksCakeContainer;
```

#### App.js

```jsx
import CakeContainer from "./components/CakeContainer";
import HooksCakeContainer from "./components/HooksCakeContainer";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CakeContainer />
        <HooksCakeContainer />
      </div>
    </Provider>
  );
};

export default App;
```

#### useDispatch hook

```jsx
import { useDispatch, useSelector } from "react-redux";
import { buyCake } from "../redux/cakes/cakeActions";

const HooksCakeContainer = () => {
  const numOfCakes = useSelector(state => state.numOfCakes);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Number of cakes: {numOfCakes}</h1>
      <button onClick={() => dispatch(buyCake())}>Buy Cake</button>
    </div>
  );
};

export default HooksCakeContainer;
```

Much less code than `connect` — no `mapStateToProps`, no `mapDispatchToProps`, no HOC.

**Select the smallest value you need.** `useSelector` re-renders the component whenever the **selected value** changes (compared with `===`):

```jsx
// ❌ A new object every time → re-renders on every dispatch
const { numOfCakes, numOfIceCreams } = useSelector(state => ({
  numOfCakes: state.cake.numOfCakes,
  numOfIceCreams: state.iceCream.numOfIceCreams
}));

// ✅ Separate primitive selections
const numOfCakes = useSelector(state => state.cake.numOfCakes);
const numOfIceCreams = useSelector(state => state.iceCream.numOfIceCreams);

// ✅ Or use the shallowEqual comparison function
import { shallowEqual } from 'react-redux';
const values = useSelector(selectBoth, shallowEqual);
```

### Usage warnings with hooks

#### Stale props and "zombie children"

Specifically, **"stale props"** means any case where:

-   a selector function relies on this component's props to extract data,
-   a parent component would re-render and pass down new props as a result of an action,
-   but this component's selector function executes **before** this component has re-rendered with those new props.

**"Zombie child"** refers specifically to the case where:

-   Multiple nested connected components are mounted in a first pass, causing a **child** component to subscribe to the store **before its parent**.
-   An action is dispatched that **deletes data** from the store, such as a todo item.
-   The parent component would stop rendering that child as a result.
-   However, because the child subscribed first, **its subscription runs before the parent stops rendering it**. When it reads a value from the store based on props, that data no longer exists — and if the extraction logic isn't careful, this may throw an error.

**Defensive selector:**

```jsx
const todo = useSelector(state => state.todos.find(t => t.id === props.id));
if (!todo) return null;                  // the item may already be deleted
```

#### Performance

By default, `useSelector()` does a **reference equality (`===`) comparison** of the selected value after an action is dispatched, and only re-renders the component if the selected value changed. However, unlike `connect()`, **`useSelector()` does not prevent the component from re-rendering when its parent re-renders**, even if its props didn't change. If further performance optimization is needed, wrap the component in **`React.memo()`**.

### Multiple reducers

Create the same structure we did for cake. Create an `iceCreams` folder under `redux` with these files:

#### iceCreamTypes.js

```jsx
export const BUY_ICECREAM = 'BUY_ICECREAM';
```

#### iceCreamActions.js

```jsx
import { BUY_ICECREAM } from './iceCreamTypes';

export const buyIceCream = () => {
  return {
    type: BUY_ICECREAM
  };
};
```

#### iceCreamReducer.js

```jsx
import { BUY_ICECREAM } from "./iceCreamTypes";

const initialState = {
  numOfIceCreams: 20
};

const iceCreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams - 1
      };
    default:
      return state;
  }
};

export default iceCreamReducer;
```

#### rootReducer.js

```jsx
import { combineReducers } from "redux";
import cakeReducer from "./cakes/cakeReducer";
import iceCreamReducer from "./iceCreams/iceCreamReducer";

const rootReducer = combineReducers({
  cake: cakeReducer,
  iceCream: iceCreamReducer
});

export default rootReducer;
```

#### Use the new rootReducer in our store

**store.js**

```jsx
import { createStore } from "redux";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer);

export default store;
```

#### IceCreamContainer.js

```jsx
import { useDispatch, useSelector } from "react-redux";
import { buyIceCream } from "../redux/iceCreams/iceCreamActions";

const IceCreamContainer = () => {
  const numOfIceCreams = useSelector(state => state.iceCream.numOfIceCreams);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Number of ice creams: {numOfIceCreams}</h1>
      <button onClick={() => dispatch(buyIceCream())}>Buy Ice Cream</button>
    </div>
  );
};

export default IceCreamContainer;
```

**Important:** now that reducers are combined, the state is **nested**. Every selector must be updated:

```jsx
// Before combineReducers
const numOfCakes = useSelector(state => state.numOfCakes);

// After combineReducers
const numOfCakes = useSelector(state => state.cake.numOfCakes);
```

The same applies to `mapStateToProps` in `CakeContainer.js`:

```jsx
const mapStateToProps = (state) => {
  return {
    numOfCakes: state.cake.numOfCakes,
  };
};
```

#### App.js

```jsx
import CakeContainer from "./components/CakeContainer";
import IceCreamContainer from "./components/IceCreamContainer";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CakeContainer />
        <IceCreamContainer />
      </div>
    </Provider>
  );
};

export default App;
```

### Logger middleware

Install redux-logger:

```bash
npm install redux-logger
```

#### store.js

```jsx
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(logger));

export default store;
```

Every dispatched action now logs the previous state, the action and the next state in the console.

**Tip:** only add the logger in development:

```jsx
const middleware = process.env.NODE_ENV === 'development' ? [logger] : [];
const store = createStore(rootReducer, applyMiddleware(...middleware));
```

### Redux DevTools extension

Install the Redux DevTools extension for your browser, and the package:

```bash
npm install redux-devtools-extension
```

#### store.js

```jsx
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import logger from "redux-logger";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);

export default store;
```

With DevTools you can inspect the state tree, see every dispatched action, and **time travel** — jump back to any earlier state.

**With Redux Toolkit, DevTools are enabled automatically** — no extra package or setup.

### connect vs hooks

| | `connect` (HOC) | `useSelector` / `useDispatch` |
| --- | --- | --- |
| Code needed | `mapStateToProps` + `mapDispatchToProps` + HOC | two hook calls |
| Component tree | adds a wrapper component | no wrapper |
| Works with class components | Yes | No (hooks only) |
| Blocks re-renders from the parent | Yes (it's memoized) | No — add `React.memo` yourself |
| TypeScript | more types to write | simpler |
| Status | still supported, used in older code | recommended |

### The same app with Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

**redux/cakeSlice.js** — types, action creators and reducer in one file:

```jsx
import { createSlice } from '@reduxjs/toolkit';

const cakeSlice = createSlice({
  name: 'cake',
  initialState: { numOfCakes: 10 },
  reducers: {
    buyCake: (state) => { state.numOfCakes--; },
    restock: (state, action) => { state.numOfCakes += action.payload; }
  }
});

export const { buyCake, restock } = cakeSlice.actions;
export default cakeSlice.reducer;
```

**redux/store.js**

```jsx
import { configureStore } from '@reduxjs/toolkit';
import cakeReducer from './cakeSlice';
import iceCreamReducer from './iceCreamSlice';

export const store = configureStore({
  reducer: {
    cake: cakeReducer,
    iceCream: iceCreamReducer
  }
});
// combineReducers, thunk middleware and DevTools are all set up automatically
```

**CakeContainer.js**

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { buyCake } from '../redux/cakeSlice';

export default function CakeContainer() {
  const numOfCakes = useSelector(state => state.cake.numOfCakes);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Number of cakes: {numOfCakes}</h1>
      <button onClick={() => dispatch(buyCake())}>Buy Cake</button>
    </div>
  );
}
```

That replaces `cakeTypes.js`, `cakeActions.js`, `cakeReducer.js`, `rootReducer.js` and the middleware setup.

### Interview questions

```jsx
// Q1: Why does this component re-render on every dispatch?
const { a, b } = useSelector(state => ({ a: state.a, b: state.b }));
// Answer: the selector returns a NEW object each time, so the === check always fails.
// Select values separately, or pass shallowEqual as the second argument.
```

```jsx
// Q2: What error appears without <Provider>?
// Answer: "could not find react-redux context value; please ensure the component is wrapped
// in a <Provider>".
```

```jsx
// Q3: After adding combineReducers, state.numOfCakes is undefined. Why?
// Answer: the state is now nested under the slice name — use state.cake.numOfCakes.
```

```jsx
// Q4: Does useSelector stop a re-render caused by the parent?
// Answer: No. Unlike connect, it only controls re-renders caused by store changes.
// Wrap the component in React.memo if needed.
```

```jsx
// Q5: Where should async API calls live in Redux?
// Answer: not in reducers (they must be pure) and preferably not in components —
// in a thunk (redux-thunk / createAsyncThunk) or in RTK Query.
```
