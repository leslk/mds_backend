const Character = require('../models/character.js');
const connection = require('../config/database.js').databaseConnection;

exports.getCharacters = (req, res) => {
    connection.query('SELECT * FROM characters', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.createCharacter = (req, res) => {
    connection.query(`INSERT INTO characters (id_univers, name, imageUrl, description) VALUES (${req.body.id_univers}, '${req.body.name}', '${req.body.imageUrl}', '${req.body.description}')`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.updateCharacter = (req, res) => {
    console.log(req);
}

exports.deleteCharacter = (req, res) => {
    connection.query(`DELETE FROM characters WHERE id = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.getCharacter = (req, res) => {
    connection.query(`SELECT * FROM character c LEFT JOIN protagonist p ON p.id_univers = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}