// Discord Subscriber Role Bot
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');
const config = require('./config.js');
require('dotenv').config();

// Create a new client instance
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
    Partials.Reaction,
    Partials.User
  ]
});

// Database initialization
if (!croxydb.has('pendingSubscribers')) {
  croxydb.set('pendingSubscribers', {});
}

// Ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Node.js v${process.versions.node}`);
  console.log('Subscriber role bot is online!');
});

// Message event
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Check if the message is in the configured channel
  if (message.channelId === config.channelId) {
    // Check if the message contains an attachment (photo)
    if (message.attachments.size > 0) {
      // Add reaction emojis
      await message.react(config.approveEmoji);
      await message.react(config.rejectEmoji);
      
      // Store the message in the database
      const pendingSubscribers = croxydb.get('pendingSubscribers');
      pendingSubscribers[message.id] = {
        userId: message.author.id,
        timestamp: Date.now()
      };
      croxydb.set('pendingSubscribers', pendingSubscribers);
      
      console.log(`Added reactions to ${message.author.tag}'s photo`);
    }
  }
  
  // Command handling
  if (message.content.toLowerCase() === 'setup') {
    // Check if user has permission to run setup
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('You need administrator permissions to run the setup command.');
    }
    
    const embed = new EmbedBuilder()
      .setTitle('Subscriber Role Bot Setup')
      .setDescription('The bot is now configured to add reactions to photos in the specified channel.')
      .setColor('#00FF00')
      .addFields(
        { name: 'Channel', value: config.channelId ? `<#${config.channelId}>` : 'Not configured' },
        { name: 'Role', value: config.roleId ? `<@&${config.roleId}>` : 'Not configured' },
        { name: 'Authorized Roles', value: config.authorizedRoleIds.length > 0 ? 
          config.authorizedRoleIds.map(id => `<@&${id}>`).join(', ') : 'Not configured' }
      )
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  }
});

// Reaction event
client.on('messageReactionAdd', async (reaction, user) => {
  // Ignore bot reactions
  if (user.bot) return;
  
  // Check if the reaction is partial
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Error fetching reaction:', error);
      return;
    }
  }
  
  // Get the message
  const message = reaction.message;
  
  // Check if the message is in the database
  const pendingSubscribers = croxydb.get('pendingSubscribers');
  if (!pendingSubscribers[message.id]) return;
  
  // Get the guild
  const guild = message.guild;
  if (!guild) return;
  
  // Get the member who reacted
  const member = await guild.members.fetch(user.id);
  
  // Check if the member has an authorized role
  const hasAuthorizedRole = member.roles.cache.some(role => 
    config.authorizedRoleIds.includes(role.id)
  );
  
  if (!hasAuthorizedRole) {
    // Remove the reaction if the user is not authorized
    if (reaction.emoji.name === config.approveEmoji || reaction.emoji.name === config.rejectEmoji) {
      await reaction.users.remove(user.id);
    }
    return;
  }
  
  // Get the subscriber
  const subscriberId = pendingSubscribers[message.id].userId;
  const subscriber = await guild.members.fetch(subscriberId);
  
  // Handle approval
  if (reaction.emoji.name === config.approveEmoji) {
    try {
      // Add the role to the subscriber
      await subscriber.roles.add(config.roleId);
      
      // Send a DM to the subscriber
      await subscriber.send(config.approveMessage);
      
      // Remove from pending
      delete pendingSubscribers[message.id];
      croxydb.set('pendingSubscribers', pendingSubscribers);
      
      console.log(`Approved ${subscriber.user.tag} as a subscriber`);
    } catch (error) {
      console.error('Error approving subscriber:', error);
    }
  }
  
  // Handle rejection
  if (reaction.emoji.name === config.rejectEmoji) {
    try {
      // Send a DM to the subscriber
      await subscriber.send(config.rejectMessage);
      
      // Remove from pending
      delete pendingSubscribers[message.id];
      croxydb.set('pendingSubscribers', pendingSubscribers);
      
      console.log(`Rejected ${subscriber.user.tag} as a subscriber`);
    } catch (error) {
      console.error('Error rejecting subscriber:', error);
    }
  }
});

// Login to Discord
client.login(config.token);