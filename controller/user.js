const User = require('../models/user');
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const {createToken} =  require('../utils/jwt');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
        return res.status(404).json({ error: 'User not found' });
    }
    const passwordValidation = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValidation) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    let token;
    try {
        token = await createToken({email: req.body.email});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
        userId: user.id,
        token: token
    });
}

exports.updateUser= async (req, res) => {
    // have to check if user is the same as the one in the token
    try {
        let user = new User(req.params.id, req.body.pseudo, req.body.email, req.body.password);
        await user.save();
        return res.status(200).json({ message: 'User updated' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getUser = async (req, res) => {
    const user = await User.findOne(req.params.id);
    if (user === null) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
}

exports.getUsers = async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json(users);
}