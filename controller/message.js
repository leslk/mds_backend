const dbConnector = require('../config/dbConnector.js');
const Message = require('../models/message.js');

exports.createMessage = async (req, res) => {
    try {
        dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({ error: 'talk not found' });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userMessage = new Message(null, new Date().toISOString().slice(0, 10), req.body.text, "user", req.params.id);
        await userMessage.save();
        const messageList = await dbConnector.searchObject("message", {id_talk: req.params.id});
        messageList.sort((a, b) => a.date - b.date);
        const messageListToSend = [];
        messageList.forEach(message => {
            messageListToSend.push({role: message.role, content: message.text});
        });
        const newMessage = await Message.generateMessage(messageListToSend);
        const message = new Message(null, new Date().toISOString().slice(0, 10), newMessage, "assistant", req.params.id);
        message.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getMessages = async (req, res) => {
    try {
        dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({ error: 'talk not found' });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const messages = await Message.findAll(req.params.id);
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.updateMessage = async (req, res) => {
    try {
        dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({ error: 'talk not found' });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await Message.delete(req.params.messageId);
        const messageList = await dbConnector.searchObject("message", {id_talk: req.params.id});
        messageList.sort((a, b) => a.date - b.date);
        const messageListToSend = [];
        messageList.forEach(message => {
            messageListToSend.push({role: message.role, content: message.text});
        });
        const newMessage = await Message.generateMessage(messageListToSend);
        const message = new Message(null, new Date().toISOString().slice(0, 10), newMessage, "assistant", req.params.id);
        message.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}