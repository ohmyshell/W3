const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mark')
    .setDescription('Mark a user in a voice channel')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to mark')
        .setRequired(true)
    ),

  async execute(_, interaction) {
    try {
      const targetUser = interaction.options.getUser('user');
      console.log(`Target user: ${targetUser.username}`);
      const commandUser = interaction.user;
      const targetMember = await interaction.guild.members
        .fetch(targetUser.id)
        .catch((err) => {
          console.error(`Failed to fetch target member: ${err}`);
          throw new Error('Failed to fetch the user to mark.');
        });
      const commandMember = await interaction.guild.members
        .fetch(commandUser.id)
        .catch((err) => {
          console.error(`Failed to fetch command member: ${err}`);
          throw new Error('Failed to fetch your user information.');
        });

      if (targetMember.user.bot) {
        await interaction.reply({
          content: "You can't mark an app! only real users can be marked.",
          ephemeral: true,
        });
        return;
      }

      if (commandMember.voice.channelId === '818439512660901888') {
        await interaction.reply({
          content: 'YA ZENJE enta aslan maweeks.',
          ephemeral: true,
        });
        return;
      }

      if (targetMember.voice.channelId === '818439512660901888') {
        await interaction.reply({
          content: 'The user is already maweeks shu bek.',
          ephemeral: true,
        });
        return;
      }

      if (!commandMember.voice.channel || !targetMember.voice.channel) {
        await interaction.reply({
          content: 'Both users need to be in a voice channel.',
          ephemeral: true,
        });
        return;
      }
      if (targetMember.voice.streaming) {
        await interaction.reply({
          content: `${targetUser.displayName} is currently streaming.`,
          ephemeral: true,
        });
        return;
      }

      let imagesMarked, imagesRanAway;
      try {
        imagesMarked = fs.readdirSync('./src/images_marked');
        imagesRanAway = fs.readdirSync('./src/images_ranAway');
      } catch (error) {
        console.error(`Error loading images: ${error}`);
        return interaction.reply({
          content: 'There was an error loading images.',
          ephemeral: true,
        });
      }

      const randomImageMarked =
        imagesMarked[Math.floor(Math.random() * imagesMarked.length)];
      const randomImageRanAway =
        imagesRanAway[Math.floor(Math.random() * imagesRanAway.length)];

      const embed = new EmbedBuilder()
        .setTitle('A mark has been set!')
        .setDescription(
          `${targetUser} has been marked by ${commandUser}! HAHAY good luck. \nGood Bye my niggar back to the lobby.`
        )
        .setThumbnail(`attachment://${randomImageMarked}`)
        .setColor(targetMember.displayHexColor)
        .setAuthor({
          name: commandMember.displayName,
          iconURL: commandMember.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.reply({
        embeds: [embed],
        files: [`./src/images_marked/${randomImageMarked}`],
      });

      const ranAwayEmbed = new EmbedBuilder()
        .setTitle('A batoul ran away!')
        .setDescription(
          `${targetMember.displayName} ran away from his mark, what a BATOUL.`
        )
        .setThumbnail(`attachment://${randomImageRanAway}`)
        .setColor(targetMember.displayHexColor)
        .setAuthor({
          name: targetMember.displayName,
          iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
        });

      const delay = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 1000;

      setTimeout(async () => {
        if (targetMember.voice.channel) {
          try {
            await targetMember.voice.setChannel('818439512660901888');

            await interaction.editReply({
              embeds: [
                (MarkDone = new EmbedBuilder()
                  .setTitle('The Mark has been completed!')
                  .setThumbnail(
                    targetMember.user.displayAvatarURL({ dynamic: true })
                  )
                  .setDescription(
                    `Mark was completed on ${targetMember.displayName}!`
                  )
                  .setColor(targetMember.displayHexColor)),
              ],
              files: [],
            });
            setTimeout(async () => {
              await interaction.deleteReply();
            }, 3000);
          } catch (error) {
            console.error(`Failed to move the user: ${error}`);
          }
        } else {
          await interaction.editReply({
            embeds: [ranAwayEmbed],
            files: [`./src/images_ranAway/${randomImageRanAway}`],
          });
          setTimeout(async () => {
            await interaction
              .deleteReply()
              .catch(console.log(`error in deleting ran away from mark reply`));
          }, 3000);
        }
      }, delay);
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return interaction.reply({
        content: 'Something happened in mark command.',
        ephemeral: true,
      });
    }
  },
};
