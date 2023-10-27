const Talk = require('../models/talk');
const Message = require('../models/message');
const DbConnector = require('../config/dbConnector.js');


exports.getTalks = async (req, res) => {
    try {
        const talks = await Talk.findAll(req.body.id_user);
        return res.status(200).json(talks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.createTalk = async (req, res) => {
    try {
        const newtalk = new Talk(null, req.body.id_user, req.body.id_protagonist);
        const talk = await newtalk.save();
        return res.status(201).json({talk: talk, message: message});
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteTalk = async (req, res) => {
    try {
        const talk = await DbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({ error: 'talk not found' });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const messages = await Message.findAll(req.params.id);
        for (let message of messages) {
            await Message.delete(message.id);
        }
        await Talk.delete(req.params.id);
        return res.status(200).json({ message: 'Talk deleted' });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getTalk = async (req, res) => {
   try {
        const talk = await Talk.findOne(req.params.id, req.body.id_protagonist, req.body.id_user);
        if (talk === null) {
            return res.status(404).json({ error: 'Talk not found' });
        }
        return res.status(200).json(talk);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}