---
title: "NodeJS Blogging Application"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 14
description: "Node.js — NodeJS Blogging Application."
---
Setup the project (Create project using npm init, install package that you remember that we are going to use and also nodemon in dev and update package.json for npm start nodemon index.js)

## Install the package

npm i express mongoose ejs jsonwebtoken dotenv cookie-parser multer

npm i nodemon -D

Create all the folder controller, routes, views, service,middleware, models

### index.js

```js
const express = require("express");

const path = require("path")

const app = express();

const PORT= 8000;

app.set("view engine","ejs");

app.set("views",path.resolve("./views"));

app.use(express.json());

app.use(express.urlencoded({extended:false}))

app.get("/", (req, res)=>{

return res.render("home")
```
})

```js
app.listen(PORT, ()=>{

console.log("Server started at ", PORT);
```
})

Create views/home.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<meta charset="UTF-8">`

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

<title>Blog App</title>

`</head>`

`<body>`

<h1>Homepage</h1>

`</body>`

`</html>`

Now we will use Bootstrap for html and css pages. So we are going to use CDN but we can’t use in every page so we will use ejs feature which is Partial

**Partials come in handy when you want to reuse the same HTML across multiple views.**

Let’s create two files in partials

### Create views/partials/head.ejs

### <link

**href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"**

**rel="stylesheet"**

**integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"**

**crossorigin="anonymous"**

**/>**

### `<meta charset="UTF-8" />`

### `<meta http-equiv="X-UA-Compatible" content="IE=edge" />`

### `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

### Create views/partials/script.ejs

### <script

**src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"**

**integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"**

**crossorigin="anonymous"**

### \>`</script>`

### Update views/home.ejs

### <!DOCTYPE html>

### `<html lang="en">`

### `<head>`

### <%- include('./partials/head') %>

### <title>Homepage</title>

### `</head>`

### `<body>`

### <h1>Homepage</h1>

### <%- include('./partials/scripts') %>

### `</body>`

### `</html>`

### Navbar

Since we need navbar on all pages so we will create partials

### Create views/partials/nav.ejs

We just copied the code from bootstrap navbar. Also we have added bg-dark" data-bs-theme="dark in nav tag [https://getbootstrap.com/docs/4.1/components/navbar/](https://getbootstrap.com/docs/4.1/components/navbar/). Also update the details as per our application.

<nav class="navbar navbar-expand-lg navbar-light bg-dark" data-bs-theme="dark">

<a class="navbar-brand" href="#">Blogit</a>

<button

```js
class="navbar-toggler"
```
type="button"

data-toggle="collapse"

data-target="#navbarNavDropdown"

aria-controls="navbarNavDropdown"

aria-expanded="false"

aria-label="Toggle navigation"

\>

<span class="navbar-toggler-icon"></span>

</button>

<div class="collapse navbar-collapse" id="navbarNavDropdown">

<ul class="navbar-nav">

<li class="nav-item active">

<a class="nav-link" href="#"

\>Home</a

\>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Add Blog</a>

</li>

<li class="nav-item dropdown">

<a

```js
class="nav-link dropdown-toggle"
```
href="#"

id="navbarDropdownMenuLink"

role="button"

data-toggle="dropdown"

aria-haspopup="true"

aria-expanded="false"

\>

Rishabh

</a>

<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">

<a class="dropdown-item" href="#">Logout</a>

</div>

</li>

</ul>

</div>

</nav>

### Update views/home.ejs

Included the nav.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

<%- include('./partials/head') %>

<title>Homepage</title>

`</head>`

`<body>`

<%- include('./partials/nav.ejs') %>

<h1>Homepage</h1>

<%- include('./partials/scripts') %>

`</body>`

`</html>`

## Create Signin and signup flow

We will need to use mongoose. Also we will need a default image if the user does not provide the image.

### Create models/user.js

```js
const { createHmac, randomBytes } = require("crypto");

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
```
{

```js
fullName: {

type: String,

required: true,
```
},

```js
email: {

type: String,

required: true,

unique: true,
```
},

```js
salt: {

type: String,
```
},

```js
password: {

type: String,

required: true,
```
},

```js
profileImageURL: {

type: String,

default: "/images/default.png",
```
},

