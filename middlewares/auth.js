
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../models/errorHandler");


module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
  
        const id = decodedToken.id;
        const user = await User.findOne(id);

        if ((user && user.id != id) || (req.body.userId && user.id != req.body.userId)) {
            throw {
                status: 401,
                message: "Received token is invalid"
            };
        }
        next();
    } catch (error) {
        const errorHandler = new ErrorHandler(error.status, error.message);
        return errorHandler.handleErrorResponse(res);
    }
}