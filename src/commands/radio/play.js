const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to the queue.')
    .addStringOption((option) =>
      option.setName('url').setDescription("The song's URL").setRequired(true)
    ),

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.editReply(
        'You need to be in a voice channel to play music.'
      );
      return;
    }

    const songUrl = interaction.options.getString('url');
    const queue = client.player.nodes.get(interaction.guildId);

    try {
      if (queue && queue.currentTrack) {
        let searchRes = await client.player.search(songUrl, {
          requestedBy: interaction.user,
        });
        if (searchRes.tracks.length > 0) {
          let track = searchRes.tracks[0];
          queue.addTrack(track);
          await interaction.editReply(`Added to queue: ${track.title}`);
          console.log(`${track.title}`);
        } else {
          await interaction.editReply('No tracks found for the provided URL.');
        }
      } else {
        const { track } = await client.player.play(channel, songUrl, {
          nodeOptions: {
            metadata: {
              interaction: interaction,
              requestedBy: interaction.user,
            },
            volume: 60,
            leaveOnEnd: true,
            leaveOnEndCooldown: 0,
            leaveOnStop: true,
            leaveOnStopCooldown: 0,
          },
        });
        console.log(`Now playing: ${track.title}`);
        await interaction.editReply('Processing your request...');
      }
    } catch (e) {
      console.error(`Error in play command: ${e}`);
      await interaction.editReply('This is not a song...');
    }
  },
};
