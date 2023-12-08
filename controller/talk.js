const Talk = require('../models/talk');
const Message = require('../models/message');
const Protagonist = require('../models/protagonist');
const Universe = require('../models/universe');
const ErrorHandler = require('../models/errorHandler');
const {checkOwnership, decodedToken} = require("../utils/jwt");

exports.getTalks = async (req, res) => {
    try {
        // Get user id stored in token
        const userId = decodedToken(req.headers.authorization).id;

        // Return all talks of the user
        const talks = await Talk.findAll(userId);
        return res.status(200).json(talks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.createTalk = async (req, res) => {
    try {
        // Check if protagonist and universe exist
        const protagonist = await Protagonist.findOne(req.body.id_protagonist);
        if (!protagonist) {
            throw new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
        }
        const universe = await Universe.findOne(protagonist.id_universe);
        if (!universe) {
            throw new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
        }

        // Verify that user is the owner of the universe and protagonist
        checkOwnership(req.headers.authorization, universe.id_user);
        checkOwnership(req.headers.authorization, protagonist.id_user);

        // Get user id stored in token and create talk
        const userId = decodedToken(req.headers.authorization).id;
        const newtalk = new Talk(null, userId, req.body.id_protagonist);
        const talk = await newtalk.save();

        // Return created talk
        return res.status(201).json(talk);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteTalk = async (req, res) => {
    try {
        // Find talk in database
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            throw new ErrorHandler(404, "TALK_NOT_FOUND");
        }

        // Check if user is the owner of the talk
        checkOwnership(req.headers.authorization, talk.id_user);

        // Delete talk and its messages
        await Talk.delete(req.params.id);

        // Return success message
        return res.status(200).json({ message: 'TALK_DELETED' });
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getTalk = async (req, res) => {
   try {
        // Get user id stored in token
        const userId = decodedToken(req.headers.authorization).id;

        // Find given talk in db and return an error if not found
        const talkData = await Talk.findOneWithUniverse(req.params.id, userId);
        if (talkData === null) {
            throw new ErrorHandler(404, "TALK_NOT_FOUND");
        }

        // Check if user is the owner of the talk, protagonist and universe
        checkOwnership(req.headers.authorization, talkData.talk.id_user);
        checkOwnership(req.headers.authorization, talkData.protagonist.id_user);
        checkOwnership(req.headers.authorization, talkData.universe.id_user);

        // Return talk data
        return res.status(200).json(talkData);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}