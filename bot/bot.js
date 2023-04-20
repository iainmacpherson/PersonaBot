/* Encapsulates all bot related functionality. */

// Import OpenAI api stuff
const OpenAI = require('../openai/openai.js');
// Import config information 
const config = require('../configs/config.json');

// Character config files
const SYSTEM_FILE = './configs/system.txt';
const CHARACTER_FILE = './configs/character.txt';
const fs = require('fs/promises');

module.exports = {
    openAI: new OpenAI(config.OpenAIApiKey),
    system_prompt: '',
    character_prompt: '',
    // Reads provided config data and holds the prompts for use in future chats
    async init() {
        // read data in from config files
        try {
            this.system_prompt = await fs.readFile(SYSTEM_FILE, {encoding: 'utf-8'});
            this.character_prompt = await fs.readFile(CHARACTER_FILE, {encoding: 'utf-8'});
        } catch (error) {
            console.log(error);
        }
    },
    // takes a provided message string and requests completion. Returns the response string.
    async respondToMessage(username, message) {
        const messages = [];
        // include the system and character info with every message for context.
        messages.push({role:'system', content: this.system_prompt});
        messages.push({role:'system', content: this.character_prompt});
        messages.push({role:'user', content: message});
        const answer = await this.openAI.generateResponse(messages);
        return answer;
    }
};