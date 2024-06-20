const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the paused song'),
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue) {
      await interaction.editReply({
        content: 'No song is loaded in the queue.',
        ephemeral: true,
      });
      return;
    }

    /*if (queue.node.state !== 'paused') {
      await interaction.editReply({
        content: 'The music is already playing.',
        ephemeral: true,
      });
      return;
    }*/

    try {
      queue.node.resume();
      await interaction.editReply({
        content: 'Resumed the song!',
      });
    } catch (error) {
      console.error(`Error when trying to resume: ${error}`);
      await interaction.editReply({
        content: 'Failed to resume the song. Please try again.',
        ephemeral: true,
      });
    }
  },
};
