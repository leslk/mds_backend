const ProxyDb = require("../config/ProxyDb");
const OpenAi = require("../models/openAi");
const StableImage = require("../models/stableImage");
const Protagonist = require("../models/protagonist");


class Universe {
    constructor(id, name, id_user, description, imageUrl) {
        this.id = id;
        this.name = name;
        this.id_user = id_user;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    async getAllProtagonists() {
        const protagonists = await ProxyDb.searchObject("protagonists", {"id_univers": this.id});
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    async generateDescription() {
        const description = await OpenAi.generateUniverseDescription(this);
        this.setDescription(description)
    }

    async generateStablePrompt() {
        await OpenAi.generateStableUniversePrompt(this);
    }

    generateImage(prompt, universeId, imageUrl) {
        StableImage.generateImage(prompt, universeId, Universe, imageUrl, this.constructor.name);
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

    toMap() {
        return {
            id: this.id,
            name: this.name,
            id_user: this.id_user,
            description: this.description,
            imageUrl: this.imageUrl,
        }
    }

    static fromMap (map) {
        let universe = new Universe(map.id, map.name, map.id_user, map.description, map.imageUrl);
        return universe;
    }

    async save() {
        return  await ProxyDb.saveObject(this);
    }

    static async findOne(id) {
        const universe = await ProxyDb.loadObject("universe", id);
        if (!universe) {
            return universe;
        }
        const data = Universe.fromMap(universe);
        return data;
    }

    static async findOneByName(name) {
        const universe = await ProxyDb.searchObject("universe", {name: name});
        if (universe.length === 0) {
            return null;
        }
        const data = Universe.fromMap(universe[0]);
        return data;
    }

    static async findAll(id_user) {
        const universes = await ProxyDb.searchObject("universe", {id_user: id_user});
        const data = [];
        universes.forEach(universe => {
            data.push(Universe.fromMap(universe));
        });
        return data;
    }

    static async delete(id) {
        return await ProxyDb.deleteObject("universe", id);
    }
}

module.exports = Universe;