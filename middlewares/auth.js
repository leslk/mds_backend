
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// Verify authentication
module.exports = async (req, res, next) => {

    try {
        // Decode token
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  
        const userId = decodedToken.userId;
        const user = await findOne(userId);

        if ((user && user._id != tokenUserId) || (req.body.userId && user._id != req.body.userId)) {
            throw {
                "error" : "AUTH_TOKEN_ERROR",
                "message": "Received token is invalid",
                "details" : "Sent token must match an existing user"
            };
        }
        next();
    } catch (error) {
        res.status(401).json( "Received token is invalid");
    }
}