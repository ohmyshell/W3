const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const join = require('path').join;
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Get the last few lines of logs'),
  async execute(_, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const MyToken = process.env.MY_ID; // This should be your Discord user ID stored in the .env file
    if (interaction.user.id === MyToken) {
      const logPath = join(__dirname, '../../logs/logs.txt');

      // Read the file and get the last 20 lines
      try {
        const data = fs.readFileSync(logPath, 'utf8');
        const lines = data.trim().split('\n');
        const last20Lines = lines.slice(-20).join('\n');
        interaction.editReply(`\`\`\`${last20Lines}\`\`\``); // Using markdown to format the text like a code block
      } catch (error) {
        console.error(error);
        interaction.editReply('Failed to read the log file.');
      }
    } else {
      console.log(
        `User ${interaction.user.displayName} tried to use the logs command`
      );
      interaction.editReply("You're not allowed to use this command!");
    }
  },
};
