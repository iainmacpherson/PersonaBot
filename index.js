// Import config information 
const config = require('./configs/config.json');

// Setup OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: config.OpenAIApiKey
});
const openai = new OpenAIApi(configuration);

// Setup the Discord API

// Allow the bot to access global level messages and their contents
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const discord_client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Dynamically retrieve and register command and event handlers
const fs = require('node:fs');
const path = require('node:path');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter( (file) => file.endsWith('.js'));

discord_client.commands = new Collection();
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // add the command to a collection attached to the discord client
    if ('data' in command && 'execute' in command) {
        discord_client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter( (file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    // Register listeners for all event handlers to the discord client
    if (event.once) {
        discord_client.once(event.name, (...args) => event.execute(...args));
    } else {
        discord_client.on(event.name, (...args) => event.execute(...args));
    }
}

// Login and launch the bot
discord_client.login(config.BotToken);
