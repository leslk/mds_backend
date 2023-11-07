const ProxyDb = require('../config/ProxyDb');
const OpenAi = require('./openAi');

class Message {
    constructor(id, date, text, role, id_talk, ) {
        this.id = id;
        this.date = date;
        this.text = text;
        this.role = role;
        this.id_talk = id_talk;

    }

    toMap() {
        return {
            id: this.id,
            date: this.date,
            text: this.text,
            role: this.role,
            id_talk: this.id_talk
        }
    }

    static fromMap(map) {
        let message = new Message(map.id, map.date, map.text, map.role, map.id_talk);
        return message;
    }

    async save() {
        return await ProxyDb.saveObject(this);
    }

    static async findAll(id) {
        const messages = await ProxyDb.searchObject("message", {id_talk: id});
        const data = [];
        messages.forEach(message => {
            data.push(Message.fromMap(message));
        });
        return data;
    }

    static async generateMessage(messages) {
        const newMessage = await OpenAi.generateMessage(messages);
        return newMessage;
    }

    static async delete(id) {
        return await ProxyDb.deleteObject("message", id);
    }
}

module.exports = Message;