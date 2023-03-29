const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Copper Will Say Pong!'),
    async execute(interaction,client) {
        await interaction.reply({content: 'pong!'});
    }
}