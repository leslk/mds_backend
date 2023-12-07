const jwt = require('jsonwebtoken');
const ErrorHandler = require('../models/errorHandler');

exports.createToken = async (payload) => {
    try {
        const token = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: '24h' }
        );
        return token;
    } catch (err) {
        throw new ErrorHandler(500, "TOKEN_CREATION_ERROR");
    }

}