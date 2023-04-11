
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField} = require(`discord.js`);


  
  module.exports = { 
    data: new SlashCommandBuilder()
      .setName('unban')
      .setDescription("unbans user from the server")
      .addUserOption(option => option.setName('user').setDescription('this is the member you want to unban').setRequired(true))
      .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning').setRequired(true)),
      async execute(interaction, client){

const userID = interaction.options.getUser('user');



if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply ({content: "You must have the ban Permission ", epheneral: true});
if (interaction.member.id === userID) return await interaction.reply({ content : "You can't ban your self", epheneral: true});

let reason = interaction.options.getString('Reason');
if (!reason) reason = "No Reason Given";

const embed = new  EmbedBuilder()
.setColor("Blue")
.setDescription(`:White_check_mark: <@${userID}> has been unbanned | ${reason}`)

await interaction.guild.bans.fetch()
.then (async bans =>{
    if (bans.size == 0) return await interaction.reply({ content: "There is no one banned from this guild", epheneral: true})
let bannedID = bans.find(ban => ban.user.id == userID);
    if (!bannedID ) return await interaction.reply(
        { content: "The id Stated is not banend from this server", epheneral: true})

        await interaction.guild.bans.remove(userID, reason).catch(err => {
            return interaction.reply({ conten: "i cannot unban this member"})

      })


    })
    await interaction.reply({embeds: [embed] });

    }


  }