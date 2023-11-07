const Universe = require('../models/universe');
const Protagonist = require('../models/protagonist');

exports.createUniverse = async (req, res) => {
    try {
        let universe = new Universe(null, req.body.name, req.body.id_user);
        const imageName = Math.random().toString(36);
        const imageUrl = process.env.HOST + `/images/${this.constructor.name.toLocaleLowerCase()}/${this.constructor.name.toLocaleLowerCase()}_${imageName}.png`;
        universe.setImageUrl(imageUrl);
        await universe.generateDescription();
        const prompt = await universe.generateStablePrompt();
        const response = await universe.save();
        universe.generateImage(prompt, response.id);
        return res.status(201).json(response);
    } catch(err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.updateUniverse = async (req, res) => {
    try {
        const universe = new Universe(req.params.id, req.body.name, req.body.user_id);
        if (!universe) {
            return res.status(404).json({
                error : "UNIVERSE_NOT_FOUND",
                message : "Universe not found",    
           });
        }
        if (universe.id_user !== req.body.id_user) {
            return res.status(401).json({
                error : "UPDATE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const response = await universe.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.deleteUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            return res.status(404).json({
                error : "UNIVERSE_NOT_FOUND",
                message : "Universe not found",    
           });
        }
        if (req.body.id_user != universe.id_user) {
            return res.status(401).json({
                error : "DELETE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        for (let protagonist of protagonists) {
            await Protagonist.delete(protagonist.id);
        }
        await Universe.delete(req.params.id);
        return res.status(200).json({ message: 'Universe deleted' });
    } catch(err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.getUniverses = async (req, res) => {
    try {
        const universes = await Universe.findAll(req.body.id_user);
        return res.status(200).json(universes);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.getUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (universe === null) {
            return res.status(404).json({
                error : "UNIVERSE_NOT_FOUND",
                message : "Universe not found",    
           });
        }
        if (req.body.id_user != universe.id_user) {
            return res.status(401).json({
                error : "DELETE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        return res.status(200).json(universe);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}