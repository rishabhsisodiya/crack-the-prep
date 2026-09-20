---
title: "File handling"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 2
description: "Node.js — File handling."
---
### Nodejs File stats

Every file comes with a set of details that we can inspect using Node.js. In particular, using the stat() method provided by the fs module.

```js
const fs = require('node:fs');

fs.stat('test.txt', (err, stats) => {
```
if (err) {

```js
console.error(err);

}
```
// we have access to the file stats in \`stats\`

```js
console.log(stats);

});
```
A lot, including:

-   if the file is a directory or a file, using stats.isFile() and stats.isDirectory()
-   if the file is a symbolic link using stats.isSymbolicLink()
-   the file size in bytes using stats.size

### Node.js File Paths

Every file in the system has a path. On Linux and macOS, a path might look like: /users/joe/file.txt while Windows computers are different, and have a structure such as: C:\\users\\joe\\file.txt

You need to pay attention when using paths in your applications, as this difference must be taken into account.

You include this module in your files using const path = require('node:path'); and you can start using its methods.

Given a path, you can extract information out of it using those methods:

-   dirname: gets the parent folder of a file
-   basename: gets the filename part
-   extname: gets the file extension

```js
const path = require('node:path');

const notes = '/users/joe/notes.txt';
```
path.dirname(notes); // /users/joe

path.basename(notes); // notes.txt

path.extname(notes); // .txt

### Working with file descriptors in Node.js

A file descriptor is a reference to an open file, a number (fd) returned by opening the file using the open() method offered by the fs module. This number (fd) uniquely identifies an open file in operating system:

```js
const fs = require('node:fs');

fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
```
// fd is our file descriptor

```js
});
```

Other flags you'll commonly use are:

| Flag | Description | File gets created if it doesn't exist |
| --- | --- | --- |
| r+ | This flag opens the file for reading and writing | ❌ |
| w+ | This flag opens the file for reading and writing and it also positions the stream at the beginning of the file | ✅ |
| a | This flag opens the file for writing and it also positions the stream at the end of the file | ✅ |
| a+ | This flag opens the file for reading and writing and it also positions the stream at the end of the file | ✅ |

**You can use util.promisify to convert fs methods into promise-based methods.**

### Reading files with Node.js

The simplest way to read a file in Node.js is to use the fs.readFile() method, passing it the file path, encoding and a callback function that will be called with the file data (and the error):

```js
const fs = require('node:fs');

fs.readFile('/Users/joe/test.txt', **'utf8'**, (err, data) => {
```
if (err) {

```js
console.error(err);

return;

}

console.log(data);

});
```

Alternatively, you can use the synchronous version fs.readFileSync():

```js
const fs = require('node:fs');

try {

const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');

console.log(data);
```
} catch (err) {

```js
console.error(err);

}
```

Basic difference is readFileSync is returning the data but readFile is not returning instead we need to handle it with a callback function.

### Writing files with Node.js

The easiest way to write to files in Node.js is to use the fs.writeFile() API.

```js
const fs = require('node:fs');

const content = 'Some content!';

fs.writeFile('/Users/joe/test.txt', content, err => {
```
if (err) {

```js
console.error(err);
```
} else {

// file written successfully

```js
}

});
```

### Writing a file synchronously

Alternatively, you can use the synchronous version fs.writeFileSync():

```js
const fs = require('node:fs');

const content = 'Some content!';

try {

fs.writeFileSync('/Users/joe/test.txt', content);
```
// file written successfully

} catch (err) {

```js
console.error(err);

}
```

The flags you'll likely use are

| Flag | Description | File gets created if it doesn't exist |
| --- | --- | --- |
| r+ | This flag opens the file for reading and writing | ❌ |
| w+ | This flag opens the file for reading and writing and it also positions the stream at the beginning of the file | ✅ |
| a | This flag opens the file for writing and it also positions the stream at the end of the file | ✅ |
| a+ | This flag opens the file for reading and writing and it also positions the stream at the end of the file | ✅ |

### Appending content to a file

A handy method to append content to the end of a file is fs.appendFile() (and its fs.appendFileSync() counterpart):

```js
const fs = require('node:fs');

const content = 'Some content!';

fs.appendFile('file.log', content, err => {
```
if (err) {

```js
console.error(err);
```
} else {

// done!

```js
}

});
```

### Working with folders in Node.js

The Node.js fs core module provides many handy methods you can use to work with folders.

### Check if a folder exists

Use fs.access() (and its promise-based fsPromises.access() counterpart) to check if the folder exists and Node.js can access it with its permissions.

### Create a new folder

Use fs.mkdir() or fs.mkdirSync() or fsPromises.mkdir() to create a new folder.

```js
const fs = require('node:fs');

const folderName = '/Users/joe/test';

try {
```
if (!fs.existsSync(folderName)) {

```js
fs.mkdirSync(folderName);

}
```
} catch (err) {

```js
console.error(err);

}
```

### Read the content of a directory

Use fs.readdir() or fs.readdirSync() or fsPromises.readdir() to read the contents of a directory.

This piece of code reads the content of a folder, both files and subfolders, and returns their relative path:

```js
const fs = require('node:fs');

const folderPath = '/Users/joe';

fs.readdirSync(folderPath);
```

**You can get the full path:**

```js
fs.readdirSync(folderPath).map(fileName => {

return path.join(folderPath, fileName);

});
```

**You can also filter the results to only return the files, and exclude the folders:**

```js
const fs = require('node:fs');

const isFile = fileName => {

return fs.lstatSync(fileName).isFile();

};
```
fs.readdirSync(folderPath)

```js
.map(fileName => {

return path.join(folderPath, fileName);
```
})

```js
.filter(isFile);
```

### Rename a folder

Use fs.rename() or fs.renameSync() or fsPromises.rename() to rename the folder. The first parameter is the current path, the second the new path:

```js
const fs = require('node:fs');

fs.rename('/Users/joe', '/Users/roger', err => {
```
if (err) {

```js
console.error(err);

}
```
// done

```js
});
```

fs.renameSync() is the synchronous version:

```js
const fs = require('node:fs');

try {

fs.renameSync('/Users/joe', '/Users/roger');
```
} catch (err) {

```js
console.error(err);

}
```

### Remove a folder

Use fs.rmdir() or fs.rmdirSync() or fsPromises.rmdir() to remove a folder.

```js
const fs = require('node:fs');

fs.rmdir(dir, err => {
```
if (err) {

```js
throw err;

}

console.log(`${dir} is deleted!`);

});
```

To remove a folder that has contents use fs.rm() with the option { recursive: true } to recursively remove the contents.

{ recursive: true, force: true } makes it so that exceptions will be ignored if the folder does not exist.

```js
const fs = require('node:fs');

fs.rm(dir, { recursive: true, force: true }, err => {
```
if (err) {

```js
throw err;

}

console.log(`${dir} is deleted!`);

});
```
