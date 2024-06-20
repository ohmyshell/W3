const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription(
      'Empties the queue and disconnects the bot from the voice channel'
    ),

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue) {
      await interaction.reply({
        content: 'There is no active music session in this server.',
        ephemeral: true,
      });
      return;
    }
    try {
      queue.node.stop(false);
      await interaction.reply({
        content:
          'Goodbye! I have left the voice channel and cleared the queue.',
        ephemeral: false,
      });
    } catch (error) {
      console.error(`Leave Command Error: ${error}`);
      await interaction.reply({
        content:
          'Failed to leave the channel and clear the queue. Please try again.',
        ephemeral: true,
      });
    }
  },
};
