---
title: "Uploading Files with NodeJS and Multer"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 13
description: "Node.js — Uploading Files with NodeJS and Multer."
---
Setup the boiler code

Create project and install the dependencies

npm i express ejs

Create **index.js** and paste below code:

```js
const express = require("express");

const path = require("path");

const app = express();

const PORT=8000;

app.set("view engine","ejs");

app.set("views",path.resolve("./views"));

app.use(express.json());

app.get("/", (req, res) =>{

return res.render("homepage");
```
})

```js
app.listen(PORT, () => console.log("Server started at ",PORT) )
```
Create views/homepage.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<meta charset="UTF-8">`

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

<title>File uploads</title>

`</head>`

`<body>`

<form>

<input type="file" name="profileImage" />

<button type="submit">Upload</button>

</form>

`</body>`

`</html>`

Let’s install multer

[https://www.npmjs.com/package/multer](https://www.npmjs.com/package/multer)

npm i multer

### Update index.js

```js
const express = require("express");

const path = require("path");

const multer = require("multer");

const app = express();

const PORT = 8000;

const storage = multer.diskStorage({

destination: function (req, file, cb) {

cb(null, "./uploads");
```
},

```js
filename: function (req, file, cb) {

const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

cb(null, `${Date.now()}-${file.originalname}`);
```
},

```js
});

const upload = multer({ storage })

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.json());

app.get("/", (req, res) => {

return res.render("homepage");

});

app.post("/upload", upload.single("profileImage"), (req, res) => {

console.log(req.body);

console.log(req.file);

return res.redirect("/");

});

app.listen(PORT, () => console.log("Server started at ", PORT));
```
### Update views/homepage.ejs

<!DOCTYPE html>

`<html lang="en">`

`<head>`

`<meta charset="UTF-8">`

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

<title>File uploads</title>

`</head>`

`<body>`

<form action="/upload" method="post" enctype="multipart/form-data">

<input type="file" name="profileImage" />

<button type="submit">Upload</button>

</form>

`</body>`

`</html>`

## Retrieve File data without uploading - Useful when we do not want to store the file and just forward the file to another endpoint.

### React Dropzone front end

```js
onDrop = async newFiles => {
```
**let formData = new FormData()**

```js
for (let i = 0; i < newFiles.length; i++) {

let file = newFiles[i]
```
**formData.append('files', file)**

```js
}

try {

const response = await axios.post('/upload', **formData**)
```
} catch (error) {

```js
console.log(error)

}

}
```
### Express back end

```js
**const fileUpload = require('express-fileupload')**
```
**app.use(fileUpload())**

```js
const router = require('express').Router()

**const FormData = require('form-data')**

const axios = require('axios')

router.post('/upload', preAuth, async (request, response) => {

const { files } = request
```
**const formData = new FormData()**

```js
for (let i = 0; i < files.length; i++) {

let file = files[i]
```
**formData.append('files', file**)

```js
}
```
**const formHeaders = formData.getHeaders()**

```js
try {

const { data } = await axios.post(
```
\`path/to/endpoint',

**formData**,

{

```js
headers: {
```
'Content-Type': formHeaders\['content-type'\],

...**formHeaders**,

},

```js
}

)
```
response.status(200).send(data)

} catch (error) {

response.status(400).send({ message: 'Error'})

```js
}
```
})
