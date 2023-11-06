const dbConnector = require('../config/dbConnector.js');
const Message = require('../models/message.js');

exports.createMessage = async (req, res) => {
    const date = new Date().toLocaleString();
    try {
        const talk = await dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({
                error : "TALK_NOT_FOUND",
                message : "Message talk not found",
            });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({
                error : "CREATE_DATA_ERROR",
                message : "Unauthorized request",
            
            });
        }
        const protagonist = await dbConnector.searchObject("protagonist", {id: talk[0].id_protagonist});
        const universe = await dbConnector.searchObject("universe", {id: protagonist[0].id_universe});
        const userMessage = new Message(null, date, req.body.text, "user", req.params.id);
        await userMessage.save();
        const messageList = await dbConnector.searchObject("message", {id_talk: req.params.id});
        const messageListToSend = [];
        for (let index = 0; index < messageList.length; index++) {
            let prefix = "";
            if(index === 0) {
                prefix = `Dans le cadre d'un jeu de rôle, l'IA devient le personnage de ${protagonist[0].name} issu de l'univers de ${universe[0].name} et répond à l'humain.\n\nVoici la description de ${universe[0].name}:${universe[0].description}\n.\n---\n`;
            }
            console.log(prefix)
            messageListToSend.push({role: messageList[index].role, content: prefix + messageList[index].text});
        }
        const messageText = await Message.generateMessage(messageListToSend);
        const newMessage = new Message(null, new Date().toISOString().slice(0, 10), messageText, "assistant", req.params.id);
        await newMessage.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        }); 
    }
}

exports.getMessages = async (req, res) => {
    try {
        dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({
                error : "TALK_NOT_FOUND",
                message : "Message talk not found",
            
            });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({
                error : "GET_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        const messages = await Message.findAll(req.params.id);
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.updateMessage = async (req, res) => {
    const date = new Date().toLocaleString();
    try {
        const talk = dbConnector.searchObject("talk", {id: req.params.id});
        if (!talk) {
            return res.status(404).json({
                error : "TALK_NOT_FOUND",
                message : "Message talk not found",
            });
        }
        if (req.body.id_user != talk.id_user) {
            return res.status(401).json({
                error : "UPDATE_DATA_ERROR",
                message : "Unauthorized request",
            });
        }
        await Message.delete(req.params.messageId);
        const messageList = await dbConnector.searchObject("message", {id_talk: req.params.id});
        const messageListToSend = [];
        messageList.forEach(message => {
            messageListToSend.push({role: message.role, content: message.text});
        });
        const newMessage = await Message.generateMessage(messageListToSend);
        const message = new Message(null, date, newMessage, "assistant", req.params.id);
        message.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}