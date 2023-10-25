const DbConnector = require("../config/dbConnector");


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

    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        return await DbConnector.loadObject("universe", id);
    }

    static async findAll() {
        return await DbConnector.loadObjects("universe");
    }

    static async delete() {
        return DbConnector.deleteObject(this);
    }
}

module.exports = Universe;