const Universe = require('../models/universe.js');
const Protagonist = require('../models/protagonist.js');
const ErrorHandler = require('../models/errorHandler.js');

exports.getProtagonists = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (universe.id_user !== req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "GET_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        return res.status(200).json(protagonists);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.createProtagonist = async (req, res) => {
    try {
        const protagonist = new Protagonist(null, req.body.name, null, null, req.params.id, req.body.id_user);
        const imageUrl = protagonist.setImageUrl();
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (universe.id_user != req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "CREATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        await protagonist.generateDescription(protagonist, universe);
        const prompt = await protagonist.generateStablePrompt(protagonist);
        const response = await protagonist.save();
        protagonist.generateImage(prompt, response.id, imageUrl);
        return res.status(201).json(response);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (protagonist === null) {
            const errorHandler = new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (protagonist.id_user != req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "UPDATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const newProtagonist = new Protagonist(req.params.protagonistId, req.body?.name, req.body?.description, req.body?.imageUrl);
        const response = await newProtagonist.save();
        return res.status(200).json(response);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (!protagonist) {
            const errorHandler = new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (protagonist.id_user !== req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "DELETE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        Protagonist.delete(req.params.protagonistId);
        return res.status(200).json({ message: 'Protagonist deleted' });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOneByUniverseAndUser(req.params.id, req.params.protagonistId, req.body.id_user);
        if (!protagonist) {
            const errorHandler = new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        return res.status(200).json(protagonist);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}