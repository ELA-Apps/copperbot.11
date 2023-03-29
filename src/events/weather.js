
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require ('weather.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('gets the weather of the given area')
    .addStringOption(option => option.setName('location').setDescription('The location to check the weather of').setRequired(true))
    .addStringOption(option => option.setName('degree-type').setDescription('Select what  dregree type  you would like').addChoices({ name:`farnheight`, value:'F'}, {name:'Celcius', value: 'C'}) .setRequired(true)),
async execute (interaction) {
    const { options } = interaction;
    const location = options.getString('location');
    const degree = options.getString('degree-type');

await interaction.reply({content: `<a:Loading:1087645463980658751> Gathering your weather Data...`});
await weather.find({ search: `${location}`, degreeType:`${degree}`}, async function(err, result) {

setTimeout(() =>{
    if (err) {
 
        console.log(err);
        interaction.editreply({ content: `${err} | Because Copper is pulling data,sometims timeouts happen! Try this command again`});

} else {
    if (result.lenght ==  0){
        return interaction.editreply({ comtent: `I could not find the weather of ${location}!`});
    } else {
        const temp  = result[0].current.temparture;
        const type = result[0].current.skyType;
        const name =result[0]. location.name;
        const feel = result[0].current.feelslike;
        const icon = result[0].current.imageurl;
        const wind = result[0].current.winddisplay;
        const day = result[0].current.day;
        const alert = result[0].current.location.alert || 'None';

        const emben = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Current weather of ${name}`)
        .addFields({ name : 'Temperture',  value: `${temp}`})
        .addFields({ name : 'Feels Like',  value: `${feel}`})
        .addFields({ name : 'Weather',  value: `${type}`})
        .addFields({ name : 'Current Alert',  value: `${alert}`})
        .addFields({ name : 'Week Day',  value: `${day}`})
        .addFields({ name : 'Wind Speed & Directon',  value: `${wind}`})
        .setThumbnail(icon)
        interaction.editreply({content: ``, embed: [embed]});
    }
}
}, 2000)

})
}
}