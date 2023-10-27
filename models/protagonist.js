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

    generateImage(prompt) {
        const imageName = Math.random().toString(36);
        const imageUrl = process.env.HOST + `/images/${this.constructor.name.toLocaleLowerCase()}/${this.constructor.name.toLocaleLowerCase()}_${imageName}.png`;
        StableImage.generateImage(prompt, imageName, this.constructor.name);
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

    static async findOneByUniverseAndUser(id, protagonistId, userId) {
        const protagonist = await DbConnector.searchObject("protagonist", {id_universe: id, id: protagonistId, id_user: userId});
        if (!protagonist) {
            return protagonist;
        }
        const data = Protagonist.fromMap(protagonist[0]);
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

    static async findAllByUniverseAndUser(universeId, userId) {
        const protagonists = await DbConnector.searchObject("protagonist", {id_universe: universeId, id_user: userId});
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