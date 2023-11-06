const DbConnector = require("../config/dbConnector");
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
        const protagonists = await DbConnector.searchObject("protagonists", {"id_univers": this.id});
        const data = [];
        protagonists.forEach(protagonist => {
            data.push(Protagonist.fromMap(protagonist));
        });
        return data;
    }

    async generateDescription() {
        const description = await OpenAi.generateUniverseDescription(this.name);
        this.setDescription(description)
    }

    async generateStablePrompt() {
        await OpenAi.generateStableUniversePrompt(this.name);
    }

    generateImage(prompt) {
        const imageName = Math.random().toString(36);
        const imageUrl = process.env.HOST + `/images/${this.constructor.name.toLocaleLowerCase()}/${this.constructor.name.toLocaleLowerCase()}_${imageName}.png`;
        StableImage.generateImage(prompt, imageName, this.constructor.name);
        this.setImageUrl(imageUrl);
    }

    setDescription(description) {
        const descriptionWithoutQuotesAndNewlines = description.replace(/["\n]/g, '');
        this.description = descriptionWithoutQuotesAndNewlines;
    }

    setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
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
        return  await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        const universe = await DbConnector.loadObject("universe", id);
        if (!universe) {
            return universe;
        }
        const data = Universe.fromMap(universe);
        return data;
    }

    static async findAll(id_user) {
        const universes = await DbConnector.searchObject("universe", {id_user: id_user});
        const data = [];
        universes.forEach(universe => {
            data.push(Universe.fromMap(universe));
        });
        return data;
    }

    static async delete(id) {
        return await DbConnector.deleteObject("universe", id);
    }
}

module.exports = Universe;