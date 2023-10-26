const DbConnector = require("../config/dbConnector");

class User {
    constructor(id, pseudo, email, password) {
        this.id = id
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
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

    static fromMap(map){
       let user = new User(map.id, map.pseudo, map.email, map.password);
        return user;
    }

    static async findOne(id) {
        console.log(id);
        const user = await DbConnector.loadObject("user", id);
        if (!user) {
            return user;
        }
        const data = User.fromMap(user);
        return data;
    }

    static async findOneByEmail(email) {
        const user = await DbConnector.loadUserByEmail("user", email);
        const data = User.fromMap(user);
        return data;
    }

    static async findAll() {
        const users = await DbConnector.loadObjects("user");
        const data = [];
        users.forEach(user => {
            data.push(User.fromMap(user));
        });
        return data;
    }
}

module.exports = User;