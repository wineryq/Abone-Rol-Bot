// Bu dosya komutların daha kolay yönetilmesi için oluşturulmuştur
const fs = require('fs');
const path = require('path');

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');

const commands = {};

for (const file of commandFiles) {
  const command = require(path.join(__dirname, file));
  commands[command.name] = command;
}

module.exports = commands;