// Implements the command for sending a message to the Bot
const { SlashCommandBuilder } = require('discord.js');
const bot = require('../bot/bot.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Send a message that PersonaBot will respond to in character.')
        .addStringOption(option => option
            .setName("prompt")
            .setDescription("What do you want to say?")
            .setRequired(true)
        ),
    async execute(interaction) {
        // Defer the reply because this may take longer than 3 seconds
        await interaction.deferReply({ ephemeral: false });
        const chat_message = interaction.options.getString("prompt");
        const response = await bot.respondToMessage(interaction.user.username, chat_message);
        // Finally provide the reply produced
        reply_message = `${interaction.user.username}: ` + chat_message + '\n\n' + 'PersonaBot: ' + response;
        await interaction.editReply(reply_message);
    }
};