const Talk = require('../models/talk');
const Message = require('../models/message');
const ProxyDb = require('../config/ProxyDb.js');


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
        const protagonist = await ProxyDb.searchObject("protagonist", {id: req.body.id_protagonist});
        const universe = await ProxyDb.searchObject("universe", {id: protagonist[0].id_universe});
        if (!universe) {
            return res.status(404).json({
                error : "UNIVERSE_NOT_FOUND",
                message : "Universe protagonist not found",    
           });
        }
        if (universe[0].id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "CREATE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const newtalk = new Talk(null, req.body.id_user, req.body.id_protagonist);
        const talk = await newtalk.save();
        return res.status(201).json({talk: talk, message: req.body.message});
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteTalk = async (req, res) => {
    try {
        const talk = await ProxyDb.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({
                error : "TALK_NOT_FOUND",
                message : "Talk not found",
            });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({
                error : "DELETE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const messages = await Message.findAll(req.params.id);
        for (let message of messages) {
            await Message.delete(message.id);
        }
        await Talk.delete(req.params.id);
        return res.status(200).json({ message: 'Talk deleted' });
    } catch(err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        
        });
    }
}

exports.getTalk = async (req, res) => {
   try {
        const talk = await Talk.findOne(req.params.id, req.body.id_protagonist, req.body.id_user);
        if (talk === null) {
            return res.status(404).json({
                error : "TALK_NOT_FOUND",
                message : "Talk not found",
            });
        }
        return res.status(200).json(talk);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}