---
title: "Introduction"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 1
description: "Node.js — Introduction."
---
Node.js is a single-threaded, open-source, cross-platform runtime environment for building fast and scalable server-side and networking applications. It runs on the V8 JavaScript runtime engine, and it uses event-driven, non-blocking I/O architecture, which makes it efficient and suitable for real-time applications.

### Installation

### sudo apt-get install -y nodejs

### sudo apt install npm

**nvm** allows you to quickly install and use different versions of node via the command line.

1.  Install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

1.  nvm install node # "node" is an alias for the latest version

[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

1.  nvm install 20

### How to use nvm

$ nvm use 16

Now using node v16.9.1 (npm v7.21.1)

$ node -v

v16.9.1

$ nvm use 14

Now using node v14.18.0 (npm v6.14.15)

$ node -v

v14.18.0

$ nvm install 12

Now using node v12.22.6 (npm v6.14.5)

$ node -v

v12.22.6

### Update node.js

Using NPM:

To update Node using NPM, do the following:

-   Open the Terminal and check your current Node version:

node -v

-   Install n package using the following command:

npm install -g n

-   This command will install a tool called "n" which you can use to update Node easily.

To update Node, run the following command in your terminal:

n latest

n stable

This command will install the latest version of Node on your system.

-   Now you can verify that your update is complete by rechecking your Node version:

node -v

### Differences between Node.js and the Browser

| Nodejs | Browser |
| --- | --- |
| We don't have the document, window and all the other objects that are provided by the browser | Browser provides DOM, or other Web Platform APIs like Cookies to interact with the browser |
| Node.js provides filesystem access functionality and other functionality through its modules | We don't have all the nice APIs that Node.js provides through its modules. |
| in Node.js you control the environment. Unless you are building an open source application that anyone can deploy anywhere, you know which version of Node.js you will run the application on | You don't get the luxury to choose what browser your visitors will use, this is very convenient. |
| Node.js supports both the CommonJS and ES module systems (since Node.js v12). This means we can use both require() and import in Node.js | ES Modules standard being implemented. We are limited to import in the browser |

### NPM

npm manages downloads of dependencies of your project.

Installing all dependencies

If a project has a package.json file, by running

-   npm install

Installing a single package

You can also install a specific package by running

-   npm install <package-name>

**Often you'll see more flags added to this command:**

-   –save install and adds the entry to the package.json file
-   \--save-dev install and adds the entry to the package.json file devDependencies
-   \--no-save install but does not add the entry to the package.json file dependencies
-   \--save-optional install and adds the entry to the package.json file optionalDependencies
-   \--no-optional will prevent optional dependencies from being installed

Modules in Nodejs

Module in Node. js is a simple or complex functionality organized in single or multiple JavaScript files which can be reused throughout the Node. js application. Each module in Node. js has its own context, so it cannot interfere with other modules or pollute global scope.

math.js

```js
function add(a,b){

return a+b;

}

function sub(a,b){

return a+b;

}

module.exports = {
```
add, sub

```js
}
```
We can also use exports object to export the functions

```js
exports.add = function add(a,b){

return a+b;

};

exports.sub = function add(a,b){

return a+b;

};
```
index.js

```js
const {add, sub} = require("./math");

console.log("Math value is ", add(1, 2));
```
To use the function in another module, we can export it using module.exports and later destructure it in the another module.

We have two ways to import the module and packages.

### 1. require: The CommonJS Syntax

The require function has been a part of Node.js since the beginning and is based on the CommonJS module system. It is used to import modules from external files and libraries. Here's an example:

```js
const http = require('http');
```
In this code snippet, we are using require to import the built-in http module.

Key characteristics of require:

-   Synchronous: The require function is synchronous, meaning it blocks other operations until the module is loaded.
-   Default exports: The require function imports the module's default export.
-   Caching: Once a module is required, Node.js caches it, so subsequent require calls return the same instance.

### 2. import: The ECMAScript Module Syntax

With the introduction of ECMAScript modules (ESM) in Node.js, the import syntax allows for a more modern and standardized approach to module imports. Here's an example:

```js
import readFile from 'fs';
```
In this code snippet, we are using import to import the readFile function from the built-in fs module.

Key characteristics of import:

-   Asynchronous: The import statement is asynchronous, allowing other operations to run while the module is being fetched.
-   Named exports: The import syntax allows for importing specific functions or variables from a module using named imports.
-   No caching: Unlike require, the import statement doesn't cache modules, resulting in a fresh instance every time it is imported.

### Choosing the Right Approach

When it comes to choosing between require and import, there are a few factors to consider. Here's a summary of the use cases for each:

Use require when:

-   Working with CommonJS modules
-   Needing synchronous behaviour
-   Importing default exports

Use import when:

-   Working with ECMAScript modules
-   Requiring asynchronous behaviour
-   Importing specific functions or variables

It’s important to note that while Node.js has added support for ECMAScript modules, many third-party packages still use the CommonJS syntax and can only be imported with require. Therefore, it's common to use a mix of both approaches in a Node.js project.
