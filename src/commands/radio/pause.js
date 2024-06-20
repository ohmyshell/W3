const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current song'),
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.currentTrack) {
      await interaction.editReply({
        content: 'No song is currently playing.',
        ephemeral: true,
      });
      return;
    }

    queue.node.pause();
    await interaction.deleteReply();
  },
};
