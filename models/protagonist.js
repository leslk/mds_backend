const ProxyDb = require("../config/ProxyDb");
const OpenAi = require("./openAi");
const StableImage = require("./stableImage");
const StoredImage = require("./storedImage");
const Talk = require("./talk");
const {checkOwnership} = require("../utils/jwt");

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
        return await OpenAi.generateStableProtagonistPrompt(this, universe);
    }

    generateImage(prompt, protagonistId, imageUrl) {
        StableImage.generateImage(prompt, protagonistId, Protagonist, imageUrl, this.constructor.name);
    }

    setDescription(description) {
        const descriptionWithoutQuotesAndNewlines = description.replace(/["\n]/g, '');
        this.description = descriptionWithoutQuotesAndNewlines;
    }

    setImageUrl() {
        const imageName = Math.random().toString(36);
        const imageUrl = process.env.HOST + `/images/${this.constructor.name.toLocaleLowerCase()}/${this.constructor.name.toLocaleLowerCase()}_${imageName}.png`;
        this.imageUrl = imageUrl;
        return this.imageUrl;
    }

    async deleteImage() {
        await StoredImage.deleteImage(this.imageUrl, this.constructor.name.toLocaleLowerCase());
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
        return await ProxyDb.saveObject(this);
    }

    static async findOne(id) {
        const protagonist = await ProxyDb.loadObject("protagonist", id);
        if (!protagonist) {
            return protagonist;
        }
        const data = Protagonist.fromMap(protagonist);
        return data;
    }

    static async findOneByName(name) {
        const protagonist = await ProxyDb.searchObject("protagonist", {name: name});
        if (protagonist.length === 0) {
            return null;
        }
        const data = Protagonist.fromMap(protagonist[0]);
        return data;
    }

    static async findOneByUniverseAndUser(id, protagonistId, userId) {
        const protagonist = await ProxyDb.searchObject("protagonist", {id_universe: id, id: protagonistId, id_user: userId});
        if (!protagonist) {
            return protagonist;
        }
        const data = Protagonist.fromMap(protagonist[0]);
        return data;
    }

    static async findAll() {
        const protagonists = await ProxyDb.loadObjects("protagonist");
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    static async findAllByUniverseAndUser(universeId, userId) {
        const protagonists = await ProxyDb.searchObject("protagonist", {id_universe: universeId, id_user: userId});
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    async delete() {
        await StoredImage.deleteImage(this.imageUrl, this.constructor.name.toLocaleLowerCase());
        const talk = await Talk.findOneByProtagonist(this.id);
        if (talk) {
            await Talk.delete(talk.id);
        }
        return ProxyDb.deleteObject("protagonist", this.id);
    }
}

module.exports = Protagonist;