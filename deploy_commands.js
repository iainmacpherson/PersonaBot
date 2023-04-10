/* Registers and updates the slash commands for the bot application. */

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// get all the command file names from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// prepare each command for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// create an instance of the REST module
const rest = new REST().setToken(token)

// Command deployment
(async() => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // put is used here to completely replace the set of commands with the new ones.
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // log any errors
        console.error(error);
    }
});