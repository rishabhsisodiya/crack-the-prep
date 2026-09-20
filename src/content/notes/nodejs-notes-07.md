---
title: "What is REST API?"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 7
description: "Node.js — What is REST API?."
---
A REST API (also called a RESTful API or RESTful web API) is an application programming interface (API) that conforms to the design principles of the representational state transfer (REST) architectural style.

1.  Return response HTML, JSON, etc
2.  Respect all HTTP methods, (GET, POST,etc)

You can generate random data json file using Fake Data API: [https://www.mockaroo.com/](https://www.mockaroo.com/)

Use below code to get

```js
const express = require("express");

const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;

app.get("/api/users", (req, res)=>{

return res.json(users);
```
})

```js
app.listen(PORT, ()=> console.log("Server started at PORT",PORT);
```
**If you use below code, and verify the endpoint. You will get undefined in the console as express is not aware about the data so We will need middleware.**

```js
**app.post("/api/users/", (req, res)=>{**
```
**const body = req.body;**

```js
**console.log(body); // undefined**
```
**return res.json({"status":"pending"});**

**})**

### index.js

```js
**const express = require("express");**

**const fs = require("fs");**

**const users = require("./MOCK_DATA.json");**
```
**const app = express();**

**const PORT = 8000;**

**//Middleware plugin**

**app.use(express.urlencoded({extended:false}))**

**// routes**

```js
**app.get("/users", (req, res)=>{**
```
### const html = `

### <ul>

```js
**${users.map( (user) => `<li>${user.first_name}</li>`).join("")}**
```
### </ul>

**\`;**

**return res.send(html);**

**})**

```js
**app.get("/api/users", (req, res)=>{**
```
**return res.json(users);**

**})**

```js
**app.post("/api/users/", (req, res)=>{**
```
**const body = req.body;**

**users.push({id:users.length+1, ...body})**

```js
**// console.log(new_users); // undefined**

**fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (error, result)=>{**
```
**return res.json({"status":"Success", "id":users.length});**

**})**

**})**

```js
**app.listen(PORT, ()=> console.log("Server started at PORT",PORT))**
```
## CRUD operation

```js
**const express = require("express");**

**const fs = require("fs");**

**const users = require("./MOCK_DATA.json");**
```
**const app = express();**

**const PORT = 8000;**

**//Middleware plugin**

**app.use(express.urlencoded({extended:false}))**

**// routes**

```js
**app.get("/users", (req, res)=>{**
```
### const html = `

### <ul>

```js
**${users.map( (user) => `<li>${user.first_name}</li>`).join("")}**
```
### </ul>

**\`;**

**return res.send(html);**

**})**

```js
**app.get("/api/users", (req, res)=>{**
```
**return res.json(users);**

**})**

**app.route("/api/users/:id")**

```js
**.get((req, res)=>{**
```
**const id = Number(req.params.id);**

```js
**const user= users.find( (user) => user.id === id);**
```
**return user ? res.json(user): res.json({"status":\`No user found with id ${id}\`});**

```js
**}).patch((req, res) =>{**
```
**const id = Number(req.params.id);**

```js
**const index= users.findIndex( (user) => user.id === id);**
```
**if (!users\[index\]) {**

**res.status(404).json({"status":`No user found with id ${id}`})**

**}**

**const body = req.body;**

**let new_user = {...users\[index\],...body};**

**users.splice(index,1,new_user);**

```js
**fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) =>{**
```
**return res.json(new_user);**

**})**

```js
**}).delete((req, res) =>{**
```
**const id = Number(req.params.id);**

```js
**let index= users.findIndex( (user) => user.id === id);**
```
**if (!users\[index\]) {**

**res.status(404).json({"status":`No user found with id ${id}`})**

**}**

**users.splice(index,1);**

```js
**// console.log(users);**

**fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) =>{**
```
**return res.status(200).json({"status":"Success", "id":id});**

**})**

**})**

```js
**app.post("/api/users/", (req, res)=>{**
```
**const body = req.body;**

**users.push({id:users.length+1, ...body})**

```js
**// console.log(new_users); // undefined**

**fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (error, result)=>{**
```
**return res.status(201).json({"status":"Success", "id":users.length});**

**})**

**})**

```js
**app.listen(PORT, ()=> console.log("Server started at PORT",PORT))**
```
### Middleware

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

[https://expressjs.com/en/guide/using-middleware.html](https://expressjs.com/en/guide/using-middleware.html)

```js
const express = require('express')

const app = express()

app.use((req, res, next) => {

console.log('Time:', Date.now())
```
next()

})

### Add logger which appends logs in log.txt

```js
const express = require("express");

const fs = require("fs");

const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;
```
//Middleware plugin

```js
app.use(express.urlencoded({extended:false}))

app.use((req, res, next) => {

fs.appendFile("log.txt",`\\n ${Date.now()} : ${req.method} : ${req.path}`, (error,result) =>{
```
next()

})

})

// routes

```js
app.get("/users", (req, res)=>{

const html = `
```
<ul>

```js
${users.map( (user) => `<li>${user.first_name}</li>`).join("")}
```
</ul>

```js
`;

return res.send(html);
```
})

```js
app.get("/api/users", (req, res)=>{

return res.json(users);
```
})

```js
app.route("/api/users/:id")

.get((req, res)=>{

const id = Number(req.params.id);

const user= users.find( (user) => user.id === id);

return user ? res.json(user): res.json({"status":`No user found with id ${id}`});

}).patch((req, res) =>{

const id = Number(req.params.id);

const index= users.findIndex( (user) => user.id === id);
```
if (!users\[index\]) {

```js
res.status(404).json({"status":`No user found with id ${id}`})

}

const body = req.body;

let new_user = {...users[index],...body};

users.splice(index,1,new_user);

fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) =>{

return res.json(new_user);
```
})

```js
}).delete((req, res) =>{

const id = Number(req.params.id);

let index= users.findIndex( (user) => user.id === id);
```
if (!users\[index\]) {

```js
res.status(404).json({"status":`No user found with id ${id}`})

}

users.splice(index,1);

// console.log(users);

fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) =>{

return res.status(200).json({"status":"Success", "id":id});
```
})

})

```js
app.post("/api/users/", (req, res)=>{

const body = req.body;
```
users.push({id:users.length+1, ...body})

```js
// console.log(new_users); // undefined

fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (error, result)=>{

return res.status(201).json({"status":"Success", "id":users.length});
```
})

})

```js
app.listen(PORT, ()=> console.log("Server started at PORT",PORT))
```
### HTTP Headers

HTTP headers let the client and the server pass additional information with an HTTP request or response. An HTTP header consists of its case-insensitive name followed by a colon (:), then by its value. Whitespace before the value is ignored.

**Always add X to the custom header.**

```js
response.setHeader('Content-Type', 'text/html');
```
