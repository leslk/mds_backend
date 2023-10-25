const DbConnector = require("../config/dbConnector");

class Character {
    constructor(name, description, imageUrl) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.discussions = [];
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
            description: this.description,
            imageUrl: this.imageUrl,
            discussions: this.discussions
        }
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

    static async delete(id) {
        return DbConnector.deleteObject("character", id);
    }
}

module.exports = Character;