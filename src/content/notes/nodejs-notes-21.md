---
title: "Production & Deployment Tips"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 21
description: "Node.js — Production & Deployment Tips."
---
Advance / Production

1.  Always use nvm and create .nvmrc file in root directory with node version and add engines in package.json

.nvmrc

20.18.3

```js
"engines": {

"node": ">=18.17.0",

"npm": ">=9.0.0"
```
},

1.  We can use winston and a custom log error defined in logger.js in utils. Refer github repo
2.  Always add common config.js under config for all process.env
3.  We can use pm2 for managing automatic restart
4.  Add global error handler for exit

    ```js
    const ERROR_THRESHOLD = 50; _// Maximum number of consecutive errors before considering shutdown_

    const ERROR_RESET_INTERVAL = 60000; _// Reset error count after 1 minute_

    let errorCount = 0;
    ```
_// Reset error count periodically_

```js
setInterval(() => {

errorCount = 0;

}, ERROR_RESET_INTERVAL);

process.on('uncaughtException', (_error_) => {

errorCount++;

logger.logError('[Server.js] Uncaught Exception:', _error_, {errorCount });
```
_// Only exit if we're hitting too many errors too quickly_

if (errorCount >= ERROR_THRESHOLD) {

```js
logger.error(`Error threshold (${ERROR_THRESHOLD}) exceeded. Shutting down gracefully...`);
```
_// Give time for existing requests to complete_

```js
setTimeout(() => process.exit(1), 5000);

}

});

process.on('unhandledRejection', (_error_) => {

errorCount++;
```
logger.error('Unhandled Rejection:', {

```js
message: error.message,

stack: error.stack,

timestamp: new Date().toISOString(),
```
errorCount

```js
});
```
_// Only exit if we're hitting too many errors too quickly_

if (errorCount >= ERROR_THRESHOLD) {

```js
logger.error(`Error threshold (${ERROR_THRESHOLD}) exceeded. Shutting down gracefully...`);
```
_// Give time for existing requests to complete_

```js
setTimeout(() => process.exit(1), 5000);

}

});
```
