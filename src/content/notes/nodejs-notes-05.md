---
title: "Anatomy of an HTTP Transaction"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 5
description: "Node.js — Anatomy of an HTTP Transaction."
---
## Create the Server

Any node web server application will at some point have to create a web server object. This is done by using createServer.

```js
const http = require('node:http');

const server = http.createServer((request, response) => {
```
// magic happens here!

```js
});
```

The function that's passed in to createServer is called once for every HTTP request that's made against that server, so it's called the request handler. In fact, the Server object returned by createServer is an EventEmitter, and what we have here is just shorthand for creating a server object and then adding the listener later.

```js
const http = require('node:http');

const server = http.createServer((request, response) => {

console.log("Request Received");
```
response.end("Hello from Server")

```js
});

server.listen( 8000 ,()=> console.log("Server started"));
```

### HTTP request methods

### GET

The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.

### HEAD

The HEAD method asks for a response identical to a GET request, but without the response body.

### POST

The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.

### PUT

The PUT method replaces all current representations of the target resource with the request payload.

### DELETE

The DELETE method deletes the specified resource.

### CONNECT

The CONNECT method establishes a tunnel to the server identified by the target resource.

### OPTIONS

The OPTIONS method describes the communication options for the target resource.

### TRACE

The TRACE method performs a message loop-back test along the path to the target resource.

### PATCH

The PATCH method applies partial modifications to a resource.
