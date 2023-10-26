const OpenAI = require('openai');
const openAi = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

class OpenAi{  

    static async generateUniverseDescription(universe) {
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: `Can you give me a concise and precise description of ${universe} universe with 500 character maximum?\n`,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.choices[0].text;
        } catch (err) {
            throw err;
        }
    }

    static async generateProtagonistDescription(protagonist, universe) {
        try {
            const response = await openAi.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: `Generate a pers ${protagonist} in ${universe} universe with 500 character maximum?\n`,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.choices[0].text;
        } catch (err) {
            throw new Error(`Error on generating character description: ${err.message}`);
        }
    }

    static async generateStableProtagonistPrompt(character, universe) {

        let prompt = `Generate a prompt for the protagonist $[charater.name] from the universe ${universe} to generate an image using a Text to Image AI. Here is the description of the character:\n ${character.description} \n\nThe prompt will be used to generate an image on stable diffusion and must not exceed 500 characters.`;
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
            throw new Error(`Error on generating character prompt: ${err.message}`);

        }
    }

    static async generateStableUniversePrompt(universe) {
        let prompt = `Generate a prompt for the universe ${universe.name} to generate an image using a Text to Image AI. Here is the description of the character:\n ${universe.description} \n\nThe prompt will be used to generate an image on stable diffusion and must not exceed 500 characters.`;
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
            throw err;
        }
    }
}

module.exports =  OpenAi;