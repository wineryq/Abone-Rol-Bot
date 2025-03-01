module.exports = {
  // Bot configuration
  token: "TOKEN", // Your bot token (stored in .env file)
  prefix: "!", // Command prefix
  
  // Channel configuration
  channelId: "1345142396928786574", // The ID of the channel where photos will be monitored
  
  // Role configuration
  roleId: "1337852332947275868", // The ID of the role to be assigned to subscribers
  
  // Authorized roles that can approve/reject subscribers
  authorizedRoleIds: ["1336796044398166136"], // Array of role IDs that can approve/reject
  
  // Emoji configuration
  approveEmoji: "1215301591293239377", // Emoji for approval
  rejectEmoji: "1215301538277367858", // Emoji for rejection
  
  // Messages
  approveMessage: "Abone rolün verildi!",
  rejectMessage: "Abone rolün verilmedi! Lütfen tekrar dene."
};