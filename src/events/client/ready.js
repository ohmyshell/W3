const { Events, Activity } = require('discord.js');

module.exports = (client) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Polland Collapse');
  });
};
