const Character = require('../models/character.js');

exports.getCharacters = async (req, res) => {
    try {
        const characters = Character.findOne(req.params.id)
        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.createCharacter = (req, res) => {
    // Create description thanks to OpenAI
    // get image from stable
    try {
        const character = new Character(null, req.body.name, description, imageUrl);
        character.save();
        return res.status(201).json({ message: 'Character created' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.updateCharacter = (req, res) => {
    try {
        let character = new Character(req.params.id, req.body.name, req.body.creatorId, req.body.description, req.body.imageUrl);
        character.save();
        return res.status(200).json({ message: 'Universe updated' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteCharacter = (req, res) => {
    try {
        Character.delete(req.params.id);
        return res.status(200).json({ message: 'Universe deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getCharacter = (req, res) => {
    try {
        const character = Character.findOne(req.params.id);
        if (character === null) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        return res.status(200).json(character);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}