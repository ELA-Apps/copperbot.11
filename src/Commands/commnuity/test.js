
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hellocopper')
        .setDescription('Copper Will Say Hello!'),
    async execute(interaction,client) {
        await interaction.reply({content: 'Hello Freind'});
    }
}