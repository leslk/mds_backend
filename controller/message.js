const Message = require('../models/message.js');
const connection = require('../config/database.js').databaseConnection;

exports.createMessage = (req, res) => {
    connection.query(`INSERT INTO messages (date, text, message) VALUES (${req.body.date}, ${req.body.text})`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
    console.log(req.headers)
}

exports.getMessages = (req, res) => {
    connection.query(`SELECT * FROM messages WHERE id_talk = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }); 
}

exports.updateMessage = (req, res) => {
    console.log(req.headers);
}