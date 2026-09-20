---
title: "React Router"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 21
description: "React Router v7 — setup, routes, nested/layout/index routes, dynamic and optional segments, navigation, URL values, protected routes, 404s, and v5 vs v6+ differences."
---
### What is client-side routing?

In a traditional website, every link click asks the server for a **new HTML page**. In a **single-page application (SPA)**, React Router **changes the URL and renders the matching components in the browser**, without a full page reload. This is faster and keeps app state (like a playing video or form data) alive.

React Router is the most popular routing library for React. This chapter uses **React Router v7** (declarative mode), which has the same component API as v6. In v7, everything is imported from the **`react-router`** package (v6 used `react-router-dom`, which still works as a re-export).

### Installation and setup

```bash
npm i react-router
```

Then render a **`<BrowserRouter>`** around your application:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

`BrowserRouter` uses the browser's **History API** for clean URLs (`/about`). The server must return `index.html` for all routes (see `historyApiFallback` in **Intro to React**). `HashRouter` (`/#/about`) works without server config but is rarely used today.

### Configuring routes

Routes are configured by rendering **`<Routes>`** and **`<Route>`**, which connect URL segments to UI elements.

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
```

`<Routes>` looks at all its child routes and renders the **best match** (not simply the first match, as v5's `Switch` did).

Here's a larger sample config:

```jsx
<Routes>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />

  <Route element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>

  <Route path="concerts">
    <Route index element={<ConcertsHome />} />
    <Route path=":city" element={<City />} />
    <Route path="trending" element={<Trending />} />
  </Route>
