
const User = require("../models/user");
const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
  
        const id = decodedToken.id;
        const user = await User.findOne(id);

        if ((user && user.id != id) || (req.body.userId && user.id != req.body.userId)) {
            throw {
                "error" : "AUTH_TOKEN_ERROR",
                "message": "Received token is invalid",
                "details" : "Sent token must match an existing user"
            };
        }
        next();
    } catch (error) {
        res.status(401).json({
            "error" : "AUTH_TOKEN_ERROR",
            "message": "Received token is invalid"
        });
    }
}