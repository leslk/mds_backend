const { fromMap } = require("./user");

class Talk {
    constructor(backgroundImage, historique) {
        this.backgroundImage = backgroundImage;
        this.historique = historique;
    }

    toMap() {
        return {
            id: this.id,
            backgroundImage: this.backgroundImage,
            historique: this.historique
        }
    }

    fromMap(map) {
        let talk = new Talk(map.id, map.backgroundImage, map.historique);
        return talk;
    }
    
    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        const talk = await DbConnector.loadObject("talk", id);
        const data = Talk.fromMap(talk);
        return data;
    }

    static async findAll() {
        const talks = await DbConnector.loadObjects("talk");
        const data = [];
        talks.forEach(talk => {
            data.push(Talk.fromMap(talk));
        });
        return data;
    }

    static async delete(id) {
        return DbConnector.deleteObject("talk", id);
    }
}