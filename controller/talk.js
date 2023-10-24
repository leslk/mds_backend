const Talk = require('../models/talk');
const connection = require('../config/database').databaseConnection;



exports.getTalks = (req, res) => {
    connection.query('SELECT * FROM talks', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.createTalk = (req, res) => {
    connection.query(`INSERT INTO talks (id_user, id_character, imageUrl) VALUES (${req.body.id_user}, ${req.body.id_character}, '${req.body.message}')`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.updateTalk = (req, res) => {
    console.log(req.headers);
}

exports.deleteTalk = (req, res) => {
    connection.query(`DELETE FROM talks WHERE id = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.getTalk = (req, res) => {
    connection.query(`SELECT * FROM talks WHERE id = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}