const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription(
      'Makes an announcement with a title, text, and other options.'
    )
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the announcement (required)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('The content of the announcement')
    )
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('A URL to link in the embed title or description')
    )
    .addStringOption((option) =>
      option
        .setName('author')
        .setDescription('The name of the announcement author')
    )
    .addStringOption((option) =>
      option
        .setName('author_icon')
        .setDescription("A URL to the author's icon image")
    )
    .addStringOption((option) =>
      option.setName('thumbnail').setDescription('A URL to a thumbnail image')
    )
    .addStringOption((option) =>
      option
        .setName('color')
        .setDescription(
          'A hexadecimal color code (e.g., #00ffff) for the embed'
        )
    )
    .addBooleanOption((option) =>
      option
        .setName('footer')
        .setDescription(
          "Include a footer with your bot's name and icon? (defaults to true)"
        )
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription(
          'The channel to send the announcement to (defaults to current channel)'
        )
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(_, interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');
    const url = interaction.options.getString('url');
    const channel =
      interaction.options.getChannel('channel') || interaction.channel;

    const embed = new EmbedBuilder()
      .setColor(
        interaction.options.getString('color')
          ? parseInt(
              interaction.options.getString('color').replace('#', '0x'),
              16
            )
          : 0x00ffff
      )
      .setTitle(title)
      .setDescription(content);

    if (interaction.options.getString('author')) {
      embed.setAuthor({
        name: interaction.options.getString('author'),
        iconURL: interaction.options.getString('author_icon'),
      });
    }
    if (interaction.options.getString('url')) {
      embed.setURL(interaction.options.getString('url'));
    }

    if (interaction.options.getString('thumbnail')) {
      embed.setThumbnail(interaction.options.getString('thumbnail'));
    }

    const includeFooter = interaction.options.getBoolean('footer') !== false;
    if (includeFooter) {
      embed.setFooter({
        text: `${interaction.client.user.username}`,
        iconURL: interaction.client.user.avatarURL(),
      });
    }

    await channel.send({ embeds: [embed] });

    interaction.reply({ content: 'Announcement sent!', ephemeral: true });
  },
};