```js
role: {

type: String,

enum: ["USER", "ADMIN"],

default: "USER",
```
},

},

{ timestamps: true }

```js
);
```
userSchema.pre("save", function (next) {

```js
const user = this;

if (!user.isModified("password")) return;

const salt = randomBytes(16).toString();

const hashedPassword = createHmac("sha256", salt)
```
.update(user.password)

```js
.digest("hex");

this.salt = salt;

this.password = hashedPassword;

next();

});

const User = model("user", userSchema);

module.exports = User;
```
**Explanation:**

### Schema is understandable so we used

We used profile image url so we need to create a folder public/images and paste the download user avatar image here.

```js
profileImageURL: {

type: String,

default: "/images/default.png",

}
```
We will have two roles for the user, User and Admin. Also we should have only 2 options so we have used enum here

```js
role: {

type: String,

enum: ["USER", "ADMIN"],

default: "USER",
```
},

We are storing the salt(random string for hashing the password) of the user in the database

```js
salt: {

type: String,
```
},

Below method will be called before we save details in the database.

userSchema.pre("save", function (next) {

```js
const user = this;
```
if (!user.isModified("password")) return; // if user’s password is created/modified

```js
const salt = randomBytes(16).toString(); // Generate 16 letter random string

const hashedPassword = createHmac("sha256", salt)
```
.update(user.password)

```js
.digest("hex");
```
// Create hash password using salt in hexadecimal form

```js
this.salt = salt;

this.password = hashedPassword;
```
//Above code to update the user details

```js
next();

});
```
### Create routes/user.js

```js
**const { Router } = require("express");**

**const User = require("../models/user");**
```
**const router = Router();**

```js
**router.get("/signin", (req, res) => {**
```
**return res.render("signin");**

**});**

```js
**router.get("/signup", (req, res) => {**
```
**return res.render("signup");**

**});**

```js
**router.post("/signup", async (req, res) => {**
```
**const { fullName, email, password } = req.body;**

**await User.create({**

**fullName,**

**email,**

**password,**

**});**

**return res.redirect("/");**

**});**

```js
**module.exports = router;**
```
### Create views/signup.ejs

### <!DOCTYPE html>

### `<html lang="en">`

### `<head>`

### <%- include('./partials/head') %>

### <title>Signup</title>

### `</head>`

### `<body>`

### <%- include('./partials/nav') %>

### <div class="container mt-4">

### <form action="/user/signup" method="post">

### <div class="mb-3">

### <label for="fullName" class="form-label">Full Name</label>

### <input

**type="text"**

**class="form-control"**

**id="fullName"**

**name="fullName"**

### aria-describedby="fullName"

**/>**

### </div>

### <div class="mb-3">

### <label for="exampleInputEmail1" class="form-label"

### \>Email address</label

**\>**

### <input

**type="email"**

**name="email"**

**class="form-control"**

**id="exampleInputEmail1"**

### aria-describedby="emailHelp"

**/>**

### <div id="emailHelp" class="form-text">

**We'll never share your email with anyone else.**

### </div>

### </div>

### <div class="mb-3">

### <label for="exampleInputPassword1" class="form-label">Password</label>

### <input

**name="password"**

**type="password"**

**class="form-control"**

**id="exampleInputPassword1"**

**/>**

### </div>

### <button type="submit" class="btn btn-primary">Submit</button>

### </form>

### </div>

### <%- include('./partials/scripts') %>

### `</body>`

### `</html>`

### Update index.js

```js
**const express = require("express");**

**const path = require("path");**

**const userRoute = require("./routes/user");**

**const mongoose = require("mongoose");**
```
**const app = express();**

**const PORT= 8000;**

### mongoose

### .connect('mongodb://127.0.0.1:27017/blogit')

```js
**.then((e) => console.log("MongoDB Connected"));**
```
**app.set("view engine","ejs");**

**app.set("views",path.resolve("./views"));**

**app.use(express.json());**

**app.use(express.urlencoded({extended:false}))**

**app.use("/user",userRoute);**

```js
**app.get("/", (req, res)=>{**
```
**return res.render("home")**

**})**

```js
**app.listen(PORT, ()=>{**

**console.log("Server started at ", PORT);**
```
**})**

### Create service/authentication.js

