const Talk = require('../models/talk');
const connection = require('../config/database').databaseConnection;



exports.getTalks = (req, res) => {
    try {
        const talks = Talk.findAll();
        return res.status(200).json(talks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
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

exports.deleteTalk = (req, res) => {
    try {
        Talk.delete(req.params.id);
        return res.status(200).json({ message: 'Talk deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getTalk = (req, res) => {
   try {
        const talk = Talk.findOne(req.params.id);
        if (talk === null) {
            return res.status(404).json({ error: 'Talk not found' });
        }
        return res.status(200).json(talk);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}