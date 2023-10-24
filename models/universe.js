const DbConnector = require("../config/dbConnector");


export default class Universe {
    constructor(name, creatorId, description, imageUrl, characters) {
        this.name = name;
        this.creatorId = creatorId;
        this.description = description;
        this.imageUrl = imageUrl;
        this.characters = characters;
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

    async delete() {
        return DbConnector.deleteObject(this);
    }
}