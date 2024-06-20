const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue'),

  async execute(player, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.currentTrack) {
      await interaction.editReply('No song is currently playing.');
      return;
    }

    const tracks = queue.tracks.map((track, index) => {
      return `${index + 1}. [${track.title}](${track.url})`;
    });

    const embed = new EmbedBuilder()
      .setTitle('Current Queue')
      .setDescription(tracks.join('\n'))
      .setColor('#FF0000')
      .setFooter('Powered by discord-player');

    await interaction.editReply({ embeds: [embed] });
  },
};
