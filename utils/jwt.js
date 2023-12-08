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

exports.decodedToken = (token) => {
    //console.log(token);
    const splittedToken = token.split(" ")[1];
    const decodedToken = jwt.verify(splittedToken, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
    return decodedToken;
} 

exports.checkOwnership = (token, id) => {
    console.log(`token: ${token}, id: ${id}`);
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET, { algorithm: 'HS256' });
    if (decodedToken.id != id) {
        throw new ErrorHandler(401, "UNAUTHORIZED_REQUEST_TOKEN_ERROR");
    }
}