Add authentication using jsonwebtoken

```js
**const JWT = require("jsonwebtoken");**
```
**const secret = "$uperMan@123";**

**function createTokenForUser(user) {**

**const payload = {**

**_id: user._id,**

**email: user.email,**

**profileImageURL: user.profileImageURL,**

**role: user.role,**

**};**

**const token = JWT.sign(payload, secret);**

**return token;**

**}**

**function validateToken(token) {**

**const payload = JWT.verify(token, secret);**

**return payload;**

**}**

```js
**module.exports = {**
```
**createTokenForUser,**

**validateToken,**

**};**

### Update models/user.js

```js
**const { createHmac, randomBytes } = require("crypto");**

**const { Schema, model } = require("mongoose");**

**const { createTokenForUser } = require("../service/authentication");**
```
**const userSchema = new Schema(**

**{**

**fullName: {**

**type: String,**

**required: true,**

**},**

**email: {**

**type: String,**

**required: true,**

**unique: true,**

**},**

**salt: {**

**type: String,**

**},**

**password: {**

**type: String,**

**required: true,**

**},**

**profileImageURL: {**

**type: String,**

**default: "/images/default.png",**

**},**

**role: {**

**type: String,**

**enum: \["USER", "ADMIN"\],**

**default: "USER",**

**},**

**},**

### { timestamps: true }

**);**

**userSchema.pre("save", function (next) {**

**const user = this;**

**if (!user.isModified("password")) return;**

**const salt = randomBytes(16).toString();**

**const hashedPassword = createHmac("sha256", salt)**

### .update(user.password)

**.digest("hex");**

**this.salt = salt;**

**this.password = hashedPassword;**

**next();**

**});**

**userSchema.static(**

**"matchPasswordAndGenerateToken",**

**async function (email, password) {**

**const user = await this.findOne({ email });**

**if (!user) throw new Error("User not found!");**

**const salt = user.salt;**

**const hashedPassword = user.password;**

**const userProvidedHash = createHmac("sha256", salt)**

### .update(password)

**.digest("hex");**

**if (hashedPassword !== userProvidedHash)**

**throw new Error("Incorrect Password");**

**const token = createTokenForUser(user);**

**return token;**

**}**

**);**

**const User = model("user", userSchema);**

```js
**module.exports = User;**
```
Added the virtual function (static function) to the user schema to verify the password

Update routes/user.js

```js
const { Router } = require("express");

const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {

return res.render("signin");

});

router.get("/signup", (req, res) => {

return res.render("signup");

});

router.post("/signin", async (req, res) => {

const { email, password } = req.body;

try {

const token = await User.matchPasswordAndGenerateToken(email, password);

return res.cookie("token", token).redirect("/");
```
} catch (error) {

```js
return res.render("signin", {

error: "Incorrect Email or Password",

});

}

});

router.get("/logout", (req, res) => {

res.clearCookie("token").redirect("/");

});

router.post("/signup", async (req, res) => {

const { fullName, email, password } = req.body;

await User.create({
```
fullName,

email,

password,

```js
});

return res.redirect("/");

});

module.exports = router;
```
Added sign method which will use userschema static method **(models/user.js)** matchPasswordAndGenerateToken to verify the password and return the jwtToken generated using service/authentication.js

Now we need to create Sign in page as well

### Create views/signin.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

<%- include('./partials/head') %>

<title>Signin</title>

`</head>`

`<body>`

<%- include('./partials/nav') %>

<div class="container mt-4">

<form action="/user/signin" method="post">

<div class="mb-3">

<label for="exampleInputEmail1" class="form-label"

\>Email address</label

\>

<input

type="email"

name="email"

```js
class="form-control"
```
id="exampleInputEmail1"

aria-describedby="emailHelp"

/>

<div id="emailHelp" class="form-text">

We'll never share your email with anyone else.

</div>

</div>

<div class="mb-3">

<label for="exampleInputPassword1" class="form-label">Password</label>

<input

name="password"

type="password"

```js
class="form-control"
```
id="exampleInputPassword1"

/>

</div>

<button type="submit" class="btn btn-primary">Submit</button>

</form>

</div>

<%- include('./partials/scripts') %>

`</body>`

`</html>`

### Update views/partials/nav.ejs

Here we are showing the error message

<nav class="navbar navbar-expand-lg navbar-light bg-dark" data-bs-theme="dark">

<a class="navbar-brand" href="#">Blogit</a>

<button

```js
class="navbar-toggler"
```
type="button"

data-toggle="collapse"

data-target="#navbarNavDropdown"

aria-controls="navbarNavDropdown"

aria-expanded="false"

aria-label="Toggle navigation"

\>

<span class="navbar-toggler-icon"></span>

</button>

<div class="collapse navbar-collapse" id="navbarNavDropdown">

<ul class="navbar-nav">

<li class="nav-item active">

<a class="nav-link" href="#"

\>Home</a

\>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Add Blog</a>

</li>

<li class="nav-item dropdown">

<a

```js
class="nav-link dropdown-toggle"
```
href="#"

id="navbarDropdownMenuLink"

role="button"

data-toggle="dropdown"

aria-haspopup="true"

aria-expanded="false"

\>

Rishabh

</a>

<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">

<a class="dropdown-item" href="#">Logout</a>

</div>

</li>

</ul>

</div>

</nav>

### <% if (locals.error) { %>

### <div class="container mt-4">

### <div class="alert alert-danger" role="alert"><%= locals.error %></div>

### </div>

<% } %>

