---
title: "Building Node.js Authentication from Scratch"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 11
description: "Node.js — Building Node.js Authentication from Scratch."
---
## Using SSID (Stateful)

Create a user model under models folder.

### models/user.js

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
```
{

```js
name: {

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
password: {

type: String,

required: true,
```
},

},

{ timestamps: true }

```js
);

const User = mongoose.model("user", userSchema);

module.exports = User;
```
Now let’s create routes and controllers.

### routes/user.js

```js
const express = require("express");

const { handleUserSignup, handleUserLogin } = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignup);

router.post("/login", handleUserLogin);

module.exports = router;
```
### controllers/user.js

npm i uuid

```js
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");

const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {

const { name, email, password } = req.body;

await User.create({
```
name,

email,

password,

```js
});

return res.redirect("/");

}

async function handleUserLogin(req, res) {

const { email, password } = req.body;

const user = await User.findOne({ email, password });
```
if (!user)

```js
return res.render("login", {

error: "Invalid Username or Password",

});

const sessionId = uuidv4();

setUser(sessionId, user);

res.cookie("uid", sessionId);

return res.redirect("/");

}

module.exports = {
```
handleUserSignup,

handleUserLogin,

```js
};
```
Let’s include route in index.js and also add middleware for cookie parser.

npm i cookie-parser

### index.js

```js
const express = require("express");

const { connectToMongoDB } = require("./connect");

const cookieParser = require("cookie-parser");

const urlRouter = require("./routes/url");

const staticRouter = require("./routes/staticRouter");

const userRouter = require("./routes/user");

const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const path = require("path");

const URL = require("./models/url");

const app = express();

const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>

console.log("Mongodb connected")

).catch( error => console.log(error));

app.set("view engine","ejs");

app.set("views",path.resolve("./views"));

app.use(express.json());

app.use(express.urlencoded({extended:false}));
```
**app.use(cookieParser());**

```js
app.use("/url", restrictToLoggedinUserOnly, urlRouter);

app.use("/user", userRouter);

app.use("/", checkAuth, staticRouter);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```
Let’s create status routes for login and signup.

### routes/staticRouter.js

```js
const express = require("express");

const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {

const allURLS = await URL.find({});

return res.render("home", { urls: allURLS });

});

router.get("/signup", (req, res) => {

return res.render("signup");

});

router.get("/login", (req, res) => {

return res.render("login");

});

module.exports = router;
```
Create pages for login and signup

### views/signup.ejs

Make sure input fields name match with model fields.

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<style>`

