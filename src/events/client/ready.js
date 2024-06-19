const { Events, Activity, ActivityType } = require('discord.js');

module.exports = (client) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
      activities: [
        {
          type: ActivityType.Custom,
          name: 'custom',
          state: 'Invading Poland',
        },
      ],
    });
  });
};
