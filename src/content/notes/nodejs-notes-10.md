---
title: "Server Side Rendering"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 10
description: "Node.js — Server Side Rendering."
---
We have templating engine which renders the HTML web page

-   EJS (Embedded JavaScript)
-   Pubg

Install EJS

npm i ejs

We need to add below code just after db connection

```js
app.set("view engine","ejs");

app.set("views",path.resolve("./views"));
```
Return the ejs file in views/home.ejs file

```js
app.get("/test", async (req, res) =>{

const allURLs = await URL.find({})

return res.render('home',{urls:allURLs});
```
})

views/home.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<meta charset="UTF-8">`

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

```html
<head>
  <title>URL Shortener App</title>
</head>
<body>
  <h1>Hello from HTML Server</h1>
  <% urls.forEach(url => { %>
    <li><%= url.shortId %></li>
  <% }) %>
</body>
</html>
```

## Create Views using EJS for URL shortener App

### Update index.js

```js
const express = require("express");

const { connectToMongoDB } = require("./connect");

const urlRouter = require("./routes/url");

const staticRouter = require("./routes/staticRouter");

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

app.use("/url", urlRouter);

app.use("/",staticRouter);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```
### Update controllers/url.js

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

**const handleRedirectURL = async (req, res) => {**
```
**const shortId = req.params.shortId;**

**const entry = await URL.findOneAndUpdate(**

**{**

**shortId,**

**},**

**{**

**$push: {**

**visitHistory: {**

**timestamp: Date.now(),**

**},**

**},**

**}**

**);**

```js
**// console.log(entry);**
```
**res.redirect(entry.redirectURL);**

**};**

```js
module.exports = {
```
handleGenerateNewShortURL,

handleGetAnalytics,

handleRedirectURL,

```js
};
```
models/url.js remain unchanged

### Update routes/url.js

```js
const express = require("express");

const {
```
handleGenerateNewShortURL,

handleGetAnalytics,

**handleRedirectURL**,

```js
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);
```
**router.get("/:shortId", handleRedirectURL);**

```js
module.exports = router;
```
### Create routes/staticRouter.js

```js
const express = require("express");

const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req,res)=>{

const allURLS = await URL.find({});

return res.render("home",{urls:allURLS})
```
})

```js
module.exports = router;
```
### Create views/home.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<meta charset="UTF-8" />`

`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

<title>URL shortener App</title>

`</head>`

```html
<body>
  <h1>URL Shortener</h1>

  <% if (locals.id) { %>
    <p>URL Generated: http://localhost:8001/url/<%= id %></p>
  <% } %>

  <form method="post" action="/url">
    <label>Enter your original URL:</label>
    <input type="text" name="url" placeholder="https://example.com" />
    <button type="submit">Generate</button>
  </form>

  <% if (locals.urls) { %>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Short ID</th>
          <th>Redirect URL</th>
          <th>Clicks</th>
        </tr>
      </thead>
      <tbody>
        <% urls.forEach((url, index) => { %>
          <tr>
            <td><%= index + 1 %></td>
            <td><%= url.shortId %></td>
            <td><%= url.redirectURL %></td>
            <td><%= url.visitHistory.length %></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  <% } %>
</body>
</html>
```

package.json

{

```js
"name": "short-url",

"version": "1.0.0",

"description": "",

"main": "index.js",

"scripts": {

"start": "nodemon index.js"
```
},

```js
"author": "",

"license": "ISC",

"dependencies": {

"ejs": "^3.1.9",

"express": "^4.19.2",

"mongoose": "^8.2.3",

"shortid": "^2.2.16"
```
},

```js
"devDependencies": {

"nodemon": "^3.1.0"

}

}
```
