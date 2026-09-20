---
title: "Get started with MongoDB"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 8
description: "Node.js — Get started with MongoDB."
---
MongoDB is a NoSQL document database with the scalability and flexibility that you want with the querying and indexing that you need.. It stores data in a type of JSON format called BSON.

Install MongoDb in your machine or we can use mongoDB cloud as well

[https://www.mongodb.com/docs/manual/administration/install-on-linux/](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

Linux commands:

sudo systemctl start mongod

sudo systemctl status mongod

mongosh

A **collection** is a grouping of MongoDB documents. Documents within a collection can have different fields. A collection is the equivalent of a table in a relational database system. A collection exists within a single database

**Mongoose**: Mongoose is an ODM (Object Data Modeling) library for MongoDB.

What is a schema?

A schema defines the structure of your collection documents. A Mongoose schema maps directly to a MongoDB collection.

npm i mongoose

Let;s install nodemon so that we do not need to restart again for the changes except module import part changes

npm i nodemon -D

Replace "start": "node index" to "start": "nodemon index" in the package.json

## Connect MongoDB

```js
const express = require("express");

const fs = require("fs");

const mongoose =require("mongoose");

const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;
```
//connect MongoDB

```js
mongoose.connect('mongodb://127.0.0.1:27017/crud').then(()=>console.log("MongoDb connected")).catch( (err) => console.log(err))
```
//Schema

```js
const userSchema = new mongoose.Schema({
```
firstName:{

type:String,

required:true

},

lastName:{

type:String,

},

email:{

type:String,

required:true,

unique:true

},

jobTitle:{

type:String,

},

gender:{

type:String,

```js
}
```
})

//Model

```js
const User = mongoose.model("user",userSchema)
```
//Middleware plugin

```js
app.use(express.urlencoded({extended:false}))
```
// Middleware logger for requests

