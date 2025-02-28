const { Client, GatewayIntentBits, Partials, Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Bot yapılandırması Winery
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// Bot hazır olduğunda
client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
  console.log('Bot aktif ve çalışıyor!');
});

// Mesaj oluşturulduğunda
client.on(Events.MessageCreate, async (message) => {
  // Botun kendi mesajlarını yoksay
  if (message.author.bot) return;

  // Fotoğraf kanalı kontrolü
  if (message.channelId === process.env.PHOTO_CHANNEL_ID) {
    // Mesajda fotoğraf yoksa sil
    if (message.attachments.size === 0 || !message.attachments.some(attachment => 
      attachment.contentType?.startsWith('image/'))) {
      try {
        await message.delete();
        const uyariMesaji = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF0000')
              .setTitle('⚠️ Uyarı')
              .setDescription(`${message.author}, bu kanala sadece fotoğraf yükleyebilirsiniz!`)
              .setFooter({ text: 'Bu mesaj 5 saniye sonra silinecek' })
          ]
        });
        
        setTimeout(() => {
          uyariMesaji.delete().catch(err => console.error('Uyarı mesajı silinemedi:', err));
        }, 5000);
      } catch (error) {
        console.error('Mesaj silinirken hata oluştu:', error);
      }
    } else {
      // Fotoğraf mesajına onay emojisi ekle
      try {
        await message.react('✅');
      } catch (error) {
        console.error('Emoji eklenirken hata oluştu:', error);
      }
    }
  }

  // Komut işleme
  if (message.content.startsWith('!yardım')) {
    const yardimEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📚 Bot Komutları')
      .setDescription('Aşağıda kullanabileceğiniz komutların listesi bulunmaktadır:')
      .addFields(
        { name: '!yardım', value: 'Komut listesini gösterir' },
        { name: '!abone', value: 'Abone rol sistemini açıklar' },
        { name: '!bilgi', value: 'Bot hakkında bilgi verir' }
      )
      .setTimestamp()
      .setFooter({ text: 'Abone Rol Botu', iconURL: client.user.displayAvatarURL() });
    
    message.channel.send({ embeds: [yardimEmbed] });
  }

  if (message.content.startsWith('!abone')) {
    const aboneEmbed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🎭 Abone Rol Sistemi')
      .setDescription('Abone rolü almak için:')
      .addFields(
        { name: '1️⃣ Fotoğraf Yükle', value: 'Fotoğraf kanalına bir fotoğraf yükleyin' },
        { name: '2️⃣ Onay Bekle', value: 'Yetkililer fotoğrafınızı onaylamak için ✅ emojisine tıklayacak' },
        { name: '3️⃣ Rol Kazanımı', value: 'Onay aldığınızda otomatik olarak abone rolü kazanacaksınız' }
      )
      .setTimestamp()
      .setFooter({ text: 'Abone Rol Botu', iconURL: client.user.displayAvatarURL() });
    
    message.channel.send({ embeds: [aboneEmbed] });
  }

  if (message.content.startsWith('!bilgi')) {
    const bilgiEmbed = new EmbedBuilder()
      .setColor('#FF00FF')
      .setTitle('ℹ️ Bot Bilgisi')
      .setDescription('Bu bot, abone rol yönetimi ve fotoğraf kanalı kontrolü için tasarlanmıştır.')
      .addFields(
        { name: 'Özellikler', value: 'Abone rol yönetimi\nFotoğraf kanalı kontrolü\nOtomatik bildirimler' },
        { name: 'Sürüm', value: '1.0.0' }
      )
      .setTimestamp()
      .setFooter({ text: 'Abone Rol Botu', iconURL: client.user.displayAvatarURL() });
    
    message.channel.send({ embeds: [bilgiEmbed] });
  }
});

// Emoji reaksiyonu eklendiğinde
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // Botun kendi reaksiyonlarını yoksay
  if (user.bot) return;

  // Kısmi reaksiyonları tam olarak al
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Reaksiyon alınırken hata oluştu:', error);
      return;
    }
  }

  // Mesaj kısmi ise tam olarak al
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error('Mesaj alınırken hata oluştu:', error);
      return;
    }
  }

  // Sadece fotoğraf kanalındaki mesajları kontrol et
  if (reaction.message.channelId === process.env.PHOTO_CHANNEL_ID) {
    // Sadece ✅ emojisini kontrol et
    if (reaction.emoji.name === '✅') {
      // Reaksiyon ekleyen kişinin yetkisi var mı kontrol et
      const guild = reaction.message.guild;
      const member = await guild.members.fetch(user.id);
      
      if (member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        // Mesaj sahibine abone rolü ver
        const messageAuthor = reaction.message.author;
        if (messageAuthor) {
          try {
            const targetMember = await guild.members.fetch(messageAuthor.id);
            const subscriberRole = guild.roles.cache.get(process.env.SUBSCRIBER_ROLE_ID);
            
            if (subscriberRole) {
              await targetMember.roles.add(subscriberRole);
              
              // Bildirim gönder
              const bildirimEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎉 Abone Rolü Verildi')
                .setDescription(`${messageAuthor} kullanıcısına abone rolü verildi!`)
                .setTimestamp()
                .setFooter({ text: `Onaylayan: ${user.tag}`, iconURL: user.displayAvatarURL() });
              
              reaction.message.channel.send({ embeds: [bildirimEmbed] });
              
              // DM bildirim gönder
              try {
                const dmEmbed = new EmbedBuilder()
                  .setColor('#00FF00')
                  .setTitle('🎉 Tebrikler!')
                  .setDescription(`**${guild.name}** sunucusunda abone rolü kazandınız!`)
                  .setTimestamp()
                  .setFooter({ text: guild.name, iconURL: guild.iconURL() });
                
                await messageAuthor.send({ embeds: [dmEmbed] });
              } catch (error) {
                console.error('DM gönderilirken hata oluştu:', error);
              }
            } else {
              console.error('Abone rolü bulunamadı!');
            }
          } catch (error) {
            console.error('Rol verilirken hata oluştu:', error);
          }
        }
      } else {
        // Yetkisiz kullanıcının reaksiyonunu kaldır
        try {
          await reaction.users.remove(user.id);
          
          // Yetkisiz kullanıcıya uyarı gönder
          const uyariEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⚠️ Yetki Hatası')
            .setDescription('Abone rolü vermek için yeterli yetkiniz bulunmuyor!')
            .setTimestamp();
          
          try {
            const dmSent = await user.send({ embeds: [uyariEmbed] });
            setTimeout(() => {
              dmSent.delete().catch(err => console.error('DM silinirken hata oluştu:', err));
            }, 10000);
          } catch (error) {
            console.error('DM gönderilirken hata oluştu:', error);
          }
        } catch (error) {
          console.error('Reaksiyon kaldırılırken hata oluştu:', error);
        }
      }
    }
  }
});

// Hata yakalama
client.on('error', error => {
  console.error('Bot hatası:', error);
});

process.on('unhandledRejection', error => {
  console.error('İşlenmeyen hata:', error);
});

require('dotenv').config();

if (!process.env.TOKEN) {
    console.error('Hata: Bot tokeni bulunamadı! Lütfen .env dosyanızı kontrol edin.');
    process.exit(1);
}

client.login(process.env.TOKEN)
    .then(() => console.log('✅ Bot başarıyla giriş yaptı!'))
    .catch(error => {
        console.error('❌ Giriş yapılırken hata oluştu:', error);
        process.exit(1);
    });
