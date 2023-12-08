const Universe = require('../models/universe.js');
const Protagonist = require('../models/protagonist.js');
const ErrorHandler = require('../models/errorHandler.js');
const {checkOwnership, decodedToken} = require("../utils/jwt.js");
const { validateProtagonistName } = require('../utils/protagonist.js');


exports.getProtagonists = async (req, res) => {
    try {
        // Check if universe exists
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            throw new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
        }
        // Get userId from token to search protagonists by universe id and user id
        const userId = decodedToken(req.headers.authorization).id;
        // Check if user is the owner of the universe
        checkOwnership(req.headers.authorization, universe.id_user);
        // Get protagonists by universe id and user id
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, userId);
        return res.status(200).json(protagonists);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.createProtagonist = async (req, res) => {
    try {
        // Check if universe exists
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            throw new ErrorHandler(404, "UNIVERSE_NOT_FOUND");
        }
        // Check if user is the owner of the universe
        checkOwnership(req.headers.authorization, universe.id_user);
         // Check validity of universe name and existence of protagonist with same name
         validateProtagonistName(req.body.name);
         // Get userId from token to check existence of protagonist and insert it in protagonist object
        const userId = decodedToken(req.headers.authorization).id;
        const protagonistInDb = await Protagonist.findOneByName(req.body.name);
        if (protagonistInDb && protagonistInDb.id_user === userId && protagonistInDb.id_universe == req.params.id) {
            throw new ErrorHandler(409, "PROTAGONIST_ALREADY_EXISTS");
        }
        const protagonist = new Protagonist(null, req.body.name, null, null, req.params.id, userId);
        // Generate imageUrl in order to set it in protagonist object and store the image when asynchrone operations are done
        const imageUrl = protagonist.setImageUrl();
        // Generate description and prompt
        await protagonist.generateDescription(universe);
        const prompt = await protagonist.generateStablePrompt(protagonist);
        // Save protagonist in database
        const response = await protagonist.save();
        // Generate image and store it
        protagonist.generateImage(prompt, response.id, imageUrl);
        return res.status(201).json(response);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateProtagonist = async (req, res) => {
    try {
        // Find protagonist in database
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (protagonist === null) {
            throw new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
        }
        // Find protagonist's universe in database
        const universe = await Universe.findOne(protagonist.id_universe);
        // Check if user is the owner of the universe and the protagonist
        checkOwnership(req.headers.authorization, universe.id_user);
        checkOwnership(req.headers.authorization, protagonist.id_user);
        // If protagonist description have changed, update it and generate new prompt and image
        // else return protagonist because the name and image can't be changed by the user
        if (req.body.description && protagonist.description !== req.body.description) {
            Protagonist.fromMap(protagonist);
            protagonist.setDescription(req.body.description);
            await protagonist.deleteImage();
            const imageUrl = protagonist.setImageUrl();
            const prompt = await protagonist.generateStablePrompt(universe);
            protagonist.generateImage(prompt, protagonist.id, imageUrl);
        }
        // Save protagonist in database and return it
        const response = await protagonist.save();
        return res.status(200).json(response);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.deleteProtagonist = async (req, res) => {
    try {
        // Find protagonist in database
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (!protagonist) {
            throw new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
        }
        // Find protagonist's universe in database
        const universe = await Universe.findOne(protagonist.id_universe);
        // Check if user is the owner of the universe and the protagonist
        console.log(req.headers.authorization);
        checkOwnership(req.headers.authorization, universe.id_user);
        checkOwnership(req.headers.authorization, protagonist.id_user);
        // Delete protagonist
        await Protagonist.fromMap(protagonist).delete();
        return res.status(200).json({ message: 'PROTAGONIST_DELETED' });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getProtagonist = async (req, res) => {
    try {
        // Get userId from token to search protagonist by universe id, user id ant its id
        const userId = decodedToken(req.headers.authorization).id;
        const protagonist = await Protagonist.findOneByUniverseAndUser(req.params.id, req.params.protagonistId, userId);
        if (!protagonist) {
            throw new ErrorHandler(404, "PROTAGONIST_NOT_FOUND");
        }
        return res.status(200).json(protagonist);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}