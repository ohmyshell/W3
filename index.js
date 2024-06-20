require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const callCommands = require('./src/functions/callCommands');
const deployCommands = require('./src/functions/deployCommands');
const commandHandler = require('./src/events/client/commandHandler');
const radioEventHandlers = require('./src/events/radio/radioEvents');
const logging = require('./src/functions/logging/logging');
const ready = require('./src/events/client/ready');
const { Player } = require('discord-player');

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

const player = new Player(client);
client.player = player;
Object.entries(radioEventHandlers).forEach(([event, handler]) => {
  client.player.events.on(event, (...args) => handler(client, ...args));
});

async function loadAsync() {
  await player.extractors.loadDefault();
}
loadAsync();

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'src', 'commands');
callCommands(client, foldersPath);
deployCommands();
commandHandler(client);

ready(client);

const ClientToken = process.env.BuySellToken;
client.login(ClientToken);
