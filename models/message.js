class Message {
    constructor(date, text) {
        this.date = date;
        this.text = text;
    }

    toMap() {
        return {
            id: this.id,
            date: this.date,
            text: this.text
        }
    }

    async save() {
        return await DbConnector.saveObject(this);
    }

    static async findOne(id) {
        return await DbConnector.loadObject("message", id);
    }
}