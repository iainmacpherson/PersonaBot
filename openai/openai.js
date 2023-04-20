// Helper class for accessing the OpenAI API
const { Configuration, OpenAIApi } = require('openai');

class OpenAI {
    constructor(apiKey) {
        this.openai = new OpenAIApi(new Configuration({apiKey}));
        this.model = 'gpt-3.5-turbo';
        this.max_tokens = 256;
        this.temperature = 0.8;
    };
    // Generate a response from the API given an array of messages indicating the current conversation state.
    async generateResponse(messages) {
        try {
            // Request response from API
            const response = await this.openai.createChatCompletion({
                model:this.model,
                messages:messages,
                max_tokens:this.max_tokens,
                n: 1,
                temperature:this.temperature,
            });
            console.log(`API request with ${response.data.usage.total_tokens} tokens.`);
            // return the response
            return response.data.choices[0].message.content;
        } catch (error) {
            // if there is an error then log some high level details about it
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                return 'Error: ' + error.response
            } else {
                console.log(error.message);
                return 'Error: ' + error.message
            }
        }
    }
}

module.exports = OpenAI;