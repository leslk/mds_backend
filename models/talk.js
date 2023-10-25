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
    
    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        return await DbConnector.loadObject("talk", id);
    }

    static async findAll() {
        return await DbConnector.loadObjects("talk");
    }

    static async delete(id) {
        return DbConnector.deleteObject("talk", id);
    }
}