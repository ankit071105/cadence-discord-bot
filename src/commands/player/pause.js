const { embedOptions } = require('../../config');
const { notInVoiceChannel } = require('../../utils/validation/voiceChannelValidation');
const { queueDoesNotExist, queueNoCurrentTrack } = require('../../utils/validation/queueValidation');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the current track.')
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist(interaction, queue)) {
            return;
        }

        if (await queueNoCurrentTrack(interaction, queue)) {
            return;
        }

        let durationFormat =
            queue.currentTrack.raw.duration === 0 || queue.currentTrack.duration === '0:00'
                ? ''
                : `\`${queue.currentTrack.duration}\``;

        // change paused state to opposite of current state
        queue.node.setPaused(!queue.node.isPaused());

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.pauseResumed} ${
                            queue.node.isPaused() ? 'Paused Track' : 'Resumed track'
                        }**\n**${durationFormat} [${queue.currentTrack.title}](${queue.currentTrack.url})**`
                    )
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
