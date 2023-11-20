const User = require('../models/user');
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const {createToken} =  require('../utils/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../models/errorHandler');

exports.createUser = async (req, res) => {
    try {
        const userFindInDb = await User.findOneByEmail(req.body.email);
        if (userFindInDb.email === req.body.email) {
            const errorHandler = new ErrorHandler(409, "EMAIL_ALREADY_EXISTS");
             return errorHandler.handleErrorResponse(res);
            return;
        }
        if (!emailRegex.test(req.body.email)) {
            const errorHandler = new ErrorHandler(400, "INVALID_EMAIL");
             return errorHandler.handleErrorResponse(res);
            return;
        }
        if (req.body.password.length < 8) {
            const errorHandler = new ErrorHandler(400, "WEAK_PASSWORD");
             return errorHandler.handleErrorResponse(res);
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if (!hashedPassword) {
            const errorHandler = new ErrorHandler(500, "SERVER_ERROR_WHILE_HASHING_PASSWORD");
             return errorHandler.handleErrorResponse(res);
            return;
        }
        let user = new User(null, req.body.pseudo, req.body.email, hashedPassword);
        await user.save();
        return res.status(201).json({ message: 'User created' });

    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
         return errorHandler.handleErrorResponse(res);
    }
}

exports.checkAuth = async (req, res) => {
    const user = await User.findOneByEmail(req.body.email);
    if (!user) {
        const errorHandler = new ErrorHandler(404, "WRONG_EMAIL");
         return errorHandler.handleErrorResponse(res);
        return;
    }
    const passwordValidation = await bcrypt.compare(req.body.password, user.password);

    if (!passwordValidation) {
        const errorHandler = new ErrorHandler(401, "WRONG_PASSWORD");
         return errorHandler.handleErrorResponse(res);
        return;
    }
    let token;
    try {
        token = await createToken({id: user.id, pseudo: user.pseudo, email: user.email});
    } catch (err) {
        const errorHandler = new ErrorHandler(500, "SERVER_ERROR_WHILE_CREATING_TOKEN");
         return errorHandler.handleErrorResponse(res);
    }

    return res.status(200).json({
        user: {
            id: user.id,
            pseudo: user.pseudo,
            email: user.email
        },
        token: token
    });
}

exports.updateUser= async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
        if (decodedToken.id != req.params.id) {
            const errorHandler = new ErrorHandler(401, "UPDATE_USER_DATA_ERROR");
            return errorHandler.handleErrorResponse(res);
        }
        if (!emailRegex.test(req.body.email)) {
            const errorHandler = new ErrorHandler(400, "INVALID_EMAIL");
            return errorHandler.handleErrorResponse(res);
        }
        if (req.body.password.length < 8) {
            const errorHandler = new ErrorHandler(400, "WEAK_PASSWORD");
            return errorHandler.handleErrorResponse(res);
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if (!hashedPassword) {
            const errorHandler = new ErrorHandler(500, "SERVER_ERROR_WHILE_HASHING_PASSWORD");
            return errorHandler.handleErrorResponse(res);
        }
        let user = new User(req.params.id, req.body.pseudo, req.body.email, hashedPassword);
        await user.save();
        return res.status(200).json({ message: 'User updated' });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne(req.params.id);
        if (user === null) {
            const errorHandler = new ErrorHandler(404, "USER_NOT_FOUND");
            return errorHandler.handleErrorResponse(res);
        }
        return res.status(200).json(user);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
         return errorHandler.handleErrorResponse(res);
    }
}