### Create middleware/authentication.js

```js
const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {

return (req, res, next) => {

const tokenCookieValue = req.cookies[cookieName];
```
if (!tokenCookieValue) {

```js
return next();

}

try {

const userPayload = validateToken(tokenCookieValue);

req.user = userPayload;
```
} catch (error) {

```js
console.log(error);

}

return next();

};

}

module.exports = {
```
checkForAuthenticationCookie,

```js
};
```
### Update index.js

Added middleware for authentication and cookie parse. Also passed the object in the response to homepage so that we can add logic to hide nav menu like Add blog, name, etc

```js
const express = require("express");

const path = require("path");

const userRoute = require("./routes/user");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();

const PORT= 8000;
```
mongoose

.connect('mongodb://127.0.0.1:27017/blogit')

```js
.then((e) => console.log("MongoDB Connected"));

app.set("view engine","ejs");

app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}))

app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res)=>{

return res.render("home",{

user: req.user
```
})

})

```js
app.use("/user",userRoute);

app.listen(PORT, ()=>{

console.log("Server started at ", PORT);
```
})

### Update views/partials/nav.ejs

Hide

<nav

```js
class="navbar navbar-expand-lg bg-body-tertiary bg-dark"
```
data-bs-theme="dark"

\>

<div class="container-fluid">

<a class="navbar-brand" href="#">Blogit</a>

<button

```js
class="navbar-toggler"
```
type="button"

data-bs-toggle="collapse"

data-bs-target="#navbarNavDropdown"

aria-controls="navbarNavDropdown"

aria-expanded="false"

aria-label="Toggle navigation"

\>

<span class="navbar-toggler-icon"></span>

</button>

<div class="collapse navbar-collapse" id="navbarNavDropdown">

<ul class="navbar-nav">

<li class="nav-item">

<a class="nav-link active" aria-current="page" href="#">Home</a>

</li>

<% if (locals.user) { %>

<li class="nav-item">

<a class="nav-link" href="/blog/add-new">Add Blog</a>

</li>

<li class="nav-item dropdown">

<a

```js
class="nav-link dropdown-toggle"
```
href="#"

role="button"

data-bs-toggle="dropdown"

aria-expanded="false"

\>

Rishabh

</a>

<ul class="dropdown-menu">

<li><a class="dropdown-item" href="/user/logout">Logout</a></li>

</ul>

</li>

<% } else {%>

<li class="nav-item">

<a class="nav-link" href="/user/signup">Create Account</a>

</li>

<li class="nav-item">

<a class="nav-link" href="/user/signin">Signin</a>

</li>

<% } %>

</ul>

</div>

</div>

</nav>

<% if (locals.error) { %>

<div class="container mt-4">

<div class="alert alert-danger" role="alert"><%= locals.error %></div>

</div>

<% } %>

## Add blog and comments flow

### Create models/blog.js

```js
const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
```
{

```js
title: {

type: String,

required: true,
```
},

