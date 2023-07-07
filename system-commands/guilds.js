const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const {
    embedColors,
    systemServerGuildId,
    botOwnerClientId
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Show list of guilds where bot is added.'),
    run: async ({ interaction, client }) => {
        if (
            interaction.guildId !== systemServerGuildId ||
            interaction.user.id !== botOwnerClientId
        ) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**No permission**\nYou do not have permission to use this command.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        let guildsList = client.guilds.cache
            .map((guild) => {
                return {
                    name: guild.name,
                    memberCount: guild.memberCount
                }
            })
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((guild) => `\`${guild.name} (#${guild.memberCount})\``)
            .join(', ');

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Guilds (${client.guilds.cache.size} total)**\n${guildsList}`
                    )
                    .setColor(embedColors.colorInfo)
            ]
        });
    }
};