body {

```js
font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

}
```
`</style>`

`<meta charset="UTF-8" />`

`<meta http-equiv="X-UA-Compatible" content="IE=edge" />`

`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

<title>Signup</title>

`</head>`

`<body>`

<h1>Signup</h1>

<form action="/user" method="post">

<label>Full Name</label>

<input type="text" required name="name" />

<label>Email</label>

<input type="text" required name="email" />

<label>Password</label>

<input type="text" required name="password" />

<button type="submit">Signup</button>

</form>

`</body>`

`</html>`

### views/login.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<style>`

body {

```js
font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

}
```
`</style>`

`<meta charset="UTF-8" />`

`<meta http-equiv="X-UA-Compatible" content="IE=edge" />`

`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

<title>Login</title>

`</head>`

`<body>`

<h1>Login</h1>

<form action="/user/login" method="post">

<label>Email</label>

<input type="text" required name="email" />

<label>Password</label>

<input type="text" required name="password" />

<button type="submit">Login</button>

</form>

`</body>`

`</html>`

### Create service/auth.js

```js
const sessionIdToUserMap = new Map();

function setUser(id, user) {

sessionIdToUserMap.set(id, user);

}

function getUser(id) {

return sessionIdToUserMap.get(id);

}

module.exports = {
```
setUser,

getUser,

```js
};
```
### Create middlewares/auth.js

Please note UUID will be saved per session only if we restart the server, UUID will be not valid

```js
const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {

const userUid = req.cookies?.uid;

if (!userUid) return res.redirect("/login");

const user = getUser(userUid);

if (!user) return res.redirect("/login");

req.user = user;

next();

}

async function checkAuth(req, res, next) {

const userUid = req.cookies?.uid;

const user = getUser(userUid);

req.user = user;

next();

}

module.exports = {
```
restrictToLoggedinUserOnly,

checkAuth,

```js
};
```
Find out who created the URL, We will need to update url model

### Update models/url.js

```js
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
```
{

```js
shortId: {

type: String,

required: true,

unique: true,
```
},

```js
redirectURL: {

type: String,

required: true,
```
},

```js
visitHistory: [{ timestamp: { type: Number } }],

createdBy: {

type: mongoose.Schema.Types.ObjectId,

ref: "users",
```
},

},

{ timestamps: true }

```js
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;

createdBy: {

type: mongoose.Schema.Types.ObjectId,

ref: "users",
```
},

users: user model will eventually becomes plural users in mongodb

Update the URL controller to add created by user.

### controller/user.js

```js
const shortid = require("shortid");

const URL = require("../models/url");

const handleGenerateNewShortURL = async (req, res) => {

const body = req.body;
```
if (!body.url) return res.status(400).json({ error: "url is required" });

```js
const shortID = shortid();

await URL.create({

shortId: shortID,

redirectURL: body.url,

visitHistory: [],

createdBy: req.user._id,

});

return res.render("home", { id: shortID });

};

const handleGetAnalytics = async (req, res) => {

const shortId = req.params.shortId;

const result = await URL.findOne({ shortId });

return res.json({

totalClicks: result.visitHistory.length,

analytics: result.visitHistory,

});

};

const handleRedirectURL = async (req, res) => {

const shortId = req.params.shortId;

const entry = await URL.findOneAndUpdate(
```
{

shortId,

},

{

```js
$push: {

visitHistory: {

timestamp: Date.now(),
```
},

},

```js
}

);

// console.log(entry);

res.redirect(entry.redirectURL);

};

module.exports = {
```
handleGenerateNewShortURL,

handleGetAnalytics,

handleRedirectURL,

```js
};
```
createdBy: req.user._id, Middleware auth will return the user object once it is verified.

_routes/staticRouter.js_

```js
const express = require("express");

const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {

if (!req.user) return res.redirect("/login");

const allurls = await URL.find({ createdBy: req.user._id });

return res.render("home", {

urls: allurls,

});

});

router.get("/signup", (req, res) => {

return res.render("signup");

});

router.get("/login", (req, res) => {

return res.render("login");

});

module.exports = router;
```
## Using JWT token (Stateless)

In stateful we need to maintain a state in the backend.

**Issue in stateful:**

1.  Due to some reason, if our server restarts or our state is lost, all users will be logged off and they need to login again.
2.  Memory intensive. It uses server memory

**What if you store the session in the database?**

-   It will increase the latency. If we store it in a database then we need to query the database to check if the user is authenticated or not. This might be in delay on each request.
-   It will increase the read operation for DB. This will increase the database bill

In Stateless, we need to keep in the backend. Our payload will be stored in a token. So even after restart, we can check the token and get the payload to verify it.

We need to install the library to use the jwt token.

-   npm i jsonwebtoken

### Update service/auth.js

```js
const jwt= require("jsonwebtoken");

const secret = "Rishabh@123";

function setUser(user) {

const payload = {
```
_id:user._id,

email:user.email

```js
}

return jwt.sign(payload,secret);

}

function getUser(token) {

if (!token) return null;

try {

return jwt.verify(token, secret)
```
} catch (error) {

```js
console.log(error);

return null;

}

}

module.exports = {
```
setUser,

getUser,

```js
};
```
### Update controllers/user.js

```js
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");

const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {

const { name, email, password } = req.body;

await User.create({
```
name,

email,

password,

```js
});

return res.redirect("/");

}

async function handleUserLogin(req, res) {

const { email, password } = req.body;

const user = await User.findOne({ email, password });
```
if (!user)

```js
return res.render("login", {

error: "Invalid Username or Password",

});

const token=setUser(user);

res.cookie("uid", token);

return res.redirect("/");

}

module.exports = {
```
handleUserSignup,

handleUserLogin,

```js
};
```
## What are Cookies in NodeJS?

We need to secure the token when we are transferring to the user. We have two ways

1.  Cookie
2.  Response
3.  **Cookie:**

-   Cookies are secured. Cookies are domain specified. That means if you created for your domain then it will come in the request from your domain only.
-   Also, we can set the expiration time for the cookie
-   But it will not work in mobile application as cookie is browser specific

1.  Response: we can return the token in the response res.json({token}). Now it will be the user's responsibility to pass this token in the request which the user can do by adding the token in the authorization header.

    ```js
    Authorization : Bearer <token>
    ```
### JWT in response

### controllers/user.js

```js
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");

const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {

const { name, email, password } = req.body;

await User.create({
```
name,

email,

password,

```js
});

return res.redirect("/");

}

async function handleUserLogin(req, res) {

const { email, password } = req.body;

const user = await User.findOne({ email, password });
```
if (!user)

```js
return res.render("login", {

error: "Invalid Username or Password",

});

const token=setUser(user);

// res.cookie("uid", token);

// return res.redirect("/");

return res.json({token});

}

module.exports = {
```
handleUserSignup,

handleUserLogin,

```js
};
```
middlewares/auth.js

```js
const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {

// const userUid = req.cookies?.uid;

const userUid = req.headers["Authorization"]

if (!userUid) return res.redirect("/login");

const token = userUid.split("Bearer ")[1];

const user = getUser(token);

console.log(user);

if (!user) return res.redirect("/login");

req.user = user;

next();

}

async function checkAuth(req, res, next) {

const userUid = req.headers["Authorization"]

if (!userUid) return res.redirect("/login");

const token = userUid.split("Bearer ")[1];

const user = getUser(token);

req.user = user;

next();

}

module.exports = {
```
restrictToLoggedinUserOnly,

checkAuth,

```js
};
```
## Authorization in NodeJS

Restrict users as per their roles.

### Update middleware/auth.js

```js
const { getUser } = require("../service/auth");

const checkforAuthentication = (req, res, next) => {
```
**const tokenCookie = req.cookies?.token;**

**req.user = null;**

**if (!tokenCookie) return next();**

**const user = getUser(tokenCookie);**

```js
req.user = user;

return next();

};
```
//Restrict

```js
const restrictTo = (roles = []) => {

return function (req, res, next) {

if (!req.user) return res.redirect("/login");

if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

return next();

};

};

module.exports = {
```
checkforAuthentication,

restrictTo,

```js
};
```
### index.js

```js
const express = require("express");

const { connectToMongoDB } = require("./connect");

const cookieParser = require("cookie-parser");

const urlRouter = require("./routes/url");

const staticRouter = require("./routes/staticRouter");

const userRouter = require("./routes/user");

const { **checkforAuthentication, restrictTo** } = require("./middlewares/auth");

const path = require("path");

const URL = require("./models/url");

const app = express();

const PORT = 8001;
```
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")

```js
.then(() => console.log("Mongodb connected"))

.catch((error) => console.log(error));

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
```
**app.use(checkforAuthentication)**

**app.use("/url", restrictTo(\["Normal","ADMIN"\]), urlRouter);**

**app.use("/user", userRouter);**

**app.use("/", staticRouter);**

```js
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```
### Update models/user.js

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
```
{

```js
name: {

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

**role:{**

**type: String,**

**required: true,**

### default:"Normal"

**},**

```js
password: {

type: String,

required: true,
```
},

},

{ timestamps: true }

```js
);

const User = mongoose.model("user", userSchema);

module.exports = User;
```
Remove the authentication in staticRouter

### Update routes/staticRouter.js

```js
const express = require("express");

const URL = require("../models/url");

const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/", **restrictTo(["Normal"])**, async (req, res) => {

const allurls = await URL.find({ createdBy: req.user._id });

return res.render("home", {

urls: allurls,

});

});

router.get("/signup", (req, res) => {

return res.render("signup");

});

router.get("/login", (req, res) => {

return res.render("login");

});

module.exports = router;
```
NOw we need to remove the code which we have added for cookies in res to return token

Update controllers/user.js

```js
const User = require("../models/user");

const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {

const { name, email, password } = req.body;

await User.create({
```
name,

email,

password,

```js
});

return res.redirect("/");

}

async function handleUserLogin(req, res) {

const { email, password } = req.body;

const user = await User.findOne({ email, password });
```
if (!user)

```js
return res.render("login", {

error: "Invalid Username or Password",

});

const token=setUser(user);
```
**res.cookie("token", token);**

**return res.redirect("/");**

```js
// return res.json({token});

}

module.exports = {
```
handleUserSignup,

handleUserLogin,

```js
};
```
Before test we need to add Role in existing users from mongoDB

### Select your database

-   show dbs
-   use short-url

### Add role in existing all users

-   db.users.updateMany({},{$set:{role:"Normal"}})

Update **service/auth.js** to add role in token

```js
const jwt= require("jsonwebtoken");

const secret = "Rishabh@123";

function setUser(user) {

const payload = {
```
_id:user._id,

email:user.email,

### role:user.role

```js
}

return jwt.sign(payload,secret);

}

function getUser(token) {

if (!token) return null;

try {

return jwt.verify(token, secret)
```
} catch (error) {

```js
console.log(error);

return null;

}

}

module.exports = {
```
setUser,

getUser,

```js
};
```
### Update routes/staticRouter.js

```js
const express = require("express");

const URL = require("../models/url");

const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

**router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {**
```
**const allurls = await URL.find({ });**

**return res.render("home", {**

**urls: allurls,**

**});**

**});**

```js
router.get("/", restrictTo(["Normal","ADMIN"]), async (req, res) => {

const allurls = await URL.find({ createdBy: req.user._id });

return res.render("home", {

urls: allurls,

});

});

router.get("/signup", (req, res) => {

return res.render("signup");

});

router.get("/login", (req, res) => {

return res.render("login");

});

module.exports = router;
```
To show all URLs, we need to make the role of one user as ADMIN using the below command.

### Select your database

-   show dbs
-   use short-url

### Add ADMIN role in existing user

-   db.users.updateOne({email:'[rishabh.sisodiya4@gmail.com](mailto:rishabh.sisodiya4@gmail.com)'},{$set:{role:'ADMIN'}})
