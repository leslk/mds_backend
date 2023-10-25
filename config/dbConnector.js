class DbConnector {
    constructor() {
        this.connection = require('../config/database').databaseConnection;
    }
    
    async saveObject(object) {
        if (object.id === null) {
            await this.insertObject(object);
        } else {
            this.updateObject(object);
        }
    }

    async insertObject(object) {
        const map = object.toMap();
        Object.keys(map).forEach(key => {
            if (map[key] === null) {
                delete map[key];
            }
        });
        const keys = Object.keys(map);
        const values = Object.values(map).map(value => `'${value}'`);
        const sql = `INSERT INTO ${object.constructor.name} (${keys.join(', ')}) VALUES (${values.join(', ')})`;
        return await this.connection.promise().query(sql).catch(err => {throw err;});
    }

    async updateObject(object) {
        const map = object.toMap();
        const keys = Object.keys(map);
        const values = Object.values(map);
        const updateString = keys.map((key, index) => `${key} = '${values[index]}'`).join(', ');
        const sql = `UPDATE ${object.constructor.name} SET ${updateString} WHERE id = ${object.id}`
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        return obj[0];
    }

    async deleteObject(object) {
        const sql = `DELETE FROM ${object.constructor.name} WHERE id = ${object.id}`;
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        return obj[0];
    }

    async loadObject(className, id) {
        const sql = `SELECT * FROM ${className} WHERE id = ${id}`;
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        if (obj[0].length === 0) {
            return null;
        }
        return obj[0][0];
    }

    async loadUserByEmail(className, email) {
        const sql = `SELECT * FROM ${className} WHERE email = '${email}'`;
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        if (obj[0].length === 0) {
            return null;
        }
        return obj[0][0];
    }
    
    async loadObjects(className) {
        const sql = `SELECT * FROM ${className}`;
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        return obj[0];
    }
}

module.exports = new DbConnector();