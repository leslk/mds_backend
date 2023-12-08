const User = require('../models/user');
const {createToken} =  require('../utils/jwt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../models/errorHandler');
const userUtils = require('../utils/user');

exports.createUser = async (req, res) => {
    try {
        // Validate given data
        await userUtils.validatePseudo(req.body.pseudo);
        await userUtils.validateEmail(req.body.email);
        userUtils.validatePassword(req.body.password);
        const hashedPassword = await userUtils.hashPassword(req.body.password);

        // Create user
        let user = new User(null, req.body.pseudo, req.body.email, hashedPassword);
        await user.save();
        return res.status(201).json({ message: 'USER_CREATED' });
    } catch(err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.checkPseudoAvailability = async (req, res) => {
    try {
        // Helps front to know if the given pseudo is available or not
        const user = await User.findOneByPseudo(req.body.pseudo);
    
        if (user) {
            throw new ErrorHandler(409, "PSEUDO_ALREADY_EXISTS");
        }
    
        return res.status(200).json({ message: 'Pseudo available' });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.checkAuth = async (req, res) => {
    try {
        // Check password and get user by email
        await userUtils.checkPassword(req.body.email, req.body.password);
        const user = await User.findOneByEmail(req.body.email)
        if (!user) {
            throw new ErrorHandler(404, "WRONG_EMAIL");
        }

        // Generate token and send user data to front
        const token = await createToken({id: user.id, pseudo: user.pseudo, email: user.email});
        return res.status(200).json({
            user: {
                id: user.id,
                pseudo: user.pseudo,
                email: user.email
            },
            token: token
        });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }

    
}

exports.updateUser= async (req, res) => {
    try {
        // Check if token is valid and if user is the owner of the account
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
        if (decodedToken.id != req.params.id) {
            throw new ErrorHandler(401, "UPDATE_USER_DATA_ERROR");
        }

        // Get user from db to check and update user data object
        let user = await User.findOne(req.params.id);
        if (!user) {
            throw new ErrorHandler(404, "USER_NOT_FOUND");
        }

        if (user.pseudo !== req.body.pseudo) {
            await userUtils.validatePseudo(req.body.pseudo);
            user.pseudo = req.body.pseudo;
        }

        if (user.email !== req.body.email) {
            await userUtils.validateEmail(req.body.email);
            user.email = req.body.email;
        }

        if (req.body.newPassword) {
            if (!req.body.oldPassword) {
                throw new ErrorHandler(400, "OLD_PASSWORD_REQUIRED");
            }
            await userUtils.checkPassword(user.email, req.body.oldPassword);
            userUtils.validatePassword(req.body.newPassword);
            const hashedPassword = await userUtils.hashPassword(req.body.newPassword);
            user.password = hashedPassword;
        }

        // Save updated user in db
        await user.save();
        return res.status(200).json({ message: 'USER_UPDATED' });
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne(req.params.id);
        if (user === null) {
            throw new ErrorHandler(404, "USER_NOT_FOUND");
        }

        // Delete password from user object before sending it to front
        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        // Delete password from all user objects before sending it to front
        users.forEach(user => {
            delete user.password;
        })
        return res.status(200).json(users);
    } catch (err) {
        const errorHandler = new ErrorHandler(err.status, err.message);
        return errorHandler.handleErrorResponse(res);
    }
}