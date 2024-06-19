const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server in a visual embed.'),
  async execute(_, interaction) {
    const server = interaction.guild;
    const owner = await server.members.fetch(server.ownerId);

    const embed = new EmbedBuilder()
      .setTitle(`Server Name: ${server.name}`)
      .setDescription(`Member count: ${server.memberCount}`)
      .setThumbnail(server.iconURL())
      .addFields(
        { name: 'Owner:', value: owner.displayName, inline: true },
        {
          name: 'Created at:',
          value: new Date(server.createdAt).toLocaleString(),
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
