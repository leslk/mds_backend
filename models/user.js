const DbConnector = require("../config/dbConnector");

class User {
    constructor(id, pseudo, email, password) {
        this.id = id
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.universes = [];
    }

    async save() {
        return await DbConnector.saveObject(this);
    }

    toMap() {
        return {
            id: this.id,
            pseudo: this.pseudo,
            email: this.email,
            password: this.password
        }
    }

    static async findOne(id) {
        return await DbConnector.loadObject("user", id);
    }
    static async findOneByEmail(email) {
        return await DbConnector.loadUserByEmail("user", email);
    }
    static async findAll() {
        return await DbConnector.loadObjects("user");
    }
}

module.exports = User;