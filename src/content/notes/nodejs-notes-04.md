---
title: "Command line"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 4
description: "Node.js — Command line."
---
The usual way to run a Node.js program is to run the globally available node command

-   node app.js

Above, you are explicitly telling the shell to run your script with node. You can also embed this information into your JavaScript file with a "shebang" line. The "shebang" is the first line in the file, and tells the OS which interpreter to use for running the script. Below is the first line of JavaScript:

#!/usr/bin/node

**To use a shebang, your file should have executable permission. You can give app.js the executable permission by running:**

-   chmod u+x app.js

### Pass string as argument to node instead of file path

```js
-   node -e "console.log(123)"
    ```
    ### Restart the application automatically

    -   node --watch app.js

    ### How to read environment variables from Node.js

    -   USER_ID=239482 USER_KEY=foobar node app.js

    ### To access it

    process.env.USER_ID; // "239482"

    process.env.USER_KEY; // "foobar"

    ### Run app.js file with environment variables set in .env file

    -   node --env-file=.env app.js

    **REPL stands for Read Evaluate Print Loop**, and it is a programming language environment (basically a console window) that takes a single expression as user input and returns the result back to the console after execution. The REPL session provides a convenient way to quickly test simple JavaScript code.

    ### The _ special variable

    If after some code you type _, that is going to print the result of the last operation.

    ### The Up arrow key

    If you press the up arrow key, you will get access to the history of the previous lines of code executed in the current, and even previous REPL sessions.

    ### Dot commands

    The REPL has some special commands, all starting with a dot .. They are

    -   .help: shows the dot commands help
    -   .editor: enables editor mode, to write multiline JavaScript code with ease. Once you are in this mode, enter ctrl-D to run the code you wrote.
    -   .break: when inputting a multi-line expression, entering the .break command will abort further input. Same as pressing ctrl-C.
    -   .clear: resets the REPL context to an empty object and clears any multi-line expression currently being input.
    -   .load: loads a JavaScript file, relative to the current working directory
    -   .save: saves all you entered in the REPL session to a file (specify the filename)
    -   .exit: exits the repl (same as pressing ctrl-C two times)

    The REPL knows when you are typing a multi-line statement without the need to invoke .editor.

    **We can also format pretty phrases by passing variables and a format specifier.**

    For example:

    ```js
console.log('My %s has %d ears', 'cat', 2);
```
-   %s format a variable as a string
-   %d format a variable as a number
-   %i format a variable as its integer part only
-   %o format a variable as an object

### Calculate the time spent

You can easily calculate how much time a function takes to run, using time() and timeEnd()

```js
const doSomething = () => console.log('test');

const measureDoingSomething = () => {
```
**console.time('doSomething()');**

// do something, and measure the time it takes

```js
doSomething();
```
**console.timeEnd('doSomething()');**

```js
};

measureDoingSomething();
```
**The simplest way to go about colouring the console output is by using a library.**

Chalk is such a library, and in addition to colouring it also helps with other styling facilities, like making text bold, italic or underlined.

You install it with npm install chalk, then you can use it:

```js
const chalk = require('chalk');

console.log(chalk.yellow('hi!'));
```
### Accept input from the command line in Node.js

Node.js since version 7 provides the readline module to perform exactly this: get input from a readable stream such as the process.stdin stream, which during the execution of a Node.js program is the terminal input, one line at a time.

```js
const readline = require('node:readline');

const rl = readline.createInterface({

input: process.stdin,

output: process.stdout,

});

rl.question(`What's your name?`, name => {

console.log(`Hi ${name}!`);

rl.close();

});
```

A more complete and abstract solution is provided by the Inquirer.js package.

You can install it using npm install inquirer, and then you can replicate the above code like this

```js
const inquirer = require('inquirer');

const questions = [
```
{

```js
type: 'input',

name: 'name',

message: "What's your name?",
```
},

```js
];

inquirer.prompt(questions).then(answers => {

console.log(`Hi ${answers.name}!`);

});
```
