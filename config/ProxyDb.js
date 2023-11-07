const DbConnectorFactory = require('./dbConnectorFactory');

class ProxyDb {
    db = null;
    
    loadObjects(className, filter) {
        if (this.db === null) {
            this.db = DbConnectorFactory.createConnector();
        }
        return this.db.loadObjects(className, filter);
    }

    loadObject(className, id) {
        if (this.db === null) {
            this.db = DbConnectorFactory.createConnector();
        }
        return this.db.loadObject(className, id);
    }

    searchObject(className, filter) {
        if (this.db === null) {
            this.db = DbConnectorFactory.createConnector();
        }
        return this.db.searchObject(className, filter);
    }

    saveObject(object) {
        if (this.db === null) {
            this.db = DbConnectorFactory.createConnector();
        }
        return this.db.saveObject(object);
    }

    deleteObject(className, id) {
        if (this.db === null) {
            this.db = DbConnectorFactory.createConnector();

        }
        return this.db.deleteObject(className, id);
    }

    insertObject(object) {
        if (this.db === null) {
            this.db = new DbConnectorFactory.createConnector();
        }
        return this.db.insertObject(object);
    }

}

module.exports = new ProxyDb();

