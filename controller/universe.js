const Universe = require('../models/universe');
const sql = require("mysql2");

exports.getUniverses = async (req, res) => {
    const universes = await Universe.findAll();
    return res.status(200).json(universes);
}

exports.createUniverse = async (req, res) => {
    // Create description thanks to OpenAI
    // get image from stable
    try {
        let universe = new Universe(null, req.body.name, req.body.creatorId, description, imageUrl);
        await universe.save();

        return res.status(201).json({ message: 'Universe created' });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.updateUniverse = (req, res) => {
    try {
        let universe = new Universe(req.params.id, req.body.name, req.body.creatorId, req.body.description, req.body.imageUrl);
        universe.save();
        return res.status(200).json({ message: 'Universe updated' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteUniverse = (req, res) => {
    try {
        Universe.delete(req.params.id);
        return res.status(200).json({ message: 'Universe deleted' });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getUniverses = async (req, res) => {
    try {
        const universes = Universe.findAll();
        return res.status(200).json(universes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getUniverse = async (req, res) => {
    try {
        const universe = Universe.findOne(req.params.id);
        if (universe === null) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        return res.status(200).json(universe);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}