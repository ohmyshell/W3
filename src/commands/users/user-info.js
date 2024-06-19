const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Username of the user to look up (optional)')
    ),

  async execute(_, interaction) {
    const targetUser = interaction.options.getUser('user');

    const member = targetUser
      ? interaction.guild.members.cache.get(targetUser.id)
      : interaction.member;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: interaction.guild.iconURL({ Dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ Dynamic: true }))
      .setColor(member.displayHexColor)
      .addFields(
        {
          name: 'Joined at:',
          value: new Date(member.joinedAt).toLocaleString(),
        },
        {
          name: 'Roles:',
          value: member.roles.cache
            .filter((role) => !role.isEveryone)
            .map((role) => role.name)
            .join(', '),
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
