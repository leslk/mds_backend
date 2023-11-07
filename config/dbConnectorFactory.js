const MysqlConnector = require('./connector/mySqlConnector');
const MongoDbConnector = require('./connector/mongoDbConnector');

class DbConnectorFactory {

    static createConnector() {
        let dbConnector = null;

        switch (process.env.DB_TYPE) {
            case 'mysql':
                dbConnector = new MysqlConnector();
                break;
            case 'mongodb':
                dbConnector = new MongoDbConnector();
                break;
            default:
                throw new Error('DB_TYPE not defined');
        }

        return dbConnector;
    }
}

module.exports = DbConnectorFactory;