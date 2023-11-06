const Universe = require('../models/universe.js');
const Protagonist = require('../models/protagonist.js');

exports.getProtagonists = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (universe.id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "GET_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        return res.status(200).json(protagonists);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.createProtagonist = async (req, res) => {
    try {
        const protagonist = new Protagonist(null, req.body.name, null, null, req.params.id, req.body.id_user);
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            return res.status(404).json({
                error : "UNIVERSE_NOT_FOUND",
                message : "Universe protagonist not found",    
           });
        }
        if (universe.id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "CREATE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        await protagonist.generateDescription(protagonist, universe);
        const prompt = await protagonist.generateStablePrompt(protagonist);
        protagonist.generateImage(prompt);
        const response = await protagonist.save();
        return res.status(201).json(response);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.updateProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (protagonist === null) {
            return res.status(404).json({
                error : "PROTAGONIST_NOT_FOUND",
                message : "protagonist not found",    
           });
        }
        if (protagonist.id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "UPDATE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const newProtagonist = new Protagonist(req.params.protagonistId, req.body?.name, req.body?.description, req.body?.imageUrl);
        const response = await newProtagonist.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.deleteProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (!protagonist) {
            return res.status(404).json({
                error : "PROTAGONIST_NOT_FOUND",
                message : "protagonist not found",
            });
        }
        if (protagonist.id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "DELETE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        Protagonist.delete(req.params.protagonistId);
        return res.status(200).json({ message: 'Protagonist deleted' });
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.getProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOneByUniverseAndUser(req.params.id, req.params.protagonistId, req.body.id_user);
        if (!protagonist) {
            return res.status(404).json({
                error : "PROTAGONIST_NOT_FOUND",
                message : "protagonist not found",
            
            });
        }
        return res.status(200).json(protagonist);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}