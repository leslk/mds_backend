const Talk = require('../models/talk');
const Message = require('../models/message');
const Protagonist = require('../models/protagonist');
const Universe = require('../models/universe');
const ErrorHandler = require('../models/errorHandler');

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
        const protagonist = await Protagonist.findOne(req.body.id_protagonist);
        const universe = await Universe.findOne(protagonist.id_universe);
        if (!universe) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (universe.id_user !== req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "CREATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const newtalk = new Talk(null, req.body.id_user, req.body.id_protagonist);
        const talk = await newtalk.save();
        return res.status(201).json({talk: talk, message: req.body.message});
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteTalk = async (req, res) => {
    try {
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            const errorHandler = new ErrorHandler(404, "TALK_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != talk.id_user) {
            const errorHandler = new ErrorHandler(401, "DELETE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const messages = await Message.findAll(req.params.id);
        for (let message of messages) {
            await Message.delete(message.id);
        }
        await Talk.delete(req.params.id);
        return res.status(200).json({ message: 'Talk deleted' });
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getTalk = async (req, res) => {
   try {
        const talk = await Talk.findOneWithUniverse(req.params.id, req.body.id_protagonist, req.body.id_user);
        if (talk === null) {
            const errorHandler = new ErrorHandler(404, "TALK_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        return res.status(200).json(talk);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}