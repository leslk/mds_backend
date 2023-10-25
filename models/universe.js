const DbConnector = require("../config/dbConnector");
const { fromMap } = require("./user");


class Universe {
    constructor(id, name, creatorId, description, imageUrl) {
        this.id = id;
        this.name = name;
        this.creatorId = creatorId;
        this.description = description;
        this.imageUrl = imageUrl;
        this.characters = [];
    }

    static toMap(map) {
        return new Universe(map.name, map.creatorId, map.description, map.imageUrl, map.characters);
    }

    setDescription(description) {
        this.description = description;
    }

    setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
    }

    toMap() {
        return {
            id: this.id,
            name: this.name,
            creatorId: this.creatorId,
            description: this.description,
            imageUrl: this.imageUrl,
            characters: this.characters
        }
    }

    fromMap (map) {
        let universe = new Universe(map.id, map.name, map.creatorId, map.description, map.imageUrl);
        return universe;
    }

    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        const universe = await DbConnector.loadObject("universe", id);
        const data = Universe.fromMap(universe);
        return data;
    }

    static async findAll() {
        const universes = await DbConnector.loadObjects("universe");
        const data = [];
        universes.forEach(universe => {
            data.push(Universe.fromMap(universe));
        });
        return data;
    }

    static async delete(id) {
        return DbConnector.deleteObject("universe", id);
    }
}

module.exports = Universe;