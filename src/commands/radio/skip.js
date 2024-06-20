const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(client, interaction) {
    try {
      const channel = interaction.member.voice.channel;
      if (!channel) {
        interaction.reply({
          content: 'You need to be in a voice channel to skip a song.',
          ephemeral: true,
        });
        return;
      }

      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue) {
        interaction.reply({
          content: 'No song is currently playing.',
          ephemeral: true,
        });
        return;
      }

      const wasSkipped = queue.node.skip();
      if (wasSkipped) {
        interaction.reply({
          content: 'Skipped the current song.',
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: 'Cannot skip, no next song in the queue.',
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log(`Error while trying to skip: ${e}`);
      interaction.reply({
        content: 'An error occurred while trying to skip the song.',
        ephemeral: true,
      });
    }
  },
};
