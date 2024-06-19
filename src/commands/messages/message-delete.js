const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete n amount of messages')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Amount of messages to Delete')
        .setMinValue(1)
        .setMaxValue(30)
        .setRequired(true)
    ),
  async execute(_, interaction) {
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.channel;

    if (
      !channel
        .permissionsFor(interaction.member)
        .has(PermissionsBitField.Flags.Administrator)
    ) {
      return interaction.reply({
        content: 'You do not have permission to use this command',
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      if (channel.permissionsFor(interaction.member).has('administrator')) {
        const messages = await channel.messages.fetch({ limit: amount });
        await channel.bulkDelete(messages);
        interaction.editReply({
          content: `Deleted ${amount} messages`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `You do not have the required permissions to use this command.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 10062) {
        console.error('Unknown interaction error:', error);
        interaction.editReply({
          content: 'The command timed out. Please try again later.',
          ephemeral: true,
        });
      } else {
        console.error('Error deleting messages:', error);
        interaction.editReply({
          content:
            'An error occurred while deleting messages. Please try again later.',
          ephemeral: true,
        });
      }
    }
  },
};
