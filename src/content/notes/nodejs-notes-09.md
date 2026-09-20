---
title: "Project 1: Custom URL Shortener"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 9
description: "Node.js — Project 1: Custom URL Shortener."
---
Design a URL shortener service that takes a valid URL and returns a shortened URL, redirecting the user to previous provided URL

Also, keep track of total visits/clicks on the URL.

### Routes

-   POST /URL :- Generates a new short URL and returns the shortened URL in the format example.com/random-id.
-   GET /id :- Redirects the user to the original URL
-   GET /URL/analytics/:id :- Returns the clicks for the provided short id.

Install dependency

npm i express mongoose shortid

npm i nodemon -D

Create a model controller and routes folder.

### Create connect.js

```js
**const mongoose = require("mongoose");**
```
**async function connectToMongoDB(url) {**

**return mongoose.connect(url);**

**}**

```js
**module.exports = {**
```
**connectToMongoDB,**

**};**

### Create models/url.js

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
```
},

{ timestamps: true }

```js
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;
```
### Create controllers/url.js

```js
const shortid = require("shortid");

const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {

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

return res.json({ id: shortID });

}

async function handleGetAnalytics(req, res) {

const shortId = req.params.shortId;

const result = await URL.findOne({ shortId });

return res.json({

totalClicks: result.visitHistory.length,

analytics: result.visitHistory,

});

}

module.exports = {
```
handleGenerateNewShortURL,

handleGetAnalytics,

```js
};
```
### Create routes/url.js

```js
const express = require("express");

const {
```
handleGenerateNewShortURL,

handleGetAnalytics,

```js
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
```
### index.js

```js
**const express = require("express");**

**const { connectToMongoDB } = require("./connect");**

**const urlRoute = require("./routes/url");**

**const URL = require("./models/url");**
```
**const app = express();**

**const PORT = 8001;**

```js
**connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>**

**console.log("Mongodb connected")**

**).catch( error => console.log(error));**
```
**app.use(express.json());**

**app.use("/url", urlRoute);**

```js
**app.get("/:shortId", async (req, res) => {**
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

**res.redirect(entry.redirectURL);**

**});**

```js
**app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));**
```
