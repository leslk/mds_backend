const DbConnector = require("../config/dbConnector");

class Character {
    constructor(name, description, imageUrl) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.discussions = [];
    }
    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        return await DbConnector.loadObject("character", id);
    }

    static async findAll() {
        return await DbConnector.loadObjects("character");
    }

    static async delete() {
        return DbConnector.deleteObject(this);
    }
}

module.exports = Character;