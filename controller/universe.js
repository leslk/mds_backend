const Universe = require('../models/universe');
const Protagonist = require('../models/protagonist');
const User = require('../models/user');

exports.createUniverse = async (req, res) => {
    try {
        let universe = new Universe(null, req.body.name, req.body.id_user);
        await universe.generateDescription(this.name);
        const prompt = await universe.generateStablePrompt(universe);
        await universe.generateImage(prompt);
        await universe.save();
        return res.status(201).json({ message: 'Universe created' });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.updateUniverse = (req, res) => {
    try {
        const universe = new Universe(req.params.id, req.body.name, req.body.user_id);
        if (!universe) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        if (universe.id_user !== req.body.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        universe.save();
        return res.status(200).json({ message: 'Universe updated' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (!universe) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        if (req.body.id_user != universe.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const protagonists = await Protagonist.findAllByUniverseAndUser(req.params.id, req.body.id_user);
        console.log(protagonists);
        for (let protagonist of protagonists) {
            await Protagonist.delete(protagonist.id);
        }
        await Universe.delete(req.params.id);
        return res.status(200).json({ message: 'Universe deleted' });
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getUniverses = async (req, res) => {
    try {
        const universes = await Universe.findAll(req.body.id_user);
        return res.status(200).json(universes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getUniverse = async (req, res) => {
    try {
        const universe = await Universe.findOne(req.params.id);
        if (universe === null) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        if (req.body.id_user != universe.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(200).json(universe);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}