</Routes>
```

| URL | Renders |
| --- | --- |
| `/` | `Home` |
| `/about` | `About` |
| `/login` | `AuthLayout` → `Login` |
| `/concerts` | `ConcertsHome` |
| `/concerts/pune` | `City` (city = "pune") |
| `/concerts/trending` | `Trending` (static segment wins over `:city`) |

### Nested routes

```jsx
<Routes>
  <Route path="dashboard" element={<Dashboard />}>
    <Route index element={<Home />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

The parent's path is **automatically included** in the child, so this config creates both **"/dashboard"** and **"/dashboard/settings"** URLs.

Child routes are rendered through the **`<Outlet />`** in the parent route:

```jsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* will either be <Home /> or <Settings /> */}
      <Outlet />
    </div>
  );
}
```

At `/dashboard/settings` the page shows the `Dashboard` heading **and** `Settings` below it. Without `<Outlet />`, child routes wouldn't appear.

### Layout routes

Routes **without a `path`** create new nesting for their children, but **don't add any segments to the URL**. They're used to share a layout (header, sidebar) across pages.

```jsx
<Routes>
  <Route element={<MarketingLayout />}>
    <Route index element={<MarketingHome />} />
    <Route path="contact" element={<Contact />} />
  </Route>

  <Route path="projects">
    <Route index element={<ProjectsHome />} />
    <Route element={<ProjectsLayout />}>
      <Route path=":pid" element={<Project />} />
      <Route path=":pid/edit" element={<EditProject />} />
    </Route>
  </Route>
</Routes>
```

```jsx
function MarketingLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  );
}
// "/" and "/contact" both get the Navbar and Footer.
```

### Index routes

**Index routes** render into their parent's `<Outlet />` **at the parent's URL** (like a default child route). They use the **`index`** prop:

```jsx
<Routes>
  <Route path="/" element={<Root />}>
    {/* renders into the outlet in <Root> at "/" */}
    <Route index element={<Home />} />

    <Route path="dashboard" element={<Dashboard />}>
      {/* renders into the outlet in <Dashboard> at "/dashboard" */}
      <Route index element={<DashboardHome />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Route>
</Routes>
```

Note that **index routes can't have children**. If you want that, you probably need a **layout route**.

### Route prefixes

A **`<Route path>` without an `element`** adds a path prefix to its child routes, **without** introducing a parent layout.

```jsx
<Route path="projects">
  <Route index element={<ProjectsHome />} />
  <Route element={<ProjectsLayout />}>
    <Route path=":pid" element={<Project />} />
    <Route path=":pid/edit" element={<EditProject />} />
  </Route>
</Route>
```

| Route type | Has `path` | Has `element` | Effect |
| --- | --- | --- | --- |
| Normal | Yes | Yes | adds a URL segment and renders UI |
| Layout route | No | Yes | shared UI, no URL segment |
| Route prefix | Yes | No | URL segment, no shared UI |
| Index route | No (`index`) | Yes | default child at the parent's URL |

### Dynamic segments

If a path segment **starts with `:`**, it becomes a **"dynamic segment"**. When the route matches the URL, the segment's value is parsed from the URL and provided as **params** to router APIs like **`useParams`**.

```jsx
<Route path="teams/:teamId" element={<Team />} />
```

You can have **multiple dynamic segments** in one path:

```jsx
<Route path="/c/:categoryId/p/:productId" element={<Product />} />
```

```jsx
import { useParams } from "react-router";

export default function Product() {
  let { categoryId, productId } = useParams();
  // URL /c/shoes/p/42 → categoryId = "shoes", productId = "42"
  // ...
}
```

**Params are always strings** — convert them when you need numbers: `Number(productId)`.

### Optional segments

Make a segment optional by adding **`?`** at the end:

```jsx
<Route path=":lang?/categories" element={<Categories />} />
// matches /categories and /en/categories
```

You can have **optional static segments** too:

```jsx
<Route path="users/:userId/edit?" element={<User />} />
// matches /users/5 and /users/5/edit
```

### Splats (catch-all)

Also called **"catchall"** and **"star"** segments. If a path ends with **`/*`**, it matches any characters after the `/`, including more `/` characters.

```jsx
<Route path="files/*" element={<File />} />
```

```jsx
let params = useParams();
// params["*"] contains the rest of the URL after files/
let filePath = params["*"];
// URL /files/docs/2026/report.pdf → filePath = "docs/2026/report.pdf"
```

You can destructure `*`, but you must give it a new name. A common name is **`splat`**:

```jsx
let { "*": splat } = useParams();
```

### 404 — not found page

A `path="*"` route matches any URL that no other route matched:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigating

Users navigate with **`<Link>`**, **`<NavLink>`** and **`useNavigate`**. **Don't use plain `<a href>` for internal links** — it reloads the whole page and loses app state.

#### NavLink

**`NavLink`** is for navigation links that need an **active state** (e.g. highlighting the current page in a menu).

```jsx
import { NavLink } from "react-router";

export function MyAppNav() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/trending" end>
        Trending Concerts
      </NavLink>
      <NavLink to="/concerts">All Concerts</NavLink>
      <NavLink to="/account">Account</NavLink>
    </nav>
  );
}
```

-   An active `NavLink` automatically gets an **`active` class** (and `aria-current="page"`).
-   **`end`** means "active only on an exact match". Without `end`, `to="/"` would be active on **every** page, because every URL starts with `/`.

```jsx
<NavLink
  to="/messages"
  className={({ isActive, isPending }) => (isActive ? 'nav-link active' : 'nav-link')}
  style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
>
  Messages
</NavLink>
```

#### Link

Use **`<Link>`** when the link doesn't need active styling:

```jsx
import { Link } from "react-router";

export function LoggedOutMessage() {
  return (
    <p>
      You've been logged out.{" "}
      <Link to="/login">Login again</Link>
    </p>
  );
}
```

**Relative links:** inside a route, `to="settings"` (no leading `/`) is relative to the current route; `to=".."` goes up one level.

#### useNavigate

This hook lets you **navigate programmatically**, without the user clicking a link.

For normal navigation, prefer `Link` or `NavLink`. They give a better default experience: keyboard support, accessibility labels, "open in new tab", right-click menus, etc.

Reserve `useNavigate` for situations where you need to navigate **without** a direct link click, for example:

-   After a **form submission** completes
-   **Logging the user out** after inactivity
-   **Timed UIs** like quizzes

```jsx
import { useNavigate } from "react-router";

export function LoginPage() {
  let navigate = useNavigate();

  return (
    <>
      <MyHeader />
      <MyLoginForm
        onSuccess={() => {
          navigate("/dashboard");
        }}
      />
      <MyFooter />
    </>
  );
}
```

More options:

```jsx
navigate("/dashboard", { replace: true }); // replace the current history entry (Back won't return to login)
navigate(-1);                               // go back one page
navigate("/checkout", { state: { from: "cart" } }); // pass data, read with useLocation().state
```

**Don't call `navigate` during render** — call it in event handlers or effects. To redirect while rendering, use the **`<Navigate>`** component:

```jsx
import { Navigate } from "react-router";

function OldPage() {
  return <Navigate to="/new-page" replace />;
}
```

### URL values

#### Route params

**Route params** are the parsed values from a dynamic segment.

```jsx
<Route path="/concerts/:city" element={<City />} />
```

Here `:city` is the dynamic segment. Its value is available from **`useParams`**:

```jsx
import { useParams } from "react-router";

function City() {
  let { city } = useParams();
  let data = useFakeDataLibrary(`/api/v2/cities/${city}`);
  // ...
}
```

When the user goes from `/concerts/pune` to `/concerts/delhi`, the **same `City` component stays mounted** and re-renders with the new `city`. Effects that depend on `city` must list it in their dependency array.

#### URL search params

**Search params** are the values after `?` in the URL. Read and update them with **`useSearchParams`**, which returns a **`URLSearchParams`** instance and a setter.

```jsx
import { useSearchParams } from "react-router";

function SearchResults() {
  let [searchParams, setSearchParams] = useSearchParams();
  // URL: /search?q=react&page=2

  return (
    <div>
      <p>
        You searched for <i>{searchParams.get("q")}</i> (page {searchParams.get("page") ?? 1})
      </p>
      <button onClick={() => setSearchParams({ q: "react", page: "3" })}>Next page</button>
      <FakeSearchResults />
    </div>
  );
}
```

Search params are great for **filters, sorting, pagination and search terms**: the state survives a page refresh and can be shared as a link.

#### Location object

React Router provides a **location** object with useful information, available from **`useLocation`**: `pathname`, `search`, `hash`, `state` and a unique `key`.

```jsx
import { useLocation } from "react-router";

function useAnalytics() {
  let location = useLocation();
  useEffect(() => {
    sendFakeAnalytics(location.pathname);
  }, [location]);
}

function useScrollRestoration() {
  let location = useLocation();
  useEffect(() => {
    fakeRestoreScroll(location.key);
  }, [location]);
}
```

### Protected routes

Only allow logged-in users, and send others to the login page (remembering where they wanted to go):

```jsx
import { Navigate, Outlet, useLocation } from "react-router";

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// Routes
<Routes>
  <Route path="login" element={<Login />} />
  <Route element={<RequireAuth />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

// After login, go back
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async () => {
    await login();
    navigate(from, { replace: true });
  };
  // ...
}
```

**Note:** client-side route protection is only for **user experience**. The server/API must still check authorization, because anyone can change client code.

### Lazy loading routes

```jsx
const Settings = lazy(() => import("./pages/Settings"));

<Route
  path="settings"
  element={
    <Suspense fallback={<Spinner />}>
      <Settings />
    </Suspense>
  }
/>
```

(See **Code-Splitting**.)

### Data routers (loaders and actions)

React Router also has a **data mode** (`createBrowserRouter` + `RouterProvider`) and a **framework mode** (the successor to Remix). Routes can define a **`loader`** to fetch data **before** rendering and an **`action`** to handle form submissions.

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData } from "react-router";

