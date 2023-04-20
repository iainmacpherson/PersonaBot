// The ready event is triggered when the bot has just logged in.
const { Events } = require('discord.js');
const bot = require('../bot/bot.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        // initialise the bot
        await bot.init();
    }
};