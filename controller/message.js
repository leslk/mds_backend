const Message = require('../models/message.js');
const Protagonist = require('../models/protagonist.js');
const Universe = require('../models/universe.js');
const Talk = require('../models/talk.js');
const moment = require('moment');
const ErrorHandler = require('../models/errorHandler.js');

exports.createMessage = async (req, res) => {
    const formattedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            const errorHandler = new ErrorHandler(404, "TALK_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != talk.id_user) {
            const errorHandler = new ErrorHandler(401, "CREATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const protagonist = await Protagonist.findOne(talk.id_protagonist);
        const universe = await Universe.findOne(protagonist.id_universe);
        const userMessage = new Message(null, formattedDate, req.body.text, "user", req.params.id);
        await userMessage.save();
        const messageList = await Message.findAll(req.params.id);
        const messageListToSend = [];
        for (let index = 0; index < messageList.length; index++) {
            let prefix = "";
            if(index === 0) {
                prefix = `Dans le cadre d'un jeu de rôle, l'IA devient le personnage de ${protagonist.name} issu de l'univers de ${universe.name} et répond à l'humain.\n\nVoici la description de ${universe.name}:${universe.description}\n.\n---\n`;
            }
            messageListToSend.push({role: messageList[index].role, content: prefix + messageList[index].text});
        }
        const messageText = await Message.generateMessage(messageListToSend);
        const newMessage = new Message(null, formattedDate, messageText, "assistant", req.params.id);
        await newMessage.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const talk = Talk.findOne(req.params.id);
        if (!talk) {
            const errorHandler = new ErrorHandler(404, "TALK_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != talk.id_user) {
            const errorHandler = new ErrorHandler(401, "GET_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        const messages = await Message.findAll(req.params.id);
        return res.status(200).json(messages);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateMessage = async (req, res) => {
    const formattedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        const talk = Talk.findOne(req.params.id);
        if (!talk) {
            const errorHandler = new ErrorHandler(404, "TALK_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.id_user != talk.id_user) {
            const errorHandler = new ErrorHandler(401, "UPDATE_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        await Message.delete(req.params.messageId);
        const messageList = await Message.findAll(req.params.id);
        const messageListToSend = [];
        messageList.forEach(message => {
            messageListToSend.push({role: message.role, content: message.text});
        });
        const newMessage = await Message.generateMessage(messageListToSend);
        const message = new Message(null, formattedDate, newMessage, "assistant", req.params.id);
        message.save();
        return res.status(201).json(newMessage);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}