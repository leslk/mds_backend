const DbConnector = require('./dbConnector');

class MySqlConnector extends DbConnector{
    constructor() {
        super();
        this.connection = require('../database/mySqlDatabase').databaseConnection;
    }

    async searchObject(className, filter){
        let suffixFilter = "";
        for (let key in filter) {
            suffixFilter += ` ${key} = '${filter[key]}' AND`;
        }
        const sql = `SELECT * FROM ${className} WHERE ` + suffixFilter.slice(0, -4);
        const obj = await this.connection.promise().query(sql).catch(err => {throw err;});
        return obj[0];
    }
    
    async saveObject(object) {
        if (object.id === null) {
            return await this.insertObject(object);
        } else {
            return await this.updateObject(object);
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
        const values = Object.values(map).map(value => `"${value}"`);
        const sql = `INSERT INTO ${object.constructor.name} (${keys.join(', ')}) VALUES (${values.join(', ')})`;
        try {
            map.id = (await this.connection.promise().query(sql))[0].insertId;
        } catch(err) {
            throw `Error on inserting object ${object.constructor.name} into DB: ${err.message}`;
        }
        return map;

    }

    async updateObject(object) {
        const map = object.toMap();
        Object.keys(map).forEach(key => {
            if (map[key] === undefined) {
                delete map[key];
            }
        });
        const keys = Object.keys(map);
        const values = Object.values(map);
        const updateString = keys.map((key, index) => `${key} = '${values[index]}'`).join(', ');
        const sql = `UPDATE ${object.constructor.name} SET ${updateString} WHERE id = ${object.id}`
        await this.connection.promise().query(sql).catch(err => {throw err;});
        const updatedObject = await this.loadObject(object.constructor.name, object.id);
        return updatedObject;
    }

    async deleteObject(className, id) {
        const obj = await this.loadObject(className, id);
        if (!obj) {
            throw `Object ${className} with id ${id} not found`;
        }
        const sql = `DELETE FROM ${className} WHERE id = ${id}`;
        return await this.connection.promise().query(sql).catch(err => {throw err;});
    }

    async loadObject(className, id) {
        const sql = `SELECT * FROM ${className} WHERE id = ${id}`;
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

module.exports = MySqlConnector;