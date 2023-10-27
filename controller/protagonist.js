const Universe = require('../models/universe.js');
const Protagonist = require('../models/protagonist.js');

exports.getProtagonists = async (req, res) => {
    try {
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
            return res.status(404).json({ error: 'Universe not found' });
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
            return res.status(404).json({ error: 'protagonist not found' });
        }
        if (protagonist.id_user !== req.body.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let newProtagonist = new Protagonist(req.params.protagonistId, req.body?.name, req.body?.description, req.body?.imageUrl, req.body?.id_user, req.params.protagonistId);
        const response = await newProtagonist.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOne(req.params.protagonistId);
        if (!protagonist) {
            return res.status(404).json({ error: 'protagonist not found' });
        }
        if (protagonist.id_user !== req.body.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        Protagonist.delete(req.params.protagonistId);
        return res.status(200).json({ message: 'Protagonist deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getProtagonist = async (req, res) => {
    try {
        const protagonist = await Protagonist.findOneByUniverseAndUser(req.params.id, req.params.protagonistId, req.body.id_user);
        if (!protagonist) {
            return res.status(404).json({ error: 'Protagonist not found' });
        }
        return res.status(200).json(protagonist);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}