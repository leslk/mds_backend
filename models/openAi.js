const OpenAI = require('openai');
const openAi = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

class OpenAi{  

    static async generateUniverseDescription(universe) {
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: `Provide me with a description of the universe of ${universe.name}. Its era, its history, and its specificities.`,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.choices[0].text;
        } catch (err) {
            throw {
                status: err.status,
                message: `Error on generating universe description: ${err.message}`
            }
        }
    }

    static async generateProtagonistDescription(protagonist, universe) {
        const prompt = `
        Here is the description of the univers ${universe.name}:
        ${universe.description}
        --
        Provide me with a description of the character named ${protagonist.name} from this universe. Give me their backstory, personality, and distinctive features.`;
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: prompt,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            console.log( universe);
            return response.choices[0].text;
        } catch (err) {
            throw {
                status: err.status,
                message: `Error on generating protagonist description: ${err.message}`
            }
        }
    }

    static async generateStableProtagonistPrompt(character, universe) {

        let prompt = `
        Here is the description of the character ${character.name}:
        ${character.description}
        --
        Write me a prompt to generate an image using the Text-to-Image artificial intelligence called StableDiffusion to depict the character ${character.name} from the universe ${universe.name}. The prompt should be in English and not exceed 300 characters.`;
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: prompt,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.choices[0].text;
        } catch (err) {
            throw {
                status: err.status,
                message: `Error on generating protagonist prompt: ${err.message}`
            }

        }
    }

    static async generateStableUniversePrompt(universe) {
        let prompt = 
            `This is the description of the universe ${universe.name}: 
            ${universe.description}
            ---
            Create a Text-to-Image prompt to generate an image representing this universe in a representative style of it. The prompt should be in English and not exceed 300 characters.`;
            console.log(prompt);
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: prompt,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            console.log(response.choices[0].text)
            return response.choices[0].text;
        } catch (err) {
            const errorHandler = new ErrorHandler(err.status, err.message);
            errorHandler.handleErrorResponse(res);
        }
    }

    static async generateMessage(messages) {
        try {
            const response = await openAi.chat.completions.create({
                model: "gpt-4", //process.env.OPENAI_MODEL,
                messages: messages,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.choices[0].message.content;
        } catch (err) {
            throw {
                status: err.status,
                message: `Error on generating message: ${err.message}`
            }
        }
    }
}

module.exports =  OpenAi;