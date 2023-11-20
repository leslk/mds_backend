const Universe = require('../models/universe');
const Protagonist = require('../models/protagonist');
const ErrorHandler = require('../models/errorHandler');


exports.createUniverse = async (req, res) => {
    try {
        let universe = new Universe(null, req.body.name, req.body.id_user);
        const imageUrl = universe.setImageUrl();
        console.log(imageUrl);
        universe.setImageUrl(imageUrl);
        await universe.generateDescription();
        const prompt = await universe.generateStablePrompt();
        const response = await universe.save();
        universe.generateImage(prompt, response.id, imageUrl);
        return res.status(201).json(response);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateUniverse = async (req, res) => {
    try {
        const universe = new Universe(req.params.id, req.body.name, req.body.user_id);
        if (!universe) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (universe.id_user !== req.body.id_user) {
            const errorHandler = new ErrorHandler(401, "UPDATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const response = await universe.save();
        return res.status(200).json(response);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != universe.id_user) {
            const errorHandler = new ErrorHandler(401, "DELETE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        for (let protagonist of protagonists) {
            await Protagonist.delete(protagonist.id);
        }
        await Universe.delete(req.params.id);
        return res.status(200).json({ message: 'Universe deleted' });
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUniverses = async (req, res) => {
    try {
        const universes = await Universe.findAll(req.body.id_user);
        return res.status(200).json(universes);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (universe === null) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != universe.id_user) {
            const errorHandler = new ErrorHandler(401, "GET_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        return res.status(200).json(universe);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}