const router = createBrowserRouter([
  {
    path: "/teams/:teamId",
    loader: async ({ params }) => fetch(`/api/teams/${params.teamId}`).then(r => r.json()),
    Component: Team,
  },
]);

function Team() {
  const team = useLoaderData();   // data is ready when the component renders
  return <h1>{team.name}</h1>;
}

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
```

### React Router v5 vs v6+

Many older projects and interview questions use v5 syntax.

| v5 | v6 / v7 |
| --- | --- |
| `<Switch>` | `<Routes>` |
| `<Route path="/about" component={About} />` | `<Route path="/about" element={<About />} />` |
| `exact` prop needed | exact matching by default; best match is chosen |
| `useHistory()` → `history.push('/x')` | `useNavigate()` → `navigate('/x')` |
| `<Redirect to="/x" />` | `<Navigate to="/x" />` |
| `props.match.params` | `useParams()` |
| nested routes defined inside child components | nested `<Route>`s in one place + `<Outlet />` |
| `withRouter` HOC | hooks (`useNavigate`, `useLocation`, `useParams`) |

#### v5: `component` vs `render` in Route

When you pass a component to the **`component`** prop, the component receives route props, and path parameters are in **`props.match.params`**:

```jsx
class ProfileComponent extends React.Component {
  render() {
    return <div>{this.props.match.params.username}</div>;
  }
}

<Route exact path="/u/:username/" component={ProfileComponent} />
```

With the **`render`** prop, path parameters come from the props passed to the render function:

```jsx
<Route
  exact
  path="/u/:username/"
  render={(props) => (
    <ProfileComponent username={props.match.params.username} />
  )}
/>
```

You'd use `render` when you needed to **pass extra props** from the component that contains your routes, since `component` gave no way to pass additional props. **Don't write `component={() => <Profile extra={x} />}`** — it creates a new component type on every render and remounts it.

**In v6+ both are replaced by `element`**, which takes a normal JSX element, so passing extra props is simple: `element={<Profile extra={x} />}`.

### Interview questions

```jsx
// Q1: Why does "/" stay highlighted on every page?
<NavLink to="/">Home</NavLink>
// Answer: every URL starts with "/", so the link is considered active. Add the `end` prop.
```

```jsx
// Q2: The URL changes to /dashboard/settings but only the Dashboard heading shows. Why?
<Route path="dashboard" element={<Dashboard />}>
  <Route path="settings" element={<Settings />} />
</Route>
// Answer: Dashboard doesn't render <Outlet />, so there's nowhere for the child route to appear.
```

```jsx
// Q3: What is typeof id?
// <Route path="/users/:id" element={<User />} /> and URL /users/42
function User() {
  const { id } = useParams();
  console.log(typeof id);
}
// Answer: "string". Route params are always strings.
```

```jsx
// Q4: What's wrong with using <a href="/about"> in a React Router app?
// Answer: it triggers a full page reload — the whole app reloads and loses its state.
// Use <Link to="/about">.
```

```jsx
// Q5: After login the user presses Back and returns to the login page. How do you prevent it?
// Answer: navigate("/dashboard", { replace: true }) — it replaces the login entry in history.
```
