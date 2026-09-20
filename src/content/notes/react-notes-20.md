---
title: "React and HTTP"
part: "React Notes"
track: "react"
kind: "notes"
updated: "2026-09-15"
source: "React JS.docx"
draft: false
order: 19
description: "React — fetching and posting data with axios and fetch, loading and error states, race conditions, cancellation, and data-fetching libraries."
---
### Fetching data in React

React doesn't include an HTTP client. To fetch data we use the browser's **Fetch API** or a library such as **axios**. To install axios:

```bash
npm i axios
```

| | `fetch` | `axios` |
| --- | --- | --- |
| Install | built into browsers and Node 18+ | `npm i axios` |
| JSON | call `res.json()` yourself | parsed automatically (`response.data`) |
| HTTP errors (404, 500) | **don't reject** — check `res.ok` | reject automatically |
| Request body | `JSON.stringify(data)` + `Content-Type` header | pass an object |
| Interceptors, base URL, timeouts | write yourself | built in |
| Cancel | `AbortController` | `AbortController` (`signal`) |

### App.js

```jsx
import PostForm from "./components/React_http/PostForm";
import PostList from "./components/React_http/PostList";

function App() {
  return (
    <div className="App">
      <PostForm />
      <PostList />
    </div>
  );
}

export default App;
```

### GET request — PostList.js (class component)

```jsx
import { Component } from "react";
import axios from "axios";

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        console.log(response);
        this.setState({ posts: response.data });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorMsg: "Error retrieving data" });
      });
  }

  render() {
    const { posts, errorMsg } = this.state;
    return (
      <div>
        List of posts
        {posts.length
          ? posts.map((post) => <div key={post.id}>{post.title}</div>)
          : null}
        {errorMsg ? <div>{errorMsg}</div> : null}
      </div>
    );
  }
}

export default PostList;
```

**Why `componentDidMount`?** The component is already in the DOM, and it runs only once — the right place for side effects like data fetching. Don't fetch in `render` (it would run on every render and cause an infinite loop when you set state).

### POST request — PostForm.js (class component)

```jsx
import { Component } from "react";
import axios from "axios";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      title: "",
      body: "",
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
    axios
      .post("https://jsonplaceholder.typicode.com/posts", this.state)
      .then((response) => {
        console.log(response); // response.data → { userId, title, body, id: 101 }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { userId, title, body } = this.state;
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div>
            <input type="text" name="userId" value={userId} onChange={this.changeHandler} />
          </div>
          <div>
            <input type="text" name="title" value={title} onChange={this.changeHandler} />
          </div>
          <div>
            <input type="text" name="body" value={body} onChange={this.changeHandler} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default PostForm;
```

(JSONPlaceholder is a fake API: it returns a success response with `id: 101`, but doesn't actually save the post.)

### GET with hooks: loading, error and data

In function components, fetch inside **`useEffect`**. Always handle **loading**, **error** and **empty** states.

```jsx
import { useEffect, useState } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);  // fetch doesn't reject on 404/500
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPosts();
    return () => controller.abort();   // cancel if the component unmounts
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error retrieving data: {error}</p>;
  if (posts.length === 0) return <p>No posts found.</p>;

  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Notes:**

-   The effect function itself **can't be `async`** (it must return nothing or a cleanup function), so define an async function inside and call it.
-   The empty dependency array `[]` means "run once after the first render".

### POST with hooks

```jsx
function PostForm() {
  const [form, setForm] = useState({ userId: '', title: '', body: '' });
  const [status, setStatus] = useState('idle'); // idle | saving | success | error

  const changeHandler = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function submitHandler(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', form);
      console.log('Created', data);
      setStatus('success');
      setForm({ userId: '', title: '', body: '' });
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <input name="userId" value={form.userId} onChange={changeHandler} placeholder="User ID" />
      <input name="title" value={form.title} onChange={changeHandler} placeholder="Title" />
      <input name="body" value={form.body} onChange={changeHandler} placeholder="Body" />
      <button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Submit'}
      </button>
      {status === 'success' && <p>Post created!</p>}
      {status === 'error' && <p>Something went wrong.</p>}
    </form>
  );
}
```

**With fetch** the POST needs a body string and header:

```jsx
await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

### Fetching when a prop changes, and race conditions

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setUser(data);   // ignore responses for an old userId
      });

    return () => {
      ignore = true;                  // runs before the next effect (userId changed) or on unmount
    };
  }, [userId]);                       // re-fetch when userId changes

  return user ? <h1>{user.name}</h1> : <p>Loading…</p>;
}
```

**Race condition:** if the user switches from user 1 to user 2 quickly, the request for user 1 might finish **after** user 2's. Without the `ignore` flag (or `AbortController`), the page would show user 1's data while `userId` is 2.

### A reusable custom hook

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage
function Posts() {
  const { data: posts, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts');
  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error.message}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### axios instance and interceptors

```jsx
// api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Add the auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) window.location.href = '/login';
    return Promise.reject(error);
  }
);

// Usage
const { data } = await api.get('/posts');
```

### Data-fetching libraries (recommended for real apps)

Hand-written `useEffect` fetching doesn't handle **caching, deduplication, background refetching, retries, pagination or stale data**. Libraries do:

-   **TanStack Query (React Query)**
-   **SWR**
-   **RTK Query** (Redux Toolkit)
-   Framework data loading (**Next.js** Server Components, **React Router** loaders)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Posts() {
  const { data: posts, isPending, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

function AddPost() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: newPost => axios.post('/api/posts', newPost),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }), // refetch the list
  });

  return <button onClick={() => mutation.mutate({ title: 'Hello' })}>Add</button>;
}
```

**React 19** also adds `use(promise)` with Suspense for reading data, and Actions for mutations (see the **React 19** chapter).

### Interview questions

```jsx
// Q1: What's wrong?
function Posts() {
  const [posts, setPosts] = useState([]);
  fetch('/api/posts').then(r => r.json()).then(setPosts);
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
// Answer: the fetch runs on every render, and setPosts triggers another render → infinite loop.
// Move it into useEffect(() => { ... }, []).
```

```jsx
// Q2: Does this catch a 404 response?
fetch('/api/missing').then(r => r.json()).catch(() => console.log('error'));
// Answer: No. fetch only rejects on network errors. A 404 resolves normally — check r.ok.
```

```jsx
// Q3: Why is this an error?
useEffect(async () => {
  const data = await getData();
  setData(data);
}, []);
// Answer: an async function returns a Promise, but useEffect expects the return value to be
// undefined or a cleanup function. Define an async function inside the effect and call it.
```

```jsx
// Q4: The user quickly switches from profile 1 to profile 2, and profile 1's data is shown. Why?
// Answer: a race condition — the slower response for profile 1 arrived last and overwrote the state.
// Ignore stale responses with a cleanup flag or cancel the old request with AbortController.
```
