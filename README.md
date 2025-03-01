# Discord Subscriber Role Bot

# Made By Winery

A Discord bot that manages subscriber roles through emoji reactions on photos.

## Features

- Automatically adds approval/rejection emojis to photos in a configured channel
- Authorized roles can approve or reject subscription requests
- Assigns roles to approved subscribers
- Sends DM notifications to users when approved or rejected

## Setup

1. Create a Discord bot on the [Discord Developer Portal](https://discord.com/developers/applications)
2. Invite the bot to your server with the necessary permissions
3. Configure the bot by editing the `config.js` file:
   - Add your channel ID where photos will be monitored
   - Add the role ID to be assigned to subscribers
   - Add the authorized role IDs that can approve/reject
4. Create a `.env` file with your bot token:
   ```
   TOKEN=your_discord_bot_token
   ```
5. Install dependencies:
   ```
   npm install
   ```
6. Start the bot:
   ```
   npm start
   ```

## Usage

1. Type "setup" in any channel to verify the bot configuration
2. Users post photos in the configured channel
3. The bot automatically adds approval and rejection emojis
4. Authorized users can click on these emojis to approve or reject the subscription
5. Approved users receive the configured role and a DM notification

## Requirements

- Node.js v20 or higher
- Discord.js v14
- CroxyDB for data storage