---
title: "Creating Discord Bot in NodeJS"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 12
description: "Node.js — Creating Discord Bot in NodeJS."
---
Create account on discord and open it if already have account [https://discord.com/channels/@me](https://discord.com/channels/@me)

### Create discord server

1.  Create your own server by clicking on plus sign on left side bar and then click on Create My Own as shown in screenshot below:

![](/notes-img/nodejs-notes/img-008.webp)

1.  Select for a club or community
    [https://discord.com/channels/1223500106897166447/1223500106897166450](https://discord.com/channels/1223500106897166447/1223500106897166450)
2.  Now go to user settings (Gear icon) > Advanced. Enable the developer mode
    ![](/notes-img/nodejs-notes/img-009.webp)

Create Discord application

1.  Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and create an application (I have used node-bot. You can choose any name)
2.  Now go to bot on left side and update username node-bot01 add Admin permission as shown in screenshot below: ![](/notes-img/nodejs-notes/img-010.webp)
3.  Now go to Oauth2, select bot and then Administrator and copy the generated url [https://discord.com/oauth2/authorize?client_id=1223501200872181801&permissions=8&scope=bot](https://discord.com/oauth2/authorize?client_id=1223501200872181801&permissions=8&scope=bot) ![](/notes-img/nodejs-notes/img-011.webp)
4.  Now paste the url in a new tab and add it to the server (Follow the step that will appear)

Now we will use discordjs library to interact with the bot

npm install discord.js

Let’s create a new project and use it. Go to the project folder and run below commands.

-   npm init
-   npm install discord.js

Create index.js in the root folder.

Generate Token:

1.  Go to application [https://discord.com/developers/applications](https://discord.com/developers/applications), select your bot which you created
2.  Click on bot and enable MESSAGE CONTENT INTENT so that we can have access to message guild content to access the message received in the server.
3.  Click on reset token and copy the token.

As per the docs [https://discord.js.org/docs/packages/discord.js/14.14.1](https://discord.js.org/docs/packages/discord.js/14.14.1), we will copy the code from here

GatewayIntentBits -for the Permission

We will also install the dotenv package to read the token from .env.

npm install dotenv --save

Now create the .env file in root directory and paste below code:

token="YOUR_DISCORD_BOT_TOKEN"

### index.js

```js
const { Client, GatewayIntentBits } = require("discord.js");

require("dotenv").config();

const client = new Client({

intents: [
```
GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMessages,

GatewayIntentBits.MessageContent,

\],

```js
});

// const token = process.env.token;

client.on("messageCreate", (message) => {

if(message.author.bot) return ;
```
message.reply({

content:"Hi !! from Bot"

})

```js
});

client.login(token);
```
Update the command in package.json to node index.js. Now run npm start

### Command to interact with bot

```js
const { Client, GatewayIntentBits } = require("discord.js");

require("dotenv").config();

const client = new Client({

intents: [
```
GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMessages,

GatewayIntentBits.MessageContent,

\],

```js
});

// const token = process.env.token;

client.on("messageCreate", (message) => {

if (message.author.bot) return;
```
if (message.content.startsWith("create")) {

```js
const url = message.content.split("create")[1];

return message.reply({
```
content:"Generating Short ID for "+url

})

```js
}
```
message.reply({

```js
content: "Hi !! from Bot",

});

});

client.on("interactionCreate", async (interaction) => {

if (!interaction.isChatInputCommand()) return;
```
if (interaction.commandName === "ping") {

```js
await interaction.reply("Pong!");

}

});

client.login(token);
```
