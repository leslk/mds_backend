const Universe = require('../models/universe');
const Protagonist = require('../models/protagonist');
const ErrorHandler = require('../models/errorHandler');
const { validateUniverseName } = require('../utils/universe');


exports.createUniverse = async (req, res) => {
    try {
        // Check validity of universe name and existence of universe with same name
        validateUniverseName(req.body.name);
        const universeInDb = await Universe.findOneByName(req.body.name);
        if (universeInDb && universeInDb.id_user === req.body.id_user) {
            const errorHandler = new ErrorHandler(409, "UNIVERSE_ALREADY_EXISTS");
            return errorHandler.handleErrorResponse(res);
        }
        let universe = new Universe(null, req.body.name, req.body.id_user);
        // Generate imageUrl in order to set it in universe object and store the image when asynchrone operations are done
        const imageUrl = universe.setImageUrl();
        // Generate description and prompt
        await universe.generateDescription();
        const prompt = await universe.generateStablePrompt();
        // Save universe in database
        const response = await universe.save();
        // Generate image and store it
        universe.generateImage(prompt, response.id, imageUrl);
        return res.status(201).json(response);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateUniverse = async (req, res) => {
    try {
        // Find universe in database
        const universeInDb = await Universe.findOne(req.params.id);
        // Check if universe exists
        if (universeInDb === null) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        // Check if user is the owner of the universe
        if (req.body.id_user != universeInDb.id_user) {
            const errorHandler = new ErrorHandler(401, "UNAUTHORIZED_UNIVERSE_UPDATE_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        // If universe description have changed, update it and generate new prompt and image
        // else return universe because the name and image can't be changed by the user
        if (universeInDb.description !== req.body.description) {
            Universe.fromMap(universeInDb);
            universeInDb.setDescription(req.body.description);
            const imageUrl = universeInDb.setImageUrl();
            const prompt = await universeInDb.generateStablePrompt();
            universeInDb.generateImage(prompt, universeInDb.id, imageUrl);
        }
        // Save universe in database and return it
        const response = await universeInDb.save();
        return res.status(200).json(response);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteUniverse = async (req, res) => {
    try {
        // Find universe in database
        const universe = await Universe.findOne(req.params.id);
        // Check if universe exists
        if (!universe) {
            const errorHandler = new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        // Check if user is the owner of the universe
        if (req.body.id_user != universe.id_user) {
            const errorHandler = new ErrorHandler(401, "DELETE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        // Delete universe and its protagonists
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        for (let protagonist of protagonists) {
            await Protagonist.delete(protagonist.id);
        }
        await Universe.delete(req.params.id);
        return res.status(200).json({ message: 'UNIVERSE_AND_PROTAGONISTS_DELETED' });
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