```js
body: {

type: String,

required: true,
```
},

```js
coverImageURL: {

type: String,

required: false,
```
},

```js
createdBy: {

type: Schema.Types.ObjectId,

ref: "user",
```
},

},

{ timestamps: true }

```js
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
```
We use below code to refer to the user table.

```js
createdBy: {

type: Schema.Types.ObjectId,

ref: "user",
```
},

### Create views/addBlog.js

### <!DOCTYPE html>

### `<html lang="en">`

### `<head>`

### <%- include('./partials/head') %>

### <title>Add New Blog</title>

### `</head>`

### `<body>`

### <%- include('./partials/nav') %>

### <div class="container mt-3">

### <form action="/blog" method="post" enctype="multipart/form-data">

### <div class="mb-3">

### <label for="coverImage" class="form-label">Cover Image</label>

### <input

**type="file"**

**class="form-control"**

**id="coverImage"**

**name="coverImage"**

### aria-describedby="coverImage"

**/>**

### </div>

### <div class="mb-3">

### <label for="title" class="form-label">Title</label>

### <input

**type="text"**

**class="form-control"**

**id="title"**

**name="title"**

### aria-describedby="title"

**/>**

### </div>

### <div class="mb-3">

### <label for="body">Body</label>

### <textarea name="body" class="form-control" id="body"></textarea>

### </div>

### <div class="mb-3">

### <button class="btn btn-primary">Submit</button>

### </div>

### </form>

### </div>

### <%- include('./partials/scripts') %>

### `</body>`

### `</html>`

### Create routes/blog.js

```js
**const { Router } = require("express");**

**const multer = require("multer");**

**const path = require("path");**

**const Blog = require("../models/blog");**
```
**const router = Router();**

**const storage = multer.diskStorage({**

**destination: function (req, file, cb) {**

**cb(null, path.resolve(`./public/uploads/`));**

**},**

**filename: function (req, file, cb) {**

**const fileName = `${Date.now()}-${file.originalname}`;**

**cb(null, fileName);**

**},**

**});**

**const upload = multer({ storage: storage });**

```js
**router.get("/add-new", (req, res) => {**
```
**return res.render("addBlog", {**

**user: req.user,**

**});**

**});**

```js
**router.post("/", upload.single("coverImage"), async (req, res) => {**
```
**const { title, body } = req.body;**

