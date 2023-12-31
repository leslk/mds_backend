const ProxyDb = require('../config/ProxyDb');
const Protagonist = require('./protagonist');
const Universe = require('./universe');
const Message = require('./message');


class Talk {
    constructor(id, id_user, id_protagonist) {
        this.id = id;
        this.id_user = id_user;
        this.id_protagonist = id_protagonist;
    }

    toMap() {
        return {
            id: this.id,
            id_user: this.id_user,
            id_protagonist: this.id_protagonist
        }
    }

    static fromMap(map) {
        let talk = new Talk(map.id, map.id_user, map.id_protagonist);
        return talk;
    }
    
    async save() {
        return await ProxyDb.saveObject(this);
    }

    static async findOneWithUniverse(id, userId) {
        const talkData = await ProxyDb.searchObject("talk", {id: id});
        const talk = Talk.fromMap(talkData[0]);
        const characterData = await ProxyDb.searchObject("protagonist", {id: talk.id_protagonist, id_user: userId});
        const protagonist = characterData[0];
        const universeData = await ProxyDb.searchObject("universe", {id: protagonist.id_universe, id_user: userId});
        const universe = Universe.fromMap(universeData[0]);
        const data = {
            talk: talk,
            protagonist: protagonist,
            universe: universe
        }
        return data;
    }

    static async findOne(id) {
        const talkData = await ProxyDb.searchObject("talk", {id: id});
        const talk = Talk.fromMap(talkData[0]);
        return talk;
    }

    static async findOneByProtagonist(id) {
        const talkData = await ProxyDb.searchObject("talk", {id_protagonist: id});
        const talk = Talk.fromMap(talkData[0]);
        return talk;
    }
    
    static async findUniverseId(talkData) {
        const data = [];
        await Promise.all(talkData.map( async (talk) => {
            const protagonist = await ProxyDb.searchObject("protagonist", {id: talk.id_protagonist});
            if (protagonist[0] && protagonist[0].id_universe) {
                const universe = await ProxyDb.searchObject("universe", {id: protagonist[0].id_universe});
                talk["id_universe"] = universe[0].id;
                data.push(talk);
            }
        })); 
        return data;
    }

    static async findAll(userId) {
        const talkData = await ProxyDb.searchObject("talk", {id_user: userId});
        const response = await Talk.findUniverseId(talkData);
        return response;
    }


    static async delete(id) {
        const messages = await Message.findAll(id);
        for (let message of messages) {
            await Message.delete(message.id);
        }
        return await ProxyDb.deleteObject("talk", id);
    }
}

module.exports = Talk;