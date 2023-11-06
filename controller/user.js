const User = require('../models/user');
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const {createToken} =  require('../utils/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const userFindInDb = await User.findOneByEmail(req.body.email);
        if (userFindInDb.email === req.body.email) {
            return res.status(409).json({
                error : "EMAIL_ALREADY_EXISTS",
                message : "Email already exists",    
                details : "Email already exists in database"       
           });
        }
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                error : "INVALID_EMAIL",
                message : "Wrong email",    
                details : "Email is incorrect"       
           });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({
                error : "WEAK_PASSWORD",
                message : "Weak password",    
                details : "Password must be at least 8 characters long and includes 1 lowercase, 1 uppercase, 1 special characters and 3 digits"       
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if (!hashedPassword) {
            return res.status(500).json({
                error : "SERVER_ERROR",
                message : "Server error",    
                details : "Password hashing failed"
            });
        }
        let user = new User(null, req.body.pseudo, req.body.email, hashedPassword);
        await user.save();

        return res.status(201).json({ message: 'User created' });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.checkAuth = async (req, res) => {
    const user = await User.findOneByEmail(req.body.email);
    if (!user) {
        return res.status(404).json({
            error : "WRONG_EMAIL",
            message : "Wrong email",    
            details : "Email doesn't match any admin accounts in database"       
       });
    }
    const passwordValidation = await bcrypt.compare(req.body.password, user.password);

    if (!passwordValidation) {
        return res.status(401).json({
            error : "WRONG_PASSWORD",
            message : "Wrong password",    
            details : "Password doesn't match the user password in database"       
        });
    }
    let token;
    try {
        token = await createToken({id: user.id, pseudo: user.pseudo, email: user.email});
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
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
        let user = new User(req.params.id, req.body.pseudo, req.body.email, req.body.password);
        if (decodedToken.id != user.id) {
            return res.status(401).json({
                error : "UPDATE_USER_DATA_ERROR",
                message : "Unauthorized request",
                details : "Only owner of this account can update data"
            });
        }
        await user.save();
        return res.status(200).json({ message: 'User updated' });
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne(req.params.id);
        if (user === null) {
            return res.status(404).json({
                error: "USER_NOT_FOUND_ERROR",
                message: `user with ${req.params.id} id not found in database`
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err
        });
    }
}