**const blog = await Blog.create({**

**body,**

**title,**

**createdBy: req.user._id,**

**coverImageURL: \`/uploads/${req.file.filename}\`,**

**});**

**return res.redirect(`/blog/${blog._id}`);**

**});**

```js
**module.exports = router;**
```
### Update index.js

Add routes for blog and render the blogs on homepage so we need to pass it to the home.ejs

```js
const express = require("express");

const path = require("path");

const userRoute = require("./routes/user");

const blogRoute = require("./routes/blog");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const { checkForAuthenticationCookie } = require("./middleware/authentication");

const Blog = require("./models/blog");

const app = express();

const PORT = 8000;
```
mongoose

.connect("mongodb://127.0.0.1:27017/blogit")

```js
.then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {

const allBlogs = await Blog.find({});

res.render("home", {

user: req.user,

blogs: allBlogs,

});

});

app.use("/user", userRoute);

app.use("/blog", blogRoute);

app.listen(PORT, () => {

console.log("Server started at ", PORT);

});
```
Now render the blogs on homepage

### Update views/home.ejs

### <!DOCTYPE html>

### `<html lang="en">`

### `<head>`

### <%- include('./partials/head') %>

### <title>Homepage</title>

### `</head>`

### `<body>`

### <%- include('./partials/nav') %>

### <div class="container mt-3">

### <div class="row row-cols-4">

```js
**<% blogs.forEach(blog => { %>**
```
### <div class="col">

### <div class="card col" style="width: 18rem">

### <img src="<%= blog.coverImageURL %>" class="card-img-top" />

### <div class="card-body">

### <h5 class="card-title"><%= blog.title %></h5>

### <a href="/blog/<%= blog._id %>" class="btn btn-primary">View</a>

### </div>

### </div>

### </div>

**<% }) %>**

### </div>

### </div>

### <%- include('./partials/scripts') %>

### `</body>`

### `</html>`

### Create views/blog.ejs

### <!DOCTYPE html>

### `<html lang="en">`

### `<head>`

### <%- include('./partials/head') %>

### <title>Blog</title>

### `</head>`

### `<body>`

### <%- include('./partials/nav') %>

### <div class="container mt-4">

### <h1><%= blog.title %></h1>

**<img src="<%= blog.coverImageURL %>" width="700px" style="max-width: 100%;"/>**

### <pre class="mt-3"><%= blog.body %></pre>

### </div>

### <div class="container mt-4">

### <img src="<%= blog.createdBy.profileImageURL %>" width="50px" /> <%=

### blog.createdBy.fullName %>

### </div>

### <div class="container mt-3">

**<h1>Comments (<%= comments.length %>)</h1>**

### <% if (locals.user) { %>

### <form action="/blog/comment/<%= blog._id %>" method="post">

### <div class="mb-3">

### <input

**type="text"**

**name="content"**

**class="form-control"**

**placeholder="Enter your comment"**

**/>**

**<button class="btn btn-sm btn-primary" type="submit" style="margin: 10px 5px;">Add</button>**

### </div>

### </form>

**<% } %>**

### <div class="mt-3">

```js
**<% comments.forEach(comment => { %>**
```
### <div>

### <img src="<%= comment.createdBy.profileImageURL %>" width="50px" />

### <%= comment.createdBy.fullName %>

### <pre style="padding: 10px;"><%= comment.content %></pre>

### </div>

**<% }) %>**

### </div>

### </div>

### <%- include('./partials/scripts') %>

### `</body>`

### `</html>`

### Create models/comment.js

```js
**const { Schema, model } = require("mongoose");**
```
**const commentSchema = new Schema(**

**{**

**content: {**

**type: String,**

**required: true,**

**},**

**blogId: {**

**type: Schema.Types.ObjectId,**

**ref: "blog",**

**},**

**createdBy: {**

**type: Schema.Types.ObjectId,**

**ref: "user",**

**},**

**},**

### { timestamps: true }

**);**

**const Comment = model("comment", commentSchema);**

```js
**module.exports = Comment;**
```
### Update routes/blog.js

```js
**const { Router } = require("express");**

**const multer = require("multer");**

**const path = require("path");**

**const Blog = require("../models/blog");**

**const Comment = require("../models/comment");**
```
**const router = Router();**

**const storage = multer.diskStorage({**

**destination: function (req, file, cb) {**

**cb(null, path.resolve(`./public/uploads/`));**

**},**

**filename: function (req, file, cb) {**

**const fileName = `${Date.now()}-${file.originalname}`;**

**cb(null, fileName);**

**},**

**});**

**const upload = multer({ storage: storage });**

```js
**router.get("/add-new", (req, res) => {**
```
**return res.render("addBlog", {**

**user: req.user,**

**});**

**});**

```js
**router.get("/:id", async (req, res) => {**
```
**const blog = await Blog.findById(req.params.id).populate("createdBy");**

**const comments = await Comment.find({ blogId: req.params.id }).populate(**

### "createdBy"

**);**

**return res.render("blog", {**

**user: req.user,**

**blog,**

**comments,**

**});**

**});**

```js
**router.post("/comment/:blogId", async (req, res) => {**
```
**await Comment.create({**

**content: req.body.content,**

**blogId: req.params.blogId,**

**createdBy: req.user._id,**

**});**

**return res.redirect(`/blog/${req.params.blogId}`);**

**});**

```js
**router.post("/", upload.single("coverImage"), async (req, res) => {**
```
**const { title, body } = req.body;**

**const blog = await Blog.create({**

**body,**

**title,**

**createdBy: req.user._id,**

**coverImageURL: \`/uploads/${req.file.filename}\`,**

**});**

**return res.redirect(`/blog/${blog._id}`);**

**});**

```js
**module.exports = router;**
```
**Populate method: It is used to get the details of the model. Here we are populate createdBy which is user table so in blog, we will get user record details as well**

**const blog = await Blog.findById(req.params.id).populate("createdBy");**

**const comments = await Comment.find({ blogId: req.params.id }).populate(**

### "createdBy"

**);**

### ![](/notes-img/nodejs-notes/img-012.webp)
