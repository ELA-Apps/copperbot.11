
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField} = require(`discord.js`);


  
  module.exports = { 
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Bans user from the server')
      .addUserOption(option => option.setName('user').setDescription('this is the member you want to ban').setRequired(true))
      .addStringOption(option => option.setName('reason').setDescription('The reason for banning').setRequired(true)),
      async execute(interaction, client){

const users = interaction.options.getUser('user');
const ID = users.id;
const banUser = client.users.cache.get(ID)


if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply ({content: "You must have the ban Permission", epheneral: true});
if (interaction.member.id === ID) return await interaction.reply({ content : "You can't ban your self", epheneral: true});

let reason = interaction.options.getString('Reason');
if (!reason) reason = "No Reason Given";

const dmEmbed = new  EmbedBuilder()
.setColor("Blue")
.setDescription(`:White_check_mark: You have been banned from **${interaction.guild.name}** | ${reason}`)

const embed = new  EmbedBuilder()
.setColor("Blue")
.setDescription(`:White_check_mark: You have been banned from ${banUser.tag} has been banned | ${reason}`)

await interaction.guild.bans.create(banUser.id, {reason}).catch(err => { 
  return interaction.reply ({Content: "I cannot bann this member!", epheneral: true})

      })
      await banUser.send({embeds: [dmEmbed]} ).catch(err =>{
        return;


      })
      await interaction.reply({embeds: [embed] });

    }


  }