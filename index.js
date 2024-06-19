require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const callCommands = require('./src/functions/callCommands');
const deployCommands = require('./src/functions/deployCommands');
const commandHandler = require('./src/events/client/commandHandler');
const logging = require('./src/functions/logging/logging');
const ready = require('./src/events/client/ready');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

logging();

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'src', 'commands');
callCommands(client, foldersPath);
deployCommands();
commandHandler(client);

ready(client);

const ClientToken = process.env.BuySellToken;
client.login(ClientToken);
