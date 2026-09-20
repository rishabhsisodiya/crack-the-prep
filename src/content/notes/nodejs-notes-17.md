---
title: "NodeJS Streams"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 17
description: "Node.js — NodeJS Streams."
---
Let’s consider a scenario where we need to read a 400mb file and display the content on the UI. We can do it easily using the fs module but every time when we refresh it will increase the memory usage as each time it will read and send data to the client side. We can monitor it using package express-status-monitor. Each time you refresh the web page your memory consumption will increase. So this is not the efficient way to deal with it.

![](/notes-img/nodejs-notes/img-022.webp)
We can resolve it using stream which means read data in chunks. Similar to youtube where video is not buffer completely, it buffers in chunks

**A stream** is an abstract interface for working with streaming data in Node.js. The node:stream module provides an API for implementing the stream interface.

There are many stream objects provided by Node.js. For instance, a request to an HTTP server and process.stdout are both stream instances.

Streams can be readable, writable, or both. All streams are instances of EventEmitter.

![](/notes-img/nodejs-notes/img-023.webp)

Also we can see it in the network console. Transfer encoding chunked.

Chunked transfer encoding is a streaming data transfer mechanism available in Hypertext Transfer Protocol (HTTP) version 1.1, defined in RFC 9112 §7.1. In chunked transfer encoding, the data stream is divided into a series of non-overlapping "chunks". The chunks are sent out and received independently of one another.

![](/notes-img/nodejs-notes/img-024.webp)

Let’s consider another scenario where we need to zip a 400mb file. Now with old method

400mb file → read —-> 400mb zip

So it will takes twice memory

**We can use zlib to zip the files. Now we can use stream to optimize this task.**

### ![](/notes-img/nodejs-notes/img-025.webp)

**Pipe function:** its purpose is to attach a writable stream to a readable stream allowing to pass the readable stream data to the writeable stream.
