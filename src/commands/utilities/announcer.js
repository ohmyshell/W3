const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require('discord.js');

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

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
    try {
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
      if (!title) {
        throw new Error('Title is required and was not provided.');
      }

      const content = interaction.options.getString('content');
      const url = interaction.options.getString('url');
      if (url && !isValidHttpUrl(url)) {
        throw new Error(
          'Provided URL is invalid. Please enter a valid URL starting with http:// or https://'
        );
      }

      const authorIcon = interaction.options.getString('author_icon');
      if (authorIcon && !isValidHttpUrl(authorIcon)) {
        throw new Error(
          'Author icon URL is invalid. Please enter a valid URL starting with http:// or https://'
        );
      }

      const thumbnail = interaction.options.getString('thumbnail');
      if (thumbnail && !isValidHttpUrl(thumbnail)) {
        throw new Error(
          'Thumbnail URL is invalid. Please enter a valid URL starting with http:// or https://'
        );
      }

      const channel =
        interaction.options.getChannel('channel') || interaction.channel;
      if (!channel) {
        throw new Error('Invalid channel or channel could not be accessed.');
      }

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
        .setDescription(content || 'No content provided.');

      if (url) {
        embed.setURL(url);
      }

      const author = interaction.options.getString('author');
      if (author) {
        embed.setAuthor({
          name: author,
          iconURL: authorIcon,
        });
      }

      if (thumbnail) {
        embed.setThumbnail(thumbnail);
      }

      const includeFooter = interaction.options.getBoolean('footer') !== false;
      if (includeFooter) {
        embed.setFooter({
          text: interaction.client.user.username,
          iconURL: interaction.client.user.avatarURL(),
        });
      }

      await channel.send({ embeds: [embed] });
      interaction.reply({ content: 'Announcement sent!', ephemeral: true });
    } catch (e) {
      console.error(`Error in announce command: ${e.message}`, e);
      interaction.reply({
        content: `Failed to send announcement: ${e.message}`,
        ephemeral: true,
      });
    }
  },
};
