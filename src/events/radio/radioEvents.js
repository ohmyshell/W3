const { EmbedBuilder } = require('discord.js');

module.exports = {
  playerError: function (client, queue, error) {
    console.log(`Error: ${error}`);
  },
  playerStart: function (client, queue, track) {
    const embed = new EmbedBuilder()
      .setColor('#00A86B')
      .setTitle(track.title)
      .setURL(track.url)
      .addFields(
        { name: 'Duration', value: track.duration },
        { name: 'Status', value: 'Playing' },
        { name: 'Requested By', value: `<@${queue.metadata.requestedBy.id}>` }
      )
      .setThumbnail(track.thumbnail);

    client.channels.cache
      .get(queue.metadata.interaction.channelId)
      .send({ embeds: [embed] })
      .then((message) => {
        queue.metadata.message = message;
      });
  },
  trackAdd: function (client, queue, track) {
    const embed = queue.metadata.message.embeds[0];
    embed.addFields({ name: 'Next Track', value: track.title });
    queue.metadata.message.edit({ embeds: [embed] });
  },
  playerPause: function (client, queue) {
    const embed = queue.metadata.message.embeds[0];
    embed.data.fields.find((field) => field.name === 'Status').value = 'Paused';
    queue.metadata.message.edit({ embeds: [embed] });
  },
  playerResume: function (client, queue) {
    const embed = queue.metadata.message.embeds[0];
    embed.data.fields.find((field) => field.name === 'Status').value =
      'Playing';
    queue.metadata.message.edit({ embeds: [embed] });
  },
  playerSkip: function (client, queue) {
    queue.metadata.message
      .edit({ content: 'Skipped to the next track!' })
      .then(() => {
        queue.metadata.message.delete({ timeout: 5000 });
      });
  },
};
