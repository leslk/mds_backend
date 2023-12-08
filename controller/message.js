const Message = require('../models/message.js');
const Protagonist = require('../models/protagonist.js');
const Universe = require('../models/universe.js');
const Talk = require('../models/talk.js');
const moment = require('moment');
const ErrorHandler = require('../models/errorHandler.js');
const {checkOwnership, decodedToken} = require("../utils/jwt.js");

exports.createMessage = async (req, res) => {
    // Generate message date in format YYYY-MM-DD HH:mm:ss
    const formattedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        // Check if talk exists in db and return an error if not
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            throw new ErrorHandler(404, "TALK_NOT_FOUND");
        }

        // Get protagonist and universe from db
        const protagonist = await Protagonist.findOne(talk.id_protagonist);
        const universe = await Universe.findOne(protagonist.id_universe);

        // Check if user is the owner of the talk, protagonist and universe
        checkOwnership(req.headers.authorization, talk.id_user);
        checkOwnership(req.headers.authorization, protagonist.id_user);
        checkOwnership(req.headers.authorization, universe.id_user);

        // Save message in db
        const userMessage = new Message(null, formattedDate, req.body.text, "user", req.params.id);
        await userMessage.save();

        // Gather all messages of the talk and generate a message from them
        const messageList = await Message.findAll(req.params.id);
        const messageListToSend = [];
        for (let index = 0; index < messageList.length; index++) {
            messageListToSend.push({role: messageList[index].role, content: messageList[index].text});
        }

        // Add prefix to give context to Chat GPT on the universe inside the first message
        const prefix = `Dans le cadre d'un jeu de rôle, l'IA devient le personnage de ${protagonist.name} issu de l'univers de ${universe.name} et répond à l'humain.\n\nVoici la description de ${universe.name}:${universe.description}\n.\n---\n`;
        messageListToSend[0].content = prefix + messageListToSend[0].content;

        // Generate message from message list and save it in db
        const messageText = await Message.generateMessage(messageListToSend);
        const newMessage = await new Message(null, formattedDate, messageText, "assistant", req.params.id).save();

        // Return created message
        return res.status(201).json(newMessage);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getMessages = async (req, res) => {
    try {
        // Check if talk exists in db and return an error if not
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            throw new ErrorHandler(404, "TALK_NOT_FOUND");
        }

        // Check if user is the owner of the talk
        checkOwnership(req.headers.authorization, talk.id_user);

        // Return all messages of the talk
        const messages = await Message.findAll(req.params.id);
        return res.status(200).json(messages);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.updateMessage = async (req, res) => {
    // Generate message date in format YYYY-MM-DD HH:mm:ss
    const formattedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        // Check if talk exists in db and return an error if not
        const talk = await Talk.findOne(req.params.id);
        if (!talk) {
            throw new ErrorHandler(404, "TALK_NOT_FOUND");
        }
        // Find protagonist and universe in db
        const protagonist = await Protagonist.findOne(talk.id_protagonist);
        const universe = await Universe.findOne(protagonist.id_universe);

        // Check if user is the owner of the talk, protagonist and universe
        checkOwnership(req.headers.authorization, talk.id_user);
        checkOwnership(req.headers.authorization, protagonist.id_user);
        checkOwnership(req.headers.authorization, universe.id_user);

        // Get message from db and return an error if list is empty
        const messageList = await Message.findAll(req.params.id);
        if (messageList.length === 0) {
            throw new ErrorHandler(404, "NO_MESSAGE_TO_UPDATE");
        }

        // Get last message from db and return an error if it's not an assistant message
        const lastMessage = messageList.pop();
        if (lastMessage.role != "assistant") {
            throw new ErrorHandler(400, "LAST_MESSAGE_NOT_ASSISTANT");
        }

        // Delete last assistant message from db
        await Message.delete(lastMessage.id);

        // Gather all messages of the talk and generate a message from them
        const messageListToSend = [];
        messageList.forEach(message => {
            messageListToSend.push({role: message.role, content: message.text});
        });

        // Add prefix to give context to Chat GPT on the universe inside the first message
        const prefix = `Dans le cadre d'un jeu de rôle, l'IA devient le personnage de ${protagonist.name} issu de l'univers de ${universe.name} et répond à l'humain.\n\nVoici la description de ${universe.name}:${universe.description}\n.\n---\n`;
        messageListToSend[0].content = prefix + messageListToSend[0].content;

        // Generate message from message list and save it in db
        const newMessage = await Message.generateMessage(messageListToSend);
        const message =  await new Message(null, formattedDate, newMessage, "assistant", req.params.id).save();

        // Return created message
        return res.status(201).json(message);
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}