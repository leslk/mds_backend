const DbConnector = require("../config/dbConnector");
const OpenAi = require("./openAi");
const StableImage = require("./stableImage");

class Protagonist {
    constructor(id, name, description, imageUrl, id_universe, id_user) {
        this.id = id,
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.id_universe = id_universe;
        this.id_user = id_user;
        
    }

    async generateDescription(universe) {
        const description = await OpenAi.generateProtagonistDescription(this, universe);
        this.setDescription(description)
    }

    async generateStablePrompt(universe) {
        const prompt = await OpenAi.generateStableProtagonistPrompt(this, universe);
        return prompt;
    }

    async generateImage(prompt) {
        const imageUrl = await StableImage.generateImage(prompt, this.name, this.constructor.name);
        this.setImageUrl(imageUrl);
    }

    setDescription(description) {
        this.description = description.replace("\n", "");
    }

    setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
    }

    toMap() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,  
            id_universe: this.id_universe,
            id_user: this.id_user,   
                  
        }
    }

    static fromMap(map) {
        let protagonist = new Protagonist(map.id, map.name, map.description, map.imageUrl, map.id_universe, map.id_user);
        return protagonist;
    }

    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        const protagonist = await DbConnector.loadObject("protagonist", id);
        if (!protagonist) {
            return protagonist;
        }
        const data = Protagonist.fromMap(protagonist);
        return data;
    }

    static async findAll() {
        const protagonists = await DbConnector.loadObjects("protagonist");
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    static async findAllByUniverseAndUser(id_universe, id_user) {
        const protagonists = await DbConnector.loadObjectsByUniverseAndUser("protagonist", id_universe, id_user);
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    static async delete(id) {
        return DbConnector.deleteObject("protagonist", id);
    }
}

module.exports = Protagonist;