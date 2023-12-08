
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../models/errorHandler");


module.exports = async (req, res, next) => {

    try {
        if (!req.headers.authorization) throw { status: 401, message: "UNAUTHORIZED_REQUEST" };
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
  
        const id = decodedToken.id;
        const user = await User.findOne(id);

        if ((user && user.id != id) || (req.body.id_user && user.id != req.body.id_user)) {
            throw {
                status: 401,
                message: "TOKEN_ID_NOT_MATCHING_USER_ID"
            };
        }
        next();
    } catch (error) {
        const errorHandler = new ErrorHandler(error.status, error.message);
        return errorHandler.handleErrorResponse(res);
    }
}