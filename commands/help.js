const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config.js');

module.exports = {
  name: 'yardım',
  description: 'Komut listesini gösterir',
  execute(message, args, client) {
    const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
    
    const helpEmbed = new EmbedBuilder()
      .setTitle('Ticket Bot Komutları')
      .setDescription('Aşağıda kullanabileceğiniz komutların listesi bulunmaktadır.')
      .setColor('#3498db')
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
    
    // Temel komutlar
    helpEmbed.addFields(
      { name: `${config.prefix}yardım`, value: 'Komut listesini gösterir.' }
    );
    
    // Yönetici komutları
    if (isAdmin) {
      helpEmbed.addFields(
        { name: `${config.prefix}ticket panel`, value: 'Ticket oluşturma panelini gönderir. (Sadece yöneticiler)' },
        { name: `/ticket panel`, value: 'Ticket oluşturma panelini gönderir. (Sadece yöneticiler)' }
      );
    }
    
    message.channel.send({ embeds: [helpEmbed] });
  }
};