```js
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
if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {

```js
return res.status(400).json({message:"All fields are required."})

}
```
users.push({id:users.length+1, ...body})

```js
fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (error, result)=>{

return res.status(201).json({"status":"Success", "id":users.length});
```
})

})

```js
app.listen(PORT, ()=> console.log("Server started at PORT",PORT))
```
## CRUD operation using mongoose

```js
const express = require("express");

const fs = require("fs");

const mongoose = require("mongoose");

const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;
```
//connect MongoDB

mongoose

.connect("mongodb://127.0.0.1:27017/crud")

```js
.then(() => console.log("MongoDb connected"))

.catch((err) => console.log(err));
```
//Schema

```js
const userSchema = new mongoose.Schema(
```
{

```js
firstName: {

type: String,

required: true,
```
},

```js
lastName: {

type: String,
```
},

```js
email: {

type: String,

required: true,

unique: true,
```
},

```js
jobTitle: {

type: String,
```
},

```js
gender: {

type: String,
```
},

},

{ timestamps: true }

); // timestamps will automatically add createdAT and updatedAt field

//Model

```js
const User = mongoose.model("user", userSchema);
```
//Middleware plugin

```js
app.use(express.urlencoded({ extended: false }));
```
// Middleware logger for requests

```js
app.use((req, res, next) => {
```
fs.appendFile(

"log.txt",

\`\\n ${Date.now()} : ${req.method} : ${req.path}\`,

```js
(error, result) => {

next();

}

);

});
```
// routes

```js
app.get("/users", async (req, res) => {

const allDBUsers = await User.find({});

const html = `
```
<ul>

```js
${allDBUsers.map((user) => `<li>${user.firstName}</li>`).join("")}
```
</ul>

```js
`;

return res.status(200).send(html);

});

app.get("/api/users", async (req, res) => {

const allDBUsers = await User.find({});

return res.status(200).json(allDBUsers);

});
```
app

.route("/api/users/:id")

```js
.get(async (req, res) => {

try{

const user = await User.findById(req.params.id);
```
if (!user) {

```js
return res.status(404).json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json(user)
```
}catch(error){

```js
return res.status(400).json({ message: `${err.reason}` });

}
```
})

```js
.patch(async (req, res) => {

const body = req.body;

try{

const user = await User.findByIdAndUpdate(req.params.id, body);
```
if (!user) {

```js
return res.status(404).json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json(user);
```
}catch(err){

```js
return res.status(400).json({ message: `${err.reason}` });

}
```
})

```js
.delete(async (req, res) => {

try{

const user = await User.findByIdAndDelete(req.params.id);
```
if (!user) {

```js
return res.status(404).json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json({ message: "Success. User Deleted" });
```
}catch(error){

```js
return res.status(400).json({ message: `${err.reason}` });

}

});

app.post("/api/users/", async (req, res) => {

const body = req.body;
```
if (

!body ||

!body.first_name ||

!body.last_name ||

!body.email ||

!body.gender ||

!body.job_title

) {

return res.status(400).json({ message: "All fields are required." });

```js
}

const result = await User.create({

firstName: body.first_name,

lastName: body.last_name,

email: body.email,

gender: body.gender,

jobTitle: body.job_title,

});

console.log(result);

return res.status(201).json({ message: "Success. User created" });

});

app.listen(PORT, () => console.log("Server started at PORT", PORT));
```
## Model View Controller in NodeJS

We are following the model view controller pattern to restructure our crud app.

Create 4 folders

-   models: All models schemas
-   controllers: All routes handlers
-   views: HTML
-   routes: All routes path
-   middlewares: All middleware

### index.js

```js
const express = require("express");

const userRouter = require("./routes/users");

const { connectMongoDB} = require("./connection");

const { logReqRes } = require("./middlewares");

const app = express();

const PORT = 8000;

const url = "mongodb://127.0.0.1:27017/crud"

connectMongoDB(url).then( ()=> console.log("MongoDB connected")).catch( error => console.log(error));
```
//Middleware plugin

```js
app.use(express.urlencoded({ extended: false }));
```
// Middleware logger for requests

```js
app.use(logReqRes("log.txt"));
```
//routes

```js
app.use("/api/users",userRouter)

app.listen(PORT, () => console.log("Server started at PORT", PORT));
```
### connection.js

```js
const mongoose = require("mongoose");

async function connectMongoDB(url){

return await mongoose.connect(url)

}

module.exports = {
```
connectMongoDB

```js
}
```
### controllers/user.js

```js
const { User } = require("../models/users");

const handleGetAllUsers = async (req, res) => {

const allDBUsers = await User.find({});

return res.status(200).json(allDBUsers);

};

const handleGetUserById = async (req, res) => {

try {

const user = await User.findById(req.params.id);
```
if (!user) {

```js
return res
```
.status(404)

```js
.json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json(user);
```
} catch (error) {

```js
return res.status(400).json({ message: `${error.reason}` });

}

};

const handleUpdateUserById = async (req, res) => {

const body = req.body;

try {

const user = await User.findByIdAndUpdate(req.params.id, body);
```
if (!user) {

```js
return res
```
.status(404)

```js
.json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json(user);
```
} catch (err) {

```js
return res.status(400).json({ message: `${err.reason}` });

}

};

const handleDeleteUserById = async (req, res) => {

try {

const user = await User.findByIdAndDelete(req.params.id);
```
if (!user) {

```js
return res
```
.status(404)

```js
.json({ status: `No user found with id ${req.params.id}` });

}

return res.status(200).json({ message: "Success. User Deleted" });
```
} catch (error) {

```js
return res.status(400).json({ message: `${err.reason}` });

}

};

const handleCreateUser = async (req, res) => {

const body = req.body;
```
if (

!body ||

!body.first_name ||

!body.last_name ||

!body.email ||

!body.gender ||

!body.job_title

) {

return res.status(400).json({ message: "All fields are required." });

```js
}

const result = await User.create({

firstName: body.first_name,

lastName: body.last_name,

email: body.email,

gender: body.gender,

jobTitle: body.job_title,

});

console.log(result);

return res.status(201).json({ message: "Success. User created", id: result._id });

};

module.exports = {
```
handleGetAllUsers,

handleGetUserById,

handleUpdateUserById,

handleDeleteUserById,

handleCreateUser

```js
};
```
### middlewares/index.js

```js
const fs = require("fs");

function logReqRes(filename) {

return ((req, res, next) => {
```
fs.appendFile(

filename,

\`\\n ${Date.now()} : ${req.method} : ${req.path}\`,

```js
(error, result) => {

next();

}

);

});

}

module.exports ={
```
logReqRes

```js
}
```
### models/user.js

```js
const mongoose = require("mongoose");
```
//Schema

```js
const userSchema = new mongoose.Schema(
```
{

```js
firstName: {

type: String,

required: true,
```
},

```js
lastName: {

type: String,
```
},

```js
email: {

type: String,

required: true,

unique: true,
```
},

```js
jobTitle: {

type: String,
```
},

```js
gender: {

type: String,
```
},

},

{ timestamps: true }

); // timestamps will automatically add createdAT and updatedAt field

//Model

```js
const User = mongoose.model("user", userSchema);

module.exports = { User}
```
### routes/user.js

```js
const express = require("express");

const {
```
handleGetAllUsers,

handleGetUserById,

handleUpdateUserById,

handleDeleteUserById,

handleCreateUser,

```js
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateUser);
```
router

.route("/:id")

.get(handleGetUserById)

.patch(handleUpdateUserById)

```js
.delete(handleDeleteUserById);

module.exports = router;
```
