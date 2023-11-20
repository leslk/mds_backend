const DbConnector = require("./dbConnector");

class MongoDbConnector extends DbConnector {
    static instance = null;
    constructor() {
        super();
        this.connection = require('../database/mongoDbDatabase').databaseConnection;
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new MongoDbConnector();
        }
        return this.instance;
    }
    
    async searchObject(documentName, filter) {
        const obj = await documentName.findOne(filter);
        return obj;
    };
    async saveObject(documentName, object) {
        if (!object.id) {
            return await this.insertObject(object);
        } else {
            return await this.updateObject(documentName, object);
        }
    };
    async insertObject(documentName, object) {
        const obj = new documentName(object);
        const newObj = await obj.save(object);
        return newObj;

    };
    async updateObject(documentName, object) {
        const updatedObj = await documentName.findOneAndUpdate({_id: object._id}, {...object}, {new: true});
        return updatedObj;

    };
    deleteObject(documentName, object) {
        return documentName.deleteOne({_id: object._id});
    };
    loadObject(doucmentName, id) {
        return doucmentName.findOne({_id: id});
    };
    loadObjects(className) {
        return className.find();
    };
}

module.exports = MongoDbConnector;