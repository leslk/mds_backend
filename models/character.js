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

    fromMap(map) {
        let character = new Character(map.id, map.name, map.description, map.imageUrl);
        return character;
    }

    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        const character = await DbConnector.loadObject("character", id);
        const data = Character.fromMap(character);
        return data;
    }

    static async findAll() {
        const characters = await DbConnector.loadObjects("character");
        const data = [];
        characters.forEach(character => {
            data.push(Character.fromMap(character));
        });
        return data;
        return await DbConnector.loadObjects("character");
    }

    static async delete(id) {
        return DbConnector.deleteObject("character", id);
    }
}

module.exports = Character;