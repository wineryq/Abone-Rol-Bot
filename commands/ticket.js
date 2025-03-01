const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../config.js');

module.exports = {
  name: 'ticket',
  description: 'Ticket sistemi komutları',
  execute(message, args, client) {
    // Yönetici izni kontrolü
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!');
    }
    
    if (!args.length) {
      return message.reply(`Kullanım: ${config.prefix}ticket panel`);
    }
    
    if (args[0] === 'panel') {
      const ticketEmbed = new EmbedBuilder()
        .setTitle('Destek Talebi Oluştur')
        .setDescription('Destek ekibimizle iletişime geçmek için aşağıdaki butona tıklayarak bir destek talebi oluşturabilirsiniz.')
        .setColor('#3498db')
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });
      
      const ticketButton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel(config.buttons.createTicket)
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎫')
        );
      
      message.channel.send({ embeds: [ticketEmbed], components: [ticketButton] });
    }
  }
};