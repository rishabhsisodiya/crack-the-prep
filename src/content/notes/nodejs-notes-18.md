---
title: "How to scale NodeJs applications using the cluster module."
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 18
description: "Node.js — How to scale NodeJs applications using the cluster module.."
---
IN normal scenario we have one nodejs server and multiple users like below

![](/notes-img/nodejs-notes/img-026.webp)

But this is not scalable as with increasing user, This will increase the load on server and there will be delay in response.

**Clusters of Node.js** processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance.

### Let's understand it using code

### index.js

```js
**const express = require("express");**
```
**const app = express();**

**const PORT=8000;**

```js
**app.get("/",(req,res)=>{**
```
**return res.json({message:`Hello from express server ${process.pid}`})**

**});**

```js
**app.listen(PORT, ()=>console.log("Server started at port ",PORT))**
```
### Create another file server.js

```js
**const cluster = require("cluster");**

**const os = require("os");**

**const express = require("express");**
```
**const totalCPUs = os.cpus().length;**

```js
**// console.log("Total ",totalCPUs); // 4 CPU**
```
**if (cluster.isPrimary) {**

**for (let i = 0; i < totalCPUs; i++) {**

**cluster.fork();**

**}**

**} else {**

**const app = express();**

**const PORT = 8000;**

```js
**app.get("/", (req, res) => {**
```
**return res.json({ message: \`Hello from express server ${process.pid}\` });**

**});**

```js
**app.listen(PORT, () => console.log(`Server ${process.pid} started at port ${PORT}`));**
```
**}**

The worker processes are spawned using the child_process.fork() method, so that they can communicate with the parent via IPC and pass server handles back and forth.

The cluster module supports two methods of distributing incoming connections.

1.  The first one (and the default one on all platforms except Windows) is the round-robin approach, where the primary process listens on a port, accepts new connections and distributes them across the workers in a round-robin fashion, with some built-in smarts to avoid overloading a worker process.
2.  The second approach is where the primary process creates the listen socket and sends it to interested workers. The workers then accept incoming connections directly.
    The second approach should, in theory, give the best performance. In practice however, distribution tends to be very unbalanced due to operating system scheduler vagaries. Loads have been observed where over 70% of all connections ended up in just two processes, out of a total of eight.

Because server.listen() hands off most of the work to the primary process, there are three cases where the behaviour between a normal Node.js process and a cluster worker differs:

server.listen({fd: 7}) Because the message is passed to the primary, file descriptor 7 in the parent will be listened on, and the handle passed to the worker, rather than listening to the worker's idea of what the number 7 file descriptor references.

server.listen(handle) Listening on handles explicitly will cause the worker to use the supplied handle, rather than talk to the primary process.

server.listen(0) Normally, this will cause servers to listen on a random port. However, in a cluster, each worker will receive the same "random" port each time they do listen(0). In essence, the port is random the first time, but predictable thereafter. To listen on a unique port, generate a port number based on the cluster worker ID.

Node.js does not provide routing logic. It is therefore important to design an application such that it does not rely too heavily on in-memory data objects for things like sessions and login.

Because workers are all separate processes, they can be killed or re-spawned depending on a program's needs, without affecting other workers. As long as there are some workers still alive, the server will continue to accept connections. If no workers are alive, existing connections will be dropped and new connections will be refused. Node.js does not automatically manage the number of workers, however. It is the application's responsibility to manage the worker pool based on its own needs.

Although a primary use case for the node:cluster module is networking, it can also be used for other use cases requiring worker processes.
