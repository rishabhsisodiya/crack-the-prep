---
title: "Express"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 6
description: "Node.js — Express."
---
```js
const express = require('express')

const app = express()

const port = 3000

app.get('/', (req, res) => {

res.send('Hello World!')
```
})

```js
app.listen(port, () => {

console.log(`Example app listening on port ${port}`)
```
})

**How Versioning Works in NodeJS?**

Let’s take an example of express

4.18.3

3rd part (Last part) - Minor Fixes (Optional)

Latest -> 4.18.5

2nd Part (Second part) - Recommended Bug Fix (Security Fix)

18 -> 19

1st Part (Major Release) - Major /Breaking up

5

### To install specific version

npm i express@4.18.2

^(carat) - Install all Recommended and Minor Fixes automatically

^4.18.3 4.18.3 < 5.0.0

~ (quickline) Approximately equivalent to version

version Must match version exactly

\>version Must be greater than version

\>=version etc

<